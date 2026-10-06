import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type GT = Record<string, Tone>;

/** x ke neeche ke w bits, baayein = bada bit (JS bhi 32-bit two's complement deta hai) */
const bitsOf = (x: number, w: number) => Array.from({ length: w }, (_, k) => (x >> (w - 1 - k)) & 1);
const colLabels = (w: number) => Array.from({ length: w }, (_, k) => String(w - 1 - k));
/** utne hi bits jitne chahiye (kam se kam 4) — 390px par 8 columns nahi aate */
const fitW = (...xs: number[]) => Math.max(4, ...xs.filter((x) => x > 0).map((x) => x.toString(2).length));

interface Row {
  label: string;
  v: number;
  /** is row ke 1 bits par ye tone */
  ones?: Tone;
}
/** extra(w) = koi khaas cells (column of bit k = w − 1 − k) */
function bitGrid(rows: Row[], w: number, extra: GT = {}, label = 'bits (column = bit number)'): Panel {
  const tones: GT = {};
  rows.forEach((r, i) => r.ones && bitsOf(r.v, w).forEach((b, c) => b && (tones[`${i},${c}`] = r.ones!)));
  return { kind: 'grid', label, values: rows.map((r) => bitsOf(r.v, w)), tones: { ...tones, ...extra }, rowLabels: rows.map((r) => r.label), colLabels: colLabels(w), corner: 'bit' };
}

// ---------- 3. Visual intro: decimal se binary ----------
export const binaryTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 13, min: 0, max: 255 }],
  run({ n }, t) {
    const w = fitW(n);
    const slots: (number | string)[] = Array(w).fill('·');
    const row = (tones: GT = {}): Panel => ({ kind: 'grid', label: 'bits (daayein se bharte hain)', values: [slots], tones, rowLabels: ['bit'], colLabels: colLabels(w), corner: '' });
    t.frame({ caption: `${n} ko binary mein: baar baar 2 se bhaag do — har baar bacha (0 ya 1) agla bit hai, DAAYEIN se baayein. Computer har number aise hi 0/1 mein rakhta hai.`, panels: [row()] });
    let q = n;
    let k = 0;
    if (q === 0) t.frame({ caption: '0 ke saare bits 0.', panels: [row()] });
    while (q > 0) {
      const r = q % 2;
      slots[w - 1 - k] = r;
      t.frame({ caption: `${q} ÷ 2 = ${q >> 1}, bacha ${r} → bit ${k} = ${r}.`, vars: { n: q, bit: k }, legend: { new: 'abhi bana' }, panels: [row({ [`0,${w - 1 - k}`]: 'new' })] });
      q >>= 1;
      k++;
    }
    for (let i = 0; i < w; i++) if (slots[i] === '·') slots[i] = 0;
    const wt = Array.from({ length: w }, (_, c) => 2 ** (w - 1 - c));
    const ones = bitsOf(n, w);
    const terms = wt.filter((_, c) => ones[c]);
    const tones: GT = Object.fromEntries(ones.flatMap((b, c) => (b ? [[`0,${c}`, 'found' as Tone], [`1,${c}`, 'found' as Tone]] : [])));
    t.frame({ caption: `${n} = ${n.toString(2)} (binary). Bit k ka wazan 2^k: ${terms.length ? terms.join(' + ') : '0'} = ${n}. Isliye bit ek kadam baayein khiskao to value dugni.`, legend: { found: '1 wale bits' }, panels: [{ kind: 'grid', label: 'wazan aur bits', values: [wt, ones], tones, rowLabels: ['2^k', 'bit'], colLabels: colLabels(w), corner: 'k' }] });
    return n.toString(2);
  },
});

// ---------- 4. How: AND, OR, XOR, NOT, shifts ----------
export const opsTrace = tracer<{ a: number; b: number }>({
  inputs: [
    { name: 'a', type: 'int', label: 'a', default: 12, min: 0, max: 127 },
    { name: 'b', type: 'int', label: 'b', default: 10, min: 0, max: 127 },
  ],
  run({ a, b }, t) {
    const w = fitW(a, b, a << 1);
    const leg = { found: 'result mein 1' };
    const A: Row = { label: `a = ${a}`, v: a };
    const B: Row = { label: `b = ${b}`, v: b };
    t.frame({ caption: `a = ${a}, b = ${b}. Bitwise operator har column (bit) par ALAG se kaam karta hai — result ka bit k sirf a ke bit k aur b ke bit k par depend.`, panels: [bitGrid([A, B], w)] });
    const two = (op: string, line: string, v: number, rule: string) => t.frame({ line, caption: `a ${op} b = ${v}: ${rule}`, legend: leg, panels: [bitGrid([A, B, { label: `a ${op} b = ${v}`, v, ones: 'found' }], w)] });
    two('&', 'and', a & b, 'AND — dono 1 hon tabhi 1. (Mask se bits "chhaanto".)');
    two('|', 'or', a | b, 'OR — koi bhi ek 1 ho to 1. (Bits "on" karo.)');
    two('^', 'xor', a ^ b, 'XOR — alag hon to 1, same hon to 0. (Bits "ulto"; x ^ x = 0.)');
    t.frame({ line: 'not', caption: `~a = ${~a}: NOT — har bit ulta. int 32 bits ka hai, to upar ke saare bits bhi 1 ho gaye → number negative (two's complement: ~x = −x − 1). Yahan sirf neeche ke ${w} bits dikhe.`, legend: leg, panels: [bitGrid([A, { label: `~a = ${~a}`, v: ~a, ones: 'found' }], w)] });
    t.frame({ line: 'shl', caption: `a << 1 = ${a << 1}: har bit ek jagah BAAYEIN, daayein naya 0 → value × 2. (a << k = a × 2^k.)`, legend: leg, panels: [bitGrid([A, { label: `a << 1 = ${a << 1}`, v: a << 1, ones: 'found' }], w)] });
    t.frame({ line: 'shr', caption: `a >> 1 = ${a >> 1}: har bit ek jagah DAAYEIN, sabse daayein wala gir gaya → value ÷ 2 (neeche round).`, legend: leg, panels: [bitGrid([A, { label: `a >> 1 = ${a >> 1}`, v: a >> 1, ones: 'found' }], w)] });
    return String(a & b);
  },
});

// ---------- Example 1: Power of two ----------
export const pow2Trace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 16, min: -8, max: 128 }],
  run({ n }, t) {
    if (n <= 0) {
      t.frame({ line: 'check', caption: `n = ${n} ≤ 0 → 2 ki koi power (1, 2, 4, …) itni chhoti nahi → false. (Is check ke bina 0 par n & (n − 1) = 0 aake galat true aata.)`, panels: [array([n], { label: 'n', tones: { 0: 'error' } })] });
      return 'false';
    }
    const w = fitW(n);
    const v = n & (n - 1);
    const N: Row = { label: 'n', v: n, ones: 'compare' };
    const M: Row = { label: 'n−1', v: n - 1, ones: 'compare' };
    t.frame({ caption: `2 ki power = binary mein EXACTLY ek bit 1 (1, 10, 100, 1000…). n − 1 karo: wo akela 1 bit 0 ban jaata, uske neeche ke saare 0 → 1.`, panels: [bitGrid([N, M], w)] });
    t.frame({ line: 'check', caption: v === 0 ? `n & (n − 1) = 0 → koi common 1 bit nahi → sirf ek hi bit tha → ${n} 2 ki power hai. true.` : `n & (n − 1) = ${v} ≠ 0 → n mein ek se zyada 1 bits → false. (Ye trick sabse daayein wala 1 bit mita deti hai — kuch bacha matlab aur bits the.)`, legend: { found: 'bacha 1', compare: '1 bits' }, panels: [bitGrid([N, M, { label: 'n&(n−1)', v, ones: 'found' }], w)] });
    return String(v === 0);
  },
});

// ---------- Example 2: Number of 1 bits (Brian Kernighan) ----------
export const popTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 26, min: 0, max: 255 }],
  run({ n }, t) {
    const w = fitW(n);
    let x = n;
    let count = 0;
    t.frame({ caption: `${n} = ${n.toString(2)}. Seedha tareeka: har bit check (32 baar). Tez: x & (x − 1) sabse DAAYEIN wala 1 bit mita deta hai — jitni baar chala, utne 1 bits.`, vars: { x, count }, panels: [bitGrid([{ label: `x = ${x}`, v: x, ones: 'compare' }], w)] });
    while (x !== 0) {
      const lowBit = Math.log2(x & -x);
      const nx = x & (x - 1);
      count++;
      t.frame({ line: 'drop', caption: `x − 1 = ${x - 1}: sabse daayein ka 1 (bit ${lowBit}) 0 bana, uske neeche sab 1. x & (x − 1) = ${nx} → wo bit mit gaya. count = ${count}.`, vars: { x: nx, count }, legend: { error: 'ye bit mita', compare: 'baaki 1' }, panels: [bitGrid([{ label: 'x', v: x, ones: 'compare' }, { label: 'x−1', v: x - 1 }, { label: 'x&(x−1)', v: nx, ones: 'compare' }], w, { [`0,${w - 1 - lowBit}`]: 'error' })] });
      x = nx;
    }
    t.frame({ line: 'done', caption: `x = 0 → ${count} bits the. Loop sirf ${count} baar chala (har bit ke liye nahi). O(k), k = 1 bits ki ginti.`, vars: { count }, panels: [bitGrid([{ label: `n = ${n}`, v: n, ones: 'found' }], w)] });
    return String(count);
  },
});

// ---------- Example 3: Counting bits 0..n ----------
export const countBitsTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 8, min: 0, max: 15 }],
  run({ n }, t) {
    const ans: number[] = Array(n + 1).fill(0);
    const view = (i: number, extra: Panel[] = []) => [...extra, array(ans.map((v, k) => (k <= i ? v : '·')), { label: 'ans[i] = i mein kitne 1 bits', tones: i > 0 ? { [i]: 'active', [i >> 1]: 'compare' } : { 0: 'found' } })];
    t.frame({ caption: 'ans[0] = 0. Har i ke liye socho: i >> 1 = i ke bits, bas aakhri bit hata ke. Uska jawab pehle hi nikal chuka (chhota number) — usme aakhri bit (i & 1) jodo.', panels: view(0) });
    for (let i = 1; i <= n; i++) {
      ans[i] = ans[i >> 1] + (i & 1);
      t.frame({ line: 'step', caption: `i = ${i} (${i.toString(2)}): i >> 1 = ${i >> 1} (${(i >> 1).toString(2)}) ke ${ans[i >> 1]} bits + aakhri bit ${i & 1} = ${ans[i]}.`, vars: { i }, legend: { active: 'abhi', compare: 'i >> 1', new: 'aakhri bit' }, panels: view(i, [bitGrid([{ label: `i = ${i}`, v: i }, { label: `i >> 1 = ${i >> 1}`, v: i >> 1 }], 4, { '0,3': 'new' }, 'bits')]) });
    }
    t.frame({ line: 'done', caption: `Jawab ${listStr(ans)}. Har i O(1) → O(n), bina har number ke bits gine. Ye DP hai — chhote number ka jawab bade mein use.`, legend: { found: 'jawab' }, panels: [array(ans, { label: 'ans', tones: Object.fromEntries(ans.map((_, k) => [k, 'found' as Tone])) })] });
    return listStr(ans);
  },
});
