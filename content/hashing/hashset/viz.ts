import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Tone, ToneMap } from '@/components/viz/engine/types';

// ---------- 3. Visual intro: duplicates apne aap hatte hain ----------
export const setDedupe = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Numbers (duplicates ke saath)', default: [3, 1, 3, 2, 1, 5], minLen: 1, maxLen: 10, min: 0, max: 20 }],
  run({ arr }, t) {
    const set: number[] = [];
    t.frame({ caption: 'HashSet = sirf UNIQUE items ka thaila. Ek-ek number daalte hain — dekho duplicate ke saath kya hota hai.', panels: [array(arr, { label: 'list' }), array(set, { label: 'set' })] });
    arr.forEach((x, i) => {
      const dup = set.includes(x);
      if (!dup) set.push(x);
      t.frame({
        caption: dup ? `add(${x}) → ${x} pehle se hai, add() ne false diya aur kuch nahi badla.` : `add(${x}) → naya hai, set mein aa gaya (add() = true).`,
        vars: { i, 'set size': set.length },
        legend: { error: 'duplicate — reject', new: 'naya' },
        panels: [
          array(arr, { label: 'list', tones: { [i]: dup ? 'error' : 'new' }, pointers: { i } }),
          array(set, { label: 'set', tones: dup ? { [set.indexOf(x)]: 'error' } : { [set.length - 1]: 'new' } }),
        ],
      });
    });
    t.frame({
      caption: `${arr.length} numbers mein se ${set.length} unique. "Hai ya nahi?" check O(1) average. (HashSet ka order fixed nahi hota — yahan samjhane ke liye aane ka order dikhaya.)`,
      vars: { 'set size': set.length },
      panels: [array(arr, { label: 'list' }), array(set, { label: 'set' })],
    });
    return listStr(set);
  },
});

// ---------- 4. How: set operations ----------
export const setOpsTrace = tracer<{ a: number[]; b: number[] }>({
  inputs: [
    { name: 'a', type: 'intArray', label: 'Set a', default: [1, 2, 3, 4], minLen: 1, maxLen: 6, min: 0, max: 9, distinct: true },
    { name: 'b', type: 'intArray', label: 'Set b', default: [3, 4, 5], minLen: 1, maxLen: 6, min: 0, max: 9, distinct: true },
  ],
  run({ a, b }, t) {
    const A = [...a].sort((x, y) => x - y);
    const B = [...b].sort((x, y) => x - y);
    const inB = (x: number) => B.includes(x);
    const inA = (x: number) => A.includes(x);
    const x = a[Math.min(1, a.length - 1)];
    t.frame({ line: 'add', caption: `a.add(${x}) → ${x} pehle se a mein hai → false. Set mein duplicate nahi aata.`, panels: [array(A, { label: 'a', tones: { [A.indexOf(x)]: 'error' } }), array(B, { label: 'b' })] });
    const y = b[0];
    t.frame({ line: 'contains', caption: `${y} in a → ${inA(y)}. Hash se seedha bucket — O(1).`, panels: [array(A, { label: 'a', tones: inA(y) ? { [A.indexOf(y)]: 'found' } : {} }), array(B, { label: 'b', tones: { [B.indexOf(y)]: 'active' } })] });
    const inter = A.filter(inB);
    const both: ToneMap = Object.fromEntries(A.map((v, i) => [i, inB(v) ? 'found' : 'muted']));
    t.frame({ line: 'intersect', caption: `Intersection = dono mein jo hain: ${listStr(inter)}. Chhote set par loop + bade mein contains → O(min(n, m)).`, panels: [array(A, { label: 'a', tones: both }), array(B, { label: 'b', tones: Object.fromEntries(B.map((v, i) => [i, inA(v) ? 'found' : 'muted'])) }), array(inter, { label: 'a ∩ b' })] });
    const uni = [...new Set([...A, ...B])].sort((p, q) => p - q);
    t.frame({ line: 'union', caption: `Union = dono ke saare, bina duplicate: ${listStr(uni)}. O(n + m).`, panels: [array(A, { label: 'a' }), array(B, { label: 'b' }), array(uni, { label: 'a ∪ b', tones: Object.fromEntries(uni.map((_, i) => [i, 'new' as Tone])) })] });
    const minus = A.filter((v) => !inB(v));
    t.frame({ line: 'minus', caption: `Difference a − b = sirf a mein: ${listStr(minus)}.`, panels: [array(A, { label: 'a', tones: Object.fromEntries(A.map((v, i) => [i, inB(v) ? 'muted' : 'found'])) }), array(B, { label: 'b' }), array(minus, { label: 'a − b' })] });
    return 'false';
  },
});

// ---------- Example 1: Happy number ----------
const sq = (n: number) => {
  let s = 0;
  const parts: string[] = [];
  for (let x = n; x > 0; x = Math.floor(x / 10)) {
    const d = x % 10;
    s += d * d;
    parts.unshift(`${d}²`);
  }
  return { s, expr: parts.join(' + ') };
};

export const happyTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 19, min: 1, max: 999 }],
  run({ n }, t) {
    const seen: number[] = [];
    let x = n;
    while (x !== 1) {
      if (seen.includes(x)) {
        t.frame({ line: 'cycle', caption: `${x} pehle aa chuka hai! Ab yahi chakkar baar-baar chalega, 1 kabhi nahi aayega → false.`, vars: { x }, panels: [array(seen, { label: 'seen (set)', tones: { [seen.indexOf(x)]: 'error' } })] });
        return 'false';
      }
      seen.push(x);
      const { s, expr } = sq(x);
      t.frame({ line: 'next', caption: `${x} naya hai, seen mein daala. Agla = ${expr} = ${s}.`, vars: { x, next: s }, panels: [array(seen, { label: 'seen (set)', tones: { [seen.length - 1]: 'new' } })] });
      x = s;
    }
    t.frame({ line: 'happy', caption: `1 aa gaya → happy number! Set ne har number ko O(1) mein "pehle dekha?" check karne diya.`, vars: { x }, panels: [array([...seen, 1], { label: 'sequence', tones: { [seen.length]: 'found' } })] });
    return 'true';
  },
});

// ---------- Example 2: Intersection ----------
export const interTrace = tracer<{ a: number[]; b: number[] }>({
  inputs: [
    { name: 'a', type: 'intArray', label: 'a', default: [4, 9, 5], minLen: 1, maxLen: 8, min: 0, max: 9 },
    { name: 'b', type: 'intArray', label: 'b', default: [9, 4, 9, 8, 4], minLen: 1, maxLen: 8, min: 0, max: 9 },
  ],
  run({ a, b }, t) {
    const setA = [...new Set(a)];
    const res: number[] = [];
    t.frame({ line: 'build', caption: `setA = a ke unique numbers: ${listStr(setA)}. Ab b ke har number ko O(1) mein check kar sakte hain.`, panels: [array(setA, { label: 'setA' }), array(b, { label: 'b' }), array(res, { label: 'res (set)' })] });
    b.forEach((x, i) => {
      const hit = setA.includes(x);
      const dup = hit && res.includes(x);
      if (hit && !dup) res.push(x);
      t.frame({
        line: 'check',
        caption: !hit ? `${x} setA mein nahi — chhodo.` : dup ? `${x} common hai, par res mein pehle se — set ne duplicate rok diya.` : `${x} setA mein hai → res mein daala.`,
        vars: { i, x },
        panels: [
          array(setA, { label: 'setA', tones: hit ? { [setA.indexOf(x)]: 'found' } : {} }),
          array(b, { label: 'b', tones: { [i]: hit ? 'found' : 'compare' }, pointers: { i } }),
          array(res, { label: 'res (set)', tones: hit ? { [res.indexOf(x)]: dup ? 'muted' : 'new' } : {} }),
        ],
      });
    });
    const out = [...res].sort((p, q) => p - q);
    t.frame({ line: 'done', caption: `Answer ${listStr(out)}. O(n + m) time; nested loop wala tareeka O(n × m) hota.`, panels: [array(out, { label: 'answer (sorted)' })] });
    return listStr(out);
  },
});

// ---------- Example 3: Longest consecutive sequence ----------
export const consecTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [100, 4, 200, 1, 3, 2], minLen: 1, maxLen: 10, min: 0, max: 200 }],
  run({ nums }, t) {
    const set = new Set(nums);
    const line = [...set].sort((p, q) => p - q);
    const idx = (v: number) => line.indexOf(v);
    let best = 0;
    t.frame({ line: 'build', caption: 'Saare numbers set mein (neeche sorted dikhaye hain sirf samajhne ke liye — code sort NAHI karta).', panels: [array(nums, { label: 'nums' }), array(line, { label: 'set (sorted view)' })] });
    for (const x of set) {
      if (set.has(x - 1)) {
        t.frame({ line: 'skip', caption: `${x}: ${x - 1} bhi set mein hai → ${x} kisi sequence ka beech ka hissa hai, shuruaat nahi. Skip — isi se O(n) bachta hai.`, vars: { x, best }, panels: [array(line, { label: 'set (sorted view)', tones: { [idx(x)]: 'muted', [idx(x - 1)]: 'compare' } })] });
        continue;
      }
      let len = 1;
      const tones: ToneMap = { [idx(x)]: 'active' };
      t.frame({ line: 'count', caption: `${x}: ${x - 1} set mein nahi → ${x} ek sequence ki SHURUAAT hai. Aage count karte hain.`, vars: { x, len, best }, panels: [array(line, { label: 'set (sorted view)', tones })] });
      while (set.has(x + len)) {
        tones[idx(x + len)] = 'active';
        len++;
        t.frame({ line: 'count', caption: `${x + len - 1} bhi hai → len = ${len}.`, vars: { x, len, best }, panels: [array(line, { label: 'set (sorted view)', tones })] });
      }
      const better = len > best;
      best = Math.max(best, len);
      t.frame({ line: 'best', caption: better ? `Sequence ${x}..${x + len - 1}, length ${len} → naya best!` : `Length ${len}, best (${best}) wahi.`, vars: { x, len, best }, panels: [array(line, { label: 'set (sorted view)', tones: Object.fromEntries(Object.keys(tones).map((k) => [k, (better ? 'found' : 'done') as Tone])) })] });
    }
    t.frame({ caption: `Answer ${best}. Har number sirf ek sequence mein gina jaata hai (sirf shuruaat se count) → total O(n). Sort karte to O(n log n).`, vars: { best }, panels: [array(line, { label: 'set (sorted view)' })] });
    return String(best);
  },
});
