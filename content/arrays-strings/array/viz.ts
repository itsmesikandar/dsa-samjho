import { array, ids, listStr, swap, tracer } from '@/components/viz/engine/tracer';
import type { MemoryCell, ToneMap } from '@/components/viz/engine/types';

const allDone = (n: number): ToneMap => Object.fromEntries(Array.from({ length: n }, (_, k) => [k, 'done']));

// ---------- 3. Visual intro: array memory mein kaise baithta hai ----------
export const memoryLayout = tracer<{ arr: number[]; i: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Array values', default: [10, 20, 30, 40, 50], minLen: 1, maxLen: 6, min: -99, max: 99 },
    { name: 'i', type: 'int', label: 'Index i (kaunsa item chahiye)', default: 3, min: 0, max: 5 },
  ],
  check: ({ arr, i }) => (i < arr.length ? null : `i 0 se ${arr.length - 1} ke beech rakho (array mein ${arr.length} items hain).`),
  run({ arr, i }, t) {
    const BASE = 1000;
    const SIZE = 4;
    const start = BASE - 2 * SIZE;
    const cells = (mode: 'empty' | 'alloc' | 'base' | 'pick'): MemoryCell[] => [
      { value: 7, tag: 'x', tone: 'muted' },
      {},
      ...arr.map((v, k): MemoryCell => {
        if (mode === 'empty') return {};
        const tone = mode === 'alloc' ? 'new' : (mode === 'base' && k === 0) || (mode === 'pick' && k === i) ? 'found' : undefined;
        return { value: v, tag: `arr[${k}]`, tone };
      }),
      {},
      { value: 1, tag: 'flag', tone: 'muted' },
    ];
    const addr = BASE + i * SIZE;

    t.frame({
      caption:
        'RAM ko ek lambi line samjho. Har dabbe ka ek address hota hai — jaise ghar ka pata. Int 4 bytes ka hota hai, isliye address 4-4 karke badhte hain. "?" matlab abhi koi kaam ka data nahi.',
      panels: [{ kind: 'memory', label: 'RAM (memory)', start, cells: cells('empty') }],
    });
    t.frame({
      caption: `intArrayOf(...) likhte hi ${arr.length} dabbe EK SAATH, ek ke baad ek (contiguous) mil gaye. Beech mein koi gap nahi — yahi array ki sabse badi taakat hai.`,
      panels: [{ kind: 'memory', label: 'RAM (memory)', start, cells: cells('alloc') }],
    });
    t.frame({
      caption: `Array ko sirf apna pehla address (base = ${BASE}) yaad rakhna padta hai. Baaki har item ka address formula se nikal aata hai, kyunki sab barabar size ke hain aur line mein hain.`,
      vars: { base: BASE, size: SIZE },
      panels: [
        { kind: 'memory', label: 'RAM (memory)', start, cells: cells('base') },
        array(arr, { tones: { 0: 'found' }, address: { base: BASE, size: SIZE } }),
      ],
    });
    t.frame({
      caption: `arr[${i}] chahiye? address = base + i × 4 = ${BASE} + ${i} × 4 = ${addr}. Bas ek calculation — array mein 5 item ho ya 5 crore, time same. Isliye index se access O(1) hai.`,
      vars: { base: BASE, i, address: addr },
      panels: [
        { kind: 'memory', label: 'RAM (memory)', start, cells: cells('pick') },
        array(arr, { tones: { [i]: 'found' }, pointers: { i }, address: { base: BASE, size: SIZE } }),
      ],
    });
    return String(arr[i]);
  },
});

// ---------- 4. How: index par insert (shifting) ----------
export const insertAt = tracer<{ arr: number[]; index: number; value: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Bhare hue items', default: [10, 20, 30, 40, 50], minLen: 1, maxLen: 7, min: -99, max: 99 },
    { name: 'index', type: 'int', label: 'Kis index par daalna hai', default: 2, min: 0, max: 7 },
    { name: 'value', type: 'int', label: 'Naya value', default: 99, min: -99, max: 99 },
  ],
  check: ({ arr, index }) => (index <= arr.length ? null : `index 0 se ${arr.length} ke beech rakho (abhi size = ${arr.length}).`),
  run({ arr, index, value }, t) {
    const CAP = 8;
    const a: (number | null)[] = [...arr, ...Array<null>(CAP - arr.length).fill(null)];
    let size = arr.length;
    const view = (tones: ToneMap = {}, pointers: Record<string, number> = {}) =>
      array(a, { tones, pointers, ranges: [{ from: 0, to: size - 1, label: `bhare hue: size = ${size}` }] });

    t.frame({
      line: 'check',
      caption: `Capacity ${CAP} hai, abhi ${size} dabbe bhare hain. Pehle check: jagah bachi hai? ${size} < ${CAP}, haan. Index ${index} bhi 0..${size} ke andar hai, to aage badho.`,
      vars: { size, index, value },
      panels: [view()],
    });
    let i = size - 1;
    t.frame({
      line: 'init',
      caption: `i = size - 1 = ${i}. Peeche (right end) se shuru kyun? Agar aage se khiskaate to har copy agle value ko mita deti.`,
      vars: { i, index, value },
      panels: [view({ [i]: 'compare' }, { i })],
    });
    let shifts = 0;
    while (i >= index) {
      t.frame({
        line: 'loop',
        caption: `i = ${i} ≥ index ${index} — matlab arr[${i}] ko abhi ek kadam right khiskana baaki hai.`,
        vars: { i, index, value },
        panels: [view({ [i]: 'compare' }, { i })],
      });
      a[i + 1] = a[i];
      shifts++;
      t.frame({
        line: 'shift',
        caption: `arr[${i + 1}] = arr[${i}]: ${a[i]} right mein copy hua. Abhi ${a[i]} do jagah dikh raha hai — chinta mat karo, arr[${i}] baad mein overwrite hoga.`,
        vars: { i, index, value },
        panels: [view({ [i]: 'compare', [i + 1]: 'new' }, { i })],
      });
      i--;
    }
    t.frame({
      line: 'loop',
      caption:
        shifts === 0
          ? `i = ${i} < index ${index}, loop chala hi nahi. End par daalne mein kuch khiskana nahi padta — isliye wo O(1) hai.`
          : `i = ${i} < index ${index}, loop ruk gaya. arr[${index}] ka purana value aage copy ho chuka hai, ab ye jagah hamari hai.`,
      vars: { i, index, value },
      panels: [view({ [index]: 'active' }, { i })],
    });
    a[index] = value;
    t.frame({
      line: 'place',
      caption: `arr[${index}] = ${value}. Is baar ${shifts} item khiskane pade. Worst case (index 0) mein saare n items khiskte hain — isliye beech mein insert O(n) hai.`,
      vars: { index, value, shifts },
      panels: [view({ [index]: 'found' })],
    });
    size++;
    t.frame({
      line: 'done',
      caption: `size ${size - 1} se ${size} ho gaya. Ho gaya insert! Dhyaan do: dabbe apni jagah se hile nahi, sirf values copy huin.`,
      vars: { size },
      panels: [view(allDone(size))],
    });
    return listStr(a.slice(0, size));
  },
});

// ---------- Example 1: max dhoondo ----------
export const findMax = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [3, 8, 2, 9, 4], minLen: 1, maxLen: 10, min: -99, max: 99 }],
  run({ arr }, t) {
    let max = arr[0];
    let at = 0;
    t.frame({
      line: 'init',
      caption: `max = arr[0] = ${max}. Pehla number hi "abhi tak ka sabse bada" maan lo. max = 0 se shuru mat karna — agar saare numbers negative hue to answer galat aayega.`,
      vars: { max },
      panels: [array(arr, { tones: { 0: 'found' }, pointers: { max: 0 } })],
    });
    for (let i = 1; i < arr.length; i++) {
      const bigger = arr[i] > max;
      t.frame({
        line: 'compare',
        caption: `arr[${i}] = ${arr[i]} ko max = ${max} se compare karo. ${bigger ? 'Ye bada hai!' : 'Ye bada nahi hai, to max wahi rahega.'}`,
        vars: { i, max },
        panels: [array(arr, { tones: { [at]: 'found', [i]: 'compare' }, pointers: { i, max: at } })],
      });
      if (bigger) {
        max = arr[i];
        at = i;
        t.frame({
          line: 'update',
          caption: `max = ${max}. Naya champion mil gaya — aage ke numbers ab isse compare honge.`,
          vars: { i, max },
          panels: [array(arr, { tones: { [at]: 'found' }, pointers: { i, max: at } })],
        });
      }
    }
    t.frame({
      line: 'done',
      caption: `Saare ${arr.length} numbers ek-ek baar dekh liye. Sabse bada = ${max}. Har item ek baar dekha → O(n) time; sirf ek extra variable → O(1) space.`,
      vars: { max },
      panels: [array(arr, { tones: { [at]: 'found' }, pointers: { max: at } })],
    });
    return String(max);
  },
});

// ---------- Example 2: in-place reverse ----------
export const reverseArray = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 10, min: -99, max: 99 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    let l = 0;
    let r = a.length - 1;
    const settled = (): ToneMap => {
      const m: ToneMap = {};
      for (let k = 0; k < a.length; k++) if (k < l || k > r) m[k] = 'done';
      return m;
    };
    t.frame({
      line: 'init',
      caption: 'Do pointers: l shuru pe, r end pe. Idea: pehla ↔ aakhri, doosra ↔ second-last… aise beech tak swap karte jao.',
      vars: { l, r },
      panels: [array(a, { ids: id, pointers: { l, r } })],
    });
    while (l < r) {
      t.frame({
        line: 'loop',
        caption: `l = ${l} < r = ${r}: dono abhi mile nahi, to swap karna hai.`,
        vars: { l, r },
        panels: [array(a, { ids: id, tones: { ...settled(), [l]: 'compare', [r]: 'compare' }, pointers: { l, r } })],
      });
      swap(a, l, r);
      swap(id, l, r);
      t.frame({
        line: 'swap',
        caption: `Swap ho gaya: ab ${a[l]} left mein, ${a[r]} right mein. temp isliye chahiye — warna arr[l] = arr[r] karte hi purana arr[l] kho jaata.`,
        vars: { l, r },
        panels: [array(a, { ids: id, tones: { ...settled(), [l]: 'swap', [r]: 'swap' }, pointers: { l, r } })],
      });
      l++;
      r--;
      t.frame({
        line: 'move',
        caption: `Dono pointers andar ki taraf: l = ${l}, r = ${r}. Bahar wale items apni sahi jagah pahunch gaye (green).`,
        vars: { l, r },
        panels: [array(a, { ids: id, tones: settled(), pointers: { l, r } })],
      });
    }
    t.frame({
      line: 'loop',
      caption:
        l === r
          ? `l = r = ${l}: beech wala item apni jagah pe hi sahi hai. Loop khatam — array ulta ho gaya! n/2 swaps → O(n), koi nayi array nahi → O(1) space.`
          : `l (${l}) ne r (${r}) ko cross kar liya. Loop khatam — array ulta ho gaya! n/2 swaps → O(n), koi nayi array nahi → O(1) space.`,
      vars: { l, r },
      panels: [array(a, { ids: id, tones: allDone(a.length) })],
    });
    return listStr(a);
  },
});

// ---------- Example 3: rotate right by k (reversal trick) ----------
export const rotateRight = tracer<{ arr: number[]; k: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'Array', default: [1, 2, 3, 4, 5, 6, 7], minLen: 1, maxLen: 10, min: -99, max: 99 },
    { name: 'k', type: 'int', label: 'k (kitne steps right)', default: 3, min: 0, max: 30 },
  ],
  run({ arr, k }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const n = a.length;
    const steps = k % n;
    t.frame({
      line: 'mod',
      caption:
        k >= n
          ? `k = ${k} lekin n = ${n}. Poore ${n} steps ghumane par array wapas waisa hi ho jaata hai, isliye sirf k % n = ${steps} steps kaafi hain.`
          : `steps = k % n = ${k} % ${n} = ${steps}. (k agar n se bada hota, to bhi % se sahi number mil jaata.)`,
      vars: { n, k, steps },
      panels: [array(a, { ids: id })],
    });
    const phase = (from: number, to: number, line: string, label: string, intro: string) => {
      const ranges = from <= to ? [{ from, to, label }] : [];
      t.frame({ line, caption: intro, vars: { from, to }, panels: [array(a, { ids: id, ranges })] });
      let l = from;
      let r = to;
      while (l < r) {
        swap(a, l, r);
        swap(id, l, r);
        t.frame({
          line: 'swap',
          caption: `[${from}..${to}] ke andar arr[${l}] ↔ arr[${r}] swap (wahi reverse wala two-pointer).`,
          vars: { l, r },
          panels: [array(a, { ids: id, tones: { [l]: 'swap', [r]: 'swap' }, pointers: { l, r }, ranges })],
        });
        l++;
        r--;
      }
    };
    phase(0, n - 1, 'all', 'poora', `Step 1: poora array ulta karo. Isse aakhri ${steps} items aage aa jaate hain — bas unka order ulta hota hai.`);
    phase(
      0,
      steps - 1,
      'left',
      `pehle ${steps}`,
      `Step 2: pehle ${steps} items (index 0..${steps - 1}) ulte karo, taaki unka order wapas sahi ho jaaye.${steps <= 1 ? ' (0 ya 1 item ulta karne se kuch nahi badalta.)' : ''}`,
    );
    phase(
      steps,
      n - 1,
      'right',
      `baaki ${n - steps}`,
      `Step 3: baaki ${n - steps} items (index ${steps}..${n - 1}) ulte karo.${n - steps <= 1 ? ' (0 ya 1 item ulta karne se kuch nahi badalta.)' : ''}`,
    );
    t.frame({
      line: 'right',
      caption: `Ho gaya! Har item ${steps} jagah right khisak gaya. Teen reverse, har ek O(n) → total O(n) time, aur koi nayi array nahi → O(1) space.`,
      vars: { n, steps },
      panels: [array(a, { ids: id, tones: allDone(n) })],
    });
    return listStr(a);
  },
});
