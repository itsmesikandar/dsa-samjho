import { array, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone, ToneMap } from '@/components/viz/engine/types';

/** range view: [lo, hi] ke bahar grey, mid highlight */
const view = (a: Cell[], lo: number, hi: number, mid?: number, midTone: Tone = 'compare', label?: string) => {
  const tones: ToneMap = {};
  a.forEach((_, i) => {
    if (i < lo || i > hi) tones[i] = 'muted';
  });
  if (mid !== undefined) tones[mid] = midTone;
  const ptr: Record<string, number> = {};
  if (lo <= hi) {
    ptr.lo = lo;
    ptr.hi = hi;
  }
  if (mid !== undefined) ptr.mid = mid;
  return array(a, { label, tones, pointers: ptr });
};
const LEGEND = { muted: 'hata diya', compare: 'mid' };

// ---------- 3. Visual intro: number guess game ----------
export const guessGame = tracer<{ secret: number }>({
  inputs: [{ name: 'secret', type: 'int', label: 'Socha hua number (1..16)', default: 11, min: 1, max: 16 }],
  run({ secret }, t) {
    const a = Array.from({ length: 16 }, (_, i) => i + 1);
    let lo = 0;
    let hi = 15;
    let steps = 0;
    t.frame({ caption: 'Dost ne 1 se 16 ke beech number socha. Tum guess karo, wo bas bolega "bada" ya "chhota". Ek-ek karke poochoge to 16 tak guess. Smart tareeka: hamesha BEECH wala poocho.', vars: { steps }, legend: LEGEND, panels: [view(a, lo, hi)] });
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      steps++;
      if (a[mid] === secret) {
        t.frame({ caption: `Guess ${a[mid]} → "Sahi!" Sirf ${steps} guess. 16 numbers → log₂ 16 = 4 se zyada kabhi nahi lagenge.`, vars: { steps }, legend: { ...LEGEND, found: 'mil gaya' }, panels: [view(a, lo, hi, mid, 'found')] });
        return String(steps);
      }
      const bigger = secret > a[mid];
      t.frame({ caption: `Guess ${a[mid]} → "${bigger ? 'Bada hai' : 'Chhota hai'}". To ${bigger ? `${a[lo]}..${a[mid]}` : `${a[mid]}..${a[hi]}`} sab bekaar — aadhe options ek jhatke mein gaye!`, vars: { steps }, legend: LEGEND, panels: [view(a, lo, hi, mid)] });
      if (bigger) lo = mid + 1;
      else hi = mid - 1;
    }
    return String(steps);
  },
});

// ---------- 4. How: classic binary search ----------
export const bsTrace = tracer<{ nums: number[]; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums (sorted)', default: [-1, 0, 3, 5, 9, 12], minLen: 1, maxLen: 10, min: -9, max: 30, sorted: true, distinct: true },
    { name: 'target', type: 'int', label: 'target', default: 9, min: -9, max: 30 },
  ],
  run({ nums, target }, t) {
    let lo = 0;
    let hi = nums.length - 1;
    t.frame({ line: 'init', caption: `lo = 0, hi = ${hi}. [lo, hi] = woh hissa jahan ${target} ho sakta hai — shuru mein poora array.`, vars: { lo, hi }, legend: LEGEND, panels: [view(nums, lo, hi)] });
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      t.frame({ line: 'mid', caption: `mid = ${lo} + (${hi} − ${lo}) / 2 = ${mid}. a[mid] = ${nums[mid]}.`, vars: { lo, hi, mid }, legend: LEGEND, panels: [view(nums, lo, hi, mid)] });
      if (nums[mid] === target) {
        t.frame({ line: 'found', caption: `a[${mid}] = ${target} → mil gaya! Index ${mid}.`, vars: { lo, hi, mid }, legend: { ...LEGEND, found: 'mil gaya' }, panels: [view(nums, lo, hi, mid, 'found')] });
        return String(mid);
      }
      if (nums[mid] < target) {
        lo = mid + 1;
        t.frame({ line: 'right', caption: `${nums[mid]} < ${target} → sorted hai, to mid aur uske left wale sab ${target} se chhote. lo = ${lo}.`, vars: { lo, hi, mid }, legend: LEGEND, panels: [view(nums, lo, hi)] });
      } else {
        hi = mid - 1;
        t.frame({ line: 'left', caption: `${nums[mid]} > ${target} → mid aur right wale sab bade. hi = ${hi}.`, vars: { lo, hi, mid }, legend: LEGEND, panels: [view(nums, lo, hi)] });
      }
    }
    t.frame({ line: 'none', caption: `lo (${lo}) > hi (${hi}) → range khaali. ${target} array mein nahi → −1. Har step range aadhi → O(log n).`, vars: { lo, hi }, legend: LEGEND, panels: [view(nums, lo, hi)] });
    return '-1';
  },
});

// ---------- Example 1: search insert position ----------
export const insertTrace = tracer<{ nums: number[]; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums (sorted, distinct)', default: [1, 3, 5, 6], minLen: 1, maxLen: 10, min: 0, max: 30, sorted: true, distinct: true },
    { name: 'target', type: 'int', label: 'target', default: 2, min: -5, max: 35 },
  ],
  run({ nums, target }, t) {
    let lo = 0;
    let hi = nums.length - 1;
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      t.frame({ line: 'mid', caption: `mid = ${mid}, a[mid] = ${nums[mid]} vs ${target}.`, vars: { lo, hi, mid }, legend: LEGEND, panels: [view(nums, lo, hi, mid)] });
      if (nums[mid] === target) {
        t.frame({ line: 'found', caption: `Mil gaya → index ${mid}.`, vars: { mid }, legend: { ...LEGEND, found: 'mil gaya' }, panels: [view(nums, lo, hi, mid, 'found')] });
        return String(mid);
      }
      if (nums[mid] < target) {
        lo = mid + 1;
        t.frame({ line: 'right', caption: `${nums[mid]} < ${target} → lo = ${lo}.`, vars: { lo, hi }, legend: LEGEND, panels: [view(nums, lo, hi)] });
      } else {
        hi = mid - 1;
        t.frame({ line: 'left', caption: `${nums[mid]} > ${target} → hi = ${hi}.`, vars: { lo, hi }, legend: LEGEND, panels: [view(nums, lo, hi)] });
      }
    }
    const shown: Cell[] = [...nums.slice(0, lo), `→${target}`, ...nums.slice(lo)];
    t.frame({ line: 'insert', caption: `Nahi mila. Loop ke baad hamesha: lo se pehle sab < ${target}, lo se aage sab > ${target}. To ${target} ki jagah = lo = ${lo}.`, vars: { lo, hi }, legend: { new: 'yahan aayega' }, panels: [array(shown, { label: 'daal ke dekho', tones: { [lo]: 'new' } })] });
    return String(lo);
  },
});

// ---------- Example 2: 2D matrix as one sorted line ----------
export const matrixTrace = tracer<{ nums: number[]; cols: number; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'Saare numbers (sorted, row by row)', default: [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], minLen: 1, maxLen: 12, min: 0, max: 60, sorted: true },
    { name: 'cols', type: 'int', label: 'Columns', default: 4, min: 1, max: 4 },
    { name: 'target', type: 'int', label: 'target', default: 16, min: 0, max: 60 },
  ],
  check: ({ nums, cols }) => (nums.length % cols === 0 ? null : `${nums.length} numbers ${cols} columns mein barabar nahi bante — length ${cols} ka multiple rakho.`),
  run({ nums, cols, target }, t) {
    const rows = nums.length / cols;
    const grid = Array.from({ length: rows }, (_, r) => nums.slice(r * cols, r * cols + cols));
    const gridPanel = (lo: number, hi: number, mid?: number, midTone: Tone = 'compare'): Panel => {
      const tones: Record<string, Tone> = {};
      for (let i = 0; i < nums.length; i++) if (i < lo || i > hi) tones[`${Math.floor(i / cols)},${i % cols}`] = 'muted';
      if (mid !== undefined) tones[`${Math.floor(mid / cols)},${mid % cols}`] = midTone;
      return { kind: 'grid', label: 'matrix', values: grid, tones };
    };
    let lo = 0;
    let hi = nums.length - 1;
    t.frame({ line: 'map', caption: `${rows}×${cols} matrix. Row-by-row padho to ek sorted line hai (index 0..${hi}). Us line par binary search — index i ki jagah = (i / ${cols}, i % ${cols}).`, legend: LEGEND, panels: [gridPanel(lo, hi)] });
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const r = Math.floor(mid / cols);
      const c = mid % cols;
      const v = nums[mid];
      t.frame({ line: 'map', caption: `mid = ${mid} → row ${mid} / ${cols} = ${r}, col ${mid} % ${cols} = ${c} → ${v}.`, vars: { lo, hi, mid, row: r, col: c }, legend: LEGEND, panels: [gridPanel(lo, hi, mid)] });
      if (v === target) {
        t.frame({ line: 'found', caption: `${v} = target → true.`, vars: { mid }, legend: { ...LEGEND, found: 'mil gaya' }, panels: [gridPanel(lo, hi, mid, 'found')] });
        return 'true';
      }
      if (v < target) {
        lo = mid + 1;
        t.frame({ line: 'right', caption: `${v} < ${target} → lo = ${lo}.`, vars: { lo, hi }, legend: LEGEND, panels: [gridPanel(lo, hi)] });
      } else {
        hi = mid - 1;
        t.frame({ line: 'left', caption: `${v} > ${target} → hi = ${hi}.`, vars: { lo, hi }, legend: LEGEND, panels: [gridPanel(lo, hi)] });
      }
    }
    t.frame({ line: 'none', caption: `Range khaali → false. O(log(m·n)) — matrix ka har cell dekhne ki zaroorat nahi.`, legend: LEGEND, panels: [gridPanel(lo, hi)] });
    return 'false';
  },
});

// ---------- Example 3: unknown size (exponential search) ----------
export const unknownTrace = tracer<{ nums: number[]; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'Chhupa array (sorted)', default: [-1, 0, 3, 5, 9, 12, 15, 20, 25, 31, 40], minLen: 1, maxLen: 12, min: -9, max: 50, sorted: true, distinct: true },
    { name: 'target', type: 'int', label: 'target', default: 25, min: -9, max: 50 },
  ],
  run({ nums, target }, t) {
    const n = nums.length;
    const get = (i: number) => (i < n ? nums[i] : Infinity);
    let p2 = 1;
    while (p2 < n) p2 *= 2;
    const width = p2 + 1; // hi kabhi p2 se aage nahi jaata (get(p2) = ∞)
    const cells: Cell[] = Array.from({ length: width }, (_, i) => (i < n ? nums[i] : '∞'));
    const seen = new Set<number>();
    const v = (lo: number, hi: number, mid?: number, tone: Tone = 'compare') => {
      const p = view(cells, lo, hi, mid, tone);
      for (let i = n; i < width; i++) if (!seen.has(i)) p.tones![i] = 'muted';
      return p;
    };
    let hi = 1;
    seen.add(1);
    t.frame({ line: 'grow', caption: `Size pata nahi (bahar ka index padho to ∞ milta hai). Pehle range dhoondho: hi = 1, 2, 4, 8… double karte jao jab tak get(hi) ≥ ${target}.`, vars: { hi }, legend: { ...LEGEND, compare: 'padha' }, panels: [v(0, hi, hi)] });
    while (get(hi) < target) {
      hi *= 2;
      seen.add(hi);
      t.frame({ line: 'grow', caption: `get(${hi / 2}) = ${get(hi / 2)} < ${target} → hi = ${hi}. get(${hi}) = ${hi < n ? get(hi) : '∞'}.`, vars: { hi }, legend: { ...LEGEND, compare: 'padha' }, panels: [v(0, Math.min(hi, width - 1), Math.min(hi, width - 1))] });
    }
    let lo = Math.floor(hi / 2);
    t.frame({ line: 'grow', caption: `get(${hi}) ≥ ${target} → target ${lo}..${hi} ke beech (pichhla hi = ${lo}). Sirf log(index) step lage. Ab normal binary search.`, vars: { lo, hi }, legend: LEGEND, panels: [v(lo, Math.min(hi, width - 1))] });
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const val = get(mid);
      seen.add(mid);
      t.frame({ line: 'mid', caption: `mid = ${mid}, get(mid) = ${val === Infinity ? '∞ (bahar)' : val}.`, vars: { lo, hi, mid }, legend: LEGEND, panels: [v(lo, Math.min(hi, width - 1), Math.min(mid, width - 1))] });
      if (val === target) {
        t.frame({ line: 'found', caption: `Mil gaya → index ${mid}. Total O(log p), p = target ki position — size jaane bina.`, vars: { mid }, legend: { ...LEGEND, found: 'mil gaya' }, panels: [v(lo, Math.min(hi, width - 1), mid, 'found')] });
        return String(mid);
      }
      if (val < target) {
        lo = mid + 1;
        t.frame({ line: 'right', caption: `${val} < ${target} → lo = ${lo}.`, vars: { lo, hi }, legend: LEGEND, panels: [v(lo, Math.min(hi, width - 1))] });
      } else {
        hi = mid - 1;
        t.frame({ line: 'left', caption: `${val === Infinity ? '∞' : val} > ${target} → hi = ${hi}.`, vars: { lo, hi }, legend: LEGEND, panels: [v(lo, Math.min(hi, width - 1))] });
      }
    }
    t.frame({ line: 'none', caption: `Range khaali → −1.`, legend: LEGEND, panels: [v(lo, hi)] });
    return '-1';
  },
});
