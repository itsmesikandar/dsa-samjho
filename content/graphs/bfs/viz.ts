import { array, graphView, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

type Pos = Record<number, readonly [number, number]>;
type Tones = Record<number, Tone>;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const N = 7;
const G_DEFAULT = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 6], [5, 6]];
const G_POS: Pos = { 0: [0, 50], 1: [33, 10], 2: [33, 90], 3: [66, 35], 4: [66, 100], 5: [100, 10], 6: [100, 75] };
const edgesSpec = { name: 'edges', type: 'edges' as const, label: 'Edges (undirected), nodes 0..6', default: G_DEFAULT, nodes: N, maxEdges: 10 };
/** code jaisa hi: edge order mein dono taraf add */
function buildAdj(edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: N }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}
const posFor = (edges: number[][]) => (same(edges, G_DEFAULT) ? G_POS : undefined);

// ---------- 3. Visual intro: paani mein lehrein — level by level ----------
const LEVEL_TONES: Tone[] = ['active', 'new', 'compare', 'found', 'swap', 'done', 'error'];

export const rippleTrace = tracer<{ edges: number[][]; start: number }>({
  inputs: [edgesSpec, { name: 'start', type: 'int', label: 'start', default: 0, min: 0, max: N - 1 }],
  run({ edges, start }, t) {
    const adj = buildAdj(edges);
    const pos = posFor(edges);
    const dist: number[] = Array(N).fill(-1);
    const par: number[] = Array(N).fill(-1);
    dist[start] = 0;
    const q = [start];
    while (q.length) {
      const u = q.shift()!;
      for (const v of adj[u]) if (dist[v] < 0) (dist[v] = dist[u] + 1), (par[v] = u), q.push(v);
    }
    const maxD = Math.max(...dist);
    const view = (k: number): Panel[] => {
      const tones: Tones = {};
      const badges: Record<number, string> = {};
      const et: Record<string, Tone> = {};
      dist.forEach((d, v) => {
        if (d < 0 || d > k) return;
        tones[v] = LEVEL_TONES[d % LEVEL_TONES.length];
        badges[v] = `d=${d}`;
        if (par[v] >= 0) et[`${par[v]}-${v}`] = tones[v];
      });
      return [graphView(N, edges, { pos, tones, badges, edgeTones: et, label: `BFS lehrein, start = ${start}` })];
    };
    const legendUpTo = (k: number) => Object.fromEntries(Array.from({ length: Math.min(k + 1, LEVEL_TONES.length) }, (_, d) => [LEVEL_TONES[d], `level ${d}`]));
    t.frame({ caption: `Shaant taalaab mein pathar phenko: lehrein pehle paas, phir door phailti hain. BFS bhi aise hi — start ${start} se pehle 1 kadam door wale, phir 2 kadam door wale…`, legend: legendUpTo(0), panels: view(0) });
    for (let k = 1; k <= maxD; k++) {
      const layer = dist.map((d, v) => (d === k ? v : -1)).filter((v) => v >= 0);
      t.frame({ caption: `Level ${k}: ${layer.join(', ')} — level ${k - 1} ke wo padosi jo pehle nahi dikhe. Inki distance = ${k} (pehli baar jis level mein mile, wahi sabse chhota rasta).`, legend: legendUpTo(k), panels: view(k) });
    }
    const lost = dist.map((d, v) => (d < 0 ? v : -1)).filter((v) => v >= 0);
    t.frame({ caption: `${maxD + 1} levels. Rangeen edges = har node tak pehla (sabse chhota) rasta — ye BFS tree hai.${lost.length ? ` ${lost.join(', ')} tak koi rasta nahi — lehar wahan kabhi nahi pahunchi.` : ' Sab nodes tak pahunch gaye.'}`, legend: legendUpTo(maxD), panels: view(maxD) });
    return String(maxD);
  },
});

// ---------- 4. How: BFS order (queue + visited) ----------
export const bfsTrace = tracer<{ edges: number[][]; start: number }>({
  inputs: [edgesSpec, { name: 'start', type: 'int', label: 'start', default: 0, min: 0, max: N - 1 }],
  run({ edges, start }, t) {
    const adj = buildAdj(edges);
    const pos = posFor(edges);
    const visited: boolean[] = Array(N).fill(false);
    const order: number[] = [];
    const queue: number[] = [];
    const legend = { active: 'abhi nikala (u)', compare: 'padosi check', new: 'queue mein', done: 'ho gaya' };
    const view = (u?: number, v?: number): Panel[] => {
      const tones: Tones = {};
      for (let x = 0; x < N; x++) if (visited[x]) tones[x] = queue.includes(x) ? 'new' : 'done';
      if (u !== undefined) tones[u] = 'active';
      if (v !== undefined) tones[v] = 'compare';
      const et: Record<string, Tone> = u !== undefined && v !== undefined ? { [`${u}-${v}`]: 'compare' } : {};
      return [
        graphView(N, edges, { pos, tones, edgeTones: et, label: 'Graph' }),
        { kind: 'queue', label: 'Queue (front ← → back)', items: [...queue], ids: queue.map((x) => `q${x}`) },
        array(order, { label: 'BFS order', ids: order.map((x) => `o${x}`) }),
      ];
    };
    queue.push(start);
    visited[start] = true;
    t.frame({ line: 'start', caption: `Start ${start} queue mein, aur abhi se visited. Queue = FIFO: jo pehle aaya wahi pehle niklega — isi se level by level chalta hai.`, legend, panels: view() });
    while (queue.length) {
      const u = queue.shift()!;
      order.push(u);
      t.frame({ line: 'pop', caption: `Queue ke aage se ${u} nikala → order mein. Ab ${u} ke padosi: ${listStr(adj[u])}.`, vars: { u }, legend, panels: view(u) });
      for (const v of adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
          t.frame({ line: 'mark', caption: `${v} pehli baar dikha → visited = true, queue ke peeche. Mark ABHI kiya, nikalte waqt nahi — warna ${v} queue mein do baar aa sakta.`, vars: { u, v }, legend, panels: view(u, v) });
        } else {
          t.frame({ line: 'check', caption: `${v} pehle se visited (${queue.includes(v) ? 'queue mein baitha hai' : 'ho chuka'}) → skip. Yahi check cycle mein ghoomne se bachata hai.`, vars: { u, v }, legend, panels: view(u, v) });
        }
      }
    }
    const lost = visited.map((x, i) => (x ? -1 : i)).filter((i) => i >= 0);
    t.frame({ line: 'done', caption: `Queue khaali. BFS order = ${listStr(order)}.${lost.length ? ` ${lost.join(', ')} tak rasta nahi — kabhi queue mein nahi aaye.` : ''} Har node ek baar queue mein, har edge do baar check → O(V + E).`, legend, panels: view() });
    return listStr(order);
  },
});

// ---------- Example 1: s se t ka sabse chhota rasta (dist + parent) ----------
export const shortestPathTrace = tracer<{ edges: number[][]; s: number; t: number }>({
  inputs: [
    edgesSpec,
    { name: 's', type: 'int', label: 's (shuru)', default: 0, min: 0, max: N - 1 },
    { name: 't', type: 'int', label: 't (manzil)', default: 6, min: 0, max: N - 1 },
  ],
  run({ edges, s, t: target }, t) {
    const adj = buildAdj(edges);
    const pos = posFor(edges);
    const dist: number[] = Array(N).fill(-1);
    const parent: number[] = Array(N).fill(-1);
    const queue: number[] = [];
    const legend = { active: 'abhi nikala', new: 'queue mein', done: 'ho gaya', found: 'rasta', compare: 'manzil t' };
    const view = (u?: number, hot: number[] = [], path: number[] = []): Panel[] => {
      const tones: Tones = {};
      const badges: Record<number, string> = {};
      dist.forEach((d, x) => {
        if (d < 0) return;
        tones[x] = queue.includes(x) ? 'new' : 'done';
        badges[x] = `d=${d}`;
      });
      if (!tones[target]) tones[target] = 'compare';
      if (u !== undefined) tones[u] = 'active';
      hot.forEach((x) => (tones[x] = 'new'));
      const et: Record<string, Tone> = {};
      path.forEach((x, i) => ((tones[x] = 'found'), i && (et[`${path[i - 1]}-${x}`] = 'found')));
      return [
        graphView(N, edges, { pos, tones, badges, edgeTones: et, label: `${s} → ${target}` }),
        { kind: 'queue', label: 'Queue', items: [...queue], ids: queue.map((x) => `q${x}`) },
        array(parent, { label: 'parent[] (kahan se aaye)', tones: Object.fromEntries(hot.map((x) => [x, 'new'])) }),
      ];
    };
    dist[s] = 0;
    queue.push(s);
    t.frame({ line: 'start', caption: `dist[${s}] = 0, queue = [${s}]. dist = -1 matlab abhi tak nahi pahunche — alag visited array ki zaroorat nahi. parent[] yaad rakhega "kis se pehli baar aaye" — rasta wapas banane ke liye.`, legend, panels: view() });
    while (queue.length) {
      const u = queue.shift()!;
      if (u === target) {
        t.frame({ line: 'found', caption: `${target} queue se nikla → dist[${target}] = ${dist[u]} pakki. BFS mein jo pehle nikla wo kam kadam door — isse chhota rasta ho hi nahi sakta. Ruko.`, vars: { u, dist: dist[u] }, legend, panels: view(u) });
        break;
      }
      const hot: number[] = [];
      for (const v of adj[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          parent[v] = u;
          queue.push(v);
          hot.push(v);
        }
      }
      t.frame({ line: hot.length ? 'relax' : 'pop', caption: hot.length ? `${u} nikala (d=${dist[u]}). Naye padosi ${hot.join(', ')}: dist = ${dist[u] + 1}, parent = ${u}, queue mein.` : `${u} nikala (d=${dist[u]}). Koi naya padosi nahi.`, vars: { u, dist: dist[u] }, legend, panels: view(u, hot) });
    }
    if (dist[target] === -1) {
      t.frame({ line: 'none', caption: `Queue khaali, ${target} kabhi nahi mila → koi rasta nahi, khaali list.`, legend, panels: view() });
      return '[]';
    }
    const path: number[] = [];
    for (let x = target; x !== -1; x = parent[x]) path.push(x);
    const back = path.join(' ← ');
    path.reverse();
    t.frame({ line: 'walk', caption: `${target} se parent pakad ke peeche chalo: ${back}. Ulta karo → ${listStr(path)}, ${path.length - 1} edges. O(V + E).`, legend, panels: view(undefined, [], path) });
    return listStr(path);
  },
});

// ---------- Example 2: Binary matrix mein sabse chhota rasta (grid BFS, 8 dishayein) ----------
export const matrixTrace = tracer<{ grid: number[][] }>({
  inputs: [{ name: 'grid', type: 'intGrid', label: 'Grid (0 = khula, 1 = band)', default: [[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 0]], maxRows: 5, maxCols: 5, min: 0, max: 1 }],
  run({ grid }, t) {
    const r = grid.length;
    const c = grid[0].length;
    const dist: number[][] = grid.map((row) => row.map(() => 0));
    const par = new Map<string, string>();
    const queue: number[][] = [];
    const legend = { muted: 'band (1)', active: 'abhi nikala', new: 'queue mein', done: 'pahunch gaye', found: 'rasta' };
    const view = (cur?: number[], path: string[] = []): Panel[] => {
      const tones: Record<string, Tone> = {};
      const values: Cell[][] = grid.map((row, i) => row.map((x, j) => (x ? '#' : dist[i][j] || '·')));
      grid.forEach((row, i) => row.forEach((x, j) => (x ? (tones[`${i},${j}`] = 'muted') : dist[i][j] && (tones[`${i},${j}`] = 'done'))));
      queue.forEach(([i, j]) => (tones[`${i},${j}`] = 'new'));
      if (cur) tones[`${cur[0]},${cur[1]}`] = 'active';
      path.forEach((k) => (tones[k] = 'found'));
      return [
        { kind: 'grid', label: 'Grid (number = path mein kitna cell)', values, tones, rowLabels: grid.map((_, i) => String(i)), colLabels: grid[0].map((_, j) => String(j)) },
        { kind: 'queue', label: 'Queue (row,col)', items: queue.map(([i, j]) => `${i},${j}`), ids: queue.map(([i, j]) => `q${i}-${j}`) },
      ];
    };
    if (grid[0][0] === 1 || grid[r - 1][c - 1] === 1) {
      t.frame({ line: 'blocked', caption: `${grid[0][0] === 1 ? 'Shuru ka cell (0,0)' : `Aakhri cell (${r - 1},${c - 1})`} hi band hai → rasta possible nahi, -1.`, legend, panels: view() });
      return '-1';
    }
    dist[0][0] = 1;
    queue.push([0, 0]);
    t.frame({ line: 'start', caption: `Grid = graph: har khula cell ek node, uske 8 padosi (seedhe + tirchhe) edges. (0,0) se BFS; length cells mein ginte hain to dist = 1. Manzil (${r - 1},${c - 1}).`, legend, panels: view() });
    while (queue.length) {
      const [x, y] = queue.shift()!;
      if (x === r - 1 && y === c - 1) {
        const path: string[] = [];
        for (let k: string | undefined = `${x},${y}`; k; k = par.get(k)) path.push(k);
        t.frame({ line: 'found', caption: `(${x},${y}) manzil hai, pehli baar nikli → sabse chhota rasta = ${dist[x][y]} cells. (Rasta parent se dikhaya: ${path.reverse().map((k) => `(${k})`).join(' → ')}.)`, vars: { cells: dist[x][y] }, legend, panels: view([x, y], path) });
        return String(dist[x][y]);
      }
      const pushed: string[] = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < r && ny >= 0 && ny < c && grid[nx][ny] === 0 && dist[nx][ny] === 0) {
            dist[nx][ny] = dist[x][y] + 1;
            par.set(`${nx},${ny}`, `${x},${y}`);
            queue.push([nx, ny]);
            pushed.push(`(${nx},${ny})`);
          }
        }
      }
      t.frame({ line: pushed.length ? 'push' : 'pop', caption: pushed.length ? `(${x},${y}) nikala, dist ${dist[x][y]}. 8 padosiyon mein khule + naye: ${pushed.join(' ')} → dist ${dist[x][y] + 1}, queue mein.` : `(${x},${y}) nikala, dist ${dist[x][y]}. Koi naya khula padosi nahi.`, vars: { cell: `${x},${y}`, dist: dist[x][y] }, legend, panels: view([x, y]) });
    }
    t.frame({ line: 'none', caption: `Queue khaali, manzil tak nahi pahunche → -1. Har cell max ek baar queue mein → O(r × c × 8).`, legend, panels: view() });
    return '-1';
  },
});

// ---------- Example 3: Rotting oranges (multi-source BFS) ----------
export const rottingTrace = tracer<{ grid: number[][] }>({
  inputs: [{ name: 'grid', type: 'intGrid', label: 'Grid (0 khaali, 1 taaza, 2 sada)', default: [[2, 1, 0, 2], [1, 1, 0, 1], [0, 1, 1, 1]], maxRows: 5, maxCols: 5, min: 0, max: 2 }],
  run({ grid: input }, t) {
    const grid = input.map((row) => [...row]);
    const r = grid.length;
    const c = grid[0].length;
    const legend = { error: 'sada (2)', found: 'taaza (1)', muted: 'khaali (0)', active: 'is minute phailane wale', new: 'abhi sade' };
    const view = (front: number[][] = [], fresh: number[][] = []): Panel[] => {
      const tones: Record<string, Tone> = {};
      grid.forEach((row, i) => row.forEach((x, j) => (tones[`${i},${j}`] = x === 2 ? 'error' : x === 1 ? 'found' : 'muted')));
      front.forEach(([i, j]) => (tones[`${i},${j}`] = 'active'));
      fresh.forEach(([i, j]) => (tones[`${i},${j}`] = 'new'));
      return [{ kind: 'grid', label: 'Santre', values: grid.map((row) => [...row]), tones, rowLabels: grid.map((_, i) => String(i)), colLabels: grid[0].map((_, j) => String(j)) }];
    };
    let queue: number[][] = [];
    let fresh = 0;
    grid.forEach((row, i) => row.forEach((x, j) => (x === 2 ? queue.push([i, j]) : x === 1 && fresh++)));
    t.frame({ line: 'sources', caption: `${queue.length} sade santre — SAB ek saath queue mein (multi-source). ${fresh} taaze. Ek ek source se alag BFS chalate to har baar poora grid; ek saath chalane par sab lehrein saath phailti hain.`, vars: { minutes: 0, fresh }, legend, panels: view(queue) });
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let minutes = 0;
    while (queue.length && fresh > 0) {
      minutes++;
      t.frame({ line: 'minute', caption: `Minute ${minutes}: queue mein abhi ${queue.length} sade santre — sirf yahi is minute phailayenge (queue.size pehle hi note kar liya).`, vars: { minutes, fresh }, legend, panels: view(queue) });
      const next: number[][] = [];
      for (const [x, y] of queue) {
        for (const [dx, dy] of dirs) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < r && ny >= 0 && ny < c && grid[nx][ny] === 1) {
            grid[nx][ny] = 2;
            fresh--;
            next.push([nx, ny]);
          }
        }
      }
      t.frame({ line: 'rot', caption: next.length ? `${next.map(([i, j]) => `(${i},${j})`).join(' ')} sad gaye — ye agle minute ke source. Taaze bache: ${fresh}.` : `Is minute koi naya nahi sada. Taaze bache: ${fresh}.`, vars: { minutes, fresh }, legend, panels: view([], next) });
      queue = next;
    }
    const ans = fresh === 0 ? minutes : -1;
    t.frame({ line: 'done', caption: fresh === 0 ? `Koi taaza nahi bacha → ${minutes} minute. Har cell ek baar queue mein → O(r × c).` : `Queue khaali par ${fresh} taaze bache — unke paas tak koi sada santra pahunch nahi sakta (khaali cells ki deewar) → -1.`, vars: { minutes, fresh }, legend, panels: view() });
    return String(ans);
  },
});
