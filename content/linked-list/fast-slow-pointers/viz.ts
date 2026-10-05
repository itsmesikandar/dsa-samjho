import { array, listView, tracer, type LNode } from '@/components/viz/engine/tracer';
import type { Panel, Tone } from '@/components/viz/engine/types';

/** n0..n(k-1); aakhri ka next = pos (ya null) */
function cyclic(values: number[], pos: number) {
  const nodes = new Map<string, LNode>();
  values.forEach((v, i) => nodes.set(`n${i}`, { id: `n${i}`, value: v, next: i + 1 < values.length ? `n${i + 1}` : pos >= 0 ? `n${pos}` : null }));
  return nodes;
}
const posCheck = ({ values, pos }: { values: number[]; pos: number }) => (pos < values.length ? null : `pos −1 (circle nahi) ya 0..${values.length - 1} rakho.`);
const LEGEND = { compare: 'slow', active: 'fast', found: 'dono' };
const tonesFor = (slow: string | null, fast: string | null): Record<string, Tone> => {
  const t: Record<string, Tone> = {};
  if (slow) t[slow] = 'compare';
  if (fast) t[fast] = 'active';
  if (slow && slow === fast) t[slow] = 'found';
  return t;
};

// ---------- 3. Visual intro: race track ----------
export const raceTrack = tracer<{ values: number[]; pos: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'Values', default: [1, 2, 3, 4, 5, 6], minLen: 2, maxLen: 7, min: 0, max: 99 },
    { name: 'pos', type: 'int', label: 'Aakhri node kis index se jude (−1 = circle nahi)', default: 2, min: -1, max: 6 },
  ],
  check: posCheck,
  run({ values, pos }, t) {
    const nodes = cyclic(values, pos);
    let slow: string | null = 'n0';
    let fast: string | null = 'n0';
    const view = () => [listView(nodes, 'n0', { pointers: { slow, fast }, tones: tonesFor(slow, fast) })];
    t.frame({ caption: pos >= 0 ? `Circle wala track: aakhri node wapas index ${pos} par juda. slow 1 kadam chalta hai, fast 2. Seedha track hota to fast end par pahunch jaata — circle mein kya hoga?` : 'Seedha track (circle nahi). slow 1 kadam, fast 2 kadam.', legend: LEGEND, panels: view() });
    let steps = 0;
    for (;;) {
      const f1: string | null = fast ? nodes.get(fast)!.next : null;
      if (!f1) {
        t.frame({ caption: `fast ke aage null — track khatam. Circle NAHI hai. (${steps} kadam)`, legend: LEGEND, panels: view() });
        return 'false';
      }
      slow = nodes.get(slow!)!.next;
      fast = nodes.get(f1)!.next;
      steps++;
      if (!fast) {
        t.frame({ caption: `fast null par pahuncha — end mil gaya → circle nahi.`, vars: { steps }, legend: LEGEND, panels: view() });
        return 'false';
      }
      if (slow === fast) {
        t.frame({ caption: `Dono same node par! Circle mein fast har kadam slow se 1 node kareeb aata hai — isliye pakad leta hai, kabhi "kood ke aage" nahi nikalta. ${steps} kadam.`, vars: { steps }, legend: LEGEND, panels: view() });
        return 'true';
      }
      t.frame({ caption: `Kadam ${steps}: slow → ${nodes.get(slow!)!.value}, fast → ${nodes.get(fast)!.value}.`, vars: { steps }, legend: LEGEND, panels: view() });
    }
  },
});

// ---------- 4. How: middle node ----------
export const middleTrace = tracer<{ values: number[] }>({
  inputs: [{ name: 'values', type: 'intArray', label: 'List', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 8, min: 0, max: 99 }],
  run({ values }, t) {
    const nodes = cyclic(values, -1);
    let slow: string = 'n0';
    let fast: string | null = 'n0';
    t.frame({ line: 'init', caption: 'slow aur fast dono head par. Length gine bina beech dhoondhna hai — ek hi pass.', legend: LEGEND, panels: [listView(nodes, 'n0', { pointers: { slow, fast }, tones: tonesFor(slow, fast) })] });
    while (fast && nodes.get(fast)!.next) {
      slow = nodes.get(slow)!.next!;
      fast = nodes.get(nodes.get(fast)!.next!)!.next;
      t.frame({ line: 'step', caption: `slow 1 kadam (${nodes.get(slow)!.value}), fast 2 kadam (${fast ? nodes.get(fast)!.value : 'null'}). fast hamesha slow se dugna aage.`, legend: LEGEND, panels: [listView(nodes, 'n0', { pointers: { slow, fast }, tones: tonesFor(slow, fast) })] });
    }
    t.frame({ line: 'done', caption: `fast aage nahi ja sakta → slow beech mein: ${nodes.get(slow)!.value}. ${values.length % 2 === 0 ? 'Length even — do beech mein se doosra mila.' : ''} O(n), O(1).`, legend: { found: 'beech' }, panels: [listView(nodes, 'n0', { pointers: { slow }, tones: { [slow]: 'found' } })] });
    return String(nodes.get(slow)!.value);
  },
});

// ---------- Example 1: has cycle ----------
export const cycleTrace = tracer<{ values: number[]; pos: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'Values', default: [3, 2, 0, -4], minLen: 1, maxLen: 7, min: -9, max: 9 },
    { name: 'pos', type: 'int', label: 'pos (−1 = circle nahi)', default: 1, min: -1, max: 6 },
  ],
  check: posCheck,
  run({ values, pos }, t) {
    const nodes = cyclic(values, pos);
    let slow: string | null = 'n0';
    let fast: string | null = 'n0';
    const view = () => [listView(nodes, 'n0', { pointers: { slow, fast }, tones: tonesFor(slow, fast) })];
    while (fast && nodes.get(fast)!.next) {
      slow = nodes.get(slow!)!.next;
      fast = nodes.get(nodes.get(fast)!.next!)!.next;
      if (slow === fast) {
        t.frame({ line: 'meet', caption: `slow === fast → mil gaye → circle hai! (Same NODE, sirf value nahi.)`, legend: LEGEND, panels: view() });
        return 'true';
      }
      t.frame({ line: 'step', caption: `slow → ${nodes.get(slow!)!.value}, fast → ${fast ? nodes.get(fast)!.value : 'null'}. Abhi alag.`, legend: LEGEND, panels: view() });
    }
    t.frame({ line: 'end', caption: `fast (ya fast.next) null → list ka end hai → circle nahi. HashSet bina, O(1) memory.`, legend: LEGEND, panels: view() });
    return 'false';
  },
});

// ---------- Example 2: cycle start ----------
export const cycleStartTrace = tracer<{ values: number[]; pos: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'Values', default: [3, 2, 0, -4], minLen: 1, maxLen: 7, min: -9, max: 9 },
    { name: 'pos', type: 'int', label: 'pos (−1 = circle nahi)', default: 1, min: -1, max: 6 },
  ],
  check: posCheck,
  run({ values, pos }, t) {
    const nodes = cyclic(values, pos);
    let slow: string | null = 'n0';
    let fast: string | null = 'n0';
    while (fast && nodes.get(fast)!.next) {
      slow = nodes.get(slow!)!.next;
      fast = nodes.get(nodes.get(fast)!.next!)!.next;
      t.frame({ line: 'step', caption: `Phase 1: slow → ${nodes.get(slow!)!.value}, fast → ${fast ? nodes.get(fast)!.value : 'null'}.`, legend: LEGEND, panels: [listView(nodes, 'n0', { pointers: { slow, fast }, tones: tonesFor(slow, fast) })] });
      if (slow === fast) {
        let p: string = 'n0';
        t.frame({ line: 'restart', caption: `Mile (${nodes.get(slow!)!.value} par). Ab p = head. Maths: head se circle-start ki doori = milne ki jagah se circle-start ki doori (circle ke chakkar chhod ke). To dono 1-1 kadam chalao.`, legend: { ...LEGEND, new: 'p' }, panels: [listView(nodes, 'n0', { pointers: { p, slow }, tones: { [slow!]: 'compare', [p]: 'new' } })] });
        while (p !== slow) {
          p = nodes.get(p)!.next!;
          slow = nodes.get(slow!)!.next;
          t.frame({ line: 'walk', caption: p === slow ? `p aur slow mile → yahi circle ki shuruaat.` : `p → ${nodes.get(p)!.value}, slow → ${nodes.get(slow!)!.value}.`, legend: { ...LEGEND, new: 'p' }, panels: [listView(nodes, 'n0', { pointers: { p, slow }, tones: p === slow ? { [p]: 'found' } : { [slow!]: 'compare', [p]: 'new' } })] });
        }
        t.frame({ line: 'start', caption: `Circle node ${nodes.get(p)!.value} (index ${p.slice(1)}) se shuru hota hai. O(n), O(1).`, legend: { found: 'circle start' }, panels: [listView(nodes, 'n0', { pointers: { start: p }, tones: { [p]: 'found' } })] });
        return String(nodes.get(p)!.value);
      }
    }
    t.frame({ line: 'none', caption: 'fast ko end mila → circle hi nahi → null.', legend: LEGEND, panels: [listView(nodes, 'n0', { pointers: { slow, fast }, tones: tonesFor(slow, fast) })] });
    return 'null';
  },
});

// ---------- Example 3: find the duplicate number ----------
export const dupTrace = tracer<{ nums: number[] }>({
  inputs: [{ name: 'nums', type: 'intArray', label: 'nums (n + 1 numbers, sab 1..n)', default: [1, 3, 4, 2, 2], minLen: 2, maxLen: 8, min: 1, max: 7 }],
  check: ({ nums }) => (nums.every((x) => x <= nums.length - 1) ? null : `Har number 1..${nums.length - 1} ke beech hona chahiye (n + 1 = ${nums.length} numbers).`),
  run({ nums }, t) {
    const n = nums.length;
    const graph = (slow?: number, fast?: number, extra: Record<number, Tone> = {}): Panel => ({
      kind: 'graph',
      label: 'i → nums[i]',
      directed: true,
      nodes: Array.from({ length: n }, (_, i) => ({ id: String(i), label: String(i), tone: extra[i] ?? (i === slow && i === fast ? 'found' : i === slow ? 'compare' : i === fast ? 'active' : undefined) })),
      edges: nums.map((v, i) => ({ from: String(i), to: String(v) })),
    });
    const arr = (hot: Record<number, Tone> = {}) => array(nums, { label: 'nums', tones: hot });
    let slow = nums[0];
    let fast = nums[0];
    t.frame({ line: 'step', caption: `Har index i se arrow nums[i] ki taraf. Index 0 par koi arrow nahi aata (values 1..n), to 0 "head" hai. Duplicate value par DO arrows aate hain → wahan se circle shuru. Linked list cycle wala sawaal ban gaya!`, legend: LEGEND, panels: [graph(slow, fast), arr()] });
    do {
      slow = nums[slow];
      fast = nums[nums[fast]];
      t.frame({ line: 'step', caption: `slow = nums[slow] → ${slow}, fast = nums[nums[fast]] → ${fast}.`, vars: { slow, fast }, legend: LEGEND, panels: [graph(slow, fast), arr()] });
    } while (slow !== fast);
    slow = nums[0];
    t.frame({ line: 'restart', caption: `Mile. Ab slow = nums[0] (head ke baad wala) se phir — dono 1-1 kadam (Cycle II jaisa).`, vars: { slow, fast }, legend: LEGEND, panels: [graph(slow, fast), arr()] });
    while (slow !== fast) {
      slow = nums[slow];
      fast = nums[fast];
      t.frame({ line: 'walk', caption: `slow → ${slow}, fast → ${fast}.`, vars: { slow, fast }, legend: LEGEND, panels: [graph(slow, fast), arr()] });
    }
    const hot = Object.fromEntries(nums.map((v, i) => [i, (v === slow ? 'found' : undefined) as Tone]).filter((e) => e[1]));
    t.frame({ line: 'found', caption: `Circle ${slow} par shuru → duplicate = ${slow} (in dono index se arrow ${slow} par aata hai). Array badla nahi, O(1) memory, O(n) time.`, legend: { found: 'duplicate' }, panels: [graph(undefined, undefined, { [slow]: 'found' }), arr(hot)] });
    return String(slow);
  },
});
