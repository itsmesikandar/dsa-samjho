'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { LazyMotion, MotionConfig } from 'motion/react';
import type { NavChapter } from '@/lib/content';
import { Sidebar } from './Sidebar';
import { Search } from './Search';
import { LangToggle, ThemeToggle } from './Toggles';

const loadFeatures = () => import('@/components/viz/engine/motion-features').then((r) => r.default);

export function AppShell({ nav, children }: { nav: NavChapter[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.35, ease: 'easeInOut' }}>
        <header className="sticky top-0 z-30 h-14 border-b border-line bg-bg/90 backdrop-blur">
          <div className="mx-auto flex h-full max-w-[96rem] items-center gap-1.5 px-2.5 sm:gap-2 sm:px-4">
            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-card lg:hidden"
              aria-label="Chapters menu kholo"
            >
              <svg aria-hidden viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight whitespace-nowrap">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm text-accent-fg">{'{}'}</span>
              <span>
                DSA <span className="text-accent">Samjho</span>
              </span>
            </Link>
            <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
              <Search />
              <LangToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="mx-auto flex max-w-[96rem]">
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-line lg:block">
            <Sidebar nav={nav} />
          </aside>
          {open && (
            <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Chapters">
              <div className="absolute inset-0 bg-black/45" onClick={close} />
              <aside className="absolute top-0 left-0 h-full w-[86%] max-w-80 overflow-y-auto bg-bg shadow-2xl">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <span className="font-semibold">Chapters</span>
                  <button onClick={close} className="rounded-md px-2 py-1 text-sm text-muted hover:bg-card" aria-label="Band karo">
                    ✕
                  </button>
                </div>
                <Sidebar nav={nav} onNavigate={close} />
              </aside>
            </div>
          )}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
