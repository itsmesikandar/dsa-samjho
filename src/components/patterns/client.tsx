'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { norm } from '@/lib/search';

export interface PatternItem {
  /** keyword / think — inline markdown se bana HTML (build time) */
  keyword: string;
  think: string;
  topic: string;
  href: string;
  /** filter ke liye saada text (keyword + think + topic) */
  text: string;
}
export interface PatternGroup {
  id: string;
  index: number;
  title: string;
  items: PatternItem[];
}

/** filter: har typed word kisi word ki shuruaat ho ("sub" → subarray, subsequence) */
export function PatternList({ groups }: { groups: PatternGroup[] }) {
  const [q, setQ] = useState('');
  const prepared = useMemo(() => groups.map((g) => ({ ...g, items: g.items.map((it) => ({ it, words: it.text.split(' ') })) })), [groups]);
  const words = norm(q).split(' ').filter(Boolean);
  const shown = prepared
    .map((g) => ({ ...g, items: words.length ? g.items.filter(({ words: ws }) => words.every((w) => ws.some((x) => x.startsWith(w)))) : g.items }))
    .filter((g) => g.items.length);
  const total = prepared.reduce((s, g) => s + g.items.length, 0);
  const count = shown.reduce((s, g) => s + g.items.length, 0);

  return (
    <>
      <div className="sticky top-14 z-10 -mx-4 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <label htmlFor="pattern-filter" className="sr-only">
          Keyword se filter karo
        </label>
        <input
          id="pattern-filter"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Keyword likho (jaise subarray, sorted)"
          autoComplete="off"
          spellCheck={false}
          className="h-11 w-full rounded-lg border border-line bg-bg px-3 text-base outline-none placeholder:text-muted focus:border-accent"
        />
        <p aria-live="polite" className="mt-1.5 text-xs text-muted">
          {words.length ? `${count} / ${total} signals mile` : `${total} signals, ${groups.length} chapters`}
        </p>
      </div>

      {shown.length > 1 && (
        <nav aria-label="Chapters" className="mt-4 flex flex-wrap gap-1.5">
          {shown.map((g) => (
            <a key={g.id} href={`#ch-${g.id}`} className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent">
              {g.index}. {g.title}
            </a>
          ))}
        </nav>
      )}

      {shown.length === 0 && (
        <p className="mt-10 text-center text-muted">
          &ldquo;{q}&rdquo; wala koi signal nahi mila. Chhota word try karo (jaise &ldquo;sum&rdquo;, &ldquo;max&rdquo;, &ldquo;graph&rdquo;).
        </p>
      )}

      {shown.map((g) => (
        <section key={g.id} id={`ch-${g.id}`} aria-labelledby={`ch-${g.id}-h`} className="mt-8 scroll-mt-12">
          <h2 id={`ch-${g.id}-h`} className="mb-3 text-lg font-bold">
            <span className="font-mono text-accent">{g.index}</span> · {g.title}
          </h2>
          <ul className="space-y-2">
            {g.items.map(({ it }) => (
              <li key={`${it.href}-${it.text}`} className="flex flex-col gap-1.5 rounded-lg border border-line p-3 sm:flex-row sm:items-start sm:gap-3">
                <div className="shrink-0 sm:w-56">
                  <span className="inline-block rounded-md bg-accent-soft px-2 py-0.5 font-mono text-sm font-semibold text-accent" dangerouslySetInnerHTML={{ __html: it.keyword }} />
                </div>
                <div className="min-w-0 flex-1 text-[15px]">
                  <span dangerouslySetInnerHTML={{ __html: it.think }} />
                  <Link href={it.href} className="mt-1 block w-fit text-sm text-accent hover:underline">
                    → {it.topic}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
