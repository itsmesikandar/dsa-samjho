// Site search: index is built at build time (scripts/gen.ts), matching runs in the browser. No library.

export type DocKind = 'page' | 'chapter' | 'topic' | 'example' | 'problem' | 'term';

/** one search result as stored in src/generated/search-index.json (short keys keep the file small) */
export interface SearchDoc {
  k: DocKind;
  /** title */
  t: string;
  /** sub line shown under the title */
  s: string;
  /** href */
  h: string;
  /** extra words that should match but are not shown (tags, signals, problem number) */
  w: string;
}

export const KIND_LABEL: Record<DocKind, string> = { page: 'Page', term: 'Glossary', chapter: 'Chapter', topic: 'Topic', example: 'Example', problem: 'Practice' };
const KIND_BONUS: Record<DocKind, number> = { page: 3, term: 1, topic: 3, chapter: 2, example: 1, problem: 0 };

/** lowercase, only a-z 0-9, single spaces ("Kadane's — O(n)" → "kadane s o n") */
export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** markdown inline marks hata do: **x**, `x`, [x](y) */
export const plain = (s: string) =>
  s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*`_]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export interface Prepared {
  doc: SearchDoc;
  title: string;
  titleWords: string[];
  rest: string;
  restWords: string[];
}

export const prepare = (docs: SearchDoc[]): Prepared[] =>
  docs.map((doc) => {
    const title = norm(doc.t);
    const rest = norm(`${doc.s} ${doc.w}`);
    return { doc, title, titleWords: title.split(' '), rest, restWords: rest.split(' ') };
  });

/** har query word kahin to milna chahiye (AND). Title mein mila to zyada score. */
function scoreOf(p: Prepared, words: string[], phrase: string): number {
  let score = 0;
  for (const w of words) {
    // lambe word ka chhota roop bhi chalega: palindrome → palindrom(ic)
    const stem = w.length >= 6 ? w.slice(0, -2) : '';
    if (p.titleWords.includes(w)) score += 10;
    else if (p.titleWords.some((x) => x.startsWith(w))) score += 7;
    else if (w.length >= 3 && p.title.includes(w)) score += 4;
    else if (stem && p.titleWords.some((x) => x.startsWith(stem))) score += 4;
    else if (p.restWords.includes(w)) score += 3;
    else if (p.restWords.some((x) => x.startsWith(w))) score += 2;
    else if (w.length >= 3 && p.rest.includes(w)) score += 1;
    else if (stem && p.restWords.some((x) => x.startsWith(stem))) score += 1;
    else return -1;
  }
  if (words.length > 1) score += p.title.startsWith(phrase) ? 6 : p.title.includes(phrase) ? 3 : p.rest.includes(phrase) ? 2 : 0;
  else if (p.title === phrase) score += 6;
  return score + KIND_BONUS[p.doc.k];
}

export function search(index: Prepared[], query: string, limit = 30): SearchDoc[] {
  const phrase = norm(query);
  if (!phrase) return [];
  const words = phrase.split(' ');
  const hits: { p: Prepared; score: number }[] = [];
  for (const p of index) {
    const score = scoreOf(p, words, phrase);
    if (score >= 0) hits.push({ p, score });
  }
  hits.sort((a, b) => b.score - a.score || a.p.doc.t.length - b.p.doc.t.length);
  return hits.slice(0, limit).map((h) => h.p.doc);
}

/** har query word kisi word ki shuruaat ho ("sub" → subarray) — patterns / glossary filter */
export const prefixMatch = (query: string[], words: string[]) => query.every((q) => words.some((w) => w.startsWith(q)));
