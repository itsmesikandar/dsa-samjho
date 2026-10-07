import { array, graphView, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Pos = Record<number, readonly [number, number]>;
type Tones = Record<number, Tone>;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const eStr = (e: readonly number[]) => `${e[0]}-${e[1]}`;
/** edge list array ke tones: pehle k 'done', k-th 'active' */
const progress = (m: number, k: number): Tones => {
  const tones: Tones = {};
  for (let i = 0; i < Math.min(k, m); i++) tones[i] = 'done';
  if (k < m) tones[k] = 'active';
  return tones;
};

// ---------- 3. Visual intro: graph ki language (neighbor, degree, path, cycle, component) ----------
const TERMS_DEFAULT = [[0, 1], [0, 2], [1, 2], [1, 3], [4, 5]];
const TERMS_POS: Pos = { 0: [0, 20], 1: [30, 50], 2: [0, 85], 3: [60, 20], 4: [70, 85], 5: [100, 60] };
const COMP_TONES: Tone[] = ['active', 'found', 'compare', 'new', 'swap', 'done'];

export const termsTrace = tracer<{ edges: number[][] }>({
  inputs: [{ name: 'edges', type: 'edges', label: 'Edges (undirected)', default: TERMS_DEFAULT, nodes: 6, maxEdges: 9 }],
  run({ edges: raw }, t) {
    const n = 6;
    const seen = new Set<string>();
    const edges = raw.filter(([a, b]) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seen.has(k)) return false; // 0-1 aur 1-0 ek hi edge
      seen.add(k);
      return true;
    });
    const m = edges.length;
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [a, b] of edges) {
      adj[a].push(b);
      adj[b].push(a);
    }
    const pos = same(raw, TERMS_DEFAULT) ? TERMS_POS : undefined;
    const g = (o: { tones?: Tones; badges?: Record<number, string>; edgeTones?: Record<string, Tone> } = {}): Panel[] => [
      graphView(n, edges, { pos, label: `${n} nodes, ${m} edges`, ...o }),
    ];
    t.frame({ caption: `Graph = nodes (vertices) + unke beech edges. Yahan ${n} nodes, ${m} edges. Tree jaisa root ya upar-neeche nahi — koi bhi node kisi se bhi jud sakta hai.`, panels: g() });

    // components (BFS) — aakhri frame ke liye, par path ke liye bhi kaam aata hai
    const comp: number[] = Array(n).fill(-1);
    let k = 0;
    for (let s = 0; s < n; s++) {
      if (comp[s] >= 0) continue;
      comp[s] = k;
      const q = [s];
      while (q.length) for (const v of adj[q.shift()!]) if (comp[v] < 0) (comp[v] = k), q.push(v);
      k++;
    }

    if (m > 0) {
      const u = adj.reduce((best, l, i) => (l.length > adj[best].length ? i : best), 0);
      const nb: Tones = { [u]: 'active' };
      const ne: Record<string, Tone> = {};
      adj[u].forEach((v) => ((nb[v] = 'new'), (ne[`${u}-${v}`] = 'active')));
      t.frame({ caption: `Node ${u} ke neighbor (neighbours) = ${listStr(adj[u])}. Inki count = degree(${u}) = ${adj[u].length}. Undirected edge = dono taraf ka rasta.`, legend: { active: 'choose kiya hua node', new: 'neighbor' }, panels: g({ tones: nb, edgeTones: ne }) });

      const deg: Record<number, string> = {};
      adj.forEach((l, i) => (deg[i] = `deg ${l.length}`));
      const lonely = adj.map((l, i) => (l.length ? -1 : i)).filter((i) => i >= 0);
      t.frame({ caption: `Har node ki degree. Jod = ${2 * m} = 2 × ${m} edges — har edge 2 nodes ki degree ek ek badhati hai.${lonely.length ? ` Node ${lonely.join(', ')}: degree 0 — akela (isolated).` : ''}`, panels: g({ badges: deg }) });

      // path: u ke component mein do door ke nodes (2 baar BFS) ke beech sabse chhota rasta
      const bfs = (s: number) => {
        const dist: number[] = Array(n).fill(-1);
        const par: number[] = Array(n).fill(-1);
        dist[s] = 0;
        const q = [s];
        while (q.length) {
          const x = q.shift()!;
          for (const v of adj[x]) if (dist[v] < 0) (dist[v] = dist[x] + 1), (par[v] = x), q.push(v);
        }
        return { far: dist.reduce((best, d, i) => (d > dist[best] ? i : best), s), par };
      };
      const from = bfs(u).far;
      const { far: to, par } = bfs(from);
      const path = [to];
      while (path[0] !== from) path.unshift(par[path[0]]);
      const len = path.length - 1;
      const pt: Tones = {};
      const pe: Record<string, Tone> = {};
      path.forEach((x, i) => ((pt[x] = 'found'), i && (pe[`${path[i - 1]}-${x}`] = 'found')));
      t.frame({ caption: `Path = edges ke sahare ek node se doosre tak ka rasta: ${path.join(' → ')}, length ${len} edge${len > 1 ? 's' : ''}. ${from} se ${to} ka isse chhota rasta nahi (kaise dhoondhte hain — BFS, agla topic).`, legend: { found: 'path' }, panels: g({ tones: pt, edgeTones: pe }) });

      // cycle: DFS, neighbor pehle se dekha hua aur parent nahi → ghoom ke wapas aaye
      const vis: boolean[] = Array(n).fill(false);
      const dad: number[] = Array(n).fill(-1);
      let cyc: number[] | null = null;
      const dfs = (x: number, p: number) => {
        vis[x] = true;
        for (const v of adj[x]) {
          if (cyc) return;
          if (v === p) continue;
          if (vis[v]) {
            const c = [x];
            for (let y = x; y !== v; ) c.push((y = dad[y]));
            cyc = c.reverse();
            return;
          }
          dad[v] = x;
          dfs(v, x);
        }
      };
      for (let s = 0; s < n && !cyc; s++) if (!vis[s]) dfs(s, -1);
      if (cyc) {
        const c: number[] = cyc;
        const ct: Tones = {};
        const ce: Record<string, Tone> = {};
        c.forEach((x, i) => ((ct[x] = 'error'), (ce[`${x}-${c[(i + 1) % c.length]}`] = 'error')));
        t.frame({ caption: `Cycle = aisa rasta jo ghoom kar wahin return kar, bina koi edge dobara liye: ${[...c, c[0]].join(' → ')}. Tree mein cycle kabhi nahi hota — isliye tree traversal mein "visited" ki zaroorat nahi thi, graph mein hai.`, legend: { error: 'cycle' }, panels: g({ tones: ct, edgeTones: ce }) });
      } else {
        t.frame({ caption: 'Koi cycle nahi — kisi node se chalo, bina edge dobara liye wapas nahi aa sakte.', panels: g() });
      }
      const isTree = k === 1 && !cyc;
      const ct: Tones = {};
      const badges: Record<number, string> = {};
      comp.forEach((c, i) => ((ct[i] = COMP_TONES[c % COMP_TONES.length]), (badges[i] = `C${c + 1}`)));
      const legend = Object.fromEntries(Array.from({ length: Math.min(k, COMP_TONES.length) }, (_, c) => [COMP_TONES[c], `component C${c + 1}`]));
      t.frame({ caption: `${k} connected component${k > 1 ? 's' : ''}: ek component ke andar har node har node tak pahunch sakta hai; alag components ke beech koi rasta nahi. ${isTree ? `Connected + bina cycle = TREE (edges = n - 1 = ${n - 1}).` : 'Tree = 1 component + koi cycle nahi (tab edges = n - 1).'}`, legend, panels: g({ tones: ct, badges }) });
    } else {
      t.frame({ caption: `Koi edge nahi → ${n} akele nodes, har ek apna component. Degree sab ki 0.`, panels: g() });
    }
    return String(k);
  },
});

// ---------- 4. How: edge list → adjacency list ----------
const HOW_DEFAULT = [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4], [4, 5]];
const HOW_POS: Pos = { 0: [0, 15], 1: [30, 50], 2: [0, 85], 3: [55, 20], 4: [80, 50], 5: [100, 85] };

export const adjListTrace = tracer<{ edges: number[][] }>({
  inputs: [{ name: 'edges', type: 'edges', label: 'Edges (undirected)', default: HOW_DEFAULT, nodes: 6, maxEdges: 9 }],
  run({ edges }, t) {
    const n = 6;
    const m = edges.length;
    const adj: number[][] = Array.from({ length: n }, () => []);
    const pos = same(edges, HOW_DEFAULT) ? HOW_POS : undefined;
    const legend = { active: 'abhi wali edge', done: 'list mein aa gayi', muted: 'abhi baaki', new: 'abhi badli list' };
    const view = (k: number, hot: number[] = [], badges: Record<number, string> = {}): Panel[] => {
      const et: Record<string, Tone> = {};
      edges.forEach((e, i) => (et[eStr(e)] = i < k ? 'done' : i === k ? 'active' : 'muted'));
      const tones: Tones = {};
      hot.forEach((u) => (tones[u] = 'new'));
      return [
        graphView(n, edges, { pos, tones, badges, edgeTones: et, label: 'Graph' }),
        array(edges.map(eStr), { pointers: k < m ? { edge: k } : {}, tones: progress(m, k), label: 'Edge list (input)' }),
        { kind: 'map', label: 'Adjacency list', keyLabel: 'node', valueLabel: 'adj[node] = neighbor', entries: adj.map((l, u) => ({ key: u, value: listStr(l), tone: hot.includes(u) ? 'new' : undefined })) },
      ];
    };
    t.frame({ line: 'init', caption: `Input = edge list (sirf jode). Par kaam ke time sawaal hota hai "is node ke neighbor kaun?" → har node ki apni list. ${n} khaali lists banao.`, legend, panels: view(-1) });
    edges.forEach(([u, v], i) => {
      adj[u].push(v);
      t.frame({ line: 'uv', caption: `Edge ${u}-${v}: adj[${u}] mein ${v} → "${u} se ${v} ja sakte hain".`, vars: { u, v }, legend, panels: view(i, [u]) });
      adj[v].push(u);
      t.frame({ line: 'vu', caption: `Undirected — rasta dono taraf: adj[${v}] mein ${u}. (Directed graph hota to ye step skip.)`, vars: { u, v }, legend, panels: view(i, [v]) });
    });
    const badges: Record<number, string> = {};
    adj.forEach((l, i) => (badges[i] = `deg ${l.length}`));
    const res = listStr(adj.map((l) => listStr(l)));
    t.frame({ line: 'done', caption: `Tayyar. Har edge se 2 entries → total ${2 * m} (= degrees ka jod). adj[u].size = degree. Banane mein O(n + m) time, memory O(n + m).`, legend, panels: view(m, [], badges) });
    return res;
  },
});

// ---------- Example 1: Star graph ka center ----------
export const starTrace = tracer<{ n: number; center: number }>({
  inputs: [
    { name: 'n', type: 'int', label: 'n (nodes 1..n)', default: 4, min: 3, max: 8 },
    { name: 'center', type: 'int', label: 'center', default: 2, min: 1, max: 8 },
  ],
  check: ({ n, center }) => (center <= n ? null : `center 1 se ${n} ke beech rakho.`),
  run({ n, center }, t) {
    const leaves = Array.from({ length: n }, (_, i) => i + 1).filter((x) => x !== center);
    const edges = leaves.map((x, i) => (i % 2 === 0 ? [x, center] : [center, x]));
    const m = edges.length;
    const pos: Pos = { [center]: [50, 50] };
    leaves.forEach((x, i) => {
      const a = (i / m) * 2 * Math.PI - Math.PI / 2;
      pos[x] = [50 + 48 * Math.cos(a), 50 + 48 * Math.sin(a)];
    });
    const deg: number[] = Array(n + 1).fill(0);
    const legend = { active: 'abhi wali edge', compare: 'dekhi ja rahi edge ke nodes', found: 'center' };
    const view = (k: number, tones: Tones = {}, edgeTones: Record<string, Tone> = {}, showDeg = true): Panel[] => {
      const badges: Record<number, string> = {};
      if (showDeg) for (let v = 1; v <= n; v++) if (deg[v]) badges[v] = `deg ${deg[v]}`;
      return [
        graphView(n, edges, { base: 1, pos, tones, badges, edgeTones, label: `Star: ${n} nodes, ${m} edges` }),
        array(edges.map((e) => `[${e[0]},${e[1]}]`), { pointers: k >= 0 && k < m ? { e: k } : {}, label: 'edges' }),
      ];
    };
    t.frame({ caption: `Star graph: ek CENTER, baaki ${m} nodes sirf center se jude. Edges kisi bhi order mein, aur [leaf, center] ya [center, leaf] dono tarah aa sakti hain. Pehle seedha tareeka: degree count karo.`, legend, panels: view(-1) });
    edges.forEach(([u, v], i) => {
      deg[u]++;
      deg[v]++;
      t.frame({ line: 'deg', caption: `Edge [${u}, ${v}]: deg[${u}] = ${deg[u]}, deg[${v}] = ${deg[v]}.`, vars: { u, v }, legend, panels: view(i, {}, { [`${u}-${v}`]: 'active' }) });
    });
    t.frame({ line: 'pick', caption: `Jiska degree n - 1 = ${m}: node ${center} → center. Ye tareeka kisi bhi graph par chalta hai: O(n) time, O(n) memory. Par star ki ek speciality se aur tez ho sakta hai…`, legend, panels: view(-1, { [center]: 'found' }) });
    const [a, b] = edges[0];
    const [c, d] = edges[1];
    t.frame({ line: 'first', caption: `Shortcut: center HAR edge mein hai. edges[0] = [${a}, ${b}] → center ya to ${a} hai ya ${b}.`, vars: { a, b }, legend, panels: view(0, { [a]: 'compare', [b]: 'compare' }, { [`${a}-${b}`]: 'active' }, false) });
    t.frame({ line: 'second', caption: `edges[1] = [${c}, ${d}]. Leaf sirf EK edge mein hota hai, center dono mein — to dono edges ka common node hi center.`, vars: { a, b, c, d }, legend, panels: view(1, { [c]: 'compare', [d]: 'compare' }, { [`${c}-${d}`]: 'active' }, false) });
    const ans = a === c || a === d ? a : b;
    t.frame({ line: 'common', caption: `${a === c || a === d ? `${a} edges[1] mein bhi hai → center = ${a}` : `${a} edges[1] mein nahi → center = ${b}`}. Sirf 2 edges dekhi: O(1) time, O(1) memory.`, vars: { a, b, c, d, center: ans }, legend, panels: view(-1, { [ans]: 'found' }, { [`${a}-${b}`]: 'active', [`${c}-${d}`]: 'active' }, false) });
    return String(ans);
  },
});

// ---------- Example 2: Town judge — in-degree / out-degree ----------
const JUDGE_DEFAULT = [[1, 3], [2, 3], [4, 3]];
const JUDGE_POS: Pos = { 1: [10, 10], 2: [90, 10], 3: [50, 55], 4: [50, 100] };

export const judgeTrace = tracer<{ trust: number[][] }>({
  inputs: [{ name: 'trust', type: 'edges', label: 'Trust (a-b = a ko b par bharosa), log 1..4', default: JUDGE_DEFAULT, nodes: 4, base: 1, maxEdges: 8 }],
  run({ trust }, t) {
    const n = 4;
    const m = trust.length;
    const inn: number[] = Array(n + 1).fill(0);
    const out: number[] = Array(n + 1).fill(0);
    const legend = { active: 'abhi wala trust', done: 'gina ja chuka', compare: 'check ho raha', found: 'judge', error: 'judge nahi' };
    const view = (k: number, tones: Tones = {}, cells: Record<string, Tone> = {}): Panel[] => {
      const et: Record<string, Tone> = {};
      trust.forEach((e, i) => {
        if (i < k) et[eStr(e)] = 'done';
        else if (i === k) et[eStr(e)] = 'active';
      });
      const people = Array.from({ length: n }, (_, i) => i + 1);
      return [
        graphView(n, trust, { base: 1, directed: true, pos: JUDGE_POS, tones, edgeTones: et, label: 'Trust graph (directed)' }),
        { kind: 'grid', label: 'Har insaan ka hisaab', values: [people.map((p) => inn[p]), people.map((p) => out[p]), people.map((p) => inn[p] - out[p])], rowLabels: ['in', 'out', 'score'], colLabels: people.map(String), tones: cells },
        array(trust.map(eStr), { pointers: k >= 0 && k < m ? { trust: k } : {}, tones: progress(m, k), label: 'trust list' }),
      ];
    };
    t.frame({ line: 'init', caption: `Trust = directed edge: a → b matlab a ko b par bharosa. Judge: out-degree 0 (kisi par trust nahi) aur in-degree n - 1 = ${n - 1} (baaki sab ka trust). Dono ek number mein: score = in - out.`, legend, panels: view(-1) });
    trust.forEach(([a, b], i) => {
      out[a]++;
      t.frame({ line: 'out', caption: `${a} → ${b}: ${a} ne trust kiya → score[${a}]-- (ab ${inn[a] - out[a]}). Ab ${a} judge nahi ho sakta.`, vars: { a, b }, legend, panels: view(i, { [a]: 'error' }, { [`1,${a - 1}`]: 'error', [`2,${a - 1}`]: 'error' }) });
      inn[b]++;
      t.frame({ line: 'in', caption: `${b} par ek aur trust → score[${b}]++ (ab ${inn[b] - out[b]}).`, vars: { a, b }, legend, panels: view(i, { [b]: 'compare' }, { [`0,${b - 1}`]: 'compare', [`2,${b - 1}`]: 'compare' }) });
    });
    for (let p = 1; p <= n; p++) {
      const s = inn[p] - out[p];
      if (s === n - 1) {
        t.frame({ line: 'check', caption: `score[${p}] = ${s} = n - 1 → judge ${p}! (score n - 1 tabhi jab in = ${n - 1} aur out = 0.) O(n + m) time, O(n) memory.`, vars: { p, score: s }, legend, panels: view(m, { [p]: 'found' }, { [`2,${p - 1}`]: 'found' }) });
        return String(p);
      }
      t.frame({ line: 'check', caption: `score[${p}] = ${s} ≠ ${n - 1} → ${p} judge nahi.`, vars: { p, score: s }, legend, panels: view(m, { [p]: 'error' }, { [`2,${p - 1}`]: 'error' }) });
    }
    t.frame({ line: 'none', caption: `Kisi ka score ${n - 1} nahi → koi judge nahi, -1.`, legend, panels: view(m) });
    return '-1';
  },
});

// ---------- Example 3: Maximal network rank — degree + adjacency matrix ----------
const RANK_DEFAULT = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 4], [3, 5]];
const RANK_POS: Pos = { 0: [30, 10], 1: [70, 10], 2: [50, 55], 3: [5, 55], 4: [95, 55], 5: [5, 100] };

export const networkRankTrace = tracer<{ roads: number[][] }>({
  inputs: [{ name: 'roads', type: 'edges', label: 'Roads (undirected), cities 0..5', default: RANK_DEFAULT, nodes: 6, maxEdges: 9 }],
  run({ roads }, t) {
    const n = 6;
    const deg: number[] = Array(n).fill(0);
    const conn: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
    const pos = same(roads, RANK_DEFAULT) ? RANK_POS : undefined;
    const legend = { active: 'abhi wali road', compare: 'pair (a, b)', error: 'seedhi road — ek baar ghatao', found: 'best pair' };
    const view = (tones: Tones = {}, edgeTones: Record<string, Tone> = {}, cells: Record<string, Tone> = {}): Panel[] => {
      const badges: Record<number, string> = {};
      deg.forEach((d, i) => (badges[i] = `deg ${d}`));
      return [
        graphView(n, roads, { pos, tones, badges, edgeTones, label: 'Cities + roads' }),
        { kind: 'grid', label: 'connected[a][b] (adjacency matrix)', values: conn.map((r) => r.map((x) => (x ? 1 : 0))), rowLabels: deg.map((_, i) => String(i)), colLabels: deg.map((_, i) => String(i)), corner: 'a\\b', tones: cells },
      ];
    };
    t.frame({ line: 'init', caption: 'Pair (a, b) ka network rank = a se judi roads + b se judi roads, par a-b ki seedhi road sirf ek baar. 2 cheezein chahiye: har city ki degree, aur "a-b road hai?" ka O(1) jawab → adjacency matrix.', legend, panels: view() });
    roads.forEach(([a, b]) => {
      deg[a]++;
      deg[b]++;
      conn[a][b] = conn[b][a] = true;
      t.frame({ line: 'deg', caption: `Road ${a}-${b}: deg[${a}] = ${deg[a]}, deg[${b}] = ${deg[b]}; matrix mein [${a}][${b}] aur [${b}][${a}] = 1.`, vars: { a, b }, legend, panels: view({}, { [`${a}-${b}`]: 'active' }, { [`${a},${b}`]: 'active', [`${b},${a}`]: 'active' }) });
    });
    let best = 0;
    let bp: number[] = [];
    for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
        const sum = deg[a] + deg[b];
        const rank = conn[a][b] ? sum - 1 : sum;
        const better = rank > best;
        if (better) (best = rank), (bp = [a, b]);
        const tag = better ? ` Naya best = ${best}.` : '';
        if (conn[a][b]) {
          t.frame({ line: 'minus', caption: `(${a}, ${b}): ${deg[a]} + ${deg[b]} = ${sum}, par ${a}-${b} seedhi road dono degree mein count ki gayi → ${sum} - 1 = ${rank}.${tag}`, vars: { a, b, rank, best }, legend, panels: view({ [a]: 'compare', [b]: 'compare' }, { [`${a}-${b}`]: 'error' }, { [`${a},${b}`]: 'error' }) });
        } else {
          t.frame({ line: 'pair', caption: `(${a}, ${b}): ${deg[a]} + ${deg[b]} = ${rank}. Seedhi road nahi (matrix mein 0) → kuch nahi ghatana.${tag}`, vars: { a, b, rank, best }, legend, panels: view({ [a]: 'compare', [b]: 'compare' }, {}, { [`${a},${b}`]: 'compare' }) });
        }
      }
    }
    const bt: Tones = bp.length ? { [bp[0]]: 'found', [bp[1]]: 'found' } : {};
    t.frame({ line: 'done', caption: `Max network rank = ${best}${bp.length ? ` (pehla aisa pair: ${bp[0]}, ${bp[1]})` : ''}. ${n * (n - 1) / 2} pairs, har ek O(1) — matrix ki wajah se. Total O(n² + m).`, vars: { best }, legend, panels: view(bt) });
    return String(best);
  },
});
