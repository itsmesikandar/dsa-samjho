import { array, tracer } from '@/components/viz/engine/tracer';
import type { ArrRange, Tone, ToneMap } from '@/components/viz/engine/types';

const win = (l: number, r: number, label: string, tone: Tone = 'active'): ArrRange[] => (l <= r ? [{ from: l, to: r, label, tone }] : []);
const LEGEND = { new: 'andar aaya', error: 'bahar gaya' };

// ---------- 3. Visual intro: rubber band window ----------
export const elasticWindow = tracer<{ arr: number[]; limit: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'arr (positive)', default: [3, 1, 2, 1, 4, 1, 1], minLen: 2, maxLen: 10, min: 1, max: 9 },
    { name: 'limit', type: 'int', label: 'limit (sum ≤ limit)', default: 5, min: 1, max: 30 },
  ],
  run({ arr, limit }, t) {
    let l = 0;
    let sum = 0;
    let best = 0;
    t.frame({ caption: `Kaam: sabse lambi window jiska sum ≤ ${limit}. Window rubber band jaisi hai — r se khinchti hai, l se sikudti hai.`, vars: { l, sum, best }, panels: [array(arr, { pointers: { l, r: 0 } })] });
    for (let r = 0; r < arr.length; r++) {
      sum += arr[r];
      t.frame({ caption: `r aage: ${arr[r]} andar, sum = ${sum}.${sum > limit ? ` ${sum} > ${limit} — zyada ho gaya!` : ''}`, vars: { l, r, sum, best }, legend: LEGEND, panels: [array(arr, { tones: { [r]: 'new' }, pointers: { l, r }, ranges: win(l, r, `sum = ${sum}`, sum > limit ? 'error' : 'active') })] });
      while (sum > limit) {
        sum -= arr[l];
        l++;
        t.frame({ caption: `l aage: ${arr[l - 1]} bahar, sum = ${sum}.${sum > limit ? ' Abhi bhi zyada — aur sikodo.' : ' Ab theek hai.'}`, vars: { l, r, sum, best }, legend: LEGEND, panels: [array(arr, { tones: { [l - 1]: 'error' }, pointers: { l, r }, ranges: win(l, r, `sum = ${sum}`, sum > limit ? 'error' : 'active') })] });
      }
      const len = r - l + 1;
      const better = len > best;
      if (better) best = len;
      t.frame({ caption: better ? `Window valid, length ${len} → naya best!` : `Window valid, length ${len} (best ${best} hi hai).`, vars: { l, r, sum, best }, panels: [array(arr, { pointers: { l, r }, ranges: win(l, r, `len ${len}`, better ? 'found' : 'active') })] });
    }
    t.frame({ caption: `Answer: ${best}. Dekha? l aur r dono SIRF aage gaye — dono max n kadam → O(n), chahe beech mein while loop ho.`, vars: { best }, panels: [array(arr)] });
    return String(best);
  },
});

// ---------- 4. How: minimum size subarray sum ----------
export const minLenTrace = tracer<{ nums: number[]; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums (positive)', default: [2, 3, 1, 2, 4, 3], minLen: 1, maxLen: 10, min: 1, max: 9 },
    { name: 'target', type: 'int', label: 'target', default: 7, min: 1, max: 40 },
  ],
  run({ nums, target }, t) {
    let l = 0;
    let sum = 0;
    let best = Infinity;
    const b = () => (best === Infinity ? '∞' : best);
    t.frame({ line: 'init', caption: `Sabse chhoti window chahiye jiska sum ≥ ${target}. best = ∞ (abhi kuch nahi mila).`, vars: { l, sum, best: b() }, panels: [array(nums, { pointers: { l } })] });
    for (let r = 0; r < nums.length; r++) {
      sum += nums[r];
      t.frame({ line: 'expand', caption: `${nums[r]} andar → sum = ${sum}.${sum < target ? ` Abhi ${target} se kam — aur failao.` : ''}`, vars: { l, r, sum, best: b() }, legend: LEGEND, panels: [array(nums, { tones: { [r]: 'new' }, pointers: { l, r }, ranges: win(l, r, `sum = ${sum}`) })] });
      while (sum >= target) {
        t.frame({ line: 'check', caption: `sum ${sum} ≥ ${target} → window valid! Ab l se sikod ke dekho — shayad aur chhoti valid window mile.`, vars: { l, r, sum, best: b() }, panels: [array(nums, { pointers: { l, r }, ranges: win(l, r, `sum = ${sum}`, 'found') })] });
        const len = r - l + 1;
        const better = len < best;
        if (better) best = len;
        t.frame({ line: 'update', caption: better ? `Length ${len} → naya best = ${best}.` : `Length ${len}, best (${best}) se chhota nahi.`, vars: { l, r, sum, best: b() }, panels: [array(nums, { pointers: { l, r }, ranges: win(l, r, `len ${len}`, better ? 'found' : 'active') })] });
        sum -= nums[l];
        l++;
        t.frame({ line: 'shrink', caption: `${nums[l - 1]} bahar, l = ${l}, sum = ${sum}.`, vars: { l, r, sum, best: b() }, legend: LEGEND, panels: [array(nums, { tones: { [l - 1]: 'error' }, pointers: { l, r }, ranges: win(l, r, `sum = ${sum}`) })] });
      }
    }
    const ans = best === Infinity ? 0 : best;
    t.frame({ line: 'done', caption: best === Infinity ? `Poora array jod ke bhi ${target} nahi bana → 0.` : `Answer: ${ans}. Har item ek baar andar (r), ek baar bahar (l) → O(n).`, vars: { best: ans }, panels: [array(nums)] });
    return String(ans);
  },
});

// ---------- Example 1: max consecutive ones III ----------
export const onesTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums (sirf 0/1)', default: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], minLen: 1, maxLen: 12, min: 0, max: 1 },
    { name: 'k', type: 'int', label: 'k (kitne 0 flip)', default: 2, min: 0, max: 5 },
  ],
  run({ nums, k }, t) {
    let l = 0;
    let zeros = 0;
    let best = 0;
    const zt = (): ToneMap => Object.fromEntries(nums.flatMap((v, i) => (v === 0 && i >= l ? [[i, 'compare' as Tone]] : [])));
    for (let r = 0; r < nums.length; r++) {
      if (nums[r] === 0) zeros++;
      t.frame({ line: 'expand', caption: nums[r] === 0 ? `0 andar aaya → zeros = ${zeros}${zeros > k ? ` > k (${k}) — itne flip nahi kar sakte!` : ` (≤ ${k}, flip kar lenge).`}` : `1 andar aaya — koi kharcha nahi.`, vars: { l, r, zeros, best }, legend: { compare: 'zero', new: 'andar aaya' }, panels: [array(nums, { tones: { ...zt(), [r]: 'new' }, pointers: { l, r }, ranges: win(l, r, `zeros = ${zeros}`, zeros > k ? 'error' : 'active') })] });
      while (zeros > k) {
        const out = nums[l];
        if (out === 0) zeros--;
        l++;
        t.frame({ line: 'shrink', caption: out === 0 ? `0 bahar gaya → zeros = ${zeros}.${zeros > k ? ' Abhi bhi zyada.' : ' Ab theek.'}` : `1 bahar gaya — zeros wahi (${zeros}), aur sikodo.`, vars: { l, r, zeros, best }, legend: { compare: 'zero', error: 'bahar gaya' }, panels: [array(nums, { tones: { ...zt(), [l - 1]: 'error' }, pointers: { l, r }, ranges: win(l, r, `zeros = ${zeros}`, zeros > k ? 'error' : 'active') })] });
      }
      const len = r - l + 1;
      const better = len > best;
      if (better) best = len;
      t.frame({ line: 'update', caption: better ? `Window mein ${zeros} zero (sab flip ho sakte) → length ${len}, naya best!` : `Length ${len}, best ${best} hi.`, vars: { l, r, zeros, best }, legend: { compare: 'zero' }, panels: [array(nums, { tones: zt(), pointers: { l, r }, ranges: win(l, r, `len ${len}`, better ? 'found' : 'active') })] });
    }
    return String(best);
  },
});

// ---------- Example 2: longest substring without repeating ----------
export const noRepeatTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 's', default: 'abcabcbb', minLen: 1, maxLen: 12, charset: 'abcdef' }],
  run({ s }, t) {
    const c = [...s];
    const set = new Set<string>();
    let l = 0;
    let best = 0;
    const setText = () => ({ kind: 'text' as const, label: 'inWindow (HashSet)', text: set.size ? `{ ${[...set].join(', ')} }` : '{ } khaali' });
    for (let r = 0; r < c.length; r++) {
      while (set.has(c[r])) {
        t.frame({ line: 'shrink', caption: `'${c[r]}' pehle se window mein hai — repeat! l wala '${c[l]}' nikaalo.`, vars: { l, r, best }, legend: { error: 'bahar jaayega', compare: 'repeat' }, panels: [array(c, { tones: { [l]: 'error', [r]: 'compare' }, pointers: { l, r }, ranges: win(l, r - 1, 'window', 'active') }), setText()] });
        set.delete(c[l]);
        l++;
      }
      set.add(c[r]);
      t.frame({ line: 'expand', caption: `'${c[r]}' window mein nahi tha → add.`, vars: { l, r, best }, legend: { new: 'andar aaya' }, panels: [array(c, { tones: { [r]: 'new' }, pointers: { l, r }, ranges: win(l, r, 'window') }), setText()] });
      const len = r - l + 1;
      const better = len > best;
      if (better) best = len;
      t.frame({ line: 'update', caption: better ? `"${c.slice(l, r + 1).join('')}" — sab alag, length ${len} → naya best!` : `Length ${len}, best ${best} hi.`, vars: { l, r, best }, panels: [array(c, { pointers: { l, r }, ranges: win(l, r, `len ${len}`, better ? 'found' : 'active') }), setText()] });
    }
    return String(best);
  },
});

// ---------- Example 3: minimum window substring ----------
export const minWindowTrace = tracer<{ s: string; t: string }>({
  inputs: [
    { name: 's', type: 'string', label: 's', default: 'ADOBECODEBANC', minLen: 1, maxLen: 14, charset: 'ABCDENO' },
    { name: 't', type: 'string', label: 't (chahiye)', default: 'ABC', minLen: 1, maxLen: 4, charset: 'ABC' },
  ],
  run({ s, t: pat }, t) {
    const c = [...s];
    const need: Record<string, number> = {};
    for (const ch of pat) need[ch] = (need[ch] ?? 0) + 1;
    const keys = Object.keys(need).sort();
    let missing = pat.length;
    let l = 0;
    let bestL = 0;
    let bestLen = Infinity;
    const needPanel = () => ({
      kind: 'map' as const,
      label: 'need (t ke chars ki baaki zaroorat)',
      keyLabel: 'char',
      valueLabel: 'need',
      entries: keys.map((k) => ({ key: k, value: need[k], tone: (need[k] > 0 ? 'compare' : 'done') as Tone })),
    });
    const bestStr = () => (bestLen === Infinity ? '–' : `"${s.slice(bestL, bestL + bestLen)}"`);
    const legend = { compare: 'abhi kam', done: 'poora', new: 'andar aaya', error: 'bahar gaya' };
    t.frame({ line: 'init', caption: `t = "${pat}" — need mein har char ki ginti. missing = ${missing}: itne chars abhi window mein chahiye.`, vars: { missing }, legend, panels: [array(c), needPanel()] });
    for (let r = 0; r < c.length; r++) {
      const ch = c[r];
      const useful = (need[ch] ?? 0) > 0;
      if (useful) missing--;
      if (ch in need) need[ch]--;
      t.frame({ line: 'expand', caption: useful ? `'${ch}' kaam ka tha → missing = ${missing}.` : ch in need ? `'${ch}' pehle se kaafi hain (extra) — missing wahi (${missing}).` : `'${ch}' t mein hai hi nahi — missing wahi (${missing}).`, vars: { l, r, missing, best: bestStr() }, legend, panels: [array(c, { tones: { [r]: 'new' }, pointers: { l, r }, ranges: win(l, r, 'window') }), needPanel()] });
      while (missing === 0) {
        const len = r - l + 1;
        const better = len < bestLen;
        if (better) {
          bestLen = len;
          bestL = l;
        }
        t.frame({ line: 'update', caption: `missing = 0 → "${c.slice(l, r + 1).join('')}" mein sab mil gaye! ${better ? `Length ${len} → naya best.` : `Length ${len}, best chhota hai.`} Ab l se sikod ke dekho.`, vars: { l, r, missing, best: bestStr() }, legend, panels: [array(c, { pointers: { l, r }, ranges: win(l, r, `len ${len}`, 'found') }), needPanel()] });
        const out = c[l];
        if (out in need) need[out]++;
        const broke = (need[out] ?? 0) > 0;
        if (broke) missing++;
        l++;
        t.frame({ line: 'shrink', caption: broke ? `'${out}' bahar — ye zaroori tha → missing = ${missing}. Window invalid, ab r badhao.` : `'${out}' bahar — ${out in need ? 'extra tha' : 't mein nahi'}, window abhi bhi valid.`, vars: { l, r, missing, best: bestStr() }, legend, panels: [array(c, { tones: { [l - 1]: 'error' }, pointers: { l, r }, ranges: win(l, r, 'window', broke ? 'active' : 'found') }), needPanel()] });
      }
    }
    const ans = bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen);
    t.frame({ line: 'update', caption: ans ? `Answer: "${ans}". l aur r dono n tak — O(|s| + |t|).` : `Kabhi saare chars nahi mile → "" (khaali string).`, panels: [array(c, { ranges: ans ? win(bestL, bestL + bestLen - 1, 'answer', 'found') : [] })] });
    return ans;
  },
});
