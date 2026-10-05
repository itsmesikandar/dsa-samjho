import { array, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

/** fixed-size circular buffer ka ring panel: front = head, rear = aakhri item (khaali ho to head) */
const ring = (a: Cell[], head: number, count: number, tones: Record<number, Tone> = {}, label?: string): Panel => ({
  kind: 'ring',
  label,
  slots: a.map((v, i) => (inQueue(i, head, count, a.length) ? v : null)),
  front: head,
  rear: count ? (head + count - 1) % a.length : head,
  tones,
});
const inQueue = (i: number, head: number, count: number, k: number) => (i - head + k) % k < count;

const opsCheck = (ops: string) => (/^[0-9o]+$/.test(ops) ? null : 'Sirf digits (enqueue) aur o (dequeue) likho.');

// ---------- 3. Visual intro: ghoomta hua array ----------
export const ringDemo = tracer<{ k: number; ops: string }>({
  inputs: [
    { name: 'k', type: 'int', label: 'Capacity', default: 5, min: 2, max: 6 },
    { name: 'ops', type: 'string', label: 'Ops: digit = enqueue, o = dequeue', default: '123oo456', minLen: 1, maxLen: 12, charset: '0123456789o' },
  ],
  check: ({ ops }) => opsCheck(ops),
  run({ k, ops }, t) {
    const a: Cell[] = Array(k).fill(null);
    let head = 0;
    let count = 0;
    t.frame({ caption: `${k} jagah ka array, gol mod diya. head = aage wala, rear = aakhri. Nikaalne par items khiskte NAHI — sirf head aage badhta hai.`, panels: [ring(a, head, count)] });
    for (const c of ops) {
      if (c === 'o') {
        if (!count) {
          t.frame({ caption: 'Khaali hai — dequeue nahi ho sakta.', panels: [ring(a, head, count)] });
          continue;
        }
        const v = a[head];
        head = (head + 1) % k;
        count--;
        t.frame({ caption: `Dequeue ${v}: head ${(head - 1 + k) % k} → ${head}. Purani jagah ab khaali — dobara use hogi.`, vars: { head, count }, panels: [ring(a, head, count)] });
      } else {
        if (count === k) {
          t.frame({ caption: `Bhara hai (${k}/${k}) — ${c} nahi jud sakta.`, legend: { error: 'full' }, panels: [ring(a, head, count, Object.fromEntries(a.map((_, i) => [i, 'error' as Tone])))] });
          continue;
        }
        const pos = (head + count) % k;
        a[pos] = Number(c);
        count++;
        t.frame({ caption: pos < head || (pos === 0 && head > 0) ? `Enqueue ${c} → index ${pos}. End ke baad wapas shuru par aa gaye (wrap) — khaali jagah thi to use kar li!` : `Enqueue ${c} → index ${pos} = (head + count − 1) % ${k}.`, vars: { head, count }, panels: [ring(a, head, count, { [pos]: 'new' })] });
      }
    }
    return a.map((v, i) => (inQueue(i, head, count, k) ? v : '_')).join(' ');
  },
});

// ---------- 4. How: design circular queue ----------
export const cqTrace = tracer<{ k: number; ops: string }>({
  inputs: [
    { name: 'k', type: 'int', label: 'Capacity k', default: 3, min: 1, max: 5 },
    { name: 'ops', type: 'string', label: 'Ops: digit = enQueue, o = deQueue', default: '1234o4', minLen: 1, maxLen: 12, charset: '0123456789o' },
  ],
  check: ({ ops }) => opsCheck(ops),
  run({ k, ops }, t) {
    const a: Cell[] = Array(k).fill(null);
    let head = 0;
    let count = 0;
    const outs: string[] = [];
    const vars = () => ({ head, count, tail: (head + count) % k });
    for (const c of ops) {
      if (c === 'o') {
        if (count === 0) {
          outs.push('false');
          t.frame({ line: 'empty', caption: 'deQueue(): count = 0 → khaali → false.', vars: vars(), panels: [ring(a, head, count)] });
          continue;
        }
        head = (head + 1) % k;
        count--;
        outs.push('true');
        t.frame({ line: 'deq', caption: `deQueue(): head = (head + 1) % ${k} = ${head}, count = ${count}. Value mitaayi bhi nahi — wo jagah ab queue ka hissa hi nahi.`, vars: vars(), panels: [ring(a, head, count)] });
      } else {
        if (count === k) {
          outs.push('false');
          t.frame({ line: 'full', caption: `enQueue(${c}): count = ${k} = capacity → full → false.`, vars: vars(), legend: { error: 'full' }, panels: [ring(a, head, count, Object.fromEntries(a.map((_, i) => [i, 'error' as Tone])))] });
          continue;
        }
        const pos = (head + count) % k;
        a[pos] = Number(c);
        count++;
        outs.push('true');
        t.frame({ line: 'enq', caption: `enQueue(${c}): jagah = (head ${head} + count ${count - 1}) % ${k} = ${pos}. count = ${count}.`, vars: vars(), panels: [ring(a, head, count, { [pos]: 'new' })] });
      }
    }
    t.frame({ line: 'deq', caption: `Results: ${outs.join(', ')}. Har operation O(1) — sirf index ka hisaab, koi shift nahi. head == tail khaali bhi ho sakta hai aur bhara bhi — isliye count rakha.`, vars: vars(), panels: [ring(a, head, count)] });
    return outs[0];
  },
});

// ---------- Example 1: time needed to buy tickets ----------
export const ticketsTrace = tracer<{ tickets: number[]; k: number }>({
  inputs: [
    { name: 'tickets', type: 'intArray', label: 'Har insaan ko kitne tickets', default: [2, 3, 2], minLen: 1, maxLen: 6, min: 1, max: 4 },
    { name: 'k', type: 'int', label: 'Kiska time chahiye (index)', default: 2, min: 0, max: 5 },
  ],
  check: ({ tickets, k }) => (k < tickets.length ? null : `k 0..${tickets.length - 1} rakho.`),
  run({ tickets, k }, t) {
    const left = [...tickets];
    let time = 0;
    let i = 0;
    const view = (tone?: Tone): Panel[] => [array(left, { label: 'Bache tickets', pointers: { i, k }, tones: { ...Object.fromEntries(left.map((v, j) => [j, (v === 0 ? 'muted' : undefined) as Tone])), [k]: 'compare', ...(tone ? { [i]: tone } : {}) } })];
    t.frame({ line: 'buy', caption: `Line mein har insaan ek ticket leta hai, phir peeche. Aakhri ke baad wapas pehla — index (i + 1) % ${tickets.length}. Neela = jiska time chahiye.`, legend: { compare: `k (${k})`, muted: 'line se bahar' }, panels: view() });
    for (;;) {
      if (left[i] > 0) {
        left[i]--;
        time++;
        t.frame({ line: 'buy', caption: `Index ${i} ne ek ticket liya (time = ${time}). Bache: ${left[i]}.`, vars: { time }, legend: { new: 'abhi liya', muted: 'line se bahar' }, panels: view('new') });
        if (i === k && left[i] === 0) {
          t.frame({ line: 'done', caption: `k ke saare tickets ho gaye → ${time} second. (O(n) formula: k tak wale min(t, t_k), k ke baad wale min(t, t_k − 1) jodo.)`, vars: { time }, legend: { found: 'done' }, panels: view('found') });
          return String(time);
        }
      }
      i = (i + 1) % left.length;
    }
  },
});

// ---------- Example 2: design circular deque ----------
export const cdequeTrace = tracer<{ k: number }>({
  inputs: [{ name: 'k', type: 'int', label: 'Capacity k', default: 3, min: 1, max: 4 }],
  run({ k }, t) {
    const a: Cell[] = Array(k).fill(null);
    let head = 0;
    let count = 0;
    const outs: string[] = [];
    const show = (line: string, caption: string, tones: Record<number, Tone> = {}) => t.frame({ line, caption, vars: { head, count }, panels: [ring(a, head, count, tones)] });
    const insertLast = (x: number) => {
      if (count === k) return void (outs.push('false'), show('last', `insertLast(${x}): full → false.`));
      const pos = (head + count) % k;
      a[pos] = x;
      count++;
      outs.push('true');
      show('last', `insertLast(${x}) → index ${pos} (queue jaisa).`, { [pos]: 'new' });
    };
    const insertFront = (x: number) => {
      if (count === k) return void (outs.push('false'), show('front', `insertFront(${x}): full → false.`));
      head = (head - 1 + k) % k;
      a[head] = x;
      count++;
      outs.push('true');
      show('front', `insertFront(${x}): head ek PEECHE = (head − 1 + ${k}) % ${k} = ${head}. 0 se pehle aakhri index — "+ k" negative modulo se bachata hai.`, { [head]: 'new' });
    };
    const deleteLast = () => {
      if (!count) return void (outs.push('false'), show('delLast', 'deleteLast(): khaali → false.'));
      count--;
      outs.push('true');
      show('delLast', `deleteLast(): sirf count-- . rear = head + count − 1 apne aap ek peeche.`);
    };
    show('last', `Circular deque: head peeche bhi ja sakta hai (insertFront) aur aage bhi (deleteFront). Capacity ${k}.`);
    insertLast(1);
    insertLast(2);
    insertFront(3);
    insertFront(4);
    outs.push(String(count ? a[(head + count - 1) % k] : -1));
    show('last', `getRear() = ${outs[outs.length - 1]}.`);
    outs.push(String(count === k));
    deleteLast();
    insertFront(4);
    outs.push(String(count ? a[head] : -1));
    show('front', `getFront() = ${outs[outs.length - 1]}. Sab O(1). Results: ${outs.join(', ')}.`, count ? { [head]: 'found' } : {});
    return outs[0];
  },
});

// ---------- Example 3: gas station ----------
export const gasTrace = tracer<{ gas: number[]; cost: number[] }>({
  inputs: [
    { name: 'gas', type: 'intArray', label: 'gas', default: [1, 2, 3, 4, 5], minLen: 1, maxLen: 7, min: 0, max: 9 },
    { name: 'cost', type: 'intArray', label: 'cost (utni hi length)', default: [3, 4, 5, 1, 2], minLen: 1, maxLen: 7, min: 0, max: 9 },
  ],
  check: ({ gas, cost }) => (gas.length === cost.length ? null : 'gas aur cost ki length barabar honi chahiye.'),
  run({ gas, cost }, t) {
    const diff = gas.map((g, i) => g - cost[i]);
    let total = 0;
    let tank = 0;
    let start = 0;
    const view = (i: number, tone: Tone): Panel[] => [
      array(gas, { label: 'gas' }),
      array(cost, { label: 'cost' }),
      array(diff, { label: 'gas − cost', pointers: { start, i }, tones: { ...Object.fromEntries(diff.map((_, j) => [j, (j < start ? 'muted' : undefined) as Tone])), [i]: tone } }),
    ];
    t.frame({ line: 'drive', caption: 'Har station par fayda/nuksaan = gas − cost. Ek pass mein start dhoondhna hai.', vars: { total, tank, start }, legend: { muted: 'start ke liye bekaar' }, panels: view(0, 'compare') });
    for (let i = 0; i < gas.length; i++) {
      total += diff[i];
      tank += diff[i];
      t.frame({ line: 'drive', caption: `Station ${i}: tank += ${diff[i]} → ${tank}. (total = ${total})`, vars: { total, tank, start }, legend: { muted: 'start ke liye bekaar' }, panels: view(i, tank < 0 ? 'error' : 'active') });
      if (tank < 0) {
        start = i + 1;
        tank = 0;
        t.frame({ line: 'reset', caption: `Tank minus! Pichhle start se ${i + 1} tak nahi pahunche. Aur beech ke kisi station se shuru karte to bhi nahi (wahan tak tank ≥ 0 hi tha — usse kam lekar aate). To start = ${start}.`, vars: { total, tank, start }, legend: { muted: 'start ke liye bekaar' }, panels: view(i, 'error') });
      }
    }
    const ans = total >= 0 ? start : -1;
    t.frame({ line: 'answer', caption: total >= 0 ? `total = ${total} ≥ 0 → poore chakkar mein gas kaafi hai, aur start ${start} se aage kabhi minus nahi hua → ghoom ke bhi pahunchoge. Answer ${start}. O(n).` : `total = ${total} < 0 → kahin se bhi shuru karo, chakkar namumkin → −1.`, vars: { total, start }, panels: view(Math.min(start, gas.length - 1), ans >= 0 ? 'found' : 'error') });
    return String(ans);
  },
});
