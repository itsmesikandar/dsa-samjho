import { listView, tracer, type LNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

function make(values: number[], prefix = 'n') {
  const ids = values.map((_, i) => `${prefix}${i}`);
  const nodes = new Map<string, LNode>();
  values.forEach((v, i) => nodes.set(ids[i], { id: ids[i], value: v, next: i + 1 < values.length ? ids[i + 1] : null }));
  return { nodes, ids };
}
const showFrom = (nodes: Map<string, LNode>, head: string | null) => {
  const out: string[] = [];
  const seen = new Set<string>();
  for (let c = head; c && !seen.has(c); c = nodes.get(c)!.next) {
    seen.add(c);
    out.push(String(nodes.get(c)!.value));
  }
  return out.length ? out.join(' -> ') : '(khaali)';
};
/** from se 'upto' (include) tak ki chain ki copy — result ka sirf bana hua hissa dikhane ke liye */
function chainView(nodes: Map<string, LNode>, from: string, upto: string, label: string, tones: Record<string, Tone> = {}, pointers: Record<string, string | null> = {}): Panel {
  const copy = new Map<string, LNode>();
  const prefix = `${label}:`;
  let c: string | null = from;
  const seen = new Set<string>();
  while (c && !seen.has(c)) {
    seen.add(c);
    const n: LNode = nodes.get(c)!;
    const last: boolean = c === upto;
    copy.set(prefix + c, { id: prefix + c, value: n.value, next: last || !n.next ? null : prefix + n.next });
    if (last) break;
    c = n.next;
  }
  return listView(copy, prefix + from, { label, tones: Object.fromEntries(Object.entries(tones).map(([k, v]) => [prefix + k, v])), pointers: Object.fromEntries(Object.entries(pointers).map(([k, v]) => [k, v ? prefix + v : null])) });
}

// ---------- 3. Visual intro: dummy node ----------
export const dummyBuild = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'List (sirf even rakhenge)', default: [3, 4, 7, 8, 10, 1], minLen: 1, maxLen: 8, min: 0, max: 20 }],
  run({ values }, t) {
    const { nodes, ids } = make(values);
    nodes.set('D', { id: 'D', value: 'D', next: null });
    let tail = 'D';
    t.frame({ caption: 'Nayi list banani hai (sirf even). Bina dummy: "pehla node hai? to head = ye, warna tail.next = ye" — har jagah if. Dummy (D) = nakli pehla node: tail hamesha kisi node par, koi if nahi.', legend: { muted: 'dummy' }, panels: [listView(nodes, 'n0', { label: 'Input' }), chainView(nodes, 'D', 'D', 'Result', { D: 'muted' }, { tail })] });
    for (const id of ids) {
      const v = nodes.get(id)!.value as number;
      if (v % 2 === 0) {
        nodes.get(tail)!.next = id;
        tail = id;
        t.frame({ caption: `${v} even → tail.next = ${v}, tail = ${v}. Same do lines — chahe pehla ho ya aakhri.`, legend: { muted: 'dummy', new: 'juda' }, panels: [chainView(nodes, 'D', tail, 'Result', { D: 'muted', [id]: 'new' }, { tail })] });
      } else {
        t.frame({ caption: `${v} odd → chhodo.`, legend: { muted: 'dummy' }, panels: [chainView(nodes, 'D', tail, 'Result', { D: 'muted' }, { tail })] });
      }
    }
    nodes.get(tail)!.next = null;
    const head = nodes.get('D')!.next;
    t.frame({ caption: `Aakhir mein tail.next = null (purana link kaato). Answer = D.next: ${showFrom(nodes, head)}. Dummy khud kabhi return nahi hota.`, legend: { muted: 'dummy' }, panels: [chainView(nodes, 'D', tail, 'Result', { D: 'muted' }, { tail })] });
    return showFrom(nodes, head);
  },
});

// ---------- 4. How: merge two sorted lists ----------
export const mergeTrace = tracer<{ a: number[]; b: number[] }>({
  inputs: [
    { name: 'a', type: 'intArray', label: 'List A (sorted)', default: [1, 2, 4], minLen: 0, maxLen: 5, min: 0, max: 20, sorted: true },
    { name: 'b', type: 'intArray', label: 'List B (sorted)', default: [1, 3, 4], minLen: 0, maxLen: 5, min: 0, max: 20, sorted: true },
  ],
  run({ a, b }, t) {
    const A = make(a, 'a');
    const B = make(b, 'b');
    const nodes = new Map<string, LNode>([...A.nodes, ...B.nodes, ['D', { id: 'D', value: 'D', next: null }]]);
    let tail = 'D';
    let p: string | null = A.ids[0] ?? null;
    let q: string | null = B.ids[0] ?? null;
    const view = (hot?: string): Panel[] => [
      listView(nodes, p, { label: 'A (bacha)', pointers: { p } }),
      listView(nodes, q, { label: 'B (bacha)', pointers: { q } }),
      chainView(nodes, 'D', tail, 'Result', { D: 'muted', ...(hot ? { [hot]: 'new' } : {}) }, { tail }),
    ];
    t.frame({ line: 'init', caption: 'dummy D + tail. Dono lists ke aage wale compare, chhota tail ke baad. Naye nodes nahi — wahi nodes re-link.', legend: { muted: 'dummy', new: 'juda' }, panels: view() });
    while (p && q) {
      const pv = nodes.get(p)!.value as number;
      const qv = nodes.get(q)!.value as number;
      let picked: string;
      if (pv <= qv) {
        picked = p;
        nodes.get(tail)!.next = p;
        p = nodes.get(p)!.next;
      } else {
        picked = q;
        nodes.get(tail)!.next = q;
        q = nodes.get(q)!.next;
      }
      tail = picked;
      t.frame({ line: 'pick', caption: `${pv} vs ${qv} → ${nodes.get(picked)!.value} (${picked.startsWith('a') ? 'A' : 'B'} se) jodo, tail aage.`, legend: { muted: 'dummy', new: 'juda' }, panels: view(picked) });
    }
    nodes.get(tail)!.next = p ?? q;
    const rest = p ?? q;
    let end = tail;
    while (nodes.get(end)!.next) end = nodes.get(end)!.next!;
    const s = showFrom(nodes, nodes.get('D')!.next);
    t.frame({ line: 'rest', caption: rest ? `Ek list khatam → doosri ka bacha hissa (${showFrom(nodes, rest)}) ek hi link se jod do.` : 'Dono khatam.', legend: { muted: 'dummy' }, panels: [chainView(nodes, 'D', end, 'Result', { D: 'muted' })] });
    t.frame({ line: 'done', caption: `Return D.next → ${s}. O(m + n), O(1) extra.`, panels: [listView(nodes, nodes.get('D')!.next, { label: 'Result' })] });
    return s;
  },
});

// ---------- Example 1: odd-even list ----------
export const oddEvenTrace = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'List', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 8, min: 0, max: 99 }],
  run({ values }, t) {
    const { nodes, ids } = make(values);
    let odd = ids[0];
    const evenHead = nodes.get(odd)!.next;
    let even = evenHead;
    const tones = (): Record<string, Tone> => Object.fromEntries(ids.map((id, i) => [id, (i % 2 === 0 ? 'compare' : 'active') as Tone]));
    const view = () => [listView(nodes, null, { extra: ids, pointers: { odd, even, evenHead }, tones: tones() })];
    t.frame({ line: 'odd', caption: 'Position 1, 3, 5… (blue) ek list; 2, 4, 6… (narangi) doosri. Nodes apni jagah — sirf arrows badlenge. evenHead yaad rakho — aakhir mein jodna hai.', legend: { compare: 'odd position', active: 'even position' }, panels: view() });
    while (even && nodes.get(even)!.next) {
      nodes.get(odd)!.next = nodes.get(even)!.next;
      odd = nodes.get(odd)!.next!;
      t.frame({ line: 'odd', caption: `odd.next = even.next → ${nodes.get(odd)!.value}. Odd chain ek step badi.`, legend: { compare: 'odd position', active: 'even position' }, panels: view() });
      nodes.get(even)!.next = nodes.get(odd)!.next;
      even = nodes.get(even)!.next;
      t.frame({ line: 'even', caption: `even.next = odd.next → ${even ? nodes.get(even)!.value : 'null'}.`, legend: { compare: 'odd position', active: 'even position' }, panels: view() });
    }
    nodes.get(odd)!.next = evenHead;
    const s = showFrom(nodes, ids[0]);
    t.frame({ line: 'join', caption: `odd chain ke end (${nodes.get(odd)!.value}) ko evenHead se jodo → ${s}. O(n), O(1).`, legend: { compare: 'odd position', active: 'even position' }, panels: [listView(nodes, ids[0], { tones: tones() })] });
    return s;
  },
});

// ---------- Example 2: partition list ----------
export const partitionTrace = tracer<{ values: number[]; x: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'List', default: [1, 4, 3, 2, 5, 2], minLen: 1, maxLen: 8, min: 0, max: 9 },
    { name: 'x', type: 'int', label: 'x', default: 3, min: 0, max: 9 },
  ],
  run({ values, x }, t) {
    const { nodes, ids } = make(values);
    nodes.set('L', { id: 'L', value: 'L', next: null });
    nodes.set('M', { id: 'M', value: 'M', next: null });
    let less = 'L';
    let more = 'M';
    const orig = make(values);
    const view = (cur: string | null, hot?: string): Panel[] => [
      listView(orig.nodes, null, { label: 'Input', extra: orig.ids, pointers: { cur } }),
      chainView(nodes, 'L', less, `< ${x}`, { L: 'muted', ...(hot ? { [hot]: 'new' } : {}) }, { less }),
      chainView(nodes, 'M', more, `≥ ${x}`, { M: 'muted', ...(hot ? { [hot]: 'new' } : {}) }, { more }),
    ];
    t.frame({ line: 'less', caption: `2 dummy lists: L (x se chhote) aur M (baaki). Har node ko sahi list ke end mein jodo — order apne aap bana rahega.`, legend: { muted: 'dummy', new: 'juda' }, panels: view(ids[0]) });
    for (const id of ids) {
      const v = nodes.get(id)!.value as number;
      if (v < x) {
        nodes.get(less)!.next = id;
        less = id;
        t.frame({ line: 'less', caption: `${v} < ${x} → L list ke end mein.`, legend: { muted: 'dummy', new: 'juda' }, panels: view(id, id) });
      } else {
        nodes.get(more)!.next = id;
        more = id;
        t.frame({ line: 'more', caption: `${v} ≥ ${x} → M list ke end mein.`, legend: { muted: 'dummy', new: 'juda' }, panels: view(id, id) });
      }
    }
    nodes.get(more)!.next = null;
    t.frame({ line: 'cut', caption: `M ke aakhri node (${more === 'M' ? 'koi nahi' : nodes.get(more)!.value}) ka purana next kaato — warna wo kisi L node ko point karke circle bana sakta hai.`, legend: { muted: 'dummy' }, panels: view(null) });
    nodes.get(less)!.next = nodes.get('M')!.next;
    const s = showFrom(nodes, nodes.get('L')!.next);
    t.frame({ line: 'join', caption: `L ka end → M ka pehla asli node. Result ${s}. Stable, O(n), O(1).`, panels: [listView(nodes, nodes.get('L')!.next, { label: 'Result' })] });
    return s;
  },
});

// ---------- Example 3: reorder list ----------
export const reorderTrace = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'List', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 8, min: 0, max: 99 }],
  run({ values }, t) {
    const { nodes, ids } = make(values);
    const fixed = (ptr: Record<string, string | null>, tones: Record<string, Tone> = {}) => [listView(nodes, null, { extra: ids, pointers: ptr, tones })];
    let slow = ids[0];
    let fast: string | null = ids[0];
    while (fast && nodes.get(fast)!.next) {
      slow = nodes.get(slow)!.next!;
      fast = nodes.get(nodes.get(fast)!.next!)!.next;
    }
    t.frame({ line: 'middle', caption: `Step 1 — fast/slow se beech: ${nodes.get(slow)!.value}. Iske baad wala hissa doosra aadha.`, panels: fixed({ slow }, { [slow]: 'compare' }) });
    let prev: string | null = null;
    let cur: string | null = nodes.get(slow)!.next;
    while (cur) {
      const nxt: string | null = nodes.get(cur)!.next;
      nodes.get(cur)!.next = prev;
      prev = cur;
      cur = nxt;
    }
    nodes.get(slow)!.next = null;
    const secondIds = new Set<string>();
    for (let c = prev; c; c = nodes.get(c)!.next) secondIds.add(c);
    const halfTones = (): Record<string, Tone> => Object.fromEntries(ids.map((id) => [id, (secondIds.has(id) ? 'active' : 'compare') as Tone]));
    t.frame({ line: 'reverse', caption: `Step 2 — doosra aadha ulta (Reverse Linked List) aur pehle se kaata: ab ${prev ? showFrom(nodes, prev) : 'khaali'} — aakhri wale pehle.`, legend: { compare: 'pehla aadha', active: 'doosra aadha' }, panels: fixed({ first: ids[0], second: prev }, halfTones()) });
    let first: string | null = ids[0];
    let second: string | null = prev;
    while (second) {
      const n1: string | null = nodes.get(first!)!.next;
      const n2: string | null = nodes.get(second)!.next;
      nodes.get(first!)!.next = second;
      nodes.get(second)!.next = n1;
      t.frame({ line: 'weave', caption: `Step 3 — ${nodes.get(first!)!.value} → ${nodes.get(second)!.value} → ${n1 ? nodes.get(n1)!.value : 'null'}. Ek pehle aadhe se, ek doosre se (merge jaisa, compare ke bina).`, legend: { compare: 'pehla aadha', active: 'doosra aadha' }, panels: fixed({ first: n1, second: n2 }, halfTones()) });
      first = n1;
      second = n2;
    }
    const s = showFrom(nodes, ids[0]);
    t.frame({ line: 'weave', caption: `Result ${s}. 3 jaane-pehchaane tools: middle + reverse + merge. O(n), O(1).`, legend: { compare: 'pehla aadha', active: 'doosra aadha' }, panels: [listView(nodes, ids[0], { tones: halfTones() })] });
    return s;
  },
});
