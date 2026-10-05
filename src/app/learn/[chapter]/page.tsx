import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNav } from '@/lib/content';
import { ChapterProgress, DoneTick } from '@/components/home/client';

type Params = { params: Promise<{ chapter: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getNav().map((c) => ({ chapter: c.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { chapter } = await params;
  const c = getNav().find((x) => x.id === chapter);
  return { title: c ? `${c.index}. ${c.title}` : 'Chapter', description: c?.subtitle };
}

export default async function ChapterPage({ params }: Params) {
  const { chapter } = await params;
  const nav = getNav();
  const c = nav.find((x) => x.id === chapter);
  if (!c) notFound();
  const prev = nav[c.index - 1];
  const next = nav[c.index + 1];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="font-mono text-sm text-accent">Chapter {c.index}</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{c.title}</h1>
      <p className="mt-2 text-lg text-muted">{c.subtitle}</p>
      <div className="mt-4 max-w-sm">
        <ChapterProgress ids={c.topics.map((t) => t.id)} />
      </div>
      <ol className="mt-8 space-y-2">
        {c.topics.map((t, i) => (
          <li key={t.id}>
            {t.available ? (
              <Link href={t.href} className="flex items-center gap-3 rounded-xl border border-line p-4 hover:border-accent">
                <span className="font-mono text-sm text-muted">
                  {c.index}.{i + 1}
                </span>
                <span className="flex-1 font-semibold">{t.title}</span>
                <DoneTick id={t.id} />
                <span aria-hidden className="text-muted">
                  →
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-line p-4 text-muted">
                <span className="font-mono text-sm">
                  {c.index}.{i + 1}
                </span>
                <span className="flex-1">{t.title}</span>
                <span className="text-xs">jaldi aa raha hai</span>
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-10 flex justify-between gap-3 text-sm">
        {prev ? (
          <Link href={prev.href} className="text-accent">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={next.href} className="text-accent">
            {next.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
