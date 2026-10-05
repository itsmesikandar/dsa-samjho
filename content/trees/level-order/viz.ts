import { buildTree, listStr, tracer, treeView, type TNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone, ToneMap } from '@/components/viz/engine/types';

type T = { nodes: Map<string, TNode>; root: string | null };
const make = (levels: (number | null)[]) => buildTree(levels) as T;
const val = (t: T, id: string) => t.nodes.get(id)!.value;
const kids = (t: T, id: string) => [t.nodes.get(id)!.left, t.nodes.get(id)!.right].filter((c): c is string => !!c);
const queue = (t: T, q: string[], next = 0): Panel => ({
  kind: 'queue',
  label: 'Queue (aage → peeche)',
  items: q.map((id) => val(t, id)),
  tones: Object.fromEntries(q.map((_, i) => [i, (i >= q.length - next ? 'new' : 'active') as Tone])) as ToneMap,
});
const nested = (ls: number[][]) => listStr(ls.map(listStr));

// ---------- 3. Visual intro: level = root se doori ----------
export const levelsIntro = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree (level order)', default: [3, 9, 20, null, null, 15, 7], maxNodes: 9, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const badges: Record<string, string> = {};
    const out: number[][] = [];
    let cur = tr.root ? [tr.root] : [];
    for (let d = 0; cur.length; d++) {
      Object.keys(tones).forEach((k) => (tones[k] = 'done'));
      for (const id of cur) {
        tones[id] = 'found';
        badges[id] = `L${d}`;
      }
      out.push(cur.map((id) => val(tr, id)));
      t.frame({ caption: d === 0 ? 'Level 0 = sirf root. Level = root se kitne kadam door.' : `Level ${d}: root se ${d} kadam door wale saare nodes — baayein se daayein ${listStr(out[d])}.`, legend: { found: 'ye level', done: 'pehle wale levels' }, panels: [treeView(tr.nodes, tr.root, { tones, badges }), { kind: 'text', label: 'Levels', text: out.map((l, i) => `L${i}: ${listStr(l)}`).join('\n') }] });
      cur = cur.flatMap((id) => kids(tr, id));
    }
    t.frame({ caption: tr.root ? `Level order = upar se neeche, har level baayein se daayein: ${nested(out)}. DFS ek shaakh mein gehra jaata; BFS pehle saare paas wale.` : 'Khaali tree — koi level nahi.', panels: [treeView(tr.nodes, tr.root, { tones, badges })] });
    return nested(out);
  },
});

// ---------- 4. How: queue + level size ----------
export const bfsTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [3, 9, 20, null, null, 15, 7], maxNodes: 9, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const res: number[][] = [];
    if (!tr.root) {
      t.frame({ line: 'start', caption: 'Root null → khaali list [].', panels: [treeView(tr.nodes, tr.root)] });
      return '[]';
    }
    const tones: Record<string, Tone> = {};
    const legend = { active: 'queue: is level ke', new: 'queue: agle level ke', compare: 'abhi nikla', done: 'likh diya' };
    const q = [tr.root];
    const view = (next = 0, cur?: string, level: number[] = []): Panel[] => [
      treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones }),
      queue(tr, q, next),
      { kind: 'text', label: 'Result', text: `${nested(res)}${level.length ? `  + level ${listStr(level)}` : ''}` },
    ];
    t.frame({ line: 'start', caption: 'Queue mein root. Queue = line: jo pehle aaya wo pehle niklega (FIFO).', legend, panels: view() });
    while (q.length) {
      const size = q.length;
      const level: number[] = [];
      t.frame({ line: 'level', caption: `Queue mein abhi ${size} node → yahi POORA level ${res.length} hai. size ABHI note karo — loop ke beech naye bachche judenge, wo is level ke nahi.`, legend, panels: view() });
      let next = 0;
      for (let k = 0; k < size; k++) {
        const id = q.shift()!;
        level.push(val(tr, id));
        tones[id] = 'done';
        t.frame({ line: 'pop', caption: `Aage se ${val(tr, id)} nikla (${k + 1}/${size}) → level mein jodo.`, legend, panels: view(next, id, level) });
        const ch = kids(tr, id);
        if (ch.length) {
          q.push(...ch);
          next += ch.length;
          t.frame({ line: 'push', caption: `${val(tr, id)} ke bachche ${listStr(ch.map((c) => val(tr, c)))} queue ke PEECHE — is level ke baaki nodes ke baad hi niklenge.`, legend, panels: view(next, id, level) });
        }
      }
      res.push(level);
      t.frame({ line: 'done', caption: `Level ${res.length - 1} poora: ${listStr(level)}. Queue mein ab sirf agla level bacha.`, legend, panels: view() });
    }
    t.frame({ line: 'done', caption: `Queue khaali → khatam: ${nested(res)}. Har node ek baar queue mein aaya, ek baar nikla → O(n).`, panels: view() });
    return nested(res);
  },
});

// ---------- Example 1: min depth ----------
export const minDepthTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [1, 2, 3, 4, 5, null, 6, 7, null, null, null, 8], maxNodes: 10, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    if (!tr.root) {
      t.frame({ line: 'level', caption: 'Khaali tree → depth 0.', panels: [treeView(tr.nodes, tr.root)] });
      return '0';
    }
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', done: 'dekh liya', found: 'pehli leaf' };
    const q = [tr.root];
    let depth = 0;
    while (q.length) {
      depth++;
      t.frame({ line: 'level', caption: `depth = ${depth}: is level ke ${q.length} node dekho. Kisi mein leaf mila to wahi jawab.`, legend, panels: [treeView(tr.nodes, tr.root, { tones }), queue(tr, q)] });
      for (let k = q.length; k > 0; k--) {
        const id = q.shift()!;
        const ch = kids(tr, id);
        if (!ch.length) {
          tones[id] = 'found';
          t.frame({ line: 'leaf', caption: `${val(tr, id)} leaf hai (dono bachche null) → BFS level by level aata hai, to pehli leaf = sabse paas wali. Jawab ${depth}. Baaki tree dekha hi nahi!`, legend, panels: [treeView(tr.nodes, tr.root, { tones }), queue(tr, q)] });
          return String(depth);
        }
        q.push(...ch);
        tones[id] = 'done';
        t.frame({ line: 'push', caption: `${val(tr, id)} leaf nahi → bachche ${listStr(ch.map((c) => val(tr, c)))} agle level ke liye queue mein.`, legend, panels: [treeView(tr.nodes, tr.root, { tones: { ...tones, [id]: 'compare' } }), queue(tr, q, ch.length)] });
      }
    }
    return String(depth);
  },
});

// ---------- Example 2: right side view ----------
export const rightViewTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [1, 2, 3, null, 5, null, 4, 6], maxNodes: 10, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const res: number[] = [];
    if (!tr.root) {
      t.frame({ line: 'last', caption: 'Khaali tree → [].', panels: [treeView(tr.nodes, tr.root)] });
      return '[]';
    }
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', muted: 'chhup gaya', found: 'daayein se dikhta' };
    const q = [tr.root];
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, pointers: { cur } }), queue(tr, q), { kind: 'text', label: 'View', text: listStr(res) }];
    while (q.length) {
      const size = q.length;
      for (let k = 0; k < size; k++) {
        const id = q.shift()!;
        q.push(...kids(tr, id));
        if (k === size - 1) {
          res.push(val(tr, id));
          tones[id] = 'found';
          t.frame({ line: 'last', caption: `${val(tr, id)} is level ka AAKHRI (k = size − 1) → daayein khade aadmi ko yahi dikhega. View mein jodo.`, legend, panels: view() });
        } else {
          tones[id] = 'muted';
          t.frame({ line: 'push', caption: `${val(tr, id)} (${k + 1}/${size}) — iske daayein aur node hai, to ye peeche chhup gaya. Bas bachche queue mein.`, legend, panels: view(id) });
        }
      }
    }
    t.frame({ line: 'last', caption: `Right view ${listStr(res)}. Dhyaan: daayein wala node LEFT bachcha bhi ho sakta hai — agar us level par wahi aakhri hai.`, panels: view() });
    return listStr(res);
  },
});

// ---------- Example 3: max width ----------
export const widthTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [1, 3, 2, 5, null, null, 9, 6, null, 7], maxNodes: 11, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    if (!tr.root) {
      t.frame({ line: 'width', caption: 'Khaali tree → width 0.', panels: [treeView(tr.nodes, tr.root)] });
      return '0';
    }
    const tones: Record<string, Tone> = {};
    const badges: Record<string, string> = {};
    const legend = { compare: 'abhi', found: 'level ke kinaare', done: 'ho gaya' };
    let q: [string, number][] = [[tr.root, 0]];
    let best = 0;
    const view = (cur?: string): Panel[] => [
      treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, badges }),
      { kind: 'text', label: 'Width', text: `best = ${best}` },
    ];
    for (let d = 0; q.length; d++) {
      const first = q[0][1];
      t.frame({ line: 'level', caption: `Level ${d}: pehla position ${first}. Har position mein se ${first} ghatao — level 0 se shuru, numbers chhote rahenge.`, legend, panels: view() });
      const nq: [string, number][] = [];
      let last = 0;
      for (const [id, idx] of q) {
        const i = idx - first;
        last = i;
        badges[id] = `#${i}`;
        tones[id] = 'done';
        const n = tr.nodes.get(id)!;
        if (n.left) nq.push([n.left, 2 * i]);
        if (n.right) nq.push([n.right, 2 * i + 1]);
        t.frame({ line: 'pos', caption: `${n.value} ka position ${i}. Complete tree jaisa numbering: left bachcha 2·${i} = ${2 * i}, right 2·${i} + 1 = ${2 * i + 1} — beech ke khaali bhi gine jaate hain.`, legend, panels: view(id) });
      }
      const w = last + 1;
      best = Math.max(best, w);
      tones[q[0][0]] = 'found';
      tones[q[q.length - 1][0]] = 'found';
      t.frame({ line: 'width', caption: `Level ${d} ki width = aakhri − pehla + 1 = ${last} − 0 + 1 = ${w}. best = ${best}.`, legend, panels: view() });
      tones[q[0][0]] = 'done';
      tones[q[q.length - 1][0]] = 'done';
      q = nq;
    }
    t.frame({ line: 'width', caption: `Max width ${best}. Sirf nodes ginte to beech ke khaali chhoot jaate — position number se khaali jagah bhi gin li.`, panels: view() });
    return String(best);
  },
});
