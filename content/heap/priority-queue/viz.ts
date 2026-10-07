import { array, heapSim, heapView, ids, listStr, swap, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
type Item = { v: number; id: string };
const views = (items: { v: Cell; id: string }[], tones: Tones = {}, label = 'PQ ka andar ka array'): Panel[] => [
  heapView(items.map((x) => x.v), { ids: items.map((x) => x.id), tones }),
  array(items.map((x) => x.v), { ids: items.map((x) => x.id), tones, label }),
];
const at = (items: { id: string }[], id: string) => items.findIndex((x) => x.id === id);
/** root ke baad agla kaun nikalega: dono bachchon mein jo aage (tie par left — Java bhi yahi karta hai) */
const second = (a: Item[], before: (x: number, y: number) => boolean) => (a.length === 2 || !before(a[2].v, a[1].v) ? 1 : 2);

// ---------- 3. Visual intro: println(pq) sorted NAHI ----------
export const pqPrint = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'add() ka order', default: [5, 1, 8, 3, 2], minLen: 1, maxLen: 8, min: 0, max: 99 }],
  run({ arr }, t) {
    const pq = heapSim<Item>((x, y) => x.v < y.v);
    const legend = { new: 'abhi add hua', found: 'peek()', done: 'poll ho gaya' };
    arr.forEach((v, i) => {
      pq.add({ v, id: `e${i}` });
      const k = at(pq.a, `e${i}`);
      t.frame({ caption: `add(${v}) → end par daala, sift up ke baad index ${k} par. peek() = ${pq.a[0].v} — hamesha sabse chhota, O(1).`, legend, panels: views(pq.a, k ? { 0: 'found', [k]: 'new' } : { 0: 'new' }) });
    });
    const inside = pq.a.map((x) => x.v);
    const sorted = [...inside].sort((x, y) => x - y);
    const same = listStr(inside) === listStr(sorted);
    t.frame({
      caption: same
        ? `println(pq) → ${listStr(inside)}. Is baar sorted dikh raha hai — coincidence hai! Ye andar ka heap array hai (level order), guarantee nahi.`
        : `println(pq) → ${listStr(inside)}. Ye SORTED nahi! Ye andar ka heap array hai (level order). toString, for-loop, toList — sab yahi order dete hain.`,
      legend,
      panels: views(pq.a, { 0: 'found' }),
    });
    const out: number[] = [];
    while (pq.a.length) {
      const x = pq.poll()!;
      out.push(x.v);
      t.frame({ caption: `poll() → ${x.v} (nikala + sift down, O(log n)). Sorted chahiye to baar baar poll karo.`, vars: { nikle: listStr(out) }, legend, panels: [...views(pq.a, pq.a.length ? { 0: 'found' } : {}), array(out, { label: 'poll() ka order', tones: { [out.length - 1]: 'done' } })] });
    }
    t.frame({ caption: `poll order ${listStr(out)} = sorted. Andar ka array ${listStr(inside)} tha. Bharosa sirf peek() / poll() par.`, legend, panels: [array(out, { label: 'poll() ka order' })] });
    return listStr(out);
  },
});

// ---------- 4. How: Comparator se order (emergency ward) ----------
type P = { v: string; s: number; i: number; id: string };
export const triageTrace = tracer<{ sev: number[] }>({
  inputs: [{ name: 'sev', type: 'intArray', label: 'Severity (A, B, C… is order mein aaye)', default: [2, 5, 1, 5, 3], minLen: 1, maxLen: 7, min: 1, max: 9 }],
  run({ sev }, t) {
    const name = (i: number) => String.fromCharCode(65 + i);
    const before = (x: P, y: P) => (x.s !== y.s ? x.s > y.s : x.i < y.i);
    const why = (x: P, y: P) => (x.s !== y.s ? `${x.s} > ${y.s}` : `severity barabar, ${name(x.i)} pehle aaya`);
    const a: P[] = [];
    const order: string[] = [];
    const legend = { new: 'naya', swap: 'swap', compare: 'parent', done: 'jagah theek', found: 'agla ilaaj' };
    const vars = () => ({ order: listStr(order) });
    t.frame({ line: 'cmp', caption: 'Node "5B" = severity 5, patient B. Comparator: zyada severity upar; barabar ho to jo pehle aaya wo upar. Heap ka poora order sirf isi ek function se decide hota hai.', vars: vars(), legend, panels: views(a, {}, 'PQ andar') });
    sev.forEach((s, i) => {
      a.push({ v: `${s}${name(i)}`, s, i, id: `p${i}` });
      let k = a.length - 1;
      t.frame({ line: 'add', caption: k ? `${name(i)} aaya (severity ${s}) → add(): pehle end par (index ${k}), phir comparator se upar chadhega.` : `${name(i)} aaya (severity ${s}) → pehla item, seedha root.`, vars: vars(), legend, panels: views(a, { [k]: 'new' }, 'PQ andar') });
      while (k > 0) {
        const p = (k - 1) >> 1;
        if (!before(a[k], a[p])) {
          t.frame({ line: 'cmp', caption: `compare(${a[k].v}, parent ${a[p].v}): parent aage (${why(a[p], a[k])}) → ruko.`, vars: vars(), legend, panels: views(a, { [k]: 'done', [p]: 'compare' }, 'PQ andar') });
          break;
        }
        t.frame({ line: 'cmp', caption: `compare(${a[k].v}, parent ${a[p].v}): ${why(a[k], a[p])} → ${a[k].v} upar.`, vars: vars(), legend, panels: views(a, { [k]: 'swap', [p]: 'swap' }, 'PQ andar') });
        swap(a, k, p);
        k = p;
      }
    });
    while (a.length) {
      const top = a[0];
      t.frame({ line: 'poll', caption: a.length === 1 ? `poll() → ${top.v}: ${name(top.i)} ka ilaaj. Akela tha — ab khaali.` : `poll() → ${top.v}: ${name(top.i)} ka ilaaj. Aakhri (${a[a.length - 1].v}) root par aayega, phir sift down.`, vars: vars(), legend, panels: views(a, { 0: 'found' }, 'PQ andar') });
      order.push(name(top.i));
      const last = a.pop()!;
      if (!a.length) break;
      a[0] = last;
      for (let k = 0; ; ) {
        const l = 2 * k + 1;
        let m = k;
        if (l < a.length && before(a[l], a[m])) m = l;
        if (l + 1 < a.length && before(a[l + 1], a[m])) m = l + 1;
        if (m === k) break;
        t.frame({ line: 'cmp', caption: `${a[k].v} ke bachchon mein ${a[m].v} sabse aage (${why(a[m], a[k])}) → swap.`, vars: vars(), legend, panels: views(a, { [k]: 'swap', [m]: 'swap' }, 'PQ andar') });
        swap(a, k, m);
        k = m;
      }
    }
    t.frame({ line: 'poll', caption: `Ilaaj ka order ${listStr(order)}. Har add / poll O(log n) — comparator har level par sirf ek-2 baar chala.`, vars: vars(), legend, panels: views(a, {}, 'PQ andar') });
    return listStr(order);
  },
});

// ---------- Example 1: Last Stone Weight ----------
export const lastStoneTrace = tracer<{ stones: number[] }>({
  inputs: [{ name: 'stones', type: 'intArray', label: 'Stones ka weight', default: [2, 7, 4, 1, 8, 1], minLen: 1, maxLen: 8, min: 1, max: 30 }],
  run({ stones }, t) {
    const pq = heapSim<Item>((x, y) => x.v > y.v);
    stones.forEach((v, i) => pq.add({ v, id: `s${i}` }));
    let next = stones.length;
    const legend = { found: 'sabse bhaari (y)', compare: 'doosra bhaari (x)', new: 'bacha piece' };
    const label = 'PQ (max-heap)';
    t.frame({ line: 'build', caption: `Saare stone max-heap (reverseOrder) mein. Root = sabse bhaari = ${pq.a[0].v}. Har round mein 2 sabse bhaari chahiye — heap dono O(log n) mein deta hai.`, legend, panels: views(pq.a, { 0: 'found' }, label) });
    while (pq.a.length > 1) {
      const sec = second(pq.a, (x, y) => x > y);
      const y = pq.a[0].v;
      const x = pq.a[sec].v;
      t.frame({ line: 'take', caption: `poll() 2 baar → y = ${y}, x = ${x}. Doosra sabse bhaari hamesha root ka koi bachcha hota hai.`, vars: { y, x }, legend, panels: views(pq.a, { 0: 'found', [sec]: 'compare' }, label) });
      pq.poll();
      pq.poll();
      if (y !== x) {
        const id = `s${next++}`;
        pq.add({ v: y - x, id });
        t.frame({ line: 'push', caption: `${y} ≠ ${x} → ${x} toot gaya, ${y} ka ${y - x} bacha. Wapas heap mein (add, O(log n)).`, vars: { y, x }, legend, panels: views(pq.a, { [at(pq.a, id)]: 'new' }, label) });
      } else {
        t.frame({ line: 'push', caption: `${y} = ${x} → dono toot gaye, wapas kuch nahi.`, vars: { y, x }, legend, panels: views(pq.a, {}, label) });
      }
    }
    const ans = pq.a.length ? pq.a[0].v : 0;
    t.frame({ line: 'end', caption: pq.a.length ? `Ek stone bacha → jawab ${ans}. Har round O(log n), n rounds tak → O(n log n).` : 'Koi stone nahi bacha → jawab 0.', legend, panels: views(pq.a, pq.a.length ? { 0: 'found' } : {}, label) });
    return String(ans);
  },
});

// ---------- Example 2: Heap sort (in-place) ----------
export const heapSortTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [5, 2, 9, 1, 6, 3], minLen: 1, maxLen: 8, min: 0, max: 99 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const n = a.length;
    let size = n;
    let quiet = false;
    const legend = { found: 'sabse bada (root)', swap: 'swap', active: 'sift down', compare: 'bada bachcha', done: 'pakki jagah' };
    const view = (tones: Tones = {}): Panel[] => {
      const all: Tones = { ...tones };
      for (let i = size; i < n; i++) all[i] = 'done';
      return [
        heapView(a.slice(0, size), { ids: id.slice(0, size), tones, label: 'heap' }),
        array(a, { ids: id, tones: all, label: 'Array (wahi jagah)', ranges: size ? [{ from: 0, to: size - 1, label: 'heap' }] : [] }),
      ];
    };
    const sift = (i: number) => {
      for (;;) {
        const l = 2 * i + 1;
        let m = i;
        if (l < size && a[l] > a[m]) m = l;
        if (l + 1 < size && a[l + 1] > a[m]) m = l + 1;
        if (m === i) return;
        if (!quiet) t.frame({ line: 'down', caption: `${a[i]} ke bachchon mein bada ${a[m]} > ${a[i]} → swap, ${a[i]} neeche.`, legend, panels: view({ [i]: 'active', [m]: 'compare' }) });
        swap(a, i, m);
        swap(id, i, m);
        i = m;
      }
    };
    t.frame({ line: 'build', caption: 'Step 1: isi array ko MAX-heap banao (neeche se upar sift down, O(n)). Koi naya array nahi.', legend, panels: view() });
    quiet = true;
    for (let i = (n >> 1) - 1; i >= 0; i--) sift(i);
    quiet = false;
    t.frame({ line: 'build', caption: `Max-heap ${listStr(a)}: root ${a[0]} = sabse bada. Step 2: root ko heap ke end par bhejo, heap ek chhota karo, repeat.`, legend, panels: view({ 0: 'found' }) });
    for (let end = n - 1; end >= 1; end--) {
      t.frame({ line: 'swap', caption: `Sabse bada ${a[0]} ki pakki jagah = heap ka aakhri index ${end}. Swap ${a[0]} ↔ ${a[end]}.`, legend, panels: view({ 0: 'swap', [end]: 'swap' }) });
      swap(a, 0, end);
      swap(id, 0, end);
      size = end;
      t.frame({ line: 'fix', caption: size > 1 ? `${a[end]} apni jagah par — heap se bahar (heap size ${size}). Naya root ${a[0]} chhota ho sakta hai → sift down.` : `${a[end]} apni jagah par. Heap mein sirf ${a[0]} bacha — wo bhi apni jagah par.`, legend, panels: view({ 0: 'active' }) });
      sift(0);
    }
    size = 0;
    t.frame({ line: 'fix', caption: `Sorted ${listStr(a)}. (n - 1) baar sift down, har ek O(log n) → O(n log n). Extra jagah O(1) — merge sort se kam. Par stable nahi.`, legend, panels: view() });
    return listStr(a);
  },
});

// ---------- Example 3: Minimum cost of ropes ----------
export const ropesTrace = tracer<{ ropes: number[] }>({
  inputs: [{ name: 'ropes', type: 'intArray', label: 'Ropes ki length', default: [4, 3, 2, 6], minLen: 1, maxLen: 8, min: 1, max: 50 }],
  run({ ropes }, t) {
    const pq = heapSim<Item>((x, y) => x.v < y.v);
    ropes.forEach((v, i) => pq.add({ v, id: `r${i}` }));
    let next = ropes.length;
    let cost = 0;
    const legend = { found: 'sabse chhoti', compare: 'doosri chhoti', new: 'nayi rope' };
    const label = 'PQ (min-heap)';
    t.frame({ line: 'build', caption: 'Saari ropes min-heap mein. Jod ka cost = dono ki length. Jo rope jaldi judti hai, uski length aage ke har jod mein phir count hai → chhoti ropes pehle jodo.', vars: { cost }, legend, panels: views(pq.a, { 0: 'found' }, label) });
    while (pq.a.length > 1) {
      const sec = second(pq.a, (x, y) => x < y);
      const x = pq.a[0].v;
      const y = pq.a[sec].v;
      t.frame({ line: 'join', caption: `2 sabse chhoti: ${x} + ${y} = ${x + y}. Cost ${cost} + ${x + y} = ${cost + x + y}.`, vars: { cost }, legend, panels: views(pq.a, { 0: 'found', [sec]: 'compare' }, label) });
      pq.poll();
      pq.poll();
      cost += x + y;
      const id = `r${next++}`;
      pq.add({ v: x + y, id });
      t.frame({ line: 'push', caption: `Nayi rope ${x + y} wapas heap mein — ye bhi aage judegi, isliye bade jod jitna ho sake baad mein.`, vars: { cost }, legend, panels: views(pq.a, { [at(pq.a, id)]: 'new' }, label) });
    }
    t.frame({ line: 'end', caption: ropes.length === 1 ? 'Ek hi rope — jodna nahi, cost 0.' : `Ek rope bachi (${pq.a[0].v}). Total cost ${cost} — sabse kam. Har round O(log n) → total O(n log n).`, vars: { cost }, legend, panels: views(pq.a, {}, label) });
    return String(cost);
  },
});
