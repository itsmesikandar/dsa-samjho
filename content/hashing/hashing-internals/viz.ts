import { array, listStr, tracer } from '@/components/viz/engine/tracer';
import type { Cell, HashEntry, HashPanel, Tone, ToneMap } from '@/components/viz/engine/types';

const fmod = (a: number, m: number) => ((a % m) + m) % m;
const emptyBuckets = (m: number): HashEntry[][] => Array.from({ length: m }, () => []);
const NAMES = ['chai', 'samosa', 'pakoda', 'jalebi', 'lassi', 'kulfi', 'vada', 'dosa'];

// ---------- 3. Visual intro: key → hash → bucket ----------
export const hashFunction = tracer<{ s: string; m: number }>({
  inputs: [
    { name: 's', type: 'string', label: 'Key (word)', default: 'chai', minLen: 1, maxLen: 6 },
    { name: 'm', type: 'int', label: 'Buckets (m)', default: 7, min: 3, max: 11 },
  ],
  run({ s, m }, t) {
    let h = 0;
    t.frame({
      caption: `HashMap ko key "${s}" ke liye ek bucket number chahiye (0..${m - 1}). Pehle hash function word ko ek NUMBER banata hai — har character ka code (a = 97…) milake.`,
      vars: { h },
      panels: [array([...s], { label: 'key' }), { kind: 'hash', buckets: emptyBuckets(m) }],
    });
    [...s].forEach((c, i) => {
      const prev = h;
      h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0;
      t.frame({
        caption: `h = h × 31 + '${c}'(${c.charCodeAt(0)}) = ${prev} × 31 + ${c.charCodeAt(0)} = ${h}. (Java ka String.hashCode() bilkul yahi karta hai.)`,
        vars: { i, h },
        panels: [array([...s], { label: 'key', tones: { [i]: 'active' }, pointers: { i } }), { kind: 'text', label: 'hash', text: String(h) }],
      });
    });
    const idx = fmod(h, m);
    const buckets = emptyBuckets(m);
    buckets[idx].push({ key: s, id: s, tone: 'new' });
    t.frame({
      caption: `Bucket = hash % m = ${h} % ${m} = ${idx}. "${s}" seedha bucket ${idx} mein gaya — koi search nahi, sirf calculation. Isliye O(1)!`,
      vars: { hash: h, bucket: idx },
      panels: [{ kind: 'hash', buckets, bucketTones: { [idx]: 'found' }, calc: `${h} % ${m} = ${idx}` }],
    });
    buckets[idx][0].tone = 'found';
    t.frame({
      caption: `Baad mein get("${s}") karoge to same calculation → same bucket ${idx}. Hash function ko hamesha same input par same answer dena hi chahiye (deterministic).`,
      vars: { bucket: idx },
      panels: [{ kind: 'hash', buckets, bucketTones: { [idx]: 'found' }, calc: `get("${s}") → bucket ${idx}` }],
    });
    return String(idx);
  },
});

// ---------- 4. How: MyHashMap with chaining ----------
export const myMapTrace = tracer<{ keys: number[]; capacity: number }>({
  inputs: [
    { name: 'keys', type: 'intArray', label: 'Keys (put order)', default: [12, 7, 9, 17], minLen: 1, maxLen: 6, min: 0, max: 99, distinct: true },
    { name: 'capacity', type: 'int', label: 'Buckets', default: 5, min: 3, max: 8 },
  ],
  run({ keys, capacity }, t) {
    const buckets = emptyBuckets(capacity);
    const view = (calc?: string, bt: ToneMap = {}): HashPanel => ({ kind: 'hash', buckets: structuredClone(buckets), calc, bucketTones: bt });
    const clear = () => buckets.forEach((b) => b.forEach((e) => (e.tone = undefined)));
    const put = (key: number, value: string) => {
      const b = fmod(key, capacity);
      t.frame({ line: 'hash', caption: `put(${key}, "${value}"): bucket = ${key} % ${capacity} = ${b}.`, vars: { key, bucket: b }, panels: [view(`${key} % ${capacity} = ${b}`, { [b]: 'active' })] });
      const hit = buckets[b].find((e) => e.key === key);
      if (hit) {
        hit.value = value;
        hit.tone = 'swap';
        t.frame({ line: 'update', caption: `Key ${key} pehle se bucket ${b} mein hai → sirf value badli ("${value}"). HashMap mein ek key ek hi baar.`, vars: { key }, panels: [view(undefined, { [b]: 'active' })] });
      } else {
        const collision = buckets[b].length > 0;
        buckets[b].push({ key, value, id: `k${key}`, tone: 'new' });
        t.frame({
          line: 'add',
          caption: collision ? `Bucket ${b} mein pehle se keys hain — COLLISION! Koi baat nahi: list mein peeche jod do (chaining).` : `Bucket ${b} khaali tha → key ${key} yahan rakhi.`,
          vars: { key, bucket: b },
          panels: [view(undefined, { [b]: collision ? 'compare' : 'active' })],
        });
      }
      clear();
    };
    keys.forEach((k, i) => put(k, NAMES[i]));
    put(keys[0], 'coffee');

    const get = (key: number): string | null => {
      const b = fmod(key, capacity);
      t.frame({ line: 'hash', caption: `get(${key}): bucket = ${key} % ${capacity} = ${b}. Baaki buckets ko dekhna hi nahi!`, vars: { key, bucket: b }, panels: [view(`${key} % ${capacity} = ${b}`, { [b]: 'active' })] });
      for (const e of buckets[b]) {
        const hit = e.key === key;
        e.tone = hit ? 'found' : 'compare';
        t.frame({ line: 'scan', caption: hit ? `${e.key} == ${key} → mil gaya: "${e.value}".` : `${e.key} != ${key}, chain mein aage.`, vars: { key }, panels: [view(undefined, { [b]: 'active' })] });
        if (hit) {
          clear();
          return String(e.value);
        }
      }
      t.frame({ line: 'miss', caption: `Bucket ${b} mein ${key} nahi mila → null. (Poora map nahi dekhna pada.)`, vars: { key }, panels: [view(undefined, { [b]: 'error' })] });
      clear();
      return null;
    };
    const first = get(keys[keys.length - 1]);
    get(keys.includes(3) ? 100 : 3);
    t.frame({
      caption: 'Har kaam: hash se bucket (O(1)) + us bucket ki chhoti si chain. Chains chhoti rahein (achha hash + load factor control) to put/get average O(1).',
      panels: [view()],
    });
    return first ?? 'null';
  },
});

// ---------- Example 1: keys → buckets ----------
export const bucketsTrace = tracer<{ keys: number[]; m: number }>({
  inputs: [
    { name: 'keys', type: 'intArray', label: 'Keys', default: [12, 7, 19, 25, 30], minLen: 1, maxLen: 8, min: 0, max: 99 },
    { name: 'm', type: 'int', label: 'Buckets (m)', default: 7, min: 3, max: 10 },
  ],
  run({ keys, m }, t) {
    const buckets = emptyBuckets(m);
    const counts = Array(m).fill(0);
    keys.forEach((k, i) => {
      const b = fmod(k, m);
      counts[b]++;
      buckets.forEach((x) => x.forEach((e) => (e.tone = undefined)));
      buckets[b].push({ key: k, id: `e${i}`, tone: counts[b] > 1 ? 'compare' : 'new' });
      t.frame({
        line: 'put',
        caption: `${k} % ${m} = ${b} → bucket ${b}.${counts[b] > 1 ? ` Yahan pehle se ${counts[b] - 1} key — collision!` : ''}`,
        vars: { key: k, bucket: b },
        legend: { compare: 'collision', new: 'nayi key' },
        panels: [{ kind: 'hash', buckets: structuredClone(buckets), calc: `${k} % ${m} = ${b}`, bucketTones: { [b]: 'active' } }, array(counts, { label: 'counts', tones: { [b]: 'new' } })],
      });
    });
    const collisions = counts.reduce((a, c) => a + Math.max(0, c - 1), 0);
    t.frame({
      line: 'done',
      caption: `Counts ${listStr(counts)}, collisions = ${collisions}. Achha hash keys ko buckets mein BARABAR failaata hai — tab har bucket mein ~n/m keys aur lookup tez.`,
      vars: { collisions },
      panels: [{ kind: 'hash', buckets: structuredClone(buckets) }, array(counts, { label: 'counts' })],
    });
    return listStr(counts);
  },
});

// ---------- Example 2: linear probing ----------
const tableStr = (a: Cell[]) => `[${a.map((x) => (x === null ? 'null' : String(x))).join(', ')}]`;
export const probingTrace = tracer<{ keys: number[]; m: number }>({
  inputs: [
    { name: 'keys', type: 'intArray', label: 'Keys', default: [18, 41, 22, 44, 59, 32, 31, 73], minLen: 1, maxLen: 8, min: 0, max: 99, distinct: true },
    { name: 'm', type: 'int', label: 'Table size (m)', default: 11, min: 5, max: 11 },
  ],
  check: ({ keys, m }) => (keys.length <= m ? null : `Keys (${keys.length}) table size (${m}) se zyada nahi ho sakti.`),
  run({ keys, m }, t) {
    const table: Cell[] = Array(m).fill(null);
    const filled = (): ToneMap => Object.fromEntries(table.map((v, i) => [i, v === null ? undefined : 'done']).filter((e) => e[1])) as ToneMap;
    for (const k of keys) {
      let i = fmod(k, m);
      t.frame({ line: 'hash', caption: `${k} % ${m} = ${i} → pehli pasand dabba ${i}.`, vars: { key: k, i }, panels: [array(table, { tones: { ...filled(), [i]: 'active' }, pointers: { i } })] });
      let probes = 0;
      while (table[i] !== null) {
        const busy = i;
        i = (i + 1) % m;
        probes++;
        t.frame({ line: 'probe', caption: `Dabba ${busy} bhara hai (${table[busy]}) → agla: ${i}${busy === m - 1 ? ' (end ke baad wapas 0)' : ''}. Probe #${probes}.`, vars: { key: k, i, probes }, legend: { error: 'bhara — aage jao' }, panels: [array(table, { tones: { ...filled(), [busy]: 'error', [i]: 'active' }, pointers: { i } })] });
      }
      table[i] = k;
      t.frame({ line: 'place', caption: `${k} dabba ${i} mein rakha${probes ? ` (${probes} probes ke baad)` : ''}.`, vars: { key: k, i }, panels: [array(table, { tones: { ...filled(), [i]: 'new' } })] });
    }
    t.frame({
      caption: 'Dhyaan do — bhare dabbe ek saath chipak jaate hain (clustering), aur naye keys ko lamba chalna padta hai. Isliye table zyada bharne nahi dete (load factor kam rakho).',
      panels: [array(table, { tones: filled() })],
    });
    return tableStr(table);
  },
});

// ---------- Example 3: rehash ----------
export const rehashTrace = tracer<{ keys: number[] }>({
  inputs: [{ name: 'keys', type: 'intArray', label: 'Keys', default: [5, 9, 13, 2, 6], minLen: 1, maxLen: 8, min: 0, max: 60, distinct: true }],
  run({ keys }, t) {
    let cap = 4;
    let buckets = emptyBuckets(cap);
    let size = 0;
    const view = (calc?: string, bt: ToneMap = {}): HashPanel => ({ kind: 'hash', label: `capacity ${cap}`, buckets: structuredClone(buckets), calc, bucketTones: bt });
    const clear = () => buckets.forEach((b) => b.forEach((e) => (e.tone = undefined)));
    for (const k of keys) {
      const b = k % cap;
      buckets[b].push({ key: k, id: `k${k}`, tone: 'new' });
      size++;
      const lf = size / cap;
      t.frame({ line: 'insert', caption: `${k} % ${cap} = ${b} → bucket ${b}. size = ${size}, load factor = ${size}/${cap} = ${lf.toFixed(2)}.`, vars: { size, capacity: cap, load: +lf.toFixed(2) }, panels: [view(`${k} % ${cap} = ${b}`, { [b]: 'active' })] });
      clear();
      if (size > 0.75 * cap) {
        t.frame({ line: 'check', caption: `Load factor ${lf.toFixed(2)} > 0.75 — table bahut bhar gaya, chains lambi hone lagengi. Capacity double karte hain.`, vars: { size, capacity: cap }, panels: [view(undefined, Object.fromEntries(buckets.map((_, i) => [i, 'compare' as Tone])))] });
        const old = buckets.flat();
        cap *= 2;
        buckets = emptyBuckets(cap);
        for (const e of old) {
          const nb = (e.key as number) % cap;
          buckets[nb].push({ ...e, tone: 'swap' });
          t.frame({ line: 'rehash', caption: `${e.key} % ${cap} = ${nb}. Capacity badli to bucket bhi badal sakta hai — har key ko DOBARA hash karna padta hai.`, vars: { capacity: cap }, legend: { swap: 'nayi jagah' }, panels: [view(`${e.key} % ${cap} = ${nb}`, { [nb]: 'active' })] });
          clear();
        }
      }
    }
    t.frame({
      caption: `Final capacity ${cap}. Rehash O(n) hai, par sirf kabhi-kabhi (capacity double hoti hai) → put ab bhi amortized O(1). Java HashMap: default 16, load factor 0.75.`,
      vars: { size, capacity: cap },
      panels: [view()],
    });
    return `capacity = ${cap}`;
  },
});
