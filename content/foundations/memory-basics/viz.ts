import { listStr, tracer } from '@/components/viz/engine/tracer';
import type { LinearPanel, MapPanel, MemoryCell, MemoryPanel, Tone } from '@/components/viz/engine/types';

const blank = (n: number): MemoryCell[] => Array.from({ length: n }, () => ({}));

const stack = (frames: string[]): LinearPanel => ({
  kind: 'stack',
  label: 'Stack (function calls ke frames)',
  items: frames,
  ids: frames.map((_, i) => `f${i}`),
  tones: frames.length ? { [frames.length - 1]: 'active' } : {},
});

// ---------- 3. Visual intro: RAM, address, variable ----------
export const ramIntro = tracer<{ age: number }>({
  inputs: [{ name: 'age', type: 'int', label: 'age ki value', default: 25, min: 0, max: 998 }],
  run({ age }, t) {
    const mem = (cells: MemoryCell[]): MemoryPanel => ({ kind: 'memory', label: 'RAM (yahan har dabba = 4 bytes)', start: 100, cells });
    const cells = blank(8);
    t.frame({
      caption:
        'RAM ek bahut lambi line hai — crore-on chhote dabbe (bytes). Har dabbe ka ek number hota hai: address. Yahan 4-4 bytes ke group dikhaye hain, kyunki ek Int 4 bytes ka hota hai.',
      panels: [mem(cells)],
    });
    cells[1] = { value: age, tag: 'age', tone: 'new' };
    t.frame({
      caption: `\`val age = ${age}\` → JVM ne 4 bytes ki jagah di (address 104) aur ${age} likh diya. Variable ka naam bas us address ka nickname hai — computer naam nahi, address yaad rakhta hai.`,
      vars: { age },
      panels: [mem(cells)],
    });
    cells[1] = { value: age, tag: 'age', tone: 'compare' };
    cells[2] = { value: age + 1, tag: 'next', tone: 'new' };
    t.frame({
      caption: `\`val next = age + 1\` → address 104 se ${age} padha, 1 joda, aur ${age + 1} naye dabbe (108) mein likha. Address pata ho to padhna aur likhna dono O(1) hain.`,
      vars: { age, next: age + 1 },
      panels: [mem(cells)],
    });
    cells[1] = { value: age, tag: 'age' };
    cells[2] = { value: age + 1, tag: 'next' };
    cells[3] = { value: age, tag: 'copy', tone: 'new' };
    t.frame({
      caption:
        '`val copy = age` → Int jaise primitive ko copy karne par VALUE copy hoti hai. copy ka apna alag dabba (112) hai — ek ko badlo, doosre par koi asar nahi.',
      vars: { age, next: age + 1, copy: age },
      panels: [mem(cells)],
    });
    return String(age + 1);
  },
});

// ---------- 4. How: stack frames + heap objects ----------
export const stackHeap = tracer<{ n: number; arr: number[] }>({
  inputs: [
    { name: 'n', type: 'int', label: 'n', default: 5, min: -40, max: 40 },
    { name: 'arr', type: 'intArray', label: 'arr ke values', default: [1, 2, 3], minLen: 1, maxLen: 4, min: -99, max: 99 },
  ],
  run({ n, arr }, t) {
    const HEAP = 1000;
    const heap = (filled: boolean, tone?: Tone): MemoryPanel => ({
      kind: 'memory',
      label: 'Heap (objects yahan bante hain)',
      start: HEAP,
      cells: [...arr.map((v, i): MemoryCell => (filled ? { value: v, tag: `arr[${i}]`, tone } : {})), ...blank(2)],
    });
    const main = `main: n = ${n}`;
    const mainArr = `${main}, arr → ${HEAP}`;
    const sq = n * n;

    t.frame({
      line: 'n',
      caption: `Program shuru → main() ka frame stack par bana. n = ${n} ek primitive hai, isliye seedha frame ke andar rehta hai.`,
      vars: { n },
      panels: [stack([main]), heap(false)],
    });
    t.frame({
      line: 'arr',
      caption: `intArrayOf(...) ek OBJECT hai → heap par bana (address ${HEAP}). Stack frame mein sirf uska address rakha gaya: arr → ${HEAP}. Isko reference kehte hain.`,
      vars: { n, arr: `→ ${HEAP}` },
      panels: [stack([mainArr]), heap(true, 'new')],
    });
    t.frame({
      line: 'call',
      caption: `square(n) call hua → stack par naya frame UPAR chadha. x mein n ki value (${n}) copy hui. main ka frame neeche wait kar raha hai.`,
      vars: { x: n },
      panels: [stack([mainArr, `square: x = ${n}`]), heap(true)],
    });
    t.frame({
      line: 'calc',
      caption: `result = x * x = ${sq}. Ye result bhi square ke frame ka local variable hai.`,
      vars: { x: n, result: sq },
      panels: [stack([mainArr, `square: x = ${n}, result = ${sq}`]), heap(true)],
    });
    t.frame({
      line: 'ret',
      caption: `return → square ka poora frame stack se hat gaya (x aur result khatam). Sirf value ${sq} wapas aayi aur main ke s mein gayi. Stack LIFO hai: jo frame last aaya, wahi pehle gaya.`,
      vars: { s: sq },
      panels: [stack([`${mainArr}, s = ${sq}`]), heap(true)],
    });
    t.frame({
      line: 'print',
      caption: `println(s) → ${sq}. Heap ka array abhi zinda hai kyunki arr use point kar raha hai. main khatam hone par koi reference nahi bachega, tab Garbage Collector use saaf karega.`,
      vars: { s: sq },
      panels: [stack([`${mainArr}, s = ${sq}`]), heap(true, 'done')],
    });
    return String(sq);
  },
});

// ---------- Example 1: kitne bytes? ----------
export const intBytes = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n (kitne Ints)', default: 3, min: 1, max: 6 }],
  run({ n }, t) {
    const START = 200;
    const cells: MemoryCell[] = blank(n * 4 + 2);
    const mem = (): MemoryPanel => ({ kind: 'memory', label: 'RAM (yahan har dabba = 1 byte)', start: START, step: 1, cells });
    t.frame({
      caption: `IntArray(${n}) → JVM ko ${n} Ints ke liye ek saath jagah chahiye. Har Int 4 bytes ka hai. Dekho kitne dabbe lagte hain.`,
      vars: { n },
      panels: [mem()],
    });
    for (let i = 0; i < n; i++) {
      const tone: Tone = i % 2 === 0 ? 'active' : 'new';
      for (let b = 0; b < 4; b++) cells[i * 4 + b] = { value: 0, tone, tag: b === 0 ? `arr[${i}]` : undefined };
      const a = START + i * 4;
      t.frame({
        caption: `arr[${i}] ko 4 bytes mile: address ${a} se ${a + 3} tak. (Naye IntArray mein sab 0 hota hai.)`,
        vars: { n, i, 'bytes ab tak': (i + 1) * 4 },
        panels: [mem()],
      });
    }
    t.frame({
      line: 'calc',
      caption: `Total = n × 4 = ${n} × 4 = ${n * 4} bytes. Bade n par bhi yahi formula: 10⁵ Ints ≈ 400 KB, 10⁷ Ints ≈ 40 MB. LongArray hota to double (8 bytes har item).`,
      vars: { n, bytes: n * 4 },
      panels: [mem()],
    });
    return String(n * 4);
  },
});

// ---------- Example 2: reference trap ----------
export const referenceTrap = tracer<{ arr: number[]; v: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'a ke values', default: [1, 2, 3], minLen: 1, maxLen: 5, min: -99, max: 99 },
    { name: 'v', type: 'int', label: 'b[0] mein kya likhna hai', default: 99, min: -99, max: 99 },
  ],
  run({ arr, v }, t) {
    const n = arr.length;
    const A = 1000;
    const B = A + (n + 2) * 4;
    const a = [...arr];
    let c: number[] | null = null;
    const heap = (toneA: Record<number, Tone> = {}, toneB: Record<number, Tone> = {}): MemoryPanel => ({
      kind: 'memory',
      label: 'Heap',
      start: A,
      cells: [
        ...a.map((x, i): MemoryCell => ({ value: x, tag: i === 0 ? `object @${A}` : undefined, tone: toneA[i] })),
        ...blank(2),
        ...(c ?? Array<undefined>(n).fill(undefined)).map((x, i): MemoryCell =>
          x === undefined ? {} : { value: x, tag: i === 0 ? `object @${B}` : undefined, tone: toneB[i] },
        ),
      ],
    });
    const vars = (entries: [string, string, Tone?][]): MapPanel => ({
      kind: 'map',
      label: 'Stack (variables)',
      keyLabel: 'variable',
      valueLabel: 'andar kya hai',
      entries: entries.map(([key, value, tone]) => ({ key, value, tone })),
    });
    const all = (tone: Tone) => Object.fromEntries(a.map((_, i) => [i, tone]));

    t.frame({
      line: 'a',
      caption: `intArrayOf(...) se heap par ek array object bana (address ${A}). Variable a ke paas sirf ye address hai, values nahi.`,
      panels: [vars([['a', `→ ${A}`, 'new']]), heap(all('new'))],
    });
    t.frame({
      line: 'b',
      caption: `\`val b = a\` ne nayi array NAHI banayi — sirf address ${A} copy hua. Ab a aur b ek hi array ke do naam hain, jaise ek ghar ke do pate.`,
      panels: [vars([['a', `→ ${A}`], ['b', `→ ${A}`, 'new']]), heap(all('active'))],
    });
    a[0] = v;
    t.frame({
      line: 'write',
      caption: `b[0] = ${v} → b ne address ${A} wale object ka pehla dabba badla. Lekin a bhi isi object ko dekhta hai!`,
      panels: [vars([['a', `→ ${A}`], ['b', `→ ${A}`, 'active']]), heap({ 0: 'error' })],
    });
    const printed = listStr(a);
    t.frame({
      line: 'print',
      caption: `a print kiya → ${printed}. a ko kisi ne chhua bhi nahi, phir bhi badal gaya. Yahi "reference trap" hai.`,
      panels: [vars([['a', `→ ${A}`, 'error'], ['b', `→ ${A}`]]), heap({ 0: 'error' }), { kind: 'text', label: 'Output', text: printed }],
    });
    c = [...a];
    t.frame({
      line: 'copy',
      caption: `copyOf() ne heap par NAYA object banaya (address ${B}) aur saare ${n} values ek-ek karke copy kiye. Isliye copy karna O(n) time aur O(n) memory leta hai.`,
      panels: [vars([['a', `→ ${A}`], ['b', `→ ${A}`], ['c', `→ ${B}`, 'new']]), heap({}, Object.fromEntries(c.map((_, i) => [i, 'new' as Tone])))],
    });
    c[n - 1] = 50;
    t.frame({
      line: 'write2',
      caption: `c[${n - 1}] = 50 → sirf naya object badla. a wala object safe hai, kyunki ab dono alag-alag dabbe hain.`,
      panels: [vars([['a', `→ ${A}`, 'done'], ['b', `→ ${A}`], ['c', `→ ${B}`, 'swap']]), heap({}, { [n - 1]: 'swap' })],
    });
    return printed;
  },
});

// ---------- Example 3: pass-by-value ----------
export const passByValue = tracer<{ num: number; arr: number[] }>({
  inputs: [
    { name: 'num', type: 'int', label: 'num', default: 5, min: -99, max: 99 },
    { name: 'arr', type: 'intArray', label: 'arr ke values', default: [5, 6], minLen: 1, maxLen: 4, min: -99, max: 99 },
  ],
  run({ num, arr }, t) {
    const HEAP = 1000;
    const a = [...arr];
    const heap = (tone?: Tone): MemoryPanel => ({
      kind: 'memory',
      label: 'Heap',
      start: HEAP,
      cells: a.map((v, i): MemoryCell => ({ value: v, tag: `arr[${i}]`, tone: i === 0 ? tone : undefined })),
    });
    const main = `main: num = ${num}, arr → ${HEAP}`;
    const fn = (x?: number) => `tryChange: num = ${num}, arr → ${HEAP}${x === undefined ? '' : `, x = ${x}`}`;

    t.frame({
      line: 'call',
      caption: `main mein num = ${num} (stack par) aur arr → ${HEAP} (heap ka object). Ab tryChange(num, arr) call karte hain.`,
      panels: [stack([main]), heap()],
    });
    t.frame({
      line: 'local',
      caption: `Naya frame bana. Arguments ki VALUE copy hui: num ki value ${num}, aur arr ki value — yaani address ${HEAP}. Phir x = num, ek aur local copy.`,
      vars: { x: num },
      panels: [stack([main, fn(num)]), heap('active')],
    });
    t.frame({
      line: 'x',
      caption: `x = 100 → sirf tryChange ke frame ka dabba badla. main ka num abhi bhi ${num} hai — usko kisi ne chhua hi nahi.`,
      vars: { x: 100 },
      panels: [stack([main, fn(100)]), heap('active')],
    });
    a[0] = 100;
    t.frame({
      line: 'arr',
      caption: `arr[0] = 100 → address ${HEAP} ke through HEAP ka asli array badla. main ka arr bhi isi address ko dekhta hai!`,
      vars: { x: 100 },
      panels: [stack([main, fn(100)]), heap('error')],
    });
    t.frame({
      line: 'print',
      caption: `Function khatam → uska frame hat gaya. main mein num = ${num} (nahi badla) par arr = ${listStr(a)} (badal gaya!). Rule: Java/Kotlin hamesha pass-by-VALUE hain — object ke case mein wo value ek address hoti hai.`,
      vars: { num, arr: listStr(a) },
      panels: [stack([main]), heap('error')],
    });
    return String(num);
  },
});
