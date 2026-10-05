import { array, listStr, tracer, type Recorder } from '@/components/viz/engine/tracer';
import type { ArrRange, Cell, Panel, Tone, ToneMap } from '@/components/viz/engine/types';

/** half-open [lo, hi) ke bahar grey */
const outside = (n: number, lo: number, hi: number): ToneMap => {
  const t: ToneMap = {};
  for (let i = 0; i < n; i++) if (i < lo || i >= hi) t[i] = 'muted';
  return t;
};
const LEGEND = { muted: 'hata diya', compare: 'mid' };

// ---------- 3. Visual intro: F F F T T T — pehla T kahan? ----------
export const boundaryViz = tracer<{ n: number; first: number }>({
  inputs: [
    { name: 'n', type: 'int', label: 'Kitne din', default: 12, min: 2, max: 16 },
    { name: 'first', type: 'int', label: 'Kis din se paudha 10cm+ (n + 1 = kabhi nahi)', default: 8, min: 1, max: 17 },
  ],
  check: ({ n, first }) => (first <= n + 1 ? null : `Din 1 se ${n + 1} ke beech rakho.`),
  run({ n, first }, t) {
    const days = Array.from({ length: n }, (_, i) => i + 1);
    const truth: Cell[] = days.map((d) => (d >= first ? 'T' : 'F'));
    const probed = new Set<number>();
    const row = (lo: number, hi: number, mid?: number): Panel[] => {
      const known: Cell[] = truth.map((v, i) => (probed.has(i) ? v : '?'));
      const tones = outside(n, lo - 1, hi - 1);
      if (mid !== undefined) tones[mid - 1] = 'compare';
      return [array(days, { label: 'Din', tones }), array(known, { label: '10cm+ ? (T/F)', tones: Object.fromEntries([...probed].map((i) => [i, (truth[i] === 'T' ? 'found' : 'error') as Tone])) })];
    };
    let lo = 1;
    let hi = n + 1;
    t.frame({ caption: 'Paudha roz badhta hai — ek baar 10cm paar kiya to hamesha paar. To answer F F F … T T T jaisa hai. Pehla T dhoondhna hai, kam se kam naap ke.', vars: { lo, hi }, legend: { ...LEGEND, found: 'T', error: 'F' }, panels: row(lo, hi) });
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      probed.add(mid - 1);
      const yes = mid >= first;
      t.frame({ caption: yes ? `Din ${mid} naapa → T. Pehla T yahi ya isse pehle → hi = ${mid} (mid ko rakho!).` : `Din ${mid} naapa → F. Pehla T iske baad → lo = ${mid + 1}.`, vars: { lo, hi, mid }, legend: { ...LEGEND, found: 'T', error: 'F' }, panels: row(lo, hi, mid) });
      if (yes) hi = mid;
      else lo = mid + 1;
    }
    t.frame({ caption: lo <= n ? `lo == hi = ${lo} → pehla T din ${lo}. Sirf ${probed.size} baar naapa. Yahi "first true" template har variation ka baap hai.` : `lo == hi = ${n + 1} → koi T nahi (paudha kabhi 10cm nahi pahuncha).`, vars: { answer: lo }, legend: { found: 'T', error: 'F' }, panels: row(lo, lo) });
    return String(lo);
  },
});

/** lower/upper bound frames */
function bound(t: Recorder, a: number[], x: number, strict: boolean, line: { mid?: string; yes?: string; no?: string; done?: string; init?: string }, note = '') {
  const n = a.length;
  const pred = (v: number) => (strict ? v > x : v >= x);
  const sym = strict ? '>' : '≥';
  const predRow = (): Panel => array(a.map((v) => (pred(v) ? 'T' : 'F')), { label: `a[i] ${sym} ${x} ?`, tones: Object.fromEntries(a.map((v, i) => [i, (pred(v) ? 'found' : 'error') as Tone])) });
  let lo = 0;
  let hi = n;
  t.frame({ line: line.init, caption: `${note}Dhoondho pehla index jahan a[i] ${sym} ${x}. Range [lo, hi) = [0, ${n}) — hi = ${n} ka matlab "koi nahi".`, vars: { lo, hi }, legend: { ...LEGEND, found: 'T', error: 'F' }, panels: [array(a, { tones: outside(n, lo, hi), pointers: { lo, hi } }), predRow()] });
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const yes = pred(a[mid]);
    t.frame({ line: line.mid, caption: `mid = ${mid}, a[mid] = ${a[mid]} → ${yes ? 'T' : 'F'}.`, vars: { lo, hi, mid }, legend: { ...LEGEND, found: 'T', error: 'F' }, panels: [array(a, { tones: { ...outside(n, lo, hi), [mid]: 'compare' }, pointers: { lo, mid, hi } }), predRow()] });
    if (yes) hi = mid;
    else lo = mid + 1;
    t.frame({ line: yes ? line.yes : line.no, caption: yes ? `T → answer mid ya usse pehle. hi = ${hi} (mid range mein raha).` : `F → mid tak sab F. lo = ${lo}.`, vars: { lo, hi }, legend: { ...LEGEND, found: 'T', error: 'F' }, panels: [array(a, { tones: outside(n, lo, hi), pointers: { lo, hi } }), predRow()] });
  }
  return lo;
}

// ---------- 4. How: lower bound ----------
export const lowerTrace = tracer<{ nums: number[]; x: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums (sorted)', default: [1, 2, 4, 4, 4, 7, 9], minLen: 1, maxLen: 10, min: 0, max: 20, sorted: true },
    { name: 'x', type: 'int', label: 'x', default: 4, min: -2, max: 22 },
  ],
  run({ nums, x }, t) {
    const lo = bound(t, nums, x, false, { init: 'init', mid: 'mid', yes: 'yes', no: 'no' });
    t.frame({ line: 'done', caption: lo < nums.length ? `lo == hi = ${lo} → pehla a[i] ≥ ${x} index ${lo} par (${nums[lo]}). Duplicates ho to bhi PEHLA milta hai.` : `lo = ${nums.length} → sab ${x} se chhote (insert end mein).`, vars: { answer: lo }, panels: [array(nums, { tones: lo < nums.length ? { [lo]: 'found' } : {} })] });
    return String(lo);
  },
});

// ---------- Example 1: first bad version ----------
export const badTrace = tracer<{ n: number; firstBad: number }>({
  inputs: [
    { name: 'n', type: 'int', label: 'Versions n', default: 10, min: 1, max: 16 },
    { name: 'firstBad', type: 'int', label: 'Pehla kharab (chhupa)', default: 4, min: 1, max: 16 },
  ],
  check: ({ n, firstBad }) => (firstBad <= n ? null : `Pehla kharab 1..${n} ke beech hona chahiye.`),
  run({ n, firstBad }, t) {
    const v = Array.from({ length: n }, (_, i) => i + 1);
    const seen: ToneMap = {};
    let calls = 0;
    let lo = 1;
    let hi = n;
    const panel = (mid?: number) => array(v, { label: 'versions', tones: { ...outside(n, lo - 1, hi), ...seen, ...(mid ? { [mid - 1]: 'compare' as Tone } : {}) }, pointers: { lo: lo - 1, ...(mid ? { mid: mid - 1 } : {}), hi: hi - 1 } });
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      t.frame({ line: 'mid', caption: `mid = ${mid}. isBadVersion(${mid}) poochho.`, vars: { lo, hi, mid, calls }, legend: { ...LEGEND, error: 'kharab', done: 'theek' }, panels: [panel(mid)] });
      calls++;
      const bad = mid >= firstBad;
      seen[mid - 1] = bad ? 'error' : 'done';
      if (bad) {
        hi = mid;
        t.frame({ line: 'bad', caption: `${mid} kharab → pehla kharab ${mid} ya pehle. hi = ${hi}.`, vars: { lo, hi, calls }, legend: { ...LEGEND, error: 'kharab', done: 'theek' }, panels: [panel()] });
      } else {
        lo = mid + 1;
        t.frame({ line: 'good', caption: `${mid} theek → pehla kharab iske baad. lo = ${lo}.`, vars: { lo, hi, calls }, legend: { ...LEGEND, error: 'kharab', done: 'theek' }, panels: [panel()] });
      }
    }
    t.frame({ line: 'done', caption: `lo == hi = ${lo} → pehla kharab version ${lo}. Sirf ${calls} API calls (≈ log₂ ${n}).`, vars: { answer: lo, calls }, legend: { error: 'kharab', done: 'theek' }, panels: [array(v, { label: 'versions', tones: Object.fromEntries(v.map((_, i) => [i, (i + 1 >= lo ? 'error' : 'done') as Tone])) })] });
    return String(lo);
  },
});

// ---------- Example 2: first and last position ----------
export const rangeTrace = tracer<{ nums: number[]; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums (sorted)', default: [5, 7, 7, 8, 8, 10], minLen: 1, maxLen: 10, min: 0, max: 12, sorted: true },
    { name: 'target', type: 'int', label: 'target', default: 8, min: 0, max: 12 },
  ],
  run({ nums, target }, t) {
    const first = bound(t, nums, target, false, { init: 'first', mid: 'first', yes: 'first', no: 'first' }, 'Search 1 (lower bound): ');
    if (first === nums.length || nums[first] !== target) {
      t.frame({ line: 'none', caption: `lowerBound = ${first}, par ${first === nums.length ? 'wahan koi item nahi' : `a[${first}] = ${nums[first]} ≠ ${target}`} → target hai hi nahi → [-1, -1].`, panels: [array(nums)] });
      return listStr([-1, -1]);
    }
    t.frame({ line: 'first', caption: `Pehla ${target} index ${first} par. Ab aakhri: pehla > ${target} dhoondho, uske theek pehle wala.`, panels: [array(nums, { tones: { [first]: 'found' } })] });
    const up = bound(t, nums, target, true, { init: 'last', mid: 'last', yes: 'last', no: 'last' }, 'Search 2 (upper bound): ');
    const last = up - 1;
    const ranges: ArrRange[] = [{ from: first, to: last, label: `${target} × ${last - first + 1}`, tone: 'found' }];
    t.frame({ line: 'last', caption: `upperBound = ${up} → aakhri = ${last}. Answer [${first}, ${last}]. Do binary search → O(log n), chahe ${target} hazaar baar ho.`, panels: [array(nums, { ranges })] });
    return listStr([first, last]);
  },
});

// ---------- Example 3: search in rotated sorted array ----------
export const rotatedTrace = tracer<{ nums: number[]; rot: number; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'Sorted (distinct) — hum ghumaayenge', default: [0, 1, 2, 4, 5, 6, 7], minLen: 1, maxLen: 9, min: 0, max: 20, sorted: true, distinct: true },
    { name: 'rot', type: 'int', label: 'Kitna ghumaayein (rotate)', default: 3, min: 0, max: 8 },
    { name: 'target', type: 'int', label: 'target', default: 0, min: 0, max: 20 },
  ],
  check: ({ nums, rot }) => (rot < nums.length ? null : `Rotate ${nums.length} se kam rakho.`),
  run({ nums, rot, target }, t) {
    const a = [...nums.slice(rot), ...nums.slice(0, rot)];
    const n = a.length;
    let lo = 0;
    let hi = n - 1;
    const view = (mid?: number, sorted?: [number, number], tone: Tone = 'compare') => {
      const tones: ToneMap = {};
      for (let i = 0; i < n; i++) if (i < lo || i > hi) tones[i] = 'muted';
      if (mid !== undefined) tones[mid] = tone;
      return [array(a, { tones, pointers: lo <= hi ? { lo, ...(mid !== undefined ? { mid } : {}), hi } : {}, ranges: sorted ? [{ from: sorted[0], to: sorted[1], label: 'sorted', tone: 'active' }] : [] })];
    };
    t.frame({ line: 'found', caption: `Sorted array ko ${rot} jagah ghumaya → ${listStr(a)}. Poora sorted nahi, par mid se todo to KAM SE KAM EK half hamesha sorted hota hai.`, legend: LEGEND, panels: view() });
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (a[mid] === target) {
        t.frame({ line: 'found', caption: `a[${mid}] = ${target} → mil gaya!`, vars: { lo, hi, mid }, legend: { ...LEGEND, found: 'mil gaya' }, panels: view(mid, undefined, 'found') });
        return String(mid);
      }
      if (a[lo] <= a[mid]) {
        const inside = target >= a[lo] && target < a[mid];
        t.frame({ line: 'leftSorted', caption: `a[lo] = ${a[lo]} ≤ a[mid] = ${a[mid]} → LEFT half sorted. ${target} ${inside ? `${a[lo]}..${a[mid]} ke andar → left jao` : `us range mein nahi → right jao`}.`, vars: { lo, hi, mid }, legend: LEGEND, panels: view(mid, [lo, mid]) });
        if (inside) hi = mid - 1;
        else lo = mid + 1;
      } else {
        const inside = target > a[mid] && target <= a[hi];
        t.frame({ line: 'rightSorted', caption: `a[lo] = ${a[lo]} > a[mid] = ${a[mid]} → RIGHT half sorted. ${target} ${inside ? `${a[mid]}..${a[hi]} ke andar → right jao` : `us range mein nahi → left jao`}.`, vars: { lo, hi, mid }, legend: LEGEND, panels: view(mid, [mid, hi]) });
        if (inside) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    t.frame({ line: 'none', caption: `Range khaali → −1. Har kadam aadha hissa gaya → O(log n).`, legend: LEGEND, panels: view() });
    return '-1';
  },
});
