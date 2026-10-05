import { listView, tracer, type LNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

function make(values: number[]) {
  const ids = values.map((_, i) => `n${i}`);
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
/** nodes apni asli jagah par (head = null + extra = sab) — taaki arrows ulte hote dikhein */
const fixed = (nodes: Map<string, LNode>, ids: string[], pointers: Record<string, string | null | undefined>, tones: Record<string, Tone> = {}): Panel => listView(nodes, null, { extra: ids, pointers, tones });

// ---------- 3. Visual intro: stack se ulta (seedha tareeka) ----------
export const stackReverse = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'List', default: [1, 2, 3, 4], minLen: 1, maxLen: 6, min: 0, max: 99 }],
  run({ values }, t) {
    const stack: number[] = [];
    const { nodes } = make(values);
    const out = new Map<string, LNode>();
    let outHead: string | null = null;
    let outTail: string | null = null;
    t.frame({ caption: 'Seedha tareeka: sab values ek stack mein daalo (aakhri sabse upar), phir nikaal ke nayi list banao.', panels: [listView(nodes, 'n0', { label: 'List' }), { kind: 'stack', label: 'Stack', items: [] }] });
    values.forEach((v, i) => {
      stack.push(v);
      t.frame({ caption: `${v} stack mein.`, panels: [listView(nodes, 'n0', { label: 'List', tones: { [`n${i}`]: 'compare' } }), { kind: 'stack', label: 'Stack', items: [...stack], tones: { [stack.length - 1]: 'new' } }] });
    });
    let k = 0;
    while (stack.length) {
      const v = stack.pop()!;
      const id = `r${k++}`;
      out.set(id, { id, value: v, next: null });
      if (outTail) out.get(outTail)!.next = id;
      else outHead = id;
      outTail = id;
      t.frame({ caption: `${v} upar se nikla → nayi list ke end mein. Last In, First Out = ulta order.`, panels: [listView(out, outHead, { label: 'Nayi list', tones: { [id]: 'new' } }), { kind: 'stack', label: 'Stack', items: [...stack] }] });
    }
    const s = showFrom(out, outHead);
    t.frame({ caption: `Ulti list ${s} — par n nodes ki EXTRA memory (stack + naye nodes). Agla tareeka (Kaise kaam karta hai) wahi nodes, sirf arrows ulte — O(1) memory.`, panels: [listView(out, outHead, { label: 'Nayi list' })] });
    return s;
  },
});

// ---------- 4. How: iterative reverse ----------
export const reverseTrace = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'List', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 7, min: 0, max: 99 }],
  run({ values }, t) {
    const { nodes, ids } = make(values);
    let prev: string | null = null;
    let cur: string | null = ids[0];
    t.frame({ line: 'init', caption: 'prev = null, cur = head. Nodes apni jagah rahenge — sirf har node ka next arrow ulta karna hai.', legend: { compare: 'cur', done: 'ulta ho gaya' }, panels: [fixed(nodes, ids, { prev, cur }, { [cur]: 'compare' })] });
    const done: Record<string, Tone> = {};
    while (cur) {
      const nd: LNode = nodes.get(cur)!;
      const nxt: string | null = nd.next;
      t.frame({ line: 'save', caption: `nxt = cur.next (${nxt ? nodes.get(nxt)!.value : 'null'}). Ise bachaana zaroori — agle kadam mein cur.next badal jaayega aur aage ki list ka raasta kho jaayega.`, legend: { compare: 'cur', done: 'ulta ho gaya' }, panels: [fixed(nodes, ids, { prev, cur, nxt }, { ...done, [cur]: 'compare' })] });
      nd.next = prev;
      done[cur] = 'done';
      t.frame({ line: 'flip', caption: `cur.next = prev → ${nd.value} ab ${prev ? nodes.get(prev)!.value : 'null'} ki taraf (ulta).`, legend: { compare: 'cur', done: 'ulta ho gaya' }, panels: [fixed(nodes, ids, { prev, cur, nxt }, { ...done })] });
      prev = cur;
      cur = nxt;
      t.frame({ line: 'move', caption: `prev = cur, cur = nxt — dono ek kadam aage.`, legend: { compare: 'cur', done: 'ulta ho gaya' }, panels: [fixed(nodes, ids, { prev, cur }, { ...done, ...(cur ? { [cur]: 'compare' as Tone } : {}) })] });
    }
    const s = showFrom(nodes, prev);
    t.frame({ line: 'done', caption: `cur = null → ho gaya. prev (purana aakhri) naya head: ${s}. O(n), O(1).`, panels: [listView(nodes, prev, { pointers: { head: prev } })] });
    return s;
  },
});

// ---------- Example 1: palindrome list ----------
export const palTrace = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'List', default: [1, 2, 2, 1], minLen: 1, maxLen: 8, min: 0, max: 3 }],
  run({ values }, t) {
    const { nodes, ids } = make(values);
    let slow: string | null = ids[0];
    let fast: string | null = ids[0];
    while (fast && nodes.get(fast)!.next) {
      slow = nodes.get(slow!)!.next;
      fast = nodes.get(nodes.get(fast)!.next!)!.next;
    }
    t.frame({ line: 'middle', caption: `Fast/slow se beech: slow = ${nodes.get(slow!)!.value} (index ${slow!.slice(1)}). Yahan se doosra aadha shuru.`, panels: [fixed(nodes, ids, { slow, fast }, { [slow!]: 'compare' })] });
    let prev: string | null = null;
    let cur: string | null = slow;
    while (cur) {
      const nxt: string | null = nodes.get(cur)!.next;
      nodes.get(cur)!.next = prev;
      prev = cur;
      cur = nxt;
    }
    const second0 = prev;
    t.frame({ line: 'reverse', caption: `Doosra aadha ulta kiya → ab aakhri node (${nodes.get(second0!)!.value}) se peeche ki taraf chal sakte hain. Pehla aadha head se.`, legend: { new: 'second' }, panels: [fixed(nodes, ids, { first: ids[0], second: second0 }, { [ids[0]]: 'compare', [second0!]: 'new' })] });
    let first: string | null = ids[0];
    let second: string | null = second0;
    while (second) {
      const a = nodes.get(first!)!.value;
      const b = nodes.get(second)!.value;
      const same = a === b;
      t.frame({ line: 'compare', caption: same ? `${a} == ${b} ✓ — dono aage.` : `${a} ≠ ${b} → palindrome NAHI.`, legend: { found: 'same', error: 'alag' }, panels: [fixed(nodes, ids, { first, second }, { [first!]: same ? 'found' : 'error', [second]: same ? 'found' : 'error' })] });
      if (!same) return 'false';
      first = nodes.get(first!)!.next;
      second = nodes.get(second)!.next;
    }
    t.frame({ line: 'yes', caption: 'Doosra aadha khatam, sab match → palindrome. O(n), O(1). (Achha code list ko wapas reverse karke theek bhi kar deta hai.)', panels: [fixed(nodes, ids, {})] });
    return 'true';
  },
});

// ---------- Example 2: reverse between ----------
export const betweenTrace = tracer<{ values: number[]; left: number; right: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'List', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 7, min: 0, max: 99 },
    { name: 'left', type: 'int', label: 'left (1 se)', default: 2, min: 1, max: 7 },
    { name: 'right', type: 'int', label: 'right', default: 4, min: 1, max: 7 },
  ],
  check: ({ values, left, right }) => (left <= right && right <= values.length ? null : `1 ≤ left ≤ right ≤ ${values.length} rakho.`),
  run({ values, left, right }, t) {
    const { nodes, ids } = make(values);
    nodes.set('D', { id: 'D', value: 'D', next: ids[0] });
    const all = ['D', ...ids];
    const seg: Record<string, Tone> = Object.fromEntries(ids.slice(left - 1, right).map((id) => [id, 'active' as Tone]));
    let before = 'D';
    for (let i = 1; i < left; i++) before = nodes.get(before)!.next!;
    const start = nodes.get(before)!.next!;
    t.frame({ line: 'walk', caption: `D = dummy (head se pehle nakli node). before = tukde se theek pehle wala (${nodes.get(before)!.value}). Tukda: position ${left}..${right}.`, legend: { active: 'tukda', muted: 'dummy' }, panels: [fixed(nodes, all, { before, start }, { ...seg, D: 'muted' })] });
    let prev: string | null = null;
    let cur: string | null = start;
    for (let i = left; i <= right; i++) {
      const nxt: string | null = nodes.get(cur!)!.next;
      nodes.get(cur!)!.next = prev;
      prev = cur;
      cur = nxt;
      t.frame({ line: 'flip', caption: `${nodes.get(prev!)!.value} ka arrow ulta. (Tukde ke andar normal reverse.)`, legend: { active: 'tukda', muted: 'dummy' }, panels: [fixed(nodes, all, { before, prev, cur }, { ...seg, D: 'muted' })] });
    }
    nodes.get(before)!.next = prev;
    nodes.get(start)!.next = cur;
    t.frame({ line: 'join', caption: `Jodo: before → ${nodes.get(prev!)!.value} (tukde ka naya shuru), aur ${nodes.get(start)!.value} (ab tukde ka aakhri) → ${cur ? nodes.get(cur)!.value : 'null'}.`, legend: { active: 'tukda', muted: 'dummy' }, panels: [listView(nodes, 'D', { tones: { ...seg, D: 'muted' }, pointers: { before } })] });
    const s = showFrom(nodes, nodes.get('D')!.next);
    t.frame({ line: 'join', caption: `Result ${s}. Ek pass, O(n), O(1).`, panels: [listView(nodes, nodes.get('D')!.next, { tones: seg })] });
    return s;
  },
});

// ---------- Example 3: reverse in k-groups ----------
export const kGroupTrace = tracer<{ values: number[]; k: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'List', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 8, min: 0, max: 99 },
    { name: 'k', type: 'int', label: 'k', default: 2, min: 1, max: 4 },
  ],
  run({ values, k }, t) {
    const { nodes, ids } = make(values);
    nodes.set('D', { id: 'D', value: 'D', next: ids[0] });
    let groupPrev = 'D';
    let g = 0;
    const tones: Record<string, Tone> = { D: 'muted' };
    const view = (ptr: Record<string, string | null>) => [listView(nodes, 'D', { pointers: ptr, tones })];
    for (;;) {
      let kth: string | null = groupPrev;
      for (let i = 0; i < k && kth; i++) kth = nodes.get(kth)!.next;
      if (!kth) {
        t.frame({ line: 'check', caption: `groupPrev ke aage poore ${k} nodes nahi → baaki waise hi chhodo.`, panels: view({ groupPrev }) });
        break;
      }
      const groupNext = nodes.get(kth)!.next;
      t.frame({ line: 'check', caption: `Tukda ${g + 1}: ${nodes.get(nodes.get(groupPrev)!.next!)!.value}..${nodes.get(kth)!.value} (${k} nodes hain ✓). groupNext = ${groupNext ? nodes.get(groupNext)!.value : 'null'}.`, panels: view({ groupPrev, kth, groupNext }) });
      let prev: string | null = groupNext;
      let cur: string | null = nodes.get(groupPrev)!.next;
      while (cur !== groupNext) {
        const nxt: string | null = nodes.get(cur!)!.next;
        nodes.get(cur!)!.next = prev;
        tones[cur!] = g % 2 ? 'compare' : 'active';
        prev = cur;
        cur = nxt;
      }
      const oldFirst = nodes.get(groupPrev)!.next!;
      t.frame({ line: 'flip', caption: `Tukde ke arrows ulte — prev ko groupNext se shuru kiya tha, isliye tukde ka purana pehla (${nodes.get(oldFirst)!.value}) ab seedha agle tukde ko point karta hai.`, panels: [listView(nodes, kth, { pointers: { groupPrev, kth }, tones, extra: ['D'] })] });
      nodes.get(groupPrev)!.next = kth;
      t.frame({ line: 'join', caption: `groupPrev.next = kth (${nodes.get(kth)!.value}) → tukda list mein juda. Agla groupPrev = ${nodes.get(oldFirst)!.value}.`, panels: view({ groupPrev: oldFirst }) });
      groupPrev = oldFirst;
      g++;
    }
    const s = showFrom(nodes, nodes.get('D')!.next);
    t.frame({ line: 'join', caption: `Result ${s}. Har node ek baar check + ek baar ulta → O(n), O(1).`, panels: [listView(nodes, nodes.get('D')!.next, { tones })] });
    return s;
  },
});
