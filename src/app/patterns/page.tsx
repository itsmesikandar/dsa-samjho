import type { Metadata } from 'next';
import { getNav, getTopic } from '@/lib/content';
import { renderInline } from '@/lib/markdown';
import { norm, plain } from '@/lib/search';
import { PatternList, type PatternGroup } from '@/components/patterns/client';

export const metadata: Metadata = {
  title: 'Patterns',
  description: 'Question mein ye keyword dikhe to ye pattern socho — saare topics ke signals ek jagah.',
};

export default function PatternsPage() {
  const groups: PatternGroup[] = getNav()
    .map((c) => ({
      id: c.id,
      index: c.index,
      title: c.title,
      items: c.topics
        .filter((t) => t.available)
        .flatMap((t) => {
          const topic = getTopic(c.id, t.id);
          return topic.when.signals.map((s) => ({
            keyword: renderInline(s.keyword),
            think: renderInline(s.think),
            topic: topic.meta.title,
            href: `${t.href}#kab`,
            text: norm(`${plain(s.keyword)} ${plain(s.think)} ${topic.meta.title}`),
          }));
        }),
    }))
    .filter((g) => g.items.length);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="font-mono text-sm text-accent">Pattern pehchano</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Question mein ye dikhe → ye socho</h1>
      <p className="mt-3 text-lg text-muted">
        Interview ka sawaal padhte hi in keywords ko dhoondo. Har topic ke &ldquo;Kab use karein&rdquo; section ke signals yahan ek jagah hain.
      </p>
      <ol className="mt-4 list-decimal space-y-1 pl-5 text-[15px]">
        <li>Sawaal mein se keyword chuno (jaise &ldquo;subarray&rdquo;, &ldquo;minimum&rdquo;, &ldquo;sorted&rdquo;) aur neeche filter mein likho.</li>
        <li>Ek se zyada pattern mile to sabse khaas (specific) wala pehle socho.</li>
        <li>Topic par jaake template aur galtiyan dekho.</li>
      </ol>
      <div className="mt-6">
        <PatternList groups={groups} />
      </div>
    </div>
  );
}
