import { buildTree, listStr, tracer, treeView, type TNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type T = { nodes: Map<string, TNode>; root: string | null };
const make = (levels: (number | null)[]) => buildTree(levels) as T;
const inf = (x: number) => (x === Infinity ? '∞' : x === -Infinity ? '-∞' : String(x));
const preorder = (t: T) => {
  const out: number[] = [];
  const go = (id: string | null) => {
    if (!id) return;
    const n = t.nodes.get(id)!;
    out.push(n.value);
    go(n.left);
    go(n.right);
  };
  go(t.root);
  return out;
};
const subtree = (t: T, id: string | null, out: string[] = []) => {
  if (id) {
    out.push(id);
    subtree(t, t.nodes.get(id)!.left, out);
    subtree(t, t.nodes.get(id)!.right, out);
  }
  return out;
};

// ---------- 3. Visual intro: har node ki range ----------
export const bstRanges = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'BST (level order)', default: [8, 3, 10, 1, 6, null, 14, null, null, 4, 7], maxNodes: 11, min: 0, max: 99, bst: true }],
  run({ levels }, t) {
    const tr = make(levels);
    const badges: Record<string, string> = {};
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', done: 'range pata' };
    const go = (id: string | null, lo: number, hi: number) => {
      if (!id) return;
      const n = tr.nodes.get(id)!;
      badges[id] = `${inf(lo)}..${inf(hi)}`;
      t.frame({ caption: `${n.value} ki range (${inf(lo)}, ${inf(hi)}). Iske left subtree mein SAB < ${n.value}, right mein SAB > ${n.value} — sirf bachcha nahi, poora subtree.`, legend, panels: [treeView(tr.nodes, tr.root, { tones: { ...tones, [id]: 'compare' }, badges })] });
      tones[id] = 'done';
      go(n.left, lo, n.value);
      go(n.right, n.value, hi);
    };
    go(tr.root, -Infinity, Infinity);
    const sorted = [...tr.nodes.values()].map((n) => n.value).sort((a, b) => a - b);
    t.frame({ caption: `Har node apni range mein → ye BST hai. Isliye inorder (L N R) = sorted ${listStr(sorted)}. Search mein har node par ek taraf hi jaana hai → O(h).`, legend, panels: [treeView(tr.nodes, tr.root, { tones, badges }), { kind: 'text', label: 'Inorder', text: listStr(sorted) }] });
    return listStr(sorted);
  },
});

// ---------- 4. How: insert (search ka raasta + khaali jagah) ----------
export const insertTrace = tracer<{ levels: (number | null)[]; key: number }>({
  inputs: [
    { name: 'levels', type: 'tree', label: 'BST', default: [8, 3, 10, 1, 6, null, 14, null, null, 4, 7], maxNodes: 11, min: 0, max: 99, bst: true },
    { name: 'key', type: 'int', label: 'Insert key', default: 5, min: 0, max: 99 },
  ],
  run({ levels, key }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'compare', done: 'raasta', new: 'naya node', found: 'pehle se hai' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, pointers: cur ? { node: cur } : {} })];
    const insert = (id: string | null, parent?: TNode, side?: 'left' | 'right'): string => {
      if (!id) {
        const nid = 'new';
        tr.nodes.set(nid, { id: nid, value: key, left: null, right: null });
        if (parent) parent[side!] = nid;
        else tr.root = nid;
        tones[nid] = 'new';
        t.frame({ line: 'new', caption: parent ? `${parent.value} ka ${side} khaali → ${key} yahin baithega. Koi node move karna nahi pada — naya node hamesha LEAF banta hai.` : `Tree khaali → ${key} hi root.`, legend, panels: view() });
        return nid;
      }
      const n = tr.nodes.get(id)!;
      if (key < n.value) {
        t.frame({ line: 'left', caption: `${key} < ${n.value} → left jao. Right subtree mein sab ${n.value} se bade — wahan jagah ho hi nahi sakti.`, legend, panels: view(id) });
        tones[id] = 'done';
        insert(n.left, n, 'left');
      } else if (key > n.value) {
        t.frame({ line: 'right', caption: `${key} > ${n.value} → right jao. Left subtree poora skip.`, legend, panels: view(id) });
        tones[id] = 'done';
        insert(n.right, n, 'right');
      } else {
        tones[id] = 'found';
        t.frame({ line: 'same', caption: `${key} pehle se hai → kuch mat karo (BST mein duplicate nahi).`, legend, panels: view() });
      }
      return id;
    };
    insert(tr.root);
    const pre = preorder(tr);
    t.frame({ line: 'same', caption: `Preorder ${listStr(pre)}. Har level par ek compare → O(h): balanced par log n, line jaisa tree ho to n.`, legend, panels: view() });
    return listStr(pre);
  },
});

// ---------- Example 1: range sum ----------
export const rangeSumTrace = tracer<{ levels: (number | null)[]; low: number; high: number }>({
  inputs: [
    { name: 'levels', type: 'tree', label: 'BST', default: [10, 5, 15, 3, 7, null, 18], maxNodes: 11, min: 0, max: 99, bst: true },
    { name: 'low', type: 'int', label: 'low', default: 7, min: 0, max: 99 },
    { name: 'high', type: 'int', label: 'high', default: 15, min: 0, max: 99 },
  ],
  run({ levels, low, high }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', found: 'jod liya', muted: 'skip (dekha hi nahi)', done: 'range se bahar' };
    let sum = 0;
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, pointers: cur ? { node: cur } : {} })];
    const skip = (id: string | null) => subtree(tr, id).forEach((x) => (tones[x] = 'muted'));
    const go = (id: string | null) => {
      if (!id) return;
      const n = tr.nodes.get(id)!;
      if (n.value < low) {
        tones[id] = 'done';
        skip(n.left);
        t.frame({ line: 'low', caption: `${n.value} < low ${low} → iska poora LEFT subtree aur bhi chhota, skip. Sirf right mein jao.`, vars: { sum }, legend, panels: view(id) });
        return go(n.right);
      }
      if (n.value > high) {
        tones[id] = 'done';
        skip(n.right);
        t.frame({ line: 'high', caption: `${n.value} > high ${high} → poora RIGHT subtree aur bhi bada, skip. Sirf left mein jao.`, vars: { sum }, legend, panels: view(id) });
        return go(n.left);
      }
      sum += n.value;
      tones[id] = 'found';
      t.frame({ line: 'add', caption: `${n.value} range [${low}, ${high}] mein → jodo, sum = ${sum}. Dono taraf range waale ho sakte hain → dono mein jao.`, vars: { sum }, legend, panels: view(id) });
      go(n.left);
      go(n.right);
    };
    go(tr.root);
    const seen = Object.values(tones).filter((x) => x !== 'muted').length;
    t.frame({ line: 'add', caption: `Sum = ${sum}. ${tr.nodes.size} mein se sirf ${seen} nodes dekhe — BST ka order batata hai kaunsa subtree poora bekaar hai.`, vars: { sum }, legend, panels: view() });
    return String(sum);
  },
});

// ---------- Example 2: validate BST ----------
export const validateTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [5, 1, 6, null, null, 3, 7], maxNodes: 11, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const badges: Record<string, string> = {};
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', done: 'range mein', error: 'range se bahar' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, badges, pointers: cur ? { node: cur } : {} })];
    const valid = (id: string | null, lo: number, hi: number): boolean => {
      if (!id) return true;
      const n = tr.nodes.get(id)!;
      badges[id] = `${inf(lo)}..${inf(hi)}`;
      if (n.value <= lo || n.value >= hi) {
        tones[id] = 'error';
        t.frame({ line: 'bad', caption: `${n.value} range (${inf(lo)}, ${inf(hi)}) se bahar! Apne parent se theek dikhta ho, par upar ke kisi ancestor ki condition toot gayi → false.`, legend, panels: view() });
        return false;
      }
      tones[id] = 'done';
      t.frame({ line: 'go', caption: `${n.value} range (${inf(lo)}, ${inf(hi)}) mein ✓. Left ko (${inf(lo)}, ${n.value}) do, right ko (${n.value}, ${inf(hi)}) — upar ki saari conditions neeche saath jaati hain.`, legend, panels: view(id) });
      return valid(n.left, lo, n.value) && valid(n.right, n.value, hi);
    };
    const ok = valid(tr.root, -Infinity, Infinity);
    t.frame({ line: 'go', caption: ok ? 'Har node apni range mein → valid BST = true.' : 'Valid BST = false. Sirf "left < node < right" (parent se) check karte to ye galti pakad mein nahi aati.', legend, panels: view() });
    return String(ok);
  },
});

// ---------- Example 3: delete ----------
export const deleteTrace = tracer<{ levels: (number | null)[]; key: number }>({
  inputs: [
    { name: 'levels', type: 'tree', label: 'BST', default: [8, 3, 12, 1, 6, 10, 15, null, null, null, null, null, 11], maxNodes: 11, min: 0, max: 99, bst: true },
    { name: 'key', type: 'int', label: 'Delete key', default: 8, min: 0, max: 99 },
  ],
  run({ levels, key }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', done: 'raasta', error: 'hatana hai', found: 'successor' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, pointers: cur ? { node: cur } : {} })];
    const del = (id: string | null, k: number): string | null => {
      if (!id) {
        t.frame({ line: 'miss', caption: `Null tak aa gaye → ${k} tree mein hai hi nahi. Kuch mat badlo.`, legend, panels: view() });
        return null;
      }
      const n = tr.nodes.get(id)!;
      if (k < n.value) {
        tones[id] = 'done';
        t.frame({ line: 'left', caption: `${k} < ${n.value} → left subtree se hatao; jo naya left aaye wo ${n.value}.left banega.`, legend, panels: view(id) });
        n.left = del(n.left, k);
        return id;
      }
      if (k > n.value) {
        tones[id] = 'done';
        t.frame({ line: 'right', caption: `${k} > ${n.value} → right subtree se hatao.`, legend, panels: view(id) });
        n.right = del(n.right, k);
        return id;
      }
      tones[id] = 'error';
      if (!n.left || !n.right) {
        const child = n.left ?? n.right;
        const cv = child ? tr.nodes.get(child)!.value : null;
        t.frame({ line: 'one', caption: child ? `${n.value} mila — sirf ek bachcha (${cv}). Bachcha seedha iski jagah le leta hai; uska poora subtree range mein hi rehta hai.` : `${n.value} mila — leaf hai. Bas hata do (parent ko null).`, legend, panels: view(id) });
        tr.nodes.delete(id);
        return child;
      }
      let s = n.right;
      while (tr.nodes.get(s)!.left) s = tr.nodes.get(s)!.left!;
      const sv = tr.nodes.get(s)!.value;
      tones[s] = 'found';
      t.frame({ line: 'succ', caption: `${n.value} mila — 2 bachche. Seedha hata nahi sakte. Right subtree ka sabse chhota (${sv}) dhoondho: right mein ek baar, phir left-left. Ye left ke sab se bada, right ke baaki sab se chhota — jagah ke liye perfect.`, legend, panels: view(id) });
      n.value = sv;
      tones[id] = 'done';
      t.frame({ line: 'copy', caption: `${sv} ki value yahan copy. Ab right subtree mein ${sv} 2 baar hai — purana hatana hai.`, legend, panels: view(id) });
      t.frame({ line: 'again', caption: `Right subtree se ${sv} delete karo. Successor ka left kabhi nahi hota → ye aasaan case (0 ya 1 bachcha).`, legend, panels: view(s) });
      n.right = del(n.right, sv);
      return id;
    };
    tr.root = del(tr.root, key);
    const pre = preorder(tr);
    t.frame({ line: 'again', caption: `Preorder ${listStr(pre)}. Kaam O(h): ek raasta neeche + successor tak ek raasta.`, legend, panels: view() });
    return listStr(pre);
  },
});
