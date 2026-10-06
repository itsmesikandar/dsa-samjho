import { array, graphView, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Pos = Record<number, readonly [number, number]>;
type Tones = Record<number, Tone>;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const N = 7;
const G_DEFAULT = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 6], [5, 6]];
const G_POS: Pos = { 0: [0, 50], 1: [33, 10], 2: [33, 90], 3: [66, 35], 4: [66, 100], 5: [100, 10], 6: [100, 75] };
const edgesSpec = { name: 'edges', type: 'edges' as const, label: 'Edges (undirected), nodes 0..6', default: G_DEFAULT, nodes: N, maxEdges: 10 };
const startSpec = { name: 'start', type: 'int' as const, label: 'start', default: 0, min: 0, max: N - 1 };
/** code jaisa hi: edge order mein dono taraf add */
function buildAdj(edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: N }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}
const COMP_TONES: Tone[] = ['active', 'found', 'compare', 'new', 'swap', 'error', 'done'];

// ---------- 3. Visual intro: DFS vs BFS, same graph ----------
export const versusTrace = tracer<{ edges: number[][]; start: number }>({
  inputs: [edgesSpec, startSpec],
  run({ edges, start }, t) {
    const adj = buildAdj(edges);
    const pos = same(edges, G_DEFAULT) ? G_POS : undefined;
    const dOrder: number[] = [];
    const dPar: number[] = Array(N).fill(-1);
    const seen: boolean[] = Array(N).fill(false);
    const go = (u: number) => {
      seen[u] = true;
      dOrder.push(u);
      for (const v of adj[u]) if (!seen[v]) (dPar[v] = u), go(v);
    };
    go(start);
    const level: number[] = Array(N).fill(-1);
    const bOrder = [start];
    level[start] = 0;
    for (let i = 0; i < bOrder.length; i++) for (const v of adj[bOrder[i]]) if (level[v] < 0) (level[v] = level[bOrder[i]] + 1), bOrder.push(v);
    const panel = (ord: number[], k: number, label: string, par?: number[]): Panel => {
      const tones: Tones = {};
      const badges: Record<number, string> = {};
      const et: Record<string, Tone> = {};
      ord.slice(0, k + 1).forEach((v, i) => {
        tones[v] = i === k ? 'active' : 'done';
        badges[v] = `#${i + 1}`;
        if (par && par[v] >= 0) et[`${par[v]}-${v}`] = 'active';
      });
      return graphView(N, edges, { pos, tones, badges, edgeTones: et, label });
    };
    const legend = { active: 'abhi pahuncha', done: 'pehle pahunch chuka' };
    for (let k = 0; k < dOrder.length; k++) {
      const d = dOrder[k];
      const b = bOrder[k];
      const why =
        k === 0
          ? `Dono ${start} se shuru.`
          : `DFS → ${d} (${dPar[d]} ka padosi — jahan tha wahin se aur gehre). BFS → ${b} (level ${level[b]} — pehle paas wale sab).`;
      t.frame({ caption: `#${k + 1}: ${why}`, legend, panels: [panel(dOrder, k, 'DFS — gehraai pehle', dPar), panel(bOrder, k, 'BFS — chaudai pehle')] });
    }
    t.frame({ caption: `DFS ${listStr(dOrder)} — ek raste par jitna ho sake andar, phir wapas. BFS ${listStr(bOrder)} — lehar ki tarah ring by ring. Nodes same, order alag; dono O(V + E). Neeli edges = DFS jis raaste se gaya (DFS tree).`, legend, panels: [panel(dOrder, dOrder.length - 1, 'DFS — gehraai pehle', dPar), panel(bOrder, bOrder.length - 1, 'BFS — chaudai pehle')] });
    return listStr(dOrder);
  },
});

// ---------- 4. How: recursive DFS (call stack dikhta hai) ----------
export const dfsTrace = tracer<{ edges: number[][]; start: number }>({
  inputs: [edgesSpec, startSpec],
  run({ edges, start }, t) {
    const adj = buildAdj(edges);
    const pos = same(edges, G_DEFAULT) ? G_POS : undefined;
    const visited: boolean[] = Array(N).fill(false);
    const order: number[] = [];
    const stack: number[] = [];
    const legend = { active: 'abhi yahan (stack ka top)', new: 'call stack mein (rasta)', done: 'poora (backtrack ho gaya)', compare: 'padosi check' };
    const view = (v?: number): Panel[] => {
      const tones: Tones = {};
      visited.forEach((x, i) => x && (tones[i] = 'done'));
      stack.forEach((x) => (tones[x] = 'new'));
      const top = stack[stack.length - 1];
      if (top !== undefined) tones[top] = 'active';
      const et: Record<string, Tone> = {};
      for (let i = 1; i < stack.length; i++) et[`${stack[i - 1]}-${stack[i]}`] = 'active';
      if (v !== undefined && top !== undefined) {
        tones[v] = 'compare';
        et[`${top}-${v}`] = 'compare';
      }
      return [
        graphView(N, edges, { pos, tones, edgeTones: et, label: 'Graph' }),
        { kind: 'stack', label: 'Call stack (neeche = pehli call)', items: stack.map((x) => `dfs(${x})`), ids: stack.map((x) => `s${x}`) },
        array(order, { label: 'DFS order', ids: order.map((x) => `o${x}`) }),
      ];
    };
    const go = (u: number) => {
      visited[u] = true;
      order.push(u);
      stack.push(u);
      t.frame({ line: 'enter', caption: `dfs(${u}): aate hi visited + order mein. Stack = ${stack.join(' → ')} — yahi abhi ka rasta hai.`, vars: { u }, legend, panels: view() });
      for (const v of adj[u]) {
        if (!visited[v]) {
          t.frame({ line: 'go', caption: `${u} ka padosi ${v} naya → dfs(${v}) call. ${u} yahin ruk ke intezaar karega; baaki padosi baad mein.`, vars: { u, v }, legend, panels: view(v) });
          go(v);
        } else {
          t.frame({ line: 'go', caption: `${u} ka padosi ${v} pehle se visited → skip. (Ye check na ho to cycle mein hamesha ghoomte rehte.)`, vars: { u, v }, legend, panels: view(v) });
        }
      }
      stack.pop();
      const back = stack[stack.length - 1];
      t.frame({ line: 'back', caption: `${u} ke saare padosi ho gaye → return. ${back !== undefined ? `Wapas ${back} par, wahan agla padosi dekhenge (backtrack).` : 'Stack khaali — DFS khatam.'}`, vars: { u }, legend, panels: view() });
    };
    go(start);
    const lost = visited.map((x, i) => (x ? -1 : i)).filter((i) => i >= 0);
    t.frame({ caption: `DFS order = ${listStr(order)}.${lost.length ? ` ${lost.join(', ')} tak rasta nahi — doosra component.` : ''} Har node ek baar enter, har edge do baar check → O(V + E). Stack ki gehraai = sabse lamba DFS rasta (worst O(V)).`, legend, panels: view() });
    return listStr(order);
  },
});

// ---------- Example 1: Connected components ginna ----------
const COMP_DEFAULT = [[0, 1], [1, 2], [0, 2], [3, 4], [5, 3]];
const COMP_POS: Pos = { 0: [0, 20], 1: [30, 0], 2: [20, 60], 3: [65, 15], 4: [100, 0], 5: [85, 55], 6: [45, 100] };

export const componentsTrace = tracer<{ edges: number[][] }>({
  inputs: [{ ...edgesSpec, default: COMP_DEFAULT, maxEdges: 8 }],
  run({ edges }, t) {
    const adj = buildAdj(edges);
    const pos = same(edges, COMP_DEFAULT) ? COMP_POS : undefined;
    const comp: number[] = Array(N).fill(-1);
    let count = 0;
    const view = (s?: number, hot: Tone = 'compare'): Panel[] => {
      const tones: Tones = {};
      const badges: Record<number, string> = {};
      comp.forEach((c, i) => c >= 0 && ((tones[i] = COMP_TONES[c % COMP_TONES.length]), (badges[i] = `C${c + 1}`)));
      if (s !== undefined && comp[s] < 0) tones[s] = hot;
      return [
        graphView(N, edges, { pos, tones, badges, label: `Components: ${count}` }),
        array(comp.map((c) => (c < 0 ? 'F' : 'T')), { label: 'visited', pointers: s !== undefined ? { s } : {}, tones: Object.fromEntries(comp.map((c, i) => [i, c < 0 ? undefined : 'done']).filter((e) => e[1])) }),
      ];
    };
    const legendNow = () => Object.fromEntries(Array.from({ length: Math.min(count, COMP_TONES.length) }, (_, c) => [COMP_TONES[c], `component C${c + 1}`]));
    t.frame({ caption: `${N} nodes. Plan: 0 se ${N - 1} tak har node dekho. Jo abhi tak visited nahi — wahan tak kisi pichhle DFS ka rasta nahi pahuncha → naya component. Wahan se ek DFS poora component rang dega.`, panels: view() });
    for (let s = 0; s < N; s++) {
      if (comp[s] >= 0) {
        t.frame({ line: 'skip', caption: `Node ${s} pehle se visited (C${comp[s] + 1} mein) → skip.`, vars: { s, count }, legend: legendNow(), panels: view(s) });
        continue;
      }
      count++;
      t.frame({ line: 'new', caption: `Node ${s} unvisited → count = ${count}. Iske component ka koi node pehle nahi dikha tha.`, vars: { s, count }, legend: { ...legendNow(), compare: 'naya component ka pehla node' }, panels: view(s) });
      const got: number[] = [];
      const fill = (u: number) => {
        comp[u] = count - 1;
        got.push(u);
        for (const v of adj[u]) if (comp[v] < 0) fill(v);
      };
      fill(s);
      t.frame({ line: 'fill', caption: `DFS(${s}) ne C${count} ke saare nodes visited kiye: ${got.join(', ')}. Ab inme se koi naya component nahi ginega.`, vars: { s, count }, legend: legendNow(), panels: view() });
    }
    t.frame({ line: 'done', caption: `${count} component${count > 1 ? 's' : ''}. Har node ek DFS mein ek hi baar → O(V + E). (Union-find se bhi ho sakta hai — aage ka topic.)`, legend: legendNow(), panels: view() });
    return String(count);
  },
});

// ---------- Example 2: Number of islands (grid DFS) ----------
export const islandsTrace = tracer<{ grid: string[] }>({
  inputs: [{ name: 'grid', type: 'charGrid', label: 'Grid (1 = zameen, 0 = paani)', default: ['11000', '11010', '00100', '00011'], maxRows: 5, maxCols: 5, charset: '01' }],
  run({ grid: rows }, t) {
    const g = rows.map((r) => [...r]);
    const R = g.length;
    const C = g[0].length;
    const island: number[][] = g.map((r) => r.map(() => -1));
    let count = 0;
    const legendNow = (extra: Partial<Record<Tone, string>> = {}) => ({ muted: 'paani', ...Object.fromEntries(Array.from({ length: Math.min(count, COMP_TONES.length) }, (_, k) => [COMP_TONES[k], `island ${k + 1} (dooba diya)`])), ...extra });
    const view = (cur?: number[], scan?: number[]): Panel[] => {
      const tones: Record<string, Tone> = {};
      rows.forEach((r, i) => [...r].forEach((ch, j) => (ch === '0' ? (tones[`${i},${j}`] = 'muted') : island[i][j] >= 0 && (tones[`${i},${j}`] = COMP_TONES[island[i][j] % COMP_TONES.length]))));
      if (cur) tones[`${cur[0]},${cur[1]}`] = 'swap';
      return [
        { kind: 'grid', label: `Grid · islands = ${count}${scan ? ` · scan (${scan[0]},${scan[1]})` : ''}`, values: g.map((r) => [...r]), tones, rowLabels: g.map((_, i) => String(i)), colLabels: g[0].map((_, j) => String(j)) },
      ];
    };
    t.frame({ caption: 'Grid ko upar se neeche, baayein se daayein scan karo. 1 mila = abhi tak kisi DFS ne nahi dubaya = naya island. Wahan se DFS chala ke poora tukda 0 kar do (dooba do) — 4 dishayein (tirchha nahi).', legend: legendNow(), panels: view() });
    const sink = (i: number, j: number) => {
      if (i < 0 || j < 0 || i >= R || j >= C || g[i][j] !== '1') return;
      g[i][j] = '0';
      island[i][j] = count - 1;
      t.frame({ line: 'mark', caption: `(${i},${j}) zameen → '0' kar diya (island ${count}). Ab iske 4 padosi: neeche, upar, daayein, baayein. Paani / bahar / dooba hua → wahin return.`, vars: { count, cell: `${i},${j}` }, legend: legendNow({ swap: 'abhi doob raha' }), panels: view([i, j]) });
      sink(i + 1, j);
      sink(i - 1, j);
      sink(i, j + 1);
      sink(i, j - 1);
    };
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        if (g[i][j] !== '1') continue;
        count++;
        t.frame({ line: 'found', caption: `Scan (${i},${j}) par '1' mila → island #${count}. Ab sink(${i},${j}) se poora tukda doobega.`, vars: { count, cell: `${i},${j}` }, legend: legendNow({ swap: 'naya island yahan' }), panels: view([i, j], [i, j]) });
        sink(i, j);
      }
    }
    t.frame({ line: 'done', caption: `${count} island${count === 1 ? '' : 's'}. Har cell max ek baar dooba, har ek ke 4 padosi → O(R × C). Grid khud visited bana — extra memory sirf recursion stack (worst R × C).`, legend: legendNow(), panels: view() });
    return String(count);
  },
});

// ---------- Example 3: Undirected graph mein cycle (parent wala check) ----------
const CYC_DEFAULT = [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 3], [2, 6]];
const CYC_POS: Pos = { 0: [0, 40], 1: [28, 40], 2: [40, 95], 3: [60, 15], 4: [100, 0], 5: [90, 55], 6: [75, 100] };

export const cycleTrace = tracer<{ edges: number[][] }>({
  inputs: [{ ...edgesSpec, default: CYC_DEFAULT, maxEdges: 9 }],
  run({ edges }, t) {
    const adj = buildAdj(edges);
    const pos = same(edges, CYC_DEFAULT) ? CYC_POS : undefined;
    const visited: boolean[] = Array(N).fill(false);
    const par: number[] = Array(N).fill(-1);
    const stack: number[] = [];
    const legend = { active: 'abhi yahan', new: 'stack mein (rasta)', done: 'poora ho gaya', compare: 'padosi check', muted: 'parent (skip)', error: 'cycle' };
    const view = (v?: number, vt: Tone = 'compare', cyc: number[] = []): Panel[] => {
      const tones: Tones = {};
      visited.forEach((x, i) => x && (tones[i] = 'done'));
      stack.forEach((x) => (tones[x] = 'new'));
      const top = stack[stack.length - 1];
      if (top !== undefined) tones[top] = 'active';
      const et: Record<string, Tone> = {};
      for (let i = 1; i < stack.length; i++) et[`${stack[i - 1]}-${stack[i]}`] = 'new';
      if (v !== undefined && top !== undefined) {
        tones[v] = vt;
        et[`${top}-${v}`] = vt;
      }
      cyc.forEach((x, i) => ((tones[x] = 'error'), (et[`${x}-${cyc[(i + 1) % cyc.length]}`] = 'error')));
      return [
        graphView(N, edges, { pos, tones, edgeTones: et, label: 'Graph' }),
        { kind: 'stack', label: 'Call stack: dfs(u, parent)', items: stack.map((x) => `${x} (p=${par[x] < 0 ? '-' : par[x]})`), ids: stack.map((x) => `s${x}`) },
      ];
    };
    let found = false;
    const go = (u: number, p: number): boolean => {
      visited[u] = true;
      par[u] = p;
      stack.push(u);
      t.frame({ line: 'enter', caption: `dfs(${u}, parent = ${p < 0 ? 'koi nahi' : p}). Visited mark.`, vars: { u, parent: p }, legend, panels: view() });
      for (const v of adj[u]) {
        if (v === p) {
          t.frame({ line: 'parent', caption: `${v} = parent — isi edge se to aaye the. Undirected mein ye edge dono taraf dikhti hai; ise cycle mat samjho → skip.`, vars: { u, v, parent: p }, legend, panels: view(v, 'muted') });
          continue;
        }
        if (visited[v]) {
          let cyc: number[];
          const at = stack.indexOf(v);
          if (at >= 0) cyc = stack.slice(at);
          else {
            cyc = [];
            for (let x = v; x !== u && x >= 0; x = par[x]) cyc.push(x);
            cyc.push(u);
          }
          t.frame({ line: 'cycle', caption: `${v} pehle se visited, aur parent NAHI → ${v} tak doosre raste se bhi pahunch gaye. Cycle: ${[...cyc, cyc[0]].join(' → ')}. return true.`, vars: { u, v, parent: p }, legend, panels: view(v, 'error', cyc) });
          found = true;
          return true;
        }
        t.frame({ line: 'go', caption: `${v} naya → dfs(${v}, parent = ${u}).`, vars: { u, v, parent: p }, legend, panels: view(v) });
        if (go(v, u)) return true;
      }
      stack.pop();
      t.frame({ line: 'back', caption: `${u} ke padosiyon mein cycle nahi → return false, wapas ${stack.length ? stack[stack.length - 1] : 'loop'} par.`, vars: { u }, legend, panels: view() });
      return false;
    };
    for (let s = 0; s < N && !found; s++) {
      if (visited[s]) continue;
      t.frame({ line: 'start', caption: `Node ${s} unvisited → naya component, yahan se DFS. (Har component alag check karna padta hai — cycle kisi bhi hisse mein ho sakta hai.)`, vars: { s }, legend, panels: view() });
      go(s, -1);
    }
    if (found) {
      t.frame({ caption: 'Cycle mila → true. Har node ek baar, har edge max do baar → O(V + E).', legend, panels: view() });
      return 'true';
    }
    t.frame({ line: 'none', caption: 'Saare components dekhe, kahin "visited + parent nahi" wala padosi nahi mila → koi cycle nahi, false. (Har component ek tree hai — forest.)', legend, panels: view() });
    return 'false';
  },
});
