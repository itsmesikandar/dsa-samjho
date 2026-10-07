import { array, callTree, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

const nested = (lists: (number | string)[][]) => listStr(lists.map((l) => listStr(l)));
const status = (path: (number | string)[], resCount: number): Panel => ({ kind: 'text', label: 'path', text: `path = ${listStr(path)}   (mile: ${resCount})` });
const usedTones = (used: boolean[]): Record<number, Tone> => Object.fromEntries(used.map((u, i) => [i, (u ? 'muted' : undefined) as Tone]));

// ---------- 3. Visual intro: order matter karta hai ----------
export const permTree = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'Items (distinct)', default: [1, 2, 3], minLen: 1, maxLen: 3, min: 0, max: 9, distinct: true }],
  run({ nums }, t) {
    const tree = callTree('Permutation tree');
    const used = nums.map(() => false);
    const path: number[] = [];
    let count = 0;
    const bt = (parent?: string, edge = 'shuru') => {
      const me = tree.push(edge, parent);
      if (path.length === nums.length) {
        count++;
        tree.done(me, listStr(path), 'found');
        t.frame({ caption: `Saari jagah bhar gayi → ${listStr(path)}.`, panels: [tree.panel(), array(nums, { label: 'used (grey)', tones: usedTones(used) }), status(path, count)] });
        return;
      }
      t.frame({ caption: `Position ${path.length + 1} par kaun? Jo abhi tak use nahi hua (grey nahi) — har ek ka raasta. Subsets se fark: yahan har level par SHURU se dekhte hain.`, panels: [tree.panel(), array(nums, { label: 'used (grey)', tones: usedTones(used) }), status(path, count)] });
      nums.forEach((v, i) => {
        if (used[i]) return;
        used[i] = true;
        path.push(v);
        bt(me.id, String(v));
        path.pop();
        used[i] = false;
      });
      tree.done(me, '✓');
    };
    bt();
    t.frame({ caption: `${count} = ${nums.length}! permutations. Pehli jagah ${nums.length} options, doosri ${Math.max(nums.length - 1, 0)}, … → n!.`, panels: [tree.panel(), status(path, count)] });
    return String(count);
  },
});

// ---------- 4. How: permutations with used[] ----------
export const permTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (distinct)', default: [1, 2, 3], minLen: 1, maxLen: 3, min: 0, max: 9, distinct: true }],
  run({ nums }, t) {
    const tree = callTree('Calls (path)');
    const used = nums.map(() => false);
    const path: number[] = [];
    const res: number[][] = [];
    const bt = (parent?: string) => {
      const me = tree.push(listStr(path), parent);
      if (path.length === nums.length) {
        res.push([...path]);
        tree.done(me, '✓', 'found');
        t.frame({ line: 'found', caption: `Path poora → ${listStr(path)} result mein (copy).`, panels: [tree.panel(), array(nums, { label: 'nums (grey = used)', tones: usedTones(used) }), status(path, res.length)] });
        return;
      }
      for (let i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.push(nums[i]);
        t.frame({ line: 'choose', caption: `Choose ${nums[i]}: used[${i}] = true, path ${listStr(path)}.`, panels: [tree.panel(), array(nums, { label: 'nums (grey = used)', pointers: { i }, tones: { ...usedTones(used), [i]: 'new' } }), status(path, res.length)] });
        bt(me.id);
        path.pop();
        used[i] = false;
        t.frame({ line: 'unchoose', caption: `Un-choose ${nums[i]}: used[${i}] = false — ab ye agle option ke baad wali jagahon par aa sakta hai.`, panels: [tree.panel(), array(nums, { label: 'nums (grey = used)', pointers: { i }, tones: usedTones(used) }), status(path, res.length)] });
      }
      tree.done(me, '');
    };
    bt();
    return nested(res);
  },
});

// ---------- Example 1: phone letter combinations ----------
const KEYS = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
export const phoneTrace = tracer<{ digits: string }>({
  inputs: [{ name: 'digits', type: 'string', label: 'Digits (2-9)', default: '23', minLen: 1, maxLen: 2, charset: '23456789' }],
  run({ digits }, t) {
    const tree = callTree('Calls');
    const res: string[] = [];
    let sb = '';
    const keysView = (i: number): Panel => array([...digits].map((d) => `${d}:${KEYS[Number(d)]}`), { label: 'Keypad', pointers: i < digits.length ? { i } : {} });
    const bt = (i: number, parent?: string) => {
      const me = tree.push(sb === '' ? '""' : sb, parent);
      if (i === digits.length) {
        res.push(sb);
        tree.done(me, '✓', 'found');
        t.frame({ line: 'found', caption: `Har digit ka letter choose kar liya → "${sb}".`, panels: [tree.panel(), keysView(i), { kind: 'text', label: 'Results', text: res.join(' ') }] });
        return;
      }
      for (const ch of KEYS[Number(digits[i])]) {
        sb += ch;
        t.frame({ line: 'choose', caption: `Digit ${digits[i]} → '${ch}' → "${sb}".`, panels: [tree.panel(), keysView(i), { kind: 'text', label: 'Results', text: res.join(' ') || '–' }] });
        bt(i + 1, me.id);
        sb = sb.slice(0, -1);
      }
      tree.done(me, '');
    };
    bt(0);
    t.frame({ line: 'found', caption: `${res.length} combinations = har digit ke letters ka product. Har level = ek digit (subsets/permutations se fark: options digit ke hisaab se badalte hain).`, panels: [tree.panel(), { kind: 'text', label: 'Results', text: res.join(' ') }] });
    return listStr(res);
  },
});

// ---------- Example 2: combinations n choose k ----------
export const combineTrace = tracer<{ n: number; k: number }>({
  inputs: [
    { name: 'n', type: 'int', label: 'n', default: 4, min: 1, max: 5 },
    { name: 'k', type: 'int', label: 'k', default: 2, min: 1, max: 5 },
  ],
  check: ({ n, k }) => (k <= n ? null : 'k ≤ n rakho.'),
  run({ n, k }, t) {
    const tree = callTree('Calls (path)');
    const path: number[] = [];
    const res: number[][] = [];
    const nums = Array.from({ length: n }, (_, i) => i + 1);
    const bt = (start: number, parent?: string) => {
      const me = tree.push(listStr(path), parent);
      if (path.length === k) {
        res.push([...path]);
        tree.done(me, '✓', 'found');
        t.frame({ line: 'found', caption: `${k} numbers ho gaye → ${listStr(path)}.`, panels: [tree.panel(), status(path, res.length)] });
        return;
      }
      const need = k - path.length;
      const last = n - need + 1;
      t.frame({ line: 'prune', caption: `Abhi ${need} aur chahiye. Start ${start} se ${last} tak hi — ${last + 1} se shuru kiya to aage ${need} numbers bachenge hi nahi (pruning).`, panels: [tree.panel(), array(nums, { tones: Object.fromEntries(nums.map((v, i) => [i, (v < start ? 'muted' : v > last ? 'error' : 'compare') as Tone])) }), status(path, res.length)] });
      for (let i = start; i <= last; i++) {
        path.push(i);
        t.frame({ line: 'choose', caption: `Choose ${i} → agla ${i + 1} se.`, panels: [tree.panel(), status(path, res.length)] });
        bt(i + 1, me.id);
        path.pop();
        t.frame({ line: 'unchoose', caption: `Un-choose ${i}.`, panels: [tree.panel(), status(path, res.length)] });
      }
      tree.done(me, '');
    };
    bt(1);
    return nested(res);
  },
});

// ---------- Example 3: permutations II (duplicates) ----------
export const permUniqueTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (duplicates chalenge)', default: [1, 1, 2], minLen: 1, maxLen: 4, min: 1, max: 3 }],
  run({ nums }, t) {
    const a = [...nums].sort((x, y) => x - y);
    const tree = callTree('Calls (path)');
    const used = a.map(() => false);
    const path: number[] = [];
    const res: number[][] = [];
    const view = (hot: Record<number, Tone> = {}, ptr?: number): Panel[] => [tree.panel(), array(a, { label: 'sorted (grey = used)', tones: { ...usedTones(used), ...hot }, pointers: ptr !== undefined ? { i: ptr } : {} }), status(path, res.length)];
    t.frame({ line: 'found', caption: `Sort kiya → ${listStr(a)}: same values paas-paas. Rule: same value ki copies hamesha LEFT se RIGHT order mein use ho — tab har arrangement ek hi baar banega.`, panels: view() });
    const bt = (parent?: string) => {
      const me = tree.push(listStr(path), parent);
      if (path.length === a.length) {
        res.push([...path]);
        tree.done(me, '✓', 'found');
        t.frame({ line: 'found', caption: `→ ${listStr(path)}.`, panels: view() });
        return;
      }
      for (let i = 0; i < a.length; i++) {
        if (used[i]) continue;
        if (i > 0 && a[i] === a[i - 1] && !used[i - 1]) {
          t.frame({ line: 'skip', caption: `a[${i}] = ${a[i]} skip: iski left copy (index ${i - 1}) is jagah par abhi try ho chuki (wapas aa gayi). Yahan rakha to wahi permutations dobara banenge.`, panels: view({ [i]: 'error', [i - 1]: 'compare' }, i) });
          continue;
        }
        used[i] = true;
        path.push(a[i]);
        t.frame({ line: 'choose', caption: `Choose a[${i}] = ${a[i]} → ${listStr(path)}.`, panels: view({ [i]: 'new' }, i) });
        bt(me.id);
        path.pop();
        used[i] = false;
        t.frame({ line: 'unchoose', caption: `Un-choose a[${i}].`, panels: view({}, i) });
      }
      tree.done(me, '');
    };
    bt();
    t.frame({ line: 'found', caption: `${res.length} alag permutations (= n! / har value ki copies ka factorial). HashSet se duplicates hatane ki zaroorat nahi.`, panels: view() });
    return nested(res);
  },
});
