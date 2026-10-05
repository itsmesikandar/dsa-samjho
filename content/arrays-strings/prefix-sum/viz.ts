import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, GridPanel, Tone, ToneMap } from '@/components/viz/engine/types';

// ---------- 3. Visual intro: staircase of totals ----------
export const staircase = tracer<{ arr: number[]; l: number; r: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Har din ka kharcha', default: [3, 1, 4, 1, 5, 9], minLen: 1, maxLen: 8, min: 1, max: 9 },
    { name: 'l', type: 'int', label: 'l (range shuru)', default: 1, min: 0, max: 7 },
    { name: 'r', type: 'int', label: 'r (range end)', default: 3, min: 0, max: 7 },
  ],
  check: ({ arr, l, r }) => (l <= r && r < arr.length ? null : `0 ≤ l ≤ r ≤ ${arr.length - 1} hona chahiye.`),
  run({ arr, l, r }, t) {
    const pre = [0];
    t.frame({
      caption: 'arr = har din ka kharcha. Sawaal: "din l se din r tak kul kitna kharcha?" — har baar loop chala ke jodna slow hai. Ek "passbook" banate hain.',
      panels: [array(arr, { label: 'arr' }), { kind: 'bars', label: 'pre (ab tak ka total)', values: [...pre] }],
    });
    arr.forEach((x, i) => {
      pre.push(pre[i] + x);
      t.frame({
        caption: `pre[${i + 1}] = pre[${i}] + arr[${i}] = ${pre[i]} + ${x} = ${pre[i + 1]}. Passbook ka balance jaisa — har din purane total mein naya kharcha.`,
        vars: { i },
        panels: [array(arr, { label: 'arr', tones: { [i]: 'active' } }), { kind: 'bars', label: 'pre (ab tak ka total)', values: [...pre], tones: { [i + 1]: 'new' } }],
      });
    });
    const ans = pre[r + 1] - pre[l];
    t.frame({
      caption: `Din ${l} se ${r} ka kharcha = pre[${r + 1}] − pre[${l}] = ${pre[r + 1]} − ${pre[l]} = ${ans}. Do seedhiyon ki unchai ka fark = beech ka hissa. Loop nahi — O(1)!`,
      vars: { l, r, answer: ans },
      legend: { compare: 'pre[l] (ghatao)', found: 'pre[r+1] / answer' },
      panels: [
        array(arr, { label: 'arr', ranges: [{ from: l, to: r, label: `sum = ${ans}`, tone: 'found' }] }),
        { kind: 'bars', label: 'pre (ab tak ka total)', values: [...pre], tones: { [l]: 'compare', [r + 1]: 'found' } },
      ],
    });
    return String(ans);
  },
});

// ---------- 4. How: build + queries ----------
export const rangeSumTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [3, 1, 4, 1, 5, 9], minLen: 1, maxLen: 8, min: -20, max: 20 }],
  run({ arr }, t) {
    const n = arr.length;
    const pre: number[] = Array(n + 1).fill(0);
    const preView = (tones: ToneMap = {}) => array(pre, { label: 'pre (n + 1 dabbe)', tones });
    t.frame({ line: 'alloc', caption: `pre = LongArray(${n + 1}), pre[0] = 0 ("kuch nahi joda"). Ye extra 0 wala dabba l = 0 ki query ko bhi aasaan bana deta hai.`, panels: [array(arr, { label: 'arr' }), preView({ 0: 'new' })] });
    arr.forEach((x, i) => {
      pre[i + 1] = pre[i] + x;
      t.frame({
        line: 'build',
        caption: `pre[${i + 1}] = pre[${i}] + arr[${i}] = ${pre[i]} + ${x} = ${pre[i + 1]}.`,
        vars: { i },
        panels: [array(arr, { label: 'arr', tones: { [i]: 'active' }, pointers: { i } }), preView({ [i]: 'compare', [i + 1]: 'new' })],
      });
    });
    const qs: [number, number][] = [n >= 4 ? [1, 3] : [0, n - 1], [0, n - 1], [Math.min(4, n - 1), Math.min(4, n - 1)]];
    let first = 0;
    qs.forEach(([l, r], k) => {
      const ans = pre[r + 1] - pre[l];
      if (k === 0) first = ans;
      t.frame({
        line: 'query',
        caption: `sum(${l}, ${r}) = pre[${r + 1}] − pre[${l}] = ${pre[r + 1]} − ${pre[l]} = ${ans}. ${r - l + 1} items, phir bhi sirf ek minus.`,
        vars: { l, r, answer: ans },
        panels: [array(arr, { label: 'arr', ranges: [{ from: l, to: r, label: `= ${ans}`, tone: 'found' }] }), preView({ [l]: 'compare', [r + 1]: 'found' })],
      });
    });
    return String(first);
  },
});

// ---------- Example 1: pivot index ----------
export const pivotTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [1, 7, 3, 6, 5, 6], minLen: 1, maxLen: 10, min: -20, max: 20 }],
  run({ arr }, t) {
    const total = arr.reduce((a, b) => a + b, 0);
    let left = 0;
    t.frame({ line: 'total', caption: `total = ${total}. Har i par: left pata hai (chalte-chalte jodte jaayenge), aur right = total − left − arr[i]. Do loops ki zaroorat nahi!`, vars: { total }, panels: [array(arr)] });
    for (let i = 0; i < arr.length; i++) {
      const right = total - left - arr[i];
      const ranges = [];
      if (i > 0) ranges.push({ from: 0, to: i - 1, label: `left = ${left}`, tone: 'active' as Tone });
      if (i < arr.length - 1) ranges.push({ from: i + 1, to: arr.length - 1, label: `right = ${right}`, tone: 'compare' as Tone });
      const hit = left === right;
      t.frame({
        line: hit ? 'found' : 'check',
        caption: hit ? `i = ${i}: left (${left}) == right (${right}) → pivot mil gaya!` : `i = ${i}: left = ${left}, right = ${total} − ${left} − ${arr[i]} = ${right}. Barabar nahi.`,
        vars: { i, left, right },
        panels: [array(arr, { tones: { [i]: hit ? 'found' : 'swap' }, pointers: { i }, ranges })],
      });
      if (hit) return String(i);
      left += arr[i];
      t.frame({ line: 'add', caption: `left += arr[${i}] → left = ${left}. Agla i.`, vars: { i, left }, panels: [array(arr, { tones: { [i]: 'done' }, pointers: { i } })] });
    }
    t.frame({ line: 'none', caption: 'Koi index nahi mila → -1. Ek pass + total ke liye ek pass = O(n), O(1) space.', panels: [array(arr)] });
    return '-1';
  },
});

// ---------- Example 2: product except self ----------
export const productTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [1, 2, 3, 4], minLen: 2, maxLen: 8, min: -5, max: 5 }],
  run({ nums }, t) {
    const n = nums.length;
    const res = Array(n).fill(0);
    res[0] = 1;
    t.frame({ caption: 'Plan: res[i] = (i ke LEFT ka product) × (i ke RIGHT ka product). Division nahi — 0 hone par division fail hota hai.', panels: [array(nums, { label: 'nums' }), array(res, { label: 'res', tones: { 0: 'new' } })] });
    for (let i = 1; i < n; i++) {
      res[i] = res[i - 1] * nums[i - 1];
      t.frame({
        line: 'left',
        caption: `Left pass: res[${i}] = res[${i - 1}] × nums[${i - 1}] = ${res[i]} (index 0..${i - 1} ka product — prefix product).`,
        vars: { i },
        panels: [array(nums, { label: 'nums', ranges: [{ from: 0, to: i - 1, label: 'left', tone: 'active' }] }), array(res, { label: 'res', tones: { [i]: 'new' }, pointers: { i } })],
      });
    }
    let right = 1;
    for (let i = n - 1; i >= 0; i--) {
      res[i] *= right;
      const ranges = i < n - 1 ? [{ from: i + 1, to: n - 1, label: `right = ${right}`, tone: 'compare' as Tone }] : [];
      t.frame({
        line: 'right',
        caption: `Right pass: res[${i}] ×= right (${right}) → ${res[i]}. Ab right ×= nums[${i}].`,
        vars: { i, right },
        panels: [array(nums, { label: 'nums', tones: { [i]: 'muted' }, ranges }), array(res, { label: 'res', tones: { [i]: 'found' }, pointers: { i } })],
      });
      right *= nums[i];
    }
    t.frame({ line: 'done', caption: `Answer ${listStr(res)}. Do pass → O(n). Output array chhod ke sirf ek variable (right) → O(1) extra space.`, panels: [array(nums, { label: 'nums' }), array(res, { label: 'res' })] });
    return listStr(res);
  },
});

// ---------- Example 3: 2D prefix sum ----------
const labeled = (values: Cell[][], tones: Record<string, Tone>, label: string, offset = 0): GridPanel => ({
  kind: 'grid',
  label,
  values: values.map((r) => [...r]),
  tones,
  rowLabels: values.map((_, i) => String(i - offset)),
  colLabels: (values[0] ?? []).map((_, j) => String(j - offset)),
});

export const prefix2DTrace = tracer<{ g: number[][] }>({
  inputs: [{ name: 'g', type: 'intGrid', label: 'Grid', default: [[3, 0, 1, 4], [5, 6, 3, 2], [1, 2, 0, 1]], maxRows: 4, maxCols: 4, min: 0, max: 9 }],
  run({ g }, t) {
    const R = g.length;
    const C = g[0].length;
    const pre: number[][] = Array.from({ length: R + 1 }, () => Array(C + 1).fill(0));
    const preGrid = (tones: Record<string, Tone>) => ({ ...labeled(pre, tones, 'pre (ek extra 0 wali row/column ke saath)'), corner: 'pre' });
    t.frame({ line: 'alloc', caption: `pre = (${R}+1) × (${C}+1). pre[r][c] = upar-left kone (0,0) se (r−1, c−1) tak ke rectangle ka sum. Pehli row/column 0 — edge cases khatam.`, panels: [labeled(g, {}, 'g'), preGrid({})] });
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        pre[r + 1][c + 1] = g[r][c] + pre[r][c + 1] + pre[r + 1][c] - pre[r][c];
        t.frame({
          line: 'build',
          caption: `pre[${r + 1}][${c + 1}] = g (${g[r][c]}) + upar (${pre[r][c + 1]}) + left (${pre[r + 1][c]}) − kona (${pre[r][c]}) = ${pre[r + 1][c + 1]}. Kona dono mein gina gaya tha, isliye ek baar ghataya.`,
          vars: { r, c },
          legend: { new: 'naya pre cell', compare: 'jodo', error: 'ghatao (kona)', active: 'g ka cell' },
          panels: [
            labeled(g, { [`${r},${c}`]: 'active' }, 'g'),
            preGrid({ [`${r + 1},${c + 1}`]: 'new', [`${r},${c + 1}`]: 'compare', [`${r + 1},${c}`]: 'compare', [`${r},${c}`]: 'error' }),
          ],
        });
      }
    }
    const r1 = Math.min(1, R - 1);
    const c1 = Math.min(1, C - 1);
    const r2 = Math.min(2, R - 1);
    const c2 = Math.min(2, C - 1);
    const ans = pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1];
    const rect: Record<string, Tone> = {};
    for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) rect[`${r},${c}`] = 'found';
    t.frame({
      line: 'query',
      caption: `Rectangle (${r1},${c1})–(${r2},${c2}) = bada (${pre[r2 + 1][c2 + 1]}) − upar wala (${pre[r1][c2 + 1]}) − left wala (${pre[r2 + 1][c1]}) + kona wapas (${pre[r1][c1]}) = ${ans}. Grid kitna bhi bada ho — 4 numbers, O(1)!`,
      vars: { answer: ans },
      legend: { found: 'rectangle / bada total', error: 'ghatao', new: 'kona — wapas jodo' },
      panels: [labeled(g, rect, 'g'), preGrid({ [`${r2 + 1},${c2 + 1}`]: 'found', [`${r1},${c2 + 1}`]: 'error', [`${r2 + 1},${c1}`]: 'error', [`${r1},${c1}`]: 'new' })],
    });
    return String(ans);
  },
});
