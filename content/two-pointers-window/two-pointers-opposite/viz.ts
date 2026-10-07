import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, GridPanel, Tone, ToneMap } from '@/components/viz/engine/types';

const show = (c: string) => (c === ' ' ? '␣' : c);

// ---------- 3. Visual intro: ek move = poori row/column khatam ----------
export const pairGrid = tracer<{ arr: number[]; target: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Sorted array', default: [1, 2, 4, 6, 9, 11], minLen: 2, maxLen: 6, min: -20, max: 30, sorted: true },
    { name: 'target', type: 'int', label: 'target', default: 13, min: -40, max: 60 },
  ],
  run({ arr, target }, t) {
    const n = arr.length;
    const values: Cell[][] = arr.map((_, i) => arr.map((_, j) => (j > i ? arr[i] + arr[j] : null)));
    const tones: Record<string, Tone> = {};
    const grid = (extra: Record<string, Tone> = {}): GridPanel => ({
      kind: 'grid',
      label: 'Har pair (i, j) ka sum — row = i, column = j',
      values,
      tones: { ...tones, ...extra },
      rowLabels: arr.map((v, i) => `i${i}:${v}`),
      colLabels: arr.map((v, j) => `j${j}:${v}`),
    });
    let elim = 0;
    const total = (n * (n - 1)) / 2;
    t.frame({ caption: `Brute force saare ${total} pairs dekhta hai (grid ke saare cells). Two pointers har step par poori ek row ya column hata deta hai — dekho kaise.`, panels: [array(arr), grid()] });
    let l = 0;
    let r = n - 1;
    while (l < r) {
      const s = arr[l] + arr[r];
      if (s === target) {
        t.frame({ caption: `arr[${l}] + arr[${r}] = ${s} == ${target} → mil gaya! Sirf ${elim} cells hatane ke baad, ${total} mein se.`, vars: { l, r, sum: s }, legend: { muted: 'hata diye (ab dekhne ki zaroorat nahi)' }, panels: [array(arr, { tones: { [l]: 'found', [r]: 'found' }, pointers: { l, r } }), grid({ [`${l},${r}`]: 'found' })] });
        return listStr([l, r]);
      }
      if (s > target) {
        for (let i = l; i < r; i++) if (!tones[`${i},${r}`]) { tones[`${i},${r}`] = 'muted'; elim++; }
        t.frame({ caption: `${arr[l]} + ${arr[r]} = ${s} > ${target}. arr[l] sabse chhota bacha hai — uske saath bhi zyada hai, to arr[${r}] kisi ke saath kaam nahi aayega. Poora column ${r} hata do, r--.`, vars: { l, r, sum: s, 'hataye cells': elim }, legend: { muted: 'hata diye', active: 'abhi' }, panels: [array(arr, { tones: { [l]: 'compare', [r]: 'error' }, pointers: { l, r } }), grid({ [`${l},${r}`]: 'active' })] });
        r--;
      } else {
        for (let j = l + 1; j <= r; j++) if (!tones[`${l},${j}`]) { tones[`${l},${j}`] = 'muted'; elim++; }
        t.frame({ caption: `${arr[l]} + ${arr[r]} = ${s} < ${target}. arr[r] sabse bada bacha hai — uske saath bhi kam hai, to arr[${l}] kisi ke saath kaam nahi aayega. Poori row ${l} hata do, l++.`, vars: { l, r, sum: s, 'hataye cells': elim }, legend: { muted: 'hata diye', active: 'abhi' }, panels: [array(arr, { tones: { [l]: 'error', [r]: 'compare' }, pointers: { l, r } }), grid({ [`${l},${r}`]: 'active' })] });
        l++;
      }
    }
    t.frame({ caption: `l aur r mil gaye — saare pairs hat gaye, koi sum ${target} nahi. Har step ek row/column → max n step → O(n).`, panels: [array(arr), grid()] });
    return listStr([-1, -1]);
  },
});

// ---------- 4. How: sorted squares ----------
export const squaresTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'Sorted nums (negative bhi)', default: [-4, -1, 0, 3, 10], minLen: 1, maxLen: 8, min: -20, max: 20, sorted: true }],
  run({ nums }, t) {
    const n = nums.length;
    const res: Cell[] = Array(n).fill(null);
    let l = 0;
    let r = n - 1;
    t.frame({ line: 'init', caption: 'Negative numbers ke square bade ho jaate hain, isliye sorted order toot jaata hai. Par sabse bada square hamesha kisi EDGE par hoga — l ya r.', panels: [array(nums, { label: 'nums', pointers: { l, r } }), array(res, { label: 'res (peeche se bharenge)' })] });
    for (let k = n - 1; k >= 0; k--) {
      const leftBig = Math.abs(nums[l]) > Math.abs(nums[r]);
      t.frame({ line: 'compare', caption: `|${nums[l]}| vs |${nums[r]}| → ${leftBig ? 'left' : 'right'} bada (ya barabar). Uska square res[${k}] mein jaayega.`, vars: { l, r, k }, panels: [array(nums, { label: 'nums', tones: { [l]: 'compare', [r]: 'compare' }, pointers: { l, r } }), array(res, { label: 'res', pointers: { k } })] });
      if (leftBig) {
        res[k] = nums[l] * nums[l];
        t.frame({ line: 'left', caption: `res[${k}] = ${nums[l]}² = ${res[k]}, l++.`, vars: { k }, panels: [array(nums, { label: 'nums', tones: { [l]: 'done' }, pointers: { l, r } }), array(res, { label: 'res', tones: { [k]: 'new' } })] });
        l++;
      } else {
        res[k] = nums[r] * nums[r];
        t.frame({ line: 'right', caption: `res[${k}] = ${nums[r]}² = ${res[k]}, r--.`, vars: { k }, panels: [array(nums, { label: 'nums', tones: { [r]: 'done' }, pointers: { l, r } }), array(res, { label: 'res', tones: { [k]: 'new' } })] });
        r--;
      }
    }
    t.frame({ line: 'done', caption: `Answer ${listStr(res)}. Ek pass → O(n). Square karke sort karte to O(n log n).`, panels: [array(res, { label: 'res' })] });
    return listStr(res);
  },
});

// ---------- Example 1: reverse vowels ----------
export const vowelsRevTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Text', default: 'hello', minLen: 1, maxLen: 14, charset: 'abcdefghijklmnopqrstuvwxyzAEIOU ' }],
  run({ s }, t) {
    const c = [...s];
    const isV = (x: string) => 'aeiouAEIOU'.includes(x);
    let l = 0;
    let r = c.length - 1;
    const view = (tones: ToneMap = {}) => array(c.map(show), { tones, pointers: { l, r } });
    t.frame({ line: 'init', caption: 'l shuru se, r end se. Dono apna-apna agla vowel dhoondhenge, phir swap.', panels: [view()] });
    while (l < r) {
      while (l < r && !isV(c[l])) {
        t.frame({ line: 'skipL', caption: `'${show(c[l])}' vowel nahi → l++.`, vars: { l, r }, panels: [view({ [l]: 'muted' })] });
        l++;
      }
      while (l < r && !isV(c[r])) {
        t.frame({ line: 'skipR', caption: `'${show(c[r])}' vowel nahi → r--.`, vars: { l, r }, panels: [view({ [r]: 'muted' })] });
        r--;
      }
      if (l < r) {
        [c[l], c[r]] = [c[r], c[l]];
        t.frame({ line: 'swap', caption: `Dono vowels mile — swap: index ${l} ↔ ${r}.`, vars: { l, r }, panels: [view({ [l]: 'swap', [r]: 'swap' })] });
      }
      l++;
      r--;
    }
    const out = c.join('');
    t.frame({ line: 'done', caption: `Result "${out}". Har char ek baar l ya r se → O(n).`, panels: [array(c.map(show))] });
    return out;
  },
});

// ---------- Example 2: container with most water ----------
export const containerTrace = tracer<{ h: number[] }>({
  inputs: [{ name: 'h', type: 'intArray', label: 'Walls ki height', default: [1, 8, 6, 2, 5, 4, 8, 3, 7], minLen: 2, maxLen: 10, min: 0, max: 10 }],
  run({ h }, t) {
    let l = 0;
    let r = h.length - 1;
    let best = 0;
    let bl = 0;
    let br = r;
    const bars = (tones: ToneMap = {}) => ({ kind: 'bars' as const, label: 'walls', values: [...h], tones, pointers: [{ name: 'l', index: l }, { name: 'r', index: r }] });
    t.frame({ line: 'init', caption: 'Sabse wide (wide) pair se shuru: l = 0, r = end. Paani = chhoti wall × distance.', panels: [bars()] });
    while (l < r) {
      const area = Math.min(h[l], h[r]) * (r - l);
      const better = area > best;
      if (better) {
        best = area;
        bl = l;
        br = r;
      }
      t.frame({ line: 'area', caption: `min(${h[l]}, ${h[r]}) × (${r} − ${l}) = ${area}.${better ? ` Naya best = ${best}!` : ` best = ${best}.`}`, vars: { l, r, area, best }, panels: [bars({ [l]: 'active', [r]: 'active' })] });
      if (h[l] < h[r]) {
        t.frame({ line: 'moveL', caption: `Left wall (${h[l]}) chhoti hai. Use rakh ke r ko andar laane se distance kam hogi aur height ${h[l]} se upar nahi jaa sakti — fayda nahi. Isliye chhoti wali (l) hatao.`, vars: { l, r, best }, panels: [bars({ [l]: 'error', [r]: 'compare' })] });
        l++;
      } else {
        t.frame({ line: 'moveR', caption: `Right wall (${h[r]}) chhoti (ya barabar) hai → wahi hatao, r--.`, vars: { l, r, best }, panels: [bars({ [l]: 'compare', [r]: 'error' })] });
        r--;
      }
    }
    t.frame({ line: 'done', caption: `Best paani = ${best} (wall ${bl} aur ${br}). Har step ek wall hatti → O(n). Saare pairs try karte to O(n²).`, panels: [{ kind: 'bars', label: 'walls', values: [...h], tones: { [bl]: 'found', [br]: 'found' } }] });
    return String(best);
  },
});

// ---------- Example 3: 3Sum ----------
export const threeSumTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [-1, 0, 1, 2, -1, -4], minLen: 3, maxLen: 8, min: -5, max: 5 }],
  run({ nums }, t) {
    const a = [...nums].sort((x, y) => x - y);
    const res: number[][] = [];
    const out = () => `[${res.map((x) => listStr(x)).join(', ')}]`;
    const text = () => ({ kind: 'text' as const, label: 'Triplets', text: out() });
    t.frame({ line: 'sort', caption: `Sort: ${listStr(a)}. Ab har i ke liye baaki 2 numbers ka sum −a[i] chahiye — ye sorted array par two pointers (Two Sum II) hai!`, panels: [array(a), text()] });
    for (let i = 0; i < a.length; i++) {
      if (i > 0 && a[i] === a[i - 1]) {
        t.frame({ line: 'skipI', caption: `a[${i}] = ${a[i]} pichle jaisa — wahi triplets dobara milenge. Skip.`, vars: { i }, panels: [array(a, { tones: { [i]: 'muted' }, pointers: { i } }), text()] });
        continue;
      }
      let l = i + 1;
      let r = a.length - 1;
      while (l < r) {
        const s = a[i] + a[l] + a[r];
        const tones: ToneMap = { [i]: 'active', [l]: 'compare', [r]: 'compare' };
        if (s === 0) {
          res.push([a[i], a[l], a[r]]);
          t.frame({ line: 'found', caption: `${a[i]} + ${a[l]} + ${a[r]} = 0 → triplet mila!`, vars: { i, l, r }, panels: [array(a, { tones: { [i]: 'found', [l]: 'found', [r]: 'found' }, pointers: { i, l, r } }), text()] });
          l++;
          r--;
          let skipped = 0;
          while (l < r && a[l] === a[l - 1]) {
            l++;
            skipped++;
          }
          if (skipped) t.frame({ line: 'dedupe', caption: `Same value wale ${skipped} l skip kiye — warna same triplet dobara aata.`, vars: { i, l, r }, panels: [array(a, { pointers: { i, l, r } }), text()] });
        } else {
          t.frame({ line: 'sum', caption: `${a[i]} + ${a[l]} + ${a[r]} = ${s} ${s < 0 ? '< 0 → l++' : '> 0 → r--'}.`, vars: { i, l, r, sum: s }, panels: [array(a, { tones, pointers: { i, l, r } }), text()] });
          if (s < 0) l++;
          else r--;
        }
      }
    }
    t.frame({ caption: `Answer ${out()}. Sort O(n log n) + har i par O(n) two pointers → O(n²). Brute force O(n³).`, panels: [array(a), text()] });
    return out();
  },
});
