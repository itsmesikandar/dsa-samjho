import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

const dequePanel = (items: Cell[], label = 'Deque (front … rear)', tones: Record<number, Tone> = {}): Panel => ({ kind: 'deque', label, items: [...items], tones });

// ---------- 3. Visual intro: dono taraf ke darwaaze ----------
export const deqDemo = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'Values (baari-baari peeche / aage)', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 6, min: 0, max: 99 }],
  run({ values }, t) {
    const d: number[] = [];
    t.frame({ caption: 'Deque = Double-Ended Queue. Dono edges par jodo bhi, nikaalo bhi — sab O(1). Stack + queue dono ek mein.', panels: [dequePanel(d)] });
    values.forEach((v, i) => {
      if (i % 2 === 0) {
        d.push(v);
        t.frame({ caption: `addLast(${v}) — peeche jodo (queue jaisa).`, panels: [dequePanel(d, undefined, { [d.length - 1]: 'new' })] });
      } else {
        d.unshift(v);
        t.frame({ caption: `addFirst(${v}) — AAGE jodo (queue mein ye nahi hota).`, panels: [dequePanel(d, undefined, { 0: 'new' })] });
      }
    });
    if (d.length > 1) {
      const a = d.shift()!;
      t.frame({ caption: `removeFirst() = ${a} — aage se nikaala (queue jaisa).`, panels: [dequePanel(d)] });
      const b = d.pop()!;
      t.frame({ caption: `removeLast() = ${b} — peeche se nikaala (stack jaisa). Sliding window problems mein ye dono chahiye: purane aage se, bekaar peeche se.`, panels: [dequePanel(d)] });
    }
    return listStr(d);
  },
});

// ---------- 4. How: sliding window maximum ----------
export const windowMaxTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [1, 3, -1, -3, 5, 3, 6, 7], minLen: 1, maxLen: 10, min: -9, max: 20 },
    { name: 'k', type: 'int', label: 'k', default: 3, min: 1, max: 6 },
  ],
  check: ({ nums, k }) => (k <= nums.length ? null : `k array ki length (${nums.length}) se bada nahi.`),
  run({ nums, k }, t) {
    const dq: number[] = [];
    const res: number[] = [];
    const view = (i: number, hot: Record<number, Tone> = {}): Panel[] => [
      array(nums, { pointers: { i }, ranges: [{ from: Math.max(0, i - k + 1), to: i, label: 'window', tone: 'active' }], tones: hot }),
      dequePanel(dq.map((j) => `${j}:${nums[j]}`), 'Deque (index:value), values ghatti hui'),
      array(res, { label: 'Max har window ka' }),
    ];
    t.frame({ line: 'push', caption: 'Deque mein indexes rakhenge, values aage se peeche ghatti hui. Aage wala = abhi ki window ka max. Har window ke liye k items dekhne ki zaroorat nahi.', panels: view(0) });
    for (let i = 0; i < nums.length; i++) {
      if (dq.length && dq[0] <= i - k) {
        const out = dq.shift()!;
        t.frame({ line: 'drop', caption: `Index ${out} window (${i - k + 1}..${i}) se bahar → aage se hatao.`, panels: view(i, { [out]: 'muted' }) });
      }
      const popped: number[] = [];
      while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) popped.push(dq.pop()!);
      if (popped.length) t.frame({ line: 'pop', caption: `${nums[i]} aaya — peeche ke ${popped.map((j) => nums[j]).join(', ')} isse chhote/barabar aur PEHLE ke hain: jab tak ${nums[i]} window mein hai, ye max ban hi nahi sakte. Hamesha ke liye hatao.`, panels: view(i, Object.fromEntries(popped.map((j) => [j, 'error' as Tone]))) });
      dq.push(i);
      t.frame({ line: 'push', caption: `Index ${i} (${nums[i]}) peeche jodo.`, panels: view(i, { [i]: 'new' }) });
      if (i >= k - 1) {
        res.push(nums[dq[0]]);
        t.frame({ line: 'max', caption: `Window ${i - k + 1}..${i} ka max = deque ka aage wala = ${nums[dq[0]]}.`, panels: view(i, { [dq[0]]: 'found' }) });
      }
    }
    t.frame({ line: 'max', caption: `Har index ek baar push, max ek baar pop → O(n) (brute O(n·k)). Result ${listStr(res)}.`, panels: [array(res, { label: 'Max har window ka', tones: Object.fromEntries(res.map((_, j) => [j, 'done' as Tone])) })] });
    return listStr(res);
  },
});

// ---------- Example 1: faulty keyboard ----------
export const keyboardTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Type kiya (i = ulta)', default: 'string', minLen: 1, maxLen: 12, charset: 'abcdefginrst' }],
  run({ s }, t) {
    const c = [...s];
    const dq: string[] = [];
    let flipped = false;
    const view = (i: number, hot: Record<number, Tone> = {}): Panel[] => [array(c, { pointers: { i } }), dequePanel(dq, 'Deque (asal order)', hot), { kind: 'text', label: 'Screen par', text: (flipped ? [...dq].reverse() : dq).join('') || '(khaali)' }];
    for (let i = 0; i < c.length; i++) {
      if (c[i] === 'i') {
        flipped = !flipped;
        t.frame({ line: 'flip', caption: `'i' → text ulta. Sach mein ulta karte to O(n) har baar. Bas flag flip karo: flipped = ${flipped}.`, vars: { flipped }, panels: view(i) });
      } else if (flipped) {
        dq.unshift(c[i]);
        t.frame({ line: 'front', caption: `Ulti state: screen par '${c[i]}' end mein dikhta hai, par asal (seedhe) order mein wo AAGE hai → addFirst.`, vars: { flipped }, panels: view(i, { 0: 'new' }) });
      } else {
        dq.push(c[i]);
        t.frame({ line: 'back', caption: `Seedhi state → addLast('${c[i]}').`, vars: { flipped }, panels: view(i, { [dq.length - 1]: 'new' }) });
      }
    }
    const out = (flipped ? [...dq].reverse() : dq).join('');
    t.frame({ line: 'done', caption: `Aakhir mein flipped = ${flipped} → ${flipped ? 'ek baar ulta' : 'waisa hi'}: "${out}". Total O(n).`, panels: [{ kind: 'text', label: 'Final', text: out }] });
    return out;
  },
});

// ---------- Example 2: longest subarray with |max − min| ≤ limit ----------
export const limitTrace = tracer<{ nums: number[]; limit: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [10, 1, 2, 4, 7, 2], minLen: 1, maxLen: 8, min: 0, max: 12 },
    { name: 'limit', type: 'int', label: 'limit', default: 5, min: 0, max: 12 },
  ],
  run({ nums, limit }, t) {
    const maxD: number[] = [];
    const minD: number[] = [];
    let l = 0;
    let best = 0;
    const view = (r: number, tone: Tone = 'active'): Panel[] => [
      array(nums, { pointers: { l, r }, ranges: [{ from: l, to: r, label: `max − min = ${maxD[0] - minD[0]}`, tone }] }),
      dequePanel(maxD, 'maxD (ghatte)', { 0: 'found' }),
      dequePanel(minD, 'minD (badhte)', { 0: 'compare' }),
    ];
    for (let r = 0; r < nums.length; r++) {
      while (maxD.length && maxD[maxD.length - 1] < nums[r]) maxD.pop();
      maxD.push(nums[r]);
      while (minD.length && minD[minD.length - 1] > nums[r]) minD.pop();
      minD.push(nums[r]);
      t.frame({ line: 'push', caption: `${nums[r]} andar. 2 monotonic deques: maxD ka aage = window max (${maxD[0]}), minD ka aage = window min (${minD[0]}).`, vars: { l, r, best }, legend: { found: 'max', compare: 'min' }, panels: view(r, maxD[0] - minD[0] > limit ? 'error' : 'active') });
      while (maxD[0] - minD[0] > limit) {
        if (maxD[0] === nums[l]) maxD.shift();
        if (minD[0] === nums[l]) minD.shift();
        l++;
        t.frame({ line: 'shrink', caption: `max − min > ${limit} → l aage (${l}). Bahar gaya value kisi deque ke aage tha to wahan se bhi hataya.`, vars: { l, r, best }, legend: { found: 'max', compare: 'min' }, panels: view(r, maxD[0] - minD[0] > limit ? 'error' : 'active') });
      }
      const better = r - l + 1 > best;
      best = Math.max(best, r - l + 1);
      t.frame({ line: 'update', caption: better ? `Window valid, length ${r - l + 1} → naya best.` : `Length ${r - l + 1}, best ${best}.`, vars: { l, r, best }, legend: { found: 'max', compare: 'min' }, panels: view(r, 'found') });
    }
    return String(best);
  },
});

// ---------- Example 3: shortest subarray with sum ≥ k (negatives) ----------
export const shortestTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums (negative bhi)', default: [2, -1, 2], minLen: 1, maxLen: 7, min: -5, max: 9 },
    { name: 'k', type: 'int', label: 'k', default: 3, min: 1, max: 20 },
  ],
  run({ nums, k }, t) {
    const n = nums.length;
    const pre = [0];
    for (const x of nums) pre.push(pre[pre.length - 1] + x);
    const dq: number[] = [];
    let best = Infinity;
    const view = (j: number, hot: Record<number, Tone> = {}): Panel[] => [
      array(nums, { label: 'nums' }),
      array(pre, { label: 'pre (prefix sum)', pointers: { j }, tones: hot }),
      dequePanel(dq.map((i) => `${i}:${pre[i]}`), 'Deque (index:pre), pre badhte'),
    ];
    t.frame({ line: 'push', caption: `Negatives ki wajah se sliding window nahi chalega. Sum(i..j−1) = pre[j] − pre[i]. Har j ke liye sabse PAAS wala i chahiye jahan pre[j] − pre[i] ≥ ${k}.`, panels: view(0) });
    for (let j = 0; j <= n; j++) {
      while (dq.length && pre[j] - pre[dq[0]] >= k) {
        const i = dq.shift()!;
        best = Math.min(best, j - i);
        t.frame({ line: 'found', caption: `pre[${j}] − pre[${i}] = ${pre[j] - pre[i]} ≥ ${k} → length ${j - i}. Start ${i} ke liye aage ka koi j isse chhota nahi dega → hamesha ke liye hatao.`, vars: { best: best === Infinity ? '∞' : best }, panels: view(j, { [i]: 'found', [j]: 'active' }) });
      }
      const popped: number[] = [];
      while (dq.length && pre[dq[dq.length - 1]] >= pre[j]) popped.push(dq.pop()!);
      if (popped.length) t.frame({ line: 'pop', caption: `pre[${j}] = ${pre[j]} ≤ peeche wale (${popped.map((i) => pre[i]).join(', ')}). j start ke form mein unse better (chhota pre → bada sum, aur baad mein → chhoti length). Unhe hatao.`, vars: { best: best === Infinity ? '∞' : best }, panels: view(j, Object.fromEntries(popped.map((i) => [i, 'error' as Tone]))) });
      dq.push(j);
      t.frame({ line: 'push', caption: `Start candidate ${j} (pre ${pre[j]}) peeche jodo.`, vars: { best: best === Infinity ? '∞' : best }, panels: view(j, { [j]: 'new' }) });
    }
    const ans = best === Infinity ? -1 : best;
    t.frame({ line: 'found', caption: ans === -1 ? 'Kabhi sum ≥ k nahi bana → −1.' : `Sabse chhoti length ${ans}. Har index ek baar push/pop → O(n).`, panels: view(n) });
    return String(ans);
  },
});
