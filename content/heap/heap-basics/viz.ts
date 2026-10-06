import { array, heapView, ids, listStr, swap, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
type Ptrs = Record<string, number | undefined>;
const parent = (i: number) => Math.floor((i - 1) / 2);
/** tree + array saath: dono ek hi data, ids same → swap dono mein dikhta hai */
const views = (a: number[], id: string[], tones: Tones = {}, pointers: Ptrs = {}): Panel[] => [
  heapView(a, { ids: id, tones, pointers }),
  array(a, { ids: id, tones, pointers, label: 'Asli memory: array' }),
];
/** min-heap ka sabse chhota bachcha (ya i khud, agar bachche bade / nahi hain) */
const smaller = (a: number[], i: number) => {
  const l = 2 * i + 1;
  const r = l + 1;
  let m = i;
  if (l < a.length && a[l] < a[m]) m = l;
  if (r < a.length && a[r] < a[m]) m = r;
  return m;
};
const kidsStr = (a: number[], i: number) => [2 * i + 1, 2 * i + 2].filter((k) => k < a.length).map((k) => a[k]).join(', ');

// ---------- 3. Visual intro: array ↔ tree ----------
export const heapMap = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Heap array', default: [2, 5, 3, 9, 6, 4, 8], minLen: 1, maxLen: 10, min: 0, max: 99 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const n = a.length;
    const legend = { active: 'index i', compare: 'parent', new: 'bachche' };
    t.frame({ caption: 'Heap memory mein sirf ek ARRAY hai — koi left/right pointer nahi. Tree bas dekhne ka tareeka: index 0 root, phir level by level, left se right. Node ke upar chhota number = index.', legend, panels: views(a, id) });
    for (let i = 0; i < n; i++) {
      const l = 2 * i + 1;
      const r = l + 1;
      const p = parent(i);
      const tones: Tones = { [i]: 'active' };
      if (i > 0) tones[p] = 'compare';
      if (l < n) tones[l] = 'new';
      if (r < n) tones[r] = 'new';
      const up = i === 0 ? 'Index 0 = root, parent nahi.' : `Parent = (${i} - 1) / 2 = ${p} → ${a[p]}.`;
      const down = l >= n ? `2·${i} + 1 = ${l} ≥ ${n} → koi bachcha nahi, ye LEAF hai.` : r < n ? `Bachche = 2·${i} + 1 = ${l} aur 2·${i} + 2 = ${r} → ${a[l]}, ${a[r]}.` : `Left bachcha = ${l} → ${a[l]}. Right (${r}) array ke bahar.`;
      t.frame({ caption: `a[${i}] = ${a[i]}. ${up} ${down}`, vars: { i, parent: i ? p : null, left: l < n ? l : null, right: r < n ? r : null }, legend, panels: views(a, id, tones, { i }) });
    }
    const bad = a.findIndex((v, i) => i > 0 && a[parent(i)] > v);
    t.frame({
      caption:
        bad < 0
          ? `Har parent ≤ uske bachche → MIN-HEAP. Isliye sabse chhota (${a[0]}) hamesha index 0 par. Shape "complete" hai (beech mein gap nahi) → array mein koi jagah waste nahi, formula hamesha sahi.`
          : `Shape theek hai, par a[${parent(bad)}] = ${a[parent(bad)]} > bachcha ${a[bad]} → ye min-heap NAHI. Order kaise banaye rakhte hain — "Kaise kaam karta hai" mein dekho.`,
      legend: { error: 'order toota' },
      panels: views(a, id, bad < 0 ? { 0: 'found' } : { [bad]: 'error', [parent(bad)]: 'error' }),
    });
    return String(bad < 0);
  },
});

// ---------- 4. How: push (sift up) + pop (sift down) ----------
export const heapOps = tracer<{ ops: string }>({
  inputs: [{ name: 'ops', type: 'string', label: 'Ops: digit = push, o = pop', default: '5382o1o', minLen: 1, maxLen: 12, charset: '0123456789o' }],
  check: ({ ops }) => (/^[0-9o]+$/.test(ops) ? null : 'Sirf digits (push) aur o (pop) likho.'),
  run({ ops }, t) {
    const a: number[] = [];
    const id: string[] = [];
    const popped: number[] = [];
    let next = 0;
    const legend = { new: 'naya', compare: 'compare', swap: 'swap', found: 'sabse chhota', done: 'jagah mil gayi', active: 'khiska raha' };
    const vars = () => ({ size: a.length, popped: listStr(popped) });
    t.frame({ caption: 'Khaali min-heap. Rule: har parent ≤ uske bachche. Push = neeche daalo, upar chadhao. Pop = root nikaalo, aakhri ko upar rakh ke neeche dhakelo.', vars: vars(), legend, panels: views(a, id) });
    for (const c of ops) {
      if (c !== 'o') {
        const x = Number(c);
        a.push(x);
        id.push(`n${next++}`);
        let i = a.length - 1;
        t.frame({ line: 'add', caption: `Push ${x}: pehle aakhri khaali jagah (index ${i}) par — tree complete rehta hai, koi gap nahi.`, vars: vars(), legend, panels: views(a, id, { [i]: 'new' }, { i }) });
        while (i > 0 && a[parent(i)] > a[i]) {
          const p = parent(i);
          t.frame({ line: 'cmpUp', caption: `Parent ${a[p]} > ${a[i]} → order toota. ${a[i]} ko ek level upar chadhao (sift up).`, vars: vars(), legend, panels: views(a, id, { [i]: 'active', [p]: 'compare' }, { i }) });
          swap(a, i, p);
          swap(id, i, p);
          t.frame({ line: 'up', caption: `Swap: ${a[p]} upar (index ${p}), ${a[i]} neeche. Baaki tree ko chhua bhi nahi.`, vars: vars(), legend, panels: views(a, id, { [p]: 'active', [i]: 'swap' }, { i: p }) });
          i = p;
        }
        t.frame({ line: 'cmpUp', caption: a.length === 1 ? `Pehla item — seedha root, compare karne ko koi parent nahi.` : i === 0 ? `${a[0]} root tak pahunch gaya — ab yahi sabse chhota.` : `Parent ${a[parent(i)]} ≤ ${a[i]} → order theek, ruko. Kaam sirf ek raasta (height) jitna.`, vars: vars(), legend, panels: views(a, id, { [i]: 'done' }) });
        continue;
      }
      if (!a.length) {
        t.frame({ caption: 'Heap khaali — pop nahi ho sakta.', vars: vars(), legend, panels: views(a, id) });
        continue;
      }
      const top = a[0];
      const n = a.length;
      t.frame({ line: 'last', caption: n === 1 ? `Pop: ${top} akela hai — bas nikaal do.` : `Pop: sabse chhota ${top} root par. Seedha hataya to tree ke beech chhed. Isliye aakhri item (${a[n - 1]}) nikaalo — shape complete rehti hai.`, vars: vars(), legend, panels: views(a, id, n === 1 ? { 0: 'found' } : { 0: 'found', [n - 1]: 'compare' }) });
      const last = a.pop()!;
      const lastId = id.pop()!;
      popped.push(top);
      if (!a.length) {
        t.frame({ line: 'last', caption: `${top} gaya — heap ab khaali.`, vars: vars(), legend, panels: views(a, id) });
        continue;
      }
      a[0] = last;
      id[0] = lastId;
      t.frame({ line: 'root', caption: `${top} gaya. ${last} ko root par rakha — ab ye bachchon se bada ho sakta hai, ise neeche dhakelna (sift down) hai.`, vars: vars(), legend, panels: views(a, id, { 0: 'active' }, { i: 0 }) });
      let i = 0;
      for (let m = smaller(a, i); m !== i; m = smaller(a, i)) {
        t.frame({ line: 'pick', caption: `${a[i]} ke bachche: ${kidsStr(a, i)}. Chhota ${a[m]} chuno — wahi upar aa sakta hai, kyunki wo doosre bachche se bhi chhota hai.`, vars: vars(), legend, panels: views(a, id, { [i]: 'active', [m]: 'compare' }, { i }) });
        swap(a, i, m);
        swap(id, i, m);
        i = m;
        t.frame({ line: 'down', caption: `Swap: ${a[parent(i)]} upar, ${a[i]} neeche (index ${i}).`, vars: vars(), legend, panels: views(a, id, { [i]: 'active', [parent(i)]: 'swap' }, { i }) });
      }
      t.frame({ line: 'stop', caption: 2 * i + 1 >= a.length ? `${a[i]} leaf tak aa gaya — neeche kuch nahi, ruko.` : `${a[i]} ≤ bachche (${kidsStr(a, i)}) → jagah mil gayi. Naya root ${a[0]} = sabse chhota.`, vars: vars(), legend, panels: views(a, id, { [i]: 'done', 0: 'found' }) });
    }
    t.frame({ caption: `Pop hue: ${listStr(popped)} — hamesha us waqt ka sabse chhota. Har push / pop sirf ek raasta chalta hai (height = log n) → O(log n).`, vars: vars(), legend, panels: views(a, id, a.length ? { 0: 'found' } : {}) });
    return listStr(popped);
  },
});

// ---------- Example 1: kya array min-heap hai? ----------
export const isHeapTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [3, 5, 4, 9, 6, 8, 1], minLen: 1, maxLen: 10, min: 0, max: 99 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const n = a.length;
    const h = Math.floor(n / 2);
    const tones: Tones = {};
    const legend = { active: 'parent', compare: 'bachche', done: 'theek', error: 'toota', muted: 'leaf' };
    for (let i = h; i < n; i++) tones[i] = 'muted';
    t.frame({ line: 'loop', caption: n === 1 ? 'Ek hi item — akela root, apne aap heap.' : `Sirf parents check karne hain: index 0 se ${h - 1} tak. Index ${h} se aage sab leaves — unke bachche hi nahi.`, legend, panels: views(a, id, tones) });
    for (let i = 0; i < h; i++) {
      const l = 2 * i + 1;
      const r = l + 1;
      const bad = a[l] < a[i] ? l : r < n && a[r] < a[i] ? r : -1;
      const look: Tones = { ...tones, [i]: 'active', [l]: 'compare' };
      if (r < n) look[r] = 'compare';
      if (bad >= 0) {
        t.frame({ line: 'check', caption: `a[${i}] = ${a[i]}, bachche ${kidsStr(a, i)}. ${a[bad]} < ${a[i]} → bachcha parent se chhota! Min-heap toota → false. Aage dekhna bekaar.`, vars: { i }, legend, panels: views(a, id, { ...look, [bad]: 'error' }, { i }) });
        return 'false';
      }
      t.frame({ line: 'check', caption: `a[${i}] = ${a[i]} ≤ bachche (${kidsStr(a, i)}) ✓. Agla parent.`, vars: { i }, legend, panels: views(a, id, look, { i }) });
      tones[i] = 'done';
    }
    t.frame({ line: 'ok', caption: 'Har parent ≤ uske bachche → min-heap = true. Dhyan do: heap SORTED nahi hota — bhai-bhai (siblings) mein koi order nahi.', legend, panels: views(a, id, tones) });
    return 'true';
  },
});

// ---------- Example 2: kisi bhi index ka item hatao ----------
export const deleteAtTrace = tracer<{ arr: number[]; k: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Heap (heap na ho to push karke banega)', default: [1, 10, 2, 11, 12, 3, 4], minLen: 1, maxLen: 10, min: 0, max: 99 },
    { name: 'k', type: 'int', label: 'Hatana hai: index k', default: 4, min: 0, max: 9 },
  ],
  check: ({ arr, k }) => (k < arr.length ? null : `k 0 se ${arr.length - 1} ke beech rakho.`),
  run({ arr, k }, t) {
    const a: number[] = [];
    for (const x of arr) {
      a.push(x);
      for (let i = a.length - 1; i > 0 && a[parent(i)] > a[i]; i = parent(i)) swap(a, i, parent(i));
    }
    const id = ids(a.length);
    const legend = { error: 'hatana hai', compare: 'aakhri item', active: 'khiska raha', swap: 'swap', done: 'jagah mil gayi' };
    const built = listStr(a) === listStr(arr) ? '' : `(Input heap nahi tha — push karke banaya: ${listStr(a)}.) `;
    const n = a.length;
    t.frame({ line: 'last', caption: `${built}Index ${k} (${a[k]}) hatana hai. Beech se seedha nikaala to chhed. Trick: aakhri item (${a[n - 1]}) nikaalo aur chhed mein rakho.`, legend, panels: views(a, id, k === n - 1 ? { [k]: 'error' } : { [k]: 'error', [n - 1]: 'compare' }, { k }) });
    const last = a.pop()!;
    const lastId = id.pop()!;
    if (k === a.length) {
      t.frame({ line: 'end', caption: `Aakhri item hi hatana tha — nikaal diya, kuch theek nahi karna. Heap ${listStr(a)}.`, legend, panels: views(a, id) });
      return listStr(a);
    }
    a[k] = last;
    id[k] = lastId;
    t.frame({ line: 'put', caption: `${last} ab index ${k} par. Ye doosri shaakha se aaya hai — parent se chhota ho sakta hai (upar jaana) YA bachchon se bada (neeche jaana). Dono mein se ek hi hoga.`, legend, panels: views(a, id, { [k]: 'active' }, { i: k }) });
    let i = k;
    while (i > 0 && a[parent(i)] > a[i]) {
      const p = parent(i);
      t.frame({ line: 'up', caption: `Parent ${a[p]} > ${a[i]} → upar chadho (sift up).`, vars: { i }, legend, panels: views(a, id, { [i]: 'active', [p]: 'swap' }, { i }) });
      swap(a, i, p);
      swap(id, i, p);
      i = p;
    }
    for (let m = smaller(a, i); m !== i; m = smaller(a, i)) {
      t.frame({ line: 'down', caption: `Bachche (${kidsStr(a, i)}) mein chhota ${a[m]} < ${a[i]} → swap, neeche jao (sift down).`, vars: { i }, legend, panels: views(a, id, { [i]: 'active', [m]: 'swap' }, { i }) });
      swap(a, i, m);
      swap(id, i, m);
      i = m;
    }
    t.frame({ line: 'stop', caption: `${a[i]} ki jagah pakki: parent ≤ ye ≤ bachche. Heap ${listStr(a)}. Kaam O(log n) — ek hi raasta, upar ya neeche.`, vars: { i }, legend, panels: views(a, id, { [i]: 'done' }) });
    return listStr(a);
  },
});

// ---------- Example 3: build heap O(n) ----------
export const buildHeapTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Koi bhi array', default: [9, 4, 7, 1, 8, 2, 3], minLen: 1, maxLen: 10, min: 0, max: 99 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const n = a.length;
    const h = Math.floor(n / 2);
    const legend = { muted: 'leaf (already heap)', done: 'neeche sab theek', active: 'sift down', compare: 'chhota bachcha' };
    const below = (from: number): Tones => Object.fromEntries(Array.from({ length: n - from - 1 }, (_, j) => [from + 1 + j, from + 1 + j >= h ? 'muted' : 'done']));
    let swaps = 0;
    t.frame({ line: 'loop', caption: n === 1 ? 'Ek hi item — already heap.' : `Index ${h} se ${n - 1} tak leaves — akela node apne aap heap hai. Kaam sirf ${h} parents par, NEECHE se UPAR: index ${h - 1} → 0.`, vars: { swaps }, legend, panels: views(a, id, below(h - 1)) });
    for (let s = h - 1; s >= 0; s--) {
      t.frame({ line: 'loop', caption: `i = ${s} (${a[s]}). Iske neeche ke subtree pehle se heap hain (leaves, ya pichhle steps mein theek kiye). Bas ${a[s]} ko sahi jagah tak neeche bhejo.`, vars: { i: s, swaps }, legend, panels: views(a, id, { ...below(s), [s]: 'active' }, { i: s }) });
      let i = s;
      for (let m = smaller(a, i); m !== i; m = smaller(a, i)) {
        t.frame({ line: 'down', caption: `Chhota bachcha ${a[m]} < ${a[i]} → swap, ${a[i]} neeche jaata hai.`, vars: { i, swaps }, legend, panels: views(a, id, { ...below(s), [i]: 'active', [m]: 'compare' }, { i }) });
        swap(a, i, m);
        swap(id, i, m);
        swaps++;
        i = m;
      }
      t.frame({ line: 'stop', caption: 2 * i + 1 >= n ? `${a[i]} leaf tak pahuncha — ruko.` : `${a[i]} ≤ bachche (${kidsStr(a, i)}) → yahin theek. Ab index ${s} se neeche poora heap.`, vars: { i, swaps }, legend, panels: views(a, id, below(s - 1)) });
    }
    t.frame({ line: 'stop', caption: `Heap ${listStr(a)}, kul ${swaps} swaps. Ek-ek push karte to O(n log n). Yahan zyaadatar nodes neeche hain aur unhe kam chalna padta hai (aadhe nodes 0 step, chauthai 1 step…) → total O(n).`, vars: { swaps }, legend, panels: views(a, id, { 0: 'found' }) });
    return listStr(a);
  },
});
