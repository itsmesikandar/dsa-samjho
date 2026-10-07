import { array, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
type GT = Record<string, Tone>;
const INF = Number.POSITIVE_INFINITY;
const show = (v: number): Cell => (v === INF ? '∞' : v);

/** price list ek row ki grid — column label = pieces ki length (1..n) */
const priceRow = (prices: number[], tones: GT = {}): Panel => ({
  kind: 'grid',
  label: 'Price: length → ₹',
  values: [prices],
  tones,
  rowLabels: ['₹'],
  colLabels: prices.map((_, k) => String(k + 1)),
  corner: 'len',
});

// ---------- 3. Visual intro: rod kaatne ke saare tareeke ----------
export const rodCutsTrace = tracer<{ prices: number[] }>({
  inputs: [{ name: 'prices', type: 'intArray', label: 'Price (length 1, 2, 3…)', default: [2, 5, 9, 10, 12], minLen: 1, maxLen: 6, min: 1, max: 20 }],
  run({ prices }, t) {
    const n = prices.length;
    const cuts: number[][] = [];
    const gen = (rem: number, maxPart: number, parts: number[]) => {
      if (rem === 0) return void cuts.push([...parts]);
      for (let p = Math.min(rem, maxPart); p >= 1; p--) gen(rem - p, p, [...parts, p]);
    };
    gen(n, n, []);
    const worth = (c: number[]) => c.reduce((s, p) => s + prices[p - 1], 0);
    t.frame({ caption: `Rod ${n} metre ki. Pieces kaat ke becho — har length ka price alag, aur ek length ke pieces KITNE BHI kaat sakte ho. Kaise kaatein ki profit max ho? Pehle har tareeka count kar ke dekhte hain.`, panels: [priceRow(prices)] });
    let best = -1;
    let bestCut: number[] = [];
    cuts.forEach((c, k) => {
      const v = worth(c);
      const isNew = v > best;
      if (isNew) (best = v), (bestCut = c);
      const tones: GT = Object.fromEntries(c.map((p) => [`0,${p - 1}`, 'new' as Tone]));
      t.frame({ caption: `Tareeka ${k + 1}: ${c.join(' + ')} → ${c.map((p) => `₹${prices[p - 1]}`).join(' + ')} = ₹${v}.${isNew ? ' Ab tak ka best!' : ''}`, vars: { kamai: v, best }, legend: { new: 'ye length use hui' }, panels: [priceRow(prices, tones), array(c, { label: `Pieces (tareeka ${k + 1} / ${cuts.length})`, hideIndex: true })] });
    });
    t.frame({ caption: `Best: ${bestCut.join(' + ')} = ₹${best}. Length ${n} ke ${cuts.length} tareeke — par length 50 ke 2 lakh se zyada, 100 ke ~19 crore. Dhyaan do: ek piece kaatne ke baad bachi hui rod wahi sawaal hai, chhote size par. dp[len] = len wali rod ki best profit → har length ek baar.`, vars: { best }, legend: { found: 'best tareeka' }, panels: [priceRow(prices, Object.fromEntries(bestCut.map((p) => [`0,${p - 1}`, 'found' as Tone]))), array(bestCut, { label: 'Best pieces', hideIndex: true, tones: Object.fromEntries(bestCut.map((_, i) => [i, 'found' as Tone])) })] });
    return String(best);
  },
});

// ---------- 4. How: rod cutting table (unbounded knapsack) ----------
export const rodTableTrace = tracer<{ prices: number[] }>({
  inputs: [{ name: 'prices', type: 'intArray', label: 'Price (length 1, 2, 3…)', default: [2, 5, 9, 10, 12], minLen: 1, maxLen: 6, min: 1, max: 20 }],
  run({ prices }, t) {
    const n = prices.length;
    const dp: (number | null)[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: n + 1 }, () => (i === 0 ? 0 : null)));
    const rowLabels = ['koi nahi', ...prices.map((p, k) => `+ len ${k + 1} (₹${p})`)];
    const colLabels = Array.from({ length: n + 1 }, (_, w) => String(w));
    const view = (tones: GT = {}): Panel[] => [{ kind: 'grid', label: 'dp[i][w] = length 1..i ke pieces, rod w → max profit', values: dp.map((r) => r.map((v): Cell => (v === null ? '·' : v))), tones, rowLabels, colLabels, corner: 'i\\w' }];
    const legend = { active: 'abhi', found: 'jeeta (mat kaato)', new: 'jeeta (kaato)', muted: 'haara' };
    t.frame({ caption: 'Row i = length 1 se i tak ke pieces allowed, column w = rod kitni lambi. 0/1 knapsack se EK hi farak: "kaato" wala option ISI row se aata hai (dp[i][w − i]) — kyunki length i ka piece phir se kaat sakte ho.', legend, panels: view() });
    for (let i = 1; i <= n; i++) {
      const p = prices[i - 1];
      for (let w = 0; w <= n; w++) {
        const skip = dp[i - 1][w]!;
        if (i > w) {
          dp[i][w] = skip;
          t.frame({ line: 'skip', caption: `(${i}, ${w}): length ${i} ka piece ${w} wali rod se lamba → kaat hi nahi sakte. Upar wala: ${skip}.`, vars: { i, w }, legend, panels: view({ [`${i},${w}`]: 'active', [`${i - 1},${w}`]: 'found' }) });
          continue;
        }
        const take = dp[i][w - i]! + p;
        dp[i][w] = Math.max(skip, take);
        const tk = take > skip;
        t.frame({ line: 'take', caption: `(${i}, ${w}): mat kaato → ${skip}; kaato → dp[${i}][${w - i}] (isi row — bachi rod mein ${i} phir kaat sakte) + ₹${p} = ${take}. Max = ${dp[i][w]}.`, vars: { i, w }, legend, panels: view({ [`${i},${w}`]: 'active', [`${i - 1},${w}`]: tk ? 'muted' : 'found', [`${i},${w - i}`]: tk ? 'new' : 'muted' }) });
      }
    }
    t.frame({ line: 'done', caption: `Jawab dp[${n}][${n}] = ₹${dp[n][n]}. O(n × W). Har row khud ko aur upar wali ko padhti hai → 1D array, loop SEEDHA (code section).`, legend: { found: 'jawab' }, panels: view({ [`${n},${n}`]: 'found' }) });
    return String(dp[n][n]);
  },
});

// ---------- Example 1: Coin change (kam se kam coins) ----------
export const coinMinTrace = tracer<{ coins: number[]; amount: number }>({
  inputs: [
    { name: 'coins', type: 'intArray', label: 'Coins', default: [1, 3, 4], minLen: 1, maxLen: 4, min: 1, max: 9, distinct: true },
    { name: 'amount', type: 'int', label: 'amount', default: 6, min: 0, max: 15 },
  ],
  run({ coins, amount }, t) {
    const dp: number[] = Array(amount + 1).fill(INF);
    const last: number[] = Array(amount + 1).fill(0);
    dp[0] = 0;
    const view = (tones: Tones = {}): Panel[] => [array(coins, { label: 'coins' }), array(dp.map(show), { label: `dp[a] = amount a ke kam se kam coins (a = 0..${amount})`, tones })];
    const legend = { active: 'abhi', compare: 'option', new: 'best option' };
    t.frame({ caption: 'dp[0] = 0 (kuch nahi dena), baaki ∞ (abhi pata nahi). Har amount a par socho: AAKHRI coin kaunsa? Coin c → baaki a − c ka best + 1.', panels: view() });
    for (let a = 1; a <= amount; a++) {
      const opts = coins.filter((c) => c <= a && dp[a - c] !== INF);
      for (const c of opts) if (dp[a - c] + 1 < dp[a]) (dp[a] = dp[a - c] + 1), (last[a] = c);
      const tones: Tones = { ...Object.fromEntries(opts.map((c) => [a - c, 'compare' as Tone])), [a]: 'active' };
      if (dp[a] !== INF) tones[a - last[a]] = 'new';
      const parts = coins.filter((c) => c <= a).map((c) => `${c} → ${dp[a - c] === INF ? '∞' : `${dp[a - c]} + 1`}`);
      t.frame({ line: 'try', caption: `a = ${a}: ${parts.length ? `aakhri sikka ${parts.join(', ')}.` : 'koi sikka itna chhota nahi.'} ${dp[a] === INF ? 'Nahi ban sakta → ∞.' : `Min = ${dp[a]}.`}`, vars: { a }, legend, panels: view(tones) });
    }
    const ans = dp[amount] === INF ? -1 : dp[amount];
    const used: number[] = [];
    for (let a = amount; ans > 0 && a > 0; a -= last[a]) used.push(last[a]);
    let rem = amount;
    const greedy: number[] = [];
    for (const c of [...coins].sort((x, y) => y - x)) while (c <= rem) (greedy.push(c), (rem -= c));
    const g = rem ? 'atak gaya (pura hi nahi bana)' : `${greedy.join(' + ')} = ${greedy.length} coins`;
    t.frame({ line: 'done', caption: ans < 0 ? `dp[${amount}] = ∞ → -1, ye amount ban hi nahi sakta. O(amount × coins).` : `Jawab ${ans}${ans ? ` (${used.join(' + ')})` : ''}. Greedy (bada coin pehle) → ${g}. O(amount × coins).`, legend: { found: 'jawab' }, panels: view({ [amount]: ans < 0 ? 'error' : 'found' }) });
    return String(ans);
  },
});

/** coins bahar → combinations; amount bahar → order wali sequences */
const countCombos = (coins: number[], amount: number) => {
  const dp: number[] = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) for (let a = c; a <= amount; a++) dp[a] += dp[a - c];
  return dp[amount];
};
const countSequences = (nums: number[], target: number) => {
  const dp: number[] = Array(target + 1).fill(0);
  dp[0] = 1;
  for (let s = 1; s <= target; s++) for (const x of nums) if (x <= s) dp[s] += dp[s - x];
  return dp[target];
};

// ---------- Example 2: Coin change II (combinations count karna) ----------
export const coinWaysTrace = tracer<{ coins: number[]; amount: number }>({
  inputs: [
    { name: 'coins', type: 'intArray', label: 'Coins', default: [1, 2, 3], minLen: 1, maxLen: 4, min: 1, max: 9, distinct: true },
    { name: 'amount', type: 'int', label: 'amount', default: 4, min: 0, max: 12 },
  ],
  run({ coins, amount }, t) {
    const dp: number[] = Array(amount + 1).fill(0);
    dp[0] = 1;
    const view = (hot: number[] = [], extra: Tones = {}): Panel[] => [array(coins, { label: 'coins' }), array(dp, { label: `dp[a] = kitne combinations se amount a (a = 0..${amount})`, tones: { ...Object.fromEntries(hot.map((a) => [a, 'new' as Tone])), ...extra } })];
    t.frame({ line: 'coin', caption: 'dp[0] = 1 (kuch na do — ek tareeka). COINS BAHAR wala loop: pehle sirf pehla coin use karke saare amounts, phir doosra coin bhi milao… Har combination coins ke ek fixed order mein banta — ek hi baar gina jaata.', panels: view() });
    coins.forEach((c, k) => {
      const hot: number[] = [];
      for (let a = c; a <= amount; a++) if (dp[a - c]) (dp[a] += dp[a - c]), hot.push(a);
      t.frame({ line: 'add', caption: `Coin ${c} (${k + 1}/${coins.length}): a = ${c} se ${amount} tak SEEDHA, dp[a] += dp[a − ${c}]. Seedha isliye ki dp[a − ${c}] mein ${c} pehle se ho sakta hai — ${c} kitni bhi baar.${hot.length ? ` Badle: ${hot.join(', ')}.` : ' Kuch nahi badla.'}`, vars: { c }, legend: { new: 'abhi badla' }, panels: view(hot) });
    });
    const perms = countSequences(coins, amount);
    t.frame({ line: 'done', caption: `dp[${amount}] = ${dp[amount]} combinations. Loops ulte karte (amount bahar, coins andar) → ${perms} aata — wo 1 + 2 aur 2 + 1 ko alag count karta hai (order wali sequences). Agla example wahi hai.`, legend: { found: 'jawab' }, panels: view([], { [amount]: 'found' }) });
    return String(dp[amount]);
  },
});

// ---------- Example 3: Combination sum IV (order matter karta) ----------
export const comboTrace = tracer<{ nums: number[]; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [1, 3, 4], minLen: 1, maxLen: 4, min: 1, max: 9, distinct: true },
    { name: 'target', type: 'int', label: 'target', default: 5, min: 1, max: 12 },
  ],
  run({ nums, target }, t) {
    const dp: number[] = Array(target + 1).fill(0);
    dp[0] = 1;
    const view = (tones: Tones = {}): Panel[] => [array(nums, { label: 'nums' }), array(dp, { label: `dp[s] = kitni sequences ka jod s (s = 0..${target})`, tones })];
    t.frame({ caption: 'dp[0] = 1 (khaali sequence). Ab TARGET BAHAR: har s par socho — sequence ka AAKHRI number kaunsa? x aakhri hai to pehle s − x tak koi bhi sequence. Sab options jodo.', panels: view() });
    for (let s = 1; s <= target; s++) {
      const opts = nums.filter((x) => x <= s);
      for (const x of opts) dp[s] += dp[s - x];
      const tones: Tones = { ...Object.fromEntries(opts.filter((x) => dp[s - x]).map((x) => [s - x, 'compare' as Tone])), [s]: 'active' };
      t.frame({ line: 'add', caption: `s = ${s}: ${opts.length ? `aakhri ${opts.map((x) => `${x} → dp[${s - x}] = ${dp[s - x]}`).join(', ')}. Jod = ${dp[s]}.` : 'koi number itna chhota nahi → 0.'}`, vars: { s }, legend: { active: 'abhi', compare: 'yahan se aaye' }, panels: view(tones) });
    }
    const combos = countCombos(nums, target);
    t.frame({ line: 'done', caption: `dp[${target}] = ${dp[target]} sequences. Coin Change II wala order (numbers bahar) yahan ${combos} deta — sirf combinations. Ye asal mein climbing stairs hai: stairs ${target}, ek baar mein ${nums.join(' / ')} chadh sakte.`, legend: { found: 'jawab' }, panels: view({ [target]: 'found' }) });
    return String(dp[target]);
  },
});
