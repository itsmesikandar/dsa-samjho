import { array, tracer } from '@/components/viz/engine/tracer';
import type { ArrRange, Panel, Tone, ToneMap } from '@/components/viz/engine/types';

const ceilDiv = (p: number, k: number) => Math.floor((p - 1) / k) + 1;
const hours = (piles: number[], k: number) => piles.reduce((s, p) => s + ceilDiv(p, k), 0);
const pilesCheck = ({ piles, h }: { piles: number[]; h: number }) => (h >= piles.length ? null : `h (${h}) kam se kam bahut saare ki count (${piles.length}) jitna ho — har pile ko 1 ghanta to chahiye.`);

// ---------- 3. Visual intro: answer ki range par monotonic graph ----------
export const answerChart = tracer<{ piles: number[]; h: number }>({
  inputs: [
    { name: 'piles', type: 'intArray', label: 'Kele ke pile', default: [3, 6, 7, 11], minLen: 1, maxLen: 6, min: 1, max: 15 },
    { name: 'h', type: 'int', label: 'Ghante (h)', default: 8, min: 1, max: 30 },
  ],
  check: pilesCheck,
  run({ piles, h }, t) {
    const max = Math.max(...piles);
    const pts = Array.from({ length: max }, (_, i) => [i + 1, hours(piles, i + 1)] as [number, number]);
    const chart = (marker?: number): Panel => ({
      kind: 'chart',
      label: 'Speed k vs lagne wale ghante',
      xLabel: 'speed k',
      yLabel: 'ghante',
      series: [
        { label: 'ghante(k)', points: pts, tone: 'active' },
        { label: `h = ${h}`, points: [[1, h], [max, h]], tone: 'error' },
      ],
      marker,
    });
    t.frame({ caption: `Speed badhao → ghante kam (ya barabar). Graph hamesha neeche jaata hai — MONOTONIC. To "ghante ≤ ${h}" wale speeds ek continuous hissa hain: F F F T T T. Pehla T = answer.`, panels: [chart()] });
    let lo = 1;
    let hi = max;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const hr = hours(piles, mid);
      const ok = hr <= h;
      t.frame({ caption: `Speed ${mid} try: ${hr} ghante ${ok ? `≤ ${h} → chal gaya. Isse tez sab chalenge — answer ${mid} ya kam. hi = ${mid}.` : `> ${h} → nahi chala. Isse dheere bhi nahi chalega. lo = ${mid + 1}.`}`, vars: { lo, hi, mid, ghante: hr }, panels: [chart(mid)] });
      if (ok) hi = mid;
      else lo = mid + 1;
    }
    t.frame({ caption: `lo == hi = ${lo}. Array kahin nahi tha — sirf answer ki RANGE (1..${max}) aur ek "chalega?" sawaal. Yahi binary search on answer hai.`, vars: { answer: lo }, panels: [chart(lo)] });
    return String(lo);
  },
});

// ---------- 4. How: Koko eating bananas ----------
export const kokoTrace = tracer<{ piles: number[]; h: number }>({
  inputs: [
    { name: 'piles', type: 'intArray', label: 'piles', default: [3, 6, 7, 11], minLen: 1, maxLen: 6, min: 1, max: 30 },
    { name: 'h', type: 'int', label: 'h', default: 8, min: 1, max: 40 },
  ],
  check: pilesCheck,
  run({ piles, h }, t) {
    let lo = 1;
    let hi = Math.max(...piles);
    t.frame({ line: 'init', caption: `Answer ki range: speed 1 (sabse dheere) se ${hi} (sabse bada pile — isse tez ka koi fayda nahi). Har speed par "h mein khatam?" ka jawab F…F T…T.`, vars: { lo, hi }, panels: [array(piles, { label: 'piles' })] });
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const per = piles.map((p) => ceilDiv(p, mid));
      const hr = per.reduce((s, x) => s + x, 0);
      t.frame({ line: 'mid', caption: `mid = ${mid}: har pile ⌈p / ${mid}⌉ ghante → total ${hr}.`, vars: { lo, hi, mid, ghante: hr }, panels: [array(piles, { label: 'piles' }), array(per, { label: `ghante (k = ${mid})`, tones: Object.fromEntries(per.map((_, i) => [i, 'compare' as Tone])) })] });
      if (hr <= h) {
        hi = mid;
        t.frame({ line: 'ok', caption: `${hr} ≤ ${h} → speed ${mid} chalegi. Shayad aur dheere bhi — hi = ${mid}.`, vars: { lo, hi }, panels: [array(piles, { label: 'piles' }), array(per, { label: `ghante (k = ${mid})`, tones: Object.fromEntries(per.map((_, i) => [i, 'found' as Tone])) })] });
      } else {
        lo = mid + 1;
        t.frame({ line: 'notok', caption: `${hr} > ${h} → speed ${mid} kam hai. lo = ${lo}.`, vars: { lo, hi }, panels: [array(piles, { label: 'piles' }), array(per, { label: `ghante (k = ${mid})`, tones: Object.fromEntries(per.map((_, i) => [i, 'error' as Tone])) })] });
      }
    }
    t.frame({ line: 'done', caption: `Sabse kam speed = ${lo}. Har check O(n), checks log(max) → O(n log max).`, vars: { answer: lo }, panels: [array(piles, { label: 'piles' }), array(piles.map((p) => ceilDiv(p, lo)), { label: `ghante (k = ${lo})`, tones: Object.fromEntries(piles.map((_, i) => [i, 'done' as Tone])) })] });
    return String(lo);
  },
});

// ---------- Example 1: sqrt ----------
export const sqrtTrace = tracer<{ x: number }>({
  inputs: [{ name: 'x', type: 'int', label: 'x', default: 8, min: 0, max: 300 }],
  run({ x }, t) {
    let lo = 0;
    let hi = x;
    const text = (mid?: number): Panel => ({ kind: 'text', label: 'Range', text: `lo = ${lo}, hi = ${hi}${mid !== undefined ? `\nmid = ${mid}, mid² = ${mid * mid}` : ''}` });
    t.frame({ line: 'mid', caption: `Answer 0..${x} ke beech. Sawaal: "mid² ≤ ${x}?" — T T T F F F. Is baar AAKHRI T chahiye (sabse bada).`, vars: { lo, hi }, panels: [text()] });
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo + 1) / 2);
      const ok = mid * mid <= x;
      t.frame({ line: 'mid', caption: `mid = ${lo} + (${hi} − ${lo} + 1) / 2 = ${mid} (upar round — warna lo = mid par atak jaate).`, vars: { lo, hi, mid }, panels: [text(mid)] });
      if (ok) {
        lo = mid;
        t.frame({ line: 'ok', caption: `${mid}² = ${mid * mid} ≤ ${x} → chal gaya. Answer ${mid} ya bada → lo = ${mid}.`, vars: { lo, hi }, panels: [text()] });
      } else {
        hi = mid - 1;
        t.frame({ line: 'big', caption: `${mid}² = ${mid * mid} > ${x} → bada. hi = ${hi}.`, vars: { lo, hi }, panels: [text()] });
      }
    }
    t.frame({ line: 'done', caption: `√${x} ≈ ${lo} (neeche round). O(log x). Code mein mid × mid Long mein — x ≈ 2³¹ par Int overflow.`, vars: { answer: lo }, panels: [text()] });
    return String(lo);
  },
});

// ---------- Example 2: ship packages within D days ----------
export const shipTrace = tracer<{ weights: number[]; days: number }>({
  inputs: [
    { name: 'weights', type: 'intArray', label: 'weights (order fix)', default: [3, 2, 2, 4, 1, 4], minLen: 1, maxLen: 8, min: 1, max: 10 },
    { name: 'days', type: 'int', label: 'days', default: 3, min: 1, max: 8 },
  ],
  run({ weights, days }, t) {
    const split = (cap: number) => {
      const r: ArrRange[] = [];
      let start = 0;
      let load = 0;
      weights.forEach((w, i) => {
        if (load + w > cap) {
          r.push({ from: start, to: i - 1, label: `din ${r.length + 1}: ${load}`, tone: r.length % 2 ? 'compare' : 'active' });
          start = i;
          load = 0;
        }
        load += w;
      });
      r.push({ from: start, to: weights.length - 1, label: `din ${r.length + 1}: ${load}`, tone: r.length % 2 ? 'compare' : 'active' });
      return r;
    };
    let lo = Math.max(...weights);
    let hi = weights.reduce((s, w) => s + w, 0);
    t.frame({ line: 'init', caption: `Capacity kam se kam ${lo} (sabse bhaari packet), zyada se zyada ${hi} (sab ek din). Capacity badhao → din kam: monotonic.`, vars: { lo, hi }, panels: [array(weights, { label: 'weights' })] });
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const r = split(mid);
      t.frame({ line: 'mid', caption: `Capacity ${mid}: greedy bharo — jitna aaj aa sake. ${r.length} din lage.`, vars: { lo, hi, mid, din: r.length }, panels: [array(weights, { label: 'weights', ranges: r })] });
      if (r.length <= days) {
        hi = mid;
        t.frame({ line: 'ok', caption: `${r.length} ≤ ${days} din → chal gaya. Kam capacity try: hi = ${mid}.`, vars: { lo, hi }, panels: [array(weights, { label: 'weights', ranges: r })] });
      } else {
        lo = mid + 1;
        t.frame({ line: 'notok', caption: `${r.length} > ${days} din → capacity kam. lo = ${lo}.`, vars: { lo, hi }, panels: [array(weights, { label: 'weights', ranges: r })] });
      }
    }
    t.frame({ line: 'done', caption: `Sabse kam capacity = ${lo}. Check O(n), range log(sum) → O(n log sum).`, vars: { answer: lo }, panels: [array(weights, { label: 'weights', ranges: split(lo) })] });
    return String(lo);
  },
});

// ---------- Example 3: k-th smallest pair distance ----------
export const pairDistTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [1, 3, 4, 8, 10], minLen: 2, maxLen: 7, min: 0, max: 20 },
    { name: 'k', type: 'int', label: 'k', default: 4, min: 1, max: 21 },
  ],
  check: ({ nums, k }) => (k <= (nums.length * (nums.length - 1)) / 2 ? null : `Sirf ${(nums.length * (nums.length - 1)) / 2} jode hain — k usse zyada nahi.`),
  run({ nums, k }, t) {
    const a = [...nums].sort((x, y) => x - y);
    const n = a.length;
    let lo = 0;
    let hi = a[n - 1] - a[0];
    t.frame({ line: 'init', caption: `Sort kiya. Saare ${(n * (n - 1)) / 2} jode bana ke sort karna O(n² log n). Ulta socho: answer (distance) 0..${hi} ke beech. Sawaal: "distance ≤ d wale jode ≥ ${k}?" — d badhao to jode badhte hain → monotonic!`, vars: { lo, hi }, panels: [array(a, { label: 'sorted' })] });
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      let count = 0;
      let l = 0;
      const per: number[] = [];
      for (let r = 0; r < n; r++) {
        while (a[r] - a[l] > mid) l++;
        count += r - l;
        per.push(r - l);
      }
      t.frame({ line: 'count', caption: `d = ${mid}: har r ke liye kitne l (l < r) jinki distance ≤ ${mid} — two pointers se ek pass. Total ${count} jode.`, vars: { lo, hi, mid, count }, panels: [array(a, { label: 'sorted' }), array(per, { label: `r ke saath jode (d ≤ ${mid})`, tones: Object.fromEntries(per.map((_, i) => [i, 'compare' as Tone])) })] });
      const ok = count >= k;
      if (ok) hi = mid;
      else lo = mid + 1;
      t.frame({ line: ok ? 'ok' : 'notok', caption: ok ? `${count} ≥ ${k} → k-th distance ≤ ${mid}. hi = ${hi}.` : `${count} < ${k} → k-th distance ${mid} se badi. lo = ${lo}.`, vars: { lo, hi }, panels: [array(a, { label: 'sorted' })] });
    }
    const tones: ToneMap = {};
    t.frame({ line: 'done', caption: `Answer ${lo}. Sort O(n log n) + log(range) × O(n) count. Jode kabhi banaye hi nahi!`, vars: { answer: lo }, panels: [array(a, { label: 'sorted', tones })] });
    return String(lo);
  },
});
