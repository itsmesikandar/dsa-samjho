import { array, ids, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone, ToneMap } from '@/components/viz/engine/types';

const NAMES = 'ABCDEFGHIJ';

// ---------- 3. Visual intro: stable vs unstable ----------
export const stableDemo = tracer<{ marks: number[] }>({
  inputs: [{ name: 'marks', type: 'intArray', label: 'Marks (A, B, C… ke)', default: [3, 1, 3, 2, 1], minLen: 2, maxLen: 7, min: 1, max: 5 }],
  run({ marks }, t) {
    const people = marks.map((m, i) => ({ name: NAMES[i], m }));
    const label = (p: { name: string; m: number }) => `${p.name}:${p.m}`;
    t.frame({ caption: 'Students alphabet order mein khade hain (A, B, C…). Ab marks se sort karna hai. Barabar marks walon ka kya hoga?', panels: [array(people.map(label), { label: 'Shuru (naam order)' })] });
    // stable: insertion sort
    const st = [...people];
    for (let i = 1; i < st.length; i++) {
      const key = st[i];
      let j = i - 1;
      while (j >= 0 && st[j].m > key.m) {
        st[j + 1] = st[j];
        j--;
      }
      st[j + 1] = key;
    }
    // unstable: selection sort
    const un = [...people];
    for (let i = 0; i < un.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < un.length; j++) if (un[j].m < un[min].m) min = j;
      [un[i], un[min]] = [un[min], un[i]];
    }
    const broken: ToneMap = {};
    for (let i = 0; i + 1 < un.length; i++) if (un[i].m === un[i + 1].m && un[i].name > un[i + 1].name) {
      broken[i] = 'error';
      broken[i + 1] = 'error';
    }
    t.frame({ caption: 'STABLE sort (insertion / merge / TimSort): barabar marks wale apne purane order (A pehle, phir B…) mein hi rahe.', panels: [array(people.map(label), { label: 'Shuru' }), array(st.map(label), { label: 'Stable sort', tones: Object.fromEntries(st.map((_, i) => [i, 'done' as Tone])) })] });
    const anyBroken = Object.keys(broken).length > 0;
    t.frame({
      caption: anyBroken ? 'UNSTABLE sort (selection / quick): red pair dekho — barabar marks, par naam ka order ulta ho gaya! Pehle naam se sort kiya tha, wo mehnat gayi.' : 'Is input par unstable sort ne bhi order nahi toda — par guarantee nahi hai. [3, 1, 3, 2, 1] try karo.',
      legend: { error: 'order toota' },
      panels: [array(st.map(label), { label: 'Stable sort' }), array(un.map(label), { label: 'Unstable sort', tones: broken })],
    });
    return st.map(label).join(', ');
  },
});

// ---------- 4. How: counting sort ----------
export const countingTrace = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'arr (0..9)', default: [4, 2, 2, 8, 3, 3, 1], minLen: 1, maxLen: 10, min: 0, max: 9 }],
  run({ arr }, t) {
    const a = [...arr];
    const max = Math.max(...a);
    const count = Array<number>(max + 1).fill(0);
    const countPanel = (tones: ToneMap = {}): Panel => array(count, { label: `count[0..${max}]`, tones });
    t.frame({ line: 'count', caption: `Values 0..${max} ke beech. Har value ke liye ek dabba (count array) — compare ki zaroorat hi nahi.`, panels: [array(a, { label: 'a' }), countPanel()] });
    for (let i = 0; i < a.length; i++) {
      count[a[i]]++;
      t.frame({ line: 'count', caption: `${a[i]} mila → count[${a[i]}] = ${count[a[i]]}.`, vars: { i }, panels: [array(a, { label: 'a', tones: { [i]: 'active' } }), countPanel({ [a[i]]: 'new' })] });
    }
    let w = 0;
    const out = Array<number | null>(a.length).fill(null);
    for (let v = 0; v <= max; v++) {
      if (!count[v]) continue;
      for (let c = 0; c < count[v]; c++) out[w++] = v;
      t.frame({ line: 'write', caption: `count[${v}] = ${count[v]} → ${v} ko ${count[v]} baar likho.`, vars: { v }, panels: [array(out, { label: 'a (likhte hue)', tones: Object.fromEntries(Array.from({ length: w }, (_, q) => [q, q >= w - count[v] ? 'new' : 'done'])) }), countPanel({ [v]: 'found' })] });
    }
    t.frame({ line: 'write', caption: `${listStr(out)}. Time O(n + k) (k = range ${max + 1}), space O(k). Range chhoti ho tabhi fayda — values 10⁹ tak hon to count array hi nahi banega.`, panels: [array(out, { label: 'a', tones: Object.fromEntries(out.map((_, q) => [q, 'done'])) })] });
    return listStr(out);
  },
});

// ---------- Example 1: sort by frequency ----------
export const freqTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [2, 3, 1, 3, 2], minLen: 1, maxLen: 8, min: -5, max: 9 }],
  run({ nums }, t) {
    const freq = new Map<number, number>();
    const mapPanel = (hot?: number): Panel => ({ kind: 'map', label: 'freq', keyLabel: 'number', valueLabel: 'kitni baar', entries: [...freq.entries()].map(([k, v]) => ({ key: k, value: v, tone: k === hot ? ('new' as Tone) : undefined })) });
    for (let i = 0; i < nums.length; i++) {
      freq.set(nums[i], (freq.get(nums[i]) ?? 0) + 1);
      t.frame({ line: 'count', caption: `${nums[i]} ki count = ${freq.get(nums[i])}.`, vars: { i }, panels: [array(nums, { tones: { [i]: 'active' } }), mapPanel(nums[i])] });
    }
    const sorted = [...nums].sort((a, b) => (freq.get(a)! - freq.get(b)!) || b - a);
    const keys = sorted.map((x) => `(${freq.get(x)}, ${x})`);
    t.frame({ line: 'sort', caption: `Har number ki "sort key" = (frequency ↑, value ↓): ${keys.join(' ')}. Pehle frequency compare; barabar ho tabhi value (ulti).`, panels: [array(nums, { label: 'nums' }), mapPanel()] });
    t.frame({ line: 'sort', caption: `Result ${listStr(sorted)}. Comparator = "pehle ye dekho, barabar ho to wo". Time O(n log n).`, panels: [array(sorted, { label: 'sorted', tones: Object.fromEntries(sorted.map((_, q) => [q, 'done'])) }), mapPanel()] });
    return listStr(sorted);
  },
});

// ---------- Example 2: largest number (custom comparator) ----------
export const largestTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums', default: [3, 30, 34, 5, 9], minLen: 1, maxLen: 6, min: 0, max: 99 }],
  run({ nums }, t) {
    const s = nums.map(String);
    const id = ids(s.length);
    t.frame({ line: 'sort', caption: 'Seedha bade se chhota sort: [9, 5, 34, 30, 3] → "9534303" — galat! 3 aur 30 mein "330" > "303", to 3 pehle aana chahiye. Rule: a+b vs b+a.', panels: [array(s, { ids: id })] });
    // insertion sort with the custom rule, frames per comparison
    for (let i = 1; i < s.length; i++) {
      let j = i;
      while (j > 0) {
        const a = s[j - 1];
        const b = s[j];
        const bFirst = b + a > a + b;
        t.frame({ line: 'sort', caption: `"${a}" vs "${b}": ${a}+${b} = ${a + b}, ${b}+${a} = ${b + a} → ${bFirst ? `"${b}" pehle aana chahiye — swap.` : `"${a}" pehle theek hai.`}`, vars: { i }, panels: [array(s, { ids: id, tones: { [j - 1]: 'compare', [j]: 'compare' } })] });
        if (!bFirst) break;
        [s[j - 1], s[j]] = [s[j], s[j - 1]];
        [id[j - 1], id[j]] = [id[j], id[j - 1]];
        j--;
      }
    }
    if (s[0] === '0') {
      t.frame({ line: 'zero', caption: 'Sabse aage "0" hai → sab zero hain. "000" nahi, "0" return.', panels: [array(s, { ids: id })] });
      return '0';
    }
    const ans = s.join('');
    t.frame({ line: 'join', caption: `Jodo → "${ans}". Ye rule transitive hai, isliye koi bhi sort (n log n) isse sahi chalega.`, panels: [array(s, { ids: id, tones: Object.fromEntries(s.map((_, q) => [q, 'done'])) })] });
    return ans;
  },
});

// ---------- Example 3: queue reconstruction by height ----------
export const queueTrace = tracer<{ heights: number[] }>({
  inputs: [{ name: 'heights', type: 'intArray', label: 'Asli line ki heights (k hum nikaalenge)', default: [5, 7, 5, 6, 4, 7], minLen: 1, maxLen: 7, min: 1, max: 9 }],
  run({ heights }, t) {
    // asli line se [h, k] banao, phir ulta-pulta karo
    const people = heights.map((h, i) => [h, heights.slice(0, i).filter((x) => x >= h).length] as [number, number]);
    const given = [...people].sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const pair = (p: [number, number]) => `${p[0]},${p[1]}`;
    t.frame({ line: 'sort', caption: `Diya gaya (ulta-pulta): har [height, k] — k = aage kitne log mujhse lambe ya barabar. Line wapas banani hai.`, panels: [array(given.map(pair), { label: 'people' })] });
    const sorted = [...given].sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    t.frame({ line: 'sort', caption: `Sort: lambe pehle, same height par chhota k pehle → ${sorted.map((p) => `[${pair(p)}]`).join(' ')}. Chhote log baad mein aayenge — unke ghusne se lambon ka k nahi badalta (chhote unhe dikhte hi nahi).`, panels: [array(sorted.map(pair), { label: 'sorted' })] });
    const line: [number, number][] = [];
    const lineIds: string[] = [];
    sorted.forEach((p, q) => {
      line.splice(p[1], 0, p);
      lineIds.splice(p[1], 0, `p${q}`);
      t.frame({ line: 'insert', caption: `[${pair(p)}]: line mein abhi sab ${p[0]} se lambe/barabar hain → mujhe index ${p[1]} par ghusna hai, taaki aage thik ${p[1]} log hon.`, vars: { h: p[0], k: p[1] }, panels: [array(sorted.map(pair), { label: 'sorted', tones: { [q]: 'active' } }), array(line.map(pair), { label: 'line', ids: [...lineIds], tones: { [p[1]]: 'new' } })] });
    });
    const out = line.map((p) => `[${p[0]}, ${p[1]}]`).join(', ');
    t.frame({ line: 'insert', caption: `Line ban gayi. Sort O(n log n) + har insert O(n) → O(n²) (n ≤ 2000 ke liye theek).`, panels: [array(line.map(pair), { label: 'line', ids: [...lineIds], tones: Object.fromEntries(line.map((_, q) => [q, 'done'])) })] });
    return out;
  },
});
