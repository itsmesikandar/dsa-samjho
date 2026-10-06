'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { norm, prefixMatch } from '@/lib/search';
import { JumpChips, StickyFilter } from '@/components/layout/StickyFilter';

export interface Term {
  term: string;
  slug: string;
  aka: string[];
  /** inline markdown se bana HTML (build time) */
  meaning: string;
  example?: string;
  topic?: { title: string; href: string };
  /** filter: term + aka (pehle), phir meaning */
  name: string;
  text: string;
}

const letterOf = (t: Term) => t.term[0].toUpperCase();

export function GlossaryList({ terms }: { terms: Term[] }) {
  const [q, setQ] = useState('');
  const prepared = useMemo(() => terms.map((t) => ({ t, nameWords: t.name.split(' '), words: t.text.split(' ') })), [terms]);
  const words = norm(q).split(' ').filter(Boolean);
  // naam mein mila to upar, sirf matlab mein mila to baad mein
  const shown = words.length
    ? [...prepared.filter((x) => prefixMatch(words, x.nameWords)), ...prepared.filter((x) => !prefixMatch(words, x.nameWords) && prefixMatch(words, x.words))].map((x) => x.t)
    : terms;
  const groups = words.length ? [{ letter: '', items: shown }] : [...new Set(terms.map(letterOf))].map((letter) => ({ letter, items: terms.filter((t) => letterOf(t) === letter) }));

  return (
    <>
      <StickyFilter
        id="glossary-filter"
        value={q}
        onChange={setQ}
        label="Shabd dhoondho"
        placeholder="Word likho (jaise amortized, stable)"
        status={words.length ? `${shown.length} / ${terms.length} shabd mile` : `${terms.length} shabd`}
      />
      {!words.length && <JumpChips label="Letters" items={groups.map((g) => ({ href: `#letter-${g.letter}`, text: g.letter }))} />}

      {shown.length === 0 && (
        <p className="mt-10 text-center text-muted">
          &ldquo;{q}&rdquo; nahi mila. Search (Ctrl K) mein bhi try karo — topics aur problems wahan milte hain.
        </p>
      )}

      {groups.map((g) => (
        <section key={g.letter || 'results'} id={g.letter ? `letter-${g.letter}` : undefined} aria-label={g.letter || 'Results'} className="mt-8 scroll-mt-12">
          {g.letter && <h2 className="mb-3 font-mono text-2xl font-bold text-accent">{g.letter}</h2>}
          <div className="space-y-2">
            {g.items.map((t) => (
              <article key={t.slug} id={t.slug} className="scroll-mt-12 rounded-lg border border-line p-3 target:border-accent target:bg-accent-soft">
                <h3 className="font-bold">
                  {t.term}
                  {t.aka.length > 0 && <span className="ml-2 text-sm font-normal text-muted">({t.aka.join(', ')})</span>}
                </h3>
                <p className="mt-1 text-[15px]" dangerouslySetInnerHTML={{ __html: t.meaning }} />
                {t.example && (
                  <p className="mt-1 text-sm text-muted">
                    <span className="font-semibold">Jaise: </span>
                    <span dangerouslySetInnerHTML={{ __html: t.example }} />
                  </p>
                )}
                {t.topic && (
                  <Link href={t.topic.href} className="mt-1 block w-fit text-sm text-accent hover:underline">
                    → {t.topic.title}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
