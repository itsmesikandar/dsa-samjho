'use client';

import Link from 'next/link';
import { bookmarkStore, doneStore, lastStore, useStore } from '@/lib/storage';

export function ContinueCard({ titles }: { titles: Record<string, string> }) {
  const last = useStore(lastStore);
  if (!last || !titles[last]) return null;
  return (
    <Link href={last} className="block rounded-xl border border-accent bg-accent-soft p-4 hover:opacity-90">
      <div className="text-xs font-semibold tracking-wide text-accent uppercase">Wahin se continue karo</div>
      <div className="mt-0.5 text-lg font-bold">{titles[last]} →</div>
    </Link>
  );
}

export function ChapterProgress({ ids }: { ids: string[] }) {
  const done = useStore(doneStore);
  const n = ids.filter((id) => done[id]).length;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-card">
        <div className="h-full rounded-full bg-accent" style={{ width: `${(n / Math.max(1, ids.length)) * 100}%` }} />
      </div>
      <span className="font-mono text-[11px] text-muted">
        {n}/{ids.length}
      </span>
    </div>
  );
}

export function DoneTick({ id }: { id: string }) {
  const done = useStore(doneStore)[id];
  return done ? <span className="text-green-600 dark:text-green-400">✓</span> : null;
}

export function BookmarkList({ topics }: { topics: { id: string; title: string; href: string; chapter: string }[] }) {
  const ids = useStore(bookmarkStore);
  const list = ids.map((id) => topics.find((t) => t.id === id)).filter((t) => !!t);
  if (list.length === 0) {
    return <p className="text-muted">Abhi koi bookmark nahi hai. Kisi bhi topic par &quot;☆ Bookmark&quot; dabao, wo yahan dikhega.</p>;
  }
  return (
    <ul className="space-y-2">
      {list.map((t) => (
        <li key={t.id}>
          <Link href={t.href} className="block rounded-lg border border-line p-3 hover:border-accent">
            <div className="font-semibold">{t.title}</div>
            <div className="text-xs text-muted">{t.chapter}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
