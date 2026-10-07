import { array, heapSim, heapView, listStr, tracer } from '@/components/viz/engine/tracer';
import type { ArrRange, Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
type Hot = Record<string, Tone>;
type Item = { v: number; id: string };

const maxHeap = () => heapSim<Item>((x, y) => x.v > y.v);
const minHeap = () => heapSim<Item>((x, y) => x.v < y.v);
const at = (items: Item[], id: string) => items.findIndex((x) => x.id === id);
/** Kotlin/Java Double jaisa: 5 → "5.0", 7.5 → "7.5" */
const dbl = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n));
const med = (L: Item[], R: Item[]) => (L.length > R.length ? L[0].v : (L[0].v + R[0].v) / 2);
const medWhy = (L: Item[], R: Item[]) =>
  L.length > R.length
    ? `Total ${L.length + R.length} (odd) → median = left ka top ${L[0].v}`
    : `Total ${L.length + R.length} (even) → median = (${L[0].v} + ${R[0].v}) / 2 = ${dbl(med(L, R))}`;

/** dono heaps ke tree: left top 'active', right top 'compare', `hot` ids upar se */
function halves(L: Item[], R: Item[], hot: Hot = {}, names = ['Left: chhota aadha (MAX-heap)', 'Right: bada aadha (MIN-heap)']): Panel[] {
  return [L, R].map((items, side) => {
    const tones: Tones = items.length ? { 0: side ? 'compare' : 'active' } : {};
    items.forEach((x, i) => hot[x.id] && (tones[i] = hot[x.id]));
    return heapView(
      items.map((x) => x.v),
      { ids: items.map((x) => x.id), tones, label: `${names[side]} · size ${items.length}` },
    );
  });
}
const topsLegend = { active: 'left ka top (chhoton mein sabse bada)', compare: 'right ka top (badon mein sabse chhota)', new: 'abhi aaya', swap: 'dusre heap mein gaya' };

// ---------- 3. Visual intro: do aadhe, median beech mein ----------
export const halvesTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'Stream (numbers ek ek aate hain)', default: [5, 15, 1, 3, 8, 7], minLen: 1, maxLen: 9, min: 0, max: 99 }],
  run({ nums }, t) {
    const L = maxHeap();
    const R = minHeap();
    const legend = topsLegend;
    const view = (hot: Hot = {}): Panel[] => {
      const ls = [...L.a].sort((x, y) => x.v - y.v);
      const rs = [...R.a].sort((x, y) => x.v - y.v);
      const all = [...ls, ...rs];
      const tones: Tones = {};
      if (ls.length) tones[ls.length - 1] = 'active';
      if (rs.length) tones[ls.length] = 'compare';
      all.forEach((x, i) => hot[x.id] && (tones[i] = hot[x.id]));
      const ranges: ArrRange[] = [];
      if (ls.length) ranges.push({ from: 0, to: ls.length - 1, label: 'left' });
      if (rs.length) ranges.push({ from: ls.length, to: all.length - 1, label: 'right' });
      return [
        array(all.map((x) => x.v), { ids: all.map((x) => x.id), tones, ranges, label: 'Sorted view (sirf samjhane ke liye — code kabhi sort nahi karta)' }),
        ...halves(L.a, R.a, hot),
      ];
    };
    t.frame({ caption: 'Har naye number ke baad median chahiye. Idea: numbers ko do aadhon mein divide karo — chhota aadha LEFT (max-heap), bada aadha RIGHT (min-heap). Median hamesha in dono ke TOP par milega.', legend, panels: view() });
    nums.forEach((x, i) => {
      const id = `e${i}`;
      const toLeft = !L.a.length || x <= L.a[0].v;
      const why = !L.a.length ? 'left khaali hai' : toLeft ? `${x} ≤ left ka top ${L.a[0].v}` : `${x} > left ka top ${L.a[0].v}`;
      const side = toLeft ? 'chhote aadhe (left)' : 'bade aadhe (right)';
      (toLeft ? L : R).add({ v: x, id });
      const from = L.a.length > R.a.length + 1 ? L : R.a.length > L.a.length ? R : null;
      if (!from) {
        t.frame({ caption: `${x} aaya: ${why} → ${side} mein. Sizes ${L.a.length} / ${R.a.length} theek (left = right ya right + 1). ${medWhy(L.a, R.a)}.`, vars: { x, median: dbl(med(L.a, R.a)) }, legend, panels: view({ [id]: 'new' }) });
        return;
      }
      t.frame({ caption: `${x} aaya: ${why} → ${side} mein. Ab sizes ${L.a.length} / ${R.a.length} — ek taraf zyada bhari, balance toota.`, vars: { x }, legend, panels: view({ [id]: 'new' }) });
      const m = from.poll()!;
      (from === L ? R : L).add(m);
      const edge = from === L ? 'Left ka top (chhoton mein sabse bada)' : 'Right ka top (badon mein sabse chhota)';
      t.frame({ caption: `${edge} ${m.v} ${from === L ? 'right' : 'left'} mein gaya. Order nahi toota — wo seedha boundary (boundary) par tha. Sizes ${L.a.length} / ${R.a.length}. ${medWhy(L.a, R.a)}.`, vars: { x, median: dbl(med(L.a, R.a)) }, legend, panels: view({ [m.id]: 'swap' }) });
    });
    t.frame({ caption: `Har number par sirf tops dekhe aur max ek number idhar-udhar kiya → O(log n). Median padhna O(1) — beech wale hamesha tops par. Final median = ${dbl(med(L.a, R.a))}.`, legend, panels: view() });
    return dbl(med(L.a, R.a));
  },
});

// ---------- 4. How: running median (route + balance) ----------
export const medianTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [5, 15, 1, 3, 8], minLen: 1, maxLen: 8, min: -20, max: 99 }],
  run({ nums }, t) {
    const L = maxHeap();
    const R = minHeap();
    const out: string[] = [];
    const legend = { ...topsLegend, found: 'naya median' };
    const view = (i: number | undefined, hot: Hot = {}): Panel[] => [
      ...halves(L.a, R.a, hot),
      array(nums, { pointers: { x: i }, label: 'nums' }),
      array(out, { label: 'Medians', tones: out.length ? { [out.length - 1]: 'found' } : {} }),
    ];
    t.frame({ line: 'init', caption: '2 heaps, do rule: (1) left ka har number ≤ right ka har number. (2) left.size = right.size, ya right.size + 1. Dono sach → median tops se.', legend, panels: view(undefined) });
    nums.forEach((x, i) => {
      const id = `e${i}`;
      const sizes = () => ({ x, left: L.a.length, right: R.a.length });
      if (!L.a.length || x <= L.a[0].v) {
        const why = L.a.length ? `${x} ≤ left ka top ${L.a[0].v}` : 'Left khaali';
        L.add({ v: x, id });
        t.frame({ line: 'toL', caption: `${why} → chhote aadhe ka → left.add(${x}). Rule 1 bacha.`, vars: sizes(), legend, panels: view(i, { [id]: 'new' }) });
      } else {
        const lt = L.a[0].v;
        R.add({ v: x, id });
        t.frame({ line: 'toR', caption: `${x} > left ka top ${lt} → bade aadhe ka → right.add(${x}). Rule 1 bacha.`, vars: sizes(), legend, panels: view(i, { [id]: 'new' }) });
      }
      if (L.a.length > R.a.length + 1) {
        const m = L.poll()!;
        R.add(m);
        t.frame({ line: 'fixL', caption: `Left ${L.a.length + 1}, right ${R.a.length - 1} — farak 2, rule 2 toota. Left ka top ${m.v} right mein. Wo left ka sabse bada tha, to rule 1 phir bhi sach.`, vars: sizes(), legend, panels: view(i, { [m.id]: 'swap' }) });
      } else if (R.a.length > L.a.length) {
        const m = R.poll()!;
        L.add(m);
        t.frame({ line: 'fixR', caption: `Right ${R.a.length + 1}, left ${L.a.length - 1} — right bada, rule 2 toota. Right ka top ${m.v} left mein. Wo right ka sabse chhota tha, to rule 1 phir bhi sach.`, vars: sizes(), legend, panels: view(i, { [m.id]: 'swap' }) });
      }
      out.push(dbl(med(L.a, R.a)));
      t.frame({ line: 'median', caption: `${medWhy(L.a, R.a)}.`, vars: { ...sizes(), median: out[out.length - 1] }, legend, panels: view(i) });
    });
    t.frame({ caption: `Medians: ${listStr(out)}. Har number par 2-3 heap ops → O(log n); median padhna O(1). Total O(n log n), memory O(n).`, legend, panels: view(undefined) });
    return listStr(out);
  },
});

// ---------- Example 1: MedianFinder (3 step wala trick) ----------
export const finderTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'addNum ke numbers (aakhir mein findMedian)', default: [6, 10, 2, 6, 5, 0], minLen: 1, maxLen: 8, min: -20, max: 99 }],
  run({ nums }, t) {
    const L = maxHeap();
    const R = minHeap();
    const legend = topsLegend;
    const view = (i: number | undefined, hot: Hot = {}): Panel[] => [...halves(L.a, R.a, hot), array(nums, { pointers: { add: i }, label: 'addNum calls' })];
    t.frame({ caption: 'Har addNum ke 3 fix step: (1) left mein daalo. (2) left ka top right mein. (3) right bada ho gaya to uska top wapas left. "Kis heap mein jaaye?" wala if likhna hi nahi padta.', legend, panels: view(undefined) });
    nums.forEach((x, i) => {
      const id = `e${i}`;
      const sizes = () => ({ num: x, left: L.a.length, right: R.a.length });
      L.add({ v: x, id });
      t.frame({ line: 'push', caption: `addNum(${x}), step 1: seedha left mein. Abhi pata nahi ${x} chhote aadhe ka hai ya bade ka — step 2 batayega.`, vars: sizes(), legend, panels: view(i, { [id]: 'new' }) });
      const m = L.poll()!;
      R.add(m);
      const said =
        m.id === id
          ? `Left ka top ${x} khud nikla → ${x} bade aadhe ka tha, ab right mein.`
          : `Left ka top ${m.v} right mein gaya; ${x} left mein reh gaya → chhote aadhe ka hai.`;
      t.frame({ line: 'move', caption: `Step 2: ${said} Left ka sabse bada hi bheja, isliye left ≤ right pakka.`, vars: sizes(), legend, panels: view(i, { [m.id]: 'swap' }) });
      if (R.a.length > L.a.length) {
        const b = R.poll()!;
        L.add(b);
        t.frame({ line: 'balance', caption: `Step 3: right (${R.a.length + 1}) > left (${L.a.length - 1}) → right ka top ${b.v} wapas left. Sizes ab ${L.a.length} / ${R.a.length}.`, vars: sizes(), legend, panels: view(i, { [b.id]: 'swap' }) });
      } else {
        t.frame({ line: 'balance', caption: `Step 3: right (${R.a.length}) left (${L.a.length}) se bada nahi → kuch nahi karna. Har add mein 3-5 heap ops, phir bhi O(log n).`, vars: sizes(), legend, panels: view(i) });
      }
    });
    const ans = dbl(med(L.a, R.a));
    t.frame({ line: 'find', caption: `findMedian(): ${medWhy(L.a, R.a)}. Sirf peek → O(1).`, vars: { left: L.a.length, right: R.a.length, median: ans }, legend, panels: view(undefined) });
    return ans;
  },
});

// ---------- Example 2: IPO — locked (capital min-heap) + ready (profit max-heap) ----------
export const ipoTrace = tracer<{ profits: number[]; capital: number[]; k: number; w: number }>({
  inputs: [
    { name: 'profits', type: 'intArray', label: 'profits', default: [3, 5, 2, 7, 1], minLen: 1, maxLen: 7, min: 0, max: 20 },
    { name: 'capital', type: 'intArray', label: 'capital (shuru karne ke liye kitna paisa)', default: [0, 2, 1, 6, 3], minLen: 1, maxLen: 7, min: 0, max: 30 },
    { name: 'k', type: 'int', label: 'k (max projects)', default: 3, min: 1, max: 5 },
    { name: 'w', type: 'int', label: 'w (shuru ka paisa)', default: 1, min: 0, max: 10 },
  ],
  check: ({ profits, capital }) => (profits.length === capital.length ? null : 'profits aur capital ki length same rakho.'),
  run({ profits, capital, k, w }, t) {
    const n = profits.length;
    const locked = heapSim<number>((x, y) => capital[x] < capital[y]);
    const ready = maxHeap();
    const state: Tone[] = Array(n).fill('muted');
    const done = new Set<number>();
    let money = w;
    const legend = { muted: 'locked (paisa kam)', active: 'ready (afford ho sakta)', new: 'abhi khula', found: 'abhi kiya', done: 'ho gaya' };
    const view = (hot: Record<number, Tone> = {}): Panel[] => {
      const gt: Record<string, Tone> = {};
      for (let i = 0; i < n; i++) {
        const tone = hot[i] ?? (done.has(i) ? 'done' : state[i]);
        gt[`0,${i}`] = tone;
        gt[`1,${i}`] = tone;
      }
      const rt: Tones = {};
      ready.a.forEach((x, j) => {
        const p = Number(x.id.slice(1));
        if (hot[p]) rt[j] = hot[p];
      });
      return [
        { kind: 'grid', label: 'Projects', values: [capital, profits], rowLabels: ['capital', 'profit'], colLabels: profits.map((_, i) => `P${i}`), tones: gt },
        heapView(locked.a.map((i) => capital[i]), { ids: locked.a.map((i) => `p${i}`), label: `Locked: capital par MIN-heap · ${locked.a.length}` }),
        heapView(ready.a.map((x) => x.v), { ids: ready.a.map((x) => x.id), tones: rt, label: `Ready: profit par MAX-heap · ${ready.a.length}` }),
      ];
    };
    for (let i = 0; i < n; i++) locked.add(i);
    t.frame({ line: 'init', caption: `Paisa ${w}. Sab projects LOCKED heap mein — capital par min-heap, taaki sabse sasta project sabse pehle khule. READY heap = jo afford ho sakte, profit par max-heap.`, vars: { money }, legend, panels: view() });
    let round = 1;
    for (; round <= k; round++) {
      const opened: number[] = [];
      while (locked.a.length && capital[locked.a[0]] <= money) {
        const i = locked.poll()!;
        ready.add({ v: profits[i], id: `r${i}` });
        state[i] = 'active';
        opened.push(i);
      }
      const hot = Object.fromEntries(opened.map((i) => [i, 'new' as Tone]));
      if (opened.length) {
        t.frame({ line: 'unlock', caption: `Round ${round}: paisa ${money}. Locked ka top jab tak capital ≤ ${money} → ready mein: ${opened.map((i) => `P${i}`).join(', ')}. Paisa sirf badhta hai, isliye khula project kabhi wapas lock nahi hota.`, vars: { round, money }, legend, panels: view(hot) });
      } else {
        t.frame({ line: 'unlock', caption: `Round ${round}: paisa ${money}. ${locked.a.length ? `Locked ka top capital ${capital[locked.a[0]]} > ${money}` : 'Locked khaali'} → koi naya project nahi khula.`, vars: { round, money }, legend, panels: view() });
      }
      if (!ready.a.length) {
        t.frame({ line: 'stuck', caption: `Ready khaali — koi project afford nahi. Paisa badhega hi nahi, to aage ke rounds bekaar. Ruko.`, vars: { round, money }, legend, panels: view() });
        break;
      }
      const best = ready.poll()!;
      const p = Number(best.id.slice(1));
      money += best.v;
      done.add(p);
      t.frame({ line: 'pick', caption: `Ready ka top: P${p}, profit ${best.v} — afford hone walon mein sabse kamau. Kiya → paisa ${money}. Chhota profit lene se kabhi fayda nahi: zyada paisa = zyada projects khulte hain.`, vars: { round, money }, legend, panels: view({ [p]: 'found' }) });
    }
    t.frame({ line: 'done', caption: `Aakhri paisa ${money}. Har project ek baar locked se nikla, ek baar ready se → O(n log n + k log n).`, vars: { money }, legend, panels: view() });
    return String(money);
  },
});

// ---------- Example 3: Sliding window median (add + remove + balance) ----------
export const windowMedianTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [5, 2, 8, 1, 9, 3, 7], minLen: 1, maxLen: 9, min: -9, max: 20 },
    { name: 'k', type: 'int', label: 'k (window)', default: 3, min: 1, max: 4 },
  ],
  check: ({ nums, k }) => (k <= nums.length ? null : `k 1 se ${nums.length} ke beech rakho.`),
  run({ nums, k }, t) {
    const L = maxHeap();
    const R = minHeap();
    const out: string[] = [];
    const legend = { ...topsLegend, error: 'window se bahar', found: 'naya median' };
    const view = (i: number, hot: Hot = {}, gone?: number): Panel[] => {
      const lo = Math.max(0, i - k + 1);
      const tones: Tones = gone === undefined ? {} : { [gone]: 'error' };
      return [
        array(nums, { pointers: { i }, tones, ranges: [{ from: lo, to: i, label: `window (k = ${k})` }], label: 'nums' }),
        ...halves(L.a, R.a, hot, ['Left: window ka chhota aadha (MAX)', 'Right: window ka bada aadha (MIN)']),
        array(out, { label: 'Medians', tones: out.length ? { [out.length - 1]: 'found' } : {} }),
      ];
    };
    nums.forEach((x, i) => {
      const id = `e${i}`;
      const sizes = () => ({ i, left: L.a.length, right: R.a.length });
      const toLeft = !L.a.length || x <= L.a[0].v;
      const why = !L.a.length ? 'left khaali' : toLeft ? `${x} ≤ left ka top ${L.a[0].v}` : `${x} > left ka top ${L.a[0].v}`;
      (toLeft ? L : R).add({ v: x, id });
      t.frame({ line: 'add', caption: `nums[${i}] = ${x} window mein aaya: ${why} → ${toLeft ? 'left' : 'right'}.`, vars: sizes(), legend, panels: view(i, { [id]: 'new' }) });
      if (i >= k) {
        const old = nums[i - k];
        const inLeft = old <= L.a[0].v;
        const where = inLeft ? `${old} ≤ left ka top ${L.a[0].v} → left mein hai` : `${old} > left ka top ${L.a[0].v} → right mein hai`;
        const heap = inLeft ? L : R;
        const victim = heap.a.find((y) => y.v === old)!;
        t.frame({ line: 'remove', caption: `nums[${i - k}] = ${old} window se bahar: ${where}. remove(${old}) — heap mein dhoondhna padta hai, O(k).`, vars: sizes(), legend, panels: view(i, { [victim.id]: 'error' }, i - k) });
        heap.remove((y) => y.v === old);
      }
      if (L.a.length > R.a.length + 1 || R.a.length > L.a.length) {
        const fromL = L.a.length > R.a.length;
        const was = `${L.a.length} / ${R.a.length}`;
        const m = (fromL ? L : R).poll()!;
        (fromL ? R : L).add(m);
        t.frame({ line: 'fix', caption: `Sizes ${was} — balance toota. ${fromL ? 'Left' : 'Right'} ka top ${m.v} ${fromL ? 'right' : 'left'} mein. Ab ${L.a.length} / ${R.a.length}.`, vars: sizes(), legend, panels: view(i, { [m.id]: 'swap' }) });
      }
      if (i >= k - 1) {
        out.push(dbl(med(L.a, R.a)));
        t.frame({ line: 'median', caption: `Window nums[${i - k + 1}..${i}] poori. ${medWhy(L.a, R.a)}.`, vars: { ...sizes(), median: out[out.length - 1] }, legend, panels: view(i) });
      }
    });
    const res = listStr(out);
    t.frame({ caption: `Medians: ${res}. Har step: add O(log k) + remove O(k) + balance O(log k) → total O(n·k). TreeMap / lazy deletion se O(n log k).`, legend, panels: view(nums.length - 1) });
    return res;
  },
});
