import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { MapPanel, Tone } from '@/components/viz/engine/types';

type Entry = { key: string | number; value: string | number; tone?: Tone };
const mapPanel = (entries: Entry[], label: string, keyLabel = 'key', valueLabel = 'value'): MapPanel => ({
  kind: 'map',
  label,
  keyLabel,
  valueLabel,
  entries: entries.map((e) => ({ ...e })),
});

// ---------- 3. Visual intro: list scan vs HashMap ----------
export const listVsMap = tracer<Record<string, never>>({
  inputs: [],
  run(_, t) {
    const names = ['Ravi', 'Anu', 'Kabir', 'Meera', 'Dev', 'Sara'];
    const nums = [98100, 99200, 97300, 96400, 95500, 94600];
    const q = 'Dev';
    t.frame({
      caption: `Phonebook mein "${q}" ka number chahiye. Pehla tareeka: list mein ek-ek naam check karo (jaise purani diary ke panne palatna).`,
      panels: [array(names, { label: 'List (naam)' })],
    });
    for (let i = 0; i < names.length; i++) {
      const hit = names[i] === q;
      t.frame({
        caption: hit ? `Mil gaya — par ${i + 1} naam check karne pade. 10 lakh contacts mein worst case 10 lakh checks → O(n).` : `"${names[i]}" != "${q}", aage.`,
        vars: { checks: i + 1 },
        panels: [array(names, { label: 'List (naam)', tones: { [i]: hit ? 'found' : 'compare' }, pointers: { i } })],
      });
      if (hit) break;
    }
    const entries: Entry[] = names.map((n, i) => ({ key: n, value: nums[i], tone: n === q ? 'found' : undefined }));
    t.frame({
      caption: `HashMap: hash("${q}") → seedha uska bucket → number mil gaya. Ek hi kadam — 6 contacts hon ya 60 lakh. Average O(1).`,
      vars: { checks: 1 },
      panels: [mapPanel(entries, 'HashMap<String, Int>', 'naam (key)', 'number (value)')],
    });
    return String(nums[names.indexOf(q)]);
  },
});

// ---------- 4. How: basic operations ----------
export const phoneTrace = tracer<Record<string, never>>({
  inputs: [],
  run(_, t) {
    const m = new Map<string, number>();
    const view = (hl?: string, tone: Tone = 'new') => mapPanel([...m].map(([k, v]) => ({ key: k, value: v, tone: k === hl ? tone : undefined })), 'phone', 'naam', 'number');
    t.frame({ line: 'init', caption: 'Khaali HashMap<String, Int> — naam (key) se number (value).', panels: [view()] });
    m.set('Ravi', 98100);
    m.set('Anu', 99200);
    t.frame({ line: 'put', caption: 'put("Ravi"), put("Anu") — har key apne bucket mein. O(1) average.', panels: [view('Anu')] });
    m.set('Ravi', 98111);
    t.frame({ line: 'update', caption: 'Same key "Ravi" dobara put → nayi entry NAHI bani, purani value replace hui. Ek key = ek value.', panels: [view('Ravi', 'swap')] });
    t.frame({ line: 'get', caption: `get("Anu") → ${m.get('Anu')}. Key se seedha value.`, panels: [view('Anu', 'found')] });
    t.frame({ line: 'default', caption: '"Kabir" map mein nahi → getOrDefault ne -1 diya. (Seedha get karte to null aata — Kotlin mein Int? type.)', panels: [view()] });
    t.frame({ line: 'contains', caption: '"Ravi" in phone → true. containsKey bhi O(1) average.', panels: [view('Ravi', 'found')] });
    m.delete('Anu');
    t.frame({ line: 'remove', caption: `remove("Anu") → entry gayi. size = ${m.size}.`, panels: [view()] });
    return '99200';
  },
});

// ---------- Example 1: Two Sum ----------
export const twoSumTrace = tracer<{ nums: number[]; target: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [2, 7, 11, 15], minLen: 2, maxLen: 8, min: -20, max: 20 },
    { name: 'target', type: 'int', label: 'target', default: 9, min: -40, max: 40 },
  ],
  run({ nums, target }, t) {
    const seen = new Map<number, number>();
    const view = (hl?: number, tone: Tone = 'new') => mapPanel([...seen].map(([k, v]) => ({ key: k, value: v, tone: k === hl ? tone : undefined })), 'seen (value → index)', 'value', 'index');
    t.frame({ line: 'init', caption: 'seen = khaali map (value → index). Har number par sawaal: "mera jodi (target − x) pehle aa chuka hai?"', vars: { target }, panels: [array(nums), view()] });
    for (let i = 0; i < nums.length; i++) {
      const need = target - nums[i];
      t.frame({ line: 'need', caption: `nums[${i}] = ${nums[i]} → jodi chahiye: ${target} − ${nums[i]} = ${need}. seen mein ${need} hai?`, vars: { i, need }, panels: [array(nums, { tones: { [i]: 'active' }, pointers: { i } }), view(seen.has(need) ? need : undefined, 'found')] });
      const j = seen.get(need);
      if (j !== undefined) {
        t.frame({ line: 'found', caption: `Haan! ${need} index ${j} par tha. Answer [${j}, ${i}]. Har number ek baar, lookup O(1) → O(n).`, vars: { i, j }, panels: [array(nums, { tones: { [j]: 'found', [i]: 'found' }, pointers: { j, i } }), view(need, 'found')] });
        return listStr([j, i]);
      }
      seen.set(nums[i], i);
      t.frame({ line: 'store', caption: `Nahi mila. ${nums[i]} → index ${i} yaad rakh liya — aage koi number iska jodi ho sakta hai.`, vars: { i }, panels: [array(nums, { tones: { [i]: 'done' }, pointers: { i } }), view(nums[i])] });
    }
    t.frame({ line: 'none', caption: 'Koi jodi nahi mili → [-1, -1].', panels: [array(nums), view()] });
    return listStr([-1, -1]);
  },
});

// ---------- Example 2: Isomorphic strings ----------
export const isoTrace = tracer<{ s: string; t: string }>({
  inputs: [
    { name: 's', type: 'string', label: 's', default: 'egg', minLen: 1, maxLen: 8 },
    { name: 't', type: 'string', label: 't', default: 'add', minLen: 1, maxLen: 8 },
  ],
  run({ s, t: tt }, t) {
    const st = new Map<string, string>();
    const ts = new Map<string, string>();
    const views = (i: number, hlA?: string, hlB?: string, tone: Tone = 'new') => [
      array([...s], { label: 's', tones: { [i]: 'active' }, pointers: { i } }),
      array([...tt], { label: 't', tones: { [i]: 'active' }, pointers: { i } }),
      mapPanel([...st].map(([k, v]) => ({ key: k, value: v, tone: k === hlA ? tone : undefined })), 's → t', 's ka char', 't ka char'),
      mapPanel([...ts].map(([k, v]) => ({ key: k, value: v, tone: k === hlB ? tone : undefined })), 't → s', 't ka char', 's ka char'),
    ];
    if (s.length !== tt.length) {
      t.frame({ caption: `Lengths alag (${s.length} vs ${tt.length}) → ek-se-ek mapping ho hi nahi sakti → false.`, panels: views(0) });
      return 'false';
    }
    t.frame({ line: 'init', caption: 'Do maps: s → t aur t → s. Dono taraf ka rishta pakka hona chahiye (ek char ek hi se juda).', panels: views(0) });
    for (let i = 0; i < s.length; i++) {
      const a = s[i];
      const b = tt[i];
      const pa = st.get(a);
      if (pa === undefined) st.set(a, b);
      if (pa !== undefined && pa !== b) {
        t.frame({ line: 'st', caption: `'${a}' pehle '${pa}' se juda tha, ab '${b}' se? Nahi chalega → false.`, vars: { i }, panels: views(i, a, undefined, 'error') });
        return 'false';
      }
      t.frame({ line: 'st', caption: pa === undefined ? `'${a}' → '${b}' naya rishta.` : `'${a}' → '${b}' pehle se — theek.`, vars: { i }, panels: views(i, a) });
      const pb = ts.get(b);
      if (pb === undefined) ts.set(b, a);
      if (pb !== undefined && pb !== a) {
        t.frame({ line: 'ts', caption: `Ulti taraf: '${b}' pehle '${pb}' se juda tha, ab '${a}' se? Do alag chars ek par map nahi ho sakte → false.`, vars: { i }, panels: views(i, undefined, b, 'error') });
        return 'false';
      }
      t.frame({ line: 'ts', caption: pb === undefined ? `Ulti taraf '${b}' → '${a}' bhi yaad rakha.` : `Ulti taraf '${b}' → '${a}' theek.`, vars: { i }, panels: views(i, undefined, b) });
    }
    t.frame({ line: 'done', caption: 'Har position par dono rishte pakke → true. O(n) time, O(1) space (alphabet fixed size).', panels: views(s.length - 1) });
    return 'true';
  },
});

// ---------- Example 3: Subarray sum = k ----------
export const subKTrace = tracer<{ nums: number[]; k: number }>({
  inputs: [
    { name: 'nums', type: 'intArray', label: 'nums', default: [1, 2, 3], minLen: 1, maxLen: 8, min: -5, max: 5 },
    { name: 'k', type: 'int', label: 'k', default: 3, min: -10, max: 10 },
  ],
  run({ nums, k }, t) {
    const count = new Map<number, number>([[0, 1]]);
    let pre = 0;
    let ans = 0;
    const view = (hl?: number, tone: Tone = 'new') => mapPanel([...count].map(([p, c]) => ({ key: p, value: c, tone: p === hl ? tone : undefined })), 'count (prefix → kitni baar)', 'prefix', 'count');
    t.frame({ line: 'init', caption: 'count = {0: 1}. Idea: subarray(i+1..j) ka sum = pre[j] − pre[i]. Ye k ho → pre[i] = pre[j] − k. To har j par poocho: pehle kitne prefix "pre − k" the?', vars: { pre, ans }, panels: [array(nums), view(0)] });
    nums.forEach((x, i) => {
      pre += x;
      t.frame({ line: 'pre', caption: `pre = ${pre - x} + ${x} = ${pre}.`, vars: { i, pre, ans }, panels: [array(nums, { tones: { [i]: 'active' }, ranges: [{ from: 0, to: i, label: `pre = ${pre}` }] }), view()] });
      const c = count.get(pre - k) ?? 0;
      ans += c;
      t.frame({
        line: 'lookup',
        caption: c ? `pre − k = ${pre} − ${k} = ${pre - k} pehle ${c} baar aaya → ${c} naye subarrays (jo index ${i} par khatam) ka sum ${k}! ans = ${ans}.` : `pre − k = ${pre - k} pehle nahi aaya → koi naya subarray nahi. ans = ${ans}.`,
        vars: { i, pre, ans },
        panels: [array(nums, { tones: { [i]: 'active' } }), view(pre - k, c ? 'found' : 'compare')],
      });
      count.set(pre, (count.get(pre) ?? 0) + 1);
      t.frame({ line: 'store', caption: `count[${pre}]++ → ${count.get(pre)}. Aage ke j isse use karenge.`, vars: { i, pre, ans }, panels: [array(nums), view(pre)] });
    });
    t.frame({ line: 'done', caption: `Answer ${ans}. Ek pass, har step O(1) map kaam → O(n). Negative numbers ke saath bhi chalta hai (sliding window nahi chalti).`, vars: { ans }, panels: [array(nums), view()] });
    return String(ans);
  },
});
