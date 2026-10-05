'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { NavChapter } from '@/lib/content';
import { doneStore, useStore } from '@/lib/storage';

export function Sidebar({ nav, onNavigate }: { nav: NavChapter[]; onNavigate?: () => void }) {
  const path = usePathname();
  const done = useStore(doneStore);
  const total = nav.reduce((s, c) => s + c.topics.length, 0);
  const doneCount = nav.reduce((s, c) => s + c.topics.filter((t) => done[t.id]).length, 0);
  const currentChapter = nav.find((c) => path?.startsWith(c.href))?.id;
  const [openSet, setOpenSet] = useState<Set<string>>(() => new Set([currentChapter ?? nav[0]?.id]));
  const [seenChapter, setSeenChapter] = useState(currentChapter);
  if (currentChapter !== seenChapter) {
    setSeenChapter(currentChapter);
    if (currentChapter && !openSet.has(currentChapter)) setOpenSet(new Set(openSet).add(currentChapter));
  }
  const toggle = (id: string) => {
    const s = new Set(openSet);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setOpenSet(s);
  };

  return (
    <nav aria-label="Chapters" className="px-3 py-4 text-sm">
      <div className="mb-4 px-2">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>Tumhari progress</span>
          <span className="font-mono">
            {doneCount}/{total}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-card">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(doneCount / Math.max(1, total)) * 100}%` }} />
        </div>
      </div>
      <ul className="space-y-0.5">
        {nav.map((c) => {
          const cDone = c.topics.filter((t) => done[t.id]).length;
          const open = openSet.has(c.id);
          return (
            <li key={c.id}>
              <button
                onClick={() => toggle(c.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-card"
              >
                <span className="w-5 shrink-0 font-mono text-xs text-muted">{c.index}</span>
                <span className="min-w-0 flex-1 font-semibold">{c.title}</span>
                <span className="font-mono text-[11px] text-muted">
                  {cDone}/{c.topics.length}
                </span>
                <span aria-hidden className={`text-xs text-muted transition-transform ${open ? 'rotate-90' : ''}`}>
                  ▸
                </span>
              </button>
              {open && (
                <ul className="mt-0.5 mb-2 ml-4 space-y-0.5 border-l border-line pl-2">
                  <li>
                    <Link href={c.href} onClick={onNavigate} className={`block rounded-md px-2 py-1.5 text-xs ${path === c.href ? 'text-accent' : 'text-muted hover:text-fg'}`}>
                      Chapter overview
                    </Link>
                  </li>
                  {c.topics.map((t) => {
                    const active = path === t.href;
                    const mark = done[t.id] ? '✓' : '';
                    return (
                      <li key={t.id}>
                        {t.available ? (
                          <Link
                            href={t.href}
                            onClick={onNavigate}
                            aria-current={active ? 'page' : undefined}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                              active ? 'bg-accent-soft font-semibold text-accent' : 'hover:bg-card'
                            }`}
                          >
                            <span className="min-w-0 flex-1">{t.title}</span>
                            {mark && <span className="text-xs text-green-600 dark:text-green-400">{mark}</span>}
                          </Link>
                        ) : (
                          <span className="flex items-center gap-2 px-2 py-1.5 text-muted/70">
                            <span className="min-w-0 flex-1">{t.title}</span>
                            <span className="text-[10px]">jaldi</span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-6 space-y-0.5 border-t border-line pt-4">
        <Link href="/bookmarks/" onClick={onNavigate} className="block rounded-md px-2 py-1.5 text-muted hover:bg-card hover:text-fg">
          ★ Bookmarks
        </Link>
        <Link href="/playground/" onClick={onNavigate} className="block rounded-md px-2 py-1.5 text-muted hover:bg-card hover:text-fg">
          Visualizer playground
        </Link>
      </div>
    </nav>
  );
}
