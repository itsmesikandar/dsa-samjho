import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type GT = Record<string, Tone>;
type Tones = Record<number, Tone>;

const bitsOf = (x: number, w: number) => Array.from({ length: w }, (_, k) => (x >> (w - 1 - k)) & 1);
const bitGrid = (rows: { label: string; v: number }[], w: number, tones: GT = {}, label = 'bits'): Panel => ({
  kind: 'grid',
  label,
  values: rows.map((r) => bitsOf(r.v, w)),
  tones,
  rowLabels: rows.map((r) => r.label),
  colLabels: Array.from({ length: w }, (_, k) => String(w - 1 - k)),
  corner: 'bit',
});
const onesTone = (r: number, v: number, w: number, t: Tone): GT => Object.fromEntries(bitsOf(v, w).flatMap((b, c) => (b ? [[`${r},${c}`, t]] : [])));
/** sabse bada number kitne bits mein aata (kam se kam 3) */
const widthFor = (nums: number[]) => Math.max(3, ...nums.map((x) => (x > 0 ? Math.floor(Math.log2(x)) + 1 : 1)));

// ---------- 3. Visual intro: ek number = ek set (pizza toppings) ----------
const TOPPINGS = ['cheese', 'onion', 'paneer', 'corn'];
export const maskSetTrace = tracer<{ mask: number }>({
  inputs: [{ name: 'mask', type: 'int', label: 'mask (0–15)', default: 11, min: 0, max: 15 }],
  run({ mask }, t) {
    const cols = [3, 2, 1, 0].map((i) => `${i} ${TOPPINGS[i]}`);
    const grid = (tones: GT = {}): Panel => ({ kind: 'grid', label: `mask = ${mask}`, values: [bitsOf(mask, 4)], tones, rowLabels: ['bit'], colLabels: cols, corner: '' });
    t.frame({ caption: `4 toppings: bit 0 = cheese, 1 = onion, 2 = paneer, 3 = corn. Ek pizza order = har topping hai (1) ya nahi (0) = 4 bits = ek number 0–15. Total 2⁴ = 16 alag orders.`, panels: [grid()] });
    const chosen: string[] = [];
    for (let i = 0; i < 4; i++) {
      const on = (mask >> i) & 1;
      if (on) chosen.push(TOPPINGS[i]);
      t.frame({ caption: `(mask >> ${i}) & 1 = ${on} → ${TOPPINGS[i]} ${on ? 'HAI' : 'nahi'}.`, vars: { i }, legend: { found: 'hai', muted: 'nahi' }, panels: [grid({ [`0,${3 - i}`]: on ? 'found' : 'muted' })] });
    }
    const set = `{${chosen.join(', ')}}`;
    const addP = mask | (1 << 2);
    t.frame({ caption: `mask ${mask} = ${set}. Set ke kaam ab bit ops: paneer jodo → mask | (1 << 2) = ${addP}; onion hatao → mask & ~(1 << 1) = ${mask & ~(1 << 1)}; do orders mein common → a & b. 0 se 15 tak count karo = saare 16 subsets — yahi agla section.`, legend: { found: 'liya' }, panels: [grid(Object.fromEntries(bitsOf(mask, 4).flatMap((b, c) => (b ? [[`0,${c}`, 'found' as Tone]] : []))))] });
    return set;
  },
});

// ---------- 4. How: saare subsets bitmask se ----------
export const subsetsTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [1, 2, 3], minLen: 1, maxLen: 4, min: 0, max: 9, distinct: true }],
  run({ nums }, t) {
    const n = nums.length;
    const all: number[][] = [];
    t.frame({ line: 'mask', caption: `${n} items → 2^${n} = ${1 << n} subsets. Trick: 0 se ${(1 << n) - 1} tak har number ek subset hai — bit i on = nums[i] liya. Recursion ki zaroorat nahi.`, panels: [array(nums, { label: 'nums' })] });
    for (let mask = 0; mask < 1 << n; mask++) {
      const cur: number[] = [];
      for (let i = 0; i < n; i++) if ((mask >> i) & 1) cur.push(nums[i]);
      all.push(cur);
      const tones: Tones = Object.fromEntries(nums.map((_, i) => [i, (mask >> i) & 1 ? 'found' : 'muted']));
      t.frame({ line: 'pick', caption: `mask = ${mask} (${mask.toString(2).padStart(n, '0')}): ${cur.length ? `bits on → ${cur.join(', ')}` : 'koi bit on nahi → khaali subset'}.`, vars: { mask }, legend: { found: 'liya', muted: 'chhoda' }, panels: [bitGrid([{ label: `mask = ${mask}`, v: mask }], n, onesTone(0, mask, n, 'found')), array(nums, { label: 'nums (bit i = index i)', tones })] });
    }
    const s = listStr(all.map((c) => listStr(c)));
    t.frame({ line: 'done', caption: `${all.length} subsets. Har mask par n bits check → O(2ⁿ · n). n ≤ 20 tak theek (10 lakh masks).`, panels: [array(all.map((c) => listStr(c)), { label: 'saare subsets' })] });
    return s;
  },
});

// ---------- Example 1: Single number ----------
export const singleTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (ek akela, baaki jode)', default: [7, 3, 5, 3, 7], minLen: 1, maxLen: 9, min: 0, max: 15 }],
  check: ({ nums }) => {
    const c = new Map<number, number>();
    nums.forEach((x) => c.set(x, (c.get(x) ?? 0) + 1));
    const odd = [...c.values()].filter((v) => v === 1).length;
    return odd === 1 && [...c.values()].every((v) => v === 1 || v === 2) ? null : 'Exactly ek number akela, baaki har number 2 baar.';
  },
  run({ nums }, t) {
    const w = widthFor(nums);
    let r = 0;
    t.frame({ caption: 'XOR ke do rule: x ^ x = 0 (same bits kat jaate), x ^ 0 = x. Aur order se farak nahi. To sabka XOR = jode kat jaayenge, akela bachega.', panels: [array(nums, { label: 'nums' }), bitGrid([{ label: 'r = 0', v: 0 }], w)] });
    nums.forEach((x, i) => {
      const nr = r ^ x;
      t.frame({ line: 'xor', caption: `r ^ ${x} = ${nr}. ${x}${nums.indexOf(x) < i ? ' dusri baar aaya — uske bits wapas palat gaye (kat gaya).' : ' ke bits r mein palte.'}`, vars: { r: nr }, legend: { found: 'r mein 1' }, panels: [array(nums, { label: 'nums', tones: { [i]: 'active' } }), bitGrid([{ label: `r = ${r}`, v: r }, { label: `x = ${x}`, v: x }, { label: `r ^ x = ${nr}`, v: nr }], w, onesTone(2, nr, w, 'found'))] });
      r = nr;
    });
    t.frame({ line: 'done', caption: `Akela = ${r}. Ek pass, O(1) memory — HashMap ki zaroorat nahi.`, legend: { found: 'jawab' }, panels: [array(nums, { label: 'nums', tones: Object.fromEntries(nums.map((x, i) => [i, x === r ? 'found' : 'muted'])) })] });
    return String(r);
  },
});

// ---------- Example 2: Missing number ----------
export const missingTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (0..n mein se ek gayab)', default: [4, 0, 1, 3], minLen: 1, maxLen: 8, min: 0, max: 8, distinct: true }],
  check: ({ nums }) => (nums.every((x) => x <= nums.length) ? null : 'Har number 0 se n (array ki length) tak ho.'),
  run({ nums }, t) {
    const n = nums.length;
    let x = n;
    t.frame({ line: 'xor', caption: `Numbers 0..${n} mein se ${n} hain, ek gayab. Har index (0..${n}) aur har value — sab XOR karo. Jo number dono jagah hai, 2 baar aayega → kat jaayega. Shuru x = ${n} (index ${n} loop mein nahi aata).`, vars: { x }, panels: [array(nums, { label: 'nums' })] });
    nums.forEach((v, i) => {
      const nx = x ^ i ^ v;
      t.frame({ line: 'xor', caption: `x ^ ${i} (index) ^ ${v} (value) = ${nx}.`, vars: { x: nx }, legend: { active: 'abhi' }, panels: [array(nums, { label: 'nums', tones: { [i]: 'active' } }), bitGrid([{ label: `x = ${x}`, v: x }, { label: `i = ${i}`, v: i }, { label: `nums[i] = ${v}`, v }, { label: `naya x = ${nx}`, v: nx }], widthFor([n]))] });
      x = nx;
    });
    t.frame({ line: 'done', caption: `Gayab = ${x}. Doosra tareeka: n(n+1)/2 − sum — par bade n par sum overflow ho sakta, XOR mein nahi. O(n), O(1).`, legend: { found: 'gayab' }, panels: [array(Array.from({ length: n + 1 }, (_, k) => k), { label: `0..${n}`, tones: { [x]: 'found' } })] });
    return String(x);
  },
});

// ---------- Example 3: Single number III (do akele) ----------
export const single3Trace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (do akele, baaki jode)', default: [6, 4, 9, 6, 4, 2], minLen: 2, maxLen: 8, min: 0, max: 15 }],
  check: ({ nums }) => {
    const c = new Map<number, number>();
    nums.forEach((x) => c.set(x, (c.get(x) ?? 0) + 1));
    const vals = [...c.values()];
    return vals.filter((v) => v === 1).length === 2 && vals.every((v) => v === 1 || v === 2) ? null : 'Exactly 2 number akele, baaki har number 2 baar.';
  },
  run({ nums }, t) {
    const w = widthFor(nums);
    let all = 0;
    for (const x of nums) all ^= x;
    t.frame({ line: 'all', caption: `Sabka XOR = jode kat gaye, bacha a ^ b = ${all}. Par a aur b alag kaise karein? Jahan ${all} mein 1 hai, wahan a aur b ke bits ALAG hain.`, panels: [array(nums, { label: 'nums' }), bitGrid([{ label: `a ^ b = ${all}`, v: all }], w, onesTone(0, all, w, 'compare'))] });
    const diff = all & -all;
    const col = w - 1 - Math.log2(diff);
    t.frame({ line: 'bit', caption: `diff = all & −all = ${diff} → sirf sabse right ka 1 (bit ${Math.log2(diff)}). Is bit par a aur b alag — ek ka 1, doosre ka 0.`, legend: { new: 'diff bit' }, panels: [bitGrid([{ label: `a ^ b = ${all}`, v: all }, { label: `diff = ${diff}`, v: diff }], w, { [`0,${col}`]: 'new', [`1,${col}`]: 'new' })] });
    let a = 0;
    let b = 0;
    const g: Tones = {};
    nums.forEach((x, i) => {
      const inA = (x & diff) !== 0;
      if (inA) a ^= x;
      else b ^= x;
      g[i] = inA ? 'found' : 'compare';
      t.frame({ line: 'split', caption: `${x}: bit ${Math.log2(diff)} = ${inA ? 1 : 0} → group ${inA ? 'A' : 'B'}.${i === 0 ? ' Jode hamesha ek hi group mein jaate (same bits) — har group mein ek akela + jode.' : ''}`, vars: { A: a, B: b }, legend: { found: 'group A (bit 1)', compare: 'group B (bit 0)' }, panels: [array(nums, { label: 'nums', tones: { ...g, [i]: 'active' } }), bitGrid([{ label: `x = ${x}`, v: x }], w, { [`0,${col}`]: inA ? 'found' : 'compare' })] });
    });
    const res = [a, b].sort((p, q) => p - q);
    t.frame({ line: 'done', caption: `Group A ka XOR = ${a}, group B ka = ${b}. Dono akele: ${listStr(res)}. 2 pass, O(1) memory.`, legend: { found: 'group A', compare: 'group B' }, panels: [array(nums, { label: 'nums', tones: g })] });
    return listStr(res);
  },
});
