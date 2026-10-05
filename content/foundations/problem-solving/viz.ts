import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { MapPanel, Tone, ToneMap } from '@/components/viz/engine/types';

// ---------- 3. Visual intro: constraints → complexity ----------
const sup = (e: number) => String(e).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]);
const fmtSteps = (v: number) => {
  if (!Number.isFinite(v) || v > 1e30) return '∞ (bahut zyada)';
  if (v < 1e6) return String(Math.max(1, Math.round(v)));
  const e = Math.floor(Math.log10(v));
  return `≈ ${(v / 10 ** e).toFixed(1)} × 10${sup(e)}`;
};
const factorial = (n: number) => {
  if (n > 170) return Infinity;
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
};

export const constraintsTable = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n (constraint ki limit)', default: 100000, min: 1, max: 1000000000 }],
  run({ n }, t) {
    const lg = Math.max(1, Math.log2(n));
    const rows: [string, number][] = [
      ['O(1)', 1],
      ['O(log n)', lg],
      ['O(n)', n],
      ['O(n log n)', n * lg],
      ['O(n²)', n * n],
      ['O(n³)', n ** 3],
      ['O(2ⁿ)', n <= 1000 ? 2 ** n : Infinity],
      ['O(n!)', factorial(n)],
    ];
    const verdict = (v: number): [string, Tone] => (v <= 1e8 ? ['✓ chalega', 'done'] : v <= 1e9 ? ['~ tight (risky)', 'compare'] : ['✗ TLE', 'error']);
    const entries: MapPanel['entries'] = [];
    const panel = (): MapPanel => ({ kind: 'map', keyLabel: 'Complexity', valueLabel: `Steps (n = ${n})`, entries: entries.map((e) => ({ ...e })) });
    t.frame({
      caption: `Rough rule: ~10⁸ simple steps ≈ 1 second. Question kehta hai n ≤ ${n}. Har complexity ke steps nikaalte hain aur dekhte hain kaun 1 second mein chalega.`,
      vars: { n },
      panels: [panel()],
    });
    let slowestOk = 'O(1)';
    for (const [label, v] of rows) {
      const [text, tone] = verdict(v);
      if (tone === 'done') slowestOk = label;
      entries.push({ key: label, value: `${fmtSteps(v)}  ${text}`, tone });
      t.frame({
        caption: `${label} → ${fmtSteps(v)} steps. ${tone === 'done' ? 'Limit ke andar — chalega.' : tone === 'compare' ? 'Limit ke paas — risky, constant chhota ho to shayad.' : 'Bahut zyada — Time Limit Exceeded.'}`,
        vars: { n },
        panels: [panel()],
      });
    }
    t.frame({
      caption: `Nateeja: n ≤ ${n} ke liye ${slowestOk} ya usse tez approach socho. Question padhte hi ye hisaab lagao — galat direction mein time barbaad nahi hoga.`,
      vars: { n, 'allowed (max)': slowestOk },
      panels: [panel()],
    });
    return slowestOk;
  },
});

// ---------- 4. How: second largest, ek pass ----------
export const secondLargest = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [12, 35, 1, 10, 34, 1], minLen: 1, maxLen: 10, min: -99, max: 99 }],
  run({ arr }, t) {
    const NONE = Number.NEGATIVE_INFINITY;
    let first = NONE;
    let second = NONE;
    let fi = -1;
    let si = -1;
    const show = (v: number) => (v === NONE ? '-∞' : v);
    const tones = (i?: number): ToneMap => {
      const m: ToneMap = {};
      if (si >= 0) m[si] = 'compare';
      if (fi >= 0) m[fi] = 'found';
      if (i !== undefined && m[i] === undefined) m[i] = 'active';
      return m;
    };
    t.frame({
      line: 'init',
      caption: 'first = second = -∞ (sabse chhota possible). Plan: ek hi baar array par chalo, aur do champions yaad rakho — sabse bada aur doosra sabse bada.',
      vars: { first: show(first), second: show(second) },
      panels: [array(arr)],
    });
    arr.forEach((x, i) => {
      if (x > first) {
        const old = first;
        second = first;
        si = fi;
        first = x;
        fi = i;
        t.frame({
          line: 'new-first',
          caption: `${x} > first (${show(old)}) → naya champion! Purana champion ${show(old)} ab second ban gaya.`,
          vars: { x, first: show(first), second: show(second) },
          panels: [array(arr, { tones: tones(i), pointers: { i } })],
        });
      } else if (x > second && x !== first) {
        second = x;
        si = i;
        t.frame({
          line: 'new-second',
          caption: `${x} first (${first}) se bada nahi, par second se bada hai (aur first ke barabar bhi nahi) → second = ${x}.`,
          vars: { x, first: show(first), second: show(second) },
          panels: [array(arr, { tones: tones(i), pointers: { i } })],
        });
      } else {
        t.frame({
          line: 'loop',
          caption: x === first ? `${x} = first — duplicate hai, second nahi ban sakta (alag value chahiye).` : `${x} kisi champion se bada nahi — kuch nahi badla.`,
          vars: { x, first: show(first), second: show(second) },
          panels: [array(arr, { tones: tones(i), pointers: { i } })],
        });
      }
    });
    const ans = second === NONE ? -1 : second;
    t.frame({
      line: 'done',
      caption:
        ans === -1
          ? 'Second largest mila hi nahi (sab same the, ya ek hi item tha) → -1. Ye edge case pehle hi interviewer se poochna chahiye tha!'
          : `Answer: ${ans}. Sirf ek pass → O(n) time, do variables → O(1) space. Sort wala approach O(n log n) hota.`,
      vars: { first: show(first), second: show(second) },
      panels: [array(arr, { tones: tones() })],
    });
    return String(ans);
  },
});

// ---------- Example 1: duplicate — HashSet approach ----------
export const dupSet = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [3, 1, 4, 1, 5], minLen: 1, maxLen: 10, min: 0, max: 20 }],
  run({ arr }, t) {
    const seen: number[] = [];
    t.frame({
      line: 'init',
      caption: 'seen = khaali HashSet. Idea: har number ko "yaad" rakhte jao; agar koi number pehle se yaad mein hai, to duplicate mil gaya.',
      panels: [array(arr), array([], { label: 'seen (HashSet)' })],
    });
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i];
      if (seen.includes(x)) {
        const at = seen.indexOf(x);
        t.frame({
          line: 'hit',
          caption: `${x} pehle se seen mein hai! Duplicate mil gaya → true. HashSet mein check O(1) average hai, isliye poora kaam O(n).`,
          vars: { i, x },
          panels: [array(arr, { tones: { [i]: 'found' }, pointers: { i } }), array(seen, { label: 'seen (HashSet)', tones: { [at]: 'found' } })],
        });
        return 'true';
      }
      seen.push(x);
      t.frame({
        line: 'add',
        caption: `${x} pehli baar dikha — seen mein daal do.`,
        vars: { i, x },
        panels: [array(arr, { tones: { [i]: 'active' }, pointers: { i } }), array(seen, { label: 'seen (HashSet)', tones: { [seen.length - 1]: 'new' } })],
      });
    }
    t.frame({
      line: 'none',
      caption: 'Poora array dekh liya, koi number do baar nahi aaya → false.',
      panels: [array(arr), array(seen, { label: 'seen (HashSet)' })],
    });
    return 'false';
  },
});

// ---------- Example 2: pair sum in sorted array ----------
export const pairSum = tracer<{ arr: number[]; target: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Sorted array', default: [1, 3, 4, 6, 8, 11], minLen: 2, maxLen: 10, min: -50, max: 50, sorted: true },
    { name: 'target', type: 'int', label: 'target', default: 10, min: -100, max: 100 },
  ],
  run({ arr, target }, t) {
    let l = 0;
    let r = arr.length - 1;
    t.frame({
      line: 'init',
      caption: 'Array SORTED hai — yahi hint hai! l sabse chhote par, r sabse bade par. Sum dekh ke decide karenge kaunsa pointer hilana hai.',
      vars: { l, r, target },
      panels: [array(arr, { pointers: { l, r } })],
    });
    while (l < r) {
      const s = arr[l] + arr[r];
      t.frame({
        line: 'sum',
        caption: `arr[${l}] + arr[${r}] = ${arr[l]} + ${arr[r]} = ${s}. Target ${target} se compare karo.`,
        vars: { l, r, sum: s, target },
        panels: [array(arr, { tones: { [l]: 'compare', [r]: 'compare' }, pointers: { l, r } })],
      });
      if (s === target) {
        t.frame({
          line: 'found',
          caption: `${s} == ${target} — mil gaya! Index [${l}, ${r}]. Har step mein ek pointer hata, isliye max n steps → O(n).`,
          vars: { l, r },
          panels: [array(arr, { tones: { [l]: 'found', [r]: 'found' }, pointers: { l, r } })],
        });
        return listStr([l, r]);
      }
      if (s < target) {
        l++;
        t.frame({
          line: 'left',
          caption: `${s} < ${target}: sum chhota hai, badi value chahiye. arr[r] pehle se sabse bada hai, to l aage badhao.`,
          vars: { l, r },
          panels: [array(arr, { tones: { [l - 1]: 'muted' }, pointers: { l, r } })],
        });
      } else {
        r--;
        t.frame({
          line: 'right',
          caption: `${s} > ${target}: sum bada hai, chhoti value chahiye. r peeche lao.`,
          vars: { l, r },
          panels: [array(arr, { tones: { [r + 1]: 'muted' }, pointers: { l, r } })],
        });
      }
    }
    t.frame({
      line: 'none',
      caption: 'l aur r mil gaye, koi pair nahi mila → [-1, -1].',
      vars: { l, r },
      panels: [array(arr, { pointers: { l, r } })],
    });
    return listStr([-1, -1]);
  },
});

// ---------- Example 3: max sum of k-window ----------
export const maxWindow = tracer<{ arr: number[]; k: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Array', default: [2, 1, 5, 1, 3, 2], minLen: 1, maxLen: 10, min: -50, max: 50 },
    { name: 'k', type: 'int', label: 'k (window size)', default: 3, min: 1, max: 10 },
  ],
  check: ({ arr, k }) => (k <= arr.length ? null : `k array ki size (${arr.length}) se bada nahi ho sakta.`),
  run({ arr, k }, t) {
    let window = 0;
    for (let i = 0; i < k; i++) {
      window += arr[i];
      t.frame({
        line: 'first',
        caption: `Pehli window bana rahe hain: arr[${i}] = ${arr[i]} joda → window = ${window}.`,
        vars: { window },
        panels: [array(arr, { ranges: [{ from: 0, to: i, label: `window = ${window}` }], tones: { [i]: 'new' } })],
      });
    }
    let best = window;
    let bestAt = 0;
    for (let i = k; i < arr.length; i++) {
      const out = arr[i - k];
      window += arr[i] - out;
      const better = window > best;
      if (better) {
        best = window;
        bestAt = i - k + 1;
      }
      t.frame({
        line: better ? 'best' : 'slide',
        caption: `Window ek kadam aage: ${arr[i]} aaya (+), ${out} gaya (−) → window = ${window}. Poora dobara nahi joda — sirf 2 kaam!${better ? ` Naya best = ${best}.` : ''}`,
        vars: { window, best },
        panels: [array(arr, { ranges: [{ from: i - k + 1, to: i, label: `window = ${window}`, tone: better ? 'found' : 'active' }], tones: { [i]: 'new', [i - k]: 'muted' } })],
      });
    }
    t.frame({
      line: 'done',
      caption: `Best = ${best}. Brute force har window ko dobara jodta (O(n·k)); sliding window har item ko ek baar jodta, ek baar ghatata → O(n).`,
      vars: { best },
      panels: [array(arr, { ranges: [{ from: bestAt, to: bestAt + k - 1, label: `best = ${best}`, tone: 'found' }] })],
    });
    return String(best);
  },
});
