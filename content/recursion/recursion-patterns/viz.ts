import { array, callTree, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone, ToneMap } from '@/components/viz/engine/types';

// ---------- 3. Visual intro: har call ke 2 raaste ----------
export const binaryStrings = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'Length n', default: 3, min: 1, max: 3 }],
  run({ n }, t) {
    const tree = callTree();
    const out: string[] = [];
    const panels = (): Panel[] => [tree.panel(), { kind: 'text', label: 'Output', text: out.length ? out.join('  ') : '(abhi kuch nahi)' }];
    const gen = (s: string, parent?: string) => {
      const me = tree.push(`"${s}"`, parent);
      if (s.length === n) {
        out.push(s);
        tree.done(me, s, 'found');
        t.frame({ caption: `Length ${n} ho gayi → "${s}" print. Ye patta (leaf) hai — return.`, vars: { strings: out.length }, panels: panels() });
        return;
      }
      t.frame({ caption: `"${s}" adhoora hai. 2 raaste: aage '0' lagao ya '1' — pehle '0' wala poora explore hoga.`, vars: { strings: out.length }, panels: panels() });
      gen(`${s}0`, me.id);
      gen(`${s}1`, me.id);
      tree.done(me, '✓');
    };
    gen('');
    t.frame({ caption: `${out.length} strings = 2^${n}. Har level par calls double — multi-branch recursion ka tree. Depth sirf ${n}, par calls ${tree.calls.length}.`, vars: { strings: out.length }, panels: panels() });
    return out.join(', ');
  },
});

// ---------- 4. How: divide & conquer max ----------
export const dcMaxTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [3, 9, 2, 7, 5], minLen: 1, maxLen: 8, min: -9, max: 20 }],
  run({ nums }, t) {
    const tree = callTree();
    const view = (l: number, r: number, tones: ToneMap = {}, label?: string) => [array(nums, { tones, ranges: [{ from: l, to: r, label, tone: 'active' }] }), tree.panel()];
    const go = (l: number, r: number, parent?: string): number => {
      const me = tree.push(`max(${l}..${r})`, parent);
      if (l === r) {
        tree.done(me, String(nums[l]));
        t.frame({ line: 'base', caption: `Ek hi item (index ${l}) → max = ${nums[l]}. Base case.`, vars: { l, r }, panels: view(l, r, { [l]: 'found' }) });
        return nums[l];
      }
      const mid = Math.floor((l + r) / 2);
      t.frame({ line: 'split', caption: `${l}..${r} ko beech (mid = ${mid}) se todo: ${l}..${mid} aur ${mid + 1}..${r}. Dono ka max bachche nikaalenge.`, vars: { l, r, mid }, panels: [array(nums, { ranges: [{ from: l, to: mid, label: 'left', tone: 'active' }, { from: mid + 1, to: r, label: 'right', tone: 'compare' }] }), tree.panel()] });
      const a = go(l, mid, me.id);
      const b = go(mid + 1, r, me.id);
      const m = Math.max(a, b);
      tree.done(me, String(m));
      t.frame({ line: 'combine', caption: `Left ne ${a}, right ne ${b} diya → max(${a}, ${b}) = ${m}. Upar wapas.`, vars: { l, r, left: a, right: b }, panels: view(l, r, {}, `max = ${m}`) });
      return m;
    };
    const ans = go(0, nums.length - 1);
    t.frame({ line: 'combine', caption: `Max = ${ans}. Calls = 2n − 1 = ${tree.calls.length}, depth ≈ log₂ n. Time O(n) (loop jitna), stack O(log n). Merge sort mein yahi structure O(n log n) deta hai.`, vars: { max: ans }, panels: [array(nums), tree.panel()] });
    return String(ans);
  },
});

// ---------- Example 1: climbing stairs + memo ----------
export const stairsTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'Stairs n', default: 5, min: 1, max: 7 }],
  run({ n }, t) {
    const tree = callTree();
    const memo = new Map<number, number>();
    const memoPanel = (hot?: number): Panel => ({
      kind: 'map',
      label: 'memo (memory)',
      keyLabel: 'n',
      valueLabel: 'tareeke',
      entries: [...memo.entries()].map(([k, v]) => ({ key: k, value: v, tone: k === hot ? ('found' as Tone) : undefined })),
    });
    const legend = { found: 'memo se mila' };
    const ways = (k: number, parent?: string): number => {
      const me = tree.push(`ways(${k})`, parent);
      if (k <= 1) {
        tree.done(me, '1');
        t.frame({ line: 'base', caption: `ways(${k}): ${k} seedhi — ek hi tareeka. Base case → 1.`, vars: { n: k }, legend, panels: [tree.panel(), memoPanel()] });
        return 1;
      }
      const hit = memo.get(k);
      if (hit !== undefined) {
        tree.done(me, String(hit), 'found');
        t.frame({ line: 'memo', caption: `ways(${k}) pehle nikaal chuke (${hit}) — memo se seedha! Iske neeche ka poora tree bach gaya.`, vars: { n: k }, legend, panels: [tree.panel(), memoPanel(k)] });
        return hit;
      }
      t.frame({ line: 'calc', caption: `ways(${k}): aakhri step 1 seedhi tha (to pehle ${k - 1} tak pahunche) ya 2 (pehle ${k - 2} tak). Dono count karo aur jodo.`, vars: { n: k }, legend, panels: [tree.panel(), memoPanel()] });
      const r = ways(k - 1, me.id) + ways(k - 2, me.id);
      memo.set(k, r);
      tree.done(me, String(r));
      t.frame({ line: 'save', caption: `ways(${k}) = ${r}. memo mein likh liya — agli baar dobara nahi nikaalna.`, vars: { n: k, result: r }, legend, panels: [tree.panel(), memoPanel(k)] });
      return r;
    };
    const ans = ways(n);
    t.frame({ line: 'save', caption: `${n} stairs ke ${ans} tareeke. Memo se har ways(k) sirf ek baar → O(n). Bina memo ke ye Fibonacci jaisa O(2ⁿ) hota.`, vars: { result: ans }, legend, panels: [tree.panel(), memoPanel()] });
    return String(ans);
  },
});

// ---------- Example 2: predict the winner ----------
export const winnerTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [1, 5, 2], minLen: 1, maxLen: 5, min: 0, max: 20 }],
  run({ nums }, t) {
    const tree = callTree();
    const view = (l: number, r: number, tones: ToneMap = {}) => [array(nums, { tones, ranges: [{ from: l, to: r, label: 'bacha', tone: 'active' }] }), tree.panel()];
    const diff = (l: number, r: number, parent?: string): number => {
      const me = tree.push(`d(${l},${r})`, parent);
      if (l === r) {
        tree.done(me, String(nums[l]));
        t.frame({ line: 'base', caption: `Sirf ${nums[l]} bacha — jiski baari, wo le lega. Diff = ${nums[l]}.`, vars: { l, r }, panels: view(l, r, { [l]: 'found' }) });
        return nums[l];
      }
      const dl = diff(l + 1, r, me.id);
      const pickL = nums[l] - dl;
      t.frame({ line: 'pickL', caption: `Left (${nums[l]}) liya → saamne wala baaki (${l + 1}..${r}) par ${dl} aage rahega. Mera diff = ${nums[l]} − ${dl} = ${pickL}.`, vars: { l, r, pickL }, panels: view(l, r, { [l]: 'compare' }) });
      const dr = diff(l, r - 1, me.id);
      const pickR = nums[r] - dr;
      t.frame({ line: 'pickR', caption: `Right (${nums[r]}) liya → saamne wala (${l}..${r - 1}) par ${dr} aage. Mera diff = ${nums[r]} − ${dr} = ${pickR}.`, vars: { l, r, pickL, pickR }, panels: view(l, r, { [r]: 'compare' }) });
      const best = Math.max(pickL, pickR);
      tree.done(me, String(best));
      t.frame({ line: 'ret', caption: `Best = max(${pickL}, ${pickR}) = ${best} — ${pickL >= pickR ? 'left' : 'right'} lena better.`, vars: { l, r, best }, panels: view(l, r, { [pickL >= pickR ? l : r]: 'found' }) });
      return best;
    };
    const d = diff(0, nums.length - 1);
    const win = d >= 0;
    t.frame({ line: 'ret', caption: `Player 1 ka diff = ${d} → ${win ? 'jeet ya tie (true)' : 'haar (false)'}. Har call 2 calls → O(2ⁿ); d(l, r) baar-baar aata hai → memo se O(n²) (DP chapter).`, vars: { diff: d }, panels: [array(nums), tree.panel()] });
    return String(win);
  },
});

// ---------- Example 3: longest substring with at least k repeats ----------
export const kRepeatTrace = tracer<{ s: string; k: number }>({
  inputs: [
    { name: 's', type: 'string', label: 's', default: 'ababbc', minLen: 1, maxLen: 10, charset: 'abc' },
    { name: 'k', type: 'int', label: 'k', default: 2, min: 1, max: 4 },
  ],
  run({ s, k }, t) {
    const c = [...s];
    const tree = callTree();
    const legend = { error: 'k se kam (kharab)' };
    const view = (lo: number, hi: number, tones: ToneMap = {}, tone: Tone = 'active') => [array(c, { tones, ranges: hi > lo ? [{ from: lo, to: hi - 1, tone }] : [] }), tree.panel()];
    const solve = (lo: number, hi: number, parent?: string): number => {
      const me = tree.push(`"${s.slice(lo, hi)}"`, parent);
      if (hi - lo < k) {
        tree.done(me, '0');
        t.frame({ line: 'base', caption: `"${s.slice(lo, hi)}" ki length ${hi - lo} < k (${k}) — koi char ${k} baar aa hi nahi sakta → 0.`, vars: { lo, hi }, legend, panels: view(lo, hi) });
        return 0;
      }
      const cnt: Record<string, number> = {};
      for (let i = lo; i < hi; i++) cnt[c[i]] = (cnt[c[i]] ?? 0) + 1;
      const bad: ToneMap = {};
      for (let i = lo; i < hi; i++) if (cnt[c[i]] < k) bad[i] = 'error';
      const counts = Object.keys(cnt).sort().map((ch) => `${ch}:${cnt[ch]}`).join(' ');
      t.frame({ line: 'count', caption: Object.keys(bad).length ? `Count: ${counts}. Red chars ${k} se kam hain — ye KISI bhi answer mein nahi aa sakte. Inpe todo.` : `Count: ${counts}. Sab ≥ ${k}!`, vars: { lo, hi }, legend, panels: view(lo, hi, bad) });
      let best = 0;
      let start = lo;
      for (let i = lo; i < hi; i++) {
        if (cnt[c[i]] < k) {
          t.frame({ line: 'split', caption: `'${c[i]}' (index ${i}) par toda → piece "${s.slice(start, i)}" alag se hal karo.`, vars: { lo, hi, best }, legend, panels: view(start, i, bad) });
          best = Math.max(best, solve(start, i, me.id));
          start = i + 1;
        }
      }
      if (start === lo) {
        tree.done(me, String(hi - lo), 'found');
        t.frame({ line: 'whole', caption: `Koi kharab char nahi → poora "${s.slice(lo, hi)}" valid, length ${hi - lo}.`, vars: { lo, hi }, legend, panels: view(lo, hi, {}, 'found') });
        return hi - lo;
      }
      const last = solve(start, hi, me.id);
      const ans = Math.max(best, last);
      tree.done(me, String(ans));
      t.frame({ line: 'ret', caption: `Pieces ka best = ${ans}. Upar wapas.`, vars: { lo, hi, best: ans }, legend, panels: view(lo, hi, bad) });
      return ans;
    };
    const ans = solve(0, c.length);
    t.frame({ line: 'ret', caption: `Answer ${ans}. Har level par kam se kam ek letter hamesha ke liye gaya → depth ≤ 26, har level O(n) → O(26·n).`, vars: { answer: ans }, panels: [array(c), tree.panel()] });
    return String(ans);
  },
});
