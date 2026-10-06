import type { ReactNode } from 'react';
import { renderInline, renderMarkdown } from '@/lib/markdown';
import { SECTIONS, type SectionId } from './sections';

export function Md({ src, className = '' }: { src: string; className?: string }) {
  return <div className={`prose-hi ${className}`} dangerouslySetInnerHTML={{ __html: renderMarkdown(src) }} />;
}

export function Inline({ src }: { src: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderInline(src) }} />;
}

export function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-line pt-8 pb-4 first:border-t-0">
      <h2 id={`${id}-h`} className="mb-4 flex items-baseline gap-2.5 text-xl font-bold tracking-tight sm:text-2xl">
        <span className="font-mono text-sm font-semibold text-accent">{String(s.n).padStart(2, '0')}</span>
        <a href={`#${id}`} className="hover:underline">
          {s.title}
        </a>
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const LEVEL_STYLE: Record<string, string> = {
  easy: 'tone-done',
  medium: 'tone-compare',
  tricky: 'tone-swap',
  hard: 'tone-error',
  beginner: 'tone-done',
  intermediate: 'tone-compare',
  advanced: 'tone-error',
};

export function LevelBadge({ level }: { level: string }) {
  return (
    <span className={`tone ${LEVEL_STYLE[level] ?? 'tone-none'} inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase`}>
      {level}
    </span>
  );
}

export function Box({ title, tone, children }: { title?: string; tone?: string; children: ReactNode }) {
  return (
    <div className={`callout ${tone ?? 'callout-yaad'}`}>
      {title && <div className="callout-title">{title}</div>}
      {children}
    </div>
  );
}
