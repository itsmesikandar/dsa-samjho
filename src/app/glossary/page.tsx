import type { Metadata } from 'next';
import { findTopic, getGlossary, termSlug } from '@/lib/content';
import { renderInline } from '@/lib/markdown';
import { norm, plain } from '@/lib/search';
import { GlossaryList, type Term } from '@/components/glossary/client';

export const metadata: Metadata = {
  title: 'Glossary',
  description: 'DSA ke English words ka simple Hinglish matlab — amortized, contiguous, traverse aur aur bhi.',
};

export default function GlossaryPage() {
  const terms: Term[] = getGlossary()
    .slice()
    .sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }))
    .map((g) => {
      const t = g.topic ? findTopic(g.topic) : undefined;
      const aka = g.aka ?? [];
      return {
        term: g.term,
        slug: termSlug(g.term),
        aka,
        meaning: renderInline(g.meaning),
        example: g.example ? renderInline(g.example) : undefined,
        topic: t ? { title: t.title, href: t.href } : undefined,
        name: norm(`${g.term} ${aka.join(' ')}`),
        text: norm(`${g.term} ${aka.join(' ')} ${plain(g.meaning)} ${plain(g.example ?? '')}`),
      };
    });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="font-mono text-sm text-accent">Glossary</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">English shabd, simple matlab</h1>
      <p className="mt-3 text-lg text-muted">
        DSA ki kitaabon aur interviews mein aane wale English words — har ek ka chhota Hinglish matlab, aur kis topic mein achhe se samjhaaya hai.
      </p>
      <div className="mt-6">
        <GlossaryList terms={terms} />
      </div>
    </div>
  );
}
