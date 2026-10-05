'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { Cell, LinearPanel, RingPanel } from '../engine/types';
import { tone } from '../engine/tones';
import { Mark } from './ArrayViz';

const fmt = (v: Cell) => (v === null ? '' : String(v));

export function StackQueueViz({ p }: { p: LinearPanel }) {
  const key = (i: number) => p.ids?.[i] ?? `k${i}`;
  if (p.kind === 'stack') {
    const top = p.items.length - 1;
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <div className="flex min-h-12 w-28 flex-col-reverse gap-1 rounded-b-lg border-x-2 border-b-2 border-line-strong p-1.5">
            <AnimatePresence initial={false}>
              {p.items.map((v, i) => {
                const t = p.tones?.[i];
                return (
                  <m.div
                    key={key(i)}
                    layout
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    className={`tone ${tone(t)} relative flex h-9 items-center justify-center rounded border-2 font-mono text-sm font-semibold`}
                  >
                    {fmt(v)}
                    {i === top && (
                      <span className="absolute -right-12 font-sans text-[11px] font-bold text-muted">← top</span>
                    )}
                    <Mark t={t} />
                  </m.div>
                );
              })}
            </AnimatePresence>
            {p.items.length === 0 && <span className="py-2 text-center text-xs text-muted">khaali</span>}
          </div>
        </div>
      </div>
    );
  }
  const isQueue = p.kind === 'queue';
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="mx-auto flex w-max items-end gap-2">
        <span className="pb-2.5 text-[11px] font-bold text-muted">{isQueue ? 'front ←' : 'front ⇄'}</span>
        <div className="flex min-h-12 min-w-24 items-center gap-1 rounded-lg border-y-2 border-line-strong px-1.5 py-1.5">
          <AnimatePresence initial={false} mode="popLayout">
            {p.items.map((v, i) => {
              const t = p.tones?.[i];
              return (
                <m.div
                  key={key(i)}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isQueue ? -24 : 0, scale: 0.8 }}
                  className={`tone ${tone(t)} relative flex h-9 min-w-9 items-center justify-center rounded border-2 px-1.5 font-mono text-sm font-semibold`}
                >
                  {fmt(v)}
                  <Mark t={t} />
                </m.div>
              );
            })}
          </AnimatePresence>
          {p.items.length === 0 && <span className="w-full text-center text-xs text-muted">khaali</span>}
        </div>
        <span className="pb-2.5 text-[11px] font-bold text-muted">{isQueue ? '← rear' : '⇄ rear'}</span>
      </div>
    </div>
  );
}

export function RingViz({ p }: { p: RingPanel }) {
  const k = p.slots.length;
  const size = 260;
  const c = size / 2;
  const R = 82;
  const at = (i: number, r: number) => {
    const a = (i / k) * Math.PI * 2 - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  };
  const labels: Record<number, string[]> = {};
  (labels[p.front] ??= []).push('front');
  (labels[p.rear] ??= []).push('rear');
  return (
    <div className="flex justify-center">
      <svg role="img" aria-label="circular queue" viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="max-w-full">
        <circle cx={c} cy={c} r={R} fill="none" stroke="var(--line)" strokeDasharray="4 4" />
        {p.slots.map((v, i) => {
          const [x, y] = at(i, R);
          const t = p.tones?.[i];
          return (
            <g key={i} className={tone(t)}>
              <rect x={x - 19} y={y - 15} width={38} height={30} rx={5} className="tone-svg" strokeWidth={2} />
              <text x={x} y={y + 5} textAnchor="middle" className="tone-text font-mono text-[13px] font-semibold">
                {v === null ? '' : String(v)}
              </text>
              <text x={c + (x - c) * 0.62} y={c + (y - c) * 0.62 + 4} textAnchor="middle" className="fill-[var(--muted)] font-mono text-[10px]">
                {i}
              </text>
            </g>
          );
        })}
        {Object.entries(labels).map(([i, names]) => {
          const [x, y] = at(Number(i), R + 36);
          return (
            <text key={i} x={x} y={y + 4} textAnchor="middle" className="fill-[var(--accent)] text-[11px] font-bold">
              {names.join(' + ')}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
