import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { ArrRange, Cell, Tone, ToneMap } from '@/components/viz/engine/types';

// ---------- 3. Visual intro: saare subarrays ka map ----------
export const subarraysMap = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [-2, 1, -3, 4, -1, 2], minLen: 1, maxLen: 6, min: -9, max: 9 }],
  run({ arr }, t) {
    const n = arr.length;
    const g: Cell[][] = Array.from({ length: n }, () => Array(n).fill(null));
    const labels = { rowLabels: arr.map((_, i) => `i=${i}`), colLabels: arr.map((_, j) => `j=${j}`), corner: 'sum' };
    let best = -Infinity;
    let bi = 0;
    let bj = 0;
    t.frame({
      caption: `Subarray = array ka CONTINUOUS hissa, jaise arr[i..j]. ${n} items ke ${(n * (n + 1)) / 2} subarrays hote hain. Grid mein har cell (i, j) = arr[i..j] ka sum.`,
      panels: [array(arr), { kind: 'grid', values: g, ...labels }],
    });
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = i; j < n; j++) {
        sum += arr[j];
        g[i][j] = sum;
        if (sum > best) {
          best = sum;
          bi = i;
          bj = j;
        }
      }
      const tones: Record<string, Tone> = {};
      for (let j = i; j < n; j++) tones[`${i},${j}`] = 'new';
      t.frame({
        caption: `Row i = ${i}: arr[${i}] se shuru hone wale saare subarrays. Har agla sum = pichla + ek item. Abhi tak ka max = ${best}.`,
        vars: { i, 'max ab tak': best },
        panels: [array(arr, { ranges: [{ from: i, to: n - 1, label: `start = ${i}` }] }), { kind: 'grid', values: g, tones, ...labels }],
      });
    }
    t.frame({
      caption: `Sabse bada sum ${best} = arr[${bi}..${bj}]. Ye brute force hai: ~n²/2 subarrays, O(n²). Kadane yahi answer ek hi pass (O(n)) mein nikaal deta hai — dekho agle section mein.`,
      vars: { 'max sum': best },
      panels: [array(arr, { ranges: [{ from: bi, to: bj, label: `max = ${best}`, tone: 'found' }] }), { kind: 'grid', values: g, tones: { [`${bi},${bj}`]: 'found' }, ...labels }],
    });
    return String(best);
  },
});

// ---------- 4. How: Kadane ----------
export const kadaneTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [-2, 1, -3, 4, -1, 2, 1, -5, 4], minLen: 1, maxLen: 10, min: -20, max: 20 }],
  run({ nums }, t) {
    let cur = nums[0];
    let best = nums[0];
    let start = 0;
    let bl = 0;
    let br = 0;
    const view = (i: number, extra: ToneMap = {}) => {
      const ranges: ArrRange[] = [{ from: start, to: i, label: `cur = ${cur}`, tone: 'active' }];
      if (!(bl === start && br === i)) ranges.push({ from: bl, to: br, label: `best = ${best}`, tone: 'found' });
      return array(nums, { ranges, tones: extra, pointers: { i } });
    };
    t.frame({ line: 'init', caption: `cur = best = nums[0] = ${cur}. cur = "jo subarray ABHI i par khatam hota hai, uska best sum".`, vars: { cur, best }, panels: [view(0)] });
    for (let i = 1; i < nums.length; i++) {
      const extend = cur + nums[i];
      const restart = nums[i] > extend;
      cur = restart ? nums[i] : extend;
      if (restart) start = i;
      t.frame({
        line: 'choose',
        caption: restart
          ? `Purana cur negative tha — load hai. ${nums[i]} akela (${nums[i]}) > saath mein (${extend}). Yahin se naya subarray shuru: cur = ${cur}.`
          : `Purana sum saath lo: ${extend - nums[i]} + ${nums[i]} = ${extend} (akela ${nums[i]} se better ya barabar). cur = ${cur}.`,
        vars: { i, cur, best },
        panels: [view(i, { [i]: restart ? 'new' : 'compare' })],
      });
      if (cur > best) {
        best = cur;
        bl = start;
        br = i;
        t.frame({ line: 'best', caption: `cur (${cur}) > best → naya record! best = ${best}, range [${bl}..${br}].`, vars: { i, cur, best }, panels: [view(i, { [i]: 'found' })] });
      }
    }
    t.frame({
      line: 'done',
      caption: `Answer ${best} (range [${bl}..${br}]). Har item par sirf ek decision — "jodun ya naya shuru karun?" → O(n), sirf 2 variables → O(1) space.`,
      vars: { best },
      panels: [array(nums, { ranges: [{ from: bl, to: br, label: `best = ${best}`, tone: 'found' }] })],
    });
    return String(best);
  },
});

// ---------- Example 1: stock buy-sell ----------
export const stockTrace = tracer<{ prices: number[] }>({
  inputs: [{ name: 'prices', type: 'intArray', label: 'Har din ka price', default: [7, 1, 5, 3, 6, 4], minLen: 1, maxLen: 10, min: 1, max: 20 }],
  run({ prices }, t) {
    let minPrice = prices[0];
    let mi = 0;
    let best = 0;
    let buy = 0;
    let sell = 0;
    const bars = (i: number, tones: ToneMap = {}) => ({ kind: 'bars' as const, label: 'price (din ke hisaab se)', values: [...prices], tones: { [mi]: 'found' as Tone, ...tones }, pointers: [{ name: 'min', index: mi }, ...(i !== mi ? [{ name: 'i', index: i }] : [])] });
    t.frame({ line: 'init', caption: `minPrice = ${minPrice} (din 0). Har din socho: "agar aaj bechun aur ab tak ke SABSE SASTE din kharida ho, to kitna fayda?"`, vars: { minPrice, best }, legend: { found: 'sabse sasta din' }, panels: [bars(0)] });
    for (let i = 1; i < prices.length; i++) {
      const profit = prices[i] - minPrice;
      const better = profit > best;
      if (better) {
        best = profit;
        buy = mi;
        sell = i;
      }
      t.frame({
        line: 'sell',
        caption: `Din ${i}: aaj becho → ${prices[i]} − ${minPrice} = ${profit}.${better ? ` Naya best profit = ${best}!` : ` best (${best}) wahi.`}`,
        vars: { i, minPrice, best },
        legend: { found: 'sabse sasta din', compare: 'aaj', done: 'naya best' },
        panels: [bars(i, { [i]: better ? 'done' : 'compare' })],
      });
      if (prices[i] < minPrice) {
        minPrice = prices[i];
        mi = i;
        t.frame({ line: 'min', caption: `${prices[i]} ab tak ka sabse sasta din hai → minPrice = ${minPrice}. Aage ke din isse compare honge.`, vars: { i, minPrice, best }, legend: { found: 'sabse sasta din' }, panels: [bars(i)] });
      }
    }
    t.frame({
      line: 'done',
      caption: best > 0 ? `Best: din ${buy} kharido (${prices[buy]}), din ${sell} becho (${prices[sell]}) → profit ${best}. Kadane jaisa: ek pass, "ab tak ka min" yaad rakha → O(n).` : 'Price girte hi rahe — koi fayda nahi, answer 0 (na kharido).',
      vars: { best },
      legend: { found: 'kharido', done: 'becho' },
      panels: [{ kind: 'bars', label: 'price', values: [...prices], tones: best > 0 ? { [buy]: 'found', [sell]: 'done' } : {} }],
    });
    return String(best);
  },
});

// ---------- Example 2: range bhi chahiye ----------
export const rangeTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [-2, 1, -3, 4, -1, 2, 1, -5, 4], minLen: 1, maxLen: 10, min: -20, max: 20 }],
  run({ nums }, t) {
    let cur = nums[0];
    let curStart = 0;
    let best = nums[0];
    let bl = 0;
    let br = 0;
    const view = (i: number, tones: ToneMap = {}) =>
      array(nums, {
        tones,
        pointers: { curStart, i },
        ranges: [{ from: curStart, to: i, label: `cur = ${cur}`, tone: 'active' }, ...(bl === curStart && br === i ? [] : [{ from: bl, to: br, label: `best = ${best}`, tone: 'found' as Tone }])],
      });
    t.frame({ line: 'init', caption: `cur = ${cur}, curStart = 0, best = ${best} (range [0..0]).`, vars: { cur, best, bestL: bl, bestR: br }, panels: [view(0)] });
    for (let i = 1; i < nums.length; i++) {
      if (cur < 0) {
        const old = cur;
        cur = nums[i];
        curStart = i;
        t.frame({ line: 'restart', caption: `cur (${old}) negative hai — isko saath le jaana nuksaan. curStart = ${i}, cur = ${cur}.`, vars: { i, cur, curStart }, panels: [view(i, { [i]: 'new' })] });
      } else {
        cur += nums[i];
        t.frame({ line: 'extend', caption: `cur (${cur - nums[i]}) ≥ 0 — faydemand hai, jodo: cur = ${cur}. Range [${curStart}..${i}].`, vars: { i, cur, curStart }, panels: [view(i, { [i]: 'compare' })] });
      }
      if (cur > best) {
        best = cur;
        bl = curStart;
        br = i;
        t.frame({ line: 'best', caption: `Naya record ${best} → bestL = ${bl}, bestR = ${br} (range bhi save ki).`, vars: { best, bestL: bl, bestR: br }, panels: [view(i, { [i]: 'found' })] });
      }
    }
    t.frame({
      line: 'done',
      caption: `Answer [${best}, ${bl}, ${br}]. Range ke liye sirf ek extra cheez yaad rakhni thi — cur kahan se shuru hua (curStart).`,
      panels: [array(nums, { ranges: [{ from: bl, to: br, label: `best = ${best}`, tone: 'found' }] })],
    });
    return listStr([best, bl, br]);
  },
});

// ---------- Example 3: circular ----------
export const circularTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'Circular nums', default: [5, -3, 5], minLen: 1, maxLen: 8, min: -9, max: 9 }],
  run({ nums }, t) {
    const n = nums.length;
    let curMax = 0;
    let maxStart = 0;
    let best = nums[0];
    let bl = 0;
    let br = 0;
    let curMin = 0;
    let minStart = 0;
    let worst = nums[0];
    let wl = 0;
    let wr = 0;
    let total = 0;
    const ranges = (): ArrRange[] => [
      { from: bl, to: br, label: `max = ${best}`, tone: 'found' },
      { from: wl, to: wr, label: `min = ${worst}`, tone: 'error' },
    ];
    const legend = { found: 'sabse bada (normal)', error: 'sabse chhota (beech ka)' };
    t.frame({ caption: 'Do Kadane saath chalayenge: ek MAX subarray ke liye (normal), ek MIN subarray ke liye (ulta). Saath mein total bhi.', legend, panels: [array(nums)] });
    nums.forEach((x, i) => {
      if (curMax < 0) {
        curMax = x;
        maxStart = i;
      } else curMax += x;
      if (curMax > best) {
        best = curMax;
        bl = maxStart;
        br = i;
      }
      t.frame({ line: 'max', caption: `Max-Kadane: curMax = ${curMax}, best = ${best}.`, vars: { i, curMax, best, total: total + x }, legend, panels: [array(nums, { pointers: { i }, ranges: ranges() })] });
      if (curMin > 0) {
        curMin = x;
        minStart = i;
      } else curMin += x;
      if (curMin < worst) {
        worst = curMin;
        wl = minStart;
        wr = i;
      }
      total += x;
      t.frame({ line: 'min', caption: `Min-Kadane: curMin = ${curMin}, worst = ${worst}. (Same logic, bas chhota dhoondh rahe hain.)`, vars: { i, curMin, worst, total }, legend, panels: [array(nums, { pointers: { i }, ranges: ranges() })] });
    });
    let ans: number;
    if (best < 0) {
      ans = best;
      t.frame({ line: 'done', caption: `Sab numbers negative hain (best = ${best} < 0). total − worst = 0 matlab "kuch mat lo" — wo allowed nahi. Answer = best = ${ans}.`, vars: { best, worst, total }, legend, panels: [array(nums, { ranges: [{ from: bl, to: br, label: `answer = ${ans}`, tone: 'found' }] })] });
    } else if (total - worst > best) {
      ans = total - worst;
      const tones: ToneMap = {};
      for (let k = 0; k < n; k++) tones[k] = k >= wl && k <= wr ? 'muted' : 'found';
      t.frame({
        line: 'done',
        caption: `Wrap wala answer: total (${total}) − beech ka sabse bura hissa (${worst}) = ${ans} > normal best (${best}). Dono edges ke items ek saath (wrap karke) lo!`,
        vars: { best, worst, total, answer: ans },
        legend: { found: 'liya (wrap)', muted: 'chhoda (min hissa)' },
        panels: [array(nums, { tones })],
      });
    } else {
      ans = best;
      t.frame({ line: 'done', caption: `Wrap se fayda nahi: total − worst = ${total - worst} ≤ best = ${best}. Answer = ${ans}.`, vars: { best, worst, total }, legend, panels: [array(nums, { ranges: [{ from: bl, to: br, label: `answer = ${ans}`, tone: 'found' }] })] });
    }
    return String(ans);
  },
});
