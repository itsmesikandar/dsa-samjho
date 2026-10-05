import type { ArrayPanel, ArrPointer, CallNode, Cell, Frame, ListPanel, RecursionPanel, Tone } from './types';

export const MAX_FRAMES = 400;

interface SpecBase {
  name: string;
  label: string;
  hint?: string;
}
export interface IntSpec extends SpecBase {
  type: 'int';
  default: number;
  min: number;
  max: number;
}
export interface IntArraySpec extends SpecBase {
  type: 'intArray';
  default: number[];
  minLen: number;
  maxLen: number;
  min: number;
  max: number;
  sorted?: boolean;
  distinct?: boolean;
}
export interface StringSpec extends SpecBase {
  type: 'string';
  default: string;
  minLen: number;
  maxLen: number;
  /** allowed characters (default: a-z) */
  charset?: string;
}
export interface IntGridSpec extends SpecBase {
  type: 'intGrid';
  default: number[][];
  maxRows: number;
  maxCols: number;
  min: number;
  max: number;
}
export interface CharGridSpec extends SpecBase {
  type: 'charGrid';
  default: string[];
  maxRows: number;
  maxCols: number;
  charset: string;
}
export interface EdgesSpec extends SpecBase {
  type: 'edges';
  /** [u, v] or [u, v, w] */
  default: number[][];
  /** node ids are 0..nodes-1 */
  nodes: number;
  maxEdges: number;
  weighted?: boolean;
  minW?: number;
  maxW?: number;
}
export type InputSpec = IntSpec | IntArraySpec | StringSpec | IntGridSpec | CharGridSpec | EdgesSpec;
export type InputValues = Record<string, unknown>;

export class Recorder {
  readonly frames: Frame[] = [];
  frame(f: Frame): void {
    if (this.frames.length >= MAX_FRAMES) throw new FrameLimitError();
    this.frames.push(structuredClone(f));
  }
}

export interface Tracer<I = any> {
  inputs: InputSpec[];
  /** extra validation across inputs; return Hinglish error or null */
  check?: (input: I) => string | null;
  /** records frames; returns final result (must match first line of program output) */
  run: (input: I, t: Recorder) => string;
}

export function tracer<I>(def: Tracer<I>): Tracer<I> {
  return def;
}

export const isTracer = (v: unknown): v is Tracer =>
  typeof v === 'object' && v !== null && Array.isArray((v as Tracer).inputs) && typeof (v as Tracer).run === 'function';

export class FrameLimitError extends Error {
  constructor() {
    super(`Bahut zyada steps (${MAX_FRAMES}+) ho gaye. Chhota input try karo.`);
  }
}

export interface RunResult {
  frames: Frame[];
  result?: string;
  error?: string;
}

export function runTracer(def: Tracer, input: InputValues): RunResult {
  const rec = new Recorder();
  try {
    return { frames: rec.frames, result: def.run(input, rec) };
  } catch (e) {
    if (e instanceof FrameLimitError) return { frames: rec.frames, error: e.message };
    throw e;
  }
}

// ---------- helpers for tracer authors ----------

type PointerInput = Record<string, number | null | undefined> | ArrPointer[];
export function array(
  values: Cell[],
  opts: Omit<ArrayPanel, 'kind' | 'values' | 'pointers'> & { pointers?: PointerInput } = {},
): ArrayPanel {
  const { pointers, ...rest } = opts;
  const list = Array.isArray(pointers)
    ? pointers
    : pointers
      ? Object.entries(pointers)
          .filter((e): e is [string, number] => typeof e[1] === 'number')
          .map(([name, index]) => ({ name, index }))
      : undefined;
  return { kind: 'array', ...rest, values: [...values], pointers: list };
}

/** same format as Kotlin contentToString() / Java Arrays.toString(): [1, 2, 3] */
export const listStr = (a: readonly unknown[]) => `[${a.join(', ')}]`;

export const ids = (n: number, prefix = 'e') => Array.from({ length: n }, (_, i) => `${prefix}${i}`);

export function swap<T>(a: T[], i: number, j: number): void {
  const x = a[i];
  a[i] = a[j];
  a[j] = x;
}

export interface LNode {
  id: string;
  value: Cell;
  next: string | null;
  prev?: string | null;
}

/** list panel: nodes in traversal order from head (cycle-safe), then `extra` ids (e.g. a removed node) */
export function listView(
  nodes: Map<string, LNode>,
  head: string | null,
  opts: { label?: string; tones?: Record<string, Tone>; pointers?: Record<string, string | null | undefined>; extra?: string[]; doubly?: boolean } = {},
): ListPanel {
  const seen = new Set<string>();
  const order: LNode[] = [];
  for (let c = head; c && !seen.has(c) && nodes.has(c); c = nodes.get(c)!.next) {
    seen.add(c);
    order.push(nodes.get(c)!);
  }
  for (const e of opts.extra ?? []) if (!seen.has(e) && nodes.has(e)) order.push(nodes.get(e)!);
  return {
    kind: 'list',
    label: opts.label,
    doubly: opts.doubly,
    nodes: order.map((n) => ({ id: n.id, value: n.value, next: n.next, ...(opts.doubly ? { prev: n.prev ?? null } : {}), tone: opts.tones?.[n.id] })),
    pointers: Object.entries(opts.pointers ?? {})
      .filter((e): e is [string, string | null] => e[1] !== undefined)
      .map(([name, at]) => ({ name, at })),
  };
}

/** recursion panel builder: push() marks parent waiting, done() marks parent active again */
export function callTree(label = 'Calls') {
  const calls: CallNode[] = [];
  let seq = 0;
  const parentOf = (me: CallNode) => (me.parent ? calls.find((c) => c.id === me.parent) : undefined);
  return {
    calls,
    push(text: string, parent?: string, tone?: Tone): CallNode {
      const me: CallNode = { id: `c${seq++}`, parent, label: text, state: 'active', tone };
      const p = parentOf(me);
      if (p) p.state = 'waiting';
      calls.push(me);
      return me;
    },
    done(me: CallNode, ret: string, tone?: Tone) {
      me.state = 'done';
      me.ret = ret;
      if (tone) me.tone = tone;
      const p = parentOf(me);
      if (p) p.state = 'active';
    },
    depth(me: CallNode) {
      let d = 1;
      for (let p = parentOf(me); p; p = parentOf(p)) d++;
      return d;
    },
    panel: (): RecursionPanel => ({ kind: 'recursion', label, calls }),
  };
}

// ---------- input parsing (user typed text → values) ----------

const INT = /^-?\d+$/;
const splitList = (s: string) => s.split(/[\s,]+/).filter(Boolean);
const splitRows = (s: string) =>
  s
    .split(/[\n;]+/)
    .map((r) => r.trim())
    .filter(Boolean);

export function formatInput(spec: InputSpec, v: unknown): string {
  switch (spec.type) {
    case 'int':
      return String(v);
    case 'intArray':
      return (v as number[]).join(', ');
    case 'string':
      return String(v);
    case 'intGrid':
      return (v as number[][]).map((r) => r.join(' ')).join('; ');
    case 'charGrid':
      return (v as string[]).join('; ');
    case 'edges':
      return (v as number[][]).map(([a, b, w]) => (w === undefined ? `${a}-${b}` : `${a}-${b}:${w}`)).join(', ');
  }
}

type Parsed = { ok: true; value: unknown } | { ok: false; error: string };
const fail = (error: string): Parsed => ({ ok: false, error });

function parseOne(spec: InputSpec, raw: string): Parsed {
  const s = raw.trim();
  switch (spec.type) {
    case 'int': {
      if (!INT.test(s)) return fail('Sirf ek integer number daalo (jaise 5).');
      const n = Number(s);
      if (n < spec.min || n > spec.max) return fail(`${spec.min} se ${spec.max} ke beech number daalo.`);
      return { ok: true, value: n };
    }
    case 'intArray': {
      const parts = splitList(s);
      if (parts.some((p) => !INT.test(p))) return fail('Sirf integers daalo, comma ya space se alag karke (jaise 3, 1, 4).');
      const a = parts.map(Number);
      if (a.length < spec.minLen || a.length > spec.maxLen)
        return fail(`Kam se kam ${spec.minLen} aur zyada se zyada ${spec.maxLen} numbers daalo.`);
      if (a.some((n) => n < spec.min || n > spec.max)) return fail(`Har number ${spec.min} se ${spec.max} ke beech ho.`);
      if (spec.sorted && a.some((n, i) => i > 0 && a[i - 1] > n)) return fail('Numbers chhote se bade order (sorted) mein daalo.');
      if (spec.distinct && new Set(a).size !== a.length) return fail('Saare numbers alag-alag hone chahiye.');
      return { ok: true, value: a };
    }
    case 'string': {
      const charset = spec.charset ?? 'abcdefghijklmnopqrstuvwxyz';
      if (s.length < spec.minLen || s.length > spec.maxLen)
        return fail(`Length ${spec.minLen} se ${spec.maxLen} characters ke beech rakho.`);
      const bad = [...s].find((ch) => !charset.includes(ch));
      if (bad !== undefined) return fail(`"${bad}" allowed nahi hai. Sirf ye characters chalenge: ${charset}`);
      return { ok: true, value: s };
    }
    case 'intGrid': {
      const rows = splitRows(s).map(splitList);
      if (rows.length === 0 || rows.length > spec.maxRows) return fail(`1 se ${spec.maxRows} rows daalo (rows ko ; se alag karo).`);
      if (rows.some((r) => r.some((p) => !INT.test(p)))) return fail('Har cell mein integer daalo.');
      const cols = rows[0].length;
      if (cols === 0 || cols > spec.maxCols) return fail(`Har row mein 1 se ${spec.maxCols} numbers.`);
      if (rows.some((r) => r.length !== cols)) return fail('Saari rows ki length barabar honi chahiye.');
      const g = rows.map((r) => r.map(Number));
      if (g.flat().some((n) => n < spec.min || n > spec.max)) return fail(`Har number ${spec.min} se ${spec.max} ke beech ho.`);
      return { ok: true, value: g };
    }
    case 'charGrid': {
      const rows = splitRows(s.replace(/,/g, ';'));
      if (rows.length === 0 || rows.length > spec.maxRows) return fail(`1 se ${spec.maxRows} rows daalo (rows ko ; se alag karo).`);
      const cols = rows[0].length;
      if (cols === 0 || cols > spec.maxCols) return fail(`Har row mein 1 se ${spec.maxCols} characters.`);
      if (rows.some((r) => r.length !== cols)) return fail('Saari rows ki length barabar honi chahiye.');
      const bad = [...rows.join('')].find((ch) => !spec.charset.includes(ch));
      if (bad !== undefined) return fail(`"${bad}" allowed nahi hai. Sirf: ${spec.charset}`);
      return { ok: true, value: rows };
    }
    case 'edges': {
      const items = s.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean);
      if (items.length > spec.maxEdges) return fail(`Zyada se zyada ${spec.maxEdges} edges.`);
      const edges: number[][] = [];
      for (const it of items) {
        const m = /^(\d+)\s*-\s*(\d+)(?:\s*:\s*(-?\d+))?$/.exec(it);
        if (!m) return fail(`"${it}" samajh nahi aaya. Format: 0-1${spec.weighted ? ':5' : ''}`);
        const [a, b] = [Number(m[1]), Number(m[2])];
        if (a >= spec.nodes || b >= spec.nodes) return fail(`Node number 0 se ${spec.nodes - 1} tak hi.`);
        if (a === b) return fail('Self-loop (0-0) allowed nahi hai.');
        if (spec.weighted) {
          if (m[3] === undefined) return fail(`"${it}" mein weight do, jaise ${a}-${b}:4`);
          const w = Number(m[3]);
          if (w < (spec.minW ?? 1) || w > (spec.maxW ?? 99)) return fail(`Weight ${spec.minW ?? 1} se ${spec.maxW ?? 99} ke beech.`);
          edges.push([a, b, w]);
        } else edges.push([a, b]);
      }
      return { ok: true, value: edges };
    }
  }
}

export function parseInputs(
  specs: InputSpec[],
  raw: Record<string, string>,
): { ok: true; value: InputValues } | { ok: false; errors: Record<string, string> } {
  const value: InputValues = {};
  const errors: Record<string, string> = {};
  for (const spec of specs) {
    const r = parseOne(spec, raw[spec.name] ?? '');
    if (r.ok) value[spec.name] = r.value;
    else errors[spec.name] = r.error;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

export const defaultInputs = (specs: InputSpec[]): InputValues =>
  Object.fromEntries(specs.map((s) => [s.name, structuredClone(s.default)]));

// ---------- random inputs (fuzz testing) ----------

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const randInt = (rnd: () => number, lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));

function randomOne(spec: InputSpec, rnd: () => number): unknown {
  switch (spec.type) {
    case 'int':
      return randInt(rnd, spec.min, spec.max);
    case 'intArray': {
      let len = randInt(rnd, spec.minLen, spec.maxLen);
      let a: number[];
      if (spec.distinct) {
        len = Math.min(len, spec.max - spec.min + 1);
        const set = new Set<number>();
        while (set.size < len) set.add(randInt(rnd, spec.min, spec.max));
        a = [...set];
      } else a = Array.from({ length: len }, () => randInt(rnd, spec.min, spec.max));
      return spec.sorted ? a.sort((x, y) => x - y) : a;
    }
    case 'string': {
      const cs = spec.charset ?? 'abcdefghijklmnopqrstuvwxyz';
      return Array.from({ length: randInt(rnd, spec.minLen, spec.maxLen) }, () => cs[randInt(rnd, 0, cs.length - 1)]).join('');
    }
    case 'intGrid': {
      const r = randInt(rnd, 1, spec.maxRows);
      const c = randInt(rnd, 1, spec.maxCols);
      return Array.from({ length: r }, () => Array.from({ length: c }, () => randInt(rnd, spec.min, spec.max)));
    }
    case 'charGrid': {
      const r = randInt(rnd, 1, spec.maxRows);
      const c = randInt(rnd, 1, spec.maxCols);
      return Array.from({ length: r }, () =>
        Array.from({ length: c }, () => spec.charset[randInt(rnd, 0, spec.charset.length - 1)]).join(''),
      );
    }
    case 'edges': {
      const m = randInt(rnd, 0, spec.maxEdges);
      return Array.from({ length: m }, () => {
        const a = randInt(rnd, 0, spec.nodes - 1);
        let b = randInt(rnd, 0, spec.nodes - 2);
        if (b >= a) b++;
        return spec.weighted ? [a, b, randInt(rnd, spec.minW ?? 1, spec.maxW ?? 99)] : [a, b];
      });
    }
  }
}

export const randomInputs = (specs: InputSpec[], rnd: () => number): InputValues =>
  Object.fromEntries(specs.map((s) => [s.name, randomOne(s, rnd)]));
