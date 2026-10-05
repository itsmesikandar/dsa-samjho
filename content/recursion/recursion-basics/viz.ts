import { array, callTree, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

/** Java/Kotlin println(Double) jaisa format: 1024.0, 0.25, 1.0E-5 */
const javaDouble = (v: number): string => {
  if (!Number.isFinite(v)) return Number.isNaN(v) ? 'NaN' : v > 0 ? 'Infinity' : '-Infinity';
  const a = Math.abs(v);
  if (v !== 0 && (a < 1e-3 || a >= 1e7)) {
    const [m, e] = v.toExponential().split('e');
    return `${m.includes('.') ? m : `${m}.0`}E${e.replace('+', '')}`;
  }
  return Number.isInteger(v) ? v.toFixed(1) : String(v);
};

// ---------- 3. Visual intro: andar jaate waqt vs bahar aate waqt ----------
export const upDown = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 3, min: 1, max: 5 }],
  run({ n }, t) {
    const stack: string[] = [];
    const out: string[] = [];
    const panels = (): Panel[] => [
      { kind: 'stack', label: 'Call stack (upar = abhi chal raha)', items: [...stack], tones: stack.length ? { [stack.length - 1]: 'active' as Tone } : {} },
      { kind: 'text', label: 'Output', text: out.length ? out.join('\n') : '(abhi kuch nahi)' },
    ];
    const show = (k: number) => {
      stack.push(`show(${k})`);
      if (k === 0) {
        t.frame({ caption: `show(0) — base case! Kuch print nahi, seedha return. Ab calls ULTE order mein wapas lautenge.`, vars: { depth: stack.length }, panels: panels() });
        stack.pop();
        return;
      }
      out.push(`andar ${k}`);
      t.frame({ caption: `show(${k}) stack par aaya. Call se PEHLE wala kaam: "andar ${k}" print. Ab show(${k - 1}) call — show(${k}) yahin ruk ke intezaar karega.`, vars: { depth: stack.length }, panels: panels() });
      show(k - 1);
      out.push(`bahar ${k}`);
      t.frame({ caption: `show(${k - 1}) khatam, control show(${k}) mein wapas — jahan ruka tha wahin se. Call ke BAAD wala kaam: "bahar ${k}".`, vars: { depth: stack.length }, panels: panels() });
      stack.pop();
    };
    t.frame({ caption: `Function: print("andar k") → show(k − 1) → print("bahar k"). Dekho output ka order — andar 1, 2, 3… phir bahar ulta!`, vars: { depth: 0 }, panels: panels() });
    show(n);
    t.frame({ caption: `Stack khaali. "andar" seedhe order mein (jaate waqt), "bahar" ulte order mein (lautte waqt). Call ke baad likha code = lautte waqt chalta hai.`, vars: { depth: 0 }, panels: panels() });
    return out.join(', ');
  },
});

// ---------- 4. How: factorial ----------
export const factTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 5, min: 0, max: 10 }],
  run({ n }, t) {
    const tree = callTree();
    const fact = (k: number, parent?: string): number => {
      const me = tree.push(`factorial(${k})`, parent);
      if (k <= 1) {
        tree.done(me, '1');
        t.frame({ line: 'base', caption: `factorial(${k}): n ≤ 1 → base case. Seedha 1 return — yahin se calls lautna shuru.`, vars: { n: k, depth: tree.depth(me) }, panels: [tree.panel()] });
        return 1;
      }
      t.frame({ line: 'call', caption: `factorial(${k}) ko ${k - 1}! chahiye. factorial(${k - 1}) call kiya — factorial(${k}) ruk ke intezaar (waiting) karega.`, vars: { n: k, depth: tree.depth(me) }, panels: [tree.panel()] });
      const rest = fact(k - 1, me.id);
      const r = k * rest;
      tree.done(me, String(r));
      t.frame({ line: 'ret', caption: `factorial(${k - 1}) ne ${rest} diya → ${k} × ${rest} = ${r}. Upar wapas.`, vars: { n: k, rest, result: r }, panels: [tree.panel()] });
      return r;
    };
    const ans = fact(n);
    t.frame({ line: 'ret', caption: `${n}! = ${ans}. ${Math.max(n, 1)} calls, stack ki gehraai ${Math.max(n, 1)} → time O(n), space O(n) (stack frames).`, vars: { result: ans }, panels: [tree.panel()] });
    return String(ans);
  },
});

// ---------- Example 1: reverse string ----------
export const revTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 's', default: 'hello', minLen: 1, maxLen: 8 }],
  run({ s }, t) {
    const c = [...s];
    const tree = callTree();
    const rev = (l: number, r: number, parent?: string) => {
      const me = tree.push(`rev(${l}, ${r})`, parent);
      if (l >= r) {
        tree.done(me, '✓');
        t.frame({ line: 'base', caption: l === r ? `l = r = ${l}: ek hi char — ulta karne ko kuch nahi. Base case, return.` : `l (${l}) > r (${r}): kuch nahi bacha. Base case, return.`, vars: { l, r }, panels: [array(c, { pointers: { l, r } }), tree.panel()] });
        return;
      }
      [c[l], c[r]] = [c[r], c[l]];
      t.frame({ line: 'swap', caption: `Kinare badle: '${c[l]}' ↔ '${c[r]}'. Mera kaam bas itna.`, vars: { l, r }, panels: [array(c, { tones: { [l]: 'swap', [r]: 'swap' }, pointers: { l, r } }), tree.panel()] });
      t.frame({ line: 'call', caption: `Baaki andar wala hissa (${l + 1}..${r - 1}) — wahi sawaal, chhota. rev(${l + 1}, ${r - 1}) ko saunpa.`, vars: { l, r }, panels: [array(c, { tones: { [l]: 'done', [r]: 'done' }, pointers: { l: l + 1, r: r - 1 } }), tree.panel()] });
      rev(l + 1, r - 1, me.id);
      tree.done(me, '✓');
    };
    rev(0, c.length - 1);
    t.frame({ line: 'base', caption: `"${c.join('')}". Har call ne 2 chars badle → n/2 calls. Time O(n), stack O(n) — loop wala two pointers O(1) space deta hai.`, panels: [array(c, { tones: Object.fromEntries(c.map((_, i) => [i, 'done' as Tone])) }), tree.panel()] });
    return c.join('');
  },
});

// ---------- Example 2: fast power ----------
export const powTrace = tracer<{ x: number; n: number }>({
  inputs: [
    { name: 'x', type: 'int', label: 'x', default: 2, min: -3, max: 3 },
    { name: 'n', type: 'int', label: 'n (negative bhi)', default: 10, min: -10, max: 12 },
  ],
  run({ x, n }, t) {
    const tree = callTree();
    let b = x;
    let e = n;
    if (e < 0) {
      b = 1 / b;
      e = -e;
      t.frame({ caption: `n negative hai: x^(${n}) = (1/x)^${e}. Ab base = ${javaDouble(b)}, power = ${e}.`, vars: { x: javaDouble(b), n: e }, panels: [tree.panel()] });
    }
    const fast = (xx: number, k: number, parent?: string): number => {
      const me = tree.push(`pow(${k})`, parent);
      if (k === 0) {
        tree.done(me, '1.0');
        t.frame({ line: 'base', caption: `power 0 → 1. Base case.`, vars: { n: k }, panels: [tree.panel()] });
        return 1;
      }
      t.frame({ line: 'call', caption: `pow(${k}) = pow(${Math.floor(k / 2)})²${k % 2 ? ' × x (odd hai)' : ''}. Sirf EK call pow(${Math.floor(k / 2)}) — power aadhi.`, vars: { n: k }, panels: [tree.panel()] });
      const half = fast(xx, Math.floor(k / 2), me.id);
      const r = k % 2 === 0 ? half * half : half * half * xx;
      tree.done(me, javaDouble(r));
      t.frame({ line: 'ret', caption: k % 2 === 0 ? `${k} even: half × half = ${javaDouble(half)} × ${javaDouble(half)} = ${javaDouble(r)}.` : `${k} odd: half × half × x = ${javaDouble(half)}² × ${javaDouble(xx)} = ${javaDouble(r)}.`, vars: { n: k, half: javaDouble(half), result: javaDouble(r) }, panels: [tree.panel()] });
      return r;
    };
    const ans = fast(b, e);
    t.frame({ line: 'ret', caption: `Answer ${javaDouble(ans)}. Sirf ${tree.calls.length} calls (≈ log₂ n + 2), ${e} multiplication nahi → O(log n).`, vars: { result: javaDouble(ans) }, panels: [tree.panel()] });
    return javaDouble(ans);
  },
});

// ---------- Example 3: Tower of Hanoi ----------
export const hanoiTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'Disks (n)', default: 3, min: 1, max: 4 }],
  run({ n }, t) {
    const pegs: Record<string, number[]> = { A: Array.from({ length: n }, (_, i) => n - i), B: [], C: [] };
    const chain: string[] = [];
    let moves = 0;
    const view = (hot?: { peg: string; tone: Tone }): Panel[] => [
      ...(['A', 'B', 'C'] as const).map(
        (p): Panel => ({ kind: 'stack', label: `Peg ${p}`, items: [...pegs[p]], ids: pegs[p].map((d) => `d${d}`), tones: hot?.peg === p && pegs[p].length ? { [pegs[p].length - 1]: hot.tone } : {} }),
      ),
      { kind: 'text', label: 'Call stack', text: chain.join('\n') },
    ];
    const hanoi = (k: number, from: string, to: string, via: string) => {
      if (k === 0) return;
      chain.push(`${'  '.repeat(chain.length)}hanoi(${k}, ${from}→${to})`);
      t.frame({ line: 'top', caption: k === 1 ? `hanoi(1, ${from}→${to}): upar kuch nahi (n − 1 = 0).` : `hanoi(${k}, ${from}→${to}): disk ${k} ke upar ${k - 1} disks hain. Pehle unhe ${via} par hatao — ye hanoi(${k - 1}) ka kaam, use bharosa karo.`, vars: { n: k, moves }, panels: view() });
      hanoi(k - 1, from, via, to);
      pegs[to].push(pegs[from].pop()!);
      moves++;
      t.frame({ line: 'move', caption: `Raasta saaf! Disk ${k}: ${from} → ${to}. (Move #${moves})`, vars: { n: k, moves }, panels: view({ peg: to, tone: 'new' }) });
      if (k > 1) t.frame({ line: 'back', caption: `Ab ${via} par pade ${k - 1} disks ko disk ${k} ke upar (${to}) lao — phir hanoi(${k - 1}).`, vars: { n: k, moves }, panels: view({ peg: via, tone: 'active' }) });
      hanoi(k - 1, via, to, from);
      chain.pop();
    };
    t.frame({ caption: `${n} disks A par. Sab C par le jaane hain, B madad ke liye. Rule: ek baar mein ek disk, bada kabhi chhote ke upar nahi.`, vars: { moves }, panels: view() });
    hanoi(n, 'A', 'C', 'B');
    t.frame({ line: 'move', caption: `Ho gaya — ${moves} moves = 2^${n} − 1. Har level par moves double: T(n) = 2·T(n − 1) + 1 → O(2ⁿ).`, vars: { moves }, panels: view({ peg: 'C', tone: 'done' }) });
    return String(moves);
  },
});
