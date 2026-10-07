import { array, tracer } from '@/components/viz/engine/tracer';
import type { Cell, Tone, ToneMap } from '@/components/viz/engine/types';

const show = (c: string) => (c === ' ' ? '␣' : c);
const chars = (s: string) => [...s].map(show);
const all = (n: number, tone: Tone): ToneMap => Object.fromEntries(Array.from({ length: n }, (_, i) => [i, tone]));

// ---------- 3. Visual intro: string = char array + codes + immutable ----------
export const stringMemory = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'String', default: 'chai', minLen: 1, maxLen: 8 }],
  run({ s }, t) {
    const codes = [...s].map((c) => c.charCodeAt(0));
    t.frame({
      caption: `String = characters ki line — andar se ek char array. s[0] = '${s[0]}', aakhri index = length - 1 = ${s.length - 1}. Index se char padhna O(1).`,
      vars: { length: s.length },
      panels: [array(chars(s), { label: 's' })],
    });
    t.frame({
      caption: `Computer ke liye har character ek NUMBER hai: 'a' = 97, 'b' = 98 … isliye \`c - 'a'\` karne se 0..25 milta hai — 26 letters ke array ka index!`,
      panels: [array(chars(s), { label: 's' }), array(codes, { label: 'c.code (number)' }), array(codes.map((x) => x - 97), { label: "c - 'a'", tones: all(s.length, 'new') })],
    });
    const up = s.toUpperCase();
    t.frame({
      caption: `\`val t = s.uppercase()\` → NAYI string bani. s bilkul waisi ki waisi hai — kyunki String IMMUTABLE hai (ek baar bani to badal nahi sakti).`,
      panels: [array(chars(s), { label: 's (purani — badli nahi)', tones: all(s.length, 'muted') }), array(chars(up), { label: 't (nayi string)', tones: all(up.length, 'new') })],
    });
    t.frame({
      caption: "`s[0] = 'X'` likhna mana hai (compile error). Badalna ho to `toCharArray()` se char array lo, badlo, phir `String(chars)` — ya StringBuilder. Har change = nayi copy ka cost.",
      panels: [array(chars(s), { label: 's', tones: { 0: 'error' } })],
    });
    return up;
  },
});

// ---------- 4. How: += vs StringBuilder ----------
export const plusVsBuilder = tracer<{ n: number }>({
  inputs: [{ name: 'n', type: 'int', label: 'n (kitne characters)', default: 5, min: 1, max: 10 }],
  run({ n }, t) {
    let s = '';
    let copies = 0;
    for (let i = 0; i < n; i++) {
      const c = String.fromCharCode(97 + i);
      copies += s.length + 1;
      s += c;
      t.frame({
        line: 'plus',
        caption: `s += '${c}' → purani string (${s.length - 1} chars) + naya char ki POORI nayi copy bani: ${s.length} chars copy. Ab tak total copies = ${copies}.`,
        vars: { i, 'copies (+=)': copies },
        panels: [array(chars(s), { label: `s (nayi object, length ${s.length})`, tones: { ...all(s.length - 1, 'compare'), [s.length - 1]: 'new' } })],
      });
    }
    let cap = 4;
    let buf: Cell[] = Array(cap).fill(null);
    let size = 0;
    let writes = 0;
    for (let i = 0; i < n; i++) {
      if (size === cap) {
        cap *= 2;
        buf = [...buf, ...Array<null>(cap - buf.length).fill(null)];
        writes += size;
        t.frame({
          caption: `Buffer bhar gaya → double (${cap}) kiya aur ${size} chars copy (dynamic array jaisa, kabhi-kabhi).`,
          vars: { 'writes (builder)': writes },
          panels: [array(buf, { label: `StringBuilder buffer (capacity ${cap})`, tones: all(size, 'new') })],
        });
      }
      buf[size] = String.fromCharCode(97 + i);
      size++;
      writes++;
      t.frame({
        line: 'append',
        caption: `sb.append('${buf[size - 1]}') → buffer ke end mein likha. Purane chars ko chhua bhi nahi.`,
        vars: { i, 'writes (builder)': writes, 'copies (+=)': copies },
        panels: [array(buf, { label: `StringBuilder buffer (capacity ${cap})`, tones: { [size - 1]: 'found' }, ranges: [{ from: 0, to: size - 1, label: `length ${size}` }] })],
      });
    }
    const out = buf.slice(0, size).join('');
    t.frame({
      line: 'done',
      caption: `toString() → "${out}". += ne ${copies} copies kiye (~n²/2), StringBuilder ne ~${writes + size}. n = 10⁵ par ye fark 10¹⁰ vs 10⁵ ka hai!`,
      vars: { 'copies (+=)': copies, 'writes (builder)': writes + size },
      panels: [array(chars(out), { label: 'Final string', tones: all(out.length, 'done') })],
    });
    return out;
  },
});

// ---------- Example 1: vowels count ----------
export const vowelsTrace = tracer<{ s: string }>({
  inputs: [
    {
      name: 's',
      type: 'string',
      label: 'Text',
      default: 'Hello World',
      minLen: 1,
      maxLen: 16,
      charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ',
    },
  ],
  run({ s }, t) {
    let count = 0;
    const tones: ToneMap = {};
    [...s].forEach((c, i) => {
      const low = c.toLowerCase();
      const v = 'aeiou'.includes(low);
      if (v) count++;
      tones[i] = v ? 'found' : 'muted';
      t.frame({
        line: 'check',
        caption: v ? `'${c}' → lowercase '${low}' vowel hai! count = ${count}.` : `'${show(c)}' vowel nahi.${c !== low ? ` (Pehle lowercase '${low}' kiya taaki 'A' aur 'a' dono pakde jaayein.)` : ''}`,
        vars: { i, count },
        panels: [array(chars(s), { tones: { ...tones, [i]: v ? 'found' : 'compare' }, pointers: { i } })],
      });
    });
    t.frame({ line: 'done', caption: `Total ${count} vowels. Har char ek baar → O(n).`, vars: { count }, panels: [array(chars(s), { tones })] });
    return String(count);
  },
});

// ---------- Example 2: valid palindrome ----------
export const palindromeTrace = tracer<{ s: string }>({
  inputs: [
    {
      name: 's',
      type: 'string',
      label: 'Text',
      default: 'A man, a plan, a canal: Panama',
      minLen: 1,
      maxLen: 30,
      charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,.:!?',
    },
  ],
  run({ s }, t) {
    const a = chars(s);
    const ok = (c: string) => /[a-z0-9]/i.test(c);
    let l = 0;
    let r = s.length - 1;
    const skipped: ToneMap = {};
    const matched: ToneMap = {};
    const view = (extra: ToneMap = {}) => array(a, { tones: { ...skipped, ...matched, ...extra }, pointers: { l, r } });
    t.frame({ line: 'init', caption: 'l shuru pe, r end pe. Sirf letters/digits compare karenge, baaki (space, comma) skip.', vars: { l, r }, panels: [view()] });
    while (l < r) {
      while (l < r && !ok(s[l])) {
        skipped[l] = 'muted';
        t.frame({ line: 'skipL', caption: `s[${l}] = '${a[l]}' letter/digit nahi → skip, l++.`, vars: { l, r }, panels: [view({ [l]: 'muted' })] });
        l++;
      }
      while (l < r && !ok(s[r])) {
        skipped[r] = 'muted';
        t.frame({ line: 'skipR', caption: `s[${r}] = '${a[r]}' letter/digit nahi → skip, r--.`, vars: { l, r }, panels: [view({ [r]: 'muted' })] });
        r--;
      }
      if (l >= r) break;
      const x = s[l].toLowerCase();
      const y = s[r].toLowerCase();
      if (x !== y) {
        t.frame({ line: 'cmp', caption: `'${x}' != '${y}' → mismatch! Palindrome nahi → false.`, vars: { l, r }, panels: [view({ [l]: 'error', [r]: 'error' })] });
        return 'false';
      }
      matched[l] = 'done';
      matched[r] = 'done';
      t.frame({ line: 'cmp', caption: `'${s[l]}' aur '${s[r]}' → lowercase mein dono '${x}' — match.`, vars: { l, r }, panels: [view({ [l]: 'found', [r]: 'found' })] });
      l++;
      r--;
      t.frame({ line: 'move', caption: `Dono andar: l = ${l}, r = ${r}.`, vars: { l, r }, panels: [view()] });
    }
    t.frame({ line: 'done', caption: 'l aur r mil gaye, koi mismatch nahi → true. Har char ek baar → O(n), extra space O(1) (nayi cleaned string nahi banayi).', vars: { l, r }, panels: [view()] });
    return 'true';
  },
});

// ---------- Example 3: compression ----------
export const compressTrace = tracer<{ s: string }>({
  inputs: [{ name: 's', type: 'string', label: 'String', default: 'aaabbc', minLen: 1, maxLen: 14 }],
  run({ s }, t) {
    let out = '';
    let i = 0;
    const done: ToneMap = {};
    while (i < s.length) {
      let j = i;
      t.frame({ line: 'start', caption: `Naya run index ${i} se: char '${s[i]}'.`, vars: { i, j }, panels: [array(chars(s), { tones: { ...done, [i]: 'active' }, pointers: { i } }), { kind: 'text', label: 'sb', text: out }] });
      while (j < s.length && s[j] === s[i]) j++;
      const len = j - i;
      t.frame({
        line: 'run',
        caption: `j aage badhta gaya jab tak '${s[i]}' tha → run length = ${len}.`,
        vars: { i, j, run: len },
        panels: [array(chars(s), { tones: done, pointers: { i, j }, ranges: [{ from: i, to: j - 1, label: `run = ${len}`, tone: 'compare' }] }), { kind: 'text', label: 'sb', text: out }],
      });
      out += s[i] + (len > 1 ? String(len) : '');
      for (let k = i; k < j; k++) done[k] = 'done';
      t.frame({
        line: 'write',
        caption: len > 1 ? `sb mein '${s[i]}' + count ${len} → "${s[i]}${len}".` : `Run sirf 1 ka — sirf '${s[i]}' likha, count nahi.`,
        vars: { i, j },
        panels: [array(chars(s), { tones: done, pointers: { i, j } }), { kind: 'text', label: 'sb', text: out, tone: 'new' }],
      });
      i = j;
    }
    t.frame({ line: 'done', caption: `Result "${out}". Har char ek baar dekha → O(n). StringBuilder ki wajah se jodna bhi O(n).`, panels: [array(chars(s), { tones: done }), { kind: 'text', label: 'sb', text: out, tone: 'done' }] });
    return out;
  },
});
