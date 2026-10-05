import { array, ids, listStr, swap, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Tone, ToneMap } from '@/components/viz/engine/types';

const show = (c: string) => (c === ' ' ? '␣' : c);
const upTo = (k: number, tone: Tone): ToneMap => Object.fromEntries(Array.from({ length: Math.max(0, k) }, (_, i) => [i, tone]));

// ---------- 3. Visual intro: reader aur writer ----------
export const readerWriter = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Sentence (faltu spaces ke saath)', default: 'chai   pe  charcha', minLen: 1, maxLen: 24, charset: 'abcdefghijklmnopqrstuvwxyz ' }],
  run({ s }, t) {
    const c = [...s];
    let w = 0;
    t.frame({
      caption: 'Do pointers, DONO aage hi badhte hain: r (reader) har char padhta hai, w (writer) sirf kaam ke chars likhta hai. Kaam: lagatar spaces ko ek space bana do (shuru ke spaces hata do) — usi array mein.',
      panels: [array(c.map(show), { pointers: { r: 0, w: 0 } })],
    });
    for (let r = 0; r < c.length; r++) {
      const keep = c[r] !== ' ' || (w > 0 && c[w - 1] !== ' ');
      if (keep) {
        c[w] = c[r];
        w++;
      }
      t.frame({
        caption: keep ? `'${show(c[w - 1])}' kaam ka hai → w par likha, w = ${w}.` : `Faltu space (pichla likha char bhi space hai${w === 0 ? ' / shuru ka space' : ''}) → skip. Sirf r aage badha.`,
        vars: { r, w },
        panels: [array(c.map(show), { tones: { ...upTo(w, 'done'), [r]: keep ? 'new' : 'muted' }, pointers: { r, w } })],
      });
    }
    const out = c.slice(0, w).join('');
    t.frame({
      caption: `Pehle ${w} chars hi answer hain: "${out}". r ne n chars padhe, w ne sirf kaam ke likhe → O(n), koi nayi array nahi → O(1) space.`,
      vars: { w },
      panels: [array(c.map(show), { tones: { ...upTo(w, 'done'), ...Object.fromEntries(c.map((_, i) => [i, i >= w ? 'muted' : 'done'])) } })],
    });
    return out;
  },
});

// ---------- 4. How: remove duplicates (sorted) ----------
export const dedupTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'Sorted nums', default: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], minLen: 1, maxLen: 10, min: 0, max: 9, sorted: true }],
  run({ nums }, t) {
    const a = [...nums];
    let w = 1;
    t.frame({ line: 'init', caption: 'a[0] hamesha unique hai, isliye w = 1 (agla unique yahan likhenge). r 1 se padhna shuru.', vars: { w }, panels: [array(a, { tones: { 0: 'done' }, pointers: { w } })] });
    for (let r = 1; r < a.length; r++) {
      const isNew = a[r] !== a[w - 1];
      t.frame({ line: 'check', caption: `a[${r}] = ${a[r]} vs pichla likha a[${w - 1}] = ${a[w - 1]} → ${isNew ? 'alag — naya unique!' : 'same — duplicate, skip.'}`, vars: { r, w }, panels: [array(a, { tones: { ...upTo(w, 'done'), [w - 1]: 'compare', [r]: isNew ? 'new' : 'muted' }, pointers: { r, w } })] });
      if (isNew) {
        a[w] = a[r];
        w++;
        t.frame({ line: 'write', caption: `a[${w - 1}] = ${a[w - 1]} likha, w = ${w}.`, vars: { r, w }, panels: [array(a, { tones: { ...upTo(w, 'done'), [w - 1]: 'found' }, pointers: { r, w } })] });
      }
    }
    t.frame({ line: 'done', caption: `${w} unique: ${listStr(a.slice(0, w))}. Sorted hone se duplicates padosi the — isliye sirf pichle likhe item se compare kaafi tha.`, vars: { w }, panels: [array(a, { tones: { ...upTo(w, 'done'), ...Object.fromEntries(a.map((_, i) => [i, i >= w ? 'muted' : 'done'])) } })] });
    return String(w);
  },
});

// ---------- Example 1: move zeroes ----------
export const moveZeroesTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [0, 1, 0, 3, 12], minLen: 1, maxLen: 10, min: 0, max: 20 }],
  run({ nums }, t) {
    const a = [...nums];
    const id = ids(a.length);
    let w = 0;
    t.frame({ line: 'init', caption: 'w = 0: agla non-zero yahan aayega. r har item dekhega.', vars: { w }, panels: [array(a, { ids: id, pointers: { r: 0, w } })] });
    for (let r = 0; r < a.length; r++) {
      const nz = a[r] !== 0;
      t.frame({ line: 'check', caption: nz ? `a[${r}] = ${a[r]} non-zero hai → w (${w}) par bhejna hai.` : `a[${r}] = 0 → chhodo, sirf r aage.`, vars: { r, w }, panels: [array(a, { ids: id, tones: { ...upTo(w, 'done'), [r]: nz ? 'active' : 'muted' }, pointers: { r, w } })] });
      if (nz) {
        swap(a, w, r);
        swap(id, w, r);
        w++;
        t.frame({ line: 'swap', caption: r === w - 1 ? `r == w — apni hi jagah par, swap se kuch nahi badla. w = ${w}.` : `Swap a[${w - 1}] ↔ a[${r}]: non-zero aage gaya, 0 peeche. Order wahi raha. w = ${w}.`, vars: { r, w }, panels: [array(a, { ids: id, tones: { ...upTo(w, 'done'), [w - 1]: 'swap', [r]: 'swap' }, pointers: { r, w } })] });
      }
    }
    t.frame({ line: 'check', caption: `Ho gaya: ${listStr(a)}. Ek pass, O(n), O(1) space.`, panels: [array(a, { ids: id, tones: upTo(w, 'done') })] });
    return listStr(a);
  },
});

// ---------- Example 2: merge sorted array (peeche se) ----------
export const mergeTrace = tracer<{ a: number[]; b: number[] }>({
  inputs: [
    { name: 'a', type: 'intArray', label: 'nums1 ke asli numbers (sorted)', default: [1, 2, 3], minLen: 0, maxLen: 6, min: -9, max: 20, sorted: true },
    { name: 'b', type: 'intArray', label: 'nums2 (sorted)', default: [2, 5, 6], minLen: 1, maxLen: 6, min: -9, max: 20, sorted: true },
  ],
  run({ a, b }, t) {
    const m = a.length;
    const n = b.length;
    const nums1: Cell[] = [...a, ...Array<number>(n).fill(0)];
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;
    const view = (tones: ToneMap = {}, btones: ToneMap = {}) => [
      array(nums1, { label: 'nums1', tones: { ...Object.fromEntries(Array.from({ length: m + n - 1 - k }, (_, q) => [k + 1 + q, 'done' as Tone])), ...tones }, pointers: { ...(i >= 0 ? { i } : {}), k } }),
      array(b, { label: 'nums2', tones: btones, pointers: j >= 0 ? { j } : {} }),
    ];
    t.frame({ line: 'init', caption: `nums1 ke end mein ${n} khaali jagah hain. Aage se merge karte to nums1 ke numbers overwrite ho jaate — isliye PEECHE se bharte hain (sabse bada pehle).`, panels: view() });
    while (j >= 0) {
      const takeA = i >= 0 && (nums1[i] as number) > b[j];
      t.frame({ line: 'compare', caption: i >= 0 ? `nums1[${i}] = ${nums1[i]} vs nums2[${j}] = ${b[j]} → ${takeA ? 'nums1 wala bada' : 'nums2 wala bada ya barabar'} — wahi k par jaayega.` : `nums1 ke numbers khatam — bache hue nums2 ke numbers seedhe copy.`, vars: { i, j, k }, panels: view(i >= 0 ? { [i]: 'compare' } : {}, { [j]: 'compare' }) });
      if (takeA) {
        nums1[k] = nums1[i];
        i--;
        k--;
        t.frame({ line: 'takeA', caption: `nums1[${k + 1}] = ${nums1[k + 1]}, i--.`, vars: { i, j, k }, panels: view({ [k + 1]: 'new' }) });
      } else {
        nums1[k] = b[j];
        j--;
        k--;
        t.frame({ line: 'takeB', caption: `nums1[${k + 1}] = ${nums1[k + 1]} (nums2 se), j--.`, vars: { i, j, k }, panels: view({ [k + 1]: 'new' }) });
      }
    }
    t.frame({ line: 'takeB', caption: `nums2 khatam → nums1 ke bache (index 0..${k}) pehle se sahi jagah par hain. Result ${listStr(nums1)}. O(m + n), O(1) extra.`, panels: [array(nums1, { label: 'nums1', tones: Object.fromEntries(nums1.map((_, q) => [q, 'done' as Tone])) })] });
    return listStr(nums1);
  },
});

// ---------- Example 3: remove duplicates II ----------
export const dupsIITrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'Sorted nums', default: [1, 1, 1, 2, 2, 3], minLen: 1, maxLen: 10, min: 0, max: 5, sorted: true }],
  run({ nums }, t) {
    const a = [...nums];
    let w = 0;
    t.frame({ line: 'init', caption: 'Har number max 2 baar. Trick: naya item tabhi likho jab wo 2 jagah PEECHE likhe item (a[w − 2]) se alag ho.', vars: { w }, panels: [array(a, { pointers: { w } })] });
    for (let r = 0; r < a.length; r++) {
      const x = a[r];
      const keep = w < 2 || x !== a[w - 2];
      t.frame({
        line: 'check',
        caption: w < 2 ? `Pehle 2 items hamesha rakho (w = ${w} < 2).` : keep ? `${x} vs a[w−2] = ${a[w - 2]} → alag, to teesri copy nahi hai — rakho.` : `${x} == a[w−2] = ${a[w - 2]} → ye ${x} ki TEESRI copy hogi — skip.`,
        vars: { r, w, x },
        panels: [array(a, { tones: { ...upTo(w, 'done'), ...(w >= 2 ? { [w - 2]: 'compare' } : {}), [r]: keep ? 'new' : 'error' }, pointers: { r, w } })],
      });
      if (keep) {
        a[w] = x;
        w++;
        t.frame({ line: 'write', caption: `a[${w - 1}] = ${x}, w = ${w}.`, vars: { r, w }, panels: [array(a, { tones: { ...upTo(w, 'done'), [w - 1]: 'found' }, pointers: { r, w } })] });
      }
    }
    t.frame({ line: 'done', caption: `Naya length ${w}: ${listStr(a.slice(0, w))}. Yahi trick "max k baar" ke liye: a[w − k] se compare.`, vars: { w }, panels: [array(a, { tones: Object.fromEntries(a.map((_, i) => [i, i < w ? 'done' : 'muted'])) })] });
    return String(w);
  },
});
