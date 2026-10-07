import { array, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Tones = Record<number, Tone>;
const show = (a: (number | null)[]) => a.map((v) => (v === null ? '·' : v));

// ---------- 3. Visual intro: Kadane bhi DP hai — state = "i par khatam" ----------
export const kadaneDpTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [-2, 3, -1, 4, -6, 2, 5], minLen: 1, maxLen: 9, min: -9, max: 9 }],
  run({ nums }, t) {
    const n = nums.length;
    const dp: (number | null)[] = Array(n).fill(null);
    let best = -Infinity;
    let bestAt = 0;
    const legend = { active: 'abhi (i)', compare: 'dp[i - 1]', found: 'sabse bada' };
    const view = (i?: number, done = false): Panel[] => {
      const dt: Tones = {};
      if (i !== undefined) {
        dt[i] = 'active';
        if (i > 0) dt[i - 1] = 'compare';
      }
      if (done) dt[bestAt] = 'found';
      return [array(nums, { label: 'nums', tones: i !== undefined ? { [i]: 'active' } : {} }), array(show(dp), { label: 'dp[i] = i par KHATAM hone wala sabse bada subarray sum', tones: dt })];
    };
    t.frame({ caption: '1D DP ka sabse zaroori step: STATE choose karna. "Sabse bada subarray" seedha state nahi banta — par "i par khatam hone wala sabse bada" banta hai, kyunki wo sirf i - 1 wale se judta hai.', legend, panels: view() });
    for (let i = 0; i < n; i++) {
      const prev = i > 0 ? dp[i - 1]! : null;
      dp[i] = prev === null ? nums[i] : Math.max(nums[i], prev + nums[i]);
      if (dp[i]! > best) (best = dp[i]!), (bestAt = i);
      t.frame({ caption: prev === null ? `dp[0] = ${nums[0]} (akela).` : `dp[${i}] = max(akela ${nums[i]}, pichhle mein jodo ${prev} + ${nums[i]} = ${prev + nums[i]}) = ${dp[i]}.${prev < 0 ? ' Pichhla minus tha — chhod do, naya shuru.' : ''}`, vars: { i, best }, legend, panels: view(i) });
    }
    t.frame({ caption: `Jawab = max(dp) = ${best}. Ye Kadane hi hai — DP ki nazar se: state, transition (max), jawab (sab states ka max). Har 1D DP isi structure par.`, legend, panels: view(undefined, true) });
    return String(best);
  },
});

// ---------- 4. How: House robber (lo ya chhodo) ----------
const housesSpec = { name: 'nums', type: 'intArray' as const, label: 'Har ghar mein paisa', default: [4, 1, 2, 7, 5, 3, 1], minLen: 1, maxLen: 9, min: 0, max: 20 };
export const robberTrace = tracer<{ nums: number[] }>({
  inputs: [housesSpec],
  run({ nums }, t) {
    const n = nums.length;
    const dp: (number | null)[] = Array(n + 1).fill(null);
    dp[0] = 0;
    dp[1] = nums[0];
    const legend = { active: 'abhi wala dp', found: 'jeeta hua option', muted: 'haara option' };
    const view = (i?: number, took?: boolean): Panel[] => {
      const dt: Tones = {};
      const ht: Tones = {};
      if (i !== undefined) {
        dt[i] = 'active';
        dt[i - 1] = took ? 'muted' : 'found';
        dt[i - 2] = took ? 'found' : 'muted';
        ht[i - 1] = took ? 'found' : 'muted';
      }
      return [array(nums, { label: 'Ghar (index 0..n-1)', tones: ht }), array(show(dp), { label: 'dp[i] = pehle i gharon se max', tones: dt, pointers: i !== undefined ? { i } : {} })];
    };
    t.frame({ line: 'base', caption: `Neighbor 2 ghar ek saath nahi. dp[i] = pehle i gharon se max. dp[0] = 0, dp[1] = ${nums[0]} (ek ghar — le lo).`, legend, panels: view() });
    for (let i = 2; i <= n; i++) {
      const skip = dp[i - 1]!;
      const take = dp[i - 2]! + nums[i - 1];
      dp[i] = Math.max(skip, take);
      t.frame({ line: 'choose', caption: `Ghar ${i - 1} (₹${nums[i - 1]}): chhodo → dp[${i - 1}] = ${skip}; lo → dp[${i - 2}] + ${nums[i - 1]} = ${take} (neighbor ${i - 2} chhoda). Max = ${dp[i]}.`, vars: { i, skip, take }, legend, panels: view(i, take > skip) });
    }
    t.frame({ line: 'done', caption: `Sab gharon se max ${dp[n]}. O(n) time; sirf pichhle do chahiye → O(1) memory bhi.`, legend, panels: view() });
    return String(dp[n]);
  },
});

// ---------- Example 1: Delete and earn → values par house robber ----------
export const earnTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [1, 1, 2, 3, 3, 5], minLen: 1, maxLen: 8, min: 1, max: 8 }],
  run({ nums }, t) {
    const maxV = Math.max(...nums);
    const points: number[] = Array(maxV + 1).fill(0);
    for (const x of nums) points[x] += x;
    let take = 0;
    let skip = 0;
    const took: Tones = {};
    const legend = { found: 'li', muted: 'chhodi', active: 'abhi' };
    const view = (v?: number): Panel[] => [
      array(nums, { label: 'nums' }),
      array(points, { label: 'points[v] = saare v ka jod (value = ghar)', tones: { ...took, ...(v !== undefined ? { [v]: 'active' } : {}) }, pointers: v !== undefined ? { v } : {} }),
    ];
    t.frame({ line: 'bucket', caption: `Value v uthao → saare v ke points (v × count), par v - 1 aur v + 1 jal jaate hain. Values ko ghar maano: points[v] paisa, neighbor values ek saath nahi → HOUSE ROBBER! points = [${points.join(', ')}].`, legend, panels: view() });
    for (let v = 0; v <= maxV; v++) {
      const newTake = skip + points[v];
      const newSkip = Math.max(skip, take);
      t.frame({ line: 'take', caption: `v = ${v}: lo → (pichhli chhodi thi) ${skip} + ${points[v]} = ${newTake}; chhodo → max(${skip}, ${take}) = ${newSkip}.`, vars: { v, take: newTake, skip: newSkip }, legend, panels: view(v) });
      took[v] = newTake > newSkip ? 'found' : 'muted';
      skip = newSkip;
      take = newTake;
    }
    const ans = Math.max(take, skip);
    t.frame({ line: 'done', caption: `Max = ${ans}. Bucket O(n + maxV), robber O(maxV). Naya sawaal, purana pattern — DP mein yahi pehchaan sabse kaam aati hai.`, legend, panels: view() });
    return String(ans);
  },
});

// ---------- Example 2: Decode ways ----------
export const decodeTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Digits (1 = A … 26 = Z)', default: '12102', minLen: 1, maxLen: 8, charset: '0123456789' }],
  run({ s }, t) {
    const n = s.length;
    const dp: (number | null)[] = Array(n + 1).fill(null);
    dp[0] = 1;
    const legend = { active: 'abhi dp[i]', found: 'yahan se juda', muted: 'nahi juda', compare: 'aakhri piece' };
    const view = (i?: number, used: number[] = [], len?: number): Panel[] => {
      const dt: Tones = {};
      const st: Tones = {};
      if (i !== undefined) {
        dt[i] = 'active';
        [i - 1, i - 2].forEach((j) => j >= 0 && (dt[j] = used.includes(j) ? 'found' : 'muted'));
        if (len) for (let k = i - len; k < i; k++) st[k] = 'compare';
      }
      return [array([...s], { label: 's', tones: st }), array(show(dp), { label: 'dp[i] = pehle i digits ke tareeke', tones: dt, pointers: i !== undefined ? { i } : {} })];
    };
    t.frame({ line: 'base', caption: 'dp[i] = pehle i digits ke tareeke. Aakhri letter ya 1 digit ka (1-9) ya 2 digit ka (10-26). dp[0] = 1 (khaali — ek tareeka).', legend, panels: view() });
    for (let i = 1; i <= n; i++) {
      let ways = 0;
      const used: number[] = [];
      const why: string[] = [];
      if (s[i - 1] !== '0') {
        ways += dp[i - 1]!;
        used.push(i - 1);
        why.push(`'${s[i - 1]}' akela → + dp[${i - 1}] = ${dp[i - 1]}`);
      } else why.push(`'0' akela letter nahi`);
      if (i >= 2) {
        const two = Number(s.slice(i - 2, i));
        if (s[i - 2] !== '0' && two >= 10 && two <= 26) {
          ways += dp[i - 2]!;
          used.push(i - 2);
          why.push(`'${s.slice(i - 2, i)}' ek letter → + dp[${i - 2}] = ${dp[i - 2]}`);
        } else why.push(`'${s.slice(i - 2, i)}' 10-26 mein nahi`);
      }
      dp[i] = ways;
      t.frame({ line: used.includes(i - 2) ? 'two' : 'one', caption: `dp[${i}]: ${why.join('; ')}. Total ${dp[i]}.`, vars: { i, ways: dp[i] }, legend, panels: view(i, used, used.includes(i - 2) ? 2 : 1) });
    }
    t.frame({ line: 'done', caption: `${dp[n]} tareeke.${dp[n] === 0 ? " (Koi '0' kisi se jud hi nahi paaya.)" : ''} O(n) time, aur sirf pichhle do → O(1) memory.`, legend, panels: view() });
    return String(dp[n]);
  },
});

// ---------- Example 3: House robber II (gol mohalla) ----------
export const circleTrace = tracer<{ nums: number[] }>({
  inputs: [{ ...housesSpec, default: [6, 2, 3, 7] }],
  run({ nums }, t) {
    const n = nums.length;
    const legend = { muted: 'is line se bahar', found: 'is line mein', active: 'abhi' };
    if (n === 1) {
      t.frame({ line: 'one', caption: `Ek hi ghar → ${nums[0]}.`, panels: [array(nums, { label: 'Ghar (gol)' })] });
      return String(nums[0]);
    }
    const line = (lo: number, hi: number, name: string): number => {
      let prev2 = 0;
      let prev1 = 0;
      const row: (number | null)[] = Array(n).fill(null);
      for (let i = lo; i <= hi; i++) {
        const skip = prev1;
        const take = prev2 + nums[i];
        const cur = Math.max(skip, take);
        prev2 = prev1;
        prev1 = cur;
        row[i] = cur;
        const tones: Tones = {};
        for (let k = 0; k < n; k++) tones[k] = k < lo || k > hi ? 'muted' : 'found';
        tones[i] = 'active';
        t.frame({ line: 'line', caption: `${name}: ghar ${i} tak best = max(chhodo ${skip}, lo ${take - nums[i]} + ${nums[i]} = ${take}) = ${cur}.`, vars: { i, best: cur }, legend, panels: [array(nums, { label: `Ghar — ${name}`, tones }), array(show(row), { label: 'best (seedhi line house robber)' })] });
      }
      return prev1;
    };
    t.frame({ line: 'split', caption: `Gol mohalla: ghar 0 aur ghar ${n - 1} bhi neighbor. Dono ek saath nahi aa sakte → ya to aakhri chhodo (0..${n - 2}), ya pehla chhodo (1..${n - 1}). Dono seedhi lines hain — normal house robber!`, legend, panels: [array(nums, { label: 'Ghar (gol — pehla aur aakhri neighbor)', tones: { 0: 'active', [n - 1]: 'active' } })] });
    const a = line(0, n - 2, 'Aakhri chhoda');
    const b = line(1, n - 1, 'Pehla chhoda');
    const ans = Math.max(a, b);
    t.frame({ line: 'split', caption: `Aakhri chhod ke ${a}, pehla chhod ke ${b} → ${ans}. (Seedhi line maante to galti se pehla + aakhri dono le lete.) 2 baar O(n) → O(n).`, legend, panels: [array(nums, { label: 'Ghar (gol)' })] });
    return String(ans);
  },
});
