import { array, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

type GT = Record<string, Tone>;
const chars = (s: string) => s.split('');

/** do strings ki table: row 0 / col 0 = khaali prefix (∅), phir har char */
const table = (dp: (number | null)[][], a: string, b: string, label: string, tones: GT = {}): Panel => ({
  kind: 'grid',
  label,
  values: dp.map((r) => r.map((v): Cell => (v === null ? '·' : v))),
  tones,
  rowLabels: ['∅', ...chars(a)],
  colLabels: ['∅', ...chars(b)],
  corner: 'a\\b',
});

function lcsTable(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0) as number[]);
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp;
}

// ---------- 3. Visual intro: har subsequence try karo ----------
export const subseqEnumTrace = tracer<{ a: string; b: string }>({
  inputs: [
    { name: 'a', type: 'string', label: 'a', default: 'chai', minLen: 1, maxLen: 4 },
    { name: 'b', type: 'string', label: 'b', default: 'achar', minLen: 1, maxLen: 6 },
  ],
  run({ a, b }, t) {
    const n = a.length;
    const masks = Array.from({ length: (1 << n) - 1 }, (_, k) => k + 1).sort((x, y) => {
      const c = (m: number) => m.toString(2).split('1').length - 1;
      return c(x) - c(y) || x - y;
    });
    t.frame({ caption: `Subsequence = kuch chars hata do, baaki ka ORDER wahi (gap chalega). "${a}" ke ${2 ** n - 1} subsequences hain. Har ek ko "${b}" mein dhoondo — sabse lamba jo dono mein ho = LCS.`, panels: [array(chars(a), { label: 'a' }), array(chars(b), { label: 'b' })] });
    let best = '';
    for (const m of masks) {
      const pick = Array.from({ length: n }, (_, i) => i).filter((i) => (m >> (n - 1 - i)) & 1);
      const sub = pick.map((i) => a[i]).join('');
      const at: number[] = [];
      let j = 0;
      for (const ch of sub) {
        while (j < b.length && b[j] !== ch) j++;
        if (j === b.length) break;
        at.push(j++);
      }
      const ok = at.length === sub.length;
      const nb = ok && sub.length > best.length;
      if (nb) best = sub;
      t.frame({ caption: ok ? `"${sub}" — b mein bhi isi order mein mila.${nb ? ' Ab tak ka sabse lamba!' : ''}` : `"${sub}" — b mein is order mein nahi mila.`, vars: { best: best ? `"${best}"` : '—' }, legend: { new: 'chuna', found: 'b mein mila', error: 'nahi mila' }, panels: [array(chars(a), { label: 'a', tones: Object.fromEntries(pick.map((i) => [i, 'new' as Tone])) }), array(chars(b), { label: 'b', tones: ok ? Object.fromEntries(at.map((i) => [i, 'found' as Tone])) : Object.fromEntries(at.map((i) => [i, 'error' as Tone])) })] });
    }
    t.frame({ caption: `LCS = "${best}" (${best.length}). Par 20 chars ki string ke 10 lakh se zyada subsequences! Behtar: chhote sawaal — "a ke pehle i chars aur b ke pehle j chars ka LCS". Sirf (m + 1) × (n + 1) aise sawaal → table.`, legend: { found: 'LCS' }, panels: [array(chars(a), { label: 'a' }), array(chars(b), { label: 'b' })] });
    return String(best.length);
  },
});

// ---------- 4. How: LCS table ----------
export const lcsTrace = tracer<{ a: string; b: string }>({
  inputs: [
    { name: 'a', type: 'string', label: 'a', default: 'khana', minLen: 1, maxLen: 7 },
    { name: 'b', type: 'string', label: 'b', default: 'kahani', minLen: 1, maxLen: 8 },
  ],
  run({ a, b }, t) {
    const m = a.length;
    const n = b.length;
    const dp: (number | null)[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 || j === 0 ? 0 : null)));
    const label = 'dp[i][j] = a ke pehle i, b ke pehle j chars ka LCS';
    const legend = { active: 'abhi', new: 'match: tirchha + 1', found: 'jeeta', muted: 'haara' };
    t.frame({ caption: 'Row 0 aur column 0 = khaali string (∅) — kisi ke saath LCS 0. Har cell (i, j): a ka i-th aur b ka j-th char — dono aakhri chars dekho.', legend, panels: [table(dp, a, b, label)] });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const x = a[i - 1];
        const y = b[j - 1];
        if (x === y) {
          dp[i][j] = dp[i - 1][j - 1]! + 1;
          t.frame({ line: 'match', caption: `'${x}' = '${y}' → dono LCS mein: tirchha ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}.`, vars: { i, j }, legend, panels: [table(dp, a, b, label, { [`${i},${j}`]: 'active', [`${i - 1},${j - 1}`]: 'new' })] });
        } else {
          const up = dp[i - 1][j]!;
          const left = dp[i][j - 1]!;
          dp[i][j] = Math.max(up, left);
          t.frame({ line: 'skip', caption: `'${x}' ≠ '${y}' → ek chhodna padega: upar ${up} ('${x}' chhodo) ya baayein ${left} ('${y}' chhodo). Max = ${dp[i][j]}.`, vars: { i, j }, legend, panels: [table(dp, a, b, label, { [`${i},${j}`]: 'active', [`${i - 1},${j}`]: up >= left ? 'found' : 'muted', [`${i},${j - 1}`]: up >= left ? 'muted' : 'found' })] });
        }
      }
    }
    const path: GT = {};
    let s = '';
    let i = m;
    let j = n;
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) (path[`${i},${j}`] = 'new'), (s = a[i - 1] + s), i--, j--;
      else (path[`${i},${j}`] = 'found'), dp[i - 1][j]! >= dp[i][j - 1]! ? i-- : j--;
    }
    t.frame({ line: 'done', caption: `LCS = ${dp[m][n]}${s ? ` ("${s}")` : ''}. String chahiye to (${m}, ${n}) se peeche: match par tirchha (char lo), warna jidhar se bada aaya. O(m × n).`, legend: { new: 'LCS ka char', found: 'raasta' }, panels: [table(dp, a, b, label, path)] });
    return String(dp[m][n]);
  },
});

// ---------- Example 1: Longest common substring ----------
export const substrTrace = tracer<{ a: string; b: string }>({
  inputs: [
    { name: 'a', type: 'string', label: 'a', default: 'pakoda', minLen: 1, maxLen: 7 },
    { name: 'b', type: 'string', label: 'b', default: 'pakora', minLen: 1, maxLen: 7 },
  ],
  run({ a, b }, t) {
    const m = a.length;
    const n = b.length;
    const dp: (number | null)[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 || j === 0 ? 0 : null)));
    const label = 'dp[i][j] = a[i−1] aur b[j−1] par KHATAM hone wala common substring';
    let best = 0;
    let at = [0, 0];
    t.frame({ caption: 'Substring = lagaataar chars (gap nahi). LCS jaisa table, par cell ka matlab badla: "yahin khatam hone wala" common hissa. Match → tirchha + 1, mismatch → 0 (silsila toota).', panels: [table(dp, a, b, label)] });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]! + 1;
          const nb = dp[i][j]! > best;
          if (nb) (best = dp[i][j]!), (at = [i, j]);
          t.frame({ line: 'match', caption: `'${a[i - 1]}' = '${b[j - 1]}' → tirchha ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}.${nb ? ` Naya best: "${a.slice(i - best, i)}".` : ''}`, vars: { i, j, best }, legend: { active: 'abhi', new: 'tirchha' }, panels: [table(dp, a, b, label, { [`${i},${j}`]: 'active', [`${i - 1},${j - 1}`]: 'new' })] });
        } else {
          dp[i][j] = 0;
          t.frame({ line: 'reset', caption: `'${a[i - 1]}' ≠ '${b[j - 1]}' → yahan khatam hone wala koi common substring nahi: 0.`, vars: { i, j, best }, legend: { active: 'abhi' }, panels: [table(dp, a, b, label, { [`${i},${j}`]: 'active' })] });
        }
      }
    }
    const run: GT = {};
    for (let k = 0; k < best; k++) run[`${at[0] - k},${at[1] - k}`] = 'found';
    const l = lcsTable(a, b)[m][n];
    t.frame({ line: 'done', caption: best ? `Sabse lamba common substring "${a.slice(at[0] - best, at[0])}" = ${best} (tirchhi line). LCS (gap allowed) yahan ${l} hota${l > best ? ' — substring mein lagaataar chahiye, isliye chhota' : ''}. O(m × n).` : `Koi common char nahi → 0. O(m × n).`, legend: { found: 'substring' }, panels: [table(dp, a, b, label, run)] });
    return String(best);
  },
});

// ---------- Example 2: Longest palindromic subsequence (interval DP) ----------
export const lpsTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 's', default: 'tamatar', minLen: 1, maxLen: 8 }],
  run({ s }, t) {
    const n = s.length;
    const dp: (number | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));
    const view = (tones: GT = {}): Panel[] => [{ kind: 'grid', label: 'dp[i][j] = s[i..j] ka sabse lamba palindromic subsequence', values: dp.map((r, i) => r.map((v, j): Cell => (j < i ? '' : v === null ? '·' : v))), tones, rowLabels: chars(s).map((c, i) => `${i} ${c}`), colLabels: chars(s).map((c, j) => `${j} ${c}`), corner: 'i\\j' }];
    for (let i = 0; i < n; i++) dp[i][i] = 1;
    t.frame({ line: 'one', caption: 'Ek akshar khud palindrome → diagonal 1. Ab tukde ki length 2, 3, … badhao — bada tukda hamesha chhote andar wale tukdon se banta hai.', legend: { found: 'length 1' }, panels: view(Object.fromEntries(Array.from({ length: n }, (_, i) => [`${i},${i}`, 'found' as Tone]))) });
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i + len - 1 < n; i++) {
        const j = i + len - 1;
        if (s[i] === s[j]) {
          const inner = len === 2 ? 0 : dp[i + 1][j - 1]!;
          dp[i][j] = inner + 2;
          t.frame({ line: 'match', caption: `s[${i}..${j}]: kinaare '${s[i]}' = '${s[j]}' → andar wala ${inner} + 2 = ${dp[i][j]}.`, vars: { len, i, j }, legend: { active: 'abhi', new: 'andar wala' }, panels: view(len === 2 ? { [`${i},${j}`]: 'active' } : { [`${i},${j}`]: 'active', [`${i + 1},${j - 1}`]: 'new' }) });
        } else {
          const lo = dp[i + 1][j]!;
          const hi = dp[i][j - 1]!;
          dp[i][j] = Math.max(lo, hi);
          t.frame({ line: 'skip', caption: `s[${i}..${j}]: '${s[i]}' ≠ '${s[j]}' → ek kinaara chhodo: '${s[i]}' hatao → ${lo}, '${s[j]}' hatao → ${hi}. Max = ${dp[i][j]}.`, vars: { len, i, j }, legend: { active: 'abhi', found: 'jeeta', muted: 'haara' }, panels: view({ [`${i},${j}`]: 'active', [`${i + 1},${j}`]: lo >= hi ? 'found' : 'muted', [`${i},${j - 1}`]: lo >= hi ? 'muted' : 'found' }) });
        }
      }
    }
    let i = 0;
    let j = n - 1;
    let left = '';
    let mid = '';
    while (i <= j) {
      if (i === j) {
        mid = s[i];
        break;
      }
      if (s[i] === s[j]) (left += s[i]), i++, j--;
      else if (dp[i + 1][j]! >= dp[i][j - 1]!) i++;
      else j--;
    }
    const pal = left + mid + left.split('').reverse().join('');
    t.frame({ line: 'done', caption: `Jawab dp[0][${n - 1}] = ${dp[0][n - 1]} ("${pal}"). Tukde O(n²), har ek O(1) → O(n²). Doosra tareeka: LCS(s, ulta s) — wahi jawab.`, legend: { found: 'jawab' }, panels: view({ [`0,${n - 1}`]: 'found' }) });
    return String(dp[0][n - 1]);
  },
});

// ---------- Example 3: Edit distance ----------
export const editTrace = tracer<{ a: string; b: string }>({
  inputs: [
    { name: 'a', type: 'string', label: 'a (ise badlo)', default: 'paneer', minLen: 1, maxLen: 7 },
    { name: 'b', type: 'string', label: 'b (ye banana hai)', default: 'pani', minLen: 1, maxLen: 7 },
  ],
  run({ a, b }, t) {
    const m = a.length;
    const n = b.length;
    const dp: (number | null)[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : null)));
    const label = 'dp[i][j] = a ke pehle i ko b ke pehle j banane ke kam se kam operations';
    t.frame({ line: 'base', caption: `Row 0: khaali a se b ke j chars → j INSERT. Column 0: a ke i chars se khaali → i DELETE. Ab har cell par aakhri chars dekho.`, legend: { found: 'base' }, panels: [table(dp, a, b, label, Object.fromEntries([...Array.from({ length: m + 1 }, (_, i) => `${i},0`), ...Array.from({ length: n + 1 }, (_, j) => `0,${j}`)].map((k) => [k, 'found' as Tone])))] });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          t.frame({ line: 'same', caption: `'${a[i - 1]}' = '${b[j - 1]}' → kuch nahi karna: tirchha ${dp[i][j]}.`, vars: { i, j }, legend: { active: 'abhi', new: 'tirchha' }, panels: [table(dp, a, b, label, { [`${i},${j}`]: 'active', [`${i - 1},${j - 1}`]: 'new' })] });
          continue;
        }
        const del = dp[i - 1][j]!;
        const ins = dp[i][j - 1]!;
        const rep = dp[i - 1][j - 1]!;
        const best = Math.min(del, ins, rep);
        dp[i][j] = best + 1;
        const tone = (v: number): Tone => (v === best ? 'found' : 'muted');
        t.frame({ line: 'op', caption: `'${a[i - 1]}' ≠ '${b[j - 1]}' → 1 + min(delete '${a[i - 1]}' ↑ ${del}, insert '${b[j - 1]}' ← ${ins}, replace ↖ ${rep}) = ${dp[i][j]}.`, vars: { i, j }, legend: { active: 'abhi', found: 'sabse sasta', muted: 'option' }, panels: [table(dp, a, b, label, { [`${i - 1},${j}`]: tone(del), [`${i},${j - 1}`]: tone(ins), [`${i - 1},${j - 1}`]: tone(rep), [`${i},${j}`]: 'active' })] });
      }
    }
    const ops: string[] = [];
    const path: GT = {};
    let i = m;
    let j = n;
    while (i > 0 || j > 0) {
      path[`${i},${j}`] = 'found';
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && dp[i][j] === dp[i - 1][j - 1]) i--, j--;
      else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1]! + 1) ops.unshift(`'${a[i - 1]}' → '${b[j - 1]}'`), i--, j--;
      else if (i > 0 && dp[i][j] === dp[i - 1][j]! + 1) ops.unshift(`'${a[i - 1]}' hatao`), i--;
      else ops.unshift(`'${b[j - 1]}' daalo`), j--;
    }
    path['0,0'] = 'found';
    t.frame({ line: 'done', caption: `"${a}" → "${b}": ${dp[m][n]} operations${ops.length ? ` (${ops.join(', ')})` : ''}. O(m × n).`, legend: { found: 'raasta' }, panels: [table(dp, a, b, label, path)] });
    return String(dp[m][n]);
  },
});
