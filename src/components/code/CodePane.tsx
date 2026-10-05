'use client';

import { useEffect, useRef, useState } from 'react';
import { LANGS, LANG_LABEL, type CodeViews } from '@/lib/codefile';
import { setLang, useLang } from '@/lib/storage';

export function CodePane({
  views,
  active,
  title,
  maxHeight = '20rem',
  showOutput = true,
}: {
  views: CodeViews;
  /** marker name to highlight */
  active?: string;
  title?: string;
  maxHeight?: string;
  showOutput?: boolean;
}) {
  const lang = useLang();
  const view = views[lang];
  const line = active !== undefined ? view.markers[active] : undefined;
  const boxRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (line === undefined || !box) return;
    const el = box.querySelector<HTMLElement>(`[data-ln="${line}"]`);
    if (!el) return;
    const top = el.offsetTop;
    if (top < box.scrollTop + 8 || top + el.offsetHeight > box.scrollTop + box.clientHeight - 8) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3), behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [line, lang]);

  const copy = async () => {
    const text = [...(boxRef.current?.querySelectorAll('.code-text') ?? [])].map((e) => e.textContent ?? '').join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="flex items-center gap-2 border-b border-line bg-card px-1.5">
        <div role="tablist" aria-label="Language" className="flex">
          {LANGS.map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={l === lang}
              onClick={() => setLang(l)}
              className={`border-b-2 px-3 py-2 text-xs font-semibold ${
                l === lang ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-fg'
              }`}
            >
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>
        {title && <span className="min-w-0 flex-1 truncate text-xs text-muted">{title}</span>}
        <button onClick={copy} className="ml-auto rounded px-2 py-1 text-xs text-muted hover:bg-bg hover:text-fg">
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <div ref={boxRef} className="code-box relative overflow-auto py-2" style={{ maxHeight }}>
        {view.lines.map((html, i) => (
          <div key={i} data-ln={i} className={`code-line${i === line ? ' is-active' : ''}`}>
            <span className="ln">{i + 1}</span>
            <span className="code-text" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        ))}
      </div>
      {showOutput && view.output.length > 0 && (
        <div className="border-t border-line bg-card px-3 py-2">
          <div className="text-[11px] font-semibold tracking-wide text-muted uppercase">Output</div>
          <pre className="mt-0.5 overflow-x-auto font-mono text-xs leading-relaxed">{view.output.join('\n')}</pre>
        </div>
      )}
    </div>
  );
}
