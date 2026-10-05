import { listStr, listView, tracer, type LNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

/** doubly nodes n0..; optional sentinels H / T */
function makeDList(values: (number | string)[], sentinels: boolean) {
  const ids = values.map((_, i) => `n${i}`);
  const all = sentinels ? ['H', ...ids, 'T'] : ids;
  const nodes = new Map<string, LNode>();
  all.forEach((id, i) => {
    const value = id === 'H' ? 'H' : id === 'T' ? 'T' : values[Number(id.slice(1))];
    nodes.set(id, { id, value, prev: i > 0 ? all[i - 1] : null, next: i + 1 < all.length ? all[i + 1] : null });
  });
  return { nodes, head: all.length ? all[0] : null, ids };
}
const forwardVals = (nodes: Map<string, LNode>, head: string | null, skip = new Set(['H', 'T'])) => {
  const out: (number | string)[] = [];
  const seen = new Set<string>();
  for (let c = head; c && !seen.has(c); c = nodes.get(c)!.next) {
    seen.add(c);
    if (!skip.has(c)) out.push(nodes.get(c)!.value as number);
  }
  return out;
};

// ---------- 3. Visual intro: dono taraf chalna + circle ----------
export const twoWay = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'Values', default: [10, 20, 30, 40], minLen: 1, maxLen: 6, min: -99, max: 99 }],
  run({ values }, t) {
    const { nodes, head, ids } = makeDList(values, false);
    const tail = ids[ids.length - 1];
    t.frame({ caption: 'Doubly linked list: har node ke paas DO arrows — next (aage) aur prev (peeche, dashed). head aur tail dono yaad.', panels: [listView(nodes, head, { doubly: true, pointers: { head, tail } })] });
    for (const id of ids) t.frame({ caption: `Aage chalna: cur = cur.next → ${nodes.get(id)!.value}.`, panels: [listView(nodes, head, { doubly: true, pointers: { cur: id }, tones: { [id]: 'compare' } })] });
    for (const id of [...ids].reverse()) t.frame({ caption: `Peeche chalna: tail se shuru, cur = cur.prev → ${nodes.get(id)!.value}. Singly mein ye possible hi nahi tha.`, panels: [listView(nodes, head, { doubly: true, pointers: { cur: id }, tones: { [id]: 'active' } })] });
    const ring = new Map<string, LNode>();
    ids.forEach((id, i) => ring.set(id, { id, value: nodes.get(id)!.value, next: ids[(i + 1) % ids.length] }));
    t.frame({ caption: `Circular list: aakhri node ka next wapas PEHLE ko (upar wala mudta arrow). Koi null nahi — chalte raho to ghoomte raho. Round-robin, playlist repeat, Josephus game.`, panels: [listView(ring, head, { pointers: { head }, tones: { [tail]: 'new' } })] });
    return listStr(values);
  },
});

// ---------- 4. How: O(1) delete with sentinels ----------
export const dllRemoveTrace = tracer<{ values: number[]; k: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'List', default: [10, 20, 30, 40], minLen: 1, maxLen: 6, min: -99, max: 99 },
    { name: 'k', type: 'int', label: 'Kaunsa node hatana (index)', default: 2, min: 0, max: 5 },
  ],
  check: ({ values, k }) => (k < values.length ? null : `Index 0..${values.length - 1} ke beech rakho.`),
  run({ values, k }, t) {
    const { nodes, ids } = makeDList(values, true);
    const node = ids[k];
    const legend = { muted: 'sentinel (nakli)', error: 'hatana hai', compare: 'p / n' };
    const sent: Record<string, Tone> = { H: 'muted', T: 'muted' };
    t.frame({ line: 'grab', caption: `H aur T nakli (sentinel) nodes hain — asli data nahi. Inki wajah se pehla/aakhri node hatana bhi beech wale jaisa: kabhi null check nahi.`, legend, panels: [listView(nodes, 'H', { doubly: true, tones: sent })] });
    const p = nodes.get(node)!.prev!;
    const n = nodes.get(node)!.next!;
    t.frame({ line: 'grab', caption: `${values[k]} wala node haath mein hai. Uske paas hi p = node.prev aur n = node.next — dhoondhna nahi pada (singly mein pichhla dhoondhne mein O(n)).`, legend, panels: [listView(nodes, 'H', { doubly: true, tones: { ...sent, [node]: 'error', [p]: 'compare', [n]: 'compare' }, pointers: { p, node, n } })] });
    nodes.get(p)!.next = n;
    t.frame({ line: 'link1', caption: `p.next = n → aage chalne wala ab ${values[k]} ko skip karega.`, legend, panels: [listView(nodes, 'H', { doubly: true, tones: { ...sent, [node]: 'error', [p]: 'compare', [n]: 'compare' }, pointers: { p, n }, extra: [node] })] });
    nodes.get(n)!.prev = p;
    t.frame({ line: 'link2', caption: `n.prev = p → peeche chalne wala bhi skip karega. Ab ${values[k]} tak koi raasta nahi.`, legend, panels: [listView(nodes, 'H', { doubly: true, tones: { ...sent, [node]: 'error' }, pointers: { p, n }, extra: [node] })] });
    nodes.get(node)!.next = null;
    nodes.get(node)!.prev = null;
    const out = forwardVals(nodes, 'H');
    t.frame({ line: 'clean', caption: `Purane node ke arrows bhi null — taaki galti se usse list mein wapas na ghus jaayein. Result ${listStr(out)}. Sirf 4 assignments → O(1).`, legend, panels: [listView(nodes, 'H', { doubly: true, tones: sent })] });
    return listStr(out);
  },
});

// ---------- Example 1: reverse doubly list ----------
export const revDllTrace = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'List', default: [1, 2, 3, 4], minLen: 1, maxLen: 6, min: -99, max: 99 }],
  run({ values }, t) {
    const { nodes, ids } = makeDList(values, false);
    const view = (ptr: Record<string, string | null>, tones: Record<string, Tone> = {}): Panel => listView(nodes, null, { doubly: true, extra: ids, pointers: ptr, tones });
    let cur: string | null = ids[0];
    let newHead: string | null = null;
    t.frame({ line: 'save', caption: 'Har node ke liye bas next aur prev ki adla-badli. Nodes apni jagah rahenge — sirf arrows ulte honge.', panels: [view({ cur })] });
    while (cur) {
      const nd: LNode = nodes.get(cur)!;
      const nxt: string | null = nd.next;
      t.frame({ line: 'save', caption: `nxt = cur.next (${nxt ? nodes.get(nxt)!.value : 'null'}) bachao — swap ke baad cur.next badal jaayega.`, panels: [view({ cur, nxt }, { [cur]: 'compare' })] });
      nd.next = nd.prev ?? null;
      nd.prev = nxt;
      t.frame({ line: 'swap', caption: `${nd.value} ke dono arrows ulte: next ab ${nd.next ? nodes.get(nd.next)!.value : 'null'}, prev ab ${nd.prev ? nodes.get(nd.prev)!.value : 'null'}.`, panels: [view({ cur, nxt }, { [cur]: 'swap' })] });
      newHead = cur;
      cur = nxt;
      t.frame({ line: 'head', caption: `newHead = ${nodes.get(newHead)!.value} (abhi tak ka aakhri). cur aage.`, panels: [view({ newHead, cur }, { [newHead]: 'found' })] });
    }
    const out = forwardVals(nodes, newHead, new Set());
    t.frame({ line: 'head', caption: `Ulti list: ${listStr(out)}. O(n), O(1). (Singly reverse mein prev alag variable rakhna padta — Reverse Linked List topic.)`, panels: [listView(nodes, newHead, { doubly: true, pointers: { head: newHead } })] });
    return listStr(out);
  },
});

// ---------- Example 2: browser history ----------
export const browserTrace = tracer<Record<string, never>>({
  inputs: [],
  run(_, t) {
    const short: Record<string, string> = { 'leetcode.com': 'leet', 'google.com': 'goog', 'facebook.com': 'fb', 'youtube.com': 'yt', 'linkedin.com': 'lnkd' };
    const nodes = new Map<string, LNode>();
    let seq = 0;
    const urlOf = new Map<string, string>();
    const mk = (url: string) => {
      const id = `p${seq++}`;
      nodes.set(id, { id, value: short[url], next: null, prev: null });
      urlOf.set(id, url);
      return id;
    };
    const first = mk('leetcode.com');
    let cur = first;
    let cutOff: string[] = [];
    const view = (tones: Record<string, Tone> = {}): Panel[] => [listView(nodes, first, { doubly: true, pointers: { cur }, tones: { [cur]: 'active', ...Object.fromEntries(cutOff.map((c) => [c, 'muted' as Tone])), ...tones }, extra: cutOff }), { kind: 'text', label: 'Screen par', text: urlOf.get(cur)! }];
    const outputs: string[] = [];
    const visit = (url: string) => {
      const old = nodes.get(cur)!.next;
      cutOff = [];
      for (let c = old; c; c = nodes.get(c)!.next) cutOff.push(c);
      const p = mk(url);
      nodes.get(cur)!.next = p;
      nodes.get(p)!.prev = cur;
      cur = p;
      t.frame({ line: 'visit', caption: cutOff.length ? `visit(${url}): naya page cur ke aage. Purani forward history (${cutOff.map((c) => urlOf.get(c)).join(', ')}) kat gayi — ab wahan pahunch nahi sakte.` : `visit(${url}): naya node cur ke aage jodo, cur wahan.`, panels: view({ [p]: 'new' }) });
    };
    const move = (dir: 'back' | 'forward', steps: number) => {
      let s = steps;
      let moved = 0;
      while (s > 0) {
        const nx = dir === 'back' ? nodes.get(cur)!.prev : nodes.get(cur)!.next;
        if (!nx) break;
        cur = nx;
        s--;
        moved++;
      }
      outputs.push(urlOf.get(cur)!);
      t.frame({ line: dir, caption: `${dir}(${steps}): ${moved} kadam ${dir === 'back' ? 'prev' : 'next'} ki taraf${moved < steps ? ` (aage raasta khatam, ${steps - moved} kadam bekaar)` : ''} → ${urlOf.get(cur)}.`, panels: view() });
    };
    t.frame({ line: 'visit', caption: 'Har page ek node. back = prev, forward = next. Doubly list isliye ki dono taraf jaana hai.', panels: view() });
    visit('google.com');
    visit('facebook.com');
    visit('youtube.com');
    move('back', 1);
    move('back', 1);
    move('forward', 1);
    visit('linkedin.com');
    move('forward', 2);
    move('back', 2);
    move('back', 7);
    return outputs[0];
  },
});

// ---------- Example 3: LRU cache ----------
export const lruTrace = tracer<{ capacity: number }>({
  inputs: [{ name: 'capacity', type: 'int', label: 'Capacity', default: 2, min: 1, max: 3 }],
  run({ capacity }, t) {
    const nodes = new Map<string, LNode>([
      ['H', { id: 'H', value: 'H', prev: null, next: 'T' }],
      ['T', { id: 'T', value: 'T', prev: 'H', next: null }],
    ]);
    const map = new Map<number, string>();
    const vals = new Map<string, number>();
    const label = (id: string) => `${id.slice(1)}:${vals.get(id)}`;
    const unlink = (id: string) => {
      const n = nodes.get(id)!;
      nodes.get(n.prev!)!.next = n.next;
      nodes.get(n.next!)!.prev = n.prev;
    };
    const addFront = (id: string) => {
      const n = nodes.get(id)!;
      n.next = nodes.get('H')!.next;
      n.prev = 'H';
      nodes.get(n.next!)!.prev = id;
      nodes.get('H')!.next = id;
    };
    const view = (tones: Record<string, Tone> = {}, extra: string[] = []): Panel[] => {
      for (const [id] of nodes) if (id !== 'H' && id !== 'T') nodes.get(id)!.value = label(id);
      return [
        listView(nodes, 'H', { doubly: true, label: 'H ke paas = naya, T ke paas = purana', tones: { H: 'muted', T: 'muted', ...tones }, extra }),
        { kind: 'map', label: 'map (key → node)', keyLabel: 'key', valueLabel: 'value', entries: [...map.entries()].map(([k, id]) => ({ key: k, value: vals.get(id)!, tone: tones[id] })) },
      ];
    };
    const outputs: number[] = [];
    const legend = { muted: 'sentinel', new: 'naya', found: 'mila', error: 'nikla', compare: 'update' };
    const get = (key: number) => {
      const id = map.get(key);
      if (id === undefined) {
        outputs.push(-1);
        t.frame({ line: 'miss', caption: `get(${key}): map mein nahi → −1.`, legend, panels: view() });
        return;
      }
      unlink(id);
      addFront(id);
      outputs.push(vals.get(id)!);
      t.frame({ line: 'touch', caption: `get(${key}) = ${vals.get(id)}. Abhi use hua → list ke aage (H ke baad). map se node O(1), doubly se nikaalna O(1).`, legend, panels: view({ [id]: 'found' }) });
    };
    const put = (key: number, value: number) => {
      const old = map.get(key);
      if (old !== undefined) {
        vals.set(old, value);
        unlink(old);
        addFront(old);
        t.frame({ line: 'update', caption: `put(${key}, ${value}): pehle se hai → value badli, aage le aaye.`, legend, panels: view({ [old]: 'compare' }) });
        return;
      }
      if (map.size === capacity) {
        const lru = nodes.get('T')!.prev!;
        unlink(lru);
        map.delete(Number(lru.slice(1)));
        t.frame({ line: 'evict', caption: `put(${key}): cache bhara (${capacity}). Sabse purana = T ke theek pehle wala (key ${lru.slice(1)}) → nikaalo, map se bhi.`, legend, panels: view({ [lru]: 'error' }, [lru]) });
        nodes.delete(lru);
      }
      const id = `k${key}`;
      nodes.set(id, { id, value: '', next: null, prev: null });
      vals.set(id, value);
      addFront(id);
      map.set(key, id);
      t.frame({ line: 'insert', caption: `put(${key}, ${value}): naya node aage, map mein entry.`, legend, panels: view({ [id]: 'new' }) });
    };
    t.frame({ line: 'insert', caption: `LRU = Least Recently Used. Capacity ${capacity}. HashMap (key → node) + doubly list (use ka order). Dono milke get/put O(1).`, legend, panels: view() });
    put(1, 1);
    put(2, 2);
    get(1);
    put(3, 3);
    get(2);
    put(4, 4);
    get(1);
    get(3);
    get(4);
    t.frame({ line: 'touch', caption: `get ke jawab: ${outputs.join(', ')}.`, legend, panels: view() });
    return String(outputs[0]);
  },
});
