import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, GridPanel, Tone } from '@/components/viz/engine/types';

type Tones = Record<string, Tone>;
const grid = (values: Cell[][], tones: Tones = {}, label?: string): GridPanel => ({
  kind: 'grid',
  label,
  values: values.map((r) => [...r]),
  tones,
  rowLabels: values.map((_, r) => `r${r}`),
  colLabels: (values[0] ?? []).map((_, c) => `c${c}`),
});
const gridStr = (g: Cell[][]) => `[${g.map((r) => listStr(r)).join(', ')}]`;

// ---------- 3. Visual intro: row-major memory ----------
export const rowMajor = tracer<{ rows: number; cols: number; r: number; c: number }>({
  inputs: [
    { name: 'rows', type: 'int', label: 'Rows', default: 3, min: 1, max: 4 },
    { name: 'cols', type: 'int', label: 'Columns', default: 4, min: 1, max: 5 },
    { name: 'r', type: 'int', label: 'Kaunsi row (r)', default: 1, min: 0, max: 3 },
    { name: 'c', type: 'int', label: 'Kaunsa column (c)', default: 2, min: 0, max: 4 },
  ],
  check: ({ rows, cols, r, c }) => (r < rows && c < cols ? null : `r 0..${rows - 1} aur c 0..${cols - 1} ke beech rakho.`),
  run({ rows, cols, r, c }, t) {
    const g = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => i * cols + j));
    const rowTone = (i: number): Tone => (i % 2 === 0 ? 'active' : 'new');
    const flatTones = Object.fromEntries(g.flat().map((_, k) => [k, rowTone(Math.floor(k / cols))]));
    const gridTones: Tones = {};
    g.forEach((row, i) => row.forEach((_, j) => (gridTones[`${i},${j}`] = rowTone(i))));
    t.frame({
      caption: `2D array = ${rows} rows × ${cols} columns ka grid. Kisi cell tak pahunchne ke liye do index: grid[row][col]. Har cell mein uska number likha hai.`,
      vars: { rows, cols },
      panels: [grid(g)],
    });
    t.frame({
      caption: 'Par memory to ek LINE hai! Isliye grid ko row-by-row line mein rakhte hain: pehle poori row 0, phir row 1… Isko row-major order kehte hain.',
      vars: { rows, cols },
      panels: [grid(g, gridTones), array(g.flat(), { label: 'Memory mein (row-major)', tones: flatTones })],
    });
    const k = r * cols + c;
    t.frame({
      caption: `grid[${r}][${c}] line mein kahan hai? Pehle ${r} poori rows (${r} × ${cols} = ${r * cols} cells), phir ${c} aage → index = r × cols + c = ${k}. Isliye 2D access bhi O(1).`,
      vars: { r, c, 'r*cols+c': k },
      panels: [grid(g, { [`${r},${c}`]: 'found' }), array(g.flat(), { label: 'Memory mein (row-major)', tones: { [k]: 'found' }, pointers: { idx: k } })],
    });
    t.frame({
      caption: 'Kotlin/Java mein 2D array asal mein "array of arrays" hai — har row ek alag IntArray object. Isliye rows alag lengths ki bhi ho sakti hain (jagged), aur row-by-row padhna column-by-column se tez hota hai (cache).',
      panels: [grid(g, Object.fromEntries(Array.from({ length: cols }, (_, j) => [`${r},${j}`, 'active' as Tone])))],
    });
    return String(k);
  },
});

// ---------- 4. How: row aur column sums ----------
export const rowColSums = tracer<{ g: number[][] }>({
  inputs: [{ name: 'g', type: 'intGrid', label: 'Grid', default: [[1, 2, 3], [4, 5, 6]], maxRows: 4, maxCols: 5, min: -20, max: 20 }],
  run({ g }, t) {
    const rows = g.length;
    const cols = g[0].length;
    const rowSum = Array(rows).fill(0);
    const colSum = Array(cols).fill(0);
    t.frame({
      line: 'init',
      caption: `rowSum (${rows} dabbe) aur colSum (${cols} dabbe), sab 0. Har cell ek baar dekhenge aur dono mein jod denge.`,
      panels: [grid(g), array(rowSum, { label: 'rowSum' }), array(colSum, { label: 'colSum' })],
    });
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        rowSum[r] += g[r][c];
        colSum[c] += g[r][c];
        t.frame({
          line: 'add',
          caption: `g[${r}][${c}] = ${g[r][c]} → rowSum[${r}] = ${rowSum[r]}, colSum[${c}] = ${colSum[c]}. Bahar ka loop row badalta hai, andar ka column.`,
          vars: { r, c },
          panels: [grid(g, { [`${r},${c}`]: 'active' }), array(rowSum, { label: 'rowSum', tones: { [r]: 'new' } }), array(colSum, { label: 'colSum', tones: { [c]: 'new' } })],
        });
      }
    }
    t.frame({
      line: 'done',
      caption: `Har cell ek baar → O(rows × cols). Extra space O(rows + cols) sums ke liye.`,
      panels: [grid(g), array(rowSum, { label: 'rowSum' }), array(colSum, { label: 'colSum' })],
    });
    return listStr(rowSum);
  },
});

// ---------- Example 1: transpose ----------
export const transposeTrace = tracer<{ g: number[][] }>({
  inputs: [{ name: 'g', type: 'intGrid', label: 'Grid', default: [[1, 2, 3], [4, 5, 6]], maxRows: 4, maxCols: 4, min: -99, max: 99 }],
  run({ g }, t) {
    const rows = g.length;
    const cols = g[0].length;
    const tr: Cell[][] = Array.from({ length: cols }, () => Array(rows).fill(null));
    t.frame({
      line: 'alloc',
      caption: `Naya grid ${cols} × ${rows} (ulta shape). Rule: g[r][c] → t[c][r].`,
      panels: [grid(g, {}, `g (${rows} × ${cols})`), grid(tr, {}, `t (${cols} × ${rows})`)],
    });
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tr[c][r] = g[r][c];
        t.frame({
          line: 'copy',
          caption: `g[${r}][${c}] = ${g[r][c]} → t[${c}][${r}]. Row number column ban gaya, column number row.`,
          vars: { r, c },
          panels: [grid(g, { [`${r},${c}`]: 'active' }, `g (${rows} × ${cols})`), grid(tr, { [`${c},${r}`]: 'new' }, `t (${cols} × ${rows})`)],
        });
      }
    }
    t.frame({
      line: 'done',
      caption: `Transpose taiyaar. Pehli row ab pehla column hai. O(rows × cols) time aur space.`,
      panels: [grid(g, {}, 'g'), grid(tr, {}, 't')],
    });
    return gridStr(tr);
  },
});

// ---------- Example 2: rotate 90° in-place ----------
export const rotateTrace = tracer<{ g: number[][] }>({
  inputs: [{ name: 'g', type: 'intGrid', label: 'Square grid (n × n)', default: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], maxRows: 4, maxCols: 4, min: -99, max: 99 }],
  check: ({ g }) => (g.length === g[0].length ? null : 'Square grid chahiye — rows aur columns barabar.'),
  run({ g }, t) {
    const m = g.map((r) => [...r]);
    const n = m.length;
    t.frame({
      caption: 'Plan: (1) transpose (diagonal ke aar-paar swap), (2) har row ulti. Dono in-place — koi naya grid nahi.',
      panels: [grid(m, Object.fromEntries(Array.from({ length: n }, (_, i) => [`${i},${i}`, 'muted' as Tone])))],
    });
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
        t.frame({
          line: 'transpose',
          caption: `Swap m[${i}][${j}] ↔ m[${j}][${i}]. Sirf diagonal ke UPAR wale (j > i) — warna har pair do baar swap hokar wapas aa jaata!`,
          vars: { i, j },
          panels: [grid(m, { [`${i},${j}`]: 'swap', [`${j},${i}`]: 'swap' })],
        });
      }
    }
    t.frame({ caption: 'Transpose ho gaya. Ab har row ko ulta karna hai.', panels: [grid(m)] });
    for (let r = 0; r < n; r++) {
      let l = 0;
      let rr = n - 1;
      while (l < rr) {
        [m[r][l], m[r][rr]] = [m[r][rr], m[r][l]];
        t.frame({
          line: 'reverse',
          caption: `Row ${r}: m[${r}][${l}] ↔ m[${r}][${rr}].`,
          vars: { row: r, l, r: rr },
          panels: [grid(m, { [`${r},${l}`]: 'swap', [`${r},${rr}`]: 'swap' })],
        });
        l++;
        rr--;
      }
    }
    t.frame({
      caption: 'Ghoom gaya! Pehli row ab aakhri column hai. O(n²) time (har cell ek-do baar), O(1) extra space.',
      panels: [grid(m, Object.fromEntries(m.flatMap((row, i) => row.map((_, j) => [`${i},${j}`, 'done' as Tone]))))],
    });
    return gridStr(m);
  },
});

// ---------- Example 3: spiral order ----------
export const spiralTrace = tracer<{ g: number[][] }>({
  inputs: [{ name: 'g', type: 'intGrid', label: 'Grid', default: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], maxRows: 5, maxCols: 5, min: -99, max: 99 }],
  run({ g }, t) {
    const res: number[] = [];
    const seen: Tones = {};
    let top = 0;
    let bottom = g.length - 1;
    let left = 0;
    let right = g[0].length - 1;
    const vars = () => ({ top, bottom, left, right });
    const take = (r: number, c: number, line: string, dir: string) => {
      res.push(g[r][c]);
      t.frame({
        line,
        caption: `${dir}: g[${r}][${c}] = ${g[r][c]} liya.`,
        vars: vars(),
        panels: [grid(g, { ...seen, [`${r},${c}`]: 'active' }), array(res, { label: 'result' })],
      });
      seen[`${r},${c}`] = 'done';
    };
    t.frame({ line: 'init', caption: 'Chaar deewarein: top, bottom, left, right. Har chakkar mein ek row/column padho aur us deewar ko andar khiskao.', vars: vars(), panels: [grid(g), array(res, { label: 'result' })] });
    while (top <= bottom && left <= right) {
      for (let c = left; c <= right; c++) take(top, c, 'top', 'Upar wali row, left → right');
      top++;
      for (let r = top; r <= bottom; r++) take(r, right, 'right', 'Right column, upar → neeche');
      right--;
      if (top <= bottom) {
        for (let c = right; c >= left; c--) take(bottom, c, 'bottom', 'Neeche wali row, right → left');
        bottom--;
      }
      if (left <= right) {
        for (let r = bottom; r >= top; r--) take(r, left, 'left', 'Left column, neeche → upar');
        left++;
      }
    }
    t.frame({
      line: 'done',
      caption: `Spiral poora: ${res.length} cells, har ek ek baar → O(rows × cols). Bina \`if (top <= bottom)\` check ke single row/column waale grid mein items do baar aa jaate.`,
      vars: vars(),
      panels: [grid(g, seen), array(res, { label: 'result' })],
    });
    return listStr(res);
  },
});
