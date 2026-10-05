import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

const stackPanel = (items: Cell[], label: string, tones: Record<number, Tone> = {}): Panel => ({ kind: 'stack', label, items: [...items], tones });

// ---------- 3. Visual intro: imaarton se aage dekhna ----------
export const buildingsView = tracer<{ heights: number[] }>({
  inputs: [{ name: 'heights', type: 'intArray', label: 'Imaarton ki unchai', default: [3, 1, 2, 5, 4, 6], minLen: 2, maxLen: 8, min: 1, max: 9 }],
  run({ heights }, t) {
    const res: Cell[] = heights.map(() => '?');
    const st: number[] = [];
    const bars = (hot: Record<number, Tone> = {}): Panel[] => [
      { kind: 'bars', values: heights, tones: { ...Object.fromEntries(st.map((i) => [i, 'compare' as Tone])), ...hot } },
      stackPanel(st.map((i) => heights[i]), 'Intezaar mein (stack)'),
      array(res, { label: 'Daayein pehli lambi imaarat' }),
    ];
    t.frame({ caption: 'Har imaarat ki chhat se daayein dekho: pehli LAMBI imaarat kaunsi? Brute force: har ek ke liye aage scan → O(n²). Stack: jinka jawab abhi nahi mila, unhe intezaar karwao.', legend: { compare: 'intezaar mein' }, panels: bars() });
    for (let i = 0; i < heights.length; i++) {
      const popped: number[] = [];
      while (st.length && heights[st[st.length - 1]] < heights[i]) {
        const j = st.pop()!;
        res[j] = heights[i];
        popped.push(j);
      }
      if (popped.length) t.frame({ caption: `${heights[i]} aayi — intezaar kar rahi chhoti imaartein (${popped.map((j) => heights[j]).join(', ')}) ko jawab mil gaya: ${heights[i]}. Stack se bahar.`, legend: { found: 'jawab mila', compare: 'intezaar mein' }, panels: bars({ [i]: 'active', ...Object.fromEntries(popped.map((j) => [j, 'found' as Tone])) }) });
      st.push(i);
      t.frame({ caption: `${heights[i]} khud intezaar mein (stack par). Stack mein unchaiyan hamesha neeche se upar GHATTI hain — isliye "monotonic".`, legend: { compare: 'intezaar mein' }, panels: bars({ [i]: 'new' }) });
    }
    for (const j of st) res[j] = -1;
    t.frame({ caption: `Jo stack mein bache, unke daayein koi lambi nahi → −1. Har imaarat ek baar push, ek baar pop → O(n).`, panels: bars() });
    return listStr(res);
  },
});

// ---------- 4. How: next greater element ----------
export const ngTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [2, 1, 2, 4, 3], minLen: 1, maxLen: 9, min: -9, max: 20 }],
  run({ nums }, t) {
    const res = nums.map(() => -1);
    const st: number[] = [];
    const view = (i: number, hot: Record<number, Tone> = {}): Panel[] => [
      array(nums, { pointers: { i }, tones: hot }),
      stackPanel(st.map((j) => `${j}:${nums[j]}`), 'Stack (index:value)'),
      array(res, { label: 'res' }),
    ];
    for (let i = 0; i < nums.length; i++) {
      while (st.length && nums[st[st.length - 1]] < nums[i]) {
        const j = st.pop()!;
        res[j] = nums[i];
        t.frame({ line: 'pop', caption: `nums[${j}] = ${nums[j]} < ${nums[i]} → index ${j} ka next greater = ${nums[i]}. Pop.`, vars: { i }, panels: view(i, { [j]: 'found', [i]: 'active' }) });
      }
      st.push(i);
      t.frame({ line: 'push', caption: `Index ${i} (${nums[i]}) ka answer abhi nahi pata → push.`, vars: { i }, panels: view(i, { [i]: 'new' }) });
    }
    t.frame({ line: 'done', caption: `Bache hue (${st.map((j) => nums[j]).join(', ') || 'koi nahi'}) ka koi bada nahi → −1. Result ${listStr(res)}.`, panels: view(nums.length - 1) });
    return listStr(res);
  },
});

// ---------- Example 1: next greater element I ----------
export const nge1Trace = tracer<{ nums1: number[]; nums2: number[] }>({
  inputs: [
    { name: 'nums1', type: 'intArray', label: 'nums1 (nums2 ka subset)', default: [4, 1, 2], minLen: 1, maxLen: 5, min: 0, max: 9, distinct: true },
    { name: 'nums2', type: 'intArray', label: 'nums2 (distinct)', default: [1, 3, 4, 2], minLen: 1, maxLen: 7, min: 0, max: 9, distinct: true },
  ],
  check: ({ nums1, nums2 }) => (nums1.every((x) => nums2.includes(x)) ? null : 'nums1 ke saare numbers nums2 mein hone chahiye.'),
  run({ nums1, nums2 }, t) {
    const next = new Map<number, number>();
    const st: number[] = [];
    const mapPanel = (): Panel => ({ kind: 'map', label: 'next (value → next greater)', keyLabel: 'value', valueLabel: 'next', entries: [...next.entries()].map(([k, v]) => ({ key: k, value: v })) });
    nums2.forEach((x, i) => {
      while (st.length && st[st.length - 1] < x) {
        const v = st.pop()!;
        next.set(v, x);
        t.frame({ line: 'pop', caption: `${v} < ${x} → next[${v}] = ${x}.`, panels: [array(nums2, { label: 'nums2', pointers: { i } }), stackPanel(st, 'Stack'), mapPanel()] });
      }
      st.push(x);
      t.frame({ line: 'push', caption: `${x} push (iska next abhi nahi pata).`, panels: [array(nums2, { label: 'nums2', pointers: { i }, tones: { [i]: 'new' } }), stackPanel(st, 'Stack'), mapPanel()] });
    });
    const res = nums1.map((x) => next.get(x) ?? -1);
    t.frame({ line: 'lookup', caption: `nums2 par EK pass se sabke next greater map mein. Ab nums1 ke liye bas lookup → ${listStr(res)}. O(n + m).`, panels: [array(nums1, { label: 'nums1' }), array(res, { label: 'answer' }), mapPanel()] });
    return listStr(res);
  },
});

// ---------- Example 2: daily temperatures ----------
export const tempsTrace = tracer<{ temps: number[] }>({
  inputs: [{ name: 'temps', type: 'intArray', label: 'Temperatures', default: [73, 74, 75, 71, 69, 72, 76, 73], minLen: 1, maxLen: 9, min: 30, max: 80 }],
  run({ temps }, t) {
    const res = temps.map(() => 0);
    const st: number[] = [];
    const view = (i: number, hot: Record<number, Tone> = {}): Panel[] => [
      array(temps, { pointers: { i }, tones: hot }),
      stackPanel(st.map((d) => `din ${d}: ${temps[d]}`), 'Intezaar mein (stack)'),
      array(res, { label: 'Kitne din baad garam' }),
    ];
    for (let i = 0; i < temps.length; i++) {
      while (st.length && temps[st[st.length - 1]] < temps[i]) {
        const d = st.pop()!;
        res[d] = i - d;
        t.frame({ line: 'pop', caption: `Din ${i} (${temps[i]}) din ${d} (${temps[d]}) se garam → ${i} − ${d} = ${res[d]} din baad.`, panels: view(i, { [d]: 'found', [i]: 'active' }) });
      }
      st.push(i);
      t.frame({ line: 'push', caption: `Din ${i} intezaar mein.`, panels: view(i, { [i]: 'new' }) });
    }
    t.frame({ line: 'pop', caption: `Bache dino ke liye garam din aaya hi nahi → 0. Next greater hi hai, bas value ki jagah doori — isliye stack mein index.`, panels: view(temps.length - 1) });
    return listStr(res);
  },
});

// ---------- Example 3: largest rectangle in histogram ----------
export const histTrace = tracer<{ h: number[] }>({
  inputs: [{ name: 'h', type: 'intArray', label: 'Bar heights', default: [2, 1, 5, 6, 2, 3], minLen: 1, maxLen: 8, min: 0, max: 9 }],
  run({ h }, t) {
    const st: number[] = [];
    let best = 0;
    let bestSpan: [number, number] | null = null;
    const view = (hot: Record<number, Tone> = {}): Panel[] => [
      { kind: 'bars', values: h, tones: { ...Object.fromEntries(st.map((i) => [i, 'compare' as Tone])), ...hot } },
      stackPanel(st.map((i) => `${i}:${h[i]}`), 'Stack (index:height), badhte'),
    ];
    t.frame({ line: 'push', caption: 'Har bar ke liye socho: "isi bar ki height wala sabse chauda rectangle" — left mein pehla chhota bar aur right mein pehla chhota bar deewar hain. Stack dono ek pass mein deta hai.', vars: { best }, legend: { compare: 'stack mein' }, panels: view() });
    for (let i = 0; i <= h.length; i++) {
      const cur = i === h.length ? 0 : h[i];
      while (st.length && h[st[st.length - 1]] >= cur) {
        const top = st.pop()!;
        const left = st.length ? st[st.length - 1] : -1;
        const area = h[top] * (i - left - 1);
        const better = area > best;
        if (better) {
          best = area;
          bestSpan = [left + 1, i - 1];
        }
        const span = Object.fromEntries(Array.from({ length: i - left - 1 }, (_, q) => [left + 1 + q, 'active' as Tone]));
        t.frame({ line: 'area', caption: `${i === h.length ? 'Aakhir (nakli 0)' : `Bar ${i} (${cur})`} ≤ top bar ${top} (${h[top]}) → ${h[top]} wala rectangle aage nahi badhega. Right deewar = ${i}, left deewar = ${left} (stack mein neeche wala). Width ${i - left - 1} × ${h[top]} = ${area}.${better ? ' Naya best!' : ''}`, vars: { best }, legend: { active: 'rectangle', compare: 'stack mein' }, panels: view({ ...span, [top]: better ? 'found' : 'active' }) });
      }
      if (i < h.length) {
        st.push(i);
        t.frame({ line: 'push', caption: `Bar ${i} (${h[i]}) push — heights badhte rahenge.`, vars: { best }, legend: { compare: 'stack mein' }, panels: view({ [i]: 'new' }) });
      }
    }
    const span = bestSpan ? Object.fromEntries(Array.from({ length: bestSpan[1] - bestSpan[0] + 1 }, (_, q) => [bestSpan![0] + q, 'found' as Tone])) : {};
    t.frame({ line: 'area', caption: `Sabse bada area = ${best}. Har bar ek push, ek pop → O(n) (brute har jode ke liye → O(n²)).`, vars: { best }, panels: view(span) });
    return String(best);
  },
});
