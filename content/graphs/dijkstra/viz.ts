import { array, graphView, heapSim, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

type Pos = Record<number, readonly [number, number]>;
type Tones = Record<number, Tone>;
type Entry = { u: number; d: number; id: string };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const INF = Number.MAX_SAFE_INTEGER;
const show = (d: number) => (d === INF ? '∞' : String(d));

/** code jaisa: edge order mein (v, w) add; undirected ho to dono taraf */
function buildW(n: number, edges: number[][], directed: boolean, base = 0): number[][][] {
  const adj: number[][][] = Array.from({ length: n + base }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    if (!directed) adj[v].push([u, w]);
  }
  return adj;
}
/** PriorityQueue<IntArray>(compareBy { it[1] }) jaisa heap (Java ka hi order) */
const newPq = () => heapSim<Entry>((x, y) => x.d < y.d);
/** heap ko sorted dikhao — padhne mein aasaan; andar heap hi hai */
const pqPanel = (a: Entry[], name: (e: Entry) => string, hot?: string): Panel => {
  const sorted = [...a].sort((x, y) => x.d - y.d);
  return array(sorted.map(name), { ids: sorted.map((e) => e.id), label: 'PriorityQueue (sorted dikhaya, chhota pehle)', tones: hot ? Object.fromEntries(sorted.map((e, i) => [i, e.id === hot ? 'new' : undefined]).filter((x) => x[1])) : {} });
};

const N = 6;
const W_DEFAULT = [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 5], [2, 3, 8], [3, 4, 3], [2, 4, 12], [4, 5, 1]];
const W_POS: Pos = { 0: [0, 50], 1: [33, 5], 2: [33, 95], 3: [66, 5], 4: [80, 70], 5: [100, 100] };
const wEdges = { name: 'edges', type: 'edges' as const, label: 'Roads u-v:km (undirected), nodes 0..5', default: W_DEFAULT, nodes: N, maxEdges: 9, weighted: true, minW: 1, maxW: 15 };

// ---------- 3. Visual intro: kam edges ≠ kam cost ----------
export const whyTrace = tracer<{ edges: number[][] }>({
  inputs: [wEdges],
  run({ edges }, t) {
    const adj = buildW(N, edges, false);
    const pos = same(edges, W_DEFAULT) ? W_POS : undefined;
    const dist: number[] = Array(N).fill(INF);
    const par: number[] = Array(N).fill(-1);
    const settled: number[] = [];
    const pq = newPq();
    dist[0] = 0;
    pq.add({ u: 0, d: 0, id: 'x' });
    while (pq.a.length) {
      const { u, d } = pq.poll()!;
      if (d > dist[u]) continue;
      settled.push(u);
      for (const [v, w] of adj[u]) if (d + w < dist[v]) (dist[v] = d + w), (par[v] = u), pq.add({ u: v, d: d + w, id: 'x' });
    }
    const dst = settled.reduce((b, v) => (dist[v] >= dist[b] ? v : b), 0);
    const g = (tones: Tones = {}, et: Record<string, Tone> = {}, badges: Record<number, string> = {}): Panel[] => [graphView(N, edges, { weighted: true, pos, tones, edgeTones: et, badges, label: 'Roads (number = km)' })];
    t.frame({ caption: `Har road par km likha hai. 0 se ${dst} jaana hai — sabse sasta (kam km) rasta kaunsa?`, panels: g({ 0: 'active', [dst]: 'compare' }) });
    if (dst === 0) {
      t.frame({ caption: '0 se kisi aur node tak road hi nahi. Kuch dhoondhne ko nahi.', panels: g({ 0: 'active' }) });
      return '0';
    }
    // BFS: sabse kam edges wala rasta
    const bp: number[] = Array(N).fill(-1);
    const seen = [true, ...Array(N - 1).fill(false)];
    for (const q = [0]; q.length; ) {
      const u = q.shift()!;
      for (const [v] of adj[u]) if (!seen[v]) (seen[v] = true), (bp[v] = u), q.push(v);
    }
    const pathOf = (p: number[]) => {
      const path = [dst];
      while (path[0] !== 0) path.unshift(p[path[0]]);
      return path;
    };
    const wOf = (a: number, b: number) => adj[a].find(([v]) => v === b)![1];
    const bPath = pathOf(bp);
    const bCost = bPath.slice(1).reduce((s, v, i) => s + wOf(bPath[i], v), 0);
    const dPath = pathOf(par);
    const paint = (path: number[], tone: Tone): [Tones, Record<string, Tone>] => {
      const tn: Tones = {};
      const et: Record<string, Tone> = {};
      path.forEach((x, i) => ((tn[x] = tone), i && (et[`${path[i - 1]}-${x}`] = tone)));
      return [tn, et];
    };
    t.frame({ caption: `BFS socho (sabse kam roads): ${bPath.join(' → ')} — ${bPath.length - 1} roads, cost ${bCost} km.`, legend: { compare: 'BFS ka rasta' }, panels: g(...paint(bPath, 'compare')) });
    const sameWay = same(bPath, dPath);
    t.frame({ caption: sameWay ? `Yahan sabse sasta bhi wahi hai: ${dist[dst]} km. Par hamesha aisa nahi — weights alag hon to kam roads ≠ kam cost.` : `Par ${dPath.join(' → ')} — ${dPath.length - 1} roads, sirf ${dist[dst]} km! Zyada roads, kam cost. Weights ho to BFS fail.`, legend: { found: 'sabse sasta' }, panels: g(...paint(dPath, 'found')) });
    const done: Tones = {};
    const badges: Record<number, string> = {};
    settled.forEach((u, i) => {
      badges[u] = `${dist[u]}`;
      done[u] = 'done';
      t.frame({ caption: i === 0 ? 'Dijkstra ka idea: jo node abhi sabse PAAS hai, uski distance pakki — kyunki weights negative nahi, kisi aur raste se ghoom ke aana usse sasta nahi ho sakta. 0 khud: distance 0.' : `${u} pakka: ${dist[u]} km (${par[u]} se). Bache hue mein yahi sabse paas tha.`, legend: { active: 'abhi pakka hua', done: 'pakka' }, panels: g({ ...done, [u]: 'active' }, {}, { ...badges }) });
    });
    const et: Record<string, Tone> = {};
    settled.forEach((u) => par[u] >= 0 && (et[`${par[u]}-${u}`] = 'found'));
    t.frame({ caption: `Har node paas se door ke order mein pakka hua. Green roads = har node tak sabse sasta rasta (shortest path tree). 0 → ${dst}: ${dist[dst]} km.`, legend: { done: 'pakka', found: 'sabse saste raste' }, panels: g(done, et, badges) });
    return String(dist[dst]);
  },
});

// ---------- 4. How: Dijkstra (lazy — purani entries skip) ----------
export const dijkstraTrace = tracer<{ edges: number[][]; src: number }>({
  inputs: [wEdges, { name: 'src', type: 'int', label: 'src', default: 0, min: 0, max: N - 1 }],
  run({ edges, src }, t) {
    const adj = buildW(N, edges, false);
    const pos = same(edges, W_DEFAULT) ? W_POS : undefined;
    const dist: number[] = Array(N).fill(INF);
    const done: boolean[] = Array(N).fill(false);
    const pq = newPq();
    let k = 0;
    const legend = { active: 'abhi nikala (pakka)', done: 'pakka', compare: 'relax check', new: 'sasta hua', muted: 'purani entry' };
    const view = (u?: number, v?: number, vt: Tone = 'compare', hot?: string): Panel[] => {
      const tones: Tones = {};
      done.forEach((x, i) => x && (tones[i] = 'done'));
      if (u !== undefined) tones[u] = 'active';
      if (v !== undefined) tones[v] = vt;
      const badges: Record<number, string> = {};
      dist.forEach((d, i) => (badges[i] = show(d)));
      return [
        graphView(N, edges, { weighted: true, pos, tones, badges, edgeTones: u !== undefined && v !== undefined ? { [`${u}-${v}`]: vt } : {}, label: 'Graph (badge = dist)' }),
        pqPanel(pq.a, (e) => `${e.u}:${e.d}`, hot),
      ];
    };
    dist[src] = 0;
    pq.add({ u: src, d: 0, id: `e${k++}` });
    t.frame({ line: 'start', caption: `dist[${src}] = 0, baaki ∞. PQ mein (${src}:0). PQ hamesha sabse kam dist wala pehle deta hai.`, legend, panels: view() });
    while (pq.a.length) {
      const { u, d } = pq.poll()!;
      if (d > dist[u]) {
        t.frame({ line: 'stale', caption: `(${u}:${d}) nikla, par dist[${u}] = ${dist[u]} pehle hi chhota → purani entry, skip. (Heap se purani entry hatana mehenga, isliye bas nikalte time ignore.)`, vars: { u, d }, legend, panels: view(u, undefined) });
        continue;
      }
      done[u] = true;
      t.frame({ line: 'poll', caption: `(${u}:${d}) nikla — PQ mein sabse chhota. ${u} ki distance ${d} ab pakki: baaki sab entries ≥ ${d}, aur weights ≥ 0, to kisi aur raste se sasta nahi ho sakta.`, vars: { u, d }, legend, panels: view(u) });
      for (const [v, w] of adj[u]) {
        const nd = d + w;
        if (nd < dist[v]) {
          const old = dist[v];
          dist[v] = nd;
          const id = `e${k++}`;
          pq.add({ u: v, d: nd, id });
          t.frame({ line: 'update', caption: `${u} → ${v}: ${d} + ${w} = ${nd} < ${show(old)} → dist[${v}] = ${nd}, PQ mein (${v}:${nd}).`, vars: { u, v, w, new: nd }, legend, panels: view(u, v, 'new', id) });
        } else {
          t.frame({ line: 'relax', caption: `${u} → ${v}: ${d} + ${w} = ${nd} ≥ ${dist[v]} → isse sasta pehle se hai, kuch nahi.`, vars: { u, v, w, new: nd }, legend, panels: view(u, v) });
        }
      }
    }
    const out = dist.map((d) => (d === INF ? -1 : d));
    t.frame({ line: 'done', caption: `PQ khaali. dist = [${out.join(', ')}] (-1 = pahunch nahi). Har edge max ek push → O((V + E) log V).`, legend, panels: view() });
    return `[${out.join(', ')}]`;
  },
});

// ---------- Example 1: Sabse sasta rasta + rasta print (directed) ----------
const P_DEFAULT = [[0, 1, 2], [0, 2, 6], [1, 2, 3], [1, 3, 8], [2, 3, 2], [2, 4, 7], [3, 4, 1], [3, 5, 6], [4, 5, 2]];
const P_POS: Pos = { 0: [0, 50], 1: [25, 0], 2: [25, 100], 3: [60, 50], 4: [75, 100], 5: [100, 30] };

export const pathTrace = tracer<{ edges: number[][]; src: number; dst: number }>({
  inputs: [
    { name: 'edges', type: 'edges', label: 'Directed u-v:cost, nodes 0..5', default: P_DEFAULT, nodes: N, maxEdges: 10, weighted: true, minW: 1, maxW: 15 },
    { name: 'src', type: 'int', label: 'src', default: 0, min: 0, max: N - 1 },
    { name: 'dst', type: 'int', label: 'dst', default: 5, min: 0, max: N - 1 },
  ],
  run({ edges, src, dst }, t) {
    const adj = buildW(N, edges, true);
    const pos = same(edges, P_DEFAULT) ? P_POS : undefined;
    const dist: number[] = Array(N).fill(INF);
    const parent: number[] = Array(N).fill(-1);
    const done: boolean[] = Array(N).fill(false);
    const pq = newPq();
    const legend = { active: 'abhi pakka', done: 'pakka', new: 'sasta hua', compare: 'destination', found: 'rasta' };
    const view = (u?: number, hot: number[] = [], path: number[] = []): Panel[] => {
      const tones: Tones = { [dst]: 'compare' };
      done.forEach((x, i) => x && (tones[i] = 'done'));
      hot.forEach((x) => (tones[x] = 'new'));
      if (u !== undefined) tones[u] = 'active';
      const et: Record<string, Tone> = {};
      parent.forEach((p, v) => p >= 0 && (et[`${p}-${v}`] = 'new'));
      path.forEach((x, i) => ((tones[x] = 'found'), i && (et[`${path[i - 1]}-${x}`] = 'found')));
      const badges: Record<number, string> = {};
      dist.forEach((d, i) => (badges[i] = show(d)));
      return [
        graphView(N, edges, { directed: true, weighted: true, pos, tones, badges, edgeTones: et, label: `${src} → ${dst}` }),
        array(parent, { label: 'parent[]', tones: Object.fromEntries(hot.map((x) => [x, 'new'])) }),
      ];
    };
    dist[src] = 0;
    pq.add({ u: src, d: 0, id: 'x' });
    t.frame({ line: 'start', caption: `How wala Dijkstra + parent[]: jab bhi v ka dist sasta ho, parent[v] = u. Directed graph — sirf arrow ki disha mein.`, legend, panels: view() });
    let found = false;
    while (pq.a.length) {
      const { u, d } = pq.poll()!;
      if (d > dist[u]) continue;
      done[u] = true;
      if (u === dst) {
        t.frame({ line: 'found', caption: `${dst} heap se nikla → distance ${d} pakki. Aage dhoondhna bekaar — ruko.`, vars: { u, d }, legend, panels: view(u) });
        found = true;
        break;
      }
      const hot: number[] = [];
      const why: string[] = [];
      for (const [v, w] of adj[u]) {
        if (d + w < dist[v]) {
          why.push(`${v}: ${show(dist[v])} → ${d + w}`);
          dist[v] = d + w;
          parent[v] = u;
          pq.add({ u: v, d: d + w, id: 'x' });
          hot.push(v);
        }
      }
      t.frame({ ...(hot.length ? { line: 'relax' } : {}), caption: `${u} pakka (${d}).${hot.length ? ` Saste hue — ${why.join(', ')}; parent = ${u}.` : ' Koi padosi sasta nahi hua.'}`, vars: { u, d }, legend, panels: view(u, hot) });
    }
    if (!found && dist[dst] === INF) {
      t.frame({ line: 'none', caption: `${dst} tak koi rasta nahi (arrows ki disha dekho).`, legend, panels: view() });
      return 'rasta nahi';
    }
    const path: number[] = [];
    for (let x = dst; x !== -1; x = parent[x]) path.push(x);
    path.reverse();
    const res = `${dist[dst]}: ${path.join(' -> ')}`;
    t.frame({ line: 'walk', caption: `parent pakad ke ${dst} se ${src} tak, phir ulta: ${path.join(' → ')}, cost ${dist[dst]}. Parent sirf "sasta hua" par badla, isliye ye sabse sasta rasta hai.`, legend, panels: view(undefined, [], path) });
    return res;
  },
});

// ---------- Example 2: Network delay time ----------
const D_DEFAULT = [[1, 2, 4], [1, 3, 1], [3, 2, 2], [2, 4, 1], [3, 5, 7], [4, 5, 3]];
const D_POS: Pos = { 1: [0, 50], 2: [40, 0], 3: [40, 100], 4: [75, 0], 5: [100, 70] };

export const delayTrace = tracer<{ times: number[][]; k: number }>({
  inputs: [
    { name: 'times', type: 'edges', label: 'Signal u-v:time (directed), nodes 1..5', default: D_DEFAULT, nodes: 5, base: 1, maxEdges: 9, weighted: true, minW: 1, maxW: 9 },
    { name: 'k', type: 'int', label: 'k (signal yahan se)', default: 1, min: 1, max: 5 },
  ],
  run({ times, k }, t) {
    const n = 5;
    const adj = buildW(n, times, true, 1);
    const pos = same(times, D_DEFAULT) ? D_POS : undefined;
    const dist: number[] = Array(n + 1).fill(INF);
    const done: boolean[] = Array(n + 1).fill(false);
    const pq = newPq();
    const legend = { active: 'signal abhi pahuncha', done: 'pahunch gaya', new: 'jaldi pahunchega', error: 'kabhi nahi', found: 'sabse late' };
    const view = (u?: number, hot: number[] = [], end?: { late?: number; lost?: number[] }): Panel[] => {
      const tones: Tones = {};
      for (let i = 1; i <= n; i++) if (done[i]) tones[i] = 'done';
      hot.forEach((x) => (tones[x] = 'new'));
      if (u !== undefined) tones[u] = 'active';
      if (end?.late !== undefined) tones[end.late] = 'found';
      end?.lost?.forEach((x) => (tones[x] = 'error'));
      const badges: Record<number, string> = {};
      for (let i = 1; i <= n; i++) badges[i] = `t=${show(dist[i])}`;
      return [
        graphView(n, times, { base: 1, directed: true, weighted: true, pos, tones, badges, label: `Signal ${k} se` }),
        pqPanel(pq.a, (e) => `${e.u}:${e.d}`),
      ];
    };
    dist[k] = 0;
    pq.add({ u: k, d: 0, id: 'x' });
    t.frame({ line: 'start', caption: `Signal node ${k} se time 0 par chala. Har node par sabse JALDI kab pahunchega = shortest path (time = weight).`, legend, panels: view() });
    while (pq.a.length) {
      const { u, d } = pq.poll()!;
      if (d > dist[u]) continue;
      done[u] = true;
      const hot: number[] = [];
      for (const [v, w] of adj[u]) if (d + w < dist[v]) (dist[v] = d + w), pq.add({ u: v, d: d + w, id: 'x' }), hot.push(v);
      t.frame({ line: hot.length ? 'relax' : 'poll', caption: `Time ${d}: signal ${u} par (pakka — isse jaldi ho hi nahi sakta).${hot.length ? ` Aage: ${hot.map((v) => `${v} ko t=${dist[v]}`).join(', ')}.` : ''}`, vars: { u, time: d }, legend, panels: view(u, hot) });
    }
    const lost: number[] = [];
    for (let i = 1; i <= n; i++) if (dist[i] === INF) lost.push(i);
    if (lost.length) {
      t.frame({ line: 'unreached', caption: `${lost.join(', ')} tak signal kabhi nahi pahuncha → -1.`, legend, panels: view(undefined, [], { lost }) });
      return '-1';
    }
    let late = 1;
    for (let i = 1; i <= n; i++) if (dist[i] > dist[late]) late = i;
    t.frame({ line: 'max', caption: `Sab tak signal tab pahunchega jab sabse late wale (${late}) tak — max = ${dist[late]}. O((V + E) log V).`, legend, panels: view(undefined, [], { late }) });
    return String(dist[late]);
  },
});

// ---------- Example 3: Path with minimum effort (grid, max-edge Dijkstra) ----------
type GEntry = { u: number; d: number; id: string; x: number; y: number };

export const effortTrace = tracer<{ h: number[][] }>({
  inputs: [{ name: 'h', type: 'intGrid', label: 'Heights', default: [[1, 2, 8], [4, 9, 3], [2, 3, 4]], maxRows: 4, maxCols: 4, min: 1, max: 9 }],
  run({ h }, t) {
    const r = h.length;
    const c = h[0].length;
    const eff: number[][] = h.map((row) => row.map(() => INF));
    const done: boolean[][] = h.map((row) => row.map(() => false));
    const par = new Map<string, string>();
    const pq = heapSim<GEntry>((a, b) => a.d < b.d);
    const legend = { active: 'abhi nikala (pakka)', done: 'pakka', new: 'effort ghata', found: 'rasta' };
    const view = (cur?: number[], hot: string[] = [], path: string[] = []): Panel[] => {
      const tones: Record<string, Tone> = {};
      done.forEach((row, i) => row.forEach((x, j) => x && (tones[`${i},${j}`] = 'done')));
      hot.forEach((k) => (tones[k] = 'new'));
      if (cur) tones[`${cur[0]},${cur[1]}`] = 'active';
      path.forEach((k) => (tones[k] = 'found'));
      const labels = { rowLabels: h.map((_, i) => String(i)), colLabels: h[0].map((_, j) => String(j)) };
      return [
        { kind: 'grid', label: 'Heights', values: h.map((row) => [...row]), tones, ...labels },
        { kind: 'grid', label: 'effort[][] (ab tak ka sabse chhota "sabse bada step")', values: eff.map((row) => row.map((e): Cell => show(e))), tones, ...labels },
      ];
    };
    eff[0][0] = 0;
    pq.add({ u: 0, d: 0, id: 'x', x: 0, y: 0 });
    t.frame({ line: 'start', caption: 'Rasta jitna mushkil, utna uska SABSE BADA step (height ka farak). Dijkstra hi lagao, bas naya effort = max(ab tak, ye step) — jodo nahi.', legend, panels: view() });
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (pq.a.length) {
      const { x, y, d: e } = pq.poll()!;
      if (e > eff[x][y]) {
        t.frame({ line: 'stale', caption: `(${x},${y}):${e} purani entry — effort[${x}][${y}] = ${eff[x][y]} pehle hi chhota. Skip.`, legend, panels: view([x, y]) });
        continue;
      }
      done[x][y] = true;
      if (x === r - 1 && y === c - 1) {
        const path: string[] = [];
        for (let k: string | undefined = `${x},${y}`; k; k = par.get(k)) path.push(k);
        t.frame({ line: 'found', caption: `Destination (${x},${y}) heap se nikli → minimum effort = ${e} pakka. (Rasta: ${path.reverse().map((k) => `(${k})`).join(' → ')}.)`, vars: { effort: e }, legend, panels: view([x, y], [], path) });
        return String(e);
      }
      const hot: string[] = [];
      const why: string[] = [];
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= r || ny < 0 || ny >= c) continue;
        const ne = Math.max(e, Math.abs(h[nx][ny] - h[x][y]));
        if (ne < eff[nx][ny]) {
          why.push(`(${nx},${ny}): max(${e}, |${h[nx][ny]} - ${h[x][y]}|) = ${ne}`);
          eff[nx][ny] = ne;
          par.set(`${nx},${ny}`, `${x},${y}`);
          pq.add({ u: 0, d: ne, id: 'x', x: nx, y: ny });
          hot.push(`${nx},${ny}`);
        }
      }
      t.frame({ line: hot.length ? 'update' : 'poll', caption: `(${x},${y}) nikla, effort ${e} pakka.${hot.length ? ` ${why.join('; ')}.` : ' Koi padosi behtar nahi hua.'}`, vars: { cell: `${x},${y}`, effort: e }, legend, panels: view([x, y], hot) });
    }
    return '0';
  },
});
