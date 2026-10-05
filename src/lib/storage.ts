'use client';

import { useSyncExternalStore } from 'react';
import type { Lang } from './codefile';

interface Store<T> {
  read(): T;
  write(v: T): void;
  subscribe(cb: () => void): () => void;
  fallback: T;
}

function createStore<T>(key: string, fallback: T, valid: (v: unknown) => boolean): Store<T> {
  let cache: T | undefined;
  const subs = new Set<() => void>();
  const load = (): T => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const v: unknown = JSON.parse(raw);
        if (valid(v)) return v as T;
      }
    } catch {
      /* private mode / blocked storage: use fallback */
    }
    return fallback;
  };
  return {
    fallback,
    read: () => (cache ??= load()),
    write(v) {
      cache = v;
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        /* storage full or blocked: keep in memory only */
      }
      subs.forEach((cb) => cb());
    },
    subscribe(cb) {
      subs.add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cache = undefined;
          cb();
        }
      };
      window.addEventListener('storage', onStorage);
      return () => {
        subs.delete(cb);
        window.removeEventListener('storage', onStorage);
      };
    },
  };
}

const isObj = (v: unknown) => typeof v === 'object' && v !== null && !Array.isArray(v);

export const langStore = createStore<Lang>('dsa.lang', 'kotlin', (v) => v === 'kotlin' || v === 'java');
/** topicId → ISO date when marked complete */
export const doneStore = createStore<Record<string, string>>('dsa.done', {}, isObj);
export const bookmarkStore = createStore<string[]>('dsa.bookmarks', [], Array.isArray);
/** topicId → best quiz score */
export const quizStore = createStore<Record<string, number>>('dsa.quiz', {}, isObj);
/** last visited topic href */
export const lastStore = createStore<string | null>('dsa.last', null, (v) => typeof v === 'string');

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.read, () => store.fallback);
}

export const useLang = () => useStore(langStore);
export const setLang = (l: Lang) => langStore.write(l);

export function toggleDone(id: string) {
  const cur = { ...doneStore.read() };
  if (cur[id]) delete cur[id];
  else cur[id] = new Date().toISOString();
  doneStore.write(cur);
}

export function toggleBookmark(id: string) {
  const cur = bookmarkStore.read();
  bookmarkStore.write(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
}

export function saveQuizScore(id: string, score: number) {
  const cur = quizStore.read();
  if ((cur[id] ?? -1) < score) quizStore.write({ ...cur, [id]: score });
}
