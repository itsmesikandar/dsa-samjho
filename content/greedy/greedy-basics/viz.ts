import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;

// ---------- 3. Visual intro: coins — greedy kab sahi, kab galat ----------
export const coinsTrace = tracer<{ coins: number[]; amount: number }>({
  inputs: [
    { name: 'coins', type: 'intArray', label: 'Coins (alag alag, chhote se bade)', default: [1, 3, 4], minLen: 1, maxLen: 4, min: 1, max: 12, sorted: true, distinct: true },
    { name: 'amount', type: 'int', label: 'Amount', default: 6, min: 1, max: 30 },
  ],
  run({ coins, amount }, t) {
    const desc = [...coins].sort((a, b) => b - a);
    const taken: number[] = [];
    let left = amount;
    const view = (k?: number, extra: Panel[] = []): Panel[] => [
      array(desc, { label: 'Coins (bade pehle)', pointers: k !== undefined ? { c: k } : {}, tones: k !== undefined ? { [k]: 'active' } : {} }),
      array(taken, { label: `Greedy ke coins · bacha ${left}`, tones: Object.fromEntries(taken.map((_, i) => [i, 'compare'])) }),
      ...extra,
    ];
    t.frame({ caption: `${amount} banane hain, kam se kam coins mein. Greedy soch: "har baar sabse BADA coin jo fit ho". Bharat ke coins (1, 2, 5, 10) par ye hamesha sahi hai. Kya har set par?`, panels: view() });
    desc.forEach((c, k) => {
      const n = Math.floor(left / c);
      for (let i = 0; i < n; i++) taken.push(c);
      left -= n * c;
      t.frame({ caption: n ? `${c} ka coin ${n} baar fit → ${n} × ${c} liya, bacha ${left}.` : `${c} bada hai (bacha ${left}) → skip.`, vars: { coin: c, left }, panels: view(k) });
    });
    const greedy = left === 0 ? taken.length : -1;
    // DP se sabse kam (sirf comparison ke liye)
    const INF = 1e9;
    const dp: number[] = Array(amount + 1).fill(INF);
    const pick: number[] = Array(amount + 1).fill(0);
    dp[0] = 0;
    for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) (dp[a] = dp[a - c] + 1), (pick[a] = c);
    const best: number[] = [];
    if (dp[amount] < INF) for (let a = amount; a > 0; a -= pick[a]) best.push(pick[a]);
    const bestN = dp[amount] < INF ? dp[amount] : -1;
    const bestPanel = array(best, { label: 'Sabse kam (sab tareeke dekh ke — DP)', tones: Object.fromEntries(best.map((_, i) => [i, 'found'])) });
    if (greedy === bestN) {
      t.frame({ caption: greedy < 0 ? `Greedy se ${amount} ban hi nahi paaya, aur kisi tareeke se bhi nahi — ye coins kaafi nahi.` : `Greedy: ${greedy} coins = sabse kam bhi ${bestN}. Yahan greedy jeet gaya — par ye "coincidence" hai ya "guarantee", saabit karna padta hai.`, legend: { compare: 'greedy', found: 'best' }, panels: view(undefined, [bestPanel]) });
    } else {
      t.frame({ caption: `Greedy: ${greedy < 0 ? `fail (${left} bacha, chhota sikka nahi)` : `${greedy} sikke`}. Par ${listStr(best)} = sirf ${bestN} coins! Bada coin pehle lena yahan GALAT tha. Greedy tabhi lagao jab saabit ho ki "abhi ka best" kabhi pachhtaata nahi.`, legend: { compare: 'greedy', found: 'best' }, panels: view(undefined, [bestPanel]) });
    }
    return `greedy ${greedy}, best ${bestN}`;
  },
});

// ---------- 4. How: budget mein zyada se zyada cheezein (sasti pehle) ----------
export const itemsTrace = tracer<{ costs: number[]; budget: number }>({
  inputs: [
    { name: 'costs', type: 'intArray', label: 'Price', default: [6, 2, 9, 3, 1, 4], minLen: 1, maxLen: 8, min: 1, max: 20 },
    { name: 'budget', type: 'int', label: 'Budget', default: 10, min: 0, max: 40 },
  ],
  run({ costs, budget }, t) {
    const sorted = [...costs].sort((a, b) => a - b);
    const st: Tones = {};
    let left = budget;
    let count = 0;
    const legend = { found: 'khareeda', active: 'abhi', error: 'paisa kam' };
    const view = (i?: number): Panel[] => [array(sorted, { label: `Price (sorted) · bacha ₹${left}`, tones: st, pointers: i !== undefined ? { i } : {}, ranges: count ? [{ from: 0, to: count - 1, label: `${count} liye` }] : [] })];
    t.frame({ line: 'sort', caption: `Zyada se zyada CHEEZEIN chahiye (price nahi). Greedy: hamesha sabse sasti. Sort: ${listStr(sorted)}. Kyun sahi? Koi bhi jawab jisme mehngi li aur sasti chhodi — use sasti se badlo, paisa bachega, count utni hi.`, legend, panels: view() });
    for (let i = 0; i < sorted.length; i++) {
      const c = sorted[i];
      if (c > left) {
        st[i] = 'error';
        t.frame({ line: 'stop', caption: `₹${c} > bacha ₹${left} → nahi le sakte. Aage sab isse mehngi (sorted!) → ruko.`, vars: { c, left, count }, legend, panels: view(i) });
        break;
      }
      left -= c;
      count++;
      st[i] = 'found';
      t.frame({ line: 'take', caption: `₹${c} — abhi ki sabse sasti, li. Bacha ₹${left}, count ${count}.`, vars: { c, left, count }, legend, panels: view(i) });
    }
    t.frame({ line: 'done', caption: `${count} cheezein. Sort O(n log n) + ek pass O(n).`, vars: { count }, legend, panels: view() });
    return String(count);
  },
});

// ---------- Example 1: Assign cookies ----------
export const cookiesTrace = tracer<{ g: number[]; s: number[] }>({
  inputs: [
    { name: 'g', type: 'intArray', label: 'Bachchon ki bhookh (g)', default: [3, 1, 5, 2], minLen: 1, maxLen: 6, min: 1, max: 9 },
    { name: 's', type: 'intArray', label: 'Cookie size (s)', default: [2, 4, 1, 3], minLen: 1, maxLen: 6, min: 1, max: 9 },
  ],
  run({ g: g0, s: s0 }, t) {
    const g = [...g0].sort((a, b) => a - b);
    const s = [...s0].sort((a, b) => a - b);
    const gt: Tones = {};
    const sc: Tones = {};
    let child = 0;
    let cookie = 0;
    const legend = { found: 'khush / di gayi', muted: 'bekaar cookie', active: 'abhi' };
    const view = (): Panel[] => [
      array(g, { label: 'Bhookh (sorted)', tones: { ...gt, ...(child < g.length ? { [child]: 'active' } : {}) }, pointers: child < g.length ? { child } : {} }),
      array(s, { label: 'Cookies (sorted)', tones: { ...sc, ...(cookie < s.length ? { [cookie]: 'active' } : {}) }, pointers: cookie < s.length ? { cookie } : {} }),
    ];
    t.frame({ line: 'sort', caption: 'Dono sort. Sabse kam bhookh wale bachche ko wo sabse CHHOTI cookie do jo use khush kar de — badi cookies zyada bhookhe bachchon ke liye bachao.', legend, panels: view() });
    while (child < g.length && cookie < s.length) {
      if (s[cookie] >= g[child]) {
        gt[child] = 'found';
        sc[cookie] = 'found';
        t.frame({ line: 'give', caption: `Cookie ${s[cookie]} ≥ bhookh ${g[child]} → de do. Isse chhoti koi cookie is bachche ke kaam ki nahi thi, to kuch barbaad nahi hua.`, vars: { child, cookie }, legend, panels: view() });
        child++;
      } else {
        sc[cookie] = 'muted';
        t.frame({ line: 'next', caption: `Cookie ${s[cookie]} < bhookh ${g[child]} → ye sabse kam bhookh wale ko bhi nahi chalti, to kisi ko nahi chalegi. Phenk do, agli cookie.`, vars: { child, cookie }, legend, panels: view() });
      }
      cookie++;
    }
    t.frame({ line: 'done', caption: `${child} bachche khush. ${child === g.length ? 'Sab ko mil gayi.' : 'Cookies khatam.'} Sort O(n log n + m log m), phir ek pass.`, vars: { content: child }, legend, panels: view() });
    return String(child);
  },
});

// ---------- Example 2: Lemonade change ----------
const NOTE = [5, 10, 20];
export const lemonadeTrace = tracer<{ notes: number[] }>({
  inputs: [{ name: 'notes', type: 'intArray', label: 'Customers ke note (1 = ₹5, 2 = ₹10, 3 = ₹20)', default: [1, 1, 1, 1, 2, 3, 2], minLen: 1, maxLen: 8, min: 1, max: 3 }],
  run({ notes }, t) {
    const bills = notes.map((x) => NOTE[x - 1]);
    let five = 0;
    let ten = 0;
    const st: Tones = {};
    const legend = { found: 'chhutta diya', error: 'chhutta nahi', active: 'abhi' };
    const view = (i?: number): Panel[] => [
      array(bills.map((b) => `₹${b}`), { label: 'Line mein customers (lemonade ₹5)', tones: { ...st, ...(i !== undefined ? { [i]: 'active' } : {}) }, pointers: i !== undefined ? { i } : {} }),
      { kind: 'map', label: 'Cash box', keyLabel: 'note', valueLabel: 'kitne', entries: [{ key: '₹5', value: five }, { key: '₹10', value: ten }] },
    ];
    t.frame({ caption: 'Lemonade ₹5 ka. Shuru mein cash box khaali. Har customer ko sahi chhutta return karna hai — sirf usi paise se jo pehle aaya.', legend, panels: view() });
    for (let i = 0; i < bills.length; i++) {
      const b = bills[i];
      if (b === 5) {
        five++;
        st[i] = 'found';
        t.frame({ line: 'five', caption: '₹5 mila → kuch nahi return karna. Cash box mein ek ₹5 aur.', vars: { five, ten }, legend, panels: view(i) });
      } else if (b === 10) {
        if (five === 0) {
          st[i] = 'error';
          t.frame({ line: 'ten', caption: '₹10 mila, ₹5 return karna hai — cash box mein ₹5 nahi! → false.', vars: { five, ten }, legend, panels: view(i) });
          return 'false';
        }
        five--;
        ten++;
        st[i] = 'found';
        t.frame({ line: 'ten', caption: `₹10 mila → ek ₹5 return kiya. Cash box: ${five} × ₹5, ${ten} × ₹10.`, vars: { five, ten }, legend, panels: view(i) });
      } else if (ten > 0 && five > 0) {
        ten--;
        five--;
        st[i] = 'found';
        t.frame({ line: 'twenty', caption: `₹20 mila, ₹15 return karne. Greedy: ₹10 + ₹5 (₹10 sirf ₹20 wale ke kaam aata hai; ₹5 sabke). Cash box: ${five} × ₹5, ${ten} × ₹10.`, vars: { five, ten }, legend, panels: view(i) });
      } else if (five >= 3) {
        five -= 3;
        st[i] = 'found';
        t.frame({ line: 'twenty', caption: `₹20 mila, ₹10 ka note nahi → 3 × ₹5. Cash box: ${five} × ₹5.`, vars: { five, ten }, legend, panels: view(i) });
      } else {
        st[i] = 'error';
        t.frame({ line: 'fail', caption: `₹20 mila, ₹15 return karne — na ₹10 + ₹5, na 3 × ₹5 → false.`, vars: { five, ten }, legend, panels: view(i) });
        return 'false';
      }
    }
    t.frame({ line: 'done', caption: 'Sabko chhutta mil gaya → true. Ek pass, O(n), O(1) memory.', vars: { five, ten }, legend, panels: view() });
    return 'true';
  },
});

// ---------- Example 3: Jump game ----------
export const jumpTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (har index se max jump)', default: [3, 1, 0, 2, 0, 1], minLen: 1, maxLen: 9, min: 0, max: 4 }],
  run({ nums }, t) {
    const n = nums.length;
    let reach = 0;
    const legend = { found: 'pahunch mein', active: 'abhi (i)', error: 'yahan tak nahi pahunch sakte' };
    const view = (i?: number, bad = false): Panel[] => {
      const tones: Tones = {};
      for (let k = 0; k <= Math.min(reach, n - 1); k++) tones[k] = 'found';
      if (i !== undefined) tones[i] = bad ? 'error' : 'active';
      return [array(nums, { label: 'nums', tones, pointers: i !== undefined ? { i } : {}, ranges: [{ from: 0, to: Math.min(reach, n - 1), label: `reach = ${reach}` }] })];
    };
    t.frame({ line: 'init', caption: `Index 0 se shuru, nums[i] = wahan se max kitna jump kar sakte. Har rasta try karna = exponential. Greedy: bas ek number yaad rakho — reach = ab tak sabse door kahan tak pahunch sakte hain.`, legend, panels: view() });
    for (let i = 0; i < n; i++) {
      if (i > reach) {
        t.frame({ line: 'stuck', caption: `i = ${i} > reach = ${reach}. Pichhla koi index yahan tak nahi jump kar sakta → aakhir tak nahi pahunch sakte. false.`, vars: { i, reach }, legend, panels: view(i, true) });
        return 'false';
      }
      const old = reach;
      reach = Math.max(reach, i + nums[i]);
      t.frame({ line: 'reach', caption: `i = ${i} pahunch mein. Yahan se ${i} + ${nums[i]} = ${i + nums[i]} tak. reach = max(${old}, ${i + nums[i]}) = ${reach}.`, vars: { i, reach }, legend, panels: view(i) });
      if (reach >= n - 1) {
        t.frame({ line: 'done', caption: `reach ${reach} ≥ aakhri index ${n - 1} → true. Ek pass, O(n), O(1).`, vars: { i, reach }, legend, panels: view(i) });
        return 'true';
      }
    }
    return 'true';
  },
});
