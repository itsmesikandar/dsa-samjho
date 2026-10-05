import type { Metadata } from 'next';
import { allTopics, getNav } from '@/lib/content';
import { BookmarkList } from '@/components/home/client';

export const metadata: Metadata = { title: 'Bookmarks' };

export default function BookmarksPage() {
  const chapterTitle = Object.fromEntries(getNav().map((c) => [c.id, c.title]));
  const topics = allTopics()
    .filter((t) => t.available)
    .map((t) => ({ id: t.id, title: t.title, href: t.href, chapter: chapterTitle[t.chapter] }));
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">★ Bookmarks</h1>
      <BookmarkList topics={topics} />
    </div>
  );
}
