import { buildTree, tracer, treeView, type TNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type T = { nodes: Map<string, TNode>; root: string | null };
const make = (levels: (number | null)[]) => buildTree(levels) as T;

// ---------- 3. Visual intro: naive balanced check — neeche wale nodes baar baar count kiye ----------
export const naiveVisits = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree (level order)', default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], maxNodes: 12, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const visits: Record<string, number> = {};
    const badges: Record<string, string> = {};
    let total = 0;
    const height = (id: string | null): number => {
      if (!id) return 0;
      const n = tr.nodes.get(id)!;
      visits[id] = (visits[id] ?? 0) + 1;
      badges[id] = `×${visits[id]}`;
      total++;
      return 1 + Math.max(height(n.left), height(n.right));
    };
    const tones = (cur: string): Record<string, Tone> => {
      const out: Record<string, Tone> = {};
      for (const id of tr.nodes.keys()) out[id] = (visits[id] ?? 0) > 1 ? 'error' : visits[id] ? 'done' : 'muted';
      out[cur] = 'compare';
      return out;
    };
    const legend = { compare: 'abhi check', error: 'dobara gina', done: 'ek baar gina' };
    const check = (id: string | null): boolean => {
      if (!id) return true;
      const n = tr.nodes.get(id)!;
      const before = total;
      const l = height(n.left);
      const r = height(n.right);
      const ok = Math.abs(l - r) <= 1;
      t.frame({ caption: `isBalanced(${n.value}): height(left) = ${l}, height(right) = ${r} → poore subtrees phir se ghoome (${total - before} nodes). ${ok ? 'Yahan theek' : 'Fark > 1 → false'}.`, vars: { visits: total }, legend, panels: [treeView(tr.nodes, tr.root, { tones: tones(id), badges })] });
      return ok && check(n.left) && check(n.right);
    };
    const ok = check(tr.root);
    t.frame({ caption: `Jawab ${ok}. height() ne total ${total} node visits kiye, jabki tree mein sirf ${tr.nodes.size} nodes hain. Badge ×k = node k baar gina — har ancestor ne dobara poocha. Ek hi postorder pass mein height + check saath bhejo → har node ek baar.`, vars: { visits: total, n: tr.nodes.size }, legend, panels: [treeView(tr.nodes, tr.root, { tones: tones(tr.root!), badges })] });
    return String(ok);
  },
});

// ---------- 4. How: height ya -1, ek pass ----------
export const balancedTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [1, 2, 3, 4, null, null, null, 5], maxNodes: 10, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const badges: Record<string, string> = {};
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', done: 'height pata', error: '-1 (toot gaya)', muted: 'dekha hi nahi' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, badges, pointers: cur ? { node: cur } : {} })];
    const check = (id: string | null): number => {
      if (!id) return 0;
      const n = tr.nodes.get(id)!;
      t.frame({ line: 'left', caption: `check(${n.value}): pehle left subtree se pucho — "teri height kya hai, ya tu pehle hi toota hua hai (-1)?"`, legend, panels: view(id) });
      const l = check(n.left);
      if (l === -1) {
        tones[id] = 'error';
        badges[id] = '-1';
        t.frame({ line: 'cut', caption: `${n.value}: left ne -1 bheja → neeche kahin tree toot chuka hai. Right dekhne ki zaroorat nahi, seedha -1 upar bhejo.`, legend, panels: view(id) });
        return -1;
      }
      const r = check(n.right);
      if (r === -1) {
        tones[id] = 'error';
        badges[id] = '-1';
        t.frame({ line: 'cut', caption: `${n.value}: right ne -1 bheja → seedha -1 upar.`, legend, panels: view(id) });
        return -1;
      }
      if (Math.abs(l - r) > 1) {
        tones[id] = 'error';
        badges[id] = '-1';
        t.frame({ line: 'diff', caption: `${n.value}: left = ${l}, right = ${r} → fark ${Math.abs(l - r)} > 1. Yahin toota → -1 return (height ki jagah "fail" ka signal).`, legend, panels: view(id) });
        return -1;
      }
      const h = 1 + Math.max(l, r);
      tones[id] = 'done';
      badges[id] = `h=${h}`;
      t.frame({ line: 'ret', caption: `${n.value}: left = ${l}, right = ${r}, fark ≤ 1 → theek. Upar height ${h} bhejo — parent ko yahi chahiye apna check karne ke liye.`, legend, panels: view(id) });
      return h;
    };
    const res = check(tr.root);
    for (const id of tr.nodes.keys()) if (!tones[id]) tones[id] = 'muted';
    const ans = res !== -1;
    t.frame({ line: 'ret', caption: ans ? `Root se height ${res} aayi (-1 nahi) → balanced = true. Har node ek baar → O(n).` : `Root tak -1 aaya → balanced = false. Grey nodes dekhe hi nahi — -1 milte hi ruk gaye. Har node max ek baar → O(n).`, legend, panels: view() });
    return String(ans);
  },
});

// ---------- Example 1: diameter ----------
export const diameterTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [1, 2, 3, 4, 5, null, null, 6, null, null, 7, 8, null, null, 9], maxNodes: 11, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const badges: Record<string, string> = {};
    const tones: Record<string, Tone> = {};
    let best = 0;
    let bestAt: string | null = null;
    const legend = { compare: 'abhi', done: 'height bheji', found: 'best raasta yahan mudta' };
    const view = (cur?: string): Panel[] => [
      treeView(tr.nodes, tr.root, { tones: { ...tones, ...(bestAt ? { [bestAt]: 'found' as Tone } : {}), ...(cur ? { [cur]: 'compare' as Tone } : {}) }, badges, pointers: cur ? { node: cur } : {} }),
    ];
    const height = (id: string | null): number => {
      if (!id) return 0;
      const n = tr.nodes.get(id)!;
      const l = height(n.left);
      const r = height(n.right);
      const through = l + r;
      const better = through > best || !bestAt;
      if (better) {
        best = through;
        bestAt = id;
      }
      t.frame({ line: 'best', caption: `${n.value}: left height ${l} + right height ${r} = ${through} edges — wo raasta jo ${n.value} par mudta hai. ${better ? `Naya best = ${best}!` : `best ${best} hi rahega.`}`, vars: { best }, legend, panels: view(id) });
      const h = 1 + Math.max(l, r);
      tones[id] = 'done';
      badges[id] = `h=${h}`;
      t.frame({ line: 'ret', caption: `Par upar sirf height ${h} = 1 + max(${l}, ${r}) jaati hai — parent ke liye raasta ek hi taraf se aa sakta hai, mud nahi sakta.`, vars: { best }, legend, panels: view(id) });
      return h;
    };
    height(tr.root);
    const atRoot = bestAt === tr.root;
    t.frame({ line: 'best', caption: `Diameter = ${best}. ${atRoot ? 'Yahan best raasta root se guzra.' : `Dhyaan: best raasta ROOT se nahi, ${tr.nodes.get(bestAt!)?.value ?? '-'} par muda — isliye har node par best update karte hain.`} Return = height, jawab = global best.`, vars: { best }, legend, panels: view() });
    return String(best);
  },
});

// ---------- Example 2: house robber III ----------
export const robTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [3, 4, 5, 1, 3, null, 1], maxNodes: 10, min: 0, max: 99 }],
  run({ levels }, t) {
    const tr = make(levels);
    const badges: Record<string, string> = {};
    const tones: Record<string, Tone> = {};
    const legend = { compare: 'abhi', done: 'pair pata', found: 'loota' };
    const view = (cur?: string): Panel[] => [treeView(tr.nodes, tr.root, { tones: cur ? { ...tones, [cur]: 'compare' } : tones, badges, pointers: cur ? { node: cur } : {} })];
    const memo = new Map<string, [number, number]>();
    const rob = (id: string | null): [number, number] => {
      if (!id) return [0, 0];
      const n = tr.nodes.get(id)!;
      const [lt, ls] = rob(n.left);
      const [rt, rs] = rob(n.right);
      const take = n.value + ls + rs;
      const skip = Math.max(lt, ls) + Math.max(rt, rs);
      memo.set(id, [take, skip]);
      tones[id] = 'done';
      badges[id] = `${take}|${skip}`;
      t.frame({ line: 'take', caption: `${n.value} ko LOOTO: ${n.value} + bachchon ka "skip" (${ls} + ${rs}) = ${take}. Bachche loot nahi sakte — alarm baj jaayega.`, vars: { take, skip }, legend, panels: view(id) });
      t.frame({ line: 'skip', caption: `${n.value} ko CHHODO: har bachcha apna best de — max(${lt}, ${ls}) + max(${rt}, ${rs}) = ${skip}. Badge = take|skip, dono upar jaate hain.`, vars: { take, skip }, legend, panels: view(id) });
      return [take, skip];
    };
    const [take, skip] = rob(tr.root);
    const ans = Math.max(take, skip);
    const mark = (id: string | null, canTake: boolean) => {
      if (!id) return;
      const n = tr.nodes.get(id)!;
      const [tk, sk] = memo.get(id)!;
      const took = canTake && tk >= sk;
      if (took) tones[id] = 'found';
      mark(n.left, !took);
      mark(n.right, !took);
    };
    mark(tr.root, true);
    t.frame({ line: 'skip', caption: `Root par max(${take}, ${skip}) = ${ans}. Har node ne do jawab (pair) upar bheje — ek number kaafi nahi tha, kyunki parent ka decision bachche ke decision par tika hai.`, vars: { ans }, legend, panels: view() });
    return String(ans);
  },
});

// ---------- Example 3: max path sum ----------
export const maxPathTrace = tracer<{ levels: (number | null)[] }>({
  inputs: [{ name: 'levels', type: 'tree', label: 'Tree', default: [-10, 9, 20, null, null, 15, 7], maxNodes: 10, min: -30, max: 30 }],
  run({ levels }, t) {
    const tr = make(levels);
    const badges: Record<string, string> = {};
    const tones: Record<string, Tone> = {};
    let best = -Infinity;
    let bestAt: string | null = null;
    const legend = { compare: 'abhi', done: 'gain bheja', found: 'best raasta yahan mudta' };
    const view = (cur?: string): Panel[] => [
      treeView(tr.nodes, tr.root, { tones: { ...tones, ...(bestAt ? { [bestAt]: 'found' as Tone } : {}), ...(cur ? { [cur]: 'compare' as Tone } : {}) }, badges, pointers: cur ? { node: cur } : {} }),
    ];
    const gain = (id: string | null): number => {
      if (!id) return 0;
      const n = tr.nodes.get(id)!;
      const gl = gain(n.left);
      const gr = gain(n.right);
      const l = Math.max(0, gl);
      const r = Math.max(0, gr);
      const through = n.value + l + r;
      const better = through > best;
      if (better) {
        best = through;
        bestAt = id;
      }
      const cut = gl < 0 || gr < 0 ? ` Negative gain (${[gl, gr].filter((g) => g < 0).join(', ')}) ko 0 kiya — bura hissa mat jodo, chhod do.` : '';
      t.frame({ line: 'best', caption: `${n.value}: ${n.value} + left ${l} + right ${r} = ${through} (raasta yahan mudta).${cut} ${better ? `Naya best = ${best}.` : `best ${best} hi.`}`, vars: { best }, legend, panels: view(id) });
      const g = n.value + Math.max(l, r);
      tones[id] = 'done';
      badges[id] = `g=${g}`;
      t.frame({ line: 'ret', caption: `Upar gain ${g} = ${n.value} + max(${l}, ${r}) — sirf ek taraf, kyunki parent se aane wala raasta yahan se ek hi bachche mein ja sakta hai.`, vars: { best }, legend, panels: view(id) });
      return g;
    };
    gain(tr.root);
    t.frame({ line: 'best', caption: `Max path sum = ${best}. Diameter jaisa hi: return = ek-taraf ka gain, jawab = global best. Fark: values negative ho sakti hain → max(0, gain), aur best -∞ se shuru (sab negative ho to bhi ek node to lena hi hai).`, vars: { best }, legend, panels: view() });
    return String(best);
  },
});
