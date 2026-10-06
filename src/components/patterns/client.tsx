'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { norm, prefixMatch } from '@/lib/search';
import { JumpChips, StickyFilter } from '@/components/layout/StickyFilter';

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

/** signals list + filter (har typed word kisi word ki shuruaat ho) */
export function PatternList({ groups }: { groups: PatternGroup[] }) {
  const [q, setQ] = useState('');
  const prepared = useMemo(() => groups.map((g) => ({ ...g, items: g.items.map((it) => ({ it, words: it.text.split(' ') })) })), [groups]);
  const words = norm(q).split(' ').filter(Boolean);
  const shown = prepared
    .map((g) => ({ ...g, items: words.length ? g.items.filter((x) => prefixMatch(words, x.words)) : g.items }))
    .filter((g) => g.items.length);
  const total = prepared.reduce((s, g) => s + g.items.length, 0);
  const count = shown.reduce((s, g) => s + g.items.length, 0);

  return (
    <>
      <StickyFilter
        id="pattern-filter"
        value={q}
        onChange={setQ}
        label="Keyword se filter karo"
        placeholder="Keyword likho (jaise subarray, sorted)"
        status={words.length ? `${count} / ${total} signals mile` : `${total} signals, ${groups.length} chapters`}
      />
      <JumpChips label="Chapters" items={shown.map((g) => ({ href: `#ch-${g.id}`, text: `${g.index}. ${g.title}` }))} />

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
