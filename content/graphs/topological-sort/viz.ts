import { array, graphView, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Pos = Record<number, readonly [number, number]>;
type Tones = Record<number, Tone>;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const N = 6;
const G_DEFAULT = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [5, 4]];
const G_POS: Pos = { 0: [0, 40], 1: [30, 0], 2: [30, 80], 3: [60, 40], 4: [100, 40], 5: [80, 100] };
const edgesSpec = { name: 'edges', type: 'edges' as const, label: 'Directed edges (u-v = pehle u, phir v)', default: G_DEFAULT, nodes: N, maxEdges: 9 };

/** code jaisa: edge order mein adj[u].add(v), indeg[v]++ */
function prep(n: number, edges: number[][]) {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const indeg: number[] = Array(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].push(v);
    indeg[v]++;
  }
  return { adj, indeg };
}
function kahn(n: number, edges: number[][]): number[] {
  const { adj, indeg } = prep(n, edges);
  const q: number[] = [];
  for (let v = 0; v < n; v++) if (indeg[v] === 0) q.push(v);
  for (let i = 0; i < q.length; i++) for (const v of adj[q[i]]) if (--indeg[v] === 0) q.push(v);
  return q;
}

// ---------- 3. Visual intro: nodes ek line mein — har arrow aage ki taraf ----------
export const lineupTrace = tracer<{ edges: number[][] }>({
  inputs: [edgesSpec],
  run({ edges }, t) {
    const order = kahn(N, edges);
    const top: Pos = {};
    for (let v = 0; v < N; v++) {
      if (same(edges, G_DEFAULT)) top[v] = [G_POS[v][0], G_POS[v][1] * 0.55];
      else {
        const a = (v / N) * 2 * Math.PI - Math.PI / 2;
        top[v] = [50 + 45 * Math.cos(a), 28 + 27 * Math.sin(a)];
      }
    }
    const { indeg } = prep(N, edges);
    const left = [...indeg];
    const placed: number[] = [];
    const view = (now?: number, stuck = false): Panel[] => {
      const pos: Pos = { ...top };
      placed.forEach((v, i) => (pos[v] = [N > 1 ? (i * 100) / (N - 1) : 50, 100]));
      const tones: Tones = {};
      for (let v = 0; v < N; v++) {
        if (placed.includes(v)) continue;
        if (stuck) tones[v] = 'error';
        else if (left[v] === 0) tones[v] = 'new';
      }
      placed.forEach((v) => (tones[v] = 'done'));
      if (now !== undefined) tones[now] = 'active';
      const badges: Record<number, string> = {};
      for (let v = 0; v < N; v++) if (!placed.includes(v)) badges[v] = `in ${left[v]}`;
      return [graphView(N, edges, { directed: true, pos, tones, badges, label: 'Upar: baaki kaam · Neeche: order' })];
    };
    const legend = { new: 'free (koi intezaar nahi)', active: 'abhi line mein aaya', done: 'line mein' };
    t.frame({ caption: 'Kaam aur unki shartein: u → v matlab "pehle u, phir v". Aisa order chahiye jisme har arrow AAGE ki taraf jaaye. Badge "in k" = kitne kaamon ka intezaar hai (in-degree).', legend, panels: view() });
    for (const u of order) {
      placed.push(u);
      const freed: number[] = [];
      edges.forEach(([a, b]) => a === u && --left[b] === 0 && freed.push(b));
      t.frame({ caption: `${u} line mein — iska koi intezaar baaki nahi tha.${freed.length ? ` Iske jaate hi ${freed.join(', ')} free.` : ''}`, legend, panels: view(u) });
    }
    if (order.length === N) {
      t.frame({ caption: `Sab arrows baayein se daayein! Yahi topological order: ${listStr(order)}. Ek graph ke kai sahi orders ho sakte hain (jaise free nodes mein kaun pehle).`, legend, panels: view() });
    } else {
      const stuck = Array.from({ length: N }, (_, v) => v).filter((v) => !placed.includes(v));
      t.frame({ caption: `${stuck.join(', ')} kabhi free nahi hue — ye ek doosre ka intezaar kar rahe hain (cycle). Cycle mein koi "pehla" nahi ho sakta → topological order possible nahi.`, legend: { ...legend, error: 'cycle mein phanse' }, panels: view(undefined, true) });
    }
    return listStr(order);
  },
});

// ---------- 4. How: Kahn's algorithm ----------
export const kahnTrace = tracer<{ edges: number[][] }>({
  inputs: [edgesSpec],
  run({ edges }, t) {
    const { adj, indeg } = prep(N, edges);
    const pos = same(edges, G_DEFAULT) ? G_POS : undefined;
    const queue: number[] = [];
    const order: number[] = [];
    const legend = { active: 'abhi nikala', new: 'queue mein (free)', done: 'order mein', compare: 'in-degree ghata' };
    const view = (u?: number, v?: number, vt: Tone = 'compare'): Panel[] => {
      const tones: Tones = {};
      order.forEach((x) => (tones[x] = 'done'));
      queue.forEach((x) => (tones[x] = 'new'));
      if (u !== undefined) tones[u] = 'active';
      if (v !== undefined) tones[v] = vt;
      const badges: Record<number, string> = {};
      indeg.forEach((d, x) => !order.includes(x) && x !== u && (badges[x] = `in ${d}`));
      return [
        graphView(N, edges, { directed: true, pos, tones, badges, edgeTones: u !== undefined && v !== undefined ? { [`${u}-${v}`]: vt } : {}, label: 'DAG (badge = in-degree)' }),
        { kind: 'queue', label: 'Queue (in-degree 0)', items: [...queue], ids: queue.map((x) => `q${x}`) },
        array(order, { label: 'Order', ids: order.map((x) => `o${x}`) }),
      ];
    };
    t.frame({ line: 'build', caption: `Har edge u → v: adj[u] mein v, aur indeg[v]++. In-degree = "kitne kaam pehle hone chahiye". In-degrees: ${indeg.map((d, x) => `${x}:${d}`).join(', ')}.`, legend, panels: view() });
    for (let v = 0; v < N; v++) if (indeg[v] === 0) queue.push(v);
    t.frame({ line: 'ready', caption: queue.length ? `In-degree 0 wale (${queue.join(', ')}) ka koi intezaar nahi → queue mein. Ye abhi ho sakte hain.` : 'Kisi ki in-degree 0 nahi — har node kisi ka intezaar kar raha hai. Shuru hi nahi ho sakta (cycle).', legend, panels: view() });
    while (queue.length) {
      const u = queue.shift()!;
      order.push(u);
      t.frame({ line: 'take', caption: `${u} nikala → order mein. Ab ${u} ke baad wale (${adj[u].length ? adj[u].join(', ') : 'koi nahi'}) ka ek intezaar kam hoga.`, vars: { u }, legend, panels: view(u) });
      for (const v of adj[u]) {
        indeg[v]--;
        if (indeg[v] === 0) {
          queue.push(v);
          t.frame({ line: 'free', caption: `indeg[${v}]-- → 0. ${v} ke saare "pehle" wale ho gaye → queue mein.`, vars: { u, v, indeg: 0 }, legend, panels: view(u, v, 'new') });
        } else {
          t.frame({ line: 'dec', caption: `indeg[${v}]-- → ${indeg[v]}. Abhi bhi ${indeg[v]} aur ka intezaar.`, vars: { u, v, indeg: indeg[v] }, legend, panels: view(u, v) });
        }
      }
    }
    const ok = order.length === N;
    t.frame({ line: 'check', caption: ok ? `order mein saare ${N} → topological order ${listStr(order)}. Har node ek baar queue mein, har edge ek baar → O(V + E).` : `order mein sirf ${order.length}/${N}. Bache nodes (${Array.from({ length: N }, (_, x) => x).filter((x) => !order.includes(x)).join(', ')}) ki in-degree kabhi 0 nahi hui → cycle. Khaali list.`, legend: ok ? legend : { ...legend, compare: 'phansa (cycle)' }, panels: view() });
    return ok ? listStr(order) : '[]';
  },
});

// ---------- Example 1: Course Schedule (sab ho sakte hain?) ----------
const CF_DEFAULT = [[1, 0], [2, 0], [3, 1], [3, 2]];
const CF_POS: Pos = { 0: [0, 50], 1: [50, 0], 2: [50, 100], 3: [100, 50] };

export const canFinishTrace = tracer<{ pre: number[][] }>({
  inputs: [{ name: 'pre', type: 'edges', label: 'Prerequisites (a-b = a se pehle b), courses 0..3', default: CF_DEFAULT, nodes: 4, maxEdges: 6 }],
  run({ pre }, t) {
    const n = 4;
    const arrows = pre.map(([c, p]) => [p, c]);
    const { adj, indeg } = prep(n, arrows);
    const queue: number[] = [];
    const doneList: number[] = [];
    const legend = { active: 'abhi padha', new: 'queue mein (free)', done: 'padh liya', error: 'kabhi free nahi (cycle)' };
    const view = (u?: number, stuck = false): Panel[] => {
      const tones: Tones = {};
      doneList.forEach((x) => (tones[x] = 'done'));
      queue.forEach((x) => (tones[x] = 'new'));
      if (u !== undefined) tones[u] = 'active';
      if (stuck) for (let x = 0; x < n; x++) if (!doneList.includes(x)) tones[x] = 'error';
      const badges: Record<number, string> = {};
      indeg.forEach((d, x) => !doneList.includes(x) && (badges[x] = `in ${d}`));
      return [
        graphView(n, arrows, { directed: true, pos: same(pre, CF_DEFAULT) ? CF_POS : undefined, tones, badges, label: 'Arrow: pehle → baad' }),
        { kind: 'queue', label: 'Queue', items: [...queue], ids: queue.map((x) => `q${x}`) },
      ];
    };
    t.frame({ line: 'build', caption: `[a, b] = "a se pehle b" → arrow b → a (ulta mat banana!). ${pre.length ? pre.map(([c, p]) => `${p}→${c}`).join(', ') : 'Koi shart nahi'}. In-degree = kitne pre baaki.`, legend, panels: view() });
    for (let c = 0; c < n; c++) if (indeg[c] === 0) queue.push(c);
    t.frame({ line: 'ready', caption: `Bina pre wale course: ${queue.length ? queue.join(', ') : 'koi nahi'} → queue.`, legend, panels: view() });
    while (queue.length) {
      const c = queue.shift()!;
      doneList.push(c);
      const freed: number[] = [];
      for (const nx of adj[c]) if (--indeg[nx] === 0) queue.push(nx), freed.push(nx);
      t.frame({ line: freed.length ? 'free' : 'take', caption: `Course ${c} padha (done = ${doneList.length}).${freed.length ? ` ${freed.join(', ')} ke saare pre ho gaye → queue.` : ''}`, vars: { c, done: doneList.length }, legend, panels: view(c) });
    }
    const ok = doneList.length === n;
    t.frame({ line: 'check', caption: ok ? `done = ${n} = saare courses → true. O(V + E).` : `done = ${doneList.length} < ${n}. Bache courses ek doosre ke pre ka intezaar kar rahe hain (cycle) → false.`, legend, panels: view(undefined, !ok) });
    return String(ok);
  },
});

// ---------- Example 2: Kam se kam semesters (Kahn level by level) ----------
const SEM_DEFAULT = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]];
const SEM_POS: Pos = { 0: [0, 10], 1: [0, 60], 2: [33, 35], 3: [66, 5], 4: [66, 65], 5: [100, 35], 6: [33, 100] };
const SEM_TONES: Tone[] = ['active', 'found', 'compare', 'swap', 'new', 'done', 'error'];

export const semestersTrace = tracer<{ rel: number[][] }>({
  inputs: [{ name: 'rel', type: 'edges', label: 'Relations (a-b = pehle a, phir b), courses 0..6', default: SEM_DEFAULT, nodes: 7, maxEdges: 9 }],
  run({ rel }, t) {
    const n = 7;
    const { adj, indeg } = prep(n, rel);
    const sem: number[] = Array(n).fill(0);
    let queue: number[] = [];
    let semesters = 0;
    let done = 0;
    const view = (hot: number[] = [], hotTone: Tone = 'new'): Panel[] => {
      const tones: Tones = {};
      const badges: Record<number, string> = {};
      sem.forEach((s, x) => s && ((tones[x] = SEM_TONES[(s - 1) % SEM_TONES.length]), (badges[x] = `S${s}`)));
      hot.forEach((x) => (tones[x] = hotTone));
      return [graphView(n, rel, { directed: true, pos: same(rel, SEM_DEFAULT) ? SEM_POS : undefined, tones, badges, label: `Semesters: ${semesters}` })];
    };
    const legendNow = (extra: Partial<Record<Tone, string>> = {}) => ({ ...Object.fromEntries(Array.from({ length: Math.min(semesters, SEM_TONES.length) }, (_, s) => [SEM_TONES[s], `semester ${s + 1}`])), ...extra });
    for (let c = 0; c < n; c++) if (indeg[c] === 0) queue.push(c);
    t.frame({ line: 'ready', caption: `Ek semester mein jitne chaho course, bas unke pre pehle ho chuke hon. Shuru mein free: ${queue.length ? queue.join(', ') : 'koi nahi'}.`, legend: { new: 'free (agle semester mein ho sakte)' }, panels: view(queue) });
    while (queue.length) {
      semesters++;
      const now = queue;
      now.forEach((c) => (sem[c] = semesters));
      done += now.length;
      t.frame({ line: 'sem', caption: `Semester ${semesters}: ${now.join(', ')} — queue mein jitne the, SAB ek saath (yahi level hai).`, vars: { semesters, done }, legend: legendNow(), panels: view() });
      const next: number[] = [];
      for (const c of now) for (const nx of adj[c]) if (--indeg[nx] === 0) next.push(nx);
      queue = next;
      t.frame({ line: 'free', caption: next.length ? `In ke hote hi ${next.join(', ')} ke saare pre ho gaye → semester ${semesters + 1} ke liye taiyaar.` : 'Koi naya course free nahi hua.', vars: { semesters, done }, legend: legendNow({ new: 'agle semester ke liye free' }), panels: view(next) });
    }
    const ans = done === n ? semesters : -1;
    t.frame({ line: 'check', caption: done === n ? `Saare ${n} courses ${semesters} semesters mein. Ye DAG ka sabse lamba rasta (nodes mein) hai — usse kam ho hi nahi sakta. O(V + E).` : `Sirf ${done}/${n} ho paaye — baaki cycle mein → -1.`, legend: legendNow(), panels: view() });
    return String(ans);
  },
});

// ---------- Example 3: Course Schedule II — DFS + 3 rang ----------
const COL_DEFAULT = [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3], [4, 5]];
const COL_POS: Pos = { 0: [0, 40], 1: [30, 0], 2: [30, 80], 3: [60, 40], 4: [100, 40], 5: [80, 100] };

export const colorsTrace = tracer<{ pre: number[][] }>({
  inputs: [{ name: 'pre', type: 'edges', label: 'Prerequisites (a-b = a se pehle b), courses 0..5', default: COL_DEFAULT, nodes: N, maxEdges: 9 }],
  run({ pre }, t) {
    const arrows = pre.map(([c, p]) => [p, c]);
    const { adj } = prep(N, arrows);
    const color: number[] = Array(N).fill(0);
    const post: number[] = [];
    const stack: number[] = [];
    const legend = { active: 'gray (raste par)', done: 'black (poora)', compare: 'padosi check', error: 'cycle' };
    const view = (u?: number, v?: number, vt: Tone = 'compare', cyc: number[] = []): Panel[] => {
      const tones: Tones = {};
      color.forEach((c, x) => c && (tones[x] = c === 1 ? 'active' : 'done'));
      if (v !== undefined) tones[v] = vt;
      const et: Record<string, Tone> = {};
      for (let i = 1; i < stack.length; i++) et[`${stack[i - 1]}-${stack[i]}`] = 'active';
      if (u !== undefined && v !== undefined) et[`${u}-${v}`] = vt;
      cyc.forEach((x, i) => ((tones[x] = 'error'), (et[`${x}-${cyc[(i + 1) % cyc.length]}`] = 'error')));
      return [
        graphView(N, arrows, { directed: true, pos: same(pre, COL_DEFAULT) ? COL_POS : undefined, tones, label: 'Arrow: pehle → baad' }),
        { kind: 'stack', label: 'Gray rasta (call stack)', items: [...stack], ids: stack.map((x) => `s${x}`) },
        array(post, { label: 'Postorder (black hote hi)', ids: post.map((x) => `p${x}`) }),
      ];
    };
    let cycle = false;
    const dfs = (u: number): boolean => {
      color[u] = 1;
      stack.push(u);
      t.frame({ line: 'gray', caption: `dfs(${u}): gray — ${u} abhi DFS ke raste par hai. Rasta: ${stack.join(' → ')}.`, vars: { u }, legend, panels: view() });
      for (const v of adj[u]) {
        if (color[v] === 1) {
          const cyc = stack.slice(stack.indexOf(v));
          t.frame({ line: 'cycle', caption: `${v} GRAY hai — yaani abhi ke raste par. ${u} → ${v} wapas raste par le jaata hai: ${[...cyc, v].join(' → ')}. Cycle → koi order nahi.`, vars: { u, v }, legend, panels: view(u, v, 'error', cyc) });
          return true;
        }
        if (color[v] === 2) {
          t.frame({ line: 'go', caption: `${v} black — poora ho chuka, postorder mein pehle se. Cycle nahi (alag raste se aaye), skip.`, vars: { u, v }, legend, panels: view(u, v, 'done') });
          continue;
        }
        t.frame({ line: 'go', caption: `${v} white (anchhua) → dfs(${v}).`, vars: { u, v }, legend, panels: view(u, v) });
        if (dfs(v)) return true;
      }
      color[u] = 2;
      stack.pop();
      post.push(u);
      t.frame({ line: 'black', caption: `${u} ke baad wale sab black → ${u} bhi black, postorder mein. Ulta postorder mein ${u} apne saare "baad walon" se pehle aayega.`, vars: { u }, legend, panels: view() });
      return false;
    };
    for (let c = 0; c < N && !cycle; c++) {
      if (color[c] !== 0) continue;
      t.frame({ line: 'start', caption: `Course ${c} white → yahan se DFS.`, vars: { c }, legend, panels: view() });
      cycle = dfs(c);
    }
    if (cycle) {
      t.frame({ line: 'start', caption: 'Cycle mila → khaali array. Har node, har edge ek baar → O(V + E).', legend, panels: view() });
      return '[]';
    }
    const order = [...post].reverse();
    t.frame({ line: 'done', caption: `Postorder ${listStr(post)} ulta → ${listStr(order)}. Har arrow pehle → baad ki taraf. O(V + E).`, legend, panels: view() });
    return listStr(order);
  },
});
