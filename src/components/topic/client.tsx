'use client';

import { useEffect, useState } from 'react';
import { bookmarkStore, doneStore, lastStore, saveQuizScore, toggleBookmark, toggleDone, useStore } from '@/lib/storage';
import { SECTIONS } from './sections';

export function TopicActions({ id, big = false }: { id: string; big?: boolean }) {
  const done = useStore(doneStore)[id];
  const marked = useStore(bookmarkStore).includes(id);
  if (big) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-line bg-card p-5 text-center">
        <p className="font-semibold">{done ? 'Shabash! Ye topic complete hai.' : 'Topic samajh aa gaya? Complete mark karo.'}</p>
        <button
          onClick={() => toggleDone(id)}
          className={`rounded-lg px-5 py-2.5 font-semibold ${done ? 'border border-line bg-bg' : 'bg-accent text-accent-fg hover:opacity-90'}`}
        >
          {done ? '✓ Complete (undo)' : 'Mark complete ✓'}
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => toggleDone(id)}
        aria-pressed={!!done}
        className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
          done ? 'tone tone-done' : 'border-line hover:border-accent'
        }`}
      >
        {done ? '✓ Complete' : 'Mark complete'}
      </button>
      <button
        onClick={() => toggleBookmark(id)}
        aria-pressed={marked}
        className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${marked ? 'tone tone-found' : 'border-line hover:border-accent'}`}
      >
        {marked ? '★ Bookmarked' : '☆ Bookmark'}
      </button>
    </div>
  );
}

export function TrackVisit({ href }: { href: string }) {
  useEffect(() => lastStore.write(href), [href]);
  return null;
}

/** #anchor wale link se aaye: browser pehle hi scroll kar deta hai, phir players bante hain aur upar ka
 *  content lamba ho jaata hai. Layout settle hone tak (max 3s) target ko upar hi rakho — user khud scroll kare to ruk jao. */
export function HashScroll() {
  useEffect(() => {
    let stopped = false;
    let ro: ResizeObserver | undefined;
    const stop = () => {
      stopped = true;
      ro?.disconnect();
    };
    const userEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;
    // client navigation mein URL (hash) is effect ke baad update hota hai — ek frame ruko
    const raf = requestAnimationFrame(() => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id || stopped) return;
      ro = new ResizeObserver(() => !stopped && document.getElementById(id)?.scrollIntoView({ block: 'start' }));
      ro.observe(document.body);
      userEvents.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }));
    });
    const t = setTimeout(stop, 3000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      stop();
      userEvents.forEach((e) => window.removeEventListener(e, stop));
    };
  }, []);
  return null;
}

function useActiveSection(): string {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-110px 0px -60% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Toc() {
  const active = useActiveSection();
  return (
    <nav aria-label="Is page par" className="text-sm">
      <div className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Is page par</div>
      <ul className="space-y-0.5 border-l border-line">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`-ml-px block border-l-2 py-1 pl-3 ${
                active === s.id ? 'border-accent font-semibold text-accent' : 'border-transparent text-muted hover:text-fg'
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SectionJump() {
  const active = useActiveSection();
  return (
    <div className="sticky top-14 z-20 -mx-4 border-b border-line bg-bg/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 xl:hidden">
      <label className="flex items-center gap-2 text-sm">
        <span className="shrink-0 text-muted">Section:</span>
        <select
          value={active}
          onChange={(e) => document.getElementById(e.target.value)?.scrollIntoView({ behavior: 'smooth' })}
          className="min-w-0 flex-1 rounded-md border border-line bg-bg px-2 py-1.5 text-sm"
        >
          {SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.n}. {s.title}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export interface QuizItem {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export function Quiz({ id, items }: { id: string; items: QuizItem[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => items.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const score = picked.filter((p, i) => p === items[i].answer).length;
  const finished = answered === items.length;

  useEffect(() => {
    if (finished) saveQuizScore(id, score);
  }, [finished, id, score]);

  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const p = picked[i];
        return (
          <fieldset key={i} className="rounded-lg border border-line p-3">
            <legend className="sr-only">Question {i + 1}</legend>
            <p className="mb-2 font-semibold">
              <span className="mr-1 font-mono text-sm text-accent">{i + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: it.q }} />
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {it.options.map((o, j) => {
                const state = p === null ? '' : j === it.answer ? 'tone tone-done' : j === p ? 'tone tone-error' : 'opacity-60';
                return (
                  <button
                    key={j}
                    disabled={p !== null}
                    onClick={() => setPicked((prev) => prev.map((x, k) => (k === i ? j : x)))}
                    className={`rounded-md border border-line px-3 py-2 text-left text-[15px] ${state} ${p === null ? 'hover:border-accent' : ''}`}
                  >
                    <span className="mr-2 font-mono text-xs text-muted">{String.fromCharCode(65 + j)}</span>
                    <span dangerouslySetInnerHTML={{ __html: o }} />
                  </button>
                );
              })}
            </div>
            {p !== null && (
              <p className="mt-2 text-sm">
                <b>{p === it.answer ? 'Sahi! ' : 'Galat. '}</b>
                <span dangerouslySetInnerHTML={{ __html: it.explain }} />
              </p>
            )}
          </fieldset>
        );
      })}
      {finished && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-accent-soft px-3 py-2">
          <span className="font-semibold">
            Score: {score}/{items.length} {score === items.length ? '— ekdum perfect!' : score >= 3 ? '— accha hai!' : '— ek baar topic dobara padho.'}
          </span>
          <button onClick={() => setPicked(items.map(() => null))} className="rounded-md border border-line bg-bg px-3 py-1 text-sm">
            Dobara karo
          </button>
        </div>
      )}
    </div>
  );
}
