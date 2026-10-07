import { array, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Panel, Tone } from '@/components/viz/engine/types';

const stackPanel = (items: Cell[], label = 'Stack', top?: Tone): Panel => ({ kind: 'stack', label, items: [...items], tones: items.length && top ? { [items.length - 1]: top } : {} });

// ---------- 3. Visual intro: plates ----------
export const plates = tracer<{ values: number[]; pops: number }>({
  inputs: [
    { name: 'values', type: 'intArray', label: 'Push karne wali plates', default: [10, 20, 30, 40], minLen: 1, maxLen: 6, min: 1, max: 99 },
    { name: 'pops', type: 'int', label: 'Kitni pop', default: 2, min: 0, max: 6 },
  ],
  check: ({ values, pops }) => (pops <= values.length ? null : `Pop ${values.length} se zyada nahi — khaali stack se kya nikaaloge?`),
  run({ values, pops }, t) {
    const st: number[] = [];
    t.frame({ caption: 'Stack = plates ka pile. Sirf UPAR se rakh sakte ho (push) aur upar se hi utha sakte ho (pop). Last In, First Out (LIFO).', panels: [stackPanel(st)] });
    for (const v of values) {
      st.push(v);
      t.frame({ caption: `push(${v}) → sabse upar. O(1).`, vars: { size: st.length }, panels: [stackPanel(st, 'Stack', 'new')] });
    }
    for (let i = 0; i < pops; i++) {
      t.frame({ caption: `peek() = ${st[st.length - 1]} — upar wala dekha, nikaala nahi.`, vars: { size: st.length }, panels: [stackPanel(st, 'Stack', 'compare')] });
      const v = st.pop()!;
      t.frame({ caption: `pop() = ${v}. Jo SABSE BAAD mein aaya tha, wahi pehle gaya. O(1).`, vars: { size: st.length }, panels: [stackPanel(st, 'Stack', 'active')] });
    }
    const top = st.length ? String(st[st.length - 1]) : 'khaali';
    t.frame({ caption: `Ab top = ${top}. Beech wali plate chahiye? Upar ki sab hatani padengi — stack mein sirf top tak pahunch hai.`, vars: { size: st.length }, panels: [stackPanel(st, 'Stack', 'compare')] });
    return top;
  },
});

// ---------- 4. How: valid parentheses ----------
export const parenTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Brackets', default: '([]{})', minLen: 1, maxLen: 12, charset: '()[]{}' }],
  run({ s }, t) {
    const c = [...s];
    const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    const st: string[] = [];
    for (let i = 0; i < c.length; i++) {
      const ch = c[i];
      if (!(ch in pair)) {
        st.push(ch);
        t.frame({ line: 'push', caption: `'${ch}' khula → stack par. Ye tab tak wait karega jab tak iska band wala na aaye.`, vars: { i }, panels: [array(c, { pointers: { i }, tones: { [i]: 'new' } }), stackPanel(st, 'Khule (stack)', 'new')] });
        continue;
      }
      if (!st.length) {
        t.frame({ line: 'match', caption: `'${ch}' band karna hai par koi khula hi nahi → galat.`, vars: { i }, legend: { error: 'galat' }, panels: [array(c, { pointers: { i }, tones: { [i]: 'error' } }), stackPanel(st, 'Khule (stack)')] });
        return 'false';
      }
      const top = st.pop()!;
      if (top !== pair[ch]) {
        t.frame({ line: 'match', caption: `'${ch}' aaya, par sabse fresh khula '${top}' hai — pair nahi bani → galat. (Pehle andar wala band hona chahiye.)`, vars: { i }, legend: { error: 'galat' }, panels: [array(c, { pointers: { i }, tones: { [i]: 'error' } }), stackPanel([...st, top], 'Khule (stack)', 'error')] });
        return 'false';
      }
      t.frame({ line: 'match', caption: `'${ch}' ne sabse fresh khule '${top}' ko band kiya ✓ → pop.`, vars: { i }, legend: { found: 'pair bani' }, panels: [array(c, { pointers: { i }, tones: { [i]: 'found' } }), stackPanel(st, 'Khule (stack)')] });
    }
    const ok = st.length === 0;
    t.frame({ line: 'end', caption: ok ? 'String khatam, stack khaali → sab pairs bani → sahi! O(n).' : `String khatam par ${st.length} khule reh gaye (${st.join('')}) → galat.`, legend: { error: 'band nahi hue' }, panels: [array(c), stackPanel(st, 'Khule (stack)', ok ? undefined : 'error')] });
    return String(ok);
  },
});

// ---------- Example 1: remove adjacent duplicates ----------
export const adjTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 's', default: 'abbaca', minLen: 1, maxLen: 12, charset: 'abcxyz' }],
  run({ s }, t) {
    const c = [...s];
    const st: string[] = [];
    for (let i = 0; i < c.length; i++) {
      if (st.length && st[st.length - 1] === c[i]) {
        t.frame({ line: 'pop', caption: `'${c[i]}' == top '${st[st.length - 1]}' → dono pair ban ke gayab (pop). Ab jo neeche tha wo top — shayad wo agle se pair banaye.`, vars: { i }, legend: { error: 'hata' }, panels: [array(c, { pointers: { i }, tones: { [i]: 'error' } }), stackPanel(st, 'Stack (abhi ka result)', 'error')] });
        st.pop();
      } else {
        st.push(c[i]);
        t.frame({ line: 'push', caption: `'${c[i]}' top se alag → push.`, vars: { i }, panels: [array(c, { pointers: { i }, tones: { [i]: 'new' } }), stackPanel(st, 'Stack (abhi ka result)', 'new')] });
      }
    }
    const out = st.join('');
    t.frame({ line: 'push', caption: `Stack neeche se upar = answer "${out}". Ek pass, O(n). (Baar-baar string scan karte to O(n²).)`, panels: [stackPanel(st, 'Stack (abhi ka result)')] });
    return out;
  },
});

// ---------- Example 2: evaluate RPN ----------
const OPS = ['+', '-', '*', '/'];
const rpnCheck = (expr: string): string | null => {
  const toks = expr.trim().split(/\s+/).filter(Boolean);
  if (!toks.length) return 'Kuch tokens daalo, jaise: 2 1 + 3 *';
  const st: number[] = [];
  for (const tk of toks) {
    if (OPS.includes(tk)) {
      if (st.length < 2) return `"${tk}" se pehle 2 numbers chahiye.`;
      const b = st.pop()!;
      const a = st.pop()!;
      if (tk === '/' && b === 0) return 'Zero se divide nahi.';
      st.push(tk === '+' ? a + b : tk === '-' ? a - b : tk === '*' ? a * b : Math.trunc(a / b));
    } else if (/^-?\d+$/.test(tk)) {
      st.push(Number(tk));
    } else return `"${tk}" na number hai na operator.`;
  }
  return st.length === 1 ? null : 'Aakhir mein stack mein exactly ek number bachna chahiye.';
};
export const rpnTrace = tracer<{ expr: string }>({
  inputs: [{ name: 'expr', type: 'string', label: 'Tokens (space se alag)', default: '2 1 + 3 *', minLen: 1, maxLen: 30, charset: '0123456789+-*/ ' }],
  check: ({ expr }) => rpnCheck(expr),
  run({ expr }, t) {
    const toks = expr.trim().split(/\s+/);
    const st: number[] = [];
    for (let i = 0; i < toks.length; i++) {
      const tk = toks[i];
      if (OPS.includes(tk)) {
        const b = st.pop()!;
        const a = st.pop()!;
        const r = tk === '+' ? a + b : tk === '-' ? a - b : tk === '*' ? a * b : Math.trunc(a / b);
        st.push(r);
        t.frame({ line: 'op', caption: `"${tk}": do pop — b = ${b} (pehle nikla), a = ${a}. a ${tk} b = ${r} → push. (Order ulta kiya to ${a} ${tk} ${b} ki jagah ${b} ${tk} ${a} ho jaata!)`, vars: { i }, panels: [array(toks, { pointers: { i }, tones: { [i]: 'active' } }), stackPanel(st, 'Stack', 'new')] });
      } else {
        st.push(Number(tk));
        t.frame({ line: 'num', caption: `${tk} number → push. Operator aane tak wait.`, vars: { i }, panels: [array(toks, { pointers: { i }, tones: { [i]: 'compare' } }), stackPanel(st, 'Stack', 'new')] });
      }
    }
    t.frame({ line: 'result', caption: `Tokens khatam → stack mein bacha akela number = answer ${st[0]}. Brackets ki zaroorat hi nahi — calculators andar isi tarah chalte hain.`, panels: [stackPanel(st, 'Stack', 'found')] });
    return String(st[0]);
  },
});

// ---------- Example 3: decode string ----------
const decodeCheck = (s: string): string | null => {
  let open = 0;
  let k = '';
  let len = 0;
  const mult: number[] = [1];
  for (const c of s) {
    if (c >= '0' && c <= '9') k += c;
    else if (c === '[') {
      if (!k) return '"[" se pehle number chahiye, jaise 3[a].';
      mult.push(mult[mult.length - 1] * Number(k));
      k = '';
      open++;
    } else if (c === ']') {
      if (k) return 'Number ke baad "[" chahiye.';
      if (!open) return '"]" zyada hain.';
      mult.pop();
      open--;
    } else {
      if (k) return 'Number ke baad "[" chahiye.';
      len += mult[mult.length - 1];
    }
  }
  if (k) return 'Aakhir mein number bina "[" ke.';
  if (open) return 'Kuch "[" band nahi hue.';
  return len > 60 ? 'Output bahut lamba ho jaayega — chhote numbers lo.' : null;
};
export const decodeTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'Encoded', default: '3[a2[c]]', minLen: 1, maxLen: 14, charset: 'abc0123456789[]' }],
  check: ({ s }) => decodeCheck(s),
  run({ s }, t) {
    const c = [...s];
    const counts: number[] = [];
    const outs: string[] = [];
    let cur = '';
    let k = 0;
    const view = (i: number, tone: Tone): Panel[] => [
      array(c, { pointers: { i }, tones: { [i]: tone } }),
      stackPanel(counts, 'counts'),
      stackPanel(outs.map((o) => (o === '' ? '""' : o)), 'outs (pehle ka bana)'),
      { kind: 'text', label: 'cur', text: cur === '' ? '""' : cur },
    ];
    for (let i = 0; i < c.length; i++) {
      const ch = c[i];
      if (ch >= '0' && ch <= '9') {
        k = k * 10 + Number(ch);
        t.frame({ line: 'digit', caption: `Digit → k = ${k}.`, vars: { k }, panels: view(i, 'compare') });
      } else if (ch === '[') {
        counts.push(k);
        outs.push(cur);
        t.frame({ line: 'open', caption: `"[" → naya level. k = ${k} aur ab tak ka cur ("${cur}") stack par save. cur khaali se shuru.`, vars: { k }, panels: view(i, 'new') });
        cur = '';
        k = 0;
      } else if (ch === ']') {
        const times = counts.pop()!;
        const outer = outs.pop()!;
        const inner = cur;
        cur = outer + inner.repeat(times);
        t.frame({ line: 'close', caption: `"]" → level khatam: "${inner}" × ${times} = "${inner.repeat(times)}", bahar wale "${outer}" ke baad → cur = "${cur}".`, vars: { k }, panels: view(i, 'found') });
      } else {
        cur += ch;
        t.frame({ line: 'char', caption: `Letter → cur = "${cur}".`, vars: { k }, panels: view(i, 'active') });
      }
    }
    t.frame({ line: 'close', caption: `Answer "${cur}". 2 stacks (counts, outs) ne nesting yaad rakhi — recursion jaisa, bina recursion.`, panels: [{ kind: 'text', label: 'Answer', text: cur }] });
    return cur;
  },
});
