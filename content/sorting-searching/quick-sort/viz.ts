import { array, ids, listStr, swap, tracer, type Recorder } from '@/components/viz/engine/tracer';
import type { Panel, Tone, ToneMap } from '@/components/viz/engine/types';

const span = (from: number, to: number, tone: Tone): ToneMap => Object.fromEntries(Array.from({ length: Math.max(0, to - from + 1) }, (_, q) => [from + q, tone]));
const PART_LEGEND = { found: 'pivot se chhota', active: 'pivot', muted: 'bada / dekh liya' };

/** Lomuto partition (beech wala pivot) — frames ke saath. Returns pivot ki final jagah. */
function partition(t: Recorder, a: number[], id: string[], l: number, r: number, panel: (tones: ToneMap, ptr: Record<string, number>) => Panel[], lines = true) {
  const m = Math.floor((l + r) / 2);
  swap(a, m, r);
  swap(id, m, r);
  const pivot = a[r];
  let s = l;
  t.frame({ line: lines ? 'pivot' : undefined, caption: `Pivot = beech wala ${pivot}. Use end (index ${r}) par rakha. Ab ${l}..${r - 1} mein chhote items aage laayenge; s = ${l} (chhoton ka end).`, vars: { pivot, s }, legend: PART_LEGEND, panels: panel({ [r]: 'active' }, { s }) });
  for (let i = l; i < r; i++) {
    const small = a[i] < pivot;
    t.frame({ line: lines ? 'check' : undefined, caption: small ? `${a[i]} < ${pivot} → chhota! s (${s}) wali jagah se swap.` : `${a[i]} ≥ ${pivot} → bada, yahin rehne do.`, vars: { pivot, i, s }, legend: PART_LEGEND, panels: panel({ ...span(l, s - 1, 'found'), ...span(s, i - 1, 'muted'), [i]: 'compare', [r]: 'active' }, { i, s }) });
    if (small) {
      swap(a, i, s);
      swap(id, i, s);
      s++;
      t.frame({ line: lines ? 'swap' : undefined, caption: `Swap → ${a[s - 1]} chhoton mein. s = ${s}.`, vars: { pivot, i, s }, legend: PART_LEGEND, panels: panel({ ...span(l, s - 1, 'found'), ...span(s, i, 'muted'), [r]: 'active' }, { i, s }) });
    }
  }
  swap(a, s, r);
  swap(id, s, r);
  t.frame({ line: lines ? 'place' : undefined, caption: `Pivot ${pivot} ko index ${s} par rakha: left sab chhote, right sab bade/barabar. ${pivot} ki jagah ab PAKKI — dobara kabhi nahi hilega.`, vars: { pivot, p: s }, legend: { ...PART_LEGEND, done: 'pakki jagah' }, panels: panel({ ...span(l, s - 1, 'found'), ...span(s + 1, r, 'muted'), [s]: 'done' }, { p: s }) });
  return s;
}

// ---------- 3. Visual intro: ek partition ----------
export const partitionBars = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr', default: [7, 2, 9, 4, 6, 1, 8, 3], minLen: 2, maxLen: 8, min: 1, max: 20 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const bars = (tones: ToneMap): Panel[] => [{ kind: 'bars', values: [...a], ids: [...id], tones }];
    t.frame({ caption: 'Quick sort ka dil = PARTITION: ek pivot chuno, chhote items uske left, bade right. Bas ek pass.', panels: bars({}) });
    const p = partition(t, a, id, 0, a.length - 1, (tones) => bars(tones), false);
    t.frame({ caption: `Partition khatam. Pivot index ${p} par pakka. Ab left (${p} items) aur right (${a.length - 1 - p} items) ko alag-alag isi tarah sort karo — recursion.`, panels: bars({ [p]: 'done' }) });
    return listStr(a);
  },
});

// ---------- 4. How: quick sort ----------
export const quickSortTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr', default: [10, 80, 30, 90, 40, 50, 70], minLen: 1, maxLen: 8, min: -9, max: 99 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const fixed: ToneMap = {};
    const sort = (l: number, r: number) => {
      if (l >= r) {
        if (l === r) {
          fixed[l] = 'done';
          t.frame({ line: 'base', caption: `Range ${l}..${r} mein ek hi item (${a[l]}) — wo apni jagah par. Base case.`, panels: [array(a, { ids: id, tones: { ...fixed } })] });
        }
        return;
      }
      const p = partition(t, a, id, l, r, (tones, ptr) => [array(a, { ids: id, tones: { ...fixed, ...tones }, pointers: ptr, ranges: [{ from: l, to: r, label: `${l}..${r}`, tone: 'compare' }] })]);
      fixed[p] = 'done';
      sort(l, p - 1);
      sort(p + 1, r);
    };
    sort(0, a.length - 1);
    t.frame({ line: 'place', caption: `Sorted ${listStr(a)}. Har partition ek pivot ko pakka karta hai. Pivot beech ka ho to log n levels → O(n log n); hamesha sabse chhota/bada ho to n levels → O(n²).`, panels: [array(a, { ids: id, tones: span(0, a.length - 1, 'done') })] });
    return listStr(a);
  },
});

// ---------- Example 1: even pehle, odd baad ----------
export const parityTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [3, 1, 2, 4], minLen: 1, maxLen: 8, min: 0, max: 20 }],
  run({ nums }, t) {
    const a = [...nums];
    const id = ids(a.length);
    let s = 0;
    const legend = { found: 'even zone', muted: 'odd (dekh liya)' };
    for (let i = 0; i < a.length; i++) {
      const even = a[i] % 2 === 0;
      t.frame({ line: 'check', caption: even ? `${a[i]} even → even zone ke end (s = ${s}) par bhejo.` : `${a[i]} odd → yahin rehne do.`, vars: { i, s }, legend, panels: [array(a, { ids: id, tones: { ...span(0, s - 1, 'found'), ...span(s, i - 1, 'muted'), [i]: 'compare' }, pointers: { i, s } })] });
      if (even) {
        swap(a, i, s);
        swap(id, i, s);
        s++;
        t.frame({ line: 'swap', caption: `Swap → even zone ab 0..${s - 1}.`, vars: { i, s }, legend, panels: [array(a, { ids: id, tones: { ...span(0, s - 1, 'found'), ...span(s, i, 'muted') }, pointers: { i, s } })] });
      }
    }
    t.frame({ line: 'swap', caption: `${listStr(a)}: pehle ${s} even, phir odd. Ye quick sort ka partition hi hai — pivot ki jagah condition "even hai?".`, legend: { found: 'even', muted: 'odd' }, panels: [array(a, { ids: id, tones: { ...span(0, s - 1, 'found'), ...span(s, a.length - 1, 'muted') } })] });
    return listStr(a);
  },
});

// ---------- Example 2: sort colors (Dutch national flag) ----------
export const colorsTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (sirf 0, 1, 2)', default: [2, 0, 2, 1, 1, 0], minLen: 1, maxLen: 10, min: 0, max: 2 }],
  run({ nums }, t) {
    const a = [...nums];
    const id = ids(a.length);
    let low = 0;
    let mid = 0;
    let high = a.length - 1;
    const legend = { new: '0 zone', compare: '1 zone', done: '2 zone' };
    const view = (extra: ToneMap = {}): Panel[] => [
      array(a, { ids: id, tones: { ...span(0, low - 1, 'new'), ...span(low, mid - 1, 'compare'), ...span(high + 1, a.length - 1, 'done'), ...extra }, pointers: { low, mid, ...(high >= 0 ? { high } : {}) } }),
    ];
    t.frame({ line: 'one', caption: 'Teen pointers: [0, low) = 0s, [low, mid) = 1s, [mid, high] = abhi dekhe nahi, (high, end] = 2s. mid ko dekhte jao.', vars: { low, mid, high }, legend, panels: view() });
    while (mid <= high) {
      const v = a[mid];
      if (v === 0) {
        swap(a, low, mid);
        swap(id, low, mid);
        low++;
        mid++;
        t.frame({ line: 'zero', caption: `0 mila → low wali jagah se swap (wahan 1 tha ya khud). low++, mid++.`, vars: { low, mid, high }, legend, panels: view({ [low - 1]: 'found' }) });
      } else if (v === 1) {
        mid++;
        t.frame({ line: 'one', caption: `1 mila → pehle se 1 zone mein. Sirf mid++.`, vars: { low, mid, high }, legend, panels: view() });
      } else {
        swap(a, mid, high);
        swap(id, mid, high);
        high--;
        t.frame({ line: 'two', caption: `2 mila → high wali jagah se swap, high--. mid WAHI — peeche se aaya item (${a[mid]}) abhi dekha nahi!`, vars: { low, mid, high }, legend, panels: view({ [high + 1]: 'found' }) });
      }
    }
    t.frame({ line: 'one', caption: `mid > high → sab dekh liya. ${listStr(a)} — ek pass, O(n), O(1).`, legend, panels: view() });
    return listStr(a);
  },
});

// ---------- Example 3: kth largest (quickselect) ----------
export const quickselectTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [3, 2, 1, 5, 6, 4], minLen: 1, maxLen: 8, min: 0, max: 20 },
    { name: 'k', type: 'int', label: 'k', default: 2, min: 1, max: 8 },
  ],
  check: ({ nums, k }) => (k <= nums.length ? null : `k (${k}) array ki length (${nums.length}) se bada nahi ho sakta.`),
  run({ nums, k }, t) {
    const a = [...nums];
    const id = ids(a.length);
    const target = a.length - k;
    let l = 0;
    let r = a.length - 1;
    const out: ToneMap = {};
    t.frame({ line: 'part', caption: `${k}-th sabse bada = sorted order mein index ${target} wala. Poora sort nahi karenge — sirf wo hissa jismein index ${target} hai.`, vars: { target }, panels: [array(a, { ids: id, pointers: { target } })] });
    for (;;) {
      const p = partition(t, a, id, l, r, (tones, ptr) => [array(a, { ids: id, tones: { ...out, ...tones }, pointers: ptr, ranges: [{ from: l, to: r, label: 'abhi ka hissa', tone: 'compare' }] })], false);
      t.frame({ line: 'part', caption: `Pivot ${a[p]} index ${p} par pakka. Target index ${target}.`, vars: { p, target }, panels: [array(a, { ids: id, tones: { ...out, [p]: 'done' }, pointers: { p, target } })] });
      if (p === target) {
        t.frame({ line: 'found', caption: `p == target → answer ${a[p]}! Baaki hisse sort hi nahi kiye. Average n + n/2 + n/4 + … ≈ 2n → O(n).`, vars: { answer: a[p] }, panels: [array(a, { ids: id, tones: { ...out, [p]: 'found' } })] });
        return String(a[p]);
      }
      if (p < target) {
        for (let q = l; q <= p; q++) out[q] = 'muted';
        l = p + 1;
        t.frame({ line: 'right', caption: `p (${p}) < target → answer right mein. Left wala hissa (0..${p}) hamesha ke liye chhod do.`, vars: { l, r }, panels: [array(a, { ids: id, tones: out, ranges: [{ from: l, to: r, label: 'bacha', tone: 'compare' }] })] });
      } else {
        for (let q = p; q <= r; q++) out[q] = 'muted';
        r = p - 1;
        t.frame({ line: 'left', caption: `p (${p}) > target → answer left mein. Right wala hissa chhodo.`, vars: { l, r }, panels: [array(a, { ids: id, tones: out, ranges: [{ from: l, to: r, label: 'bacha', tone: 'compare' }] })] });
      }
    }
  },
});
