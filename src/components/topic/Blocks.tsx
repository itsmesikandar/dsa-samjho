import Link from 'next/link';
import type { CodeViews } from '@/lib/codefile';
import type { Example, Topic } from '@/lib/schema';
import type { NavTopic } from '@/lib/content';
import { VizPlayer } from '@/components/viz/engine/VizPlayer';
import { Inline, LevelBadge, Md } from './Basics';

export function OpsTable({ ops }: { ops: Topic['operations'] }) {
  return (
    <>
      <div className="table-wrap hidden sm:block">
        <table className="w-full text-sm">
          <thead className="bg-card text-left">
            <tr>
              <th className="px-3 py-2 font-semibold">Operation</th>
              <th className="px-3 py-2 font-semibold">Time</th>
              <th className="px-3 py-2 font-semibold">Space</th>
              <th className="px-3 py-2 font-semibold">Kyun?</th>
            </tr>
          </thead>
          <tbody>
            {ops.map((o) => (
              <tr key={o.op} className="border-t border-line align-top">
                <td className="px-3 py-2 font-medium">
                  <Inline src={o.op} />
                </td>
                <td className="px-3 py-2 font-mono font-semibold whitespace-nowrap text-accent">{o.time}</td>
                <td className="px-3 py-2 font-mono whitespace-nowrap">{o.space}</td>
                <td className="px-3 py-2 text-muted">
                  <Inline src={o.why} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 sm:hidden">
        {ops.map((o) => (
          <li key={o.op} className="rounded-lg border border-line p-3">
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0 flex-1 font-medium [overflow-wrap:anywhere]">
                <Inline src={o.op} />
              </span>
              <span className="max-w-[45%] shrink-0 text-right font-mono text-sm [overflow-wrap:anywhere]">
                <span className="font-semibold text-accent">{o.time}</span>
                <span className="block text-xs text-muted">space {o.space}</span>
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              <Inline src={o.why} />
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ExampleCard({ ex, n, topicKey, code }: { ex: Example; n: number; topicKey: string; code: CodeViews }) {
  return (
    <article id={`ex-${ex.id}`} className="rounded-xl border border-line p-4 sm:p-5">
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted">Example {n}</span>
        <LevelBadge level={ex.level} />
        {ex.source && (
          <span className="text-xs text-muted">
            ({ex.source.url ? (
              <a href={ex.source.url} target="_blank" rel="noopener noreferrer" className="underline">
                {ex.source.platform}: {ex.source.name}
              </a>
            ) : (
              `${ex.source.platform}: ${ex.source.name}`
            )}
            )
          </span>
        )}
        <h3 className="w-full text-lg font-bold">
          <Inline src={ex.title} />
        </h3>
      </header>
      <div className="space-y-4">
        <div>
          <h4 className="mb-1 text-sm font-bold tracking-wide text-muted uppercase">Problem</h4>
          <Md src={ex.problem} />
        </div>
        <div className="callout callout-socho">
          <div className="callout-title">Pehle dimaag mein kya aana chahiye</div>
          <Md src={ex.intuition} />
        </div>
        <details className="rounded-lg border border-line">
          <summary className="summary-caret cursor-pointer px-3 py-2 text-sm font-semibold">Dry run table dekho</summary>
          <div className="border-t border-line p-3">
            <Md src={ex.dryRun} />
          </div>
        </details>
        <VizPlayer topicKey={topicKey} tracer={ex.viz.tracer} title={`Animation: ${ex.title.replace(/`/g, '')}`} code={code} />
        <div className="flex flex-wrap gap-x-6 gap-y-1 rounded-lg bg-card px-3 py-2 text-sm">
          <span>
            Time: <b className="font-mono text-accent">{ex.complexity.time}</b>
          </span>
          <span>
            Space: <b className="font-mono text-accent">{ex.complexity.space}</b>
          </span>
          <span className="w-full text-muted">
            <Inline src={ex.complexity.why} />
          </span>
        </div>
      </div>
    </article>
  );
}

export function WhenToUse({ when }: { when: Topic['when'] }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line p-3">
          <h3 className="mb-2 font-bold text-green-700 dark:text-green-400">✓ Use karo jab…</h3>
          <ul className="space-y-1.5 text-[15px]">
            {when.use.map((u) => (
              <li key={u} className="flex gap-2">
                <span className="text-green-600">•</span>
                <Inline src={u} />
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-line p-3">
          <h3 className="mb-2 font-bold text-red-700 dark:text-red-400">✗ Mat use karo jab…</h3>
          <ul className="space-y-1.5 text-[15px]">
            {when.avoid.map((u) => (
              <li key={u} className="flex gap-2">
                <span className="text-red-600">•</span>
                <Inline src={u} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-bold">Pattern pehchano: question mein ye dikhe to…</h3>
        <ul className="space-y-2">
          {when.signals.map((s) => (
            <li key={s.keyword} className="flex flex-col gap-1 rounded-lg border border-line p-3 sm:flex-row sm:items-center sm:gap-3">
              <span className="w-fit rounded-md bg-accent-soft px-2 py-0.5 font-mono text-sm font-semibold text-accent">
                <Inline src={s.keyword} />
              </span>
              <span aria-hidden className="hidden text-muted sm:inline">
                →
              </span>
              <span className="text-[15px]">
                <Inline src={s.think} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function RealWorld({ items }: { items: Topic['realWorld'] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((r) => (
        <li key={r.where} className="rounded-lg border border-line p-3">
          <div className="font-bold">
            <Inline src={r.where} />
          </div>
          <p className="mt-1 text-[15px] text-muted">
            <Inline src={r.how} />
          </p>
        </li>
      ))}
    </ul>
  );
}

const MISTAKE_LABEL: Record<string, string> = {
  'off-by-one': 'off-by-one',
  null: 'null',
  empty: 'empty input',
  overflow: 'overflow',
  logic: 'logic',
  other: 'other',
};

export function Mistakes({ items }: { items: Topic['mistakes'] }) {
  return (
    <ul className="space-y-3">
      {items.map((m) => (
        <li key={m.title} className="rounded-lg border border-line p-3 sm:p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="tone tone-error rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase">{MISTAKE_LABEL[m.type]}</span>
            <h3 className="font-bold">
              <Inline src={m.title} />
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {m.wrong && (
              <div className="callout callout-galti">
                <div className="callout-title">✗ Galat</div>
                <Md src={m.wrong} />
              </div>
            )}
            <div className="callout callout-tip">
              <div className="callout-title">✓ Sahi</div>
              <Md src={m.right} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Interview({ data }: { data: Topic['interview'] }) {
  return (
    <>
      <p className="text-sm text-muted">Pehle khud jawab socho, phir tap karke dekho.</p>
      <ul className="space-y-2">
        {data.questions.map((q, i) => (
          <li key={q.q}>
            <details className="group rounded-lg border border-line">
              <summary className="flex cursor-pointer gap-2 px-3 py-2.5 font-semibold">
                <span className="font-mono text-sm text-accent">Q{i + 1}.</span>
                <span className="flex-1">
                  <Inline src={q.q} />
                  {q.followUp && <span className="tone tone-swap ml-2 rounded border px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase">follow-up</span>}
                </span>
                <span aria-hidden className="text-muted transition-transform group-open:rotate-90">
                  ▸
                </span>
              </summary>
              <div className="border-t border-line px-3 py-3">
                <Md src={q.a} />
              </div>
            </details>
          </li>
        ))}
      </ul>
      <div className="callout callout-tip">
        <div className="callout-title">Interviewer ye bhi pooch sakta hai</div>
        <ul className="list-disc space-y-1 pl-5">
          {data.mayAsk.map((x) => (
            <li key={x}>
              <Inline src={x} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Practice({ items }: { items: Topic['practice'] }) {
  const groups = (['easy', 'medium', 'hard'] as const).map((lvl) => ({ lvl, list: items.filter((p) => p.level === lvl) }));
  return (
    <div className="space-y-4">
      {groups.map(({ lvl, list }) => (
        <div key={lvl}>
          <div className="mb-2">
            <LevelBadge level={lvl} />
          </div>
          <ul className="space-y-2">
            {list.map((p) => (
              <li key={p.name} className="rounded-lg border border-line p-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline underline-offset-2">
                      {p.num ? `${p.num}. ` : ''}
                      {p.name}
                    </a>
                  ) : (
                    <span className="font-semibold">{p.name}</span>
                  )}
                  <span className="rounded bg-card px-1.5 py-0.5 text-[11px] text-muted">{p.platform}</span>
                  <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold text-accent">
                    <Inline src={p.pattern} />
                  </span>
                </div>
                <details className="mt-1.5">
                  <summary className="summary-caret cursor-pointer text-sm text-muted">Hint</summary>
                  <p className="mt-1 text-[15px]">
                    <Inline src={p.hint} />
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function TopicLink({ t, children }: { t: NavTopic | undefined; children?: React.ReactNode }) {
  if (!t) return null;
  return t.available ? (
    <Link href={t.href} className="font-semibold text-accent underline underline-offset-2">
      {children ?? t.title}
    </Link>
  ) : (
    <span className="font-semibold">
      {children ?? t.title} <span className="text-xs font-normal text-muted">(jaldi aa raha hai)</span>
    </span>
  );
}
