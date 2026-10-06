import { array, callTree, tracer } from '@/components/viz/engine/tracer';
import type { CallNode, Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;

// ---------- 3. Visual intro: seedhi recursion — wahi kaam baar baar ----------
export const fibTreeTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n (fib(n))', default: 5, min: 2, max: 6 }],
  run({ n }, t) {
    const tree = callTree('fib(n) ki calls');
    const seen = new Set<number>();
    let calls = 0;
    let repeats = 0;
    const legend = { error: 'DOBARA — pehle nikal chuka' };
    t.frame({ caption: `fib(n) = fib(n - 1) + fib(n - 2). Seedha recursion likho to kya hota hai? Har call do aur calls karti hai.`, legend, panels: [tree.panel()] });
    const go = (k: number, parent?: CallNode): number => {
      calls++;
      const again = seen.has(k);
      if (again) repeats++;
      const me = tree.push(`fib(${k})`, parent?.id, again ? 'error' : undefined);
      t.frame({ caption: again ? `fib(${k}) DOBARA call hua — ye jawab pehle hi nikal chuka hai, phir bhi poora ped dobara banega.` : `fib(${k}) call.`, vars: { calls, repeats }, legend, panels: [tree.panel()] });
      const v = k <= 1 ? k : go(k - 1, me) + go(k - 2, me);
      seen.add(k);
      tree.done(me, String(v), again ? 'error' : undefined);
      return v;
    };
    const ans = go(n);
    t.frame({ caption: `fib(${n}) = ${ans}. Kul ${calls} calls, par alag sawaal sirf ${n + 1} (fib(0) … fib(${n})). ${repeats} calls bekaar dobara. n = 40 par ~33 crore calls! Ilaaj: jo nikaala use YAAD rakho — yahi DP hai.`, vars: { calls, repeats }, legend, panels: [tree.panel()] });
    return String(ans);
  },
});

// ---------- 4. How: memoization (top-down) ----------
export const memoTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 6, min: 2, max: 10 }],
  run({ n }, t) {
    const tree = callTree('Calls (memo ke saath)');
    const memo: (number | null)[] = Array(n + 1).fill(null);
    const legend = { found: 'memo se seedha', done: 'nikaal ke likha', active: 'abhi' };
    const view = (hot?: number, tone: Tone = 'active'): Panel[] => {
      const tones: Tones = {};
      memo.forEach((v, i) => v !== null && (tones[i] = 'done'));
      if (hot !== undefined) tones[hot] = tone;
      return [tree.panel(), array(memo.map((v) => (v === null ? '·' : v)), { label: 'memo[] (· = abhi nahi pata)', tones })];
    };
    t.frame({ caption: 'Wahi recursion, bas ek memo array. Har fib(k) pehli baar nikle to memo[k] mein likho; dobara pooche to wahin se uthao.', legend, panels: view() });
    const go = (k: number, parent?: CallNode): number => {
      if (k <= 1) {
        const me = tree.push(`fib(${k})`, parent?.id);
        tree.done(me, String(k));
        t.frame({ line: 'base', caption: `fib(${k}) = ${k} — base case, kuch nikaalna nahi.`, legend, panels: view() });
        return k;
      }
      if (memo[k] !== null) {
        const me = tree.push(`fib(${k})`, parent?.id, 'found');
        tree.done(me, String(memo[k]), 'found');
        t.frame({ line: 'hit', caption: `fib(${k}) memo mein hai (${memo[k]}) → seedha lautao. Poora ped kat gaya!`, legend, panels: view(k, 'found') });
        return memo[k]!;
      }
      const me = tree.push(`fib(${k})`, parent?.id);
      t.frame({ caption: `fib(${k}): memo mein nahi → nikaalna padega: fib(${k - 1}) + fib(${k - 2}).`, legend, panels: view(k) });
      const v = go(k - 1, me) + go(k - 2, me);
      memo[k] = v;
      tree.done(me, String(v));
      t.frame({ line: 'save', caption: `fib(${k}) = ${v} → memo[${k}] mein likh liya. Ab kabhi dobara nahi nikalega.`, legend, panels: view(k, 'done') });
      return v;
    };
    const ans = go(n);
    t.frame({ caption: `fib(${n}) = ${ans}. Har k ke liye ek hi baar kaam → O(n) time, O(n) memo + recursion stack. Ye top-down DP (memoization) hai.`, legend, panels: view() });
    return String(ans);
  },
});

// ---------- Example 1: Fibonacci — tabulation, phir do variables ----------
export const tabTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 10, min: 2, max: 15 }],
  run({ n }, t) {
    const dp: (number | null)[] = Array(n + 1).fill(null);
    dp[0] = 0;
    dp[1] = 1;
    const legend = { active: 'abhi bhara', compare: 'pichhle do' };
    const view = (i?: number): Panel[] => [array(dp.map((v) => (v === null ? '·' : v)), { label: 'dp[] (tabulation)', tones: i !== undefined ? { [i]: 'active', [i - 1]: 'compare', [i - 2]: 'compare' } : {}, pointers: i !== undefined ? { i } : {} })];
    t.frame({ caption: 'Tabulation (bottom-up): recursion nahi — chhote se bade tak table bharo. dp[0] = 0, dp[1] = 1.', legend, panels: view() });
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1]! + dp[i - 2]!;
      t.frame({ line: 'fill', caption: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. Dono pehle se bhare — order sahi hai.`, vars: { i }, legend, panels: view(i) });
    }
    t.frame({ caption: `Dekho: dp[i] ko sirf pichhle DO chahiye. Poora array kyun rakhein? Bas do variables — a = fib(i), b = fib(i + 1) — aur khidki aage khiskao.`, legend, panels: view() });
    let a = 0;
    let b = 1;
    const two = (k: number): Panel[] => [array([a, b], { label: `Sirf do variables (i = ${k})`, tones: { 0: 'compare', 1: 'active' } }), ...view()];
    for (let k = 1; k <= n; k++) {
      const c = a + b;
      a = b;
      b = c;
      if (k === 1 || k === n || k % 3 === 0) t.frame({ line: 'slide', caption: `Kadam ${k}: (a, b) = (fib(${k}), fib(${k + 1})) = (${a}, ${b}).`, vars: { k, a, b }, legend, panels: two(k) });
    }
    t.frame({ line: 'done', caption: `fib(${n}) = ${a}. Tabulation O(n) time + O(n) memory; do variables O(n) time + O(1) memory. Seedhi recursion ${2 * (dp[n]! + dp[n - 1]!) - 1} calls karti (exponential).`, legend, panels: two(n) });
    return `tab: ${dp[n]}, two vars: ${a}`;
  },
});

// ---------- Example 2: Climbing stairs ----------
export const stairsTrace = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n (seedhiyan)', default: 5, min: 1, max: 15 }],
  run({ n }, t) {
    const dp: (number | null)[] = Array(n + 1).fill(null);
    dp[0] = 1;
    dp[1] = 1;
    const legend = { active: 'abhi', compare: 'yahan se aa sakte' };
    const view = (i?: number): Panel[] => [array(dp.map((v) => (v === null ? '·' : v)), { label: 'dp[i] = seedhi i tak tareeke', tones: i !== undefined ? { [i]: 'active', [i - 1]: 'compare', [i - 2]: 'compare' } : {}, pointers: i !== undefined ? { i } : {} })];
    t.frame({ line: 'base', caption: 'Ek baar mein 1 ya 2 seedhi. dp[i] = i tak pahunchne ke tareeke. dp[0] = 1 (zameen — kuch mat karo), dp[1] = 1.', legend, panels: view() });
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1]! + dp[i - 2]!;
      t.frame({ line: 'step', caption: `Seedhi ${i} par aakhri kadam: ya ${i - 1} se (1 seedhi) — ${dp[i - 1]} tareeke, ya ${i - 2} se (2 seedhi) — ${dp[i - 2]} tareeke. Alag tareeke, jodo: ${dp[i]}.`, vars: { i, ways: dp[i] }, legend, panels: view(i) });
    }
    t.frame({ line: 'done', caption: `${n} seedhiyon tak ${dp[n]} tareeke. Ye Fibonacci hi hai! O(n) time; do variables se O(1) memory.`, legend, panels: view() });
    return String(dp[n]);
  },
});

// ---------- Example 3: Min cost climbing stairs ----------
export const minCostTrace = tracer<{ cost: number[] }>({
  inputs: [{ name: 'cost', type: 'intArray', label: 'cost[i] (seedhi i se aage badhne ka)', default: [3, 8, 2, 7, 1, 5], minLen: 2, maxLen: 9, min: 0, max: 20 }],
  run({ cost }, t) {
    const n = cost.length;
    const dp: (number | null)[] = Array(n + 1).fill(null);
    dp[0] = 0;
    dp[1] = 0;
    const legend = { active: 'abhi', found: 'sasta raasta', muted: 'mehnga raasta' };
    const view = (i?: number, from?: number): Panel[] => {
      const dt: Tones = {};
      const ct: Tones = {};
      if (i !== undefined) {
        dt[i] = 'active';
        dt[i - 1] = from === i - 1 ? 'found' : 'muted';
        dt[i - 2] = from === i - 2 ? 'found' : 'muted';
        ct[i - 1] = from === i - 1 ? 'found' : 'muted';
        ct[i - 2] = from === i - 2 ? 'found' : 'muted';
      }
      return [
        array(cost, { label: 'cost[]', tones: ct }),
        array(dp.map((v) => (v === null ? '·' : v)), { label: `dp[] (index ${n} = top)`, tones: dt, pointers: i !== undefined ? { i } : {} }),
      ];
    };
    t.frame({ line: 'base', caption: `dp[i] = seedhi i par KHADE hone ka kam se kam kharcha. Shuru 0 ya 1 se — muft: dp[0] = dp[1] = 0. Top = seedhi ${n}.`, legend, panels: view() });
    for (let i = 2; i <= n; i++) {
      const one = dp[i - 1]! + cost[i - 1];
      const two = dp[i - 2]! + cost[i - 2];
      dp[i] = Math.min(one, two);
      t.frame({ line: 'step', caption: `dp[${i}]: ${i - 1} se aao = ${dp[i - 1]} + ${cost[i - 1]} = ${one}; ${i - 2} se aao = ${dp[i - 2]} + ${cost[i - 2]} = ${two}. Kam wala: ${dp[i]}.`, vars: { i, dp: dp[i] }, legend, panels: view(i, one <= two ? i - 1 : i - 2) });
    }
    t.frame({ line: 'done', caption: `Top tak kam se kam ${dp[n]}. Har seedhi ek baar, do options → O(n). Sirf pichhle do chahiye → O(1) memory bhi ho sakta hai.`, legend, panels: view() });
    return String(dp[n]);
  },
});
