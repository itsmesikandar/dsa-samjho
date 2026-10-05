import { array, tracer } from '@/components/viz/engine/tracer';
import type { CallNode, MapPanel, Tone } from '@/components/viz/engine/types';

// ---------- 3. Visual intro: loop patterns ----------
export const loopPatterns = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 16, min: 2, max: 64 }],
  run({ n }, t) {
    const count = (f: () => number) => f();
    const pats: [string, string, number, string][] = [
      ['for (i in 0 until n)', 'O(n)', n, 'i har baar 1 badhta hai → n chakkar.'],
      ['i += 2', 'O(n)', Math.ceil(n / 2), 'Aadhe chakkar (n/2) — par ½ ek constant hai, hata do. Phir bhi O(n).'],
      [
        'i *= 2 (jab tak i < n)',
        'O(log n)',
        count(() => {
          let c = 0;
          for (let i = 1; i < n; i *= 2) c++;
          return c;
        }),
        'i har baar double → bas log₂ n chakkar.',
      ],
      [
        'k * k <= n',
        'O(√n)',
        count(() => {
          let c = 0;
          for (let k = 1; k * k <= n; k++) c++;
          return c;
        }),
        'k sirf √n tak jaata hai (prime check mein yahi trick).',
      ],
      ['nested: j in 0 until n', 'O(n²)', n * n, 'Har i ke liye poora n → n × n.'],
      ['nested: j in i+1 until n', 'O(n²)', (n * (n - 1)) / 2, 'Triangle: n(n-1)/2 — aadha hai, par ½ hata do. Phir bhi O(n²).'],
    ];
    const rows: MapPanel['entries'] = [];
    const panel = (): MapPanel => ({ kind: 'map', keyLabel: 'Loop pattern', valueLabel: `Chakkar (n = ${n})`, entries: rows.map((r) => ({ ...r })) });
    t.frame({
      caption: `Har loop pattern ko n = ${n} par chala ke dekhte hain ki kitne chakkar lagte hain. Loop variable kaise badalta hai — wahi complexity decide karta hai.`,
      vars: { n },
      panels: [panel()],
    });
    for (const [code, big, c, why] of pats) {
      rows.forEach((r) => (r.tone = undefined));
      rows.push({ key: code, value: `${c}  → ${big}`, tone: 'new' });
      t.frame({ caption: `${code}: ${c} chakkar. ${why}`, vars: { n, chakkar: c }, panels: [panel()] });
    }
    rows.forEach((r) => (r.tone = undefined));
    t.frame({
      caption: 'Yaad karne layak: +1/−1 → n, ×2 / ÷2 → log n, k² ≤ n → √n, loop ke andar loop → multiply.',
      vars: { n },
      panels: [panel()],
    });
    return String(n * n);
  },
});

// ---------- 4. How: hisse jodo ----------
export const analyzeParts = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n (array size)', default: 4, min: 1, max: 6 }],
  run({ n }, t) {
    const arr = Array(n).fill(0);
    let count = 0;
    const formula = (): { kind: 'text'; label: string; text: string } => ({ kind: 'text', label: 'Hisaab', text: `count = ${count}` });
    for (let x = 0; x < n; x++) {
      count++;
      t.frame({
        line: 'p1',
        caption: `Hissa 1: pehla loop, chakkar ${x + 1}/${n}. Har item par ek kaam.`,
        vars: { count },
        panels: [array(arr, { tones: { [x]: 'active' }, pointers: { x } }), formula()],
      });
    }
    for (let i = 0; i < n; i++) {
      count += n;
      t.frame({
        line: 'p2',
        caption: `Hissa 2: i = ${i} ke liye andar wala loop poore ${n} baar chala (j = 0..${n - 1}). Isliye bahar ke har chakkar par ${n} kaam.`,
        vars: { i, count },
        panels: [array(arr, { tones: Object.fromEntries(arr.map((_, j) => [j, 'compare' as Tone])), pointers: { i } }), formula()],
      });
    }
    t.frame({
      line: 'done',
      caption: `Total = n + n × n = ${n} + ${n * n} = ${count}. Ek ke baad ek hisse = JODO; loop ke andar loop = MULTIPLY. Sabse bada term rakho → O(n²).`,
      vars: { count },
      panels: [array(arr), { kind: 'text', label: 'Hisaab', text: `n + n² = ${count}  →  O(n²)` }],
    });
    return String(count);
  },
});

// ---------- Example 1: do alag loops = O(n + m) ----------
export const sumBoth = tracer<{ a: number[]; b: number[] }>({
  inputs: [
    { name: 'a', type: 'intArray', label: 'Array a', default: [1, 2, 3], minLen: 1, maxLen: 6, min: -50, max: 50 },
    { name: 'b', type: 'intArray', label: 'Array b', default: [4, 5], minLen: 1, maxLen: 6, min: -50, max: 50 },
  ],
  run({ a, b }, t) {
    let s = 0;
    let steps = 0;
    a.forEach((x, i) => {
      s += x;
      steps++;
      t.frame({
        line: 'loopA',
        caption: `Loop A: s += a[${i}] (${x}) → s = ${s}. a ke liye kul ${a.length} chakkar lagenge.`,
        vars: { s, steps },
        panels: [array(a, { label: 'a (n items)', tones: { [i]: 'active' }, pointers: { i } }), array(b, { label: 'b (m items)' })],
      });
    });
    b.forEach((y, j) => {
      s += y;
      steps++;
      t.frame({
        line: 'loopB',
        caption: `Loop A khatam, ab Loop B: s += b[${j}] (${y}) → s = ${s}. Ye loop A ke ANDAR nahi, uske BAAD chal raha hai.`,
        vars: { s, steps },
        panels: [array(a, { label: 'a (n items)', tones: Object.fromEntries(a.map((_, k) => [k, 'done' as Tone])) }), array(b, { label: 'b (m items)', tones: { [j]: 'active' }, pointers: { j } })],
      });
    });
    t.frame({
      line: 'done',
      caption: `Total steps = n + m = ${a.length} + ${b.length} = ${steps}. Isliye O(n + m) — n × m NAHI. Agar m chhota bhi ho, to bhi dono ko likho; n aur m alag inputs hain.`,
      vars: { s, steps },
      panels: [array(a, { label: 'a (n items)' }), array(b, { label: 'b (m items)' })],
    });
    return String(s);
  },
});

// ---------- Example 2: n × log n ----------
export const nLogN = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 8, min: 2, max: 16 }],
  run({ n }, t) {
    const js: number[] = [];
    for (let j = 1; j < n; j *= 2) js.push(j);
    const outer = Array.from({ length: n }, (_, i) => i);
    let ops = 0;
    t.frame({
      line: 'outer',
      caption: `Bahar ka loop i = 0..${n - 1} (${n} baar). Andar j = 1, 2, 4… jab tak j < ${n} — yaani ${js.length} baar. Dekho har i par kya hota hai.`,
      vars: { ops },
      panels: [array(outer, { label: 'i (bahar ka loop)' }), array(js, { label: 'j ki values (andar ka loop)' })],
    });
    for (let i = 0; i < n; i++) {
      ops += js.length;
      t.frame({
        line: 'inner',
        caption: `i = ${i}: andar ka loop j = ${js.join(', ')} → ${js.length} kaam. ops = ${ops}.`,
        vars: { i, ops },
        panels: [
          array(outer, { label: 'i (bahar ka loop)', tones: { [i]: 'active', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'done' as Tone])) }, pointers: { i } }),
          array(js, { label: 'j ki values (andar ka loop)', tones: Object.fromEntries(js.map((_, k) => [k, 'compare' as Tone])) }),
        ],
      });
    }
    t.frame({
      line: 'done',
      caption: `Total = n × (andar ke chakkar) = ${n} × ${js.length} = ${ops}. Andar ka loop log n baar chalta hai, isliye O(n log n). Merge sort aur heap sort isi family ke hain.`,
      vars: { ops },
      panels: [array(outer, { label: 'i (bahar ka loop)' }), array(js, { label: 'j ki values (andar ka loop)' })],
    });
    return String(ops);
  },
});

// ---------- Example 3: fib recursion tree ----------
export const fibCalls = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 5, min: 0, max: 5 }],
  run({ n }, t) {
    const calls: CallNode[] = [];
    const seen = new Set<string>();
    let seq = 0;
    let count = 0;
    const show = (line: string, caption: string) =>
      t.frame({ line, caption, vars: { calls: count }, legend: { error: 'repeat call (bekaar kaam)' }, panels: [{ kind: 'recursion', calls }] });
    const fib = (k: number, parent?: string): number => {
      const id = `c${seq++}`;
      count++;
      const p = parent ? calls.find((c) => c.id === parent) : undefined;
      if (p) p.state = 'waiting';
      const label = `fib(${k})`;
      const repeated = seen.has(label);
      const me: CallNode = { id, parent, label, state: 'active', tone: repeated ? ('error' as Tone) : undefined };
      calls.push(me);
      show('count', repeated ? `${label} DOBARA call hua! Iska jawab pehle hi nikal chuka hai — ye bekaar ka kaam hai (laal).` : `${label} call hua. Total calls ab tak: ${count}.`);
      let r: number;
      if (k < 2) {
        r = k;
        me.state = 'done';
        me.ret = String(r);
        if (p) p.state = 'active';
        show('base', `${label} base case hai → seedha ${r} return. Control wapas parent ke paas.`);
      } else {
        const a = fib(k - 1, id);
        me.state = 'active';
        const b = fib(k - 2, id);
        r = a + b;
        me.state = 'done';
        me.ret = String(r);
        if (p) p.state = 'active';
        show('rec', `${label} = fib(${k - 1}) + fib(${k - 2}) = ${a} + ${b} = ${r}. Return.`);
      }
      seen.add(label);
      return r;
    };
    const ans = fib(n);
    t.frame({
      caption: `fib(${n}) = ${ans}, par ${count} calls lage! Har call do naye calls banata hai → tree har level par lagbhag double → O(2ⁿ). Laal calls repeated kaam hain; DP (memoization) se har fib(k) sirf ek baar → O(n).`,
      vars: { calls: count },
      panels: [{ kind: 'recursion', calls }],
    });
    return String(ans);
  },
});
