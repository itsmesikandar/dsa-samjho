import { array, graphView, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Pos = Record<number, readonly [number, number]>;
type Tones = Record<number, Tone>;
const GROUP_TONES: Tone[] = ['found', 'compare', 'swap', 'new', 'done', 'error'];

/** DSU ka jungle: har ped ka root upar, bachche neeche. Edge = child → parent */
function forest(parent: number[], base: number, opts: { tones?: Tones; label?: string; badges?: Record<number, string> } = {}): Panel {
  const ids = parent.map((_, i) => i).filter((i) => i >= base);
  const kids: number[][] = parent.map(() => []);
  const roots: number[] = [];
  ids.forEach((v) => (parent[v] === v ? roots.push(v) : kids[parent[v]].push(v)));
  const x: number[] = [];
  const depth: number[] = [];
  let leaf = 0;
  const place = (v: number, d: number) => {
    depth[v] = d;
    if (!kids[v].length) {
      x[v] = leaf++;
      return;
    }
    kids[v].forEach((c) => place(c, d + 1));
    x[v] = (x[kids[v][0]] + x[kids[v][kids[v].length - 1]]) / 2;
  };
  roots.forEach((r) => place(r, 0));
  const maxD = Math.max(0, ...ids.map((v) => depth[v]));
  const pos: Pos = {};
  ids.forEach((v) => (pos[v] = [leaf > 1 ? (x[v] / (leaf - 1)) * 100 : 50, maxD ? (depth[v] / maxD) * 100 : 50]));
  const edges = ids.filter((v) => parent[v] !== v).map((v) => [v, parent[v]]);
  return graphView(ids.length, edges, { base, directed: true, pos, tones: opts.tones, badges: opts.badges, label: opts.label ?? 'Jungle: arrow = parent (upar = leader)' });
}
/** find with path compression — raste ke nodes lautata hai (pehle wala path) */
function findPath(parent: number[], x: number): number[] {
  const path = [x];
  while (parent[path[path.length - 1]] !== path[path.length - 1]) path.push(parent[path[path.length - 1]]);
  const root = path[path.length - 1];
  path.forEach((v) => (parent[v] = root));
  return path;
}
const rootOf = (parent: number[], x: number) => {
  while (parent[x] !== x) x = parent[x];
  return x;
};
/** har node ko uske group (root) ka rang */
const groupTones = (parent: number[], base: number): Tones => {
  const order: number[] = [];
  const tones: Tones = {};
  for (let v = base; v < parent.length; v++) {
    const r = rootOf(parent, v);
    if (!order.includes(r)) order.push(r);
  }
  for (let v = base; v < parent.length; v++) {
    const r = rootOf(parent, v);
    const same = parent.some((p, i) => i >= base && i !== r && rootOf(parent, i) === r);
    if (same) tones[v] = GROUP_TONES[order.indexOf(r) % GROUP_TONES.length];
  }
  return tones;
};
/** groupTones ke rangon ka legend: "leader r ka group" */
const groupLegend = (parent: number[], base: number): Partial<Record<Tone, string>> => {
  const tones = groupTones(parent, base);
  const legend: Partial<Record<Tone, string>> = {};
  for (let v = base; v < parent.length; v++) if (tones[v] && parent[v] === v) legend[tones[v]] = `leader ${v} ka group`;
  return legend;
};

const N = 8;
const PAIRS_DEFAULT = [[0, 1], [2, 3], [0, 2], [4, 5], [3, 4], [1, 3], [6, 7]];
const pairsSpec = { name: 'pairs', type: 'edges' as const, label: 'union(a, b) jodiyan, nodes 0..7', default: PAIRS_DEFAULT, nodes: N, maxEdges: 8 };

// ---------- 3. Visual intro: dosti ke groups aur unke leader ----------
export const leadersTrace = tracer<{ pairs: number[][] }>({
  inputs: [pairsSpec],
  run({ pairs }, t) {
    const parent = Array.from({ length: N }, (_, i) => i);
    const size: number[] = Array(N).fill(1);
    const done: number[][] = [];
    const view = (cur?: number[]): Panel[] => {
      const tones = groupTones(parent, 0);
      const et: Record<string, Tone> = {};
      if (cur) et[`${cur[0]}-${cur[1]}`] = 'active';
      return [
        graphView(N, [...done, ...(cur ? [cur] : [])], { tones, edgeTones: et, label: 'Kaun kiska dost (diye gaye jode)' }),
        forest(parent, 0, { tones }),
      ];
    };
    t.frame({ legend: { active: 'abhi wali jodi' }, caption: `${N} log, sab akele — har koi khud apna leader. Sawaal baar baar aayega: "a aur b ek group mein hain?" Har group ka ek LEADER rakho: dono ka leader same → same group.`, panels: view() });
    for (const [a, b] of pairs) {
      let ra = rootOf(parent, a);
      let rb = rootOf(parent, b);
      if (ra === rb) {
        t.frame({ legend: { ...groupLegend(parent, 0), active: 'abhi wali jodi' }, caption: `${a} aur ${b}: dono ka leader ${ra} — pehle se ek group. Kuch nahi badla.`, panels: view([a, b]) });
        done.push([a, b]);
        continue;
      }
      if (size[ra] < size[rb]) [ra, rb] = [rb, ra];
      findPath(parent, a);
      findPath(parent, b);
      parent[rb] = ra;
      size[ra] += size[rb];
      done.push([a, b]);
      t.frame({ legend: { ...groupLegend(parent, 0), active: 'abhi wali jodi' }, caption: `${a} aur ${b} dost bane → unke groups milo. Chhote group ka leader ${rb} ab bade group ke leader ${ra} ke neeche. Poora group ek pal mein shift — har member ko alag se badalna nahi pada.`, panels: view([a, b]) });
    }
    const groups = parent.filter((p, i) => p === i).length;
    t.frame({ legend: groupLegend(parent, 0), caption: `${groups} groups (jitne leader). Do log same group mein? → dono ka leader dekho. Ped chhote rakhne ki tricks (size + path compression) se ye lagbhag O(1).`, panels: view() });
    return String(groups);
  },
});

// ---------- 4. How: find (path compression) + union (by size) ----------
export const dsuTrace = tracer<{ pairs: number[][] }>({
  inputs: [pairsSpec],
  run({ pairs }, t) {
    const parent = Array.from({ length: N }, (_, i) => i);
    const size: number[] = Array(N).fill(1);
    const legend = { compare: 'find ka rasta', active: 'leader (root)', found: 'naya juda', muted: 'bekaar union' };
    const view = (tones: Tones = {}, hot: number[] = []): Panel[] => [
      forest(parent, 0, { tones }),
      array(parent, { label: 'parent[]', tones: Object.fromEntries(hot.map((i) => [i, 'new'])) }),
      array(size, { label: 'size[] (sirf leader ka matlab)', tones: Object.fromEntries(parent.map((p, i) => [i, p === i ? 'done' : 'muted'])) }),
    ];
    t.frame({ caption: 'parent[i] = i: har koi apna leader. find(x) = parent pakad ke upar chalo jab tak parent[x] = x. union(a, b) = dono ke leader dhoondho, ek ko doosre ke neeche.', legend, panels: view() });
    const doFind = (x: number) => {
      const before = [...parent];
      const path = findPath(parent, x);
      const root = path[path.length - 1];
      const moved = path.slice(0, -1).filter((v) => before[v] !== root);
      if (moved.length) {
        const tones: Tones = { [root]: 'active' };
        path.slice(0, -1).forEach((v) => (tones[v] = 'compare'));
        t.frame({ line: 'find', caption: `find(${x}): ${path.join(' → ')}. Raste mein ${moved.join(', ')} ab SEEDHA leader ${root} se jude (path compression) — agli baar ek hi kadam.`, vars: { x, leader: root }, legend, panels: view(tones, moved) });
      }
      return root;
    };
    for (const [a, b] of pairs) {
      let ra = doFind(a);
      let rb = doFind(b);
      t.frame({ line: 'roots', caption: `union(${a}, ${b}): find(${a}) = ${ra}, find(${b}) = ${rb}.`, vars: { a, b, ra, rb }, legend, panels: view({ [ra]: 'active', [rb]: 'active', [a]: 'compare', [b]: 'compare' }) });
      if (ra === rb) {
        t.frame({ line: 'same', caption: `Dono ka leader ${ra} → pehle se ek group. return false (ye jodi kuch nahi jodti — graph mein ye edge cycle banati).`, vars: { a, b }, legend, panels: view({ [ra]: 'muted' }) });
        continue;
      }
      if (size[ra] < size[rb]) [ra, rb] = [rb, ra];
      parent[rb] = ra;
      size[ra] += size[rb];
      t.frame({ line: 'link', caption: `size: ${ra} ka group ${size[ra] - size[rb]}, ${rb} ka ${size[rb]} → chhota (${rb}) bade (${ra}) ke neeche. parent[${rb}] = ${ra}, size[${ra}] = ${size[ra]}. Ped gehra nahi hota.`, vars: { a, b, leader: ra }, legend, panels: view({ [ra]: 'active', [rb]: 'found' }, [rb, ra]) });
    }
    t.frame({ caption: `parent = [${parent.join(', ')}]. Size + compression ke saath har find lagbhag O(1) (α(n) ≤ 4). Bina dono ke ped linked list ban sakta hai — O(n).`, legend, panels: view() });
    return `[${parent.join(', ')}]`;
  },
});

// ---------- Example 1: Number of provinces ----------
const PROV_DEFAULT = [[0, 1], [1, 2], [3, 4]];
const PROV_POS: Pos = { 0: [0, 0], 1: [35, 30], 2: [0, 70], 3: [70, 0], 4: [100, 45], 5: [75, 100] };

export const provincesTrace = tracer<{ pairs: number[][] }>({
  inputs: [{ name: 'pairs', type: 'edges', label: 'Seedhi sadak wale shehar (a-b), shehar 0..5', default: PROV_DEFAULT, nodes: 6, maxEdges: 8 }],
  run({ pairs }, t) {
    const n = 6;
    const m: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
    for (const [a, b] of pairs) m[a][b] = m[b][a] = 1;
    const parent = Array.from({ length: n }, (_, i) => i);
    const pos = JSON.stringify(pairs) === JSON.stringify(PROV_DEFAULT) ? PROV_POS : undefined;
    let provinces = n;
    const view = (cell?: number[], hot?: Tone): Panel[] => {
      const badges: Record<number, string> = {};
      parent.forEach((_, v) => (badges[v] = `L${rootOf(parent, v)}`));
      const tones: Tones = cell && hot ? { [cell[0]]: hot, [cell[1]]: hot } : {};
      const cells: Record<string, Tone> = {};
      if (cell && hot) cells[`${cell[0]},${cell[1]}`] = hot;
      return [
        { kind: 'grid', label: 'isConnected (input matrix)', values: m.map((r) => [...r]), tones: cells, rowLabels: m.map((_, i) => String(i)), colLabels: m.map((_, i) => String(i)) },
        graphView(n, pairs, { pos, tones, badges, edgeTones: cell ? { [`${cell[0]}-${cell[1]}`]: hot } : {}, label: `Provinces: ${provinces} (badge = leader)` }),
      ];
    };
    t.frame({ line: 'init', caption: `Matrix mein 1 = seedhi sadak. Shuru mein har shehar alag province → provinces = ${n}. Matrix symmetric hai — sirf i < j (upar wala aadha) dekho.`, vars: { provinces }, panels: view() });
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (!m[i][j]) continue;
        const ri = rootOf(parent, i);
        const rj = rootOf(parent, j);
        findPath(parent, i);
        findPath(parent, j);
        if (ri !== rj) {
          parent[rj] = ri;
          provinces--;
          t.frame({ line: 'merge', caption: `[${i}][${j}] = 1: leader ${ri} ≠ ${rj} → do alag provinces jude. provinces = ${provinces}.`, vars: { i, j, provinces }, legend: { found: 'jode (alag the)' }, panels: view([i, j], 'found') });
        } else {
          t.frame({ line: 'check', caption: `[${i}][${j}] = 1, par dono ka leader ${ri} — pehle se ek province (kisi aur raste se jude). Kuch nahi ghatta.`, vars: { i, j, provinces }, legend: { muted: 'pehle se ek province' }, panels: view([i, j], 'muted') });
        }
      }
    }
    t.frame({ line: 'done', caption: `${provinces} province${provinces === 1 ? '' : 's'} = n - (safal unions). Matrix padhna O(n²), har union lagbhag O(1).`, vars: { provinces }, panels: view() });
    return String(provinces);
  },
});

// ---------- Example 2: Redundant connection ----------
const RED_DEFAULT = [[1, 2], [1, 3], [2, 4], [3, 4], [4, 5]];
const RED_POS: Pos = { 1: [50, 0], 2: [0, 45], 3: [100, 45], 4: [50, 70], 5: [50, 100] };

export const redundantTrace = tracer<{ edges: number[][] }>({
  inputs: [{ name: 'edges', type: 'edges', label: 'Edges (undirected), nodes 1..5', default: RED_DEFAULT, nodes: 5, base: 1, maxEdges: 6 }],
  run({ edges }, t) {
    const n = 5;
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const pos = JSON.stringify(edges) === JSON.stringify(RED_DEFAULT) ? RED_POS : undefined;
    const legend = { done: 'jod di (tree)', active: 'abhi wali edge', error: 'faltu — cycle', compare: 'leader' };
    const view = (k: number, cur: Tone = 'active', roots: number[] = []): Panel[] => {
      const et: Record<string, Tone> = {};
      edges.forEach((e, i) => {
        if (i < k) et[`${e[0]}-${e[1]}`] = 'done';
      });
      if (k >= 0 && k < edges.length) et[`${edges[k][0]}-${edges[k][1]}`] = cur;
      const tones: Tones = {};
      roots.forEach((r) => (tones[r] = 'compare'));
      return [
        graphView(n, edges.slice(0, k + 1), { base: 1, pos, edgeTones: et, tones, label: 'Ab tak ki edges' }),
        forest(parent, 1),
      ];
    };
    t.frame({ caption: 'Tree mein ek extra edge jodi gayi — ab ek cycle hai. Edges ko order mein jodo; jis edge ke dono sire PEHLE SE jude hain, wahi cycle poori karti hai.', legend, panels: view(-1) });
    for (let k = 0; k < edges.length; k++) {
      const [a, b] = edges[k];
      const ra = rootOf(parent, a);
      const rb = rootOf(parent, b);
      findPath(parent, a);
      findPath(parent, b);
      t.frame({ line: 'roots', caption: `Edge ${a}-${b}: find(${a}) = ${ra}, find(${b}) = ${rb}.`, vars: { a, b, ra, rb }, legend, panels: view(k, 'active', [ra, rb]) });
      if (ra === rb) {
        t.frame({ line: 'cycle', caption: `Leader same (${ra}) → ${a} se ${b} pehle hi pahunch sakte the. Ye edge faltu (cycle banati hai) → [${a}, ${b}].`, vars: { a, b }, legend, panels: view(k, 'error') });
        return `[${a}, ${b}]`;
      }
      parent[rb] = ra;
      t.frame({ line: 'merge', caption: `Alag groups → jodo: parent[${rb}] = ${ra}.`, vars: { a, b }, legend, panels: view(k, 'done') });
    }
    t.frame({ caption: 'Koi edge cycle nahi banati — sab tree ki edges. Khaali array.', legend, panels: view(edges.length) });
    return '[]';
  },
});

// ---------- Example 3: Min cost to connect all points (Kruskal) ----------
export const kruskalTrace = tracer<{ pts: number[][] }>({
  inputs: [{ name: 'pts', type: 'intGrid', label: 'Points (x y; x y; …)', default: [[0, 0], [1, 3], [4, 1], [6, 4], [2, 6]], maxRows: 6, maxCols: 2, min: 0, max: 9 }],
  check: ({ pts }) => (pts.some((r) => r.length !== 2) ? 'Har row mein do numbers: x y.' : null),
  run({ pts }, t) {
    const n = pts.length;
    const all: number[][] = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) all.push([Math.abs(pts[i][0] - pts[j][0]) + Math.abs(pts[i][1] - pts[j][1]), i, j]);
    all.sort((a, b) => a[0] - b[0]);
    const parent = Array.from({ length: n }, (_, i) => i);
    const pos: Pos = {};
    pts.forEach(([x, y], i) => (pos[i] = [(x / 9) * 100, ((9 - y) / 9) * 100]));
    const taken: number[][] = [];
    const st: Tones = {};
    let total = 0;
    const legend = { found: 'MST mein', compare: 'abhi wali edge', muted: 'chhod di (cycle)', error: 'cycle banati' };
    const view = (k: number, cur?: Tone): Panel[] => {
      const show = [...taken.map(([w, i, j]) => [i, j, w])];
      const et: Record<string, Tone> = {};
      taken.forEach(([, i, j]) => (et[`${i}-${j}`] = 'found'));
      if (k < all.length && cur) {
        show.push([all[k][1], all[k][2], all[k][0]]);
        et[`${all[k][1]}-${all[k][2]}`] = cur;
      }
      return [
        graphView(n, show, { weighted: true, pos, edgeTones: et, label: `Points (x, y) · kul kharcha ${total}` }),
        array(all.map(([w, i, j]) => `${w}:${i}-${j}`), { label: 'Saari edges, sasti pehle (cost:i-j)', pointers: k < all.length ? { e: k } : {}, tones: { ...st, ...(k < all.length && cur ? { [k]: cur } : {}) } }),
      ];
    };
    t.frame({ line: 'sort', caption: `Har do points ke beech edge, cost = |x1 - x2| + |y1 - y2|. ${all.length} edges, sasti se mehngi sort. Kruskal: sasti edge lo, bas wo do ALAG groups jode.`, legend, panels: view(all.length) });
    if (n === 1) {
      t.frame({ line: 'done', caption: 'Ek hi point — jodne ko kuch nahi, kharcha 0.', legend, panels: view(all.length) });
      return '0';
    }
    for (let k = 0; k < all.length; k++) {
      const [w, i, j] = all[k];
      const ri = rootOf(parent, i);
      const rj = rootOf(parent, j);
      if (ri === rj) {
        st[k] = 'muted';
        t.frame({ line: 'skip', caption: `${i}-${j} (${w}): dono pehle se ek group (leader ${ri}) → ye edge sirf cycle banati. Chhodo.`, vars: { cost: w, total }, legend, panels: view(k, 'error') });
        continue;
      }
      findPath(parent, i);
      findPath(parent, j);
      parent[rj] = ri;
      total += w;
      taken.push([w, i, j]);
      st[k] = 'found';
      t.frame({ line: 'take', caption: `${i}-${j} (${w}): alag groups → lo. Kul = ${total}. (${taken.length}/${n - 1} edges)`, vars: { cost: w, total }, legend, panels: view(k) });
      if (taken.length === n - 1) {
        t.frame({ line: 'done', caption: `${n - 1} edges = saare ${n} points jude (tree). Minimum kharcha ${total}. Baaki mehngi edges dekhne ki zaroorat nahi. O(n² log n) — sort ki wajah se.`, legend, panels: view(all.length) });
        break;
      }
    }
    return String(total);
  },
});
