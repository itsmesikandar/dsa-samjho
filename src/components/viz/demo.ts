import { array, ids, swap, tracer } from './engine/tracer';
import type { CallNode, GraphNode, HashEntry, ListNode, Tone, TreeNode } from './engine/types';

export const arrayDemo = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [5, 1, 4, 2, 8], minLen: 2, maxLen: 8, min: -99, max: 99 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    t.frame({ caption: 'Ek bubble-sort pass chalayenge: padosi pairs compare karke bade number ko aage bhejenge.', panels: [array(a, { ids: id })] });
    for (let i = 0; i + 1 < a.length; i++) {
      t.frame({
        caption: `a[${i}] = ${a[i]} aur a[${i + 1}] = ${a[i + 1]} ko compare karo — kaun bada hai?`,
        vars: { i },
        panels: [array(a, { ids: id, tones: { [i]: 'compare', [i + 1]: 'compare' }, pointers: { i, j: i + 1 }, ranges: [{ from: i, to: i + 1, label: 'pair' }] })],
      });
      if (a[i] > a[i + 1]) {
        swap(a, i, i + 1);
        swap(id, i, i + 1);
        t.frame({
          caption: `${a[i + 1]} bada tha, isliye swap kiya — bada number right ki taraf "bubble" hota hai.`,
          vars: { i },
          panels: [array(a, { ids: id, tones: { [i]: 'swap', [i + 1]: 'swap' }, pointers: { i, j: i + 1 } })],
        });
      }
    }
    t.frame({ caption: 'Ek pass ke baad sabse bada number last position par pahunch gaya.', panels: [array(a, { ids: id, tones: { [a.length - 1]: 'done' } })] });
    return a.join(' ');
  },
});

export const memoryDemo = tracer<Record<string, never>>({
  inputs: [],
  run(_, t) {
    const addr = [1, 6, 3, 9];
    const vals = [10, 20, 30, 40];
    const cells = (upto: number) =>
      Array.from({ length: 11 }, (_, i) => {
        const k = addr.indexOf(i);
        return k === -1 ? {} : { value: vals[k], tone: (k <= upto ? 'active' : undefined) as Tone | undefined, tag: `node ${k}` };
      });
    t.frame({ caption: 'RAM ek lambi line hai. Linked list ke nodes alag-alag jagah bikhre hote hain — ek ke baad ek nahi.', panels: [{ kind: 'memory', start: 2000, cells: cells(-1) }] });
    for (let k = 0; k < addr.length - 1; k++) {
      t.frame({
        caption: `Node ${k} apne andar agle node ka address (${2000 + addr[k + 1] * 4}) rakhta hai — isiliye arrow wahan tak jaata hai, chahe wo kitna bhi door ho.`,
        panels: [{ kind: 'memory', start: 2000, cells: cells(k + 1), arrows: addr.slice(0, k + 1).map((a, j) => ({ from: a, to: addr[j + 1] })) }],
      });
    }
    return 'ok';
  },
});

export const gridDemo = tracer<{ rows: number; cols: number }>({
  inputs: [
    { name: 'rows', type: 'int', label: 'Rows', default: 3, min: 1, max: 5 },
    { name: 'cols', type: 'int', label: 'Columns', default: 4, min: 1, max: 6 },
  ],
  run({ rows, cols }, t) {
    const dp: (number | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
    const labels = { rowLabels: dp.map((_, r) => `r${r}`), colLabels: dp[0].map((_, c) => `c${c}`), corner: 'dp' };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tones: Record<string, Tone> = { [`${r},${c}`]: 'active' };
        if (r > 0) tones[`${r - 1},${c}`] = 'compare';
        if (c > 0) tones[`${r},${c - 1}`] = 'compare';
        dp[r][c] = r === 0 || c === 0 ? 1 : dp[r - 1][c]! + dp[r][c - 1]!;
        t.frame({
          caption: r === 0 || c === 0 ? `Pehli row/column mein sirf ek hi raasta hota hai, isliye dp[${r}][${c}] = 1.` : `Upar wala + baaya wala: ${dp[r - 1][c]} + ${dp[r][c - 1]} = ${dp[r][c]} raaste.`,
          vars: { r, c },
          panels: [{ kind: 'grid', values: dp, tones, ...labels }],
        });
      }
    }
    return String(dp[rows - 1][cols - 1]);
  },
});

export const barsDemo = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Numbers', default: [6, 2, 9, 4, 1, 7], minLen: 2, maxLen: 8, min: 0, max: 50 }],
  run({ arr }, t) {
    const a = [...arr];
    const id = ids(a.length);
    const sortedTones = (k: number) => Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'done' as Tone]));
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) {
        t.frame({
          caption: `Abhi tak ka sabse chhota a[${min}] = ${a[min]}. Usse a[${j}] = ${a[j]} compare karo.`,
          vars: { i, j, min },
          panels: [{ kind: 'bars', values: [...a], ids: [...id], tones: { ...sortedTones(i), [min]: 'found', [j]: 'compare' }, pointers: [{ name: 'i', index: i }, { name: 'j', index: j }] }],
        });
        if (a[j] < a[min]) min = j;
      }
      swap(a, i, min);
      swap(id, i, min);
      t.frame({
        caption: `Sabse chhota (${a[i]}) position ${i} par swap kar diya — ab 0..${i} sorted hai.`,
        vars: { i, min },
        panels: [{ kind: 'bars', values: [...a], ids: [...id], tones: { ...sortedTones(i + 1) }, pointers: [{ name: 'i', index: i }] }],
      });
    }
    return a.join(' ');
  },
});

export const listDemo = tracer<{ arr: number[] }>({
  inputs: [{ name: 'arr', type: 'intArray', label: 'List values', default: [1, 2, 3, 4], minLen: 1, maxLen: 6, min: -99, max: 99 }],
  run({ arr }, t) {
    const nodes: ListNode[] = arr.map((v, i) => ({ id: `n${i}`, value: v, next: i + 1 < arr.length ? `n${i + 1}` : null }));
    const get = (id: string) => nodes.find((n) => n.id === id)!;
    let prev: string | null = null;
    let curr: string | null = 'n0';
    const show = (caption: string, extra: { name: string; at: string | null }[] = []) =>
      t.frame({
        caption,
        panels: [{ kind: 'list', nodes: nodes.map((n) => ({ ...n, tone: n.id === curr ? 'active' : undefined })), pointers: [{ name: 'prev', at: prev }, { name: 'curr', at: curr }, ...extra] }],
      });
    show('prev = null, curr = head. Har node ka arrow ulta karenge.');
    while (curr) {
      const nxt: string | null = get(curr).next ?? null;
      show('Pehle next ko save karo, warna arrow ulta karte hi baaki list kho jaayegi.', [{ name: 'next', at: nxt }]);
      get(curr).next = prev;
      show('curr ka arrow ab prev ki taraf mod diya.', [{ name: 'next', at: nxt }]);
      prev = curr;
      curr = nxt;
      show('prev aur curr dono ek kadam aage badhe.');
    }
    show('curr null ho gaya — prev hi naya head hai. List ulti ho gayi!', [{ name: 'head', at: prev }]);
    const out: string[] = [];
    for (let c: string | null | undefined = prev; c; c = get(c).next) out.push(String(get(c).value));
    return out.join(' ');
  },
});

export const stackQueueDemo = tracer<Record<string, never>>({
  inputs: [],
  run(_, t) {
    const st: number[] = [];
    const sid: string[] = [];
    const q: number[] = [];
    const qid: string[] = [];
    let n = 0;
    const show = (caption: string, top?: Tone) =>
      t.frame({
        caption,
        panels: [
          { kind: 'stack', label: 'Stack (LIFO)', items: [...st], ids: [...sid], tones: top && st.length ? { [st.length - 1]: top } : {} },
          { kind: 'queue', label: 'Queue (FIFO)', items: [...q], ids: [...qid] },
        ],
      });
    show('Dono khaali hain. Same numbers dono mein daalenge aur nikaalenge.');
    for (const v of [1, 2, 3]) {
      st.push(v);
      sid.push(`s${n}`);
      q.push(v);
      qid.push(`q${n++}`);
      show(`${v} daala: stack mein upar, queue mein peeche (rear).`, 'new');
    }
    st.pop();
    sid.pop();
    q.shift();
    qid.shift();
    show('Ek nikaala: stack se 3 (jo last aaya), queue se 1 (jo pehle aaya). Yahi LIFO vs FIFO hai.');
    return 'ok';
  },
});

export const ringDemo = tracer<Record<string, never>>({
  inputs: [],
  run(_, t) {
    const cap = 5;
    const slots: (number | null)[] = Array(cap).fill(null);
    let front = 0;
    let rear = cap - 1;
    let size = 0;
    const show = (caption: string, hl?: number) =>
      t.frame({ caption, vars: { front, rear, size }, panels: [{ kind: 'ring', slots: [...slots], front, rear, tones: hl === undefined ? {} : { [hl]: 'new' } }] });
    show('Capacity 5 ki circular queue. rear ko (rear + 1) % 5 se aage badhate hain.');
    const enq = (v: number) => {
      rear = (rear + 1) % cap;
      slots[rear] = v;
      size++;
      show(`enqueue(${v}): rear = ${rear}. ${rear === 0 && size > 1 ? 'Wrap ho gaya — end ke baad wapas 0!' : ''}`, rear);
    };
    const deq = () => {
      slots[front] = null;
      front = (front + 1) % cap;
      size--;
      show(`dequeue(): front aage badha, ab front = ${front}. Khaali jagah dobara use hogi.`);
    };
    [1, 2, 3, 4].forEach(enq);
    deq();
    deq();
    [5, 6].forEach(enq);
    return slots.join(' ');
  },
});

export const hashDemo = tracer<{ keys: number[] }>({
  inputs: [{ name: 'keys', type: 'intArray', label: 'Keys', default: [12, 7, 19, 5, 26, 33], minLen: 1, maxLen: 8, min: 0, max: 99, distinct: true }],
  run({ keys }, t) {
    let m = 4;
    let buckets: HashEntry[][] = Array.from({ length: m }, () => []);
    let size = 0;
    for (const k of keys) {
      const b = k % m;
      buckets[b].push({ key: k, id: `k${k}`, tone: 'new' });
      size++;
      t.frame({
        caption: `Key ${k} ka bucket = ${k} % ${m} = ${b}. ${buckets[b].length > 1 ? 'Wahan pehle se key hai — collision! Chain mein peeche jod diya.' : ''}`,
        vars: { size, m, load: +(size / m).toFixed(2) },
        panels: [{ kind: 'hash', buckets: structuredClone(buckets), bucketTones: { [b]: 'active' }, calc: `hash(${k}) = ${k} % ${m} = ${b}` }],
      });
      buckets.forEach((ch) => ch.forEach((e) => (e.tone = undefined)));
      if (size > 0.75 * m) {
        const old = buckets.flat();
        m *= 2;
        buckets = Array.from({ length: m }, () => []);
        for (const e of old) buckets[(e.key as number) % m].push({ ...e, tone: 'swap' });
        t.frame({
          caption: `Load factor ${size}/${m / 2} > 0.75 ho gaya, isliye table double (${m}) kiya aur har key ko naye bucket mein dobara daala (rehash).`,
          vars: { size, m, load: +(size / m).toFixed(2) },
          panels: [{ kind: 'hash', buckets: structuredClone(buckets) }],
        });
        buckets.forEach((ch) => ch.forEach((e) => (e.tone = undefined)));
      }
    }
    return String(m);
  },
});

export const mapDemo = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Word', default: 'banana', minLen: 1, maxLen: 12 }],
  run({ s }, t) {
    const freq = new Map<string, number>();
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      freq.set(ch, (freq.get(ch) ?? 0) + 1);
      t.frame({
        caption: `'${ch}' mila — uska count ${freq.get(ch)} kar diya.`,
        vars: { i, ch },
        panels: [
          array([...s], { tones: { [i]: 'active' }, pointers: { i } }),
          { kind: 'map', keyLabel: 'char', valueLabel: 'count', entries: [...freq].map(([k, v]) => ({ key: k, value: v, tone: k === ch ? ('new' as Tone) : undefined })) },
          { kind: 'text', label: 'Abhi tak padha', text: s.slice(0, i + 1) },
        ],
      });
    }
    return [...freq].map(([k, v]) => `${k}${v}`).join(' ');
  },
});

export const treeDemo = tracer<{ keys: number[] }>({
  inputs: [{ name: 'keys', type: 'intArray', label: 'Insert order', default: [50, 30, 70, 20, 40, 60, 80], minLen: 1, maxLen: 10, min: 1, max: 99, distinct: true }],
  run({ keys }, t) {
    const nodes: TreeNode[] = [];
    const get = (id: string) => nodes.find((n) => n.id === id)!;
    let root: string | null = null;
    for (const k of keys) {
      const id = `t${k}`;
      if (!root) {
        nodes.push({ id, value: k, left: null, right: null });
        root = id;
        t.frame({ caption: `Tree khaali tha, isliye ${k} root ban gaya.`, panels: [{ kind: 'tree', root, nodes: nodes.map((n) => ({ ...n, tone: n.id === id ? 'new' : undefined })) }] });
        continue;
      }
      let cur = root;
      for (;;) {
        const c = get(cur);
        const goLeft = k < (c.value as number);
        t.frame({
          caption: `${k} ${goLeft ? '<' : '>'} ${c.value}, isliye ${goLeft ? 'left' : 'right'} jaao.`,
          panels: [{ kind: 'tree', root, nodes: nodes.map((n) => ({ ...n, tone: n.id === cur ? 'compare' : undefined })), pointers: [{ name: 'curr', at: cur }] }],
        });
        const nxt = goLeft ? c.left : c.right;
        if (nxt) {
          cur = nxt;
          continue;
        }
        nodes.push({ id, value: k, left: null, right: null });
        if (goLeft) c.left = id;
        else c.right = id;
        t.frame({ caption: `Khaali jagah mili — ${k} yahan lag gaya.`, panels: [{ kind: 'tree', root, nodes: nodes.map((n) => ({ ...n, tone: n.id === id ? 'new' : undefined })) }] });
        break;
      }
    }
    const inorder: number[] = [];
    const walk = (id: string | null | undefined) => {
      if (!id) return;
      walk(get(id).left);
      inorder.push(get(id).value as number);
      walk(get(id).right);
    };
    walk(root);
    return inorder.join(' ');
  },
});

const GRAPH_DEFAULT = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [4, 5],
];
const GRAPH_POS: Record<number, [number, number]> = { 0: [5, 50], 1: [30, 10], 2: [30, 90], 3: [55, 50], 4: [78, 20], 5: [98, 60] };

export const graphDemo = tracer<{ edges: number[][] }>({
  inputs: [{ name: 'edges', type: 'edges', label: 'Edges (undirected)', default: GRAPH_DEFAULT, nodes: 6, maxEdges: 10 }],
  run({ edges }, t) {
    const n = 6;
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [a, b] of edges) {
      adj[a].push(b);
      adj[b].push(a);
    }
    const authored = JSON.stringify(edges) === JSON.stringify(GRAPH_DEFAULT);
    const dist: (number | null)[] = Array(n).fill(null);
    const queue: number[] = [0];
    dist[0] = 0;
    const show = (caption: string, cur?: number) => {
      const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => ({
        id: String(i),
        ...(authored ? { x: GRAPH_POS[i][0], y: GRAPH_POS[i][1] } : {}),
        tone: i === cur ? 'active' : queue.includes(i) ? 'new' : dist[i] !== null ? 'done' : undefined,
        badge: dist[i] === null ? undefined : `d=${dist[i]}`,
      }));
      t.frame({
        caption,
        vars: { current: cur ?? null },
        panels: [
          { kind: 'graph', nodes, edges: edges.map(([a, b]) => ({ from: String(a), to: String(b), tone: cur !== undefined && (a === cur || b === cur) ? 'active' : undefined })) },
          { kind: 'queue', label: 'BFS queue', items: [...queue], ids: queue.map((q) => `q${q}`) },
        ],
      });
    };
    show('Node 0 se BFS shuru. Queue mein 0 daala, uski distance 0.');
    while (queue.length) {
      const u = queue.shift()!;
      show(`Queue ke front se ${u} nikaala. Ab iske padosi dekhenge.`, u);
      for (const v of adj[u]) {
        if (dist[v] === null) {
          dist[v] = dist[u]! + 1;
          queue.push(v);
          show(`${v} pehli baar mila, isliye distance ${dist[v]} aur queue mein daala.`, u);
        }
      }
    }
    show('Queue khaali — saare reachable nodes ki shortest distance mil gayi.');
    return dist.map((d) => (d === null ? '-' : d)).join(' ');
  },
});

export const recursionDemo = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n', default: 4, min: 0, max: 5 }],
  run({ n }, t) {
    const calls: CallNode[] = [];
    let seq = 0;
    const show = (caption: string) => t.frame({ caption, panels: [{ kind: 'recursion', calls }] });
    const fib = (k: number, parent?: string): number => {
      const id = `c${seq++}`;
      const parentNode = parent ? calls.find((c) => c.id === parent) : undefined;
      if (parentNode) parentNode.state = 'waiting';
      calls.push({ id, parent, label: `fib(${k})`, state: 'active' });
      const me = calls[calls.length - 1];
      show(k < 2 ? `fib(${k}) base case hai — seedha ${k} return.` : `fib(${k}) ko fib(${k - 1}) aur fib(${k - 2}) chahiye. Pehle fib(${k - 1}) call.`);
      let r: number;
      if (k < 2) r = k;
      else {
        const a = fib(k - 1, id);
        me.state = 'active';
        show(`fib(${k - 1}) = ${a} wapas aaya. Ab fib(${k - 2}) call.`);
        const b = fib(k - 2, id);
        me.state = 'active';
        r = a + b;
      }
      me.state = 'done';
      me.ret = String(r);
      if (parentNode) parentNode.state = 'active';
      show(`fib(${k}) = ${r} return — stack se ye frame hat gaya.`);
      return r;
    };
    return String(fib(n));
  },
});

export const chartDemo = tracer<Record<string, never>>({
  inputs: [],
  run(_, t) {
    const N = 10;
    const xs = Array.from({ length: N }, (_, i) => i + 1);
    const series = [
      { label: 'O(1)', f: () => 1 },
      { label: 'O(log n)', f: (n: number) => Math.log2(n) },
      { label: 'O(n)', f: (n: number) => n },
      { label: 'O(n log n)', f: (n: number) => n * Math.log2(n) },
      { label: 'O(n²)', f: (n: number) => n * n },
    ].map((s) => ({ label: s.label, points: xs.map((x) => [x, +s.f(x).toFixed(1)] as [number, number]) }));
    for (const n of [1, 4, 7, 10]) {
      t.frame({
        caption: `n = ${n}: dekho n² kitni tezi se upar jaata hai jabki log n lagbhag flat rehta hai.`,
        vars: { n },
        panels: [{ kind: 'chart', series, marker: n, xLabel: 'n (input size)', yLabel: 'steps', yMax: 100 }],
      });
    }
    return 'ok';
  },
});
