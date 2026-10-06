import { array, tracer } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

type Iv = number[];
const ivStr = (iv: Iv) => `[${iv[0]},${iv[1]}]`;
const GROUP_TONES: Tone[] = ['active', 'found', 'compare', 'swap', 'new', 'done'];

/**
 * Timeline grid: har row ek interval, columns = time.
 * closed = [s, e] dono shaamil (merge, platforms); warna [s, e) — e par khatam, wahi se agla shuru ho sakta (meetings).
 */
function timeline(rows: Iv[], o: { closed: boolean; label: string; tones?: (Tone | undefined)[]; from: number; to: number; names?: string[] }): Panel {
  const cols = o.to - o.from + 1;
  const tones: Record<string, Tone> = {};
  rows.forEach(([s, e], r) => {
    const tone = o.tones?.[r] ?? 'active';
    for (let t = s; o.closed ? t <= e : t < e; t++) tones[`${r},${t - o.from}`] = tone;
  });
  return {
    kind: 'grid',
    label: o.label,
    values: rows.map(() => Array(cols).fill('')),
    tones,
    rowLabels: o.names ?? rows.map(ivStr),
    colLabels: Array.from({ length: cols }, (_, c) => String(o.from + c)),
    dense: true,
  };
}
const span = (rows: Iv[]) => ({ from: Math.min(...rows.map((r) => r[0])), to: Math.max(...rows.map((r) => r[1])) });
const ivSpec = (def: number[][], label: string, max = 12) => ({ name: 'iv', type: 'intGrid' as const, label, default: def, maxRows: 6, maxCols: 2, min: 0, max });
const ivCheck = ({ iv }: { iv: number[][] }) => (iv.some((r) => r.length !== 2) ? 'Har row mein do numbers: start end.' : iv.some(([s, e]) => s > e) ? 'start ≤ end rakho.' : null);

// ---------- 3. Visual intro: sort karo to takraane wale padosi ban jaate hain ----------
export const overlapTrace = tracer<{ iv: number[][] }>({
  inputs: [ivSpec([[6, 8], [1, 3], [9, 10], [2, 4], [8, 9], [11, 12]], 'Intervals (start end; start end; …)')],
  check: ivCheck,
  run({ iv }, t) {
    const sp = span(iv);
    const sorted = [...iv].sort((a, b) => a[0] - b[0]);
    t.frame({ caption: `Intervals = time ke tukde [start, end]. Do intervals takraate hain jab ek ka start doosre ke end se pehle (ya barabar) ho. Bina order ke har jodi dekhni padegi — n² kaam.`, panels: [timeline(iv, { closed: true, label: 'Jaise diye', ...sp })] });
    t.frame({ caption: 'START se sort karo. Ab koi interval kisi se takraata hai to apne PAAS wale se hi — upar se neeche ek pass kaafi.', panels: [timeline(sorted, { closed: true, label: 'Start se sorted', ...sp })] });
    const groups: number[] = [];
    const merged: Iv[] = [];
    sorted.forEach(([s, e]) => {
      const last = merged[merged.length - 1];
      if (!last || s > last[1]) merged.push([s, e]);
      else last[1] = Math.max(last[1], e);
      groups.push(merged.length - 1);
    });
    const tones = groups.map((g) => GROUP_TONES[g % GROUP_TONES.length]);
    const legend = Object.fromEntries(merged.map((m, g) => [GROUP_TONES[g % GROUP_TONES.length], `group ${ivStr(m)}`]));
    t.frame({ caption: `Upar se chalo: agla interval pichhle group ke end tak shuru ho gaya → usi group mein. Warna naya group. ${merged.length} group bane.`, legend, panels: [timeline(sorted, { closed: true, label: 'Rang = ek group', tones, ...sp })] });
    t.frame({ caption: `Har group ek bada interval: ${merged.map(ivStr).join(', ')}. Sort O(n log n) + ek pass O(n) — yahi "sort + sweep" intervals ka mool mantra hai.`, legend, panels: [timeline(sorted, { closed: true, label: 'Start se sorted', tones, ...sp }), timeline(merged, { closed: true, label: 'Merge ke baad', tones: merged.map((_, g) => GROUP_TONES[g % GROUP_TONES.length]), ...sp })] });
    return String(merged.length);
  },
});

// ---------- 4. How: merge intervals ----------
export const mergeTrace = tracer<{ iv: number[][] }>({
  inputs: [ivSpec([[6, 8], [1, 3], [2, 4], [9, 10], [8, 9], [11, 12]], 'Intervals (start end; …)')],
  check: ivCheck,
  run({ iv }, t) {
    const sp = span(iv);
    const sorted = [...iv].sort((a, b) => a[0] - b[0]);
    const out: Iv[] = [];
    const rowTone: (Tone | undefined)[] = sorted.map(() => 'muted' as Tone);
    const legend = { active: 'abhi wala', done: 'ho gaya', muted: 'baaki', found: 'output', new: 'abhi badla' };
    const view = (hot?: number): Panel[] => [
      timeline(sorted, { closed: true, label: 'Input (start se sorted)', tones: rowTone, ...sp }),
      out.length ? timeline(out, { closed: true, label: 'Output', tones: out.map((_, k) => (k === hot ? 'new' : 'found')), ...sp }) : array([], { label: 'Output (khaali)' }),
    ];
    t.frame({ line: 'sort', caption: `Start se sort: ${sorted.map(ivStr).join(' ')}. Ab output ka AAKHRI interval hi kaafi hai — naya interval sirf usi se takra sakta hai.`, legend, panels: view() });
    sorted.forEach((cur, i) => {
      rowTone[i] = 'active';
      const last = out[out.length - 1];
      if (!last || cur[0] > last[1]) {
        out.push([cur[0], cur[1]]);
        t.frame({ line: 'new', caption: last ? `${ivStr(cur)}: start ${cur[0]} > pichhle ka end ${last[1]} → takraav nahi, naya interval.` : `${ivStr(cur)}: output khaali → pehla interval.`, vars: { start: cur[0], end: cur[1] }, legend, panels: view(out.length - 1) });
      } else {
        const old = last[1];
        last[1] = Math.max(last[1], cur[1]);
        t.frame({ line: 'extend', caption: `${ivStr(cur)}: start ${cur[0]} ≤ pichhle ka end ${old} → takraaya. end = max(${old}, ${cur[1]}) = ${last[1]}.${cur[1] < old ? ' (Ye poora andar tha — max lena isliye zaroori.)' : ''}`, vars: { start: cur[0], end: cur[1] }, legend, panels: view(out.length - 1) });
      }
      rowTone[i] = 'done';
    });
    const res = `[${out.map((o) => `[${o[0]}, ${o[1]}]`).join(', ')}]`;
    t.frame({ line: 'done', caption: `Merged: ${out.map(ivStr).join(' ')}. Sort O(n log n), pass O(n).`, legend, panels: view() });
    return res;
  },
});

// ---------- Example 1: Saari meetings attend? ----------
export const meetingsTrace = tracer<{ iv: number[][] }>({
  inputs: [ivSpec([[13, 15], [9, 10], [10, 12]], 'Meetings (start end; …)', 23)],
  check: ivCheck,
  run({ iv }, t) {
    const sorted = [...iv].sort((a, b) => a[0] - b[0]);
    const sp = sorted.length ? span(sorted) : { from: 0, to: 1 };
    const tones: (Tone | undefined)[] = sorted.map(() => 'muted' as Tone);
    const legend = { found: 'theek', error: 'takraav', compare: 'abhi jaanch', muted: 'baaki' };
    const view = (): Panel[] => [timeline(sorted, { closed: false, label: 'Meetings (start se sorted) · khatam time shaamil nahi', tones, ...sp })];
    t.frame({ line: 'sort', caption: 'Start se sort. Takraav hoga to kisi meeting aur uski AGLI meeting mein hi — bas padosi jode dekho. (10 baje khatam, 10 baje shuru = chalega.)', legend, panels: view() });
    if (sorted.length) tones[0] = 'found';
    for (let i = 1; i < sorted.length; i++) {
      const [ps, pe] = sorted[i - 1];
      const [s] = sorted[i];
      if (s < pe) {
        tones[i - 1] = 'error';
        tones[i] = 'error';
        t.frame({ line: 'clash', caption: `[${ps},${pe}] ke baad [${s},${sorted[i][1]}]: ${s} < ${pe} → pichhli khatam hone se pehle shuru. false.`, vars: { i }, legend, panels: view() });
        return 'false';
      }
      tones[i] = 'compare';
      t.frame({ line: 'clash', caption: `${s} ≥ ${pe} → [${sorted[i][0]},${sorted[i][1]}] pichhli ke baad shuru. Theek.`, vars: { i }, legend, panels: view() });
      tones[i] = 'found';
    }
    t.frame({ line: 'done', caption: 'Koi padosi nahi takraaya → true. O(n log n).', legend, panels: view() });
    return 'true';
  },
});

// ---------- Example 2: Non-overlapping intervals (end se sort) ----------
export const nonOverlapTrace = tracer<{ iv: number[][] }>({
  inputs: [ivSpec([[1, 4], [2, 3], [3, 6], [5, 7], [6, 8]], 'Intervals (start end; …)')],
  check: ivCheck,
  run({ iv }, t) {
    const sorted = [...iv].sort((a, b) => a[1] - b[1]);
    const sp = span(sorted);
    const tones: (Tone | undefined)[] = sorted.map(() => 'muted' as Tone);
    let end = -Infinity;
    let removed = 0;
    const legend = { found: 'rakha', error: 'hataya', active: 'abhi', muted: 'baaki' };
    const view = (): Panel[] => [timeline(sorted, { closed: false, label: `End se sorted · aakhri rakhe ka end = ${end === -Infinity ? '−∞' : end}`, tones, ...sp })];
    t.frame({ line: 'sort', caption: 'Kam se kam hatana = zyada se zyada rakhna. Greedy: jo JALDI khatam ho use rakho — baaki ke liye sabse zyada time bachta hai. Isliye END se sort (start se nahi).', legend, panels: view() });
    sorted.forEach(([s, e], i) => {
      if (s >= end) {
        tones[i] = 'found';
        const old = end;
        end = e;
        t.frame({ line: 'keep', caption: `[${s},${e}]: start ${s} ≥ ${old === -Infinity ? '−∞' : old} → takraata nahi, rakho. end = ${e}.`, vars: { end, removed }, legend, panels: view() });
      } else {
        tones[i] = 'error';
        removed++;
        t.frame({ line: 'drop', caption: `[${s},${e}]: start ${s} < end ${end} → takraata hai. Isi ko hatao — iska end (${e}) rakhe hue se bada ya barabar, to ye aage zyada jagah gherta. removed = ${removed}.`, vars: { end, removed }, legend, panels: view() });
      }
    });
    t.frame({ line: 'done', caption: `${removed} hatane pade, ${sorted.length - removed} bache. O(n log n). (Start se sort karte to [1,4] jaisa lamba interval rakh ke zyada hatate.)`, vars: { removed }, legend, panels: view() });
    return String(removed);
  },
});

// ---------- Example 3: Minimum railway platforms ----------
export const platformsTrace = tracer<{ iv: number[][] }>({
  inputs: [ivSpec([[9, 10], [9, 12], [11, 13], [12, 14], [15, 16], [10, 11]], 'Trains (aana jaana; …), ghante 0..23', 23)],
  check: ivCheck,
  run({ iv }, t) {
    const arr = iv.map((r) => r[0]).sort((a, b) => a - b);
    const dep = iv.map((r) => r[1]).sort((a, b) => a - b);
    const sp = span(iv);
    let i = 0;
    let j = 0;
    let now = 0;
    let best = 0;
    const legend = { compare: 'station par', done: 'ho gaya' };
    const view = (): Panel[] => [
      timeline(iv, { closed: true, label: 'Trains (aana se jaana tak station par)', names: iv.map((_, k) => `T${k + 1}`), tones: iv.map(() => 'compare'), ...sp }),
      array(arr, { label: 'Aana (sorted)', pointers: i < arr.length ? { i } : {}, tones: Object.fromEntries(arr.map((_, k) => [k, k < i ? 'done' : undefined]).filter((x) => x[1])) }),
      array(dep, { label: 'Jaana (sorted)', pointers: j < dep.length ? { j } : {}, tones: Object.fromEntries(dep.map((_, k) => [k, k < j ? 'done' : undefined]).filter((x) => x[1])) }),
    ];
    t.frame({ line: 'sort', caption: 'Kaunsi train kaunsi hai — farak nahi padta! Sirf "kab koi aayi, kab koi gayi". To aana aur jaana ALAG ALAG sort karo aur time ke order mein ghatnaayein padho (merge jaisa).', legend, panels: view() });
    while (i < arr.length) {
      if (arr[i] <= dep[j]) {
        now++;
        best = Math.max(best, now);
        t.frame({ line: 'arrive', caption: `Agli ghatna ${arr[i]} baje AANA (${arr[i]} ≤ agla jaana ${dep[j]}; barabar ho to bhi platform chahiye). Station par ${now}, max ${best}.`, vars: { now, best }, legend, panels: view() });
        i++;
      } else {
        now--;
        t.frame({ line: 'leave', caption: `Agli ghatna ${dep[j]} baje JAANA (${dep[j]} < agla aana ${arr[i]}). Ek platform khaali, station par ${now}.`, vars: { now, best }, legend, panels: view() });
        j++;
      }
    }
    t.frame({ line: 'best', caption: `Sabse zyada ek saath ${best} trains → ${best} platforms. Do sort O(n log n) + ek pass. (Heap se bhi: train aane par pehle khatam hui trains nikaalo.)`, vars: { best }, legend, panels: view() });
    return String(best);
  },
});
