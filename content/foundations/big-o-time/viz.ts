import { array, tracer } from '@/components/viz/engine/tracer';
import type { ChartPanel, Tone } from '@/components/viz/engine/types';

const r1 = (v: number) => Math.round(v * 10) / 10;

// ---------- 3. Visual intro: growth curves ----------
export const growthChart = tracer<{ maxN: number }>({
  inputs: [{ name: 'maxN', type: 'int', label: 'Sabse bada n', default: 16, min: 4, max: 30 }],
  run({ maxN }, t) {
    const xs = Array.from({ length: maxN }, (_, i) => i + 1);
    const fns: [string, (n: number) => number][] = [
      ['O(1)', () => 1],
      ['O(log n)', (n) => Math.log2(n)],
      ['O(n)', (n) => n],
      ['O(n log n)', (n) => n * Math.log2(n)],
      ['O(n²)', (n) => n * n],
    ];
    const series = fns.map(([label, f]) => ({ label, points: xs.map((x) => [x, r1(f(x))] as [number, number]) }));
    const chart = (marker: number): ChartPanel => ({ kind: 'chart', series, marker, xLabel: 'n (input size)', yLabel: 'steps', yMax: 100 });
    const marks = [1, 2, 4, 8, 16].filter((m) => m < maxN).concat(maxN);
    t.frame({
      caption:
        'Har line ek "growth" hai: input n badhne par steps kitne badhte hain. Neeche marker ko aage badhte dekho — kaunsi line kitni tezi se upar jaati hai.',
      panels: [chart(1)],
    });
    for (const n of marks) {
      const sq = n * n;
      t.frame({
        caption: `n = ${n}: O(1) = 1, O(log n) ≈ ${r1(Math.log2(n))}, O(n) = ${n}, O(n log n) ≈ ${r1(n * Math.log2(n))}, O(n²) = ${sq}.${sq > 100 ? ' n² graph se bahar nikal gaya!' : ''}`,
        vars: { n },
        panels: [chart(n)],
      });
    }
    t.frame({
      caption:
        'Seekh: chhote n par sab lagbhag barabar lagte hain, par n bada hote hi fark aasman-zameen ka ho jaata hai. Ye "shape" hi Big-O hai — exact seconds nahi.',
      vars: { n: maxN },
      panels: [chart(maxN)],
    });
    return String(maxN * maxN);
  },
});

// ---------- 4. How: loop ke steps gino ----------
export const countSteps = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [4, 1, 3, 2], minLen: 1, maxLen: 10, min: -99, max: 99 }],
  run({ arr }, t) {
    const n = arr.length;
    let total = 0;
    t.frame({
      line: 'init',
      caption: 'total = 0. Ye kaam sirf EK baar hota hai — array mein 4 item hon ya 4 crore, isme fark nahi padta.',
      vars: { total, steps: 0 },
      panels: [array(arr)],
    });
    arr.forEach((x, i) => {
      const prev = total;
      total += x;
      t.frame({
        line: 'add',
        caption: `Loop ka ${i + 1}va chakkar: total = ${prev} + ${x} = ${total}. Har item par ek kaam — isliye jitne items, utne chakkar.`,
        vars: { i, x, total, steps: i + 1 },
        panels: [array(arr, { tones: { [i]: 'active', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'done' as Tone])) }, pointers: { i } })],
      });
    });
    const xs = Array.from({ length: 10 }, (_, i) => i + 1);
    t.frame({
      line: 'done',
      caption: `Loop ${n} baar chala → ${n} steps (+ 2 "ek baar" wale kaam). Array double karo to steps bhi double. Steps n ke saath seedhe badhte hain → O(n). Chhote fixed kaam (+2) bade n par koi matlab nahi rakhte, isliye unhe hata dete hain.`,
      vars: { total, steps: n },
      panels: [{ kind: 'chart', series: [{ label: 'steps = n', points: xs.map((x) => [x, x] as [number, number]), tone: 'active' }], marker: n, xLabel: 'n', yLabel: 'steps' }],
    });
    return String(total);
  },
});

// ---------- Example 1: linear search — best / worst case ----------
export const linearSearch = tracer<{ arr: number[]; x: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Array', default: [7, 3, 9, 5, 1], minLen: 1, maxLen: 10, min: 0, max: 99 },
    { name: 'x', type: 'int', label: 'Kya dhoondhna hai (x)', default: 5, min: 0, max: 99 },
  ],
  run({ arr, x }, t) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      count++;
      const hit = arr[i] === x;
      t.frame({
        line: 'cmp',
        caption: `Comparison #${count}: arr[${i}] = ${arr[i]} ${hit ? '==' : '!='} ${x}.${hit ? '' : ' Aage badho.'}`,
        vars: { i, x, comparisons: count },
        panels: [array(arr, { tones: { [i]: hit ? 'found' : 'compare' }, pointers: { i } })],
      });
      if (hit) {
        t.frame({
          line: 'found',
          caption: `Mil gaya! ${count} comparisons lage. Agar x pehle hi index par hota to sirf 1 lagta (best case). Par Big-O hum WORST case ka batate hain — jo yahan n hai.`,
          vars: { comparisons: count },
          panels: [array(arr, { tones: { [i]: 'found' }, pointers: { i } })],
        });
        return String(count);
      }
    }
    t.frame({
      line: 'notfound',
      caption: `${x} nahi mila — saare ${arr.length} items dekhne pade. Yahi worst case hai: n items → n comparisons → O(n).`,
      vars: { comparisons: count },
      panels: [array(arr, { tones: Object.fromEntries(arr.map((_, k) => [k, 'muted' as Tone])) })],
    });
    return String(count);
  },
});

// ---------- Example 2: nested loop — saare pairs ----------
export const countPairs = tracer<{ arr: number[]; target: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Array', default: [1, 5, 3, 3, 2], minLen: 2, maxLen: 7, min: -20, max: 20 },
    { name: 'target', type: 'int', label: 'target', default: 6, min: -40, max: 40 },
  ],
  run({ arr, target }, t) {
    const n = arr.length;
    let count = 0;
    let checks = 0;
    for (let i = 0; i < n; i++) {
      t.frame({
        line: 'outer',
        caption:
          i === n - 1
            ? `i = ${i}: iske baad koi item nahi, isliye andar ka loop chalega hi nahi.`
            : `i = ${i}: ab arr[${i}] = ${arr[i]} ka joda aage ke har item (j = ${i + 1}..${n - 1}) se banayenge.`,
        vars: { i, checks, count },
        panels: [array(arr, { tones: { [i]: 'active' }, pointers: { i } })],
      });
      for (let j = i + 1; j < n; j++) {
        checks++;
        const hit = arr[i] + arr[j] === target;
        if (hit) count++;
        t.frame({
          line: 'check',
          caption: `${arr[i]} + ${arr[j]} = ${arr[i] + arr[j]} ${hit ? `== ${target}. Pair mila! count = ${count}` : `!= ${target}`}. (check #${checks})`,
          vars: { i, j, checks, count },
          panels: [array(arr, { tones: { [i]: 'active', [j]: hit ? 'found' : 'compare' }, pointers: { i, j } })],
        });
      }
    }
    t.frame({
      line: 'done',
      caption: `Total ${checks} checks = n(n-1)/2 = ${n}×${n - 1}/2. n double karo to checks lagbhag 4 guna! Yahi O(n²) hai. n = 10⁵ par ~5×10⁹ checks — bahut slow.`,
      vars: { checks, count },
      panels: [array(arr)],
    });
    return String(count);
  },
});

// ---------- Example 3: halving loop — O(log n) ----------
export const halvings = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 64, min: 1, max: 5000 }],
  run({ n }, t) {
    let x = n;
    let steps = 0;
    const seen = [x];
    const bars = () => ({ kind: 'bars' as const, label: 'x ki value har round ke baad', values: [...seen], tones: { [seen.length - 1]: 'active' as Tone } });
    t.frame({
      line: 'loop',
      caption: `x = ${n}. Har round mein x ko aadha karenge jab tak 1 na bache. Andaza lagao — kitne round lagenge?`,
      vars: { x, steps },
      panels: [bars()],
    });
    while (x > 1) {
      const prev = x;
      x = Math.floor(x / 2);
      steps++;
      seen.push(x);
      t.frame({
        line: 'half',
        caption: `x = ${prev} / 2 = ${x}. steps = ${steps}. ${x > 1 ? 'Abhi bhi 1 se bada hai — phir aadha karo.' : '1 aa gaya, loop khatam!'}`,
        vars: { x, steps },
        panels: [bars()],
      });
    }
    t.frame({
      line: 'done',
      caption: `Sirf ${steps} steps! n ko double karo to steps sirf 1 badhta hai. Isko O(log n) kehte hain: 10⁶ ke liye ~20 steps, 10⁹ ke liye ~30.`,
      vars: { x, steps },
      panels: [bars()],
    });
    return String(steps);
  },
});
