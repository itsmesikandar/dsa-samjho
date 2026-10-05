import { array, buildTree, levelOrderOf, listStr, tracer, treeView, type TNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type T = { nodes: Map<string, TNode>; root: string | null };
const make = (levels: (number | null)[]) => buildTree(levels) as T;
const ser = (t: T) => listStr(levelOrderOf(t.nodes, t.root).map((v) => (v === null ? 'null' : v)));

// ---------- 3. Visual intro: teen orders ek saath ----------
export const threeOrders = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree (level order)', default: [1, 2, 3, 4, 5], maxNodes: 7, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const pre: number[] = [];
    const ino: number[] = [];
    const post: number[] = [];
    const tones: Record<string, Tone> = {};
    const lists = (): Panel => ({ kind: 'text', label: 'Orders', text: `pre  (N L R): ${listStr(pre)}\nin   (L N R): ${listStr(ino)}\npost (L R N): ${listStr(post)}` });
    const legend = { new: 'pehli baar aaye (pre)', compare: 'left ho gaya (in)', done: 'dono ho gaye (post)' };
    const dfs = (id: string | null) => {
      if (!id) return;
      const n = tr.nodes.get(id)!;
      pre.push(n.value);
      tones[id] = 'new';
      t.frame({ caption: `${n.value} par PEHLI baar aaye → preorder mein likho. Ab left subtree.`, legend, panels: [treeView(tr.nodes, tr.root, { tones, pointers: { here: id } }), lists()] });
      dfs(n.left);
      ino.push(n.value);
      tones[id] = 'compare';
      t.frame({ caption: `${n.value} ka left poora → wapas ${n.value} par → inorder mein likho. Ab right subtree.`, legend, panels: [treeView(tr.nodes, tr.root, { tones, pointers: { here: id } }), lists()] });
      dfs(n.right);
      post.push(n.value);
      tones[id] = 'done';
      t.frame({ caption: `${n.value} ke dono subtrees poore → AAKHRI baar → postorder mein likho. Upar wapas.`, legend, panels: [treeView(tr.nodes, tr.root, { tones, pointers: { here: id } }), lists()] });
    };
    dfs(tr.root);
    t.frame({ caption: 'Ek hi DFS chakkar har node par 3 baar aata hai: aate waqt (pre), left ke baad (in), jaate waqt (post). Kis waqt likhte ho — wahi order.', panels: [treeView(tr.nodes, tr.root, { tones }), lists()] });
    return listStr(pre);
  },
});

// ---------- 4. How: iterative inorder ----------
export const inorderTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [4, 2, 6, 1, 3, 5, 7], maxNodes: 9, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const st: string[] = [];
    const res: number[] = [];
    const tones: Record<string, Tone> = {};
    let cur: string | null = tr.root;
    const view = (): Panel[] => [
      treeView(tr.nodes, tr.root, { tones: { ...tones, ...Object.fromEntries(st.map((id) => [id, 'compare' as Tone])) }, pointers: { cur } }),
      { kind: 'stack', label: 'Stack', items: st.map((id) => tr.nodes.get(id)!.value) },
      array(res, { label: 'Inorder' }),
    ];
    while (cur || st.length) {
      while (cur) {
        st.push(cur);
        t.frame({ line: 'push', caption: `${tr.nodes.get(cur)!.value} stack par — iska left pehle aana hai, isliye ise baad ke liye rakho. Baayein chalo.`, legend: { compare: 'stack mein', done: 'likh diya' }, panels: view() });
        cur = tr.nodes.get(cur)!.left;
      }
      const id = st.pop()!;
      res.push(tr.nodes.get(id)!.value);
      tones[id] = 'done';
      t.frame({ line: 'visit', caption: `Aage left khatam → stack se ${tr.nodes.get(id)!.value} nikaala, likha.`, legend: { compare: 'stack mein', done: 'likh diya' }, panels: view() });
      cur = tr.nodes.get(id)!.right;
      t.frame({ line: 'right', caption: cur ? `Ab ${tr.nodes.get(id)!.value} ka right subtree (${tr.nodes.get(cur)!.value}) — wahi process.` : `${tr.nodes.get(id)!.value} ka right nahi — stack ka agla.`, legend: { compare: 'stack mein', done: 'likh diya' }, panels: view() });
    }
    t.frame({ line: 'visit', caption: `Inorder ${listStr(res)}. Recursion ka call stack humne khud chalaya. O(n) time, O(h) stack.`, panels: view() });
    return listStr(res);
  },
});

// ---------- Example 1: path sum ----------
export const pathSumTrace = tracer<{ levels: (number | null)[]; target: number }>({
  inputs: [
    { name: 'levels', type: 'tree', label: 'Tree', default: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], maxNodes: 11, min: -5, max: 20 },
    { name: 'target', type: 'int', label: 'target', default: 22, min: -20, max: 60 },
  ],
  run({ levels, target }, t) {
    const tr = make(levels);
    const tones: Record<string, Tone> = {};
    const badges: Record<string, string> = {};
    let found = false;
    const go = (id: string | null, need: number, path: string[]): boolean => {
      if (!id) return false;
      const n = tr.nodes.get(id)!;
      const remain = need - n.value;
      badges[id] = `baaki ${remain}`;
      path.forEach((p) => (tones[p] = 'active'));
      tones[id] = 'compare';
      t.frame({ line: 'visit', caption: `${n.value}: chahiye ${need} − ${n.value} = ${remain} baaki (bachchon se).`, legend: { active: 'raasta', compare: 'abhi', found: 'mila', error: 'leaf, match nahi' }, panels: [treeView(tr.nodes, tr.root, { tones, badges })] });
      if (!n.left && !n.right) {
        const ok = remain === 0;
        tones[id] = ok ? 'found' : 'error';
        t.frame({ line: 'leaf', caption: ok ? `Leaf aur baaki 0 → raasta mil gaya!` : `Leaf par baaki ${remain} ≠ 0 → ye raasta nahi.`, legend: { active: 'raasta', found: 'mila', error: 'leaf, match nahi' }, panels: [treeView(tr.nodes, tr.root, { tones, badges })] });
        if (ok) {
          [...path, id].forEach((p) => (tones[p] = 'found'));
          return true;
        }
        delete tones[id];
        return false;
      }
      const ok = go(n.left, remain, [...path, id]) || go(n.right, remain, [...path, id]);
      if (!ok) delete tones[id];
      return ok;
    };
    found = go(tr.root, target, []);
    t.frame({ line: 'recurse', caption: found ? `Root se leaf tak sum ${target} wala raasta hai → true. (|| ki wajah se mila to baaki shaakhein dekhi hi nahi.)` : `Koi raasta ${target} nahi deta → false.`, panels: [treeView(tr.nodes, tr.root, { tones, badges })] });
    return String(found);
  },
});

// ---------- Example 2: construct from preorder + inorder ----------
export const constructTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Asli tree (iska pre/in nikaalenge)', default: [3, 9, 20, null, null, 15, 7], maxNodes: 7, min: 0, max: 30 }],
  check: ({ levels }) => {
    const vals = levels.filter((v) => v !== null);
    return new Set(vals).size === vals.length ? null : 'Values alag-alag honi chahiye (warna root ki jagah ambiguous).';
  },
  run({ levels }, t) {
    const src = make(levels);
    const pre: number[] = [];
    const ino: number[] = [];
    const walk = (id: string | null) => {
      if (!id) return;
      const n = src.nodes.get(id)!;
      pre.push(n.value);
      walk(n.left);
      ino.push(n.value);
      walk(n.right);
    };
    walk(src.root);
    const pos = new Map(ino.map((v, i) => [v, i]));
    const out = new Map<string, TNode>();
    let p = 0;
    let rootId: string | null = null;
    const view = (lo: number, hi: number, hot?: number): Panel[] => [
      array(pre, { label: 'preorder', pointers: { p: Math.min(p, pre.length - 1) }, tones: Object.fromEntries(pre.map((_, i) => [i, (i < p ? 'muted' : undefined) as Tone])) }),
      array(ino, { label: 'inorder', ranges: lo <= hi ? [{ from: lo, to: hi, label: 'abhi ka subtree', tone: 'active' }] : [], tones: hot !== undefined ? { [hot]: 'found' } : {} }),
      treeView(out, rootId, { label: 'Ban raha tree' }),
    ];
    t.frame({ line: 'root', caption: `Preorder = root pehle. Inorder = root ke baayein left subtree, daayein right. In do se tree wapas ban jaata hai.`, panels: view(0, ino.length - 1) });
    const mk = (lo: number, hi: number, attach?: (id: string) => void): string | null => {
      if (lo > hi) return null;
      const v = pre[p++];
      const id = `n${v}`;
      out.set(id, { id, value: v, left: null, right: null });
      if (attach) attach(id);
      else rootId = id;
      const m = pos.get(v)!;
      t.frame({ line: 'split', caption: `Preorder ka agla = ${v} → is subtree ka root. Inorder mein ${v} index ${m} par: baayein ${m - lo} node (left), daayein ${hi - m} (right).`, panels: view(lo, hi, m) });
      mk(lo, m - 1, (c) => (out.get(id)!.left = c));
      mk(m + 1, hi, (c) => (out.get(id)!.right = c));
      return id;
    };
    mk(0, ino.length - 1);
    const res = { nodes: out, root: rootId };
    t.frame({ line: 'root', caption: `Tree wapas ban gaya: ${ser(res)}. HashMap se inorder index O(1) → O(n).`, panels: [treeView(out, rootId)] });
    return ser(res);
  },
});

// ---------- Example 3: flatten to linked list ----------
export const flattenTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [1, 2, 5, 3, 4, null, 6], maxNodes: 8, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    let cur: string | null = tr.root;
    const done: Record<string, Tone> = {};
    while (cur) {
      const c = tr.nodes.get(cur)!;
      if (c.left) {
        let tail = c.left;
        while (tr.nodes.get(tail)!.right) tail = tr.nodes.get(tail)!.right!;
        t.frame({ line: 'tail', caption: `${c.value} ka left hai. Left subtree ka preorder mein AAKHRI node = sabse daayein (${tr.nodes.get(tail)!.value}). Uske baad ${c.value} ka purana right aayega.`, legend: { compare: 'cur', active: 'tail', done: 'chain mein' }, panels: [treeView(tr.nodes, tr.root, { tones: { ...done, [cur]: 'compare', [tail]: 'active' } })] });
        tr.nodes.get(tail)!.right = c.right;
        c.right = c.left;
        c.left = null;
        t.frame({ line: 'move', caption: `tail.right = purana right; ${c.value}.right = left subtree; left = null. Left subtree ab right side mein sarak gaya.`, legend: { compare: 'cur', done: 'chain mein' }, panels: [treeView(tr.nodes, tr.root, { tones: { ...done, [cur]: 'compare' } })] });
      }
      done[cur] = 'done';
      cur = c.right;
      if (cur) t.frame({ line: 'next', caption: `cur = right (${tr.nodes.get(cur)!.value}) — preorder ka agla.`, legend: { compare: 'cur', done: 'chain mein' }, panels: [treeView(tr.nodes, tr.root, { tones: { ...done, [cur]: 'compare' } })] });
    }
    const chain: number[] = [];
    for (let c = tr.root; c; c = tr.nodes.get(c)!.right) chain.push(tr.nodes.get(c)!.value);
    t.frame({ line: 'next', caption: `Chain = ${listStr(chain)} = preorder! Extra stack/list nahi — O(n), O(1).`, panels: [treeView(tr.nodes, tr.root, { tones: done })] });
    return listStr(chain);
  },
});
