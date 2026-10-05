import type { Metadata } from 'next';
import Link from 'next/link';
import { allTopics, findTopic, getNav, getTopic, neighbours } from '@/lib/content';
import { getCodeViews } from '@/lib/highlight';
import { renderInline } from '@/lib/markdown';
import type { CodeViews } from '@/lib/codefile';
import { VizPlayer } from '@/components/viz/engine/VizPlayer';
import { CodePane } from '@/components/code/CodePane';
import { Inline, LevelBadge, Md, Section } from '@/components/topic/Basics';
import { ExampleCard, Interview, Mistakes, OpsTable, Practice, RealWorld, TopicLink, WhenToUse } from '@/components/topic/Blocks';
import { Quiz, SectionJump, Toc, TopicActions, TrackVisit } from '@/components/topic/client';

type Params = { params: Promise<{ chapter: string; topic: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allTopics()
    .filter((t) => t.available)
    .map((t) => ({ chapter: t.chapter, topic: t.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { chapter, topic } = await params;
  const t = getTopic(chapter, topic);
  return { title: t.meta.title, description: t.meta.subtitle };
}

export default async function TopicPage({ params }: Params) {
  const { chapter, topic } = await params;
  const t = getTopic(chapter, topic);
  const key = `${chapter}/${topic}`;
  const ch = getNav().find((c) => c.id === chapter)!;
  const { prev, next } = neighbours(topic);

  const refs = [...new Set([t.how.code, ...t.code.map((c) => c.file), ...t.examples.map((e) => e.code)])];
  const views: Record<string, CodeViews> = Object.fromEntries(
    await Promise.all(refs.map(async (r) => [r, await getCodeViews(chapter, topic, r)] as const)),
  );
  const quiz = t.revision.quiz.map((q) => ({
    q: renderInline(q.q),
    options: q.options.map((o) => renderInline(o)),
    answer: q.answer,
    explain: renderInline(q.explain),
  }));

  return (
    <div className="flex">
      <article className="mx-auto w-full max-w-3xl min-w-0 px-4 pb-16 sm:px-6">
        <SectionJump />
        <header className="pt-6 pb-6">
          <Link href={ch.href} className="font-mono text-sm text-accent hover:underline">
            Chapter {ch.index} · {ch.title}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.meta.title}</h1>
          <p className="mt-2 text-lg text-muted">
            <Inline src={t.meta.subtitle} />
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <LevelBadge level={t.meta.level} />
            <span className="text-muted">~{t.meta.minutes} min</span>
            {t.meta.tags.map((tag) => (
              <span key={tag} className="rounded bg-card px-1.5 py-0.5 font-mono text-xs text-muted">
                #{tag}
              </span>
            ))}
          </div>
          {t.meta.prereqs.length > 0 && (
            <p className="mt-3 text-sm">
              <span className="text-muted">Pehle ye padh lo: </span>
              {t.meta.prereqs.map((id, i) => (
                <span key={id}>
                  {i > 0 && ', '}
                  <TopicLink t={findTopic(id)} />
                </span>
              ))}
            </p>
          )}
          <div className="mt-4">
            <TopicActions id={t.meta.id} />
          </div>
        </header>

        <Section id="kya-hai">
          <Md src={t.what.body} />
          <div className="callout callout-analogy">
            <div className="callout-title">Real life mein socho</div>
            <Md src={t.what.analogy} />
          </div>
        </Section>

        <Section id="kyun">
          <Md src={t.why.body} />
        </Section>

        <Section id="dekho">
          <Md src={t.visual.body} />
          <VizPlayer topicKey={key} tracer={t.visual.viz.tracer} title="Visual intro" />
        </Section>

        <Section id="kaise">
          <Md src={t.how.body} />
          <VizPlayer topicKey={key} tracer={t.how.viz.tracer} title="Step-by-step animation" code={views[t.how.code]} />
        </Section>

        <Section id="operations">
          <OpsTable ops={t.operations} />
        </Section>

        <Section id="code">
          <p className="text-sm text-muted">Upar se Kotlin / Java chuno — choice yaad rakhi jaayegi.</p>
          {t.code.map((c) => (
            <div key={c.file} className="space-y-2">
              <h3 className="text-lg font-bold">
                <Inline src={c.title} />
              </h3>
              {c.note && <Md src={c.note} />}
              <CodePane views={views[c.file]} maxHeight="34rem" />
            </div>
          ))}
        </Section>

        <Section id="examples">
          {t.examples.map((ex, i) => (
            <ExampleCard key={ex.id} ex={ex} n={i + 1} topicKey={key} code={views[ex.code]} />
          ))}
        </Section>

        <Section id="kab">
          <WhenToUse when={t.when} />
        </Section>

        <Section id="real-world">
          <RealWorld items={t.realWorld} />
        </Section>

        <Section id="galtiyan">
          <Mistakes items={t.mistakes} />
        </Section>

        <Section id="interview">
          <Interview data={t.interview} />
        </Section>

        <Section id="practice">
          <Practice items={t.practice} />
        </Section>

        <Section id="revision">
          <div className="rounded-xl border border-line p-4">
            <h3 className="mb-2 font-bold">5 line mein poora topic</h3>
            <ol className="list-decimal space-y-1 pl-5 text-[15px]">
              {t.revision.summary.map((s) => (
                <li key={s}>
                  <Inline src={s} />
                </li>
              ))}
            </ol>
          </div>
          <div className="callout callout-yaad">
            <div className="callout-title">Cheat sheet</div>
            <Md src={t.revision.cheatsheet} />
          </div>
          <h3 className="pt-2 font-bold">Quick quiz</h3>
          <Quiz id={t.meta.id} items={quiz} />
        </Section>

        <Section id="aage">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {prev && (
              <div className="rounded-xl border border-line p-3">
                <div className="text-xs text-muted">← Pichla topic</div>
                <TopicLink t={prev} />
              </div>
            )}
            {next && (
              <div className="rounded-xl border border-line p-3 sm:text-right">
                <div className="text-xs text-muted">Agla topic →</div>
                <TopicLink t={next} />
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-2 font-bold">Isse jude topics</h3>
            <ul className="space-y-1.5">
              {t.connections.related.map((r) => (
                <li key={r.id}>
                  <TopicLink t={findTopic(r.id)} /> — <Inline src={r.why} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-bold">Ye aage kahan kaam aayega</h3>
            <ul className="space-y-1.5">
              {t.connections.usedLater.map((r) => (
                <li key={r.id}>
                  <TopicLink t={findTopic(r.id)} /> — <Inline src={r.how} />
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <div className="mt-8">
          <TopicActions id={t.meta.id} big />
        </div>
        <TrackVisit href={`/learn/${chapter}/${topic}/`} />
      </article>
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pr-4 xl:block">
        <Toc />
      </aside>
    </div>
  );
}
