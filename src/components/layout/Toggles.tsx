'use client';

import { useEffect, useState } from 'react';
import { LANGS, LANG_LABEL } from '@/lib/codefile';
import { setLang, useLang } from '@/lib/storage';

export function LangToggle() {
  const lang = useLang();
  return (
    <div role="radiogroup" aria-label="Code language" className="flex rounded-lg border border-line p-0.5 text-xs font-semibold">
      {LANGS.map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={l === lang}
          onClick={() => setLang(l)}
          className={`rounded-md px-2.5 py-1.5 ${l === lang ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'}`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => setDark(document.documentElement.dataset.theme === 'dark'), []);
  const flip = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('dsa.theme', JSON.stringify(next));
    } catch {
      /* blocked storage */
    }
    setDark(next === 'dark');
  };
  return (
    <button
      onClick={flip}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line hover:border-accent"
      aria-label={dark ? 'Light mode' : 'Dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        {dark ? (
          <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  );
}

export const THEME_SCRIPT = `(function(){var d=document.documentElement;try{var t=JSON.parse(localStorage.getItem('dsa.theme')||'null');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t}catch(e){d.dataset.theme='light'}})()`;
