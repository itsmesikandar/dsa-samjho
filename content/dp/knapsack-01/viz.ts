import { array, callTree, tracer } from '@/components/viz/engine/tracer';
import type { CallNode, Cell, Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
type GT = Record<string, Tone>;
const itemsCheck = ({ items }: { items: number[][] }) => (items.some((r) => r.length !== 2) ? 'Har row mein do numbers: weight value.' : null);

// ---------- 3. Visual intro: lo / chhodo ka ped — states dobara aate hain ----------
export const choiceTreeTrace = tracer<{ items: number[][]; cap: number }>({
  inputs: [
    { name: 'items', type: 'intGrid', label: 'Items (weight value; …)', default: [[1, 2], [1, 3], [2, 4]], maxRows: 3, maxCols: 2, min: 1, max: 5 },
    { name: 'cap', type: 'int', label: 'Bag capacity', default: 3, min: 0, max: 5 },
  ],
  check: itemsCheck,
  run({ items, cap }, t) {
    const n = items.length;
    const tree = callTree('f(i, w) = item i se aage, jagah w');
    const seen = new Set<string>();
    let calls = 0;
    let repeats = 0;
    const legend = { error: 'ye state pehle bhi aayi', found: 'chhoda (skip)', new: 'liya (take)' };
    t.frame({ caption: `Har item par do raaste: LO (agar jagah hai) ya CHHODO. ${n} items → 2^${n} = ${2 ** n} combinations. Ped dekho — aur dhyaan do kaunsi state (i, w) dobara aati hai.`, legend, panels: [tree.panel()] });
    const go = (i: number, w: number, parent?: CallNode, how?: Tone): number => {
      calls++;
      const key = `${i},${w}`;
      const again = seen.has(key);
      if (again) repeats++;
      const me = tree.push(`f(${i},${w})`, parent?.id, again ? 'error' : how);
      let best = 0;
      if (i < n) {
        best = go(i + 1, w, me, 'found');
        if (items[i][0] <= w) best = Math.max(best, items[i][1] + go(i + 1, w - items[i][0], me, 'new'));
      }
      seen.add(key);
      tree.done(me, String(best), again ? 'error' : how);
      t.frame({ caption: again ? `f(${i},${w}) DOBARA — item ${i} se aage, jagah ${w}: ye sawaal pehle hi solve ho chuka (jawab ${best}). Alag raste se wahi state.` : i === n ? `f(${i},${w}): items khatam → 0.` : `f(${i},${w}) = ${best}: item ${i} (${items[i][0]}kg, ₹${items[i][1]}) chhodo vs lo — jo zyada.`, vars: { calls, repeats }, legend, panels: [tree.panel()] });
      return best;
    };
    const ans = go(0, cap);
    t.frame({ caption: `Best value = ${ans}. ${calls} calls, ${repeats} state(s) dobara. Asli state sirf (i, w) — kul ${n + 1} × ${cap + 1} = ${(n + 1) * (cap + 1)} se zyada nahi. Unhe table mein yaad rakho → knapsack DP, O(n × W).`, vars: { calls, repeats }, legend, panels: [tree.panel()] });
    return String(ans);
  },
});

// ---------- 4. How: knapsack table ----------
export const knapTableTrace = tracer<{ items: number[][]; cap: number }>({
  inputs: [
    { name: 'items', type: 'intGrid', label: 'Items (weight value; …)', default: [[1, 1], [3, 4], [4, 5], [5, 7]], maxRows: 4, maxCols: 2, min: 1, max: 9 },
    { name: 'cap', type: 'int', label: 'Bag capacity', default: 7, min: 0, max: 8 },
  ],
  check: itemsCheck,
  run({ items, cap }, t) {
    const n = items.length;
    const dp: (number | null)[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: cap + 1 }, () => (i === 0 ? 0 : null)));
    const rowLabels = ['0 items', ...items.map(([w, v], k) => `+ (${w}kg,₹${v})`)];
    const colLabels = Array.from({ length: cap + 1 }, (_, w) => String(w));
    const view = (tones: GT = {}): Panel[] => [{ kind: 'grid', label: 'dp[i][w] = pehle i items, jagah w → max value', values: dp.map((r) => r.map((v): Cell => (v === null ? '·' : v))), tones, rowLabels, colLabels, corner: 'i\\w' }];
    const legend = { active: 'abhi', found: 'jeeta (chhodo)', new: 'jeeta (lo)', muted: 'haara' };
    t.frame({ caption: 'Row = kitne items soche, column = bag mein kitni jagah. Pehli row 0 (koi item nahi). Har cell: item chhodo (upar wala) ya lo (upar wali row mein w − weight + value).', legend, panels: view() });
    for (let i = 1; i <= n; i++) {
      const [wt, val] = items[i - 1];
      for (let w = 0; w <= cap; w++) {
        const skip = dp[i - 1][w]!;
        if (wt > w) {
          dp[i][w] = skip;
          t.frame({ line: 'skip', caption: `(${i}, ${w}): item ${wt}kg > jagah ${w} → le hi nahi sakte. Upar wala: ${skip}.`, vars: { i, w }, legend, panels: view({ [`${i},${w}`]: 'active', [`${i - 1},${w}`]: 'found' }) });
          continue;
        }
        const take = dp[i - 1][w - wt]! + val;
        dp[i][w] = Math.max(skip, take);
        const tk = take > skip;
        t.frame({ line: 'take', caption: `(${i}, ${w}): chhodo → ${skip}; lo → dp[${i - 1}][${w - wt}] + ₹${val} = ${take}. Max = ${dp[i][w]}.`, vars: { i, w }, legend, panels: view({ [`${i},${w}`]: 'active', [`${i - 1},${w}`]: tk ? 'muted' : 'found', [`${i - 1},${w - wt}`]: tk ? 'new' : 'muted' }) });
      }
    }
    t.frame({ line: 'done', caption: `Jawab dp[${n}][${cap}] = ${dp[n][cap]}. Table (n + 1) × (W + 1), har cell O(1) → O(n × W). Har row sirf upar wali par depend → 1D array (ulta loop) — code section.`, legend: { found: 'jawab' }, panels: view({ [`${n},${cap}`]: 'found' }) });
    return String(dp[n][cap]);
  },
});

/** subset-sum wala 1D boolean dp: har item ke baad kaunse jod bante hain */
function subsetFrames(nums: number[], limit: number, t: { frame: (f: any) => void }, line: string, label: string) {
  const dp: boolean[] = Array(limit + 1).fill(false);
  dp[0] = true;
  const view = (fresh: number[] = [], extra: Tones = {}): Panel[] => [array(dp.map((b) => (b ? 'T' : '·')), { label, tones: { ...Object.fromEntries(dp.map((b, i) => [i, b ? 'done' : undefined]).filter((x) => x[1])), ...Object.fromEntries(fresh.map((s) => [s, 'new'])), ...extra } })];
  nums.forEach((x, k) => {
    const fresh: number[] = [];
    for (let s = limit; s >= x; s--) if (dp[s - x] && !dp[s]) (dp[s] = true), fresh.push(s);
    t.frame({ line, caption: `Item ${x} (${k + 1}/${nums.length}): ulta chalke, jahan s − ${x} pehle ban chuka tha wahan s bhi.${fresh.length ? ` Naye jod: ${fresh.sort((a, b) => a - b).join(', ')}.` : ' Koi naya jod nahi.'}`, vars: { x }, legend: { done: 'ban sakta', new: 'abhi bana' }, panels: view(fresh) });
  });
  return { dp, view };
}

// ---------- Example 1: Partition equal subset sum ----------
export const partitionTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [3, 1, 5, 9, 2], minLen: 1, maxLen: 7, min: 1, max: 9 }],
  run({ nums }, t) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2) {
      t.frame({ line: 'odd', caption: `Kul ${total} odd hai → do barabar hisse (poore numbers) ho hi nahi sakte. false.`, panels: [array(nums, { label: 'nums' })] });
      return 'false';
    }
    const target = total / 2;
    t.frame({ line: 'loop', caption: `Kul ${total} → har hissa ${target}. Sawaal badla: kya koi subset ka jod ${target}? Ye 0/1 knapsack hai (value ki jagah true/false). dp[s] = jod s ban sakta? dp[0] = T.`, panels: [array(nums, { label: 'nums' })] });
    const { dp, view } = subsetFrames(nums, target, t, 'mark', `dp[0..${target}] (T = ban sakta)`);
    t.frame({ line: 'done', caption: dp[target] ? `dp[${target}] = T → ek hissa ${target}, baaki bhi ${target}. true. O(n × target).` : `dp[${target}] nahi bana → false. O(n × target).`, legend: { found: 'target' }, panels: view([], { [target]: dp[target] ? 'found' : 'error' }) });
    return String(dp[target]);
  },
});

// ---------- Example 2: Last stone weight II ----------
export const stonesTrace = tracer<{ stones: number[] }>({
  inputs: [{ name: 'stones', type: 'intArray', label: 'Patthar ke wazan', default: [6, 3, 8, 2], minLen: 1, maxLen: 7, min: 1, max: 9 }],
  run({ stones }, t) {
    const total = stones.reduce((a, b) => a + b, 0);
    const half = Math.floor(total / 2);
    t.frame({ caption: `Do patthar takraate hain, chhota mit jaata, bada (farak) bachta. Kitna bhi order ho, aakhir mein bacha = |dher A − dher B| (har patthar ya + ya −). Kam karna hai → ek dher total/2 = ${half} ke jitna paas.`, panels: [array(stones, { label: 'stones' })] });
    const { dp, view } = subsetFrames(stones, half, t, 'mark', `dp[0..${half}] (koi dher ka jod)`);
    let s = half;
    while (!dp[s]) s--;
    t.frame({ line: 'best', caption: `${half} tak sabse bada banne wala jod: ${s}. Dher ${s} aur ${total - s} → bacha ${total} − 2 × ${s} = ${total - 2 * s}.`, legend: { found: 'sabse paas' }, panels: view([], { [s]: 'found' }) });
    return String(total - 2 * s);
  },
});

// ---------- Example 3: Target sum (ginti) ----------
export const targetTrace = tracer<{ nums: number[]; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [2, 1, 3, 1], minLen: 1, maxLen: 6, min: 0, max: 6 },
    { name: 'target', type: 'int', label: 'target', default: 3, min: -10, max: 10 },
  ],
  run({ nums, target }, t) {
    const total = nums.reduce((a, b) => a + b, 0);
    if (Math.abs(target) > total || (total + target) % 2 !== 0) {
      t.frame({ line: 'check', caption: `P = (kul ${total} + target ${target}) / 2 — ${Math.abs(target) > total ? 'target kul se bada' : 'poora number nahi'} → koi tareeka nahi, 0.`, panels: [array(nums, { label: 'nums' })] });
      return '0';
    }
    const p = (total + target) / 2;
    const dp: number[] = Array(p + 1).fill(0);
    dp[0] = 1;
    const view = (hot: number[] = [], extra: Tones = {}): Panel[] => [array(nums, { label: 'nums' }), array(dp, { label: `dp[s] = kitne subsets ka jod s (s = 0..${p})`, tones: { ...Object.fromEntries(hot.map((s) => [s, 'new'])), ...extra } })];
    t.frame({ line: 'check', caption: `+ wale ka jod P, − wale ka N: P − N = ${target}, P + N = ${total} → P = ${p}. Ab: kitne subsets ka jod ${p}? (ginti wala knapsack). dp[0] = 1.`, panels: view() });
    nums.forEach((x) => {
      const hot: number[] = [];
      for (let s = p; s >= x; s--) if (dp[s - x]) (dp[s] += dp[s - x]), hot.push(s);
      t.frame({ line: 'count', caption: `Item ${x}: dp[s] += dp[s − ${x}] (ulta). ${x === 0 ? 'Zero: har subset do tarah (+0 / −0) → sab doguna.' : hot.length ? `Badle: ${hot.sort((a, b) => a - b).join(', ')}.` : 'Kuch nahi badla.'}`, vars: { x }, legend: { new: 'abhi badla' }, panels: view(hot) });
    });
    t.frame({ line: 'done', caption: `dp[${p}] = ${dp[p]} tareeke. O(n × P).`, legend: { found: 'jawab' }, panels: view([], { [p]: 'found' }) });
    return String(dp[p]);
  },
});
