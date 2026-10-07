import { array, heapSim, heapView, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
type Item = { v: number; id: string };
const tree = (items: { v: Cell; id: string }[], tones: Tones = {}, label?: string): Panel => heapView(items.map((x) => x.v), { ids: items.map((x) => x.id), tones, label });
const at = (items: { id: string }[], id: string) => items.findIndex((x) => x.id === id);
const ord = (k: number) => `${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'}`;
const kCheck = ({ nums, k }: { nums: number[]; k: number }) => (k <= nums.length ? null : `k 1 se ${nums.length} ke beech rakho.`);

// ---------- 3. Visual intro: k seats ka club, gatekeeper = min-heap root ----------
export const clubTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'Scores (ek ek aate hain)', default: [5, 12, 3, 8, 15, 7, 10], minLen: 1, maxLen: 10, min: 0, max: 99 },
    { name: 'k', type: 'int', label: 'k (seats)', default: 3, min: 1, max: 5 },
  ],
  check: kCheck,
  run({ nums, k }, t) {
    const pq = heapSim<Item>((x, y) => x.v < y.v);
    const st: Tones = {};
    const legend = { found: 'club mein', muted: 'reject / bahar', new: 'abhi andar', compare: 'gatekeeper (root)' };
    const view = (i: number | undefined, tones: Tones = {}): Panel[] => [tree(pq.a, tones, `Club: min-heap (size ≤ ${k})`), array(nums, { tones: st, pointers: { x: i }, label: 'Stream' })];
    t.frame({ caption: `Club mein sirf k = ${k} seats; hamesha ab tak ke ${k} sabse BADE score andar rakhne hain. Gatekeeper = andar ka sabse WEAK member → isliye MIN-heap (wo root par, O(1) mein dikhta hai).`, legend, panels: view(undefined) });
    nums.forEach((x, i) => {
      const id = `e${i}`;
      if (pq.a.length < k) {
        pq.add({ v: x, id });
        st[i] = 'found';
        t.frame({ caption: `${x}: seat khaali hai (${pq.a.length}/${k}) → seedha andar.`, vars: { x, root: pq.a[0].v }, legend, panels: view(i, { [at(pq.a, id)]: 'new' }) });
        return;
      }
      const root = pq.a[0];
      if (x <= root.v) {
        st[i] = 'muted';
        t.frame({ caption: `${x} ≤ gatekeeper ${root.v} → andar ke sab ${k} isse bade ya barabar. Reject — sirf ek compare, O(1).`, vars: { x, root: root.v }, legend, panels: view(i, { 0: 'compare' }) });
        return;
      }
      t.frame({ caption: `${x} > gatekeeper ${root.v} → ${x} top ${k} mein aata hai. Sabse weak ${root.v} bahar (poll), ${x} andar (add) — O(log k).`, vars: { x, root: root.v }, legend, panels: view(i, { 0: 'compare' }) });
      pq.poll();
      pq.add({ v: x, id });
      st[Number(root.id.slice(1))] = 'muted';
      st[i] = 'found';
      t.frame({ caption: `Naya gatekeeper ${pq.a[0].v}. Club phir bhi ${k} ka hi — heap kabhi k se bada nahi hota.`, vars: { x, root: pq.a[0].v }, legend, panels: view(i, { [at(pq.a, id)]: 'new' }) });
    });
    const top = pq.a.map((x) => x.v).sort((a, b) => b - a);
    t.frame({ caption: `Top ${k} = ${listStr(top)}. Root ${pq.a[0].v} = ${ord(k)} largest. Har item par O(log k), memory sirf O(k) — poora data sort karne ki zaroorat nahi.`, legend, panels: view(undefined, { 0: 'compare' }) });
    return String(pq.a[0].v);
  },
});

// ---------- 4. How: k sabse chhote → size k ka MAX-heap ----------
export const kSmallestTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [7, 2, 9, 4, 1, 8, 3], minLen: 1, maxLen: 10, min: 0, max: 99 },
    { name: 'k', type: 'int', label: 'k', default: 3, min: 1, max: 5 },
  ],
  check: kCheck,
  run({ nums, k }, t) {
    const pq = heapSim<Item>((x, y) => x.v > y.v);
    const st: Tones = {};
    const legend = { found: 'heap mein', muted: 'reject / bahar', new: 'abhi andar', compare: 'root (andar ka sabse bada)' };
    const view = (i: number | undefined, tones: Tones = {}): Panel[] => [tree(pq.a, tones, `Max-heap (size ≤ ${k})`), array(nums, { tones: st, pointers: { x: i }, label: 'nums' })];
    t.frame({ line: 'add', caption: `k = ${k} sabse CHHOTE chahiye → ulta heap: MAX-heap. Root = andar ka sabse bada = sabse pehle bahar jaane layak. Rule: jo rakhna hai uska ulta heap.`, legend, panels: view(undefined) });
    nums.forEach((x, i) => {
      const id = `e${i}`;
      if (pq.a.length < k) {
        pq.add({ v: x, id });
        st[i] = 'found';
        t.frame({ line: 'add', caption: `${x}: heap mein ${pq.a.length}/${k} → jagah thi, add.`, vars: { x, root: pq.a[0].v }, legend, panels: view(i, { [at(pq.a, id)]: 'new' }) });
        return;
      }
      const root = pq.a[0];
      if (x >= root.v) {
        st[i] = 'muted';
        t.frame({ line: 'check', caption: `${x} ≥ root ${root.v} → andar ke sab isse chhote ya barabar. Skip.`, vars: { x, root: root.v }, legend, panels: view(i, { 0: 'compare' }) });
        return;
      }
      pq.poll();
      pq.add({ v: x, id });
      st[Number(root.id.slice(1))] = 'muted';
      st[i] = 'found';
      t.frame({ line: 'swap', caption: `${x} < root ${root.v} → ${root.v} bahar (poll), ${x} andar (add). Naya root ${pq.a[0].v}.`, vars: { x, root: pq.a[0].v }, legend, panels: view(i, { [at(pq.a, id)]: 'new' }) });
    });
    const out = pq.a.map((x) => x.v).sort((a, b) => a - b);
    t.frame({ line: 'done', caption: `Heap mein bache = ${k} sabse chhote. Sort karke ${listStr(out)} (k log k). Total O(n log k), memory O(k).`, legend, panels: view(undefined) });
    return listStr(out);
  },
});

// ---------- Example 1: Kth largest ----------
export const kthLargestTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [3, 2, 1, 5, 6, 4], minLen: 1, maxLen: 10, min: -50, max: 99 },
    { name: 'k', type: 'int', label: 'k', default: 2, min: 1, max: 6 },
  ],
  check: kCheck,
  run({ nums, k }, t) {
    const pq = heapSim<Item>((x, y) => x.v < y.v);
    const legend = { new: 'abhi add', error: 'k se zyada — bahar', found: 'jawab (root)' };
    const view = (i: number | undefined, tones: Tones = {}): Panel[] => [tree(pq.a, tones, 'Min-heap'), array(nums, { pointers: { x: i }, label: 'nums' })];
    t.frame({ line: 'init', caption: `Min-heap jisme ab tak ke ${k} sabse bade rahenge. Chhota code: pehle add karo, size ${k} se zyada ho gaya to sabse chhota poll.`, legend, panels: view(undefined) });
    nums.forEach((x, i) => {
      const id = `e${i}`;
      pq.add({ v: x, id });
      t.frame({ line: 'add', caption: `add(${x}) → size ${pq.a.length}.`, vars: { x, size: pq.a.length }, legend, panels: view(i, { [at(pq.a, id)]: 'new' }) });
      if (pq.a.length > k) {
        const out = pq.a[0].v;
        t.frame({ line: 'trim', caption: `Size ${pq.a.length} > ${k} → sabse chhota ${out} poll. Wo top ${k} mein kabhi nahi aa sakta (${k} bade usse aage hain).`, vars: { x, size: pq.a.length }, legend, panels: view(i, { 0: 'error' }) });
        pq.poll();
      }
    });
    t.frame({ line: 'ans', caption: `Heap mein ${k} sabse bade; unme sabse chhota (root) = ${ord(k)} largest = ${pq.a[0].v}. O(n log k).`, vars: { size: pq.a.length }, legend, panels: view(undefined, { 0: 'found' }) });
    return String(pq.a[0].v);
  },
});

// ---------- Example 2: K closest points ----------
type Pt = { v: number; id: string; p: number[] };
const sq = (n: number) => (n < 0 ? `(${n})²` : `${n}²`);
const ptStr = (p: number[]) => `${p[0]},${p[1]}`;
export const kClosestTrace = tracer<{ pts: number[][]; k: number }>({
  inputs: [
    { name: 'pts', type: 'intGrid', label: 'Points (x y; x y; …)', default: [[1, 3], [-2, 2], [5, -1], [0, 4], [3, 3]], maxRows: 7, maxCols: 2, min: -9, max: 9 },
    { name: 'k', type: 'int', label: 'k', default: 2, min: 1, max: 4 },
  ],
  check: ({ pts, k }) => (pts.some((r) => r.length !== 2) ? 'Har row mein 2 numbers: x y.' : k <= pts.length ? null : `k 1 se ${pts.length} ke beech rakho.`),
  run({ pts, k }, t) {
    const d = (p: number[]) => p[0] * p[0] + p[1] * p[1];
    const pq = heapSim<Pt>((x, y) => x.v > y.v);
    const legend = { new: 'abhi add', error: 'sabse door — bahar', found: 'jawab' };
    const view = (tones: Tones = {}): Panel[] => [
      tree(pq.a, tones, 'Max-heap (d² = x² + y²)'),
      array(pq.a.map((x) => ptStr(x.p)), { ids: pq.a.map((x) => x.id), tones, label: 'Heap ke points' }),
    ];
    t.frame({ line: 'init', caption: `${k} sabse PAAS wale chahiye → "sabse door" ko nikaalte rehna hai → MAX-heap distance par. Distance ke liye x² + y² kaafi — sqrt ki zaroorat nahi (order same rehta hai).`, legend, panels: view() });
    pts.forEach((p, i) => {
      const id = `p${i}`;
      pq.add({ v: d(p), id, p });
      t.frame({ line: 'add', caption: `(${ptStr(p)}): d² = ${sq(p[0])} + ${sq(p[1])} = ${d(p)}. add.`, vars: { point: `(${ptStr(p)})`, d2: d(p) }, legend, panels: view({ [at(pq.a, id)]: 'new' }) });
      if (pq.a.length > k) {
        const far = pq.a[0];
        t.frame({ line: 'trim', caption: `Size > ${k} → sabse door (${ptStr(far.p)}), d² = ${far.v}, poll. Ye ${k} paas walon mein nahi aa sakta.`, vars: { point: `(${ptStr(p)})`, d2: d(p) }, legend, panels: view({ 0: 'error' }) });
        pq.poll();
      }
    });
    const res = pq.a.map((x) => x.p).sort((a, b) => d(a) - d(b) || a[0] - b[0] || a[1] - b[1]);
    const out = listStr(res.map((p) => listStr(p)));
    t.frame({ line: 'ans', caption: `Bache ${k} = sabse paas: ${out} (paas se door order mein). O(n log k), memory O(k).`, legend, panels: view(Object.fromEntries(pq.a.map((_, i) => [i, 'found']))) });
    return out;
  },
});

// ---------- Example 3: Merge k sorted lists ----------
type Head = { v: number; id: string; r: number; c: number };
export const mergeKTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Lists: digits, comma se alag (jaise 145,134,26)', default: '145,134,26', minLen: 1, maxLen: 14, charset: '0123456789,' }],
  check: ({ s }) => (s.split(',').length <= 4 ? null : 'Max 4 lists (3 comma) rakho.'),
  run({ s }, t) {
    const lists = s.split(',').map((seg) => [...seg].map(Number).sort((a, b) => a - b));
    const cols = Math.max(1, ...lists.map((l) => l.length));
    const grid: Cell[][] = lists.map((l) => Array.from({ length: cols }, (_, c) => (c < l.length ? l[c] : null)));
    const used = new Set<string>();
    const out: number[] = [];
    const pq = heapSim<Head>((x, y) => x.v < y.v);
    const legend = { found: 'sabse chhota head', new: 'naya head', muted: 'result mein gaya', active: 'heap mein (head)' };
    const view = (tones: Tones = {}): Panel[] => {
      const gt: Record<string, Tone> = {};
      lists.forEach((l, r) => l.forEach((_, c) => used.has(`${r},${c}`) && (gt[`${r},${c}`] = 'muted')));
      pq.a.forEach((h) => (gt[`${h.r},${h.c}`] = 'active'));
      return [
        { kind: 'grid', label: 'Sorted lists', values: grid, tones: gt, rowLabels: lists.map((_, r) => `L${r}`) },
        tree(pq.a, tones, `Min-heap (har list ka head, size ≤ ${lists.length})`),
        array(out, { label: 'Result', tones: out.length ? { [out.length - 1]: 'new' } : {} }),
      ];
    };
    lists.forEach((l, r) => l.length && pq.add({ v: l[0], id: `${r}-0`, r, c: 0 }));
    t.frame({ line: 'init', caption: `${lists.length} sorted lists. Agla sabse chhota hamesha kisi list ke HEAD par hai → sirf heads heap mein (size ≤ k). Khaali list skip.`, legend, panels: view(pq.a.length ? { 0: 'found' } : {}) });
    while (pq.a.length) {
      const h = pq.a[0];
      t.frame({ line: 'take', caption: `poll() → ${h.v} (L${h.r} ka head) — sab heads mein sabse chhota, to poore bache data mein sabse chhota.`, vars: { result: listStr(out) }, legend, panels: view({ 0: 'found' }) });
      pq.poll();
      used.add(`${h.r},${h.c}`);
      out.push(h.v);
      const l = lists[h.r];
      if (h.c + 1 < l.length) {
        const id = `${h.r}-${h.c + 1}`;
        pq.add({ v: l[h.c + 1], id, r: h.r, c: h.c + 1 });
        t.frame({ line: 'next', caption: `Result mein ${h.v} joda. L${h.r} ka agla (${l[h.c + 1]}) ab uska head → heap mein add.`, vars: { result: listStr(out) }, legend, panels: view({ [at(pq.a, id)]: 'new' }) });
      } else {
        t.frame({ line: 'next', caption: `Result mein ${h.v} joda. L${h.r} khatam — heap ek chhota.`, vars: { result: listStr(out) }, legend, panels: view() });
      }
    }
    const res = out.length ? out.join(' -> ') : '(khaali)';
    t.frame({ line: 'done', caption: `Merged: ${res}. Har node ek baar heap mein aaya aur gaya → O(N log k), N = total nodes, k = lists.`, vars: { result: listStr(out) }, legend, panels: view() });
    return res;
  },
});
