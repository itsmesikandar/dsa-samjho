import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Tone, ToneMap } from '@/components/viz/engine/types';

const range = (from: number, to: number, tone: Tone): ToneMap => {
  const m: ToneMap = {};
  for (let i = from; i <= to; i++) m[i] = tone;
  return m;
};

// ---------- 3. Visual intro: size vs capacity, doubling ----------
export const capacityGrowth = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'Kitne items add karein', default: 9, min: 1, max: 16 }],
  run({ n }, t) {
    let cap = 1;
    let data: Cell[] = [null];
    let size = 0;
    let copies = 0;
    const view = (tones: ToneMap = {}, label = `backing array (capacity ${cap})`) =>
      array(data, { label, tones, ranges: size > 0 ? [{ from: 0, to: size - 1, label: `size = ${size}` }] : [] });
    t.frame({
      caption: 'ArrayList ke andar ek normal array hota hai. size = kitne items bhare, capacity = array kitna bada hai. Shuru mein capacity 1.',
      vars: { size, capacity: cap, copies },
      panels: [view()],
    });
    for (let k = 1; k <= n; k++) {
      const v = k * 10;
      if (size === cap) {
        t.frame({
          caption: `add(${v}) karna hai par array bhar gaya (size = capacity = ${cap}). Array badh nahi sakta — naya banana padega.`,
          vars: { size, capacity: cap, copies },
          panels: [view(range(0, size - 1, 'compare'))],
        });
        const old = [...data];
        cap *= 2;
        data = [...data, ...Array<null>(cap - old.length).fill(null)];
        copies += size;
        t.frame({
          caption: `Naya array capacity ${cap} (double) — purane ${size} items copy kiye. Ab tak total copies = ${copies}.`,
          vars: { size, capacity: cap, copies },
          panels: [array(old, { label: 'purana array (ab bekaar, GC saaf karega)', tones: range(0, old.length - 1, 'muted') }), view(range(0, size - 1, 'new'))],
        });
      }
      data[size] = v;
      size++;
      t.frame({
        caption: `add(${v}) → index ${size - 1} par rakha. Koi copy nahi — O(1).${size === cap ? ' (Ab array poora bhara hai.)' : ''}`,
        vars: { size, capacity: cap, copies },
        panels: [view({ [size - 1]: 'found' })],
      });
    }
    t.frame({
      caption: `${n} adds, total copies sirf ${copies} (n se kam!). Har add par average ~1 copy → amortized O(1). Agar capacity +1 badhaate, to copies ~n²/2 hoti. (Java ArrayList 1.5× badhata hai — idea same.)`,
      vars: { size, capacity: cap, copies },
      panels: [view()],
    });
    return `${size}/${cap}`;
  },
});

// ---------- 4. How: MyIntList.add + grow ----------
export const growTrace = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'Add karne wale values', default: [10, 20, 30, 40, 50], minLen: 1, maxLen: 10, min: -99, max: 99 }],
  run({ values }, t) {
    let data: Cell[] = [null, null];
    let size = 0;
    const view = (tones: ToneMap = {}, ptr: Record<string, number> = {}) =>
      array(data, { label: `data (capacity ${data.length})`, tones, pointers: ptr, ranges: size > 0 ? [{ from: 0, to: size - 1, label: `size = ${size}` }] : [] });
    for (const x of values) {
      const full = size === data.length;
      t.frame({
        line: 'check',
        caption: full ? `add(${x}): size (${size}) == capacity (${data.length}) → jagah nahi! Pehle grow().` : `add(${x}): size ${size} < capacity ${data.length} → jagah hai.`,
        vars: { x, size, capacity: data.length },
        panels: [view(full ? range(0, size - 1, 'compare') : {})],
      });
      if (full) {
        const bigger: Cell[] = Array(data.length * 2).fill(null);
        t.frame({
          line: 'alloc',
          caption: `bigger = IntArray(${bigger.length}) — double size ka naya array. Ab purane items isme copy karne hain.`,
          vars: { size, capacity: data.length },
          panels: [view(), array(bigger, { label: `bigger (capacity ${bigger.length})`, tones: range(0, bigger.length - 1, 'new') })],
        });
        for (let i = 0; i < size; i++) {
          bigger[i] = data[i];
          t.frame({
            line: 'copy',
            caption: `bigger[${i}] = data[${i}] = ${data[i]}. Ye copy hi resize ka cost hai — O(size).`,
            vars: { i },
            panels: [view({ [i]: 'compare' }, { i }), array(bigger, { label: `bigger (capacity ${bigger.length})`, tones: { ...range(0, i - 1, 'done'), [i]: 'new' }, pointers: { i } })],
          });
        }
        data = bigger;
        t.frame({
          line: 'swap',
          caption: `data = bigger. Purana array ab kisi ke kaam ka nahi — Garbage Collector use saaf karega.`,
          vars: { size, capacity: data.length },
          panels: [view(range(0, size - 1, 'done'))],
        });
      }
      data[size] = x;
      size++;
      t.frame({
        line: 'put',
        caption: `data[${size - 1}] = ${x}, size = ${size}.`,
        vars: { size, capacity: data.length },
        panels: [view({ [size - 1]: 'found' })],
      });
    }
    t.frame({
      caption: `Ho gaya: size = ${size}, capacity = ${data.length}. Zyada-tar adds seedhe O(1) the; copy sirf kabhi-kabhi hui.`,
      vars: { size, capacity: data.length },
      panels: [view()],
    });
    return `size = ${size}, capacity = ${data.length}`;
  },
});

// ---------- Example 1: operations aur unki cost ----------
export const opsTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Shuru ki list', default: [3, 7, 9], minLen: 2, maxLen: 6, min: -99, max: 99 }],
  run({ arr }, t) {
    const list = [...arr];
    const id = arr.map((_, i) => `v${i}`);
    const show = (line: string, caption: string, tones: ToneMap = {}) => t.frame({ line, caption, vars: { size: list.length }, panels: [array(list, { ids: [...id], tones })] });
    show('init', `List banayi: ${listStr(list)}.`);
    list.push(5);
    id.push('n5');
    show('add', 'add(5) → end par. Kisi ko shift karna nahi pada — O(1) (amortized).', { [list.length - 1]: 'new' });
    show('addfront', 'add(0, 1) karne se pehle: index 0 khaali karne ke liye SAARE items ek step right shift honge.', range(0, list.length - 1, 'compare'));
    list.unshift(1);
    id.unshift('n1');
    show('addfront', `add(0, 1) → ${list.length - 1} items shift hue, phir 1 shuru mein. Isliye O(n).`, { 0: 'new' });
    show('remove', `removeAt(2) → ${list[2]} hatana hai. Uske baad wale items left shift honge.`, { 2: 'error', ...range(3, list.length - 1, 'compare') });
    list.splice(2, 1);
    id.splice(2, 1);
    show('remove', `Hata diya; gap bharne ke liye ${list.length - 2} items shift hue — O(n).`, range(2, list.length - 1, 'swap'));
    list[1] = 8;
    show('set', 'list[1] = 8 → seedha index par likha. O(1).', { 1: 'found' });
    t.frame({
      caption: `Final: ${listStr(list)}, size ${list.length}. Yaad rakho: end par kaam sasta, shuru/beech mein mehenga.`,
      vars: { size: list.length },
      panels: [array(list, { ids: [...id] })],
    });
    return listStr(list);
  },
});

// ---------- Example 2: saare x hatao, O(n) ----------
export const removeAllX = tracer<{ arr: number[]; x: number }>({
  inputs: [
    { name: 'arr', type: 'intArray', label: 'List', default: [3, 2, 2, 3, 4, 2], minLen: 1, maxLen: 10, min: 0, max: 9 },
    { name: 'x', type: 'int', label: 'Kya hatana hai (x)', default: 2, min: 0, max: 9 },
  ],
  run({ arr, x }, t) {
    const list = [...arr];
    let w = 0;
    t.frame({ legend: { error: 'hatana hai', compare: 'rakhna hai' },
      line: 'init',
      caption: `2 pointers: r padhta hai, w batata hai agla "rakhne layak" item kahan likhna hai. Har item ko removeAt karte to har baar shifting → O(n²).`,
      vars: { w, x },
      panels: [array(list, { pointers: { w } })],
    });
    for (let r = 0; r < list.length; r++) {
      const keep = list[r] !== x;
      t.frame({ legend: { error: 'hatana hai', compare: 'rakhna hai' },
        line: 'check',
        caption: `list[${r}] = ${list[r]} ${keep ? `!= ${x} → rakhna hai.` : `== ${x} → chhod do (likhenge nahi).`}`,
        vars: { r, w, x },
        panels: [array(list, { tones: { ...range(0, w - 1, 'done'), [r]: keep ? 'compare' : 'error' }, pointers: { r, w } })],
      });
      if (keep) {
        list[w] = list[r];
        w++;
        t.frame({ legend: { error: 'hatana hai', compare: 'rakhna hai' },
          line: 'keep',
          caption: `list[${w - 1}] = ${list[w - 1]} likha, w = ${w}. 0..${w - 1} tak saare rakhne layak items hain.`,
          vars: { r, w },
          panels: [array(list, { tones: { ...range(0, w - 2, 'done'), [w - 1]: 'new' }, pointers: { r, w } })],
        });
      }
    }
    t.frame({ legend: { error: 'hatana hai', compare: 'rakhna hai' },
      line: 'trim',
      caption: `w = ${w}. Index ${w} se aage ka sab bekaar hai — end se hatao (end se hatana O(1)).`,
      vars: { w },
      panels: [array(list, { tones: { ...range(0, w - 1, 'done'), ...range(w, list.length - 1, 'muted') }, pointers: { w } })],
    });
    list.length = w;
    t.frame({ legend: { error: 'hatana hai', compare: 'rakhna hai' },
      caption: `Final: ${listStr(list)}. Har item ek baar padha, ek baar likha → O(n), extra space O(1).`,
      panels: [array(list, { tones: range(0, w - 1, 'done') })],
    });
    return listStr(list);
  },
});

// ---------- Example 3: loop mein remove ka trap ----------
export const removeTrap = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'List', default: [1, 2, 4, 5, 6, 8], minLen: 1, maxLen: 8, min: 0, max: 20 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = arr.map((_, k) => `w${k}`);
    let i = 0;
    t.frame({ legend: { error: 'hatana hai', compare: 'shift hua hua (skip hoga)' }, caption: 'GALAT tareeka: i = 0 se aage badho, even mile to removeAt(i), aur har baar i++.', vars: { i }, panels: [array(a, { ids: [...id], pointers: { i } })] });
    while (i < a.length) {
      if (a[i] % 2 === 0) {
        const gone = a[i];
        t.frame({ legend: { error: 'hatana hai', compare: 'shift hua hua (skip hoga)' }, line: 'remove', caption: `list[${i}] = ${gone} even hai → removeAt(${i}).`, vars: { i }, panels: [array(a, { ids: [...id], tones: { [i]: 'error' }, pointers: { i } })] });
        a.splice(i, 1);
        id.splice(i, 1);
        const moved = a[i];
        t.frame({ legend: { error: 'hatana hai', compare: 'shift hua hua (skip hoga)' },
          line: 'inc',
          caption: moved === undefined ? `Hata diya. i++ → list khatam.` : `Hata diya — ab ${moved} shift ho ke index ${i} par aa gaya. Par ab i++ hoga, to ${moved} kabhi check hi nahi hoga!`,
          vars: { i },
          panels: [array(a, { ids: [...id], tones: moved === undefined ? {} : { [i]: moved % 2 === 0 ? 'error' : 'compare' }, pointers: { i } })],
        });
      } else {
        t.frame({ legend: { error: 'hatana hai', compare: 'shift hua hua (skip hoga)' }, line: 'inc', caption: `list[${i}] = ${a[i]} odd hai → rakho, i++.`, vars: { i }, panels: [array(a, { ids: [...id], tones: { [i]: 'done' }, pointers: { i } })] });
      }
      i++;
    }
    const wrong = [...a];
    const leftover = wrong.filter((v) => v % 2 === 0);
    t.frame({ legend: { error: 'hatana hai', compare: 'shift hua hua (skip hoga)' },
      caption: leftover.length
        ? `Result ${listStr(wrong)} — even numbers ${leftover.join(', ')} bach gaye! Bug: remove ke baad wale item ko skip kar diya.`
        : `Result ${listStr(wrong)} — is input par bug nahi dikha (continuous do even nahi the). Par logic phir bhi galat hai.`,
      panels: [array(wrong, { tones: Object.fromEntries(wrong.map((v, k) => [k, v % 2 === 0 ? 'error' : 'done'])) })],
    });
    const b = [...arr];
    const bid = arr.map((_, k) => `r${k}`);
    for (let j = b.length - 1; j >= 0; j--) {
      const even = b[j] % 2 === 0;
      t.frame({ legend: { error: 'hatana hai', compare: 'shift hua hua (skip hoga)' },
        line: 'back',
        caption: even ? `SAHI tareeka (peeche se): list[${j}] = ${b[j]} even → hatao. Iske peeche wale items shift hote hain, jo hum dekh chuke hain — koi skip nahi.` : `list[${j}] = ${b[j]} odd → rakho.`,
        vars: { i: j },
        panels: [array(b, { ids: [...bid], tones: { [j]: even ? 'error' : 'done' }, pointers: { i: j } })],
      });
      if (even) {
        b.splice(j, 1);
        bid.splice(j, 1);
      }
    }
    t.frame({ legend: { error: 'hatana hai', compare: 'shift hua hua (skip hoga)' },
      caption: `Sahi result: ${listStr(b)}. Aur bhi aasaan: removeAll { it % 2 == 0 } (Java: removeIf) — O(n) aur bug-free.`,
      panels: [array(b, { ids: [...bid], tones: range(0, b.length - 1, 'done') })],
    });
    return listStr(wrong);
  },
});
