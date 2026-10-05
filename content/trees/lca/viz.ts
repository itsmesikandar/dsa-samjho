import { buildTree, listStr, tracer, treeView, type TNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type T = { nodes: Map<string, TNode>; root: string | null };
type PQ = { levels: (number | null)[]; p: number; q: number };
const make = (levels: (number | null)[]) => buildTree(levels) as T;
const val = (t: T, id: string | null) => (id ? t.nodes.get(id)!.value : null);
const present = ({ levels, p, q }: PQ) => (!levels.includes(p) ? `${p} tree mein nahi hai.` : !levels.includes(q) ? `${q} tree mein nahi hai.` : null);
const pathTo = (t: T, id: string | null, x: number, path: string[] = []): string[] | null => {
  if (!id) return null;
  path.push(id);
  const n = t.nodes.get(id)!;
  if (n.value === x || pathTo(t, n.left, x, path) || pathTo(t, n.right, x, path)) return path;
  path.pop();
  return null;
};
const treeIn = (max: number, def: (number | null)[]) => ({ name: 'levels', type: 'tree' as const, label: 'Tree', default: def, maxNodes: 11, min: 0, max });
const SAMPLE = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4];

// ---------- 3. Visual intro: do raaste, common hissa ----------
export const ancestorPaths = tracer<PQ>({
  inputs: [treeIn(9, SAMPLE), { name: 'p', type: 'int', label: 'p', default: 7, min: 0, max: 9 }, { name: 'q', type: 'int', label: 'q', default: 6, min: 0, max: 9 }],
  check: present,
  run({ levels, p, q }, t) {
    const tr = make(levels);
    const a = pathTo(tr, tr.root, p)!;
    const b = pathTo(tr, tr.root, q)!;
    const legend = { compare: 'p ka raasta', active: 'q ka raasta', found: 'dono ka common', new: 'LCA' };
    const tones: Record<string, Tone> = {};
    const names = (ids: string[]) => listStr(ids.map((id) => val(tr, id)));
    const view = (): Panel[] => [treeView(tr.nodes, tr.root, { tones, pointers: { p: a[a.length - 1], q: b[b.length - 1] } })];
    a.forEach((id) => (tones[id] = 'compare'));
    t.frame({ caption: `Root se p = ${p} tak raasta: ${names(a)}. Ye ${p} ke saare ancestors hain (khud ${p} bhi).`, legend, panels: view() });
    b.forEach((id) => (tones[id] = a.includes(id) ? 'found' : 'active'));
    t.frame({ caption: `Root se q = ${q} tak: ${names(b)}. Dono raaste root se shuru → shuru ka hissa common.`, legend, panels: view() });
    let k = 0;
    while (k < a.length && k < b.length && a[k] === b[k]) k++;
    const lca = a[k - 1];
    tones[lca] = 'new';
    t.frame({ caption: `Common hissa ${names(a.slice(0, k))}. Uska AAKHRI node ${val(tr, lca)} = Lowest Common Ancestor — dono ka sabse neeche wala common "daada". Iske baad raaste alag ho jaate hain.`, legend, panels: view() });
    return String(val(tr, lca));
  },
});

// ---------- 4. How: ek DFS, neeche se "mila?" upar ----------
export const lcaTrace = tracer<PQ>({
  inputs: [treeIn(9, SAMPLE), { name: 'p', type: 'int', label: 'p', default: 6, min: 0, max: 9 }, { name: 'q', type: 'int', label: 'q', default: 4, min: 0, max: 9 }],
  check: present,
  run({ levels, p, q }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const badges: Record<string, string> = {};
    const legend = { compare: 'abhi', found: 'p / q mila', muted: 'kuch nahi mila', done: 'neeche se mila', new: 'LCA' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, badges, pointers: cur ? { node: cur } : {} })];
    const ret = (id: string, r: string | null) => (badges[id] = `↑${r ? val(tr, r) : 'null'}`);
    const lca = (id: string | null): string | null => {
      if (!id) return null;
      const n = tr.nodes.get(id)!;
      if (n.value === p || n.value === q) {
        tones[id] = 'found';
        ret(id, id);
        t.frame({ line: 'base', caption: `${n.value} = ${n.value === p ? 'p' : 'q'} → khud ko upar bhejo. Neeche dekhne ki zaroorat nahi: doosra neeche hua to bhi LCA yahi hai.`, legend, panels: view(id) });
        return id;
      }
      t.frame({ line: 'left', caption: `${n.value}: na p na q. Dono subtrees se pucho — "tumhe p ya q mila?"`, legend, panels: view(id) });
      const l = lca(n.left);
      const r = lca(n.right);
      if (l && r) {
        tones[id] = 'new';
        ret(id, id);
        t.frame({ line: 'both', caption: `${n.value}: left se ${val(tr, l)}, right se ${val(tr, r)} — dono alag taraf! Raaste yahin milte hain → ${n.value} hi LCA. Ise upar bhejo.`, legend, panels: view(id) });
        return id;
      }
      const up = l ?? r;
      tones[id] = up ? 'done' : 'muted';
      ret(id, up);
      t.frame({ line: 'one', caption: up ? `${n.value}: sirf ek taraf se ${val(tr, up)} aaya → wahi upar bhejo (LCA ya to wo hai, ya upar kahin).` : `${n.value}: dono taraf null → is subtree mein kuch nahi, null upar.`, legend, panels: view(id) });
      return up;
    };
    const ans = lca(tr.root);
    t.frame({ line: 'both', caption: `Root tak ${val(tr, ans)} pahuncha → LCA = ${val(tr, ans)}. Badge ↑x = us call ne kya lautaya. Ek DFS, O(n).`, legend, panels: view() });
    return String(val(tr, ans));
  },
});

// ---------- Example 1: LCA in BST ----------
export const bstLcaTrace = tracer<PQ>({
  inputs: [
    { name: 'levels', type: 'tree', label: 'BST', default: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], maxNodes: 11, min: 0, max: 15, bst: true },
    { name: 'p', type: 'int', label: 'p', default: 3, min: 0, max: 15 },
    { name: 'q', type: 'int', label: 'q', default: 5, min: 0, max: 15 },
  ],
  check: present,
  run({ levels, p, q }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', done: 'raasta', new: 'LCA' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, pointers: cur ? { cur } : {} })];
    let cur = tr.root;
    while (cur) {
      const v = val(tr, cur)!;
      if (p < v && q < v) {
        t.frame({ line: 'left', caption: `${p} aur ${q} dono < ${v} → dono left subtree mein. LCA bhi wahin. Right poora skip.`, legend, panels: view(cur) });
        tones[cur] = 'done';
        cur = tr.nodes.get(cur)!.left;
      } else if (p > v && q > v) {
        t.frame({ line: 'right', caption: `${p} aur ${q} dono > ${v} → dono right mein. Left skip.`, legend, panels: view(cur) });
        tones[cur] = 'done';
        cur = tr.nodes.get(cur)!.right;
      } else {
        tones[cur] = 'new';
        t.frame({ line: 'split', caption: p === v || q === v ? `${v} khud p / q hai, doosra iske neeche → LCA = ${v}.` : `${Math.min(p, q)} < ${v} < ${Math.max(p, q)} → ek left, ek right. Raaste yahin alag → LCA = ${v}. Sirf ek raasta chale: O(h).`, legend, panels: view() });
        return String(v);
      }
    }
    return 'null';
  },
});

// ---------- Example 2: distance between two nodes ----------
export const distanceTrace = tracer<PQ>({
  inputs: [treeIn(9, SAMPLE), { name: 'p', type: 'int', label: 'p', default: 7, min: 0, max: 9 }, { name: 'q', type: 'int', label: 'q', default: 0, min: 0, max: 9 }],
  check: present,
  run({ levels, p, q }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const badges: Record<string, string> = {};
    const legend = { new: 'LCA', compare: 'dhoondh rahe', done: 'raasta', found: 'mil gaya' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, badges, pointers: cur ? { node: cur } : {} })];
    const lca = (id: string | null): string | null => {
      if (!id) return null;
      const n = tr.nodes.get(id)!;
      if (n.value === p || n.value === q) return id;
      const l = lca(n.left);
      const r = lca(n.right);
      return l && r ? id : (l ?? r);
    };
    const a = lca(tr.root)!;
    tones[a] = 'new';
    t.frame({ line: 'lca', caption: `Pehle LCA (pichhle section wala DFS) = ${val(tr, a)}. p se q ka raasta ZAROOR yahin se mudta hai — p upar LCA tak, phir neeche q tak.`, legend, panels: view() });
    const depth = (id: string | null, x: number, d: number): number => {
      if (!id) return -1;
      const n = tr.nodes.get(id)!;
      badges[id] = `d${d}`;
      if (n.value === x) {
        tones[id] = 'found';
        t.frame({ line: 'found', caption: `${x} mila, LCA se ${d} edges neeche.`, legend, panels: view() });
        return d;
      }
      if (id !== a) tones[id] = 'done';
      t.frame({ line: 'down', caption: `${n.value} (depth ${d}) — ${x} nahi. Bachchon mein dhoondho, depth + 1.`, legend, panels: view(id) });
      const l = depth(n.left, x, d + 1);
      if (l !== -1) return l;
      return depth(n.right, x, d + 1);
    };
    const dp = depth(a, p, 0);
    for (const k of Object.keys(badges)) delete badges[k];
    for (const [k, v] of Object.entries(tones)) if (v === 'done') delete tones[k];
    const dq = depth(a, q, 0);
    t.frame({ line: 'sum', caption: `Distance = ${dp} + ${dq} = ${dp + dq} edges. Formula: depth(p) + depth(q) − 2 × depth(LCA) bhi yahi deta hai.`, legend, panels: view() });
    return String(dp + dq);
  },
});

// ---------- Example 3: LCA of deepest leaves ----------
export const deepestTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [treeIn(9, SAMPLE)],
  run({ levels }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const badges: Record<string, string> = {};
    const legend = { compare: 'abhi', done: 'jawab bheja', new: 'LCA (barabar gehre)' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, badges, pointers: cur ? { node: cur } : {} })];
    const deep = (id: string | null): [number, string | null] => {
      if (!id) return [0, null];
      const n = tr.nodes.get(id)!;
      const [lh, ln] = deep(n.left);
      const [rh, rn] = deep(n.right);
      if (lh === rh) {
        tones[id] = 'new';
        badges[id] = `h${lh + 1}→${n.value}`;
        t.frame({ line: 'tie', caption: lh === 0 ? `${n.value} leaf hai → height 1, apna LCA khud.` : `${n.value}: left height ${lh} = right height ${rh} → sabse gehre leaves DONO taraf. Unka LCA yahi ${n.value}.`, legend, panels: view(id) });
        return [lh + 1, id];
      }
      const [h, node] = lh > rh ? [lh, ln] : [rh, rn];
      tones[id] = 'done';
      badges[id] = `h${h + 1}→${val(tr, node)}`;
      t.frame({ line: 'deeper', caption: `${n.value}: ${lh > rh ? 'left' : 'right'} zyada gehra (${lh} vs ${rh}) → sabse gehre leaves sirf usi taraf. Uska jawab ${val(tr, node)} hi upar bhejo.`, legend, panels: view(id) });
      return [h + 1, node];
    };
    const [, ans] = deep(tr.root);
    t.frame({ line: 'tie', caption: `Jawab ${val(tr, ans)}. Badge h→x = (height, LCA) pair — tree-recursion wala "do cheezein return karo" pattern.`, legend, panels: view() });
    return String(val(tr, ans));
  },
});
