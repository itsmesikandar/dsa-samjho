import { array, tracer } from '@/components/viz/engine/tracer';
import type { MapPanel, MemoryCell, MemoryPanel, Tone } from '@/components/viz/engine/types';

// ---------- 3. Visual intro: IntArray vs List<Int> (boxing) ----------
export const boxingMemory = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Numbers', default: [5, 8, 2], minLen: 1, maxLen: 4, min: -99, max: 99 }],
  run({ arr }, t) {
    const n = arr.length;
    const START = 1000;
    const B = n + 1;
    const OBJ = 2 * n + 2;
    const objPos = (i: number) => OBJ + 2 * (n - 1 - i) + 1;
    const addr = (idx: number) => START + idx * 4;
    const total = OBJ + 2 * n;
    const build = (stage: number, focus?: number): MemoryPanel => {
      const cells: MemoryCell[] = Array.from({ length: total }, () => ({}));
      arr.forEach((v, i) => (cells[i] = { value: v, tag: `ints[${i}]`, tone: stage === 1 ? 'new' : undefined }));
      if (stage >= 2) {
        arr.forEach((v, i) => {
          cells[B + i] = { value: `→${addr(objPos(i))}`, tag: `list[${i}]`, tone: stage === 2 ? 'new' : focus === i ? 'active' : undefined };
          cells[objPos(i)] = { value: v, tag: 'Integer obj', tone: stage === 2 ? 'new' : focus === i ? 'found' : undefined };
        });
      }
      return {
        kind: 'memory',
        label: 'Heap memory',
        start: START,
        cells,
        arrows: stage >= 2 ? arr.map((_, i) => ({ from: B + i, to: objPos(i), tone: (focus === i ? 'found' : 'active') as Tone })) : [],
      };
    };
    t.frame({
      caption: `\`intArrayOf(...)\` (Java: int[]) → saare ${n} numbers seedhe line mein, har ek 4 bytes. Koi extra object nahi.`,
      vars: { 'IntArray bytes': n * 4 },
      panels: [build(1)],
    });
    t.frame({
      caption: `\`listOf(...)\` / \`ArrayList<Integer>\` → andar ek array of REFERENCES (addresses), aur har number ek alag "Integer" object, heap mein kahin bhi. Number ko object mein lapetna = boxing.`,
      vars: { 'IntArray bytes': n * 4, 'List bytes (approx)': n * 20 },
      panels: [build(2)],
    });
    t.frame({
      caption: 'list[0] padhne ke liye: pehle reference padho, phir arrow follow karke object tak jao — 2 jumps. IntArray mein seedha 1 jump. Bade loops mein ye fark dikhta hai.',
      vars: { 'IntArray bytes': n * 4, 'List bytes (approx)': n * 20 },
      panels: [build(3, 0)],
    });
    t.frame({
      caption: `Memory: IntArray ≈ ${n * 4} bytes, List<Int> ≈ ${n * 20} bytes (reference ~4 + object ~16 har item). DSA mein numbers ke liye IntArray/LongArray lo; List tab jab size badalni ho.`,
      vars: { 'IntArray bytes': n * 4, 'List bytes (approx)': n * 20 },
      panels: [build(3)],
    });
    return String(n * 4);
  },
});

// ---------- 4. How: ArrayDeque = stack + queue ----------
export const dequeTrace = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'Values', default: [1, 2, 3], minLen: 1, maxLen: 6, min: -99, max: 99 }],
  run({ values }, t) {
    const st: number[] = [];
    const sid: string[] = [];
    const q: number[] = [];
    const qid: string[] = [];
    const show = (line: string, caption: string, sTone?: Tone, qTone?: Tone) =>
      t.frame({
        line,
        caption,
        panels: [
          { kind: 'stack', label: 'stack (ArrayDeque)', items: [...st], ids: [...sid], tones: sTone && st.length ? { [st.length - 1]: sTone } : {} },
          { kind: 'queue', label: 'queue (ArrayDeque)', items: [...q], ids: [...qid], tones: qTone && q.length ? { [q.length - 1]: qTone } : {} },
        ],
      });
    values.forEach((v, i) => {
      st.push(v);
      sid.push(`s${i}`);
      show('push', `stack.addLast(${v}) → upar rakha. Stack mein hamesha upar (last) se hi kaam hota hai.`, 'new');
    });
    const popped = st.pop()!;
    sid.pop();
    show('pop', `stack.removeLast() → ${popped} nikla — jo SABSE BAAD mein aaya tha (LIFO: Last In, First Out).`);
    values.forEach((v, i) => {
      q.push(v);
      qid.push(`q${i}`);
      show('enq', `queue.addLast(${v}) → line mein peeche laga.`, undefined, 'new');
    });
    const out = q.shift()!;
    qid.shift();
    show('deq', `queue.removeFirst() → ${out} nikla — jo SABSE PEHLE aaya tha (FIFO: First In, First Out).`);
    t.frame({
      caption: 'Ek hi class, do kaam: addLast + removeLast = stack; addLast + removeFirst = queue. Dono O(1). Java ki purani `Stack` class aur `LinkedList` queue se ArrayDeque tez hai.',
      panels: [
        { kind: 'stack', label: 'stack (ArrayDeque)', items: [...st], ids: [...sid] },
        { kind: 'queue', label: 'queue (ArrayDeque)', items: [...q], ids: [...qid] },
      ],
    });
    return String(popped);
  },
});

const mapStr = (entries: [string, string][]) => `{${entries.map(([k, v]) => `${k}=${v}`).join(', ')}}`;

// ---------- Example 1: frequency count ----------
export const freqTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Word', default: 'banana', minLen: 1, maxLen: 12 }],
  run({ s }, t) {
    const freq = new Map<string, number>();
    const panel = (hl?: string, sorted = false): MapPanel => {
      const entries = [...freq].sort(sorted ? (a, b) => (a[0] < b[0] ? -1 : 1) : () => 0);
      return { kind: 'map', label: 'freq (HashMap)', keyLabel: 'char', valueLabel: 'count', entries: entries.map(([k, v]) => ({ key: k, value: v, tone: k === hl ? ('new' as Tone) : undefined })) };
    };
    t.frame({ line: 'init', caption: 'freq = khaali HashMap. Har character par: abhi tak ka count lo (na ho to 0) aur +1 karo.', panels: [array([...s]), panel()] });
    [...s].forEach((c, i) => {
      const before = freq.get(c) ?? 0;
      freq.set(c, before + 1);
      t.frame({
        line: 'count',
        caption: before === 0 ? `'${c}' pehli baar: getOrDefault('${c}', 0) = 0 → 0 + 1 = 1.` : `'${c}' phir aaya: purana count ${before} → ${before + 1}.`,
        vars: { i, c },
        panels: [array([...s], { tones: { [i]: 'active' }, pointers: { i } }), panel(c)],
      });
    });
    const sorted = [...freq].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    t.frame({
      line: 'done',
      caption: 'HashMap ka order fixed nahi hota, isliye print ke liye sorted map (TreeMap / toSortedMap) mein badla. Har char par O(1) kaam → total O(n).',
      panels: [array([...s]), panel(undefined, true)],
    });
    return mapStr(sorted.map(([k, v]) => [k, String(v)]));
  },
});

// ---------- Example 2: group by first letter ----------
const wordsOf = (s: string) => s.trim().split(/\s+/).filter(Boolean);
export const groupTrace = tracer<{ s: string }>({
  inputs: [
    {
      name: 's',
      type: 'string',
      label: 'Words (space se alag)',
      default: 'chai samosa jalebi chutney jam',
      minLen: 1,
      maxLen: 48,
      charset: 'abcdefghijklmnopqrstuvwxyz ',
    },
  ],
  check: ({ s }) => {
    const w = wordsOf(s);
    if (w.length === 0) return 'Kam se kam ek word daalo.';
    if (w.length > 8) return 'Zyada se zyada 8 words.';
    if (w.some((x) => x.length > 10)) return 'Har word 10 letters tak.';
    return null;
  },
  run({ s }, t) {
    const words = wordsOf(s);
    const groups = new Map<string, string[]>();
    const panel = (hl?: string, sorted = false): MapPanel => {
      const entries = [...groups];
      if (sorted) entries.sort((a, b) => (a[0] < b[0] ? -1 : 1));
      return { kind: 'map', label: 'groups (HashMap)', keyLabel: 'letter', valueLabel: 'words', entries: entries.map(([k, v]) => ({ key: k, value: `[${v.join(', ')}]`, tone: k === hl ? ('new' as Tone) : undefined })) };
    };
    t.frame({ line: 'init', caption: 'groups = khaali HashMap<Char, MutableList<String>>. Har word ko uske pehle letter wali list mein daalna hai.', panels: [array(words), panel()] });
    words.forEach((w, i) => {
      const k = w[0];
      const existed = groups.has(k);
      if (!existed) groups.set(k, []);
      groups.get(k)!.push(w);
      t.frame({
        line: 'add',
        caption: existed
          ? `"${w}" → letter '${k}' ki list pehle se hai, usi mein jod diya.`
          : `"${w}" → letter '${k}' ki list abhi nahi thi. getOrPut (Java: computeIfAbsent) ne nayi list banayi, phir word daala.`,
        vars: { i, word: w, letter: k },
        panels: [array(words, { tones: { [i]: 'active' }, pointers: { i } }), panel(k)],
      });
    });
    t.frame({ line: 'done', caption: 'Saare words group ho gaye. Har word par ek lookup O(1) → total O(n). Print ke liye sorted.', panels: [array(words), panel(undefined, true)] });
    const sorted = [...groups].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    return mapStr(sorted.map(([k, v]) => [k, `[${v.join(', ')}]`]));
  },
});

// ---------- Example 3: overflow aur % MOD ----------
export const factModTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 13, min: 1, max: 20 }],
  run({ n }, t) {
    const MOD = 1_000_000_007;
    let r = 1;
    let wrong = 1;
    let real = 1n;
    const rows: MapPanel['entries'] = [];
    const panel = (): MapPanel => ({ kind: 'map', label: 'i! — Int vs Long % MOD (aakhri 6)', keyLabel: 'i', valueLabel: 'Int (galat?) | Long % MOD', entries: rows.slice(-6).map((x) => ({ ...x })) });
    t.frame({ line: 'init', caption: 'result = 1L. Plan: har multiply ke turant baad % MOD (10⁹ + 7), taaki number kabhi bada na ho.', vars: { result: r }, panels: [panel()] });
    let warned = false;
    for (let i = 2; i <= n; i++) {
      r = (r * i) % MOD;
      wrong = Math.imul(wrong, i);
      real *= BigInt(i);
      const overflow = BigInt(wrong) !== real;
      rows.push({ key: i, value: `${wrong} | ${r}`, tone: overflow ? 'error' : undefined });
      const first = overflow && !warned;
      if (first) warned = true;
      t.frame({
        line: 'mul',
        caption: first
          ? `${i}! = ${real} — Int ki limit (2,147,483,647) se bada! Int wala chupchaap ${wrong} ban gaya (koi error nahi aaya!). Long % MOD wala sahi hai.`
          : `result = (result × ${i}) % MOD = ${r}.${overflow ? ' Int wala ab bhi galat (laal).' : ''}`,
        vars: { i, result: r },
        panels: [panel()],
      });
    }
    t.frame({
      line: 'done',
      caption: `${n}! % MOD = ${r}. Rule: bade answers ke liye Long lo, aur har multiply/add ke baad % MOD. (a × b) % m = ((a % m) × (b % m)) % m — isliye beech mein % karna sahi hai.`,
      vars: { result: r },
      panels: [panel()],
    });
    return String(r);
  },
});
