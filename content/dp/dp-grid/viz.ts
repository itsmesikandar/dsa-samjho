import { tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

type GT = Record<string, Tone>;
const grid = (values: Cell[][], tones: GT, label: string, rowLabels?: string[], colLabels?: string[]): Panel => ({
  kind: 'grid',
  label,
  values,
  tones,
  rowLabels: rowLabels ?? values.map((_, i) => String(i)),
  colLabels: colLabels ?? (values[0] ?? []).map((_, j) => String(j)),
});
const dots = (dp: (number | null)[][]): Cell[][] => dp.map((r) => r.map((v) => (v === null ? '·' : v)));

// ---------- 3. Visual intro: har rasta ginna vs DP ----------
export const pathsEnumTrace = tracer<{ m: number; n: number }>({
  inputs: [
    { name: 'm', type: 'int', label: 'rows', default: 3, min: 2, max: 3 },
    { name: 'n', type: 'int', label: 'cols', default: 3, min: 2, max: 4 },
  ],
  run({ m, n }, t) {
    const paths: string[] = [];
    const walk = (i: number, j: number, p: string) => {
      if (i === m - 1 && j === n - 1) return void paths.push(p);
      if (j + 1 < n) walk(i, j + 1, p + 'R');
      if (i + 1 < m) walk(i + 1, j, p + 'D');
    };
    walk(0, 0, '');
    const empty = (): Cell[][] => Array.from({ length: m }, () => Array(n).fill(''));
    t.frame({ caption: `${m} × ${n} grid. Upar-baayein se neeche-daayein, sirf R (daayein) ya D (neeche). Kitne raste? Pehle ek ek gin ke dekhte hain…`, panels: [grid(empty(), { '0,0': 'active', [`${m - 1},${n - 1}`]: 'compare' }, 'Grid')] });
    paths.forEach((p, k) => {
      const tones: GT = { '0,0': 'found' };
      let i = 0;
      let j = 0;
      for (const ch of p) {
        if (ch === 'R') j++;
        else i++;
        tones[`${i},${j}`] = 'found';
      }
      t.frame({ caption: `Rasta ${k + 1}: ${p.split('').join(' ')}.`, legend: { found: 'ye rasta' }, panels: [grid(empty(), tones, `Rasta ${k + 1} / ${paths.length}`)] });
    });
    const dp: number[][] = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => (i === 0 || j === 0 ? 1 : 0)));
    for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    t.frame({ caption: `Kul ${paths.length} raste — ek ek ginna bade grid par asambhav (10 × 10 = 48,620). DP: har cell = upar wale + baayein wale ke raste. Aakhri cell = ${dp[m - 1][n - 1]}. Same jawab, har cell ek baar.`, legend: { found: 'jawab' }, panels: [grid(dp, { [`${m - 1},${n - 1}`]: 'found' }, 'DP: (i, j) tak kitne raste')] });
    return String(paths.length);
  },
});

// ---------- 4. How: Unique paths ----------
export const uniqueTrace = tracer<{ m: number; n: number }>({
  inputs: [
    { name: 'm', type: 'int', label: 'rows (m)', default: 3, min: 1, max: 5 },
    { name: 'n', type: 'int', label: 'cols (n)', default: 4, min: 1, max: 6 },
  ],
  run({ m, n }, t) {
    const dp: (number | null)[][] = Array.from({ length: m }, () => Array(n).fill(null));
    const legend = { active: 'abhi', compare: 'upar / baayein', done: 'kinaara (1)' };
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    const edge: GT = {};
    for (let i = 0; i < m; i++) edge[`${i},0`] = 'done';
    for (let j = 0; j < n; j++) edge[`0,${j}`] = 'done';
    t.frame({ line: 'edge', caption: 'dp[i][j] = (i, j) tak raste. Pehli row aur pehla column: ek hi tarah pahunch sakte ho (seedha daayein / seedha neeche) → sab 1.', legend, panels: [grid(dots(dp), edge, 'dp')] });
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        dp[i][j] = dp[i - 1][j]! + dp[i][j - 1]!;
        t.frame({ line: 'cell', caption: `dp[${i}][${j}] = upar ${dp[i - 1][j]} + baayein ${dp[i][j - 1]} = ${dp[i][j]}. Aakhri kadam ya neeche tha ya daayein — dono alag raston ke group.`, vars: { i, j }, legend, panels: [grid(dots(dp), { [`${i},${j}`]: 'active', [`${i - 1},${j}`]: 'compare', [`${i},${j - 1}`]: 'compare' }, 'dp')] });
      }
    }
    t.frame({ line: 'done', caption: `${m} × ${n} grid mein ${dp[m - 1][n - 1]} raste. O(m·n) time; pichhli row se kaam chalta hai → O(n) memory bhi. (Maths: C(m + n − 2, m − 1).)`, legend: { found: 'jawab' }, panels: [grid(dots(dp), { [`${m - 1},${n - 1}`]: 'found' }, 'dp')] });
    return String(dp[m - 1][n - 1]);
  },
});

// ---------- Example 1: Unique paths II (patthar) ----------
export const obstacleTrace = tracer<{ g: number[][] }>({
  inputs: [{ name: 'g', type: 'intGrid', label: 'Grid (0 = khula, 1 = patthar)', default: [[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 0]], maxRows: 5, maxCols: 5, min: 0, max: 1 }],
  run({ g }, t) {
    const m = g.length;
    const n = g[0].length;
    const dp: (number | null)[][] = Array.from({ length: m }, () => Array(n).fill(null));
    const rocks: GT = {};
    g.forEach((r, i) => r.forEach((x, j) => x && (rocks[`${i},${j}`] = 'muted')));
    const legend = { muted: 'patthar', active: 'abhi', compare: 'upar / baayein', found: 'jawab' };
    const view = (hot: GT = {}): Panel[] => [grid(g.map((r) => r.map((x) => (x ? '#' : ''))), rocks, 'Grid (# = patthar)'), grid(dots(dp), { ...rocks, ...hot }, 'dp (raste)')];
    t.frame({ caption: 'Unique paths jaisa hi, par patthar par koi khada nahi ho sakta → wahan dp = 0, aur us se aage koi rasta nahi jaata. Kinaare ab bhi 1 nahi ho sakte (patthar ke baad 0).', legend, panels: view() });
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (g[i][j] === 1) {
          dp[i][j] = 0;
          t.frame({ line: 'rock', caption: `(${i}, ${j}) patthar → dp = 0.`, vars: { i, j }, legend, panels: view({ [`${i},${j}`]: 'error' }) });
          continue;
        }
        if (i === 0 && j === 0) {
          dp[i][j] = 1;
          t.frame({ line: 'start', caption: 'Shuruaat khuli → 1 rasta.', vars: { i, j }, legend, panels: view({ '0,0': 'active' }) });
          continue;
        }
        const up = i > 0 ? dp[i - 1][j]! : 0;
        const left = j > 0 ? dp[i][j - 1]! : 0;
        dp[i][j] = up + left;
        const hot: GT = { [`${i},${j}`]: 'active' };
        if (i > 0) hot[`${i - 1},${j}`] = rocks[`${i - 1},${j}`] ?? 'compare';
        if (j > 0) hot[`${i},${j - 1}`] = rocks[`${i},${j - 1}`] ?? 'compare';
        t.frame({ line: 'cell', caption: `dp[${i}][${j}] = upar ${up} + baayein ${left} = ${dp[i][j]}.${i === 0 || j === 0 ? ' (Grid ke bahar se 0.)' : ''}`, vars: { i, j }, legend, panels: view(hot) });
      }
    }
    t.frame({ caption: `${dp[m - 1][n - 1]} raste. O(m·n).`, legend, panels: view({ [`${m - 1},${n - 1}`]: 'found' }) });
    return String(dp[m - 1][n - 1]);
  },
});

// ---------- Example 2: Minimum path sum ----------
export const minPathTrace = tracer<{ g: number[][] }>({
  inputs: [{ name: 'g', type: 'intGrid', label: 'Kharcha grid', default: [[2, 1, 4], [3, 8, 1], [5, 2, 6], [1, 4, 3]], maxRows: 4, maxCols: 4, min: 0, max: 9 }],
  run({ g }, t) {
    const m = g.length;
    const n = g[0].length;
    const dp: (number | null)[][] = Array.from({ length: m }, () => Array(n).fill(null));
    const legend = { active: 'abhi', found: 'sasta pichhla', muted: 'mehnga pichhla' };
    const view = (hot: GT = {}, path: GT = {}): Panel[] => [grid(g, { ...path, ...hot }, 'Kharcha'), grid(dots(dp), { ...path, ...hot }, 'dp (yahan tak sabse sasta)')];
    t.frame({ caption: 'dp[i][j] = (i, j) tak ka sabse sasta rasta. Yahan aakhri kadam upar se ya baayein se — jo sasta. Phir is cell ka kharcha jodo.', legend, panels: view() });
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const hot: GT = { [`${i},${j}`]: 'active' };
        let why: string;
        let line: string;
        if (i === 0 && j === 0) {
          dp[i][j] = g[0][0];
          why = `shuruaat: ${g[0][0]}`;
          line = 'start';
        } else if (i === 0) {
          dp[i][j] = g[i][j] + dp[i][j - 1]!;
          hot[`${i},${j - 1}`] = 'found';
          why = `pehli row — sirf baayein se: ${dp[i][j - 1]} + ${g[i][j]} = ${dp[i][j]}`;
          line = 'cell';
        } else if (j === 0) {
          dp[i][j] = g[i][j] + dp[i - 1][j]!;
          hot[`${i - 1},${j}`] = 'found';
          why = `pehla column — sirf upar se: ${dp[i - 1][j]} + ${g[i][j]} = ${dp[i][j]}`;
          line = 'cell';
        } else {
          const up = dp[i - 1][j]!;
          const left = dp[i][j - 1]!;
          dp[i][j] = g[i][j] + Math.min(up, left);
          hot[`${i - 1},${j}`] = up <= left ? 'found' : 'muted';
          hot[`${i},${j - 1}`] = up <= left ? 'muted' : 'found';
          why = `min(upar ${up}, baayein ${left}) + ${g[i][j]} = ${dp[i][j]}`;
          line = 'cell';
        }
        t.frame({ line, caption: `dp[${i}][${j}]: ${why}.`, vars: { i, j }, legend, panels: view(hot) });
      }
    }
    // rasta wapas: jahan se sasta aaye
    const path: GT = {};
    for (let i = m - 1, j = n - 1; ; ) {
      path[`${i},${j}`] = 'found';
      if (i === 0 && j === 0) break;
      if (i === 0) j--;
      else if (j === 0) i--;
      else if (dp[i - 1][j]! <= dp[i][j - 1]!) i--;
      else j--;
    }
    t.frame({ line: 'done', caption: `Sabse sasta rasta = ${dp[m - 1][n - 1]} (hara rasta — peeche se 'kahan se sasta aaye' pakad ke). O(m·n); ek row ka array bhi kaafi.`, legend: { found: 'sabse sasta rasta' }, panels: view({}, path) });
    return String(dp[m - 1][n - 1]);
  },
});

// ---------- Example 3: Maximal square ----------
export const squareTrace = tracer<{ mat: string[] }>({
  inputs: [{ name: 'mat', type: 'charGrid', label: "Matrix ('0' / '1')", default: ['0111', '1111', '1111', '0110'], maxRows: 5, maxCols: 5, charset: '01' }],
  run({ mat }, t) {
    const m = mat.length;
    const n = mat[0].length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    let side = 0;
    let at = [0, 0];
    const ones: GT = {};
    mat.forEach((r, i) => [...r].forEach((ch, j) => ch === '1' && (ones[`${i},${j}`] = 'done')));
    const legend = { done: "'1'", active: 'abhi', compare: 'upar / baayein / tirchha', found: 'sabse bada square' };
    const view = (hot: GT = {}, sq: GT = {}): Panel[] => [
      grid(mat.map((r) => [...r]), { ...ones, ...sq }, 'Matrix'),
      grid(dp.slice(1).map((r) => r.slice(1)), { ...sq, ...hot }, 'dp = yahan neeche-daayan kona, sabse badi side'),
    ];
    t.frame({ caption: "dp[i][j] = (i, j) jiska NEECHE-DAAYAN kona ho, aise sabse bade '1' square ki side. '0' par 0.", legend, panels: view() });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (mat[i - 1][j - 1] !== '1') continue;
        const a = dp[i - 1][j];
        const b = dp[i][j - 1];
        const c = dp[i - 1][j - 1];
        dp[i][j] = Math.min(a, b, c) + 1;
        if (dp[i][j] > side) (side = dp[i][j]), (at = [i - 1, j - 1]);
        const hot: GT = { [`${i - 1},${j - 1}`]: 'active' };
        if (i > 1) hot[`${i - 2},${j - 1}`] = 'compare';
        if (j > 1) hot[`${i - 1},${j - 2}`] = 'compare';
        if (i > 1 && j > 1) hot[`${i - 2},${j - 2}`] = 'compare';
        t.frame({ line: 'cell', caption: `(${i - 1}, ${j - 1}) = '1': min(upar ${a}, baayein ${b}, tirchha ${c}) + 1 = ${dp[i][j]}. Teeno mein sabse chhota square hi ek line badha sakta hai.`, vars: { side }, legend, panels: view(hot) });
      }
    }
    const sq: GT = {};
    for (let i = at[0] - side + 1; i <= at[0]; i++) for (let j = at[1] - side + 1; j <= at[1]; j++) sq[`${i},${j}`] = 'found';
    t.frame({ line: 'done', caption: side ? `Sabse badi side ${side} (kona (${at[0]}, ${at[1]})) → area ${side * side}. O(m·n).` : "Koi '1' nahi → 0.", legend, panels: view({}, sq) });
    return String(side * side);
  },
});
