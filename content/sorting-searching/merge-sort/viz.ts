import { array, listStr, tracer, type Recorder } from '@/components/viz/engine/tracer';
import type { ArrRange, Cell, Panel, ToneMap } from '@/components/viz/engine/types';

const halves = (l: number, mid: number, r: number): ArrRange[] => [
  { from: l, to: mid, label: 'left', tone: 'active' },
  { from: mid + 1, to: r, label: 'right', tone: 'compare' },
];

// ---------- 3. Visual intro: 2 sorted lines ko jodna ----------
export const mergeTwo = tracer<{ a: number[]; b: number[] }>({
  inputs: [
    { name: 'a', type: 'intArray', label: 'A (sorted)', default: [2, 5, 8, 12], minLen: 1, maxLen: 5, min: 0, max: 20, sorted: true },
    { name: 'b', type: 'intArray', label: 'B (sorted)', default: [3, 4, 9, 15], minLen: 1, maxLen: 5, min: 0, max: 20, sorted: true },
  ],
  run({ a, b }, t) {
    const out: Cell[] = Array(a.length + b.length).fill(null);
    let i = 0;
    let j = 0;
    let k = 0;
    const view = (ta: ToneMap = {}, tb: ToneMap = {}, to: ToneMap = {}): Panel[] => [
      array(a, { label: 'A', tones: ta, pointers: i < a.length ? { i } : {} }),
      array(b, { label: 'B', tones: tb, pointers: j < b.length ? { j } : {} }),
      array(out, { label: 'Result', tones: to, pointers: k < out.length ? { k } : {} }),
    ];
    t.frame({ caption: '2 SORTED lines. Dono ka sabse chhota hamesha unke AAGE hai — to sirf do aage wale compare karo, chhota result mein. Bas itna hi merge hai.', panels: view() });
    while (i < a.length && j < b.length) {
      const takeA = a[i] <= b[j];
      t.frame({ caption: `A[${i}] = ${a[i]} vs B[${j}] = ${b[j]} → ${takeA ? a[i] : b[j]} chhota.`, vars: { i, j, k }, panels: view({ [i]: 'compare' }, { [j]: 'compare' }) });
      out[k] = takeA ? a[i++] : b[j++];
      k++;
      t.frame({ caption: `${out[k - 1]} result mein. ${takeA ? 'i' : 'j'} aage.`, vars: { i, j, k }, panels: view({}, {}, { [k - 1]: 'new' }) });
    }
    const restA = i < a.length;
    while (i < a.length) out[k++] = a[i++];
    while (j < b.length) out[k++] = b[j++];
    t.frame({ caption: `${restA ? 'B' : 'A'} khatam → ${restA ? 'A' : 'B'} ke bache items (pehle se sorted) seedhe copy. Total kaam = |A| + |B| → O(n).`, vars: { k }, panels: view({}, {}, Object.fromEntries(out.map((_, q) => [q, 'done']))) });
    return listStr(out);
  },
});

// ---------- 4. How: merge sort ----------
export const mergeSortTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr', default: [38, 27, 43, 3, 9, 82, 10], minLen: 1, maxLen: 8, min: -9, max: 99 }],
  run({ arr }, t) {
    const a = [...arr];
    const tmp: Cell[] = Array(a.length).fill(null);
    const sort = (l: number, r: number, depth: number) => {
      if (l >= r) return;
      const mid = Math.floor((l + r) / 2);
      t.frame({ line: 'split', caption: `${l}..${r} ko todo: ${l}..${mid} aur ${mid + 1}..${r}. Pehle dono halves (recursion) sort honge.`, vars: { l, mid, r, depth }, panels: [array(a, { ranges: halves(l, mid, r) })] });
      sort(l, mid, depth + 1);
      sort(mid + 1, r, depth + 1);
      merge(t, a, tmp, l, mid, r, depth);
    };
    t.frame({ line: 'base', caption: 'Merge sort: aadha karte jao jab tak 1 item na bache (1 item = sorted). Phir wapas aate time sorted pieces ko merge karo.', panels: [array(a)] });
    sort(0, a.length - 1, 0);
    t.frame({ line: 'copy', caption: `Sorted ${listStr(a)}. log₂ n levels × har level O(n) merge = O(n log n). tmp array = O(n) extra.`, panels: [array(a, { tones: Object.fromEntries(a.map((_, q) => [q, 'done'])) })] });
    return listStr(a);
  },
});

function merge(t: Recorder, a: number[], tmp: Cell[], l: number, mid: number, r: number, depth: number) {
  tmp.fill(null);
  let i = l;
  let j = mid + 1;
  let k = l;
  const view = (to: ToneMap = {}, ta: ToneMap = {}): Panel[] => [
    array(a, { tones: ta, ranges: halves(l, mid, r), pointers: { ...(i <= mid ? { i } : {}), ...(j <= r ? { j } : {}) } }),
    array(tmp, { label: 'tmp', tones: to }),
  ];
  while (i <= mid && j <= r) {
    const x = a[i];
    const y = a[j];
    const left = x <= y;
    tmp[k] = left ? x : y;
    const was = left ? i : j;
    if (left) i++;
    else j++;
    k++;
    t.frame({ line: 'pick', caption: left ? `${x} ≤ ${y} → ${x} (left se) tmp mein. Barabar ho to left pehle — stable.` : `${y} < ${x} → ${y} (right se) tmp mein.`, vars: { l, mid, r, depth }, panels: view({ [k - 1]: 'new' }, { [was]: 'found' }) });
  }
  if (i <= mid || j <= r) {
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    t.frame({ line: 'rest', caption: 'Ek half khatam — doosre ke bache items pehle se sorted hain, seedhe tmp mein.', vars: { l, mid, r, depth }, panels: view() });
  }
  for (let p = l; p <= r; p++) a[p] = tmp[p] as number;
  t.frame({ line: 'copy', caption: `${l}..${r} ab sorted: ${listStr(a.slice(l, r + 1))}. tmp se wapas copy.`, vars: { l, r, depth }, panels: [array(a, { ranges: [{ from: l, to: r, label: 'sorted', tone: 'found' }] }), array(tmp, { label: 'tmp' })] });
}

// ---------- Example 1: intersection of two arrays ----------
export const intersectTrace = tracer<{ a: number[]; b: number[] }>({
  inputs: [
    { name: 'a', type: 'intArray', label: 'nums1', default: [4, 9, 5], minLen: 1, maxLen: 6, min: 0, max: 9 },
    { name: 'b', type: 'intArray', label: 'nums2', default: [9, 4, 9, 8, 4], minLen: 1, maxLen: 6, min: 0, max: 9 },
  ],
  run({ a: a0, b: b0 }, t) {
    const a = [...a0].sort((x, y) => x - y);
    const b = [...b0].sort((x, y) => x - y);
    const res: number[] = [];
    let i = 0;
    let j = 0;
    const view = (ta: ToneMap = {}, tb: ToneMap = {}): Panel[] => [
      array(a, { label: 'nums1 (sorted)', tones: ta, pointers: i < a.length ? { i } : {} }),
      array(b, { label: 'nums2 (sorted)', tones: tb, pointers: j < b.length ? { j } : {} }),
      { kind: 'text', label: 'res', text: listStr(res) },
    ];
    t.frame({ line: 'sort', caption: 'Dono ko sort kiya. Ab merge jaisa: dono aage wale compare karo.', panels: view() });
    while (i < a.length && j < b.length) {
      if (a[i] < b[j]) {
        t.frame({ line: 'lt', caption: `${a[i]} < ${b[j]} → nums2 mein aage sab ≥ ${b[j]}, to ${a[i]} kabhi nahi milega. i aage.`, vars: { i, j }, panels: view({ [i]: 'muted' }, { [j]: 'compare' }) });
        i++;
      } else if (a[i] > b[j]) {
        t.frame({ line: 'gt', caption: `${a[i]} > ${b[j]} → ${b[j]} nums1 mein nahi milega. j aage.`, vars: { i, j }, panels: view({ [i]: 'compare' }, { [j]: 'muted' }) });
        j++;
      } else {
        res.push(a[i]);
        t.frame({ line: 'eq', caption: `${a[i]} dono mein! res mein daalo, dono aage.`, vars: { i, j }, panels: view({ [i]: 'found' }, { [j]: 'found' }) });
        i++;
        j++;
      }
    }
    t.frame({ line: 'eq', caption: `Ek array khatam → aur common ho hi nahi sakta. Answer ${listStr(res)}. Sort O(n log n + m log m) + walk O(n + m).`, panels: view() });
    return listStr(res);
  },
});

// ---------- Example 2: count inversions ----------
export const invTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr', default: [2, 4, 1, 3, 5], minLen: 1, maxLen: 7, min: 1, max: 20 }],
  run({ arr }, t) {
    const a = [...arr];
    const tmp: number[] = Array(a.length).fill(0);
    let total = 0;
    const go = (l: number, r: number): number => {
      if (l >= r) return 0;
      const mid = Math.floor((l + r) / 2);
      let count = go(l, mid) + go(mid + 1, r);
      t.frame({ line: 'halves', caption: `Halves ${listStr(a.slice(l, mid + 1))} aur ${listStr(a.slice(mid + 1, r + 1))} sorted, unke andar ke inversions count kar liye. Ab sirf CROSS wale (ek left, ek right).`, vars: { total }, panels: [array(a, { ranges: halves(l, mid, r) })] });
      let i = l;
      let j = mid + 1;
      let k = l;
      while (i <= mid && j <= r) {
        if (a[i] <= a[j]) {
          t.frame({ line: 'left', caption: `${a[i]} ≤ ${a[j]} → ${a[i]} pehle; koi inversion nahi.`, vars: { total }, panels: [array(a, { ranges: halves(l, mid, r), tones: { [i]: 'found', [j]: 'compare' }, pointers: { i, j } })] });
          tmp[k++] = a[i++];
        } else {
          const add = mid - i + 1;
          count += add;
          total += add;
          const tones: ToneMap = { [j]: 'found' };
          for (let q = i; q <= mid; q++) tones[q] = 'error';
          t.frame({ line: 'cross', caption: `${a[j]} < ${a[i]} — aur left sorted hai, to ${a[j]} left ke BACHE saare ${add} items (${listStr(a.slice(i, mid + 1))}) se chhota. Ek baar mein +${add}!`, vars: { total }, legend: { error: 'inversion bana' }, panels: [array(a, { ranges: halves(l, mid, r), tones, pointers: { i, j } })] });
          tmp[k++] = a[j++];
        }
      }
      while (i <= mid) tmp[k++] = a[i++];
      while (j <= r) tmp[k++] = a[j++];
      for (let p = l; p <= r; p++) a[p] = tmp[p];
      return count;
    };
    const ans = go(0, a.length - 1);
    t.frame({ line: 'cross', caption: `Inversions = ${ans}. Har cross count O(1) mein (mid − i + 1) — isliye poora O(n log n), bubble ka O(n²) nahi.`, vars: { total: ans }, panels: [array(a)] });
    return String(ans);
  },
});

// ---------- Example 3: reverse pairs ----------
export const reversePairsTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [2, 4, 3, 5, 1], minLen: 1, maxLen: 7, min: -10, max: 20 }],
  run({ nums }, t) {
    const a = [...nums];
    let total = 0;
    const go = (l: number, r: number): number => {
      if (l >= r) return 0;
      const mid = Math.floor((l + r) / 2);
      let count = go(l, mid) + go(mid + 1, r);
      t.frame({ line: 'halves', caption: `Halves sorted: ${listStr(a.slice(l, mid + 1))} | ${listStr(a.slice(mid + 1, r + 1))}. Merge se PEHLE cross jode count karo: left ka x, right ka y, x > 2y.`, vars: { total }, panels: [array(a, { ranges: halves(l, mid, r) })] });
      let j = mid + 1;
      for (let i = l; i <= mid; i++) {
        while (j <= r && a[i] > 2 * a[j]) j++;
        const add = j - (mid + 1);
        count += add;
        total += add;
        const tones: ToneMap = { [i]: 'active' };
        for (let q = mid + 1; q < j; q++) tones[q] = 'found';
        t.frame({ line: 'add', caption: add ? `${a[i]} > 2 × (${listStr(a.slice(mid + 1, j))}) → +${add}. Agla left item bada hai, to j wahin se aage badhega (peeche nahi).` : `${a[i]} kisi right item ke double se bada nahi → +0.`, vars: { total, j }, legend: { found: 'jode bane' }, panels: [array(a, { ranges: halves(l, mid, r), tones, pointers: { i, j } })] });
      }
      const merged = a.slice(l, r + 1).sort((x, y) => x - y);
      for (let p = l; p <= r; p++) a[p] = merged[p - l];
      t.frame({ line: 'merge', caption: `Ab normal merge → ${listStr(merged)}. (Count aur merge alag-alag — merge ki condition a[i] ≤ a[j] hai, count ki x > 2y.)`, vars: { total }, panels: [array(a, { ranges: [{ from: l, to: r, label: 'merged', tone: 'found' }] })] });
      return count;
    };
    const ans = go(0, a.length - 1);
    t.frame({ line: 'merge', caption: `Reverse pairs = ${ans}. Har level par count O(n) (j sirf aage) + merge O(n) → O(n log n).`, vars: { total: ans }, panels: [array(a)] });
    return String(ans);
  },
});
