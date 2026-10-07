import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { ChartSeries, Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
const pricesSpec = { name: 'prices', type: 'intArray' as const, label: 'Har din ka price', default: [7, 2, 5, 1, 6, 4], minLen: 1, maxLen: 9, min: 1, max: 15 };
/** prices ko chart mein: x = din, y = price */
const priceChart = (prices: number[], extra: ChartSeries[] = [], marker?: number): Panel => ({
  kind: 'chart',
  label: 'Share ka price',
  series: [{ label: 'price', points: prices.map((p, i) => [i, p] as [number, number]), tone: 'muted' }, ...extra],
  marker,
  xLabel: 'din',
  yMax: Math.max(...prices) + 1,
});

// ---------- 3. Visual intro: har chadhaai ka profit ----------
export const climbTrace = tracer<{ prices: number[] }>({
  inputs: [pricesSpec],
  run({ prices }, t) {
    const runs: number[][] = [];
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] <= prices[i - 1]) continue;
      const last = runs[runs.length - 1];
      if (last && last[1] === i - 1) last[1] = i;
      else runs.push([i - 1, i]);
    }
    const series: ChartSeries[] = [];
    let total = 0;
    t.frame({ caption: 'Har din share ka price. Jitni baar chaho khareedo-becho (ek time ek share). Sabse zyada profit kaise?', panels: [priceChart(prices)] });
    runs.forEach(([a, b], k) => {
      const gain = prices[b] - prices[a];
      total += gain;
      series.push({ label: `chadhaai ${k + 1}: +${gain}`, points: prices.slice(a, b + 1).map((p, i) => [a + i, p] as [number, number]), tone: 'found' });
      t.frame({ caption: `Din ${a} (₹${prices[a]}) se din ${b} (₹${prices[b]}) tak continuous chadhaai → khareedo neeche, becho upar: +${gain}. Total ${total}.`, panels: [priceChart(prices, [...series])] });
    });
    t.frame({ caption: runs.length ? `Har chadhaai pakdi, har drop chhodi → ${total}. Isse zyada ho hi nahi sakta: profit sirf chadhaai se aata hai, aur har chadhaai le li. Ye "greedy" — har din ka chhota decision.` : 'Price kabhi nahi chadha → profit 0. Khareedo hi mat.', panels: [priceChart(prices, [...series])] });
    return String(total);
  },
});

// ---------- 4. How: ek baar khareed, ek baar bech (running min) ----------
export const oneTradeTrace = tracer<{ prices: number[] }>({
  inputs: [pricesSpec],
  run({ prices }, t) {
    let minPrice = Infinity;
    let minDay = -1;
    let best = 0;
    let bestPair: number[] = [];
    const view = (i?: number): Panel[] => {
      const extra: ChartSeries[] = [];
      if (bestPair.length) extra.push({ label: `best: +${best}`, points: [[bestPair[0], prices[bestPair[0]]], [bestPair[1], prices[bestPair[1]]]], tone: 'found' });
      const tones: Tones = {};
      if (minDay >= 0) tones[minDay] = 'compare';
      if (i !== undefined) tones[i] = 'active';
      return [priceChart(prices, extra, i), array(prices, { label: 'prices', tones, pointers: i !== undefined ? { aaj: i } : {} })];
    };
    const legend = { compare: 'ab tak ka sabse sasta', active: 'aaj', found: 'sabse achha transaction' };
    t.frame({ line: 'init', caption: 'Ek hi baar khareedna, baad mein ek hi baar bechna. Har pair (khareed din, bech din) dekhna O(n²). Greedy: har din bas ek sawaal — "aaj bechein to ab tak ke SABSE SASTE din se kitna milega?"', legend, panels: view() });
    prices.forEach((p, i) => {
      if (p < minPrice) {
        minPrice = p;
        minDay = i;
        t.frame({ line: 'min', caption: `Din ${i}: ₹${p} ab tak ka sabse sasta → aage ke liye khareedne ka yahi best din. (Aaj bechna bekaar — isse sasta pehle kuch nahi.)`, vars: { minPrice, best }, legend, panels: view(i) });
      } else {
        const gain = p - minPrice;
        if (gain > best) (best = gain), (bestPair = [minDay, i]);
        t.frame({ line: 'sell', caption: `Din ${i}: ₹${p} − sabse sasta ₹${minPrice} = ${gain}. best = ${best}.`, vars: { minPrice, best }, legend, panels: view(i) });
      }
    });
    t.frame({ line: 'done', caption: `Sabse achha: ${bestPair.length ? `din ${bestPair[0]} khareedo, din ${bestPair[1]} becho → ${best}` : 'kabhi nahi — daam girta hi raha, 0'}. Ek pass, O(n), O(1).`, legend, panels: view() });
    return String(best);
  },
});

// ---------- Example 1: Stock II — har chadhaai jodo ----------
export const stockIITrace = tracer<{ prices: number[] }>({
  inputs: [pricesSpec],
  run({ prices }, t) {
    let profit = 0;
    const tones: Tones = {};
    const legend = { found: 'chadhaai — profit liya', muted: 'drop — chhodi', active: 'aaj' };
    const view = (i?: number): Panel[] => [{ kind: 'bars', label: `Price · profit ${profit}`, values: prices, tones: { ...tones, ...(i !== undefined ? { [i]: 'active' } : {}) }, pointers: i !== undefined ? [{ name: 'i', index: i }] : [] }];
    t.frame({ line: 'day', caption: 'Jitni baar chaho khareedo-becho. Bada transaction (din 2 se din 6) = beech ke saare chhote transactions ka jod — to bas har din dekho: aaj kal se mehnga? To "kal khareeda, aaj becha".', legend, panels: view() });
    for (let i = 1; i < prices.length; i++) {
      const d = prices[i] - prices[i - 1];
      if (d > 0) {
        profit += d;
        tones[i] = 'found';
        t.frame({ line: 'up', caption: `Din ${i}: ₹${prices[i]} > kal ₹${prices[i - 1]} → +${d}. Total ${profit}.`, vars: { i, profit }, legend, panels: view(i) });
      } else {
        tones[i] = 'muted';
        t.frame({ line: 'day', caption: `Din ${i}: ₹${prices[i]} ≤ kal ₹${prices[i - 1]} → is din kuch nahi (share pakad ke rakhna ghata deta).`, vars: { i, profit }, legend, panels: view(i) });
      }
    }
    t.frame({ line: 'done', caption: `Total profit ${profit}. O(n), O(1). Continuous chadhaaiyon ka jod = neeche khareed ke upar bechna — same.`, vars: { profit }, legend, panels: view() });
    return String(profit);
  },
});

// ---------- Example 2: Gas station ----------
export const gasTrace = tracer<{ st: number[][] }>({
  inputs: [{ name: 'st', type: 'intGrid', label: 'Stations (gas cost; gas cost; …)', default: [[3, 4], [1, 2], [2, 3], [5, 1], [4, 3]], maxRows: 7, maxCols: 2, min: 0, max: 9 }],
  check: ({ st }) => (st.some((r) => r.length !== 2) ? 'Har row mein 2 numbers: gas cost.' : null),
  run({ st }, t) {
    const n = st.length;
    const diff = st.map(([g, c]) => g - c);
    let total = 0;
    let tank = 0;
    let start = 0;
    const tones: Record<string, Tone> = {};
    const legend = { muted: 'yahan se start bekaar', found: 'abhi ka start', active: 'abhi', error: 'tank minus' };
    const view = (i?: number): Panel[] => {
      const tn: Record<string, Tone> = { ...tones };
      for (let r = 0; r < 3; r++) {
        if (start < n) tn[`${r},${start}`] = 'found';
        if (i !== undefined) tn[`${r},${i}`] = tn[`${r},${i}`] === 'error' ? 'error' : 'active';
      }
      return [{ kind: 'grid', label: `Gol road par stations · tank ${tank}, total ${total}`, values: [st.map((r) => r[0]), st.map((r) => r[1]), diff], rowLabels: ['gas', 'cost', 'gas - cost'], colLabels: st.map((_, k) => String(k)), tones: tn }];
    };
    t.frame({ caption: 'Station i par gas[i] petrol milta hai, agle tak jaane mein cost[i] lagta hai. Kahan se shuru karein ki poora chakkar ho jaaye? Har start try karna O(n²).', legend, panels: view() });
    for (let i = 0; i < n; i++) {
      total += diff[i];
      tank += diff[i];
      if (tank < 0) {
        for (let r = 0; r < 3; r++) for (let k = start; k <= i; k++) tones[`${r},${k}`] = 'muted';
        tones[`2,${i}`] = 'error';
        t.frame({ line: 'reset', caption: `Station ${i}: tank ${tank} < 0 → ${start} se ${i + 1} tak nahi pahunche. ${start}..${i} mein se KOI bhi start nahi chalega (wahan se shuru karke tank aur bhi kam hota). Naya start = ${i + 1}.`, vars: { tank, total, start: i + 1 }, legend, panels: view(i) });
        start = i + 1;
        tank = 0;
      } else {
        t.frame({ line: 'fill', caption: `Station ${i}: ${diff[i] >= 0 ? '+' : ''}${diff[i]} → tank ${tank} (start ${start} se). Total hisaab ${total}.`, vars: { tank, total, start }, legend, panels: view(i) });
      }
    }
    const ans = total >= 0 ? start : -1;
    t.frame({ line: 'done', caption: total >= 0 ? `Total petrol − total cost = ${total} ≥ 0 → chakkar possible, aur start = ${start}. (Jo kami pehle hissa mein thi, wo ${start} se aage ke bache petrol se poori ho jaati hai.) O(n).` : `Total ${total} < 0 → total petrol hi kam — kahin se bhi shuru karo, nahi hoga. -1.`, legend, panels: view() });
    return String(ans);
  },
});

// ---------- Example 3: Partition labels ----------
export const partitionTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'String', default: 'abacdcdeffe', minLen: 1, maxLen: 12, charset: 'abcdef' }],
  run({ s }, t) {
    const last: Record<string, number> = {};
    [...s].forEach((ch, i) => (last[ch] = i));
    const sizes: number[] = [];
    const cuts: number[][] = [];
    let start = 0;
    let end = 0;
    const legend = { active: 'abhi (i)', compare: 'piece abhi yahan tak (end)', found: 'kata hua piece' };
    const view = (i?: number): Panel[] => {
      const tones: Tones = {};
      cuts.forEach(([a, b]) => {
        for (let k = a; k <= b; k++) tones[k] = 'found';
      });
      if (i !== undefined) {
        tones[end] = 'compare';
        tones[i] = 'active';
      }
      return [
        array([...s], { label: 'String', tones, pointers: i !== undefined ? { i, end } : {}, ranges: cuts.map(([a, b]) => ({ from: a, to: b, label: String(b - a + 1) })) }),
        { kind: 'map', label: 'last[letter] = aakhri index', keyLabel: 'letter', valueLabel: 'aakhri', entries: Object.keys(last).sort().map((k) => ({ key: k, value: last[k], tone: i !== undefined && s[i] === k ? ('active' as Tone) : undefined })) },
      ];
    };
    t.frame({ line: 'last', caption: 'Har letter sirf EK pieces mein ho, aur pieces zyada se zyada. Pehle har letter ka aakhri index nikaalo — ek letter ka piece kam se kam uske aakhri index tak jaana hi padega.', legend, panels: view() });
    for (let i = 0; i < s.length; i++) {
      const old = end;
      end = Math.max(end, last[s[i]]);
      if (i === end) {
        t.frame({ line: 'cut', caption: `i = ${i} = end → '${s.slice(start, i + 1)}' ke saare letters ka aakhri yahin tak. Kaato! Size ${i - start + 1}. Jaldi se jaldi kaatna = zyada pieces (greedy).`, vars: { i, end }, legend, panels: view(i) });
        sizes.push(i - start + 1);
        cuts.push([start, i]);
        start = i + 1;
      } else {
        t.frame({ line: 'extend', caption: `'${s[i]}' ka aakhri index ${last[s[i]]} → end = max(${old}, ${last[s[i]]}) = ${end}. Abhi kaat nahi sakte.`, vars: { i, end }, legend, panels: view(i) });
      }
    }
    t.frame({ caption: `Pieces: ${listStr(sizes)}. 2 pass, O(n); last ke liye sirf 26 jagah — O(1).`, legend, panels: view() });
    return listStr(sizes);
  },
});
