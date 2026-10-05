'use client';

import { useEffect, useRef } from 'react';
import type { MemoryPanel } from '../engine/types';
import { tone } from '../engine/tones';
import { Mark } from './ArrayViz';

const CELL = 52;
const GAP = 4;
const ARC_H = 34;

export function MemoryViz({ p }: { p: MemoryPanel }) {
  const step = p.step ?? 4;
  const arrows = p.arrows ?? [];
  const width = p.cells.length * (CELL + GAP);
  const cx = (i: number) => i * (CELL + GAP) + CELL / 2;
  const firstWith = (t: string) => p.cells.findIndex((c) => c.tone === t);
  const focus = [firstWith('found'), firstWith('error'), firstWith('active')].find((i) => i >= 0) ?? -1;
  const scroller = useRef<HTMLDivElement>(null);

  // keep the highlighted cell visible on narrow screens
  useEffect(() => {
    const box = scroller.current;
    if (!box || focus < 0) return;
    const x = cx(focus);
    if (x < box.scrollLeft + CELL || x > box.scrollLeft + box.clientWidth - CELL) {
      box.scrollTo({ left: Math.max(0, x - box.clientWidth / 2), behavior: 'smooth' });
    }
  }, [focus]);

  return (
    <div ref={scroller} className="w-full overflow-x-auto pb-1">
      <div className="relative mx-auto" style={{ width }}>
        {arrows.length > 0 && (
          <svg aria-hidden width={width} height={ARC_H} className="block overflow-visible">
            {arrows.map((a, k) => {
              const x1 = cx(a.from);
              const x2 = cx(a.to);
              const lift = Math.min(ARC_H - 4, 10 + Math.abs(a.to - a.from) * 4);
              const y = ARC_H;
              const dir = x2 >= x1 ? 1 : -1;
              return (
                <g key={k} className={`${tone(a.tone ?? 'active')}`}>
                  <path
                    d={`M ${x1 + dir * 6} ${y} C ${x1 + dir * 6} ${y - lift}, ${x2 - dir * 6} ${y - lift}, ${x2 - dir * 6} ${y}`}
                    className="tone-stroke"
                    fill="none"
                    strokeWidth={2}
                  />
                  <polygon
                    points={`${x2 - dir * 6 - 4},${y - 6} ${x2 - dir * 6 + 4},${y - 6} ${x2 - dir * 6},${y}`}
                    style={{ fill: 'var(--t-bd)' }}
                  />
                </g>
              );
            })}
          </svg>
        )}
        <div className="flex" style={{ gap: GAP }}>
          {p.cells.map((c, i) => (
            <div key={i} className="flex flex-col items-center" style={{ width: CELL }}>
              <span className="font-mono text-[10px] text-muted">{p.start + i * step}</span>
              <div
                className={`tone ${tone(c.tone)} relative flex h-10 w-full items-center justify-center rounded border-2 font-mono text-sm font-semibold ${
                  c.value === undefined ? 'text-muted opacity-50' : ''
                }`}
              >
                {c.value === undefined ? '?' : c.value === null ? 'null' : String(c.value)}
                <Mark t={c.tone} />
              </div>
              <span className="mt-0.5 h-4 truncate font-mono text-[10px] text-muted" style={{ maxWidth: CELL }}>
                {c.tag ?? ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
