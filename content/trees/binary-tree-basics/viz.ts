import { buildTree, levelOrderOf, listStr, tracer, treeView, type TNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type T = { nodes: Map<string, TNode>; root: string | null };
const make = (levels: (number | null)[]) => buildTree(levels) as T;
const ser = (t: T) => listStr(levelOrderOf(t.nodes, t.root).map((v) => (v === null ? 'null' : v)));

// ---------- 3. Visual intro: level order se tree banana ----------
export const buildTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Level order (# = khaali)', default: [3, 9, 20, null, null, 15, 7], maxNodes: 9, min: 0, max: 99 }],
  run({ levels }, t) {
    const nodes = new Map<string, TNode>();
    const show = (hot: Record<string, Tone>, q: string[]): Panel[] => [
      treeView(nodes, 't0', { tones: hot, label: 'Tree' }),
      { kind: 'queue', label: 'Queue (jinke bachche lagne hain)', items: q.map((id) => nodes.get(id)!.value) },
      { kind: 'array', values: levels.map((v) => (v === null ? '#' : v)), label: 'Input (level order)' },
    ];
    nodes.set('t0', { id: 't0', value: levels[0] as number, left: null, right: null });
    const q = ['t0'];
    t.frame({ caption: `Tree ko line mein likhne ka LeetCode tareeka: level by level, upar se neeche, left se right. # = khaali jagah. Pehla = root (${levels[0]}).`, panels: show({ t0: 'new' }, q) });
    let i = 1;
    while (q.length && i < levels.length) {
      const pid = q.shift()!;
      const p = nodes.get(pid)!;
      for (const side of ['left', 'right'] as const) {
        if (i >= levels.length) break;
        const v = levels[i];
        if (v !== null) {
          const id = `t${i}`;
          nodes.set(id, { id, value: v, left: null, right: null });
          p[side] = id;
          q.push(id);
          t.frame({ caption: `${p.value} ka ${side === 'left' ? 'LEFT' : 'RIGHT'} bachcha = ${v}. Ye bhi queue mein (iske bachche baad mein).`, panels: show({ [pid]: 'compare', [id]: 'new' }, q) });
        } else {
          t.frame({ caption: `${p.value} ka ${side === 'left' ? 'left' : 'right'} = # → khaali (null).`, panels: show({ [pid]: 'compare' }, q) });
        }
        i++;
      }
    }
    const tr = { nodes, root: 't0' };
    t.frame({ caption: `Tree taiyaar: ${nodes.size} nodes. Root = ${levels[0]}; jinke koi bachche nahi wo LEAF. Har tree problem ka input isi format mein aata hai.`, panels: [treeView(nodes, 't0', { label: 'Tree' })] });
    return ser(tr);
  },
});

// ---------- 4. How: max depth ----------
export const depthTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree (level order)', default: [3, 9, 20, null, null, 15, 7], maxNodes: 9, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const badges: Record<string, string> = {};
    const tones: Record<string, Tone> = {};
    const view = (cur?: string) => [treeView(tr.nodes, tr.root, { tones: { ...tones, ...(cur ? { [cur]: 'compare' } : {}) }, badges, pointers: cur ? { node: cur } : {} })];
    const depth = (id: string | null): number => {
      if (!id) return 0;
      const n = tr.nodes.get(id)!;
      t.frame({ line: 'left', caption: `${n.value}: pehle left subtree ki height pucho (recursion), phir right.${!n.left && !n.right ? ' Dono khaali (null → 0).' : ''}`, legend: { compare: 'abhi', done: 'height pata' }, panels: view(id) });
      const l = depth(n.left);
      const r = depth(n.right);
      const h = 1 + Math.max(l, r);
      badges[id] = `h=${h}`;
      tones[id] = 'done';
      t.frame({ line: 'combine', caption: `${n.value}: left = ${l}, right = ${r} → 1 + max = ${h}.`, legend: { compare: 'abhi', done: 'height pata' }, panels: view(id) });
      return h;
    };
    const ans = depth(tr.root);
    t.frame({ line: 'combine', caption: `Height = ${ans}. Har node ek baar → O(n); stack = height (balanced par log n, line jaisa skewed par n).`, panels: view() });
    return String(ans);
  },
});

// ---------- Example 1: invert ----------
export const invertTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [4, 2, 7, 1, 3, 6, 9], maxNodes: 9, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const done: Record<string, Tone> = {};
    const inv = (id: string | null): string | null => {
      if (!id) return null;
      const n = tr.nodes.get(id)!;
      t.frame({ line: 'recurse', caption: `${n.value}: pehle dono subtrees ko ulta karo (recursion).`, legend: { compare: 'abhi', done: 'ulta ho gaya' }, panels: [treeView(tr.nodes, tr.root, { tones: { ...done, [id]: 'compare' } })] });
      const l = inv(n.left);
      const r = inv(n.right);
      n.left = r;
      n.right = l;
      done[id] = 'done';
      t.frame({ line: 'swap', caption: `${n.value}: left ↔ right adla-badli. Ab ye poora subtree mirror.`, legend: { compare: 'abhi', done: 'ulta ho gaya' }, panels: [treeView(tr.nodes, tr.root, { tones: { ...done, [id]: 'swap' } })] });
      return id;
    };
    inv(tr.root);
    t.frame({ line: 'swap', caption: `Mirror image taiyaar: ${ser(tr)}. Har node ek baar → O(n).`, panels: [treeView(tr.nodes, tr.root, { tones: done })] });
    return ser(tr);
  },
});

// ---------- Example 2: count good nodes ----------
export const goodTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [3, 1, 4, 3, null, 1, 5], maxNodes: 9, min: 0, max: 9 }],
  run({ levels }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const badges: Record<string, string> = {};
    let total = 0;
    const dfs = (id: string | null, mx: number) => {
      if (!id) return;
      const n = tr.nodes.get(id)!;
      const good = n.value >= mx;
      if (good) total++;
      tones[id] = good ? 'found' : 'error';
      badges[id] = `max ${mx === -Infinity ? '−∞' : mx}`;
      t.frame({ line: 'check', caption: good ? `${n.value} ≥ raaste ka max (${mx === -Infinity ? '−∞' : mx}) → GOOD. (count = ${total})` : `${n.value} < raaste ka max (${mx}) → good nahi.`, vars: { good: total }, legend: { found: 'good', error: 'good nahi' }, panels: [treeView(tr.nodes, tr.root, { tones, badges, pointers: { node: id } })] });
      const m = Math.max(mx, n.value);
      dfs(n.left, m);
      dfs(n.right, m);
    };
    dfs(tr.root, -Infinity);
    t.frame({ line: 'recurse', caption: `${total} good nodes. Upar ki information (max) parameter se NEECHE bheji — top-down recursion. O(n).`, vars: { good: total }, legend: { found: 'good', error: 'good nahi' }, panels: [treeView(tr.nodes, tr.root, { tones })] });
    return String(total);
  },
});

// ---------- Example 3: count complete tree nodes ----------
export const completeTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'Complete tree mein nodes (1..15)', default: 6, min: 1, max: 15 }],
  run({ n }, t) {
    const tr = make(Array.from({ length: n }, (_, i) => i + 1));
    const tones: Record<string, Tone> = {};
    let calls = 0;
    const count = (id: string | null): number => {
      if (!id) return 0;
      calls++;
      let lh = 0;
      for (let c: string | null = id; c; c = tr.nodes.get(c)!.left) lh++;
      let rh = 0;
      for (let c: string | null = id; c; c = tr.nodes.get(c)!.right) rh++;
      const v = tr.nodes.get(id)!.value;
      if (lh === rh) {
        const sub = (1 << lh) - 1;
        const mark = (x: string | null) => {
          if (!x) return;
          tones[x] = 'found';
          mark(tr.nodes.get(x)!.left);
          mark(tr.nodes.get(x)!.right);
        };
        mark(id);
        t.frame({ line: 'perfect', caption: `${v}: left raasta ${lh}, right raasta ${rh} — barabar → ye subtree PERFECT hai: 2^${lh} − 1 = ${sub} nodes, formula se! Andar jaane ki zaroorat nahi.`, vars: { calls }, legend: { found: 'formula se gina', compare: 'abhi', active: 'split' }, panels: [treeView(tr.nodes, tr.root, { tones: { ...tones } })] });
        return sub;
      }
      tones[id] = 'active';
      t.frame({ line: 'split', caption: `${v}: left ${lh} ≠ right ${rh} → perfect nahi. 1 + left + right. (Inmein se ek subtree pakka perfect hoga — wo turant formula se.)`, vars: { calls }, legend: { found: 'formula se gina', compare: 'abhi', active: 'split' }, panels: [treeView(tr.nodes, tr.root, { tones: { ...tones, [id]: 'compare' } })] });
      return 1 + count(tr.nodes.get(id)!.left) + count(tr.nodes.get(id)!.right);
    };
    const ans = count(tr.root);
    t.frame({ line: 'split', caption: `${ans} nodes, sirf ${calls} calls. Har level par ek hi taraf neeche jaate hain, aur raasta measure karna O(log n) → O(log² n).`, vars: { calls }, panels: [treeView(tr.nodes, tr.root, { tones })] });
    return String(ans);
  },
});
