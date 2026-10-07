import { array, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
const bars = (nums: number[], tones: Tones = {}, label = 'nums'): Panel => ({ kind: 'bars', label, values: [...nums], tones });
const tonesOf = (idx: number[], tone: Tone): Tones => Object.fromEntries(idx.map((i) => [i, tone]));

/** O(n²) LIS + ek asli sequence (indexes) */
function lisIdx(nums: number[]) {
  const n = nums.length;
  const dp: number[] = Array(n).fill(1);
  const parent: number[] = Array(n).fill(-1);
  let end = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) (dp[i] = dp[j] + 1), (parent[i] = j);
    if (dp[i] > dp[end]) end = i;
  }
  const idx: number[] = [];
  for (let k = n ? end : -1; k !== -1; k = parent[k]) idx.unshift(k);
  return idx;
}

/** pehla index jahan tails[idx] >= x (lower bound) */
const lowerBound = (tails: number[], x: number) => {
  let lo = 0;
  let hi = tails.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (tails[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
};

// ---------- 3. Visual intro: greedy kyun fail ----------
export const greedyLisTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [3, 9, 4, 5, 1, 6, 2], minLen: 2, maxLen: 9, min: 1, max: 20 }],
  run({ nums }, t) {
    const picked = [0];
    t.frame({ caption: `Badhta subsequence: kuch elements choose karo, order wahi, har agla pichhle se BADA. Pehla try — greedy: ${nums[0]} se shuru, aage jo bhi bada mile turant le lo.`, legend: { new: 'liya', active: 'abhi' }, panels: [bars(nums, { 0: 'new' })] });
    for (let i = 1; i < nums.length; i++) {
      const last = nums[picked[picked.length - 1]];
      const take = nums[i] > last;
      if (take) picked.push(i);
      const tones: Tones = { ...tonesOf(picked, 'new'), [i]: take ? 'new' : 'active' };
      t.frame({ caption: take ? `${nums[i]} > ${last} → le liya. Chain: ${picked.map((k) => nums[k]).join(', ')}.` : `${nums[i]} ≤ ${last} → nahi le sakte.${picked.length > 1 && nums[i] > nums[picked[picked.length - 2]] ? ` (${last} na liya hota to ${nums[i]} kaam aata…)` : ''}`, vars: { greedy: picked.length }, legend: { new: 'liya', active: 'chhoda' }, panels: [bars(nums, tones)] });
    }
    const best = lisIdx(nums);
    t.frame({ caption: best.length > picked.length ? `Greedy: ${picked.length}. Asli LIS: ${best.map((k) => nums[k]).join(', ')} = ${best.length}. Ek bada number jaldi le liya to aage ke chhote-chhote step band. Har element par 'lo ya chhodo' — 2ⁿ raaste. DP: har i ke liye "i par khatam hone wali sabse lambi chain" yaad rakho.` : `Is baar greedy (${picked.length}) sahi nikla — par hamesha nahi (default input dekho: 9 jaldi lene se 4, 5, 6 chhoot gaye). DP: har i par khatam hone wali sabse lambi chain yaad rakho.`, vars: { greedy: picked.length, LIS: best.length }, legend: { found: 'asli LIS' }, panels: [bars(nums, tonesOf(best, 'found'))] });
    return String(best.length);
  },
});

// ---------- 4. How: O(n²) DP ----------
export const lisDpTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [5, 2, 8, 6, 3, 6, 9, 7], minLen: 1, maxLen: 9, min: 1, max: 20 }],
  run({ nums }, t) {
    const n = nums.length;
    const dp: number[] = Array(n).fill(1);
    const parent: number[] = Array(n).fill(-1);
    const view = (bt: Tones = {}, dt: Tones = {}): Panel[] => [bars(nums, bt), array(dp, { label: 'dp[i] = i par KHATAM hone wala sabse lamba badhta subsequence', tones: dt })];
    t.frame({ line: 'init', caption: 'Har element akela bhi ek chain (length 1) → dp sab 1. Ab har i par: peeche ke har j jahan nums[j] < nums[i] — j wali chain ke peeche i jod sakte ho. Sabse lambi choose karo.', panels: view() });
    for (let i = 0; i < n; i++) {
      const ok: number[] = [];
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          ok.push(j);
          if (dp[j] + 1 > dp[i]) (dp[i] = dp[j] + 1), (parent[i] = j);
        }
      }
      const bt: Tones = { ...tonesOf(ok, 'compare'), [i]: 'active' };
      if (parent[i] >= 0) bt[parent[i]] = 'new';
      t.frame({ line: 'try', caption: ok.length ? `i = ${i} (${nums[i]}): chhote peeche wale ${ok.map((j) => `${nums[j]} (dp ${dp[j]})`).join(', ')}. Best ${nums[parent[i]]} ke peeche → dp = ${dp[parent[i]]} + 1 = ${dp[i]}.` : `i = ${i} (${nums[i]}): peeche koi chhota nahi → akela, dp = 1.`, vars: { i }, legend: { active: 'abhi', compare: 'chhota (jud sakta)', new: 'best' }, panels: view(bt, { [i]: 'active' }) });
    }
    let end = 0;
    for (let i = 1; i < n; i++) if (dp[i] > dp[end]) end = i;
    const seq: number[] = [];
    for (let k = end; k !== -1; k = parent[k]) seq.unshift(k);
    t.frame({ line: 'done', caption: `Jawab = dp ka MAX = ${dp[end]} (aakhri element par nahi, kahin bhi khatam ho sakta). Ek LIS: ${seq.map((k) => nums[k]).join(', ')}. Har i par saare j → O(n²).`, legend: { found: 'LIS' }, panels: view(tonesOf(seq, 'found'), { [end]: 'found' }) });
    return String(dp[end]);
  },
});

// ---------- Example 1: Continuous badhta hissa (subarray) ----------
export const lcisTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [2, 6, 7, 3, 5, 8, 9, 1], minLen: 1, maxLen: 10, min: 1, max: 20 }],
  run({ nums }, t) {
    let best = 0;
    let cur = 0;
    let bestEnd = 0;
    t.frame({ caption: 'Yahan CONTINUOUS chahiye (subarray). To bas ek counter: pichhle se bada → chain aage (+1), warna naya chain (1).', panels: [bars(nums)] });
    for (let i = 0; i < nums.length; i++) {
      const up = i > 0 && nums[i - 1] < nums[i];
      cur = up ? cur + 1 : 1;
      if (cur > best) (best = cur), (bestEnd = i);
      const run = Array.from({ length: cur }, (_, k) => i - k);
      t.frame({ line: 'step', caption: i === 0 ? `${nums[0]}: shuru, cur = 1.` : up ? `${nums[i]} > ${nums[i - 1]} → chain badha, cur = ${cur}.` : `${nums[i]} ≤ ${nums[i - 1]} → toota, naya shuru: cur = 1.`, vars: { cur, best }, legend: { new: 'abhi ka chain' }, panels: [bars(nums, tonesOf(run, 'new'))] });
    }
    const lis = lisIdx(nums).length;
    t.frame({ line: 'done', caption: `Sabse lamba continuous = ${best}. Gap allowed hota (LIS) to ${lis}${lis > best ? ' — subsequence chhote hisse jod sakta hai' : ''}. O(n), O(1).`, legend: { found: 'jawab' }, panels: [bars(nums, tonesOf(Array.from({ length: best }, (_, k) => bestEnd - k), 'found'))] });
    return String(best);
  },
});

// ---------- Example 2: LIS O(n log n) — tails ----------
export const tailsTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [5, 2, 8, 6, 3, 6, 9, 7], minLen: 1, maxLen: 10, min: 1, max: 20 }],
  run({ nums }, t) {
    const tails: number[] = [];
    const view = (i: number, tt: Tones = {}): Panel[] => [array(nums, { label: 'nums', pointers: i >= 0 ? { x: i } : undefined, tones: i >= 0 ? { [i]: 'active' } : {} }), array(tails.length ? tails : ['—'], { label: 'tails[k] = length k+1 wali chain ka SABSE CHHOTA aakhri element', tones: tt })];
    t.frame({ caption: 'tails[k] = ab tak dekhi length (k + 1) wali sabse "sasti" chain ka aakhri element — chhota aakhri = aage badhne ka zyada mauka. tails hamesha sorted rehta → binary search.', panels: view(-1) });
    nums.forEach((x, i) => {
      const pos = lowerBound(tails, x);
      const old = tails[pos];
      const grow = pos === tails.length;
      tails[pos] = x;
      t.frame({ line: grow ? 'grow' : 'place', caption: grow ? (tails.length === 1 ? `${x}: tails khaali → pehli chain, length 1.` : `${x} tails ke sabse bade se bhi bada → chain ek lambi: length ${tails.length}.`) : `${x}: pehla ≥ ${x} hai tails[${pos}] = ${old} → ${x} se badlo. Length ${pos + 1} ki chain ab sasti (${x} par khatam).`, vars: { x, size: tails.length }, legend: grow ? { new: 'naya joda' } : { swap: 'badla' }, panels: view(i, { [pos]: grow ? 'new' : 'swap' }) });
    });
    t.frame({ line: 'done', caption: `LIS = tails ki length = ${tails.length}. Har element par ek binary search → O(n log n). Dhyaan: tails khud zaroori nahi ki asli LIS ho — sirf length sahi hai.`, legend: { found: 'length' }, panels: view(-1, tonesOf(tails.map((_, k) => k), 'found')) });
    return String(tails.length);
  },
});

// ---------- Example 3: Russian doll envelopes ----------
export const dollTrace = tracer<{ env: number[][] }>({
  inputs: [{ name: 'env', type: 'intGrid', label: 'Envelopes (width height; …)', default: [[3, 4], [5, 6], [5, 5], [5, 7], [2, 2], [6, 8]], maxRows: 7, maxCols: 2, min: 1, max: 9 }],
  check: ({ env }) => (env.some((r) => r.length !== 2) ? 'Har row mein 2 numbers: width height.' : null),
  run({ env }, t) {
    const lab = (e: number[]) => `${e[0]}×${e[1]}`;
    t.frame({ caption: 'Envelope A, envelopes B ke andar tabhi jab A ki width AUR height dono chhoti. 2 cheezein ek saath — ek ko sort se handle karo, doosre par LIS.', panels: [array(env.map(lab), { label: 'envelopes (w×h)' })] });
    const sorted = [...env].sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const heights = sorted.map((e) => e[1]);
    const wrong = [...env].sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((e) => e[1]);
    const wrongLen = (() => {
      const tl: number[] = [];
      for (const h of wrong) tl[lowerBound(tl, h)] = h;
      return tl.length;
    })();
    t.frame({ line: 'sort', caption: 'Width se badhte order mein; SAME width par height ULTI (bada pehle). Kyun ulti? Same width wale ek doosre mein nahi jaa sakte — ulti height se wo ek badhti chain mein aa hi nahi paate.', panels: [array(sorted.map(lab), { label: 'sorted' }), array(heights, { label: 'heights — inpar LIS' })] });
    const tails: number[] = [];
    sorted.forEach((e, i) => {
      const h = e[1];
      const pos = lowerBound(tails, h);
      const grow = pos === tails.length;
      tails[pos] = h;
      t.frame({ line: 'place', caption: `${lab(e)}: height ${h} → ${grow ? `tails ke end mein, chain ${tails.length} ki` : `tails[${pos}] ki jagah`}.`, vars: { size: tails.length }, legend: { active: 'abhi', new: 'tails mein' }, panels: [array(sorted.map(lab), { label: 'sorted', tones: { [i]: 'active' } }), array(tails, { label: 'tails (heights)', tones: { [pos]: 'new' } })] });
    });
    t.frame({ line: 'done', caption: `Jawab ${tails.length} envelopes. Same width par height bhi badhte order mein sort karte to ${wrongLen}${wrongLen > tails.length ? ' — GALAT, same width wale ek chain mein gin liye' : ''}. O(n log n).`, legend: { found: 'jawab' }, panels: [array(sorted.map(lab), { label: 'sorted' }), array(tails, { label: 'tails', tones: tonesOf(tails.map((_, k) => k), 'found') })] });
    return String(tails.length);
  },
});
