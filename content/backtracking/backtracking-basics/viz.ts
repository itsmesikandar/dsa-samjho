import { array, callTree, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

const nested = (lists: (number | string)[][]) => listStr(lists.map((l) => listStr(l)));
const pathPanel = (path: (number | string)[], res: (number | string)[][]): Panel => ({ kind: 'text', label: 'path / results', text: `path = ${listStr(path)}\nresults (${res.length}): ${res.map((l) => listStr(l)).join(' ') || '–'}` });

// ---------- 3. Visual intro: lo ya chhodo — decision tree ----------
export const subsetTree = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'Items', default: [1, 2, 3], minLen: 1, maxLen: 3, min: 0, max: 9 }],
  run({ nums }, t) {
    const tree = callTree('Decisions ka tree');
    const path: number[] = [];
    const res: number[][] = [];
    const go = (i: number, parent?: string, edge = 'shuru') => {
      const me = tree.push(edge, parent);
      if (i === nums.length) {
        res.push([...path]);
        tree.done(me, listStr(path), 'found');
        t.frame({ caption: `Saare items ka decision ho gaya → subset ${listStr(path)}. Ye patta (leaf) hai.`, vars: { subsets: res.length }, panels: [tree.panel(), pathPanel(path, res)] });
        return;
      }
      t.frame({ caption: `Item ${nums[i]}: 2 raaste — LO (+${nums[i]}) ya CHHODO (−${nums[i]}). Pehle "lo" wala raasta poora dekhenge, phir wapas aa ke "chhodo".`, vars: { subsets: res.length }, panels: [tree.panel(), pathPanel(path, res)] });
      path.push(nums[i]);
      go(i + 1, me.id, `+${nums[i]}`);
      path.pop();
      t.frame({ caption: `Wapas aaye (backtrack): ${nums[i]} hataya — path phir ${listStr(path)}. Ab "chhodo" wala raasta.`, vars: { subsets: res.length }, panels: [tree.panel(), pathPanel(path, res)] });
      go(i + 1, me.id, `−${nums[i]}`);
      tree.done(me, '✓');
    };
    go(0);
    t.frame({ caption: `${res.length} = 2^${nums.length} subsets. Backtracking = is tree ko DFS se ghoomna: aage jao (choose), dekho (explore), wapas aao aur undo karo (un-choose).`, vars: { subsets: res.length }, panels: [tree.panel(), pathPanel(path, res)] });
    return String(res.length);
  },
});

// ---------- 4. How: subsets (loop wala structure) ----------
export const subsetsTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (distinct)', default: [1, 2, 3], minLen: 1, maxLen: 4, min: 0, max: 9, distinct: true }],
  run({ nums }, t) {
    const tree = callTree('Calls (path)');
    const path: number[] = [];
    const res: number[][] = [];
    const bt = (start: number, parent?: string) => {
      const me = tree.push(listStr(path), parent);
      res.push([...path]);
      t.frame({ line: 'add', caption: `Har call ka path khud ek subset hai → ${listStr(path)} result mein (COPY). Ab index ${start} se aage ke items try.`, vars: { start }, panels: [tree.panel(), array(nums, { pointers: { start }, tones: Object.fromEntries(nums.map((_, i) => [i, (i < start ? 'muted' : undefined) as Tone])) }), pathPanel(path, res)] });
      for (let i = start; i < nums.length; i++) {
        path.push(nums[i]);
        t.frame({ line: 'choose', caption: `Choose ${nums[i]} → path ${listStr(path)}. Ab aage (index ${i + 1} se) explore.`, vars: { start, i }, panels: [tree.panel(), array(nums, { pointers: { i }, tones: { [i]: 'new' } }), pathPanel(path, res)] });
        bt(i + 1, me.id);
        path.pop();
        t.frame({ line: 'unchoose', caption: `${nums[i]} ka raasta poora dekh liya → un-choose (hata do). path wapas ${listStr(path)} — agla item try karne ke liye saaf.`, vars: { start, i }, panels: [tree.panel(), array(nums, { pointers: { i }, tones: { [i]: 'error' } }), pathPanel(path, res)] });
      }
      tree.done(me, '✓');
    };
    bt(0);
    t.frame({ line: 'add', caption: `${res.length} subsets. Time O(n · 2ⁿ) (har subset copy O(n)), stack O(n).`, panels: [tree.panel(), pathPanel(path, res)] });
    return nested(res);
  },
});

// ---------- Example 1: subset XOR sum ----------
export const xorTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [5, 1, 6], minLen: 1, maxLen: 3, min: 0, max: 9 }],
  run({ nums }, t) {
    const tree = callTree('go(i, xor)');
    const go = (i: number, x: number, parent?: string, edge = ''): number => {
      const me = tree.push(`${edge}x=${x}`, parent);
      if (i === nums.length) {
        tree.done(me, String(x), 'found');
        t.frame({ line: 'leaf', caption: `Subset poora → XOR = ${x}. Return.`, panels: [tree.panel()] });
        return x;
      }
      t.frame({ line: 'branch', caption: `Item ${nums[i]}: lo (x ^ ${nums[i]} = ${x ^ nums[i]}) ya chhodo (x = ${x}). xor PARAMETER hai — wapas aate hi purana value apne aap, undo ki zaroorat nahi.`, panels: [tree.panel()] });
      const a = go(i + 1, x ^ nums[i], me.id, '+');
      const b = go(i + 1, x, me.id, '−');
      tree.done(me, String(a + b));
      t.frame({ line: 'branch', caption: `Dono raaston ka jod: ${a} + ${b} = ${a + b}.`, panels: [tree.panel()] });
      return a + b;
    };
    const ans = go(0, 0);
    t.frame({ line: 'leaf', caption: `Total = ${ans}. 2ⁿ leaves → O(2ⁿ). (Trick: answer = OR(nums) × 2^(n−1) — O(n).)`, panels: [tree.panel()] });
    return String(ans);
  },
});

// ---------- Example 2: combination sum ----------
export const comboTrace = tracer<{ cand: number[]; target: number }>({
  inputs: [
    { name: 'cand', type: 'intArray', label: 'Candidates (distinct)', default: [2, 3, 6, 7], minLen: 1, maxLen: 4, min: 2, max: 9, distinct: true },
    { name: 'target', type: 'int', label: 'target', default: 7, min: 1, max: 10 },
  ],
  run({ cand, target }, t) {
    const c = [...cand].sort((a, b) => a - b);
    const tree = callTree('Calls (remain)');
    const path: number[] = [];
    const res: number[][] = [];
    const bt = (start: number, remain: number, parent?: string) => {
      const me = tree.push(`${listStr(path)} r=${remain}`, parent);
      if (remain === 0) {
        res.push([...path]);
        tree.done(me, '✓', 'found');
        t.frame({ line: 'found', caption: `remain = 0 → ${listStr(path)} ka sum = ${target}. Mil gaya!`, panels: [tree.panel(), pathPanel(path, res)] });
        return;
      }
      for (let i = start; i < c.length; i++) {
        if (c[i] > remain) {
          t.frame({ line: 'prune', caption: `${c[i]} > remain ${remain} — aur sorted hai, to aage wale bhi bade. Poori branch kaat do (pruning) → loop break.`, panels: [tree.panel(), array(c, { pointers: { i }, tones: Object.fromEntries(c.map((_, j) => [j, (j >= i ? 'error' : undefined) as Tone])) }), pathPanel(path, res)] });
          break;
        }
        path.push(c[i]);
        t.frame({ line: 'choose', caption: `Choose ${c[i]} → remain ${remain - c[i]}. Agli call i = ${i} se (same number dobara chalega).`, panels: [tree.panel(), array(c, { pointers: { i }, tones: { [i]: 'new' } }), pathPanel(path, res)] });
        bt(i, remain - c[i], me.id);
        path.pop();
        t.frame({ line: 'unchoose', caption: `Un-choose ${c[i]} → path ${listStr(path)}.`, panels: [tree.panel(), array(c, { pointers: { i } }), pathPanel(path, res)] });
      }
      tree.done(me, '');
    };
    bt(0, target);
    t.frame({ line: 'found', caption: `Results ${nested(res)}. Sort + break se bekaar branches jaldi kat gayi.`, panels: [tree.panel(), pathPanel(path, res)] });
    return nested(res);
  },
});

// ---------- Example 3: palindrome partitioning ----------
export const palPartTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 's', default: 'aab', minLen: 1, maxLen: 5, charset: 'ab' }],
  run({ s }, t) {
    const c = [...s];
    const tree = callTree('Calls (start)');
    const path: string[] = [];
    const res: string[][] = [];
    const isPal = (l: number, r: number) => {
      while (l < r) if (s[l++] !== s[r--]) return false;
      return true;
    };
    const bt = (start: number, parent?: string) => {
      const me = tree.push(listStr(path), parent);
      if (start === s.length) {
        res.push([...path]);
        tree.done(me, '✓', 'found');
        t.frame({ line: 'found', caption: `Poora string kat gaya → ${listStr(path)}.`, panels: [tree.panel(), array(c), pathPanel(path, res)] });
        return;
      }
      for (let end = start; end < s.length; end++) {
        const piece = s.slice(start, end + 1);
        const range = [{ from: start, to: end, label: `"${piece}"`, tone: (isPal(start, end) ? 'found' : 'error') as Tone }];
        if (!isPal(start, end)) {
          t.frame({ line: 'prune', caption: `"${piece}" palindrome nahi → is raaste aage jaana bekaar, skip.`, panels: [tree.panel(), array(c, { ranges: range }), pathPanel(path, res)] });
          continue;
        }
        path.push(piece);
        t.frame({ line: 'choose', caption: `"${piece}" palindrome ✓ → piece lo, baaki (index ${end + 1} se) kaato.`, panels: [tree.panel(), array(c, { ranges: range }), pathPanel(path, res)] });
        bt(end + 1, me.id);
        path.pop();
        t.frame({ line: 'unchoose', caption: `"${piece}" hatao — ab lamba piece try.`, panels: [tree.panel(), array(c), pathPanel(path, res)] });
      }
      tree.done(me, '');
    };
    bt(0);
    return nested(res);
  },
});
