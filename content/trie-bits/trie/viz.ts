import { array, tracer } from '@/components/viz/engine/tracer';
import type { GraphEdge, GraphNode, Panel, Tone } from '@/components/viz/engine/types';

type NT = Record<string, Tone>;

/** trie node — id = poora prefix (root = '^') */
interface TN {
  id: string;
  ch: string;
  depth: number;
  kids: Map<string, TN>;
  end: boolean;
  top: string[];
}
const mk = (prefix: string): TN => ({ id: prefix || '^', ch: prefix.slice(-1), depth: prefix.length, kids: new Map(), end: false, top: [] });
const words = (s: string) => s.split(',').filter(Boolean);
const wordsCheck = (s: string) => (words(s).length ? null : 'Kam se kam ek word likho (comma se alag).');

function insert(root: TN, w: string) {
  const path: TN[] = [root];
  const fresh: string[] = [];
  let cur = root;
  for (let i = 0; i < w.length; i++) {
    let nx = cur.kids.get(w[i]);
    if (!nx) {
      nx = mk(w.slice(0, i + 1));
      cur.kids.set(w[i], nx);
      fresh.push(nx.id);
    }
    cur = nx;
    path.push(cur);
  }
  cur.end = true;
  return { path, fresh, last: cur };
}

const countNodes = (n: TN): number => 1 + [...n.kids.values()].reduce((s, k) => s + countNodes(k), 0);

/** trie ko graph panel mein: depth = y, patte left se right (a-z order), parent beech mein */
function trieView(root: TN, tones: NT = {}, label = 'Trie (★ = yahan word khatam)'): Panel {
  const xs = new Map<string, number>();
  let leaf = 0;
  let maxD = 0;
  const kidsOf = (n: TN) => [...n.kids.values()].sort((a, b) => (a.ch < b.ch ? -1 : 1));
  const place = (n: TN): number => {
    maxD = Math.max(maxD, n.depth);
    const ks = kidsOf(n);
    let x: number;
    if (ks.length) {
      const c = ks.map(place);
      x = (c[0] + c[c.length - 1]) / 2;
    } else x = leaf++;
    xs.set(n.id, x);
    return x;
  };
  place(root);
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const walk = (n: TN) => {
    nodes.push({ id: n.id, label: n.depth ? n.ch : '•', x: leaf > 1 ? (xs.get(n.id)! / (leaf - 1)) * 100 : 50, y: maxD ? (n.depth / maxD) * 100 : 0, tone: tones[n.id], badge: n.end ? '★' : undefined });
    for (const k of kidsOf(n)) {
      const t = tones[k.id];
      edges.push({ from: n.id, to: k.id, tone: t && t !== 'muted' ? t : undefined });
      walk(k);
    }
  };
  walk(root);
  return { kind: 'graph', label, directed: true, nodes, edges };
}
const toneAll = (ids: string[], t: Tone): NT => Object.fromEntries(ids.map((id) => [id, t]));

// ---------- 3. Visual intro: words ek ek karke — common prefix share ----------
export const trieBuildTrace = tracer<{ list: string }>({
  inputs: [{ name: 'list', type: 'string', label: 'Words (comma se alag)', default: 'car,cat,cart,dog,do', minLen: 1, maxLen: 24, charset: 'abcdefghijklmnopqrstuvwxyz,' }],
  check: ({ list }) => wordsCheck(list),
  run({ list }, t) {
    const ws = words(list);
    const root = mk('');
    t.frame({ caption: 'Khaali trie — sirf root (•). Har word ko letter letter neeche chalke daalenge. Jo raasta pehle se hai wahi use hoga, naya sirf jahan zaroorat.', panels: [trieView(root)] });
    let total = 0;
    for (const w of ws) {
      total += w.length;
      const { path, fresh } = insert(root, w);
      const shared = w.length - fresh.length;
      const tones: NT = { ...toneAll(path.slice(1).map((n) => n.id), 'compare'), ...toneAll(fresh, 'new') };
      t.frame({ caption: fresh.length === 0 ? `"${w}": poora raasta pehle se tha — bas aakhri node par ★ lagaya.` : shared ? `"${w}": pehle ${shared} letter "${w.slice(0, shared)}" ka raasta pehle se — sirf ${fresh.length} ${fresh.length === 1 ? 'naya' : 'naye'} node.` : `"${w}": koi common prefix nahi — ${fresh.length} ${fresh.length === 1 ? 'naya' : 'naye'} node.`, vars: { word: w, nodes: countNodes(root) - 1 }, legend: { compare: 'pehle se tha', new: 'naya bana' }, panels: [trieView(root, tones)] });
    }
    const n = countNodes(root) - 1;
    t.frame({ caption: `${ws.length} words, ${total} letter — par trie mein sirf ${n} node: common prefix ek hi baar. Ab "kis prefix se kaunse words?" — prefix tak chalo, neeche ke saare ★ wahi words. Search ka cost word ki length, dictionary ke size se nahi.`, vars: { akshar: total, nodes: n }, panels: [trieView(root)] });
    return String(n);
  },
});

// ---------- 4. How: insert, search, startsWith ----------
export const trieOpsTrace = tracer<{ list: string; q: string }>({
  inputs: [
    { name: 'list', type: 'string', label: 'Words (comma se alag)', default: 'app,apple,apt,bat', minLen: 1, maxLen: 24, charset: 'abcdefghijklmnopqrstuvwxyz,' },
    { name: 'q', type: 'string', label: 'Search', default: 'ap', minLen: 1, maxLen: 6 },
  ],
  check: ({ list }) => wordsCheck(list),
  run({ list, q }, t) {
    const root = mk('');
    for (const w of words(list)) {
      const { path, fresh } = insert(root, w);
      t.frame({ line: 'end', caption: `insert("${w}"): har letter par bachcha hai to us par chalo, nahi to naya banao (${fresh.length} ${fresh.length === 1 ? 'naya' : 'naye'}). Aakhri node par isEnd = true (★).`, legend: { compare: 'raasta', new: 'naya' }, panels: [trieView(root, { ...toneAll(path.slice(1).map((n) => n.id), 'compare'), ...toneAll(fresh, 'new') })] });
    }
    let cur: TN | undefined = root;
    const seen: string[] = [];
    for (let i = 0; i < q.length && cur; i++) {
      const nx: TN | undefined = cur.kids.get(q[i]);
      if (!nx) {
        t.frame({ line: 'step', caption: `'${q[i]}': "${q.slice(0, i)}" ke baad '${q[i]}' ka bachcha hi nahi → raasta toota. "${q}" na word hai, na kisi word ka prefix.`, legend: { compare: 'raasta', error: 'yahan atke' }, panels: [trieView(root, { ...toneAll(seen, 'compare'), [cur.id]: 'error' })] });
        cur = undefined;
        break;
      }
      cur = nx;
      seen.push(cur.id);
      t.frame({ line: 'step', caption: `'${q[i]}' → aage chalo ("${q.slice(0, i + 1)}").`, legend: { compare: 'raasta', active: 'abhi' }, panels: [trieView(root, { ...toneAll(seen, 'compare'), [cur.id]: 'active' })] });
    }
    const found = !!cur?.end;
    if (cur) {
      t.frame({ line: 'search', caption: `search("${q}") = ${found}: raasta poora mila${found ? ' aur yahan ★ hai — poora word.' : ', par yahan ★ nahi — koi word yahan khatam nahi hota, ye sirf prefix hai.'}`, legend: { compare: 'raasta', error: 'word nahi' }, panels: [trieView(root, { ...toneAll(seen, 'compare'), ...(found ? {} : { [cur.id]: 'error' }) })] });
      t.frame({ line: 'prefix', caption: `startsWith("${q}") = true — raasta mila, bas itna kaafi. Dono kaam O(length), chahe dictionary mein lakhon words hon.`, legend: { compare: 'prefix ka raasta' }, panels: [trieView(root, toneAll(seen, 'compare'))] });
    } else {
      t.frame({ line: 'search', caption: `search("${q}") = false, startsWith("${q}") = false.`, panels: [trieView(root, toneAll(seen, 'compare'))] });
    }
    return String(found);
  },
});

// ---------- Example 1: Replace words (sabse chhota root) ----------
export const replaceTrace = tracer<{ roots: string; sentence: string }>({
  inputs: [
    { name: 'roots', type: 'string', label: 'Roots (comma se alag)', default: 'chai,pan,dal', minLen: 1, maxLen: 20, charset: 'abcdefghijklmnopqrstuvwxyz,' },
    { name: 'sentence', type: 'string', label: 'Sentence', default: 'chaiwala pani daliya', minLen: 1, maxLen: 30, charset: 'abcdefghijklmnopqrstuvwxyz ' },
  ],
  check: ({ roots }) => wordsCheck(roots),
  run({ roots, sentence }, t) {
    const root = mk('');
    for (const r of words(roots)) insert(root, r);
    t.frame({ caption: `Saare roots trie mein daal diye. Ab sentence ka har word: trie mein letter letter chalo — jaise hi koi ★ (root khatam) mile, wahin ruko: wahi SABSE CHHOTA root.`, panels: [trieView(root), array(sentence.split(' '), { label: 'sentence ke words' })] });
    const out: string[] = [];
    const parts = sentence.split(' ');
    parts.forEach((w, wi) => {
      let cur: TN = root;
      const seen: string[] = [];
      let res = w;
      let why = `koi root "${w}" ka prefix nahi → waisa hi.`;
      for (let i = 0; i < w.length; i++) {
        const nx = cur.kids.get(w[i]);
        if (!nx) {
          why = `'${w[i]}' par raasta toota (koi root "${w.slice(0, i + 1)}" se shuru nahi) → "${w}" waisa hi.`;
          break;
        }
        cur = nx;
        seen.push(cur.id);
        if (cur.end) {
          res = w.slice(0, i + 1);
          why = `"${res}" par ★ — root mila, aage dekhne ki zaroorat nahi → "${res}".`;
          break;
        }
      }
      out.push(res);
      t.frame({ line: res !== w ? 'root' : 'walk', caption: w ? `"${w}": ${why}` : 'Khaali word — waisa hi.', vars: { word: w }, legend: { compare: 'chala', new: 'root mila' }, panels: [trieView(root, { ...toneAll(seen, 'compare'), ...(res !== w ? { [cur.id]: 'new' } : {}) }), array(parts.map((p, k) => (k < wi ? out[k] : p)), { label: 'sentence', tones: { [wi]: 'active' } })] });
    });
    const ans = out.join(' ');
    t.frame({ caption: `Jawab: "${ans}". Har word par sirf root ki length tak chale — total O(sentence ki length).`, legend: { compare: 'badla' }, panels: [trieView(root), array(out, { label: 'jawab', tones: Object.fromEntries(out.map((o, k) => [k, o !== parts[k] ? 'compare' : undefined]).filter((e) => e[1])) })] });
    return ans;
  },
});

// ---------- Example 2: Search suggestions ----------
export const suggestTrace = tracer<{ list: string; word: string }>({
  inputs: [
    { name: 'list', type: 'string', label: 'Products (comma se alag)', default: 'pani,paneer,papad,pakoda,paratha', minLen: 1, maxLen: 34, charset: 'abcdefghijklmnopqrstuvwxyz,' },
    { name: 'word', type: 'string', label: 'Type karo', default: 'pani', minLen: 1, maxLen: 6 },
  ],
  check: ({ list }) => wordsCheck(list),
  run({ list, word }, t) {
    const sorted = [...words(list)].sort();
    const root = mk('');
    for (const p of sorted) {
      let cur = root;
      for (let i = 0; i < p.length; i++) {
        let nx = cur.kids.get(p[i]);
        if (!nx) cur.kids.set(p[i], (nx = mk(p.slice(0, i + 1))));
        cur = nx;
        if (cur.top.length < 3) cur.top.push(p);
      }
      cur.end = true;
    }
    t.frame({ line: 'insert', caption: `Products SORTED order mein daale: ${sorted.join(', ')}. Har node par us prefix wale pehle 3 words likh do — sorted daala tha, to pehle aaye wahi sabse chhote.`, panels: [trieView(root), array(sorted, { label: 'sorted products' })] });
    const ans: string[][] = [];
    let cur: TN | undefined = root;
    const seen: string[] = [];
    for (let i = 0; i < word.length; i++) {
      cur = cur?.kids.get(word[i]);
      if (cur) seen.push(cur.id);
      const top: string[] = cur ? cur.top : [];
      ans.push(top);
      t.frame({ line: 'type', caption: cur ? `"${word.slice(0, i + 1)}" type kiya → node par likhe: ${top.join(', ')}.` : `"${word.slice(0, i + 1)}": raasta nahi — is prefix ka koi product nahi → [] (aage bhi sab khaali).`, vars: { prefix: word.slice(0, i + 1) }, legend: { compare: 'raasta', active: 'abhi' }, panels: [trieView(root, { ...toneAll(seen, 'compare'), ...(cur ? { [cur.id]: 'active' } : {}) }), array(top.length ? top : ['—'], { label: 'suggestions (max 3)' })] });
    }
    const s = `[${ans.map((a) => `[${a.join(', ')}]`).join(', ')}]`;
    t.frame({ line: 'done', caption: `Jawab: ${s}. Har letter par ek step aur list pehle se taiyaar → typing ke saath O(1) per letter.`, panels: [trieView(root, toneAll(seen, 'compare'))] });
    return s;
  },
});

// ---------- Example 3: Wildcard search ('.' = koi bhi letter) ----------
export const wildcardTrace = tracer<{ list: string; pat: string }>({
  inputs: [
    { name: 'list', type: 'string', label: 'Words (comma se alag)', default: 'roti,rota,ram,rasta', minLen: 1, maxLen: 24, charset: 'abcdefghijklmnopqrstuvwxyz,' },
    { name: 'pat', type: 'string', label: 'Pattern (. = koi bhi)', default: 'r.t.', minLen: 1, maxLen: 6, charset: 'abcdefghijklmnopqrstuvwxyz.' },
  ],
  check: ({ list }) => wordsCheck(list),
  run({ list, pat }, t) {
    const root = mk('');
    for (const w of words(list)) insert(root, w);
    const dead: string[] = [];
    const path: string[] = [];
    t.frame({ caption: `Pattern "${pat}". Normal letter → ek hi bachcha. '.' → HAR bachche mein try (DFS). Kahin bhi poora pattern ★ par khatam → true.`, panels: [trieView(root)] });
    const view = (extra: NT = {}) => trieView(root, { ...toneAll(dead, 'error'), ...toneAll(path, 'compare'), ...extra });
    const dfs = (n: TN, i: number): boolean => {
      if (i === pat.length) {
        t.frame({ line: 'end', caption: n.end ? `Pattern khatam aur "${n.id}" par ★ → MILA.` : `Pattern khatam, par "${n.id}" par ★ nahi → yahan word nahi.`, legend: { compare: 'raasta', error: 'band gali', done: 'mila' }, panels: [view({ [n.id]: n.end ? 'done' : 'error' })] });
        return n.end;
      }
      const c = pat[i];
      const kids = c === '.' ? [...n.kids.values()].sort((a, b) => (a.ch < b.ch ? -1 : 1)) : [n.kids.get(c)].filter((k): k is TN => !!k);
      if (!kids.length) {
        t.frame({ line: c === '.' ? 'dot' : 'char', caption: c === '.' ? `'.' par "${n.id === '^' ? '' : n.id}" ka koi bachcha hi nahi → band gali.` : `'${c}' ka bachcha nahi → band gali.`, legend: { compare: 'raasta', error: 'band gali', active: 'abhi' }, panels: [view({ [n.id]: 'error' })] });
        return false;
      }
      for (const k of kids) {
        path.push(k.id);
        t.frame({ line: c === '.' ? 'dot' : 'char', caption: c === '.' ? `'.' → bachcha '${k.ch}' try karo ("${k.id}").` : `'${c}' → "${k.id}".`, legend: { compare: 'raasta', error: 'band gali', active: 'abhi' }, panels: [view({ [k.id]: 'active' })] });
        if (dfs(k, i + 1)) return true;
        path.pop();
        dead.push(k.id);
      }
      return false;
    };
    const ok = dfs(root, 0);
    t.frame({ caption: ok ? `search("${pat}") = true. '.' wale letter par branches khulti hain, par jo raasta galat ho turant band — poore dictionary ko nahi dekhna padta.` : `search("${pat}") = false — har raasta band gali.`, legend: { compare: 'mila raasta', error: 'band gali' }, panels: [view()] });
    return String(ok);
  },
});
