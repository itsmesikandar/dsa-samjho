import { listView, tracer, type LNode } from '@/components/viz/engine/tracer';
import type { MemoryCell, Panel, Tone } from '@/components/viz/engine/types';

/** values se nodes (id = prefix + index), head id */
function makeList(values: number[], prefix = 'n') {
  const nodes = new Map<string, LNode>();
  values.forEach((v, i) => nodes.set(`${prefix}${i}`, { id: `${prefix}${i}`, value: v, next: i + 1 < values.length ? `${prefix}${i + 1}` : null }));
  return { nodes, head: values.length ? `${prefix}0` : null };
}
const showList = (nodes: Map<string, LNode>, head: string | null) => {
  const out: string[] = [];
  for (let c = head; c; c = nodes.get(c)!.next) out.push(String(nodes.get(c)!.value));
  return out.length ? out.join(' -> ') : '(khaali)';
};

// ---------- 3. Visual intro: memory mein bikhre nodes ----------
export const scatteredNodes = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'Values', default: [10, 20, 30, 40], minLen: 1, maxLen: 6, min: -99, max: 99 }],
  run({ values }, t) {
    const spots = [1, 7, 3, 10, 5, 0];
    const start = 3000;
    const nodes = new Map<string, LNode>();
    let head: string | null = null;
    const mem = (upto: number, hot?: number): MemoryCell[] =>
      Array.from({ length: 12 }, (_, c) => {
        const k = spots.indexOf(c);
        if (k === -1 || k > upto) return {};
        const nextAddr = k + 1 <= upto && k + 1 < values.length ? `→${start + spots[k + 1] * 4}` : 'null';
        return { value: values[k], tag: `next ${nextAddr}`, tone: (k === hot ? 'new' : 'active') as Tone };
      });
    const arrows = (upto: number) => Array.from({ length: Math.max(0, Math.min(upto, values.length - 1)) }, (_, k) => ({ from: spots[k], to: spots[k + 1] }));
    t.frame({ caption: 'Array mein items memory mein lagatar baithte hain. Linked list ke NODES kahin bhi ban sakte hain — har node apne saath agle ka address (next) rakhta hai.', panels: [{ kind: 'memory', label: 'RAM', start, cells: mem(-1) }] });
    for (let k = 0; k < values.length; k++) {
      const id = `n${k}`;
      nodes.set(id, { id, value: values[k], next: null });
      if (k > 0) nodes.get(`n${k - 1}`)!.next = id;
      else head = id;
      t.frame({
        caption: k === 0 ? `Pehla node (${values[k]}) address ${start + spots[0] * 4} par bana. Ise "head" kehte hain — list ka darwaza.` : `${values[k]} ka node address ${start + spots[k] * 4} par bana (pichhle ke paas nahi!). Pichhle node ka next ab yahan point karta hai.`,
        panels: [{ kind: 'memory', label: 'RAM', start, cells: mem(k, k), arrows: arrows(k) }, listView(nodes, head, { label: 'Hum aise sochte hain', pointers: { head }, tones: { [id]: 'new' } })],
      });
    }
    const target = Math.min(2, values.length - 1);
    let cur: string | null = head;
    for (let s = 0; s <= target; s++) {
      t.frame({ caption: s === 0 ? `Index ${target} ka value chahiye? Array mein seedha address nikal jaata (O(1)). Yahan head se shuru karke next-next chalna padega.` : `${s} kadam chale. cur ab ${nodes.get(cur!)!.value} par.`, vars: { kadam: s }, panels: [listView(nodes, head, { pointers: { head, cur }, tones: { [cur!]: 'compare' } })] });
      if (s < target) cur = nodes.get(cur!)!.next;
    }
    t.frame({ caption: `get(${target}) = ${nodes.get(cur!)!.value} — ${target} kadam lage → O(n). Par aage node jodna/hatana sirf ek-do next badalne ka kaam → O(1).`, panels: [listView(nodes, head, { pointers: { head }, tones: { [cur!]: 'found' } })] });
    return showList(nodes, head);
  },
});

// ---------- 4. How: insert at position ----------
export const insertTrace = tracer<{ values: number[]; pos: number; value: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'List', default: [10, 20, 40], minLen: 0, maxLen: 6, min: -99, max: 99 },
    { name: 'pos', type: 'int', label: 'Position (0 se)', default: 2, min: 0, max: 7 },
    { name: 'value', type: 'int', label: 'Naya value', default: 30, min: -99, max: 99 },
  ],
  check: ({ values, pos }) => (pos <= values.length ? null : `Position 0..${values.length} ke beech rakho.`),
  run({ values, pos, value }, t) {
    const { nodes, head: h0 } = makeList(values);
    let head = h0;
    const nid = 'new';
    nodes.set(nid, { id: nid, value, next: null });
    if (pos === 0) {
      nodes.get(nid)!.next = head;
      t.frame({ line: 'head', caption: `Position 0: naya node (${value}) ka next = purana head. Ab naya node hi head. Kisi ko khiskana nahi pada → O(1).`, panels: [listView(nodes, nid, { pointers: { head: nid }, tones: { [nid]: 'new' } })] });
      head = nid;
      return showList(nodes, head);
    }
    let prev = head!;
    t.frame({ line: 'walk', caption: `Naya node (${value}) bana — abhi list se juda nahi. Position ${pos} par daalna hai, to position ${pos - 1} wale node (prev) tak chalo.`, vars: { kadam: 0 }, panels: [listView(nodes, head, { pointers: { prev }, tones: { [prev]: 'compare', [nid]: 'new' }, extra: [nid] })] });
    for (let s = 1; s < pos; s++) {
      prev = nodes.get(prev)!.next!;
      t.frame({ line: 'walk', caption: `prev = prev.next → ${nodes.get(prev)!.value}.`, vars: { kadam: s }, panels: [listView(nodes, head, { pointers: { prev }, tones: { [prev]: 'compare', [nid]: 'new' }, extra: [nid] })] });
    }
    const after = nodes.get(prev)!.next;
    nodes.get(nid)!.next = after;
    t.frame({ line: 'link1', caption: `Pehle: naya.next = prev.next (${after ? nodes.get(after)!.value : 'null'}). Ab naya node aage ki list ko pakde hue hai — kuch khoya nahi.`, panels: [listView(nodes, head, { pointers: { prev }, tones: { [prev]: 'compare', [nid]: 'new' }, extra: [nid] })] });
    nodes.get(prev)!.next = nid;
    t.frame({ line: 'link2', caption: `Phir: prev.next = naya. Bas do arrows badle — koi item khiskaana nahi pada (array mein O(n) shift hota).`, panels: [listView(nodes, head, { tones: { [nid]: 'found' } })] });
    return showList(nodes, head);
  },
});

// ---------- Example 1: remove all x ----------
export const removeTrace = tracer<{ values: number[]; x: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'List', default: [1, 2, 6, 3, 4, 5, 6], minLen: 1, maxLen: 8, min: 0, max: 9 },
    { name: 'x', type: 'int', label: 'Hatana hai (x)', default: 6, min: 0, max: 9 },
  ],
  run({ values, x }, t) {
    const { nodes, head: h0 } = makeList(values);
    let head = h0;
    while (head && nodes.get(head)!.value === x) {
      const old = head;
      head = nodes.get(head)!.next;
      t.frame({ line: 'head', caption: `Head khud ${x} hai → head = head.next. (Head ka koi "pichhla" nahi, isliye alag se sambhaala.)`, panels: [listView(nodes, head, { pointers: { head }, extra: [old], tones: { [old]: 'error' } })] });
    }
    let cur = head;
    if (cur) t.frame({ line: 'move', caption: `Head ab ${x} nahi. cur = head. Har baar cur.next dekhenge — hatane ke liye PICHHLA node chahiye.`, panels: [listView(nodes, head, { pointers: { cur }, tones: { [cur]: 'compare' } })] });
    while (cur) {
      const nxt = nodes.get(cur)!.next;
      if (nxt && nodes.get(nxt)!.value === x) {
        nodes.get(cur)!.next = nodes.get(nxt)!.next;
        t.frame({ line: 'skip', caption: `cur.next = ${x} → cur.next = cur.next.next. ${x} wala node list se bahar (koi use point nahi karta). cur WAHI — naya next bhi ${x} ho sakta hai.`, panels: [listView(nodes, head, { pointers: { cur }, tones: { [cur]: 'compare', [nxt]: 'error' }, extra: [nxt] })] });
      } else {
        cur = nxt;
        t.frame({ line: 'move', caption: nxt ? `cur.next ${x} nahi → cur aage (${nodes.get(nxt)!.value}).` : `cur.next = null → list khatam.`, panels: [listView(nodes, head, { pointers: { cur }, tones: cur ? { [cur]: 'compare' } : {} })] });
      }
    }
    const out = showList(nodes, head);
    t.frame({ line: 'move', caption: `Result: ${out}. Ek pass, O(n), O(1). Head ka alag case "dummy node" se hat jaata hai (Dummy node topic).`, panels: [listView(nodes, head, { pointers: { head } })] });
    return out;
  },
});

// ---------- Example 2: add two numbers ----------
export const addTrace = tracer<{ a: number[]; b: number[] }>({
  inputs: [
    { name: 'a', type: 'intArray', label: 'Number A (ulte digits)', default: [2, 4, 3], minLen: 1, maxLen: 5, min: 0, max: 9 },
    { name: 'b', type: 'intArray', label: 'Number B (ulte digits)', default: [5, 6, 4], minLen: 1, maxLen: 5, min: 0, max: 9 },
  ],
  run({ a, b }, t) {
    const A = makeList(a, 'a');
    const B = makeList(b, 'b');
    const R = new Map<string, LNode>();
    let rHead: string | null = null;
    let rTail: string | null = null;
    let p = A.head;
    let q = B.head;
    let carry = 0;
    let k = 0;
    const view = (hot?: string): Panel[] => [
      listView(A.nodes, A.head, { label: 'A', pointers: { p }, tones: p ? { [p]: 'compare' } : {} }),
      listView(B.nodes, B.head, { label: 'B', pointers: { q }, tones: q ? { [q]: 'compare' } : {} }),
      listView(R, rHead, { label: 'Result', tones: hot ? { [hot]: 'new' } : {} }),
    ];
    t.frame({ line: 'sum', caption: `Digits ulte hain — sabse chhota (units) aage. Bilkul school wala jod: units se shuru, carry aage.`, vars: { carry }, panels: view() });
    while (p || q || carry) {
      const x = p ? (A.nodes.get(p)!.value as number) : 0;
      const y = q ? (B.nodes.get(q)!.value as number) : 0;
      const sum = x + y + carry;
      t.frame({ line: 'sum', caption: `${p ? x : '0 (A khatam)'} + ${q ? y : '0 (B khatam)'} + carry ${carry} = ${sum}.`, vars: { carry, sum }, panels: view() });
      carry = Math.floor(sum / 10);
      const id = `r${k++}`;
      R.set(id, { id, value: sum % 10, next: null });
      if (rTail) R.get(rTail)!.next = id;
      else rHead = id;
      rTail = id;
      p = p ? A.nodes.get(p)!.next : null;
      q = q ? B.nodes.get(q)!.next : null;
      t.frame({ line: 'digit', caption: `Digit ${sum % 10} result mein, carry = ${carry}.${!p && !q && carry ? ' Dono khatam par carry bacha — ek aur digit!' : ''}`, vars: { carry }, panels: view(id) });
    }
    const out = showList(R, rHead);
    t.frame({ line: 'digit', caption: `Result ${out} (ulta padho to asli number). O(max(m, n)).`, panels: view() });
    return out;
  },
});

// ---------- Example 3: intersection of two lists ----------
export const intersectTrace = tracer<{ aOnly: number[]; bOnly: number[]; shared: number[] }>({
  inputs: [
    { name: 'aOnly', type: 'intArray', label: 'Sirf A ke nodes', default: [4, 1], minLen: 0, maxLen: 4, min: 0, max: 9 },
    { name: 'bOnly', type: 'intArray', label: 'Sirf B ke nodes', default: [5, 6, 1], minLen: 0, maxLen: 4, min: 0, max: 9 },
    { name: 'shared', type: 'intArray', label: 'Saanjhe nodes (milne ke baad)', default: [8, 4, 5], minLen: 0, maxLen: 3, min: 0, max: 9 },
  ],
  check: ({ aOnly, bOnly, shared }) => (aOnly.length + shared.length > 0 && bOnly.length + shared.length > 0 ? null : 'Dono lists mein kam se kam ek node chahiye.'),
  run({ aOnly, bOnly, shared }, t) {
    // asli nodes: a0.., b0.., s0.. — panels mein A aur B alag dikhte hain, saanjhe nodes dono mein
    const real = new Map<string, LNode>();
    const add = (pre: string, vals: number[], tail: string | null) => {
      for (let i = vals.length - 1; i >= 0; i--) {
        real.set(`${pre}${i}`, { id: `${pre}${i}`, value: vals[i], next: tail });
        tail = `${pre}${i}`;
      }
      return tail;
    };
    const sHead = add('s', shared, null);
    const aHead = add('a', aOnly, sHead);
    const bHead = add('b', bOnly, sHead);
    const panelOf = (which: 'A' | 'B') => {
      const m = new Map<string, LNode>();
      for (const [id, n] of real) m.set(`${which}:${id}`, { ...n, id: `${which}:${id}`, next: n.next ? `${which}:${n.next}` : null });
      return m;
    };
    const PA = panelOf('A');
    const PB = panelOf('B');
    const sharedTones = (which: string): Record<string, Tone> => Object.fromEntries(shared.map((_, i) => [`${which}:s${i}`, 'active' as Tone]));
    let p = aHead;
    let q = bHead;
    let pIn: 'A' | 'B' = 'A';
    let qIn: 'A' | 'B' = 'B';
    const view = (): Panel[] => {
      const ptrA: Record<string, string | null> = {};
      const ptrB: Record<string, string | null> = {};
      (pIn === 'A' ? ptrA : ptrB).p = p ? `${pIn}:${p}` : null;
      (qIn === 'A' ? ptrA : ptrB).q = q ? `${qIn}:${q}` : null;
      return [listView(PA, aHead ? `A:${aHead}` : null, { label: 'List A', pointers: ptrA, tones: sharedTones('A') }), listView(PB, bHead ? `B:${bHead}` : null, { label: 'List B', pointers: ptrB, tones: sharedTones('B') })];
    };
    t.frame({ line: 'step', caption: `Neeli nodes dono lists mein SAME nodes hain (Y shape). Lambaiyan alag hain, isliye seedha saath chalne se nahi milenge. Trick: list khatam ho to doosri ke head par kood jao.`, legend: { active: 'saanjha node' }, panels: view() });
    let steps = 0;
    while (p !== q) {
      const pv = p;
      const qv = q;
      if (p === null) {
        p = bHead;
        pIn = 'B';
      } else p = real.get(p)!.next;
      if (q === null) {
        q = aHead;
        qIn = 'A';
      } else q = real.get(q)!.next;
      steps++;
      const jumped = pv === null || qv === null;
      t.frame({ line: jumped ? 'switch' : 'step', caption: jumped ? `${pv === null ? 'p ne A khatam ki → B ke head par.' : ''} ${qv === null ? 'q ne B khatam ki → A ke head par.' : ''} Ab dono ne barabar (A + B) chalna hai.`.trim() : `Dono ek kadam aage. Abhi same node nahi.`, vars: { steps }, legend: { active: 'saanjha node' }, panels: view() });
    }
    const ans = p ? String(real.get(p)!.value) : 'null';
    t.frame({ line: 'meet', caption: p ? `p aur q same node par mile → ${ans}. Dono ne (sirf A) + (saanjha) + (sirf B) jitna chala — isliye ek saath pahunche. O(m + n), O(1).` : `Dono null par mile → koi saanjha node nahi.`, vars: { steps }, legend: { active: 'saanjha node' }, panels: view() });
    return ans;
  },
});
