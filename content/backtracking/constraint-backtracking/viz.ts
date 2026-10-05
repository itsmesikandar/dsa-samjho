import { listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<string, Tone>;
const key = (r: number, c: number) => `${r},${c}`;
const grid = (values: Cell[][], tones: Tones = {}, label?: string): Panel => ({ kind: 'grid', label, values: values.map((r) => [...r]), tones });

// ---------- 3. Visual intro: maze mein chooha ----------
export const mazeTrace = tracer<{ maze: number[][] }>({
  inputs: [{ name: 'maze', type: 'intGrid', label: 'Maze (1 = khula, 0 = deewar)', default: [[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]], maxRows: 4, maxCols: 4, min: 0, max: 1 }],
  check: ({ maze }) => {
    if (maze.length !== maze[0].length) return 'Square maze daalo (rows = columns).';
    const n = maze.length;
    if (!maze[0][0] || !maze[n - 1][n - 1]) return 'Shuru (0,0) aur end (n−1,n−1) khule hone chahiye.';
    return maze.flat().filter((x) => x === 1).length <= 9 ? null : 'Animation chhota rakhne ke liye max 9 khule cells.';
  },
  run({ maze }, t) {
    const n = maze.length;
    const seen = maze.map((r) => r.map(() => false));
    const paths: string[] = [];
    let path = '';
    const cells = (): Cell[][] => maze.map((r) => r.map((v) => (v ? '' : '█')));
    const tones = (cur?: [number, number], found = false): Tones => {
      const t: Tones = {};
      maze.forEach((row, r) => row.forEach((v, c) => {
        if (!v) t[key(r, c)] = 'muted';
        else if (seen[r][c]) t[key(r, c)] = found ? 'found' : 'active';
      }));
      if (cur) t[key(cur[0], cur[1])] = found ? 'found' : 'compare';
      return t;
    };
    const status = (): Panel => ({ kind: 'text', label: 'path / mile', text: `path = "${path}"\nmile: ${paths.join(', ') || '–'}` });
    const D: [number, number, string][] = [[1, 0, 'D'], [0, -1, 'L'], [0, 1, 'R'], [-1, 0, 'U']];
    const go = (r: number, c: number) => {
      if (r === n - 1 && c === n - 1) {
        seen[r][c] = true;
        paths.push(path);
        t.frame({ caption: `Manzil! Raasta "${path}". Ab wapas jaa ke doosre raaste dhoondhenge.`, legend: { found: 'raasta', muted: 'deewar' }, panels: [grid(cells(), tones([r, c], true)), status()] });
        seen[r][c] = false;
        return;
      }
      seen[r][c] = true;
      t.frame({ caption: `(${r}, ${c}) par. Is raaste mein ise mark kiya (dobara nahi aayenge). D, L, R, U try karte hain.`, legend: { active: 'is raaste par', compare: 'abhi', muted: 'deewar' }, panels: [grid(cells(), tones([r, c])), status()] });
      for (const [dr, dc, ch] of D) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= n || nc >= n || !maze[nr][nc] || seen[nr][nc]) continue;
        path += ch;
        go(nr, nc);
        path = path.slice(0, -1);
      }
      seen[r][c] = false;
      t.frame({ caption: `(${r}, ${c}) se aage koi naya raasta nahi → BACKTRACK: mark hatao, pichhle cell par wapas.`, legend: { active: 'is raaste par', muted: 'deewar' }, panels: [grid(cells(), tones()), status()] });
    };
    go(0, 0);
    return listStr(paths);
  },
});

// ---------- 4. How: N-Queens ----------
export const queensTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 4, min: 1, max: 5 }],
  run({ n }, t) {
    const qc: number[] = [];
    const cols = Array(n).fill(false);
    const d1 = Array(2 * n).fill(false);
    const d2 = Array(2 * n).fill(false);
    const res: string[][] = [];
    const board = (): Cell[][] => Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (qc[r] === c && r < qc.length ? 'Q' : '')));
    const tones = (row?: number, hot?: number, tone: Tone = 'new'): Tones => {
      const t: Tones = {};
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (r >= qc.length && (cols[c] || d1[r - c + n] || d2[r + c])) t[key(r, c)] = 'muted';
      qc.forEach((c, r) => (t[key(r, c)] = 'active'));
      if (row !== undefined && hot !== undefined) t[key(row, hot)] = tone;
      return t;
    };
    const legend = { active: 'queen', muted: 'attack mein', new: 'abhi rakhi' };
    const place = (r: number) => {
      if (r === n) {
        res.push(qc.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
        t.frame({ line: 'found', caption: `Har row mein ek queen, koi kisi ko nahi maarti → board #${res.length} mila!`, legend, panels: [grid(board(), Object.fromEntries(qc.map((c, rr) => [key(rr, c), 'found' as Tone])))] });
        return;
      }
      let tried = false;
      for (let c = 0; c < n; c++) {
        if (cols[c] || d1[r - c + n] || d2[r + c]) continue;
        tried = true;
        qc.push(c);
        cols[c] = d1[r - c + n] = d2[r + c] = true;
        t.frame({ line: 'place', caption: `Row ${r}: column ${c} safe (column, dono diagonal khaali — O(1) check). Queen rakhi. Grey = ab neeche ki rows mein attack wale cells.`, vars: { row: r, col: c, mile: res.length }, legend, panels: [grid(board(), tones(r, c))] });
        place(r + 1);
        cols[c] = d1[r - c + n] = d2[r + c] = false;
        qc.pop();
        t.frame({ line: 'remove', caption: `Row ${r} ki queen (column ${c}) uthai — agla column try.`, vars: { row: r, col: c, mile: res.length }, legend, panels: [grid(board(), tones())] });
      }
      if (!tried) t.frame({ line: 'check', caption: `Row ${r} ka har column attack mein → dead end. Pichhli row ki queen hilani padegi (backtrack).`, vars: { row: r, mile: res.length }, legend: { ...legend, error: 'dead end' }, panels: [grid(board(), { ...tones(), ...Object.fromEntries(Array.from({ length: n }, (_, c) => [key(r, c), 'error' as Tone])) })] });
    };
    place(0);
    t.frame({ line: 'found', caption: `${n}-Queens: ${res.length} boards. Har row mein ek queen (n options), par pruning se saare n^n arrangements kabhi nahi bante.`, panels: [{ kind: 'text', label: 'Boards', text: res.map((b) => b.join(' ')).join('\n') || 'koi nahi' }] });
    return listStr(res.map((b) => listStr(b)));
  },
});

// ---------- Example 1: flood fill ----------
export const floodTrace = tracer<{ image: number[][]; sr: number; sc: number; color: number }>({
  inputs: [
    { name: 'image', type: 'intGrid', label: 'Image', default: [[1, 1, 1], [1, 1, 0], [1, 0, 1]], maxRows: 5, maxCols: 5, min: 0, max: 3 },
    { name: 'sr', type: 'int', label: 'Start row', default: 1, min: 0, max: 4 },
    { name: 'sc', type: 'int', label: 'Start col', default: 1, min: 0, max: 4 },
    { name: 'color', type: 'int', label: 'Naya rang', default: 2, min: 0, max: 3 },
  ],
  check: ({ image, sr, sc }) => (sr < image.length && sc < image[0].length ? null : 'Start cell grid ke andar rakho.'),
  run({ image, sr, sc, color }, t) {
    const img = image.map((r) => [...r]);
    const old = img[sr][sc];
    const painted: Tones = {};
    if (old === color) {
      t.frame({ line: 'stop', caption: `Start ka rang pehle se ${color} — kuch nahi karna (warna "same rang wale" cells baar-baar paint hote rehte, infinite recursion).`, panels: [grid(img, { [key(sr, sc)]: 'compare' })] });
      return listStr(img.map((r) => listStr(r)));
    }
    t.frame({ line: 'stop', caption: `(${sr}, ${sc}) ka rang ${old}. Iske saath JUDE saare ${old} wale cells ko ${color} karna hai.`, panels: [grid(img, { [key(sr, sc)]: 'compare' })] });
    const fill = (r: number, c: number) => {
      if (r < 0 || c < 0 || r >= img.length || c >= img[0].length || img[r][c] !== old) return;
      img[r][c] = color;
      painted[key(r, c)] = 'found';
      t.frame({ line: 'paint', caption: `(${r}, ${c}) rang diya → ${color}. Naya rang hi "visited" ka nishaan — dobara nahi aayenge (alag set ki zaroorat nahi). Ab chaaron padosi.`, panels: [grid(img, { ...painted, [key(r, c)]: 'new' })] });
      fill(r + 1, c);
      fill(r - 1, c);
      fill(r, c + 1);
      fill(r, c - 1);
    };
    fill(sr, sc);
    t.frame({ line: 'spread', caption: `Saare jude ${old} cells ab ${color}. Har cell ek baar → O(m·n).`, panels: [grid(img, painted)] });
    return listStr(img.map((r) => listStr(r)));
  },
});

// ---------- Example 2: word search ----------
export const wordTrace = tracer<{ board: string[]; word: string }>({
  inputs: [
    { name: 'board', type: 'charGrid', label: 'Board (rows ; se)', default: ['ABCE', 'SFCS', 'ADEE'], maxRows: 3, maxCols: 4, charset: 'ABCDEFS' },
    { name: 'word', type: 'string', label: 'Word', default: 'ABCCED', minLen: 1, maxLen: 6, charset: 'ABCDEFS' },
  ],
  run({ board, word }, t) {
    const b = board.map((r) => [...r]);
    const m = b.length;
    const n = b[0].length;
    const onPath: Tones = {};
    let frames = 0;
    const status = (k: number): Panel => ({ kind: 'text', label: 'Word', text: `${word}\n${'^'.padStart(k + 1)}  (dhoondh rahe: '${word[k] ?? '✓'}')` });
    const dfs = (r: number, c: number, k: number): boolean => {
      if (k === word.length) return true;
      if (r < 0 || c < 0 || r >= m || c >= n || b[r][c] !== word[k]) return false;
      const ch = b[r][c];
      b[r][c] = '#';
      onPath[key(r, c)] = 'active';
      if (frames++ < 120) t.frame({ line: 'mark', caption: `(${r}, ${c}) = '${ch}' = word[${k}] ✓ → '#' se mark (is raaste mein dobara nahi). Ab padosiyon mein '${word[k + 1] ?? ''}' dhoondho.`, legend: { active: 'is raaste par' }, panels: [grid(b, { ...onPath, [key(r, c)]: 'new' }), status(k + 1)] });
      const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
      if (ok) return true;
      b[r][c] = ch;
      delete onPath[key(r, c)];
      if (frames++ < 120) t.frame({ line: 'unmark', caption: `(${r}, ${c}) se aage raasta nahi → '${ch}' wapas (unmark), backtrack.`, legend: { active: 'is raaste par', error: 'band gali' }, panels: [grid(b, { ...onPath, [key(r, c)]: 'error' }), status(k)] });
      return false;
    };
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (dfs(r, c, 0)) {
          t.frame({ line: 'found', caption: `"${word}" mil gaya! Neela raasta. Time O(m·n·4^L) worst (L = word length).`, legend: { active: 'raasta' }, panels: [grid(b, onPath), status(word.length)] });
          return 'true';
        }
      }
    }
    t.frame({ line: 'found', caption: `Har cell se shuru karke dekha — "${word}" nahi bana → false.`, panels: [grid(b), status(0)] });
    return 'false';
  },
});

// ---------- Example 3: 4x4 sudoku ----------
export const sudokuTrace = tracer<{ board: number[][] }>({
  inputs: [{ name: 'board', type: 'intGrid', label: '4x4 Sudoku (0 = khaali)', default: [[1, 0, 3, 0], [0, 4, 0, 2], [2, 0, 4, 0], [0, 3, 0, 1]], maxRows: 4, maxCols: 4, min: 0, max: 4 }],
  check: ({ board }) => {
    if (board.length !== 4 || board.some((r) => r.length !== 4)) return 'Exactly 4 x 4 grid daalo.';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const d = board[r][c];
      if (!d) continue;
      for (let i = 0; i < 4; i++) if ((i !== c && board[r][i] === d) || (i !== r && board[i][c] === d)) return `${d} row/column mein do baar hai.`;
      const br = r - (r % 2);
      const bc = c - (c % 2);
      for (let i = br; i < br + 2; i++) for (let j = bc; j < bc + 2; j++) if ((i !== r || j !== c) && board[i][j] === d) return `${d} ek 2x2 box mein do baar hai.`;
    }
    return null;
  },
  run({ board }, t) {
    const b = board.map((r) => [...r]);
    const given: Tones = {};
    b.forEach((row, r) => row.forEach((v, c) => v && (given[key(r, c)] = 'muted')));
    const ok = (r: number, c: number, d: number) => {
      for (let i = 0; i < 4; i++) if (b[r][i] === d || b[i][c] === d) return false;
      const br = r - (r % 2);
      const bc = c - (c % 2);
      for (let i = br; i < br + 2; i++) for (let j = bc; j < bc + 2; j++) if (b[i][j] === d) return false;
      return true;
    };
    const view = (hot: Tones = {}) => [grid(b.map((r) => r.map((v) => (v ? v : ''))), { ...given, ...hot })];
    const legend = { muted: 'diya hua', new: 'rakha', error: 'galat nikla' };
    let budget = 150; // mushkil puzzles par animation chhota rakho; solving poora chalta hai
    const frame = (line: string, caption: string, hot: Tones) => {
      if (budget-- > 0) t.frame({ line, caption, legend, panels: view(hot) });
    };
    const solve = (): boolean => {
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        if (b[r][c]) continue;
        for (let d = 1; d <= 4; d++) {
          if (!ok(r, c, d)) continue;
          b[r][c] = d;
          frame('place', `(${r}, ${c}): ${d} row, column, box mein nahi hai → rakho. Aage ke khaali cells.`, { [key(r, c)]: 'new' });
          if (solve()) return true;
          b[r][c] = 0;
          frame('undo', `(${r}, ${c}) par ${d} se aage solve nahi hua → hatao (backtrack), agla digit try.`, { [key(r, c)]: 'error' });
        }
        frame('dead', `(${r}, ${c}) mein koi digit fit nahi → pichhla faisla galat tha. Wapas.`, { [key(r, c)]: 'error' });
        return false;
      }
      return true;
    };
    const solved = solve();
    t.frame({ line: 'solved', caption: solved ? 'Koi khaali cell nahi bacha → solved! 9x9 par bhi yahi code (box = 3).' : 'Is puzzle ka koi solution nahi.', legend, panels: view() });
    return b[0].join(' ');
  },
});
