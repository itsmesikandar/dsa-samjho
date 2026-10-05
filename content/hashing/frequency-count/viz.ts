import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, GridPanel, HashEntry, MapPanel, Tone } from '@/components/viz/engine/types';

// letters row + counts row, columns from lo..hi letter
const letterGrid = (lo: number, hi: number, count: number[], hl: Record<number, Tone> = {}, label = 'count[c − \'a\']'): GridPanel => {
  const idx = Array.from({ length: hi - lo + 1 }, (_, k) => lo + k);
  const tones: Record<string, Tone> = {};
  idx.forEach((ci, k) => {
    if (hl[ci]) {
      tones[`0,${k}`] = hl[ci];
      tones[`1,${k}`] = hl[ci];
    }
  });
  return {
    kind: 'grid',
    label,
    values: [idx.map((ci) => String.fromCharCode(97 + ci)), idx.map((ci) => count[ci])] as Cell[][],
    rowLabels: ['char', 'count'],
    colLabels: idx.map(String),
    tones,
  };
};
const span = (s: string) => {
  const codes = [...s].map((c) => c.charCodeAt(0) - 97);
  return [Math.min(...codes), Math.max(...codes)] as const;
};

// ---------- 3. Visual intro: election ki ginti ----------
export const electionTally = tracer<{ votes: string }>({
  inputs: [{ name: 'votes', type: 'string', label: 'Votes (har letter ek candidate)', default: 'ABACBAA', minLen: 1, maxLen: 15, charset: 'ABCDE' }],
  run({ votes }, t) {
    const tally = new Map<string, number>();
    const view = (hl?: string, tone: Tone = 'new'): MapPanel => ({
      kind: 'map',
      label: 'tally',
      keyLabel: 'candidate',
      valueLabel: 'votes',
      entries: [...tally].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, v]) => ({ key: k, value: v, tone: k === hl ? tone : undefined })),
    });
    t.frame({ caption: 'Election ki ginti: har vote padho aur us candidate ki ginti +1 karo. Yahi "frequency count" hai.', panels: [array([...votes], { label: 'votes' }), view()] });
    [...votes].forEach((v, i) => {
      tally.set(v, (tally.get(v) ?? 0) + 1);
      t.frame({ caption: `Vote ${i + 1}: ${v} → ${v} ke ab ${tally.get(v)} votes.`, vars: { i }, panels: [array([...votes], { label: 'votes', tones: { [i]: 'active' }, pointers: { i } }), view(v)] });
    });
    const winner = [...tally].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];
    t.frame({
      caption: `Ginti poori: ${winner} jeeta (${tally.get(winner)} votes). Har vote ek baar padha → O(n). Ek baar ginti ho jaaye to "kaun sabse zyada", "kaun ek baar", "kisne kitne" — sab turant.`,
      panels: [array([...votes], { label: 'votes' }), view(winner, 'found')],
    });
    return winner;
  },
});

// ---------- 4. How: IntArray(26) ----------
export const letterCountTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Word (a-z)', default: 'banana', minLen: 1, maxLen: 12 }],
  run({ s }, t) {
    const count = Array(26).fill(0);
    const [lo, hi] = span(s);
    t.frame({ line: 'init', caption: `count = IntArray(26), sab 0. Yahan sirf '${String.fromCharCode(97 + lo)}'..'${String.fromCharCode(97 + hi)}' dikhaye hain. Index = c − 'a'.`, panels: [array([...s], { label: 's' }), letterGrid(lo, hi, count)] });
    [...s].forEach((c, i) => {
      const ci = c.charCodeAt(0) - 97;
      count[ci]++;
      t.frame({ line: 'count', caption: `'${c}' − 'a' = ${ci} → count[${ci}]++ = ${count[ci]}. Koi hash nahi, seedha array index — sabse tez.`, vars: { i, c, index: ci }, panels: [array([...s], { label: 's', tones: { [i]: 'active' }, pointers: { i } }), letterGrid(lo, hi, count, { [ci]: 'new' })] });
    });
    const out = count.map((n, ci) => (n ? `${String.fromCharCode(97 + ci)}${n}` : '')).filter(Boolean).join(' ');
    t.frame({ line: 'done', caption: `Result: ${out}. O(n) time, O(26) = O(1) space. (HashMap bhi chalega, par letters ke liye array halka hai.)`, panels: [array([...s], { label: 's' }), letterGrid(lo, hi, count)] });
    return out;
  },
});

// ---------- Example 1: Valid anagram ----------
export const anagramTrace = tracer<{ s: string; t: string }>({
  inputs: [
    { name: 's', type: 'string', label: 's', default: 'listen', minLen: 1, maxLen: 10 },
    { name: 't', type: 'string', label: 't', default: 'silent', minLen: 1, maxLen: 10 },
  ],
  run({ s, t: tt }, t) {
    if (s.length !== tt.length) {
      t.frame({ caption: `Lengths alag (${s.length} vs ${tt.length}) → anagram ho hi nahi sakte → false.`, panels: [array([...s], { label: 's' }), array([...tt], { label: 't' })] });
      return 'false';
    }
    const count = Array(26).fill(0);
    const [lo, hi] = span(s + tt);
    t.frame({ line: 'init', caption: 'Ek hi count array: s ke letters +1, t ke letters −1. Anagram hain to aakhir mein sab 0.', panels: [array([...s], { label: 's' }), array([...tt], { label: 't' }), letterGrid(lo, hi, count)] });
    for (let i = 0; i < s.length; i++) {
      const a = s.charCodeAt(i) - 97;
      const b = tt.charCodeAt(i) - 97;
      count[a]++;
      t.frame({ line: 'plus', caption: `s[${i}] = '${s[i]}' → +1.`, vars: { i }, panels: [array([...s], { label: 's', tones: { [i]: 'new' }, pointers: { i } }), array([...tt], { label: 't' }), letterGrid(lo, hi, count, { [a]: 'new' })] });
      count[b]--;
      t.frame({ line: 'minus', caption: `t[${i}] = '${tt[i]}' → −1.`, vars: { i }, legend: { compare: '−1 hua' }, panels: [array([...s], { label: 's' }), array([...tt], { label: 't', tones: { [i]: 'compare' }, pointers: { i } }), letterGrid(lo, hi, count, { [b]: 'compare' })] });
    }
    const bad = count.findIndex((c) => c !== 0);
    if (bad >= 0) {
      t.frame({ line: 'check', caption: `count['${String.fromCharCode(97 + bad)}'] = ${count[bad]} ≠ 0 → letters ki ginti alag → false.`, legend: { error: 'hisaab galat' }, panels: [letterGrid(lo, hi, count, { [bad]: 'error' })] });
      return 'false';
    }
    t.frame({ line: 'done', caption: 'Saare counts 0 → har letter dono mein barabar baar → anagram! O(n) time, O(1) space.', panels: [letterGrid(lo, hi, count, Object.fromEntries(count.map((_, ci) => [ci, 'done' as Tone])))] });
    return 'true';
  },
});

// ---------- Example 2: Group anagrams ----------
const wordsOf = (s: string) => s.trim().split(/\s+/).filter(Boolean);
export const groupAnaTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Words (space se alag)', default: 'eat tea tan ate nat bat', minLen: 1, maxLen: 48, charset: 'abcdefghijklmnopqrstuvwxyz ' }],
  check: ({ s }) => {
    const w = wordsOf(s);
    if (w.length === 0) return 'Kam se kam ek word daalo.';
    if (w.length > 8) return 'Zyada se zyada 8 words.';
    if (w.some((x) => x.length > 8)) return 'Har word 8 letters tak.';
    return null;
  },
  run({ s }, t) {
    const words = wordsOf(s);
    const groups = new Map<string, string[]>();
    const view = (hl?: string): MapPanel => ({ kind: 'map', label: 'groups', keyLabel: 'key (sorted)', valueLabel: 'words', entries: [...groups].map(([k, v]) => ({ key: k, value: `[${v.join(', ')}]`, tone: k === hl ? ('new' as Tone) : undefined })) });
    t.frame({ line: 'init', caption: 'Anagrams ke letters same hote hain — sirf order alag. Letters ko SORT karo to sab anagrams ka ek hi "pehchaan patra" (key) banta hai.', panels: [array(words), view()] });
    words.forEach((w, i) => {
      const key = [...w].sort().join('');
      t.frame({ line: 'key', caption: `"${w}" → sort → "${key}".`, vars: { word: w, key }, panels: [array(words, { tones: { [i]: 'active' }, pointers: { i } }), view(groups.has(key) ? key : undefined)] });
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(w);
      t.frame({ line: 'add', caption: `groups["${key}"] mein "${w}" jodo.`, vars: { word: w, key }, panels: [array(words, { tones: { [i]: 'done' } }), view(key)] });
    });
    const out = [...groups.values()].map((g) => [...g].sort()).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    const str = `[${out.map((g) => `[${g.join(', ')}]`).join(', ')}]`;
    t.frame({ line: 'done', caption: `${out.length} groups. Har word sort: O(k log k) → total O(n · k log k). Key ke liye 26-count signature lo to O(n · k).`, panels: [view(), { kind: 'text', label: 'Result', text: str }] });
    return str;
  },
});

// ---------- Example 3: Top K frequent (bucket sort) ----------
export const topKTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [1, 1, 1, 2, 2, 3], minLen: 1, maxLen: 10, min: 0, max: 9 },
    { name: 'k', type: 'int', label: 'k', default: 2, min: 1, max: 5 },
  ],
  check: ({ nums, k }) => (k <= new Set(nums).size ? null : `k alag numbers ki ginti (${new Set(nums).size}) se zyada nahi ho sakta.`),
  run({ nums, k }, t) {
    const n = nums.length;
    const freq = new Map<number, number>();
    const fview = (hl?: number): MapPanel => ({ kind: 'map', label: 'freq', keyLabel: 'number', valueLabel: 'kitni baar', entries: [...freq].map(([x, f]) => ({ key: x, value: f, tone: x === hl ? ('new' as Tone) : undefined })) });
    nums.forEach((x, i) => {
      freq.set(x, (freq.get(x) ?? 0) + 1);
      t.frame({ line: 'count', caption: `Ginti: ${x} → ${freq.get(x)}.`, vars: { i }, panels: [array(nums, { tones: { [i]: 'active' }, pointers: { i } }), fview(x)] });
    });
    const buckets: HashEntry[][] = Array.from({ length: n + 1 }, () => []);
    for (const [x, f] of freq) buckets[f].push({ key: x, id: `b${x}` });
    t.frame({
      line: 'bucket',
      caption: `Bucket sort: bucket[f] mein wo numbers jo exactly f baar aaye. Frequency 1..${n} tak hi ho sakti hai — isliye sort ki zaroorat nahi!`,
      legend: { active: 'bucket index = frequency' },
      panels: [fview(), { kind: 'hash', label: 'bucket[frequency]', buckets: structuredClone(buckets) }],
    });
    const res: number[] = [];
    for (let f = n; f >= 1 && res.length < k; f--) {
      if (buckets[f].length === 0) continue;
      const items = buckets[f].map((e) => e.key as number).sort((a, b) => a - b);
      for (const x of items) if (res.length < k) res.push(x);
      t.frame({
        line: 'pick',
        caption: `f = ${f}: ${listStr(items)} → result mein ${listStr(res)}.${res.length >= k ? ` k = ${k} poore!` : ''}`,
        vars: { f },
        panels: [{ kind: 'hash', label: 'bucket[frequency]', buckets: structuredClone(buckets), bucketTones: { [f]: 'found' } }, array(res, { label: 'result' })],
      });
    }
    t.frame({ line: 'done', caption: `Top ${k}: ${listStr(res)}. Ginti O(n) + buckets O(n) + upar se neeche ek pass O(n) → O(n). Heap se O(n log k), sort se O(n log n).`, panels: [array(res, { label: 'result', tones: Object.fromEntries(res.map((_, i) => [i, 'found' as Tone])) })] });
    return listStr(res);
  },
});
