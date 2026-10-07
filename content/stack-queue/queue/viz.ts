import { array, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

const queuePanel = (items: Cell[], label = 'Queue (aage → peeche)', tones: Record<number, Tone> = {}): Panel => ({ kind: 'queue', label, items: [...items], tones });
const stackPanel = (items: Cell[], label: string, tones: Record<number, Tone> = {}): Panel => ({ kind: 'stack', label, items: [...items], tones });

// ---------- 3. Visual intro: ticket counter ki line ----------
export const ticketLine = tracer<{ people: number[]; served: number }>({
  inputs: [
    { name: 'people', type: 'intArray', label: 'Line mein aane wale (token no.)', default: [101, 102, 103, 104], minLen: 1, maxLen: 6, min: 1, max: 999 },
    { name: 'served', type: 'int', label: 'Kitno ko ticket mila', default: 2, min: 0, max: 6 },
  ],
  check: ({ people, served }) => (served <= people.length ? null : `Line mein ${people.length} hi log hain.`),
  run({ people, served }, t) {
    const q: number[] = [];
    t.frame({ caption: 'Queue = railway ticket counter ki line. Naya aadmi PEECHE lagta hai (enqueue), ticket AAGE wale ko milta hai (dequeue). First In, First Out (FIFO).', panels: [queuePanel(q)] });
    for (const p of people) {
      q.push(p);
      t.frame({ caption: `Token ${p} peeche laga. O(1).`, vars: { size: q.length }, panels: [queuePanel(q, undefined, { [q.length - 1]: 'new' })] });
    }
    for (let i = 0; i < served; i++) {
      const p = q.shift()!;
      t.frame({ caption: `Aage wale (${p}) ko ticket — jo sabse PEHLE aaya tha. O(1) (ArrayDeque mein; array ke shift mein O(n) hota).`, vars: { size: q.length }, panels: [queuePanel(q, undefined, q.length ? { 0: 'compare' } : {})] });
    }
    const front = q.length ? String(q[0]) : 'khaali';
    t.frame({ caption: `Ab aage: ${front}. Stack mein ulta hota — wahan sabse baad wala pehle.`, panels: [queuePanel(q, undefined, q.length ? { 0: 'compare' } : {})] });
    return front;
  },
});

// ---------- 4. How: queue using two stacks ----------
export const twoStacksTrace = tracer<{ ops: string }>({
  inputs: [{ name: 'ops', type: 'string', label: 'Ops: digit = push, k = peek, o = pop', default: '12ko3oo', minLen: 1, maxLen: 12, charset: '0123456789ko' }],
  check: ({ ops }) => {
    let size = 0;
    for (const c of ops) {
      if (c === 'o' || c === 'k') {
        if (!size) return `"${c}" se pehle queue khaali hai — pehle koi digit (push) daalo.`;
        if (c === 'o') size--;
      } else size++;
    }
    return null;
  },
  run({ ops }, t) {
    const inbox: number[] = [];
    const outbox: number[] = [];
    const outs: number[] = [];
    let moves = 0;
    const view = (hotIn?: number, hotOut?: number): Panel[] => [
      stackPanel(inbox, 'inbox (push yahan)', hotIn !== undefined ? { [hotIn]: 'new' } : {}),
      stackPanel(outbox, 'outbox (pop yahan se)', hotOut !== undefined ? { [hotOut]: 'found' } : {}),
      { kind: 'text', label: 'Output', text: outs.length ? outs.join(', ') : '(abhi kuch nahi)' },
    ];
    const move = () => {
      if (outbox.length) return;
      while (inbox.length) {
        outbox.push(inbox.pop()!);
        moves++;
      }
      t.frame({ line: 'move', caption: `outbox khaali tha → inbox ke saare items ulte karke outbox mein. Ab sabse purana outbox ke TOP par.`, vars: { moves }, panels: view(undefined, outbox.length - 1) });
    };
    t.frame({ line: 'push', caption: 'Queue (FIFO) chahiye par sirf stacks (LIFO) hain. Trick: 2 stacks — ek mein daalo, doosre se nikaalo. Ulta-ulta = seedha!', panels: view() });
    for (const c of ops) {
      if (c === 'k' || c === 'o') {
        move();
        const v = c === 'k' ? outbox[outbox.length - 1] : outbox.pop()!;
        outs.push(v);
        t.frame({ line: 'pop', caption: c === 'k' ? `peek() = ${v} (outbox ka top).` : `pop() = ${v} — sabse pehle aaya hua.`, vars: { moves }, panels: view(undefined, c === 'k' ? outbox.length - 1 : undefined) });
      } else {
        inbox.push(Number(c));
        t.frame({ line: 'push', caption: `push(${c}) → inbox par. O(1).`, vars: { moves }, panels: view(inbox.length - 1) });
      }
    }
    t.frame({ line: 'pop', caption: `Har item max ek baar inbox → outbox shift hua (total ${moves} shifts). Isliye har operation amortized O(1).`, vars: { moves }, panels: view() });
    return String(outs[0]);
  },
});

// ---------- Example 1: recent calls ----------
export const recentTrace = tracer<{ times: number[] }>({
  inputs: [{ name: 'times', type: 'intArray', label: 'Ping times (badhte hue)', default: [1, 100, 3001, 3002], minLen: 1, maxLen: 8, min: 1, max: 9000, sorted: true, distinct: true }],
  run({ times }, t) {
    const q: number[] = [];
    const outs: number[] = [];
    for (const tm of times) {
      q.push(tm);
      t.frame({ line: 'add', caption: `ping(${tm}) → peeche jodo. Window = ${tm - 3000}..${tm}.`, panels: [queuePanel(q, 'Calls (window)', { [q.length - 1]: 'new' })] });
      const dropped: number[] = [];
      while (q[0] < tm - 3000) dropped.push(q.shift()!);
      if (dropped.length) t.frame({ line: 'drop', caption: `${dropped.join(', ')} window se bahar (< ${tm - 3000}) → aage se hatao. Times badhte hain, to purane hamesha aage hi milenge.`, legend: { error: 'bahar' }, panels: [queuePanel(q, 'Calls (window)')] });
      outs.push(q.length);
      t.frame({ line: 'count', caption: `Window mein ${q.length} calls → return ${q.length}.`, vars: { answer: q.length }, panels: [queuePanel(q, 'Calls (window)', Object.fromEntries(q.map((_, i) => [i, 'compare' as Tone])))] });
    }
    return String(outs[0]);
  },
});

// ---------- Example 2: Dota2 senate ----------
export const senateTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Senate (R/D)', default: 'RDD', minLen: 1, maxLen: 10, charset: 'RD' }],
  run({ s }, t) {
    const n = s.length;
    const r: number[] = [];
    const d: number[] = [];
    [...s].forEach((c, i) => (c === 'R' ? r : d).push(i));
    const view = (): Panel[] => [queuePanel(r, 'R ki baari (index)'), queuePanel(d, 'D ki baari (index)')];
    t.frame({ line: 'face', caption: 'Har party ki apni queue — jis order mein bolenge. Chhota index = pehle bolta hai. Sabse achha: apni baari par AGLE bolne wale opponent ka haq chheeno.', panels: view() });
    while (r.length && d.length) {
      const ri = r.shift()!;
      const di = d.shift()!;
      if (ri < di) {
        r.push(ri + n);
        t.frame({ line: 'rwin', caption: `R (${ri}) vs D (${di}): R pehle bola → D ka haq gaya. R agle round mein phir aayega (index ${ri} + ${n} = ${ri + n}).`, panels: view() });
      } else {
        d.push(di + n);
        t.frame({ line: 'dwin', caption: `R (${ri}) vs D (${di}): D pehle bola → R gaya. D index ${di + n} par agle round.`, panels: view() });
      }
    }
    const ans = r.length ? 'Radiant' : 'Dire';
    t.frame({ line: 'face', caption: `${r.length ? 'D' : 'R'} ki queue khaali → ${ans} jeeta. Har face-off ek senator hataata hai → O(n).`, panels: view() });
    return ans;
  },
});

// ---------- Example 3: first non-repeating char in stream ----------
export const streamTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Stream', default: 'aabc', minLen: 1, maxLen: 12, charset: 'abcd' }],
  run({ s }, t) {
    const c = [...s];
    const count: Record<string, number> = {};
    const q: string[] = [];
    let out = '';
    const countPanel = (): Panel => ({ kind: 'map', label: 'count', keyLabel: 'char', valueLabel: 'baar', entries: Object.keys(count).sort().map((k) => ({ key: k, value: count[k], tone: count[k] > 1 ? ('error' as Tone) : undefined })) });
    for (let i = 0; i < c.length; i++) {
      count[c[i]] = (count[c[i]] ?? 0) + 1;
      q.push(c[i]);
      t.frame({ line: 'count', caption: `'${c[i]}' aaya → count = ${count[c[i]]}, queue ke peeche.`, vars: { i }, legend: { error: 'repeat' }, panels: [array(c, { pointers: { i } }), queuePanel(q, 'Candidates'), countPanel()] });
      const dropped: string[] = [];
      while (q.length && count[q[0]] > 1) dropped.push(q.shift()!);
      if (dropped.length) t.frame({ line: 'drop', caption: `Aage wale (${dropped.join(', ')}) repeat ho chuke → hatao. Ek baar repeat hua to kabhi wapas 'unique' nahi hoga, isliye hamesha ke liye.`, vars: { i }, legend: { error: 'repeat' }, panels: [array(c, { pointers: { i } }), queuePanel(q, 'Candidates'), countPanel()] });
      out += q.length ? q[0] : '#';
      t.frame({ line: 'answer', caption: q.length ? `Answer: queue ka aage wala '${q[0]}'. Ab tak output "${out}".` : `Queue khaali → '#'. Output "${out}".`, vars: { i }, panels: [array(c, { pointers: { i } }), queuePanel(q, 'Candidates', q.length ? { 0: 'found' } : {}), { kind: 'text', label: 'Output', text: out }] });
    }
    return out;
  },
});
