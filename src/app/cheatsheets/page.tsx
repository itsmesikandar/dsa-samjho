import type { Metadata } from 'next';
import Link from 'next/link';
import { getCheatsheets, getNav, getTopic } from '@/lib/content';
import { Inline, Md } from '@/components/topic/Basics';

export const metadata: Metadata = {
  title: 'Cheatsheets',
  description: 'Big-O, constraints, data structures, sorting, Kotlin vs Java collections — aur har topic ki cheat-sheet ek jagah.',
};

const chip = 'rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent';

export default function CheatsheetsPage() {
  const sheets = getCheatsheets();
  const chapters = getNav()
    .map((c) => ({
      ...c,
      topics: c.topics.filter((t) => t.available).map((t) => ({ nav: t, rev: getTopic(c.id, t.id).revision })),
    }))
    .filter((c) => c.topics.length);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="font-mono text-sm text-accent">Cheatsheets</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Ek page, saari zaroori baatein</h1>
      <p className="mt-3 text-lg text-muted">Interview se pehle ka revision — complexity tables, Kotlin / Java collections, aur har topic ki chhoti cheat-sheet.</p>

      <nav aria-label="Is page par" className="mt-5 flex flex-wrap gap-1.5">
        {sheets.map((s) => (
          <a key={s.id} href={`#cs-${s.id}`} className={chip}>
            {s.title.split(' — ')[0]}
          </a>
        ))}
        <a href="#topics" className={chip}>
          Har topic ki cheat-sheet
        </a>
      </nav>

      {sheets.map((s) => (
        <section key={s.id} id={`cs-${s.id}`} aria-labelledby={`cs-${s.id}-h`} className="mt-10">
          <h2 id={`cs-${s.id}-h`} className="text-2xl font-bold">
            {s.title}
          </h2>
          {s.intro && <p className="mt-1 text-muted">{s.intro}</p>}
          <Md src={s.body} className="mt-4" />
        </section>
      ))}

      <section id="topics" aria-labelledby="topics-h" className="mt-12">
        <h2 id="topics-h" className="text-2xl font-bold">
          Har topic ki cheat-sheet
        </h2>
        <p className="mt-1 text-muted">Chapter kholo — har topic ke 5 point aur code ka saar. Poora samajhna ho to topic par jao.</p>
        <div className="mt-4 space-y-3">
          {chapters.map((c) => (
            <details key={c.id} className="group rounded-xl border border-line">
              <summary className="flex cursor-pointer items-center gap-3 px-4 py-3 font-semibold">
                <span className="font-mono text-accent">{c.index}</span>
                <span className="flex-1">{c.title}</span>
                <span className="text-xs font-normal text-muted">{c.topics.length} topics</span>
                <span aria-hidden className="text-muted transition-transform group-open:rotate-90">
                  ▸
                </span>
              </summary>
              <div className="space-y-6 border-t border-line px-4 py-4">
                {c.topics.map(({ nav, rev }) => (
                  <div key={nav.id}>
                    <Link href={nav.href} className="text-lg font-bold text-accent hover:underline">
                      {nav.title} →
                    </Link>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">
                      {rev.summary.map((s) => (
                        <li key={s}>
                          <Inline src={s} />
                        </li>
                      ))}
                    </ul>
                    <Md src={rev.cheatsheet} className="mt-3" />
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
