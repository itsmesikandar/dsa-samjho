'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KIND_LABEL, prepare, search, type Prepared, type SearchDoc } from '@/lib/search';

// index alag chunk mein hai — pehli baar search kholne (ya button par hover) par hi load hota hai
let indexPromise: Promise<Prepared[]> | null = null;
function loadIndex() {
  indexPromise ??= import('@/generated/search-index.json')
    .then((m) => prepare(m.default as SearchDoc[]))
    .catch((e: unknown) => {
      indexPromise = null;
      throw e;
    });
  return indexPromise;
}
const preload = () => void loadIndex().catch(() => {});

const SUGGEST = ['binary search', 'coin change', 'bfs', 'sliding window', 'LC 1143', 'trie'];

const isTyping = (el: EventTarget | null) => el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="shrink-0">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/** top bar ka button + Ctrl/⌘ K aur "/" shortcut */
export function Search() {
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const close = () => {
    setOpen(false);
    btn.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <button
        ref={btn}
        onClick={() => setOpen(true)}
        onPointerEnter={preload}
        onFocus={preload}
        aria-label="Search"
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K /"
        className="flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-line text-sm text-muted hover:border-accent hover:text-fg sm:w-52 sm:justify-start sm:px-2.5 md:w-64"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="ml-auto hidden rounded border border-line px-1.5 font-mono text-[11px] sm:inline">{mac ? '⌘' : 'Ctrl'} K</kbd>
      </button>
      {/* body mein portal — header ka backdrop-blur 'fixed' ko header ke andar hi band kar deta */}
      {open && createPortal(<SearchDialog onClose={close} />, document.body)}
    </>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const uid = useId();
  const listId = `${uid}-list`;
  const [q, setQ] = useState('');
  const [index, setIndex] = useState<Prepared[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
    loadIndex().then(setIndex, () => setFailed(true));
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const results = useMemo(() => (index ? search(index, q) : []), [index, q]);

  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const type = (v: string) => {
    setQ(v);
    setActive(0);
  };
  const go = (d: SearchDoc) => {
    onClose();
    router.push(d.h);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const n = results.length;
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown' && n) {
      e.preventDefault();
      setActive((a) => (a + 1) % n);
    } else if (e.key === 'ArrowUp' && n) {
      e.preventDefault();
      setActive((a) => (a - 1 + n) % n);
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Tab') {
      // focus input par hi rahe — results arrows se chalte hain
      e.preventDefault();
      input.current?.focus({ preventScroll: true });
    }
  };

  const status = failed ? 'Search load nahi hua' : !index ? 'Load ho raha hai' : q.trim() ? `${n(results.length)} results` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-[6dvh] sm:pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative flex max-h-[82dvh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-line bg-bg shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-3 text-muted">
          <SearchIcon />
          <input
            ref={input}
            value={q}
            onChange={(e) => type(e.target.value)}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results.length ? `${uid}-${active}` : undefined}
            aria-autocomplete="list"
            aria-label="Search"
            placeholder="Topic, problem ya pattern…"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-muted"
          />
          <button onClick={onClose} className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] hover:text-fg" aria-label="Search band karo">
            Esc
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain">
          {failed ? (
            <p className="px-4 py-8 text-center text-sm text-muted">Search load nahi hua. Page refresh karke phir try karo.</p>
          ) : !index ? (
            <p className="px-4 py-8 text-center text-sm text-muted">Load ho raha hai…</p>
          ) : !q.trim() ? (
            <div className="px-4 py-5">
              <p className="text-sm text-muted">Topic, example, LeetCode problem (naam ya number) — kuch bhi likho. Jaise:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGEST.map((s) => (
                  <button key={s} onClick={() => (type(s), input.current?.focus({ preventScroll: true }))} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              &ldquo;{q}&rdquo; ke liye kuch nahi mila. Chhota ya English naam try karo (jaise &ldquo;heap&rdquo;, &ldquo;dp&rdquo;).
            </p>
          ) : (
            <ul ref={list} id={listId} role="listbox" aria-label="Results" className="p-1.5">
              {results.map((d, i) => (
                <li key={`${i}-${d.h}`} id={`${uid}-${i}`} data-i={i} role="option" aria-selected={i === active}>
                  <Link
                    href={d.h}
                    tabIndex={-1}
                    onClick={onClose}
                    onMouseMove={() => setActive(i)}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${i === active ? 'bg-accent-soft' : ''}`}
                  >
                    <span className="mt-0.5 w-16 shrink-0 rounded bg-card py-0.5 text-center font-mono text-[10px] font-semibold text-muted">{KIND_LABEL[d.k]}</span>
                    <span className="min-w-0">
                      <span className="block font-medium break-words">{d.t}</span>
                      <span className="block truncate text-xs text-muted">{d.s}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden gap-4 border-t border-line px-4 py-2 font-mono text-[11px] text-muted sm:flex">
          <span>↑ ↓ chuno</span>
          <span>Enter kholo</span>
          <span>Esc band</span>
        </div>
        <p aria-live="polite" className="sr-only">
          {status}
        </p>
      </div>
    </div>
  );
}

const n = (x: number) => (x >= 30 ? '30+' : String(x));
