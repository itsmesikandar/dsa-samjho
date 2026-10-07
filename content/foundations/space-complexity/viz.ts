import { array, ids, listStr, swap, tracer } from '@/components/viz/engine/tracer';
import type { CallNode, MemoryPanel, Panel, Tone, ToneMap } from '@/components/viz/engine/types';

const doneUpTo = (k: number): ToneMap => Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'done' as Tone]));

// ---------- 3. Visual intro: kya count karte hain, kya nahi ----------
export const spaceMeter = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n (input size)', default: 4, min: 1, max: 6 }],
  run({ n }, t) {
    const input = array(Array.from({ length: n }, (_, i) => i + 1), { label: `Input array (n = ${n}) — ye diya hua hai, extra space mein nahi count karte` });
    const vars: MemoryPanel = {
      kind: 'memory',
      label: 'Extra: chhote variables',
      start: 500,
      cells: [
        { value: 0, tag: 'total', tone: 'new' },
        { value: 0, tag: 'i', tone: 'new' },
      ],
    };
    const copy = array(Array(n).fill(0), { label: `Extra: copy = IntArray(${n})`, tones: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'new' as Tone])) });
    const grid: Panel = { kind: 'grid', label: `Extra: grid = ${n} × ${n}`, values: Array.from({ length: n }, () => Array(n).fill(0)) };

    t.frame({
      caption: 'Space complexity mein hum count karte hain ki algorithm ne input ke ALAWA kitni memory li. Input to pehle se diya hua hai — usko usually nahi count karte.',
      vars: { n },
      panels: [input],
    });
    t.frame({
      caption: '`var total = 0`, `var i = 0` → bas 2 dabbe. n 10 ho ya 10 crore, ye 2 hi rahenge. Isko O(1) space kehte hain.',
      vars: { n, 'extra dabbe': 2 },
      panels: [input, vars],
    });
    t.frame({
      caption: `\`IntArray(n)\` → ${n} naye dabbe. n double to memory double. Isko O(n) space kehte hain.`,
      vars: { n, 'extra dabbe': 2 + n },
      panels: [input, vars, copy],
    });
    t.frame({
      caption: `n × n grid → ${n * n} dabbe! n = 10⁴ par 10⁸ Ints ≈ 400 MB — memory limit khatam. Isko O(n²) space kehte hain.`,
      vars: { n, 'extra dabbe': 2 + n + n * n },
      panels: [input, vars, copy, grid],
    });
    t.frame({
      caption: `Total extra = 2 + n + n² = ${2 + n + n * n}. Time ki tarah yahan bhi sabse bada term jeet-ta hai → O(n²).`,
      vars: { 'O(1)': 2, 'O(n)': n, 'O(n²)': n * n },
      panels: [input, vars, copy, grid],
    });
    return String(n * n);
  },
});

// ---------- 4. How: naya result array ----------
export const squaresSpace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [3, 1, 4], minLen: 1, maxLen: 8, min: -30, max: 30 }],
  run({ arr }, t) {
    const n = arr.length;
    const res: (number | null)[] = Array(n).fill(null);
    t.frame({
      line: 'alloc',
      caption: `result = IntArray(${n}) → heap par ${n} naye dabbe. Ye extra memory input ke size ke saath badhti hai → O(n).`,
      vars: { 'extra dabbe': n },
      panels: [array(arr, { label: 'arr (input)' }), array(res.map(() => 0), { label: 'result (naya)', tones: Object.fromEntries(res.map((_, i) => [i, 'new' as Tone])) })],
    });
    for (let i = 0; i < n; i++) {
      res[i] = arr[i] * arr[i];
      t.frame({
        line: 'fill',
        caption: `result[${i}] = ${arr[i]} × ${arr[i]} = ${res[i]}. Variable i bas ek dabba hai — wo O(1) hi rehta hai.`,
        vars: { i, 'extra dabbe': n + 1 },
        panels: [array(arr, { label: 'arr (input)', tones: { [i]: 'active' }, pointers: { i } }), array(res.map((v) => v ?? 0), { label: 'result (naya)', tones: { ...doneUpTo(i), [i]: 'new' } })],
      });
    }
    t.frame({
      line: 'done',
      caption: `Extra space = result (${n}) + i (1) = O(n). Dhyaan do: kai log output array ko count mein nahi lete ("O(1) auxiliary, output chhod ke"). Interview mein saaf bolo kya gina.`,
      vars: { 'extra dabbe': n + 1 },
      panels: [array(arr, { label: 'arr (input)' }), array(res.map((v) => v ?? 0), { label: 'result (naya)', tones: doneUpTo(n) })],
    });
    return listStr(res);
  },
});

// ---------- Example 1: copy vs in-place ----------
export const copyVsInPlace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [1, 2, 3, 4], minLen: 1, maxLen: 8, min: -99, max: 99 }],
  run({ arr }, t) {
    const n = arr.length;
    const res: number[] = Array(n).fill(0);
    t.frame({
      line: 'alloc',
      caption: `Tareeka 1: res = IntArray(${n}) — ulta karne ke liye ek poori nayi array. Extra memory: ${n} dabbe.`,
      vars: { 'extra dabbe': n },
      panels: [array(arr, { label: 'arr' }), array(res, { label: 'res (nayi copy)', tones: Object.fromEntries(res.map((_, i) => [i, 'new' as Tone])) })],
    });
    for (let i = 0; i < n; i++) {
      res[i] = arr[n - 1 - i];
      t.frame({
        line: 'copy',
        caption: `res[${i}] = arr[${n - 1 - i}] = ${res[i]}. Peeche se utha ke aage rakh rahe hain.`,
        vars: { i, 'extra dabbe': n + 1 },
        panels: [
          array(arr, { label: 'arr', tones: { [n - 1 - i]: 'compare' }, pointers: { src: n - 1 - i } }),
          array(res, { label: 'res (nayi copy)', tones: { ...doneUpTo(i), [i]: 'new' }, pointers: { i } }),
        ],
      });
    }
    const a = [...arr];
    const id = ids(n);
    let l = 0;
    let r = n - 1;
    t.frame({
      line: 'swap',
      caption: 'Tareeka 2: usi array mein swap. Extra memory sirf l, r, temp — 3 dabbe, n kitna bhi ho. Matlab O(1).',
      vars: { l, r, 'extra dabbe': 3 },
      panels: [array(a, { label: 'arr (in-place)', ids: id, pointers: { l, r } })],
    });
    while (l < r) {
      swap(a, l, r);
      swap(id, l, r);
      t.frame({
        line: 'swap',
        caption: `arr[${l}] ↔ arr[${r}] swap. Koi nayi array nahi — sirf temp mein ek value thodi der ke liye.`,
        vars: { l, r, 'extra dabbe': 3 },
        panels: [array(a, { label: 'arr (in-place)', ids: id, tones: { [l]: 'swap', [r]: 'swap' }, pointers: { l, r } })],
      });
      l++;
      r--;
    }
    t.frame({
      caption: `Dono ka answer same: ${listStr(a)}. Time dono ka O(n). Space: copy wala O(n), in-place wala O(1). Par in-place ne input badal diya — agar original chahiye tha to copy hi sahi tha.`,
      vars: { 'copy: extra': n, 'in-place: extra': 3 },
      panels: [array(res, { label: 'res (copy wala)', tones: doneUpTo(n) }), array(a, { label: 'arr (in-place wala)', ids: id, tones: doneUpTo(n) })],
    });
    return listStr(res);
  },
});

// ---------- Example 2: prefix array — space dekar time bachao ----------
export const prefixSpace = tracer<{ arr: number[]; l: number; r: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Array', default: [2, 4, 1, 5, 3], minLen: 1, maxLen: 8, min: -50, max: 50 },
    { name: 'l', type: 'int', label: 'l (range shuru)', default: 1, min: 0, max: 7 },
    { name: 'r', type: 'int', label: 'r (range end)', default: 3, min: 0, max: 7 },
  ],
  check: ({ arr, l, r }) => (l <= r && r < arr.length ? null : `0 ≤ l ≤ r ≤ ${arr.length - 1} hona chahiye.`),
  run({ arr, l, r }, t) {
    const n = arr.length;
    const pre: number[] = Array(n + 1).fill(0);
    const preIdx = (tones: ToneMap = {}, ptr: Record<string, number> = {}) =>
      array(pre, { label: `pre (n + 1 = ${n + 1} extra dabbe)`, tones, pointers: ptr });
    t.frame({
      line: 'alloc',
      caption: `pre = LongArray(${n + 1}). pre[k] = pehle k items ka total. pre[0] = 0 (kuch nahi joda). Ye ${n + 1} dabbe hamari "extra memory" hain.`,
      vars: { 'extra dabbe': n + 1 },
      panels: [array(arr, { label: 'arr' }), preIdx({ 0: 'new' })],
    });
    for (let i = 0; i < n; i++) {
      pre[i + 1] = pre[i] + arr[i];
      t.frame({
        line: 'fill',
        caption: `pre[${i + 1}] = pre[${i}] + arr[${i}] = ${pre[i]} + ${arr[i]} = ${pre[i + 1]}. Ek hi pass mein saare totals ban jaate hain — O(n).`,
        vars: { i },
        panels: [array(arr, { label: 'arr', tones: { [i]: 'active' }, pointers: { i } }), preIdx({ [i]: 'compare', [i + 1]: 'new' })],
      });
    }
    const ans = pre[r + 1] - pre[l];
    t.frame({
      line: 'query',
      caption: `arr[${l}..${r}] ka sum = pre[${r + 1}] - pre[${l}] = ${pre[r + 1]} - ${pre[l]} = ${ans}. Loop nahi chalaya — sirf ek minus! Har query O(1). Trade-off: O(n) memory di, badle mein queries super-fast.`,
      vars: { l, r, answer: ans },
      panels: [
        array(arr, { label: 'arr', ranges: [{ from: l, to: r, label: `sum = ${ans}`, tone: 'found' }] }),
        preIdx({ [r + 1]: 'found', [l]: 'compare' }, { 'r+1': r + 1, l }),
      ],
    });
    return String(ans);
  },
});

// ---------- Example 3: recursion ka chhupa space ----------
export const recursiveSum = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [3, 1, 4, 2], minLen: 1, maxLen: 6, min: -50, max: 50 }],
  run({ arr }, t) {
    const n = arr.length;
    const calls: CallNode[] = [];
    const show = (line: string, caption: string, i: number, depth: number) =>
      t.frame({
        line,
        caption,
        vars: { 'stack depth': depth },
        panels: [array(arr, { pointers: i <= n ? { i } : {}, tones: i < n ? { [i]: 'active' } : {} }), { kind: 'recursion', label: 'Recursion tree (yahan ek seedhi line)', calls }],
      });
    for (let i = 0; i <= n; i++) {
      if (i > 0) calls[i - 1].state = 'waiting';
      calls.push({ id: `c${i}`, parent: i > 0 ? `c${i - 1}` : undefined, label: `sum(i=${i})`, state: 'active' });
      if (i < n) {
        show('call', `sum(i=${i}) ko arr[${i}] + sum(i=${i + 1}) chahiye. Pehle wala jawab aane tak ye frame stack par WAIT karega.`, i, i + 1);
      } else {
        show('base', `i = ${n} = size → base case, 0 return. Is pal stack par ${n + 1} frames ek saath hain! Koi array nahi banayi, phir bhi O(n) memory — call stack ki.`, i, n + 1);
      }
    }
    let acc = 0;
    calls[n].state = 'done';
    calls[n].ret = '0';
    for (let i = n - 1; i >= 0; i--) {
      const sub = acc;
      acc = arr[i] + sub;
      calls[i].state = 'done';
      calls[i].ret = String(acc);
      if (i > 0) calls[i - 1].state = 'active';
      show('call', `sum(i=${i}) = arr[${i}] + ${sub} = ${acc}. Return → frame stack se hata.`, i, i);
    }
    t.frame({
      caption: `Answer ${acc}. Loop wala version yahi kaam sirf 1 variable (total) se karta — O(1) space. Recursion depth = n hai to space O(n), aur n = 10⁵ par StackOverflowError ka risk.`,
      vars: { 'loop: extra': 1, 'recursion: max frames': n + 1 },
      panels: [array(arr, { tones: doneUpTo(n) }), { kind: 'recursion', label: 'Recursion tree', calls }],
    });
    return String(acc);
  },
});
