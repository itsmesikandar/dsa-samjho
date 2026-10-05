import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone, ToneMap } from '@/components/viz/engine/types';

const kCheck = (n: number, k: number) => (k <= n ? null : `k (${k}) array ki length (${n}) se bada nahi ho sakta.`);
const sumOf = (a: number[], from: number, to: number) => a.slice(from, to + 1).reduce((x, y) => x + y, 0);
const SLIDE_LEGEND = { error: 'bahar gaya', new: 'andar aaya' };

// ---------- 3. Visual intro: har baar poora jodna vs khiskana ----------
export const slideVsBrute = tracer<{ arr: number[]; k: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'arr', default: [4, 2, 7, 1, 8, 3, 5, 6], minLen: 2, maxLen: 10, min: 0, max: 9 },
    { name: 'k', type: 'int', label: 'Window size k', default: 4, min: 1, max: 10 },
  ],
  check: ({ arr, k }) => kCheck(arr.length, k),
  run({ arr, k }, t) {
    const n = arr.length;
    let brute = 0;
    let slide = 0;
    let sum = 0;
    for (let s = 0; s + k <= n; s++) {
      const e = s + k - 1;
      brute += k;
      const prev = sum;
      if (s === 0) {
        sum = sumOf(arr, 0, k - 1);
        slide += k;
      } else {
        sum += arr[e] - arr[s - 1];
        slide += 2;
      }
      const tones: ToneMap = s === 0 ? {} : { [s - 1]: 'error', [e]: 'new' };
      const text = s === 0
        ? `Brute: ${arr.slice(0, k).join(' + ')} = ${sum}  (${k} jod)\nSlide: pehli window, poora jodna padega  (${k} jod)`
        : `Brute: ${arr.slice(s, e + 1).join(' + ')} = ${sum}  (${k} jod)\nSlide: ${prev} − ${arr[s - 1]} + ${arr[e]} = ${sum}  (sirf 2 kaam)`;
      t.frame({
        caption: s === 0
          ? `Window = lagatar ${k} items ki khidki. Pehli window ka sum = ${sum}. Ab khidki ek-ek kadam aage khiskegi.`
          : `Khidki aage khiski: ${arr[s - 1]} bahar gaya, ${arr[e]} andar aaya. Beech ke ${k - 1} items wahi hain — unhe dobara kyun jodna?`,
        vars: { 'brute kaam': brute, 'slide kaam': slide },
        legend: SLIDE_LEGEND,
        panels: [array(arr, { tones, ranges: [{ from: s, to: e, label: `sum = ${sum}`, tone: 'active' }] }), { kind: 'text', label: 'Kaam ka hisaab', text }],
      });
    }
    t.frame({
      caption: `Total kaam — brute: ${brute}, slide: ${slide}. Brute = (n − k + 1) × k ≈ O(n·k). Slide = k + 2(n − k) ≈ O(n). Bada k ho to fark bahut bada.`,
      vars: { 'brute kaam': brute, 'slide kaam': slide },
      panels: [array(arr)],
    });
    return `${brute} vs ${slide}`;
  },
});

// ---------- 4. How: max sum of size-k window ----------
export const maxSumTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [2, 1, 5, 1, 3, 2], minLen: 1, maxLen: 10, min: -9, max: 20 },
    { name: 'k', type: 'int', label: 'k', default: 3, min: 1, max: 10 },
  ],
  check: ({ nums, k }) => kCheck(nums.length, k),
  run({ nums, k }, t) {
    let sum = sumOf(nums, 0, k - 1);
    let best = sum;
    let bestAt = 0;
    t.frame({ line: 'first', caption: `Pehli window (index 0..${k - 1}) ka sum ek baar poora joda: ${sum}. best = ${sum}.`, vars: { sum, best }, panels: [array(nums, { ranges: [{ from: 0, to: k - 1, label: `sum = ${sum}`, tone: 'active' }] })] });
    for (let r = k; r < nums.length; r++) {
      const out = nums[r - k];
      sum += nums[r] - out;
      t.frame({
        line: 'slide',
        caption: `${nums[r]} andar, ${out} bahar: sum = ${sum - nums[r] + out} + ${nums[r]} − ${out} = ${sum}. Sirf 2 kaam, k nahi.`,
        vars: { r, sum, best },
        legend: SLIDE_LEGEND,
        panels: [array(nums, { tones: { [r - k]: 'error', [r]: 'new' }, ranges: [{ from: r - k + 1, to: r, label: `sum = ${sum}`, tone: 'active' }] })],
      });
      const better = sum > best;
      if (better) {
        best = sum;
        bestAt = r - k + 1;
      }
      t.frame({ line: 'best', caption: better ? `${sum} ab tak ka sabse bada → best = ${best}.` : `${sum} ≤ best (${best}) — best wahi.`, vars: { r, sum, best }, panels: [array(nums, { ranges: [{ from: r - k + 1, to: r, label: `sum = ${sum}`, tone: better ? 'found' : 'active' }] })] });
    }
    t.frame({ line: 'best', caption: `Answer: ${best} (index ${bestAt}..${bestAt + k - 1}). Har item ek baar andar, ek baar bahar → O(n).`, vars: { best }, panels: [array(nums, { ranges: [{ from: bestAt, to: bestAt + k - 1, label: `best = ${best}`, tone: 'found' }] })] });
    return String(best);
  },
});

// ---------- Example 1: max vowels in a k-window ----------
const isVowel = (c: string) => 'aeiou'.includes(c);
export const vowelsTrace = tracer<{ s: string; k: number }>({
  inputs: [
    { name: 's', type: 'string', label: 's', default: 'abciiidef', minLen: 1, maxLen: 14, charset: 'abcdefghiklmnoprstu' },
    { name: 'k', type: 'int', label: 'k', default: 3, min: 1, max: 14 },
  ],
  check: ({ s, k }) => kCheck(s.length, k),
  run({ s, k }, t) {
    const c = [...s];
    const vt: ToneMap = Object.fromEntries(c.flatMap((ch, i) => (isVowel(ch) ? [[i, 'compare' as Tone]] : [])));
    let count = c.slice(0, k).filter(isVowel).length;
    let best = count;
    t.frame({ line: 'first', caption: `Pehli window "${c.slice(0, k).join('')}" mein ${count} vowel. best = ${best}.`, vars: { count, best }, legend: { compare: 'vowel' }, panels: [array(c, { tones: vt, ranges: [{ from: 0, to: k - 1, label: `vowels = ${count}`, tone: 'active' }] })] });
    for (let r = k; r < c.length; r++) {
      const inV = isVowel(c[r]);
      if (inV) count++;
      t.frame({ line: 'add', caption: inV ? `'${c[r]}' andar aaya — vowel hai → count = ${count}.` : `'${c[r]}' andar aaya — vowel nahi, count wahi (${count}).`, vars: { r, count, best }, legend: { ...SLIDE_LEGEND, compare: 'vowel' }, panels: [array(c, { tones: { ...vt, [r]: 'new' }, ranges: [{ from: r - k, to: r, label: 'abhi k + 1 chars', tone: 'muted' }] })] });
      const outV = isVowel(c[r - k]);
      if (outV) count--;
      t.frame({ line: 'remove', caption: outV ? `'${c[r - k]}' bahar gaya — vowel tha → count = ${count}.` : `'${c[r - k]}' bahar gaya — vowel nahi tha, count wahi (${count}).`, vars: { r, count, best }, legend: { ...SLIDE_LEGEND, compare: 'vowel' }, panels: [array(c, { tones: { ...vt, [r - k]: 'error' }, ranges: [{ from: r - k + 1, to: r, label: `vowels = ${count}`, tone: 'active' }] })] });
      const better = count > best;
      if (better) best = count;
      t.frame({ line: 'best', caption: better ? `${count} naya record → best = ${best}.${best === k ? ' (best = k — isse zyada ho hi nahi sakta.)' : ''}` : `best = ${best} (badla nahi).`, vars: { r, count, best }, legend: { compare: 'vowel' }, panels: [array(c, { tones: vt, ranges: [{ from: r - k + 1, to: r, label: `vowels = ${count}`, tone: better ? 'found' : 'active' }] })] });
    }
    t.frame({ line: 'best', caption: `Answer: ${best}. Har char ek baar andar, ek baar bahar → O(n), sirf ek counter → O(1).`, vars: { best }, panels: [array(c, { tones: vt })] });
    return String(best);
  },
});

// ---------- Example 2: find all anagrams ----------
export const anagramTrace = tracer<{ s: string; p: string }>({
  inputs: [
    { name: 's', type: 'string', label: 's', default: 'cbaebabacd', minLen: 1, maxLen: 12, charset: 'abcde' },
    { name: 'p', type: 'string', label: 'p (pattern)', default: 'abc', minLen: 1, maxLen: 4, charset: 'abcde' },
  ],
  run({ s, p }, t) {
    const c = [...s];
    const k = p.length;
    const res: number[] = [];
    if (k > c.length) {
      t.frame({ line: 'init', caption: `p (${k}) s (${c.length}) se lamba hai — koi anagram ho hi nahi sakta. Khaali list.`, panels: [array(c)] });
      return listStr(res);
    }
    const letters = [...new Set([...s, ...p])].sort();
    const need = Object.fromEntries(letters.map((l) => [l, 0])) as Record<string, number>;
    const have = { ...need };
    for (const ch of p) need[ch]++;
    const table = (): Panel => ({
      kind: 'grid',
      label: 'Letter counts',
      values: [letters.map((l) => need[l]), letters.map((l) => have[l])],
      rowLabels: ['need (p)', 'have (window)'],
      colLabels: letters,
      tones: Object.fromEntries(letters.map((l, j) => [`1,${j}`, have[l] === need[l] ? 'done' : 'compare'])),
    });
    const legend = { ...SLIDE_LEGEND, done: 'count barabar', compare: 'count alag' };
    const found: ToneMap = {};
    t.frame({ line: 'init', caption: `p = "${p}" ke letters gine (need). Window ki ginti (have) abhi 0. Jab saare columns barabar → anagram!`, legend, panels: [array(c), table()] });
    for (let r = 0; r < c.length; r++) {
      have[c[r]]++;
      const lo = Math.max(0, r - k + 1);
      t.frame({ line: 'add', caption: `'${c[r]}' andar → have[${c[r]}] = ${have[c[r]]}.`, vars: { r }, legend, panels: [array(c, { tones: { ...found, [r]: 'new' }, ranges: [{ from: Math.max(0, r - k), to: r, tone: 'muted' }] }), table()] });
      if (r >= k) {
        const o = c[r - k];
        have[o]--;
        t.frame({ line: 'remove', caption: `Window ${k} se badi ho gayi → '${o}' (index ${r - k}) bahar, have[${o}] = ${have[o]}.`, vars: { r }, legend, panels: [array(c, { tones: { ...found, [r - k]: 'error' }, ranges: [{ from: lo, to: r, tone: 'active' }] }), table()] });
      }
      if (r >= k - 1) {
        const ok = letters.every((l) => have[l] === need[l]);
        if (ok) {
          res.push(lo);
          found[lo] = 'found';
        }
        t.frame({
          line: 'check',
          caption: ok ? `Saare counts barabar → "${c.slice(lo, r + 1).join('')}" anagram hai! Start index ${lo} add.` : `Window "${c.slice(lo, r + 1).join('')}" — kuch counts alag → anagram nahi.`,
          vars: { r, start: lo },
          legend: { ...legend, found: 'anagram start' },
          panels: [array(c, { tones: found, ranges: [{ from: lo, to: r, label: ok ? 'anagram!' : undefined, tone: ok ? 'found' : 'active' }] }), table()],
        });
      }
    }
    t.frame({ line: 'check', caption: `Answer: ${listStr(res)}. Har kadam par sirf 2 counts badle; compare 26 letters ka (constant) → O(n).`, panels: [array(c, { tones: found }), table()] });
    return listStr(res);
  },
});

// ---------- Example 3: max points from cards (ulta socho) ----------
export const cardsTrace = tracer<{ cards: number[]; k: number }>({
  inputs: [
    { name: 'cards', type: 'intArray', label: 'cardPoints', default: [1, 2, 3, 4, 5, 6, 1], minLen: 1, maxLen: 10, min: 1, max: 20 },
    { name: 'k', type: 'int', label: 'k (kitne uthane)', default: 3, min: 1, max: 10 },
  ],
  check: ({ cards, k }) => kCheck(cards.length, k),
  run({ cards, k }, t) {
    const n = cards.length;
    const total = sumOf(cards, 0, n - 1);
    const w = n - k;
    const legend = { found: 'uthaya', muted: 'bacha (window)' };
    const view = (lo: number, tone: Tone = 'muted') => {
      const tones: ToneMap = Object.fromEntries(cards.map((_, i) => [i, i >= lo && i < lo + w ? 'muted' : 'found']));
      return [array(cards, { tones, ranges: w > 0 ? [{ from: lo, to: lo + w - 1, label: `bacha = ${sumOf(cards, lo, lo + w - 1)}`, tone }] : [] })];
    };
    let sum = sumOf(cards, 0, w - 1);
    let minSum = sum;
    let bestLo = 0;
    t.frame({
      line: 'first',
      caption: w === 0
        ? `k = n — saare cards uthao. Answer = total = ${total}.`
        : `Ulta socho: k uthaye to ${w} BACHENGE — aur wo hamesha beech ka lagatar hissa hain. Uthaya = total (${total}) − bacha. To bacha hua hissa (size ${w}) MINIMUM chahiye. Pehla: sum = ${sum}.`,
      vars: { total, w, sum },
      legend,
      panels: view(0),
    });
    for (let r = w; r < n; r++) {
      const lo = r - w + 1;
      sum += cards[r] - cards[r - w];
      t.frame({ line: 'slide', caption: `Window aage: ${cards[r - w]} ab uthaya (left se), ${cards[r]} ab bacha. Left se ${lo}, right se ${n - 1 - r} uthaye. bacha = ${sum}.`, vars: { r, sum, minSum }, legend, panels: view(lo) });
      const better = sum < minSum;
      if (better) {
        minSum = sum;
        bestLo = lo;
      }
      t.frame({ line: 'best', caption: better ? `${sum} sabse kam bacha → uthaya = ${total} − ${sum} = ${total - sum} (naya best).` : `${sum} ≥ ${minSum} — best wahi.`, vars: { r, sum, minSum }, legend, panels: view(lo, better ? 'compare' : 'muted') });
    }
    t.frame({ line: 'best', caption: `Answer: ${total} − ${minSum} = ${total - minSum}. Left se ${bestLo}, right se ${k - bestLo} cards. "Kinaron se uthao" = "beech ka chhota hissa chhodo".`, vars: { answer: total - minSum }, legend, panels: view(bestLo, 'compare') });
    return String(total - minSum);
  },
});
