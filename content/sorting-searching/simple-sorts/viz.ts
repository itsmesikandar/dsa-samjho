import { array, ids, listStr, swap, tracer, type Recorder } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone, ToneMap } from '@/components/viz/engine/types';

const range = (from: number, to: number, tone: Tone): ToneMap => Object.fromEntries(Array.from({ length: Math.max(0, to - from + 1) }, (_, q) => [from + q, tone]));

// ---------- 3. Visual intro: bubble sort on bars ----------
export const bubbleBars = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr', default: [5, 1, 4, 2, 8, 3], minLen: 2, maxLen: 8, min: 1, max: 20 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const n = a.length;
    const bars = (tones: ToneMap): Panel => ({ kind: 'bars', values: [...a], ids: [...id], tones });
    t.frame({ caption: 'Bubble sort: neighbor pair (j, j + 1) dekho — bada wala left mein hai to swap. Har pass mein sabse bada bar end tak "bubble" ho jaata hai.', panels: [bars({})] });
    for (let pass = 0; pass < n - 1; pass++) {
      const fixed = range(n - pass, n - 1, 'done');
      let swapped = false;
      for (let j = 0; j < n - 1 - pass; j++) {
        const bad = a[j] > a[j + 1];
        t.frame({ caption: `Pass ${pass + 1}: ${a[j]} vs ${a[j + 1]} → ${bad ? 'galat order, swap!' : 'theek hai, aage.'}`, vars: { pass: pass + 1, j }, panels: [bars({ ...fixed, [j]: 'compare', [j + 1]: 'compare' })] });
        if (bad) {
          swap(a, j, j + 1);
          swap(id, j, j + 1);
          swapped = true;
          t.frame({ caption: `Swap → bada ${a[j + 1]} ek step right.`, vars: { pass: pass + 1, j }, panels: [bars({ ...fixed, [j]: 'swap', [j + 1]: 'swap' })] });
        }
      }
      t.frame({ caption: swapped ? `Pass ${pass + 1} khatam: ${a[n - 1 - pass]} apni pakki jagah par (green).` : `Is pass mein ek bhi swap nahi → array sorted. Jaldi ruk gaye (best case O(n)).`, vars: { pass: pass + 1 }, panels: [bars(swapped ? range(n - 1 - pass, n - 1, 'done') : range(0, n - 1, 'done'))] });
      if (!swapped) return listStr(a);
    }
    t.frame({ caption: `Sorted ${listStr(a)}. Compares ≈ n²/2 → O(n²).`, panels: [bars(range(0, n - 1, 'done'))] });
    return listStr(a);
  },
});

// ---------- insertion sort frames (how + example 3) ----------
function insertion(t: Recorder, input: number[], extra: (shifts: number, moved: number[]) => string) {
  const a: Cell[] = [...input];
  const id = ids(a.length);
  let shifts = 0;
  const moved = Array<number>(a.length).fill(0);
  const view = (key: number | null, tones: ToneMap, ptr: Record<string, number>): Panel[] => [
    array(a, { ids: id, tones, pointers: ptr }),
    array(key === null ? [] : [key], { label: 'key (haath mein)', tones: { 0: 'active' }, hideIndex: true }),
  ];
  t.frame({ line: 'pick', caption: 'Pehla item akela hai — wo apne aap "sorted" hai. Ab baaki items ek-ek karke uthao aur sorted hisse mein sahi jagah daalo.', panels: view(null, { 0: 'done' }, {}) });
  for (let i = 1; i < a.length; i++) {
    const key = a[i] as number;
    const keyId = id[i];
    a[i] = null;
    t.frame({ line: 'pick', caption: `key = ${key} uthaya (index ${i} ab khaali). Left wala hissa (0..${i - 1}) sorted hai.`, vars: { i, key }, panels: view(key, range(0, i - 1, 'done'), { i }) });
    let j = i - 1;
    let mine = 0;
    while (j >= 0 && (a[j] as number) > key) {
      a[j + 1] = a[j];
      id[j + 1] = id[j];
      a[j] = null;
      id[j] = keyId;
      shifts++;
      mine++;
      t.frame({ line: 'shift', caption: `${a[j + 1]} > ${key} → ${a[j + 1]} ek jagah right shift hua. Khaali jagah ab index ${j}.`, vars: { i, j, key, shifts }, panels: view(key, { ...range(0, i, 'done'), [j + 1]: 'swap' }, { j }) });
      j--;
    }
    a[j + 1] = key;
    id[j + 1] = keyId;
    moved[i] = mine;
    t.frame({ line: 'place', caption: j >= 0 ? `${a[j]} ≤ ${key} → ruk jao. key ko index ${j + 1} par rakha.` : `Sabse aage pahunch gaye → key index 0 par.`, vars: { i, key, shifts }, panels: view(null, { ...range(0, i, 'done'), [j + 1]: 'new' }, {}) });
  }
  t.frame({ line: 'place', caption: extra(shifts, moved), vars: { shifts }, panels: [array(a, { ids: id, tones: range(0, a.length - 1, 'done') })] });
  return listStr(a);
}

// ---------- 4. How: insertion sort ----------
export const insertionTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr', default: [5, 2, 4, 6, 1, 3], minLen: 1, maxLen: 8, min: -9, max: 20 }],
  run({ arr }, t) {
    return insertion(t, arr, (s) => `Sorted! Total shifts = ${s} (= inversions). Sorted input par 0 shifts → O(n); ulta input par n²/2 → O(n²).`);
  },
});

// ---------- Example 1: height checker (selection sort on a copy) ----------
export const heightTrace = tracer<{ heights: number[] }>({
  inputs: [{ name: 'heights', type: 'intArray', label: 'heights', default: [1, 1, 4, 2, 1, 3], minLen: 1, maxLen: 8, min: 1, max: 9 }],
  run({ heights }, t) {
    const e = [...heights];
    const id = ids(e.length);
    const n = e.length;
    t.frame({ line: 'find', caption: 'Asli line (heights) waisi hi rakho. Ek COPY (expected) ko selection sort se sort karenge — phir dono ko milayenge.', panels: [array(heights, { label: 'heights' }), array(e, { label: 'expected (copy)', ids: id })] });
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) if (e[j] < e[min]) min = j;
      t.frame({ line: 'find', caption: `Index ${i}..${n - 1} mein sabse chhota = ${e[min]} (index ${min}).`, vars: { i, min }, panels: [array(heights, { label: 'heights' }), array(e, { label: 'expected (copy)', ids: id, tones: { ...range(0, i - 1, 'done'), ...range(i, n - 1, 'compare'), [min]: 'found' }, pointers: { i, min } })] });
      swap(e, i, min);
      swap(id, i, min);
      t.frame({ line: 'swap', caption: min === i ? `Pehle se sahi jagah par — swap ki zaroorat nahi.` : `Swap → ${e[i]} index ${i} par. Har pass mein max ek swap.`, vars: { i, min }, panels: [array(heights, { label: 'heights' }), array(e, { label: 'expected (copy)', ids: id, tones: range(0, i, 'done') })] });
    }
    let count = 0;
    const mark: ToneMap = {};
    for (let i = 0; i < n; i++) {
      const bad = heights[i] !== e[i];
      if (bad) count++;
      mark[i] = bad ? 'error' : 'done';
      t.frame({ line: 'compare', caption: bad ? `Index ${i}: ${heights[i]} khada hai, ${e[i]} hona chahiye → galat jagah (count = ${count}).` : `Index ${i}: ${heights[i]} sahi jagah.`, vars: { i, count }, legend: { error: 'galat jagah', done: 'sahi' }, panels: [array(heights, { label: 'heights', tones: { ...mark } }), array(e, { label: 'expected', ids: id, tones: { ...mark } })] });
    }
    t.frame({ line: 'compare', caption: `${count} students galat jagah. Heights chhoti range (1..100) mein hon to counting sort se O(n) bhi ho sakta hai.`, vars: { count }, panels: [array(heights, { label: 'heights', tones: mark }), array(e, { label: 'expected', ids: id, tones: mark })] });
    return String(count);
  },
});

// ---------- Example 2: adjacent swaps = inversions ----------
export const swapsTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr', default: [2, 4, 1, 3, 5], minLen: 1, maxLen: 7, min: 1, max: 20 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const n = a.length;
    const inv: string[] = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (arr[i] > arr[j]) inv.push(`(${arr[i]}, ${arr[j]})`);
    let swaps = 0;
    t.frame({ line: 'compare', caption: `Inversions = ulte jode (bada pehle, chhota baad mein): ${inv.length ? inv.join(' ') : 'koi nahi'}. Dekho bubble sort ke swaps inhi ke barabar aate hain.`, vars: { inversions: inv.length }, panels: [array(a, { ids: id })] });
    for (let pass = 0; pass < n - 1; pass++) {
      const fixed = range(n - pass, n - 1, 'done');
      for (let j = 0; j < n - 1 - pass; j++) {
        const bad = a[j] > a[j + 1];
        t.frame({ line: 'compare', caption: `${a[j]} vs ${a[j + 1]} → ${bad ? 'ulta jodi!' : 'theek.'}`, vars: { swaps }, panels: [array(a, { ids: id, tones: { ...fixed, [j]: 'compare', [j + 1]: 'compare' } })] });
        if (bad) {
          swap(a, j, j + 1);
          swap(id, j, j + 1);
          swaps++;
          t.frame({ line: 'swap', caption: `Swap. Sirf (${a[j + 1]}, ${a[j]}) wala ek inversion khatam hua — baaki jode ka order nahi badla. swaps = ${swaps}.`, vars: { swaps }, panels: [array(a, { ids: id, tones: { ...fixed, [j]: 'swap', [j + 1]: 'swap' } })] });
        }
      }
    }
    t.frame({ line: 'swap', caption: `Total swaps = ${swaps} = inversions. Ye O(n²) hai; merge sort se inversions O(n log n) mein count kar sakte hain.`, vars: { swaps }, panels: [array(a, { ids: id, tones: range(0, n - 1, 'done') })] });
    return String(swaps);
  },
});

// ---------- Example 3: nearly sorted ----------
export const nearlyTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr (approx sorted)', default: [6, 5, 3, 2, 8, 10, 9], minLen: 1, maxLen: 8, min: 1, max: 20 }],
  run({ arr }, t) {
    const sorted = [...arr].sort((x, y) => x - y);
    const used = new Set<number>();
    let k = 0;
    arr.forEach((v, i) => {
      const p = sorted.findIndex((s, q) => s === v && !used.has(q));
      used.add(p);
      k = Math.max(k, Math.abs(p - i));
    });
    t.frame({ line: 'pick', caption: `Is input mein har item apni sahi jagah se max k = ${k} door hai. Insertion sort ka andar wala loop kisi item ke liye ${k} se zyada nahi chalega.`, vars: { k }, panels: [array(arr)] });
    return insertion(t, arr, (s, moved) => `Shifts = ${s}, sabse zyada ek item ne ${Math.max(0, ...moved)} step liye (≤ k = ${k}). Total ≤ n·k = ${arr.length * k} → O(n·k).`);
  },
});
