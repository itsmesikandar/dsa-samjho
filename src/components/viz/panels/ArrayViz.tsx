'use client';

import * as m from 'motion/react-m';
import type { ArrayPanel, ArrPointer, BarsPanel, Cell, Tone } from '../engine/types';
import { pointerTone, tone, TONE_MARK } from '../engine/tones';

export function Mark({ t }: { t?: Tone }) {
  const g = t && TONE_MARK[t];
  if (!g) return null;
  return (
    <span aria-hidden className="absolute -top-2 -right-1.5 text-[11px] leading-none font-bold" style={{ color: 'var(--t-bd)' }}>
      {g}
    </span>
  );
}

const fmt = (v: Cell) => (v === null ? '' : String(v));

/** pointer rows shared by ArrayViz and BarsViz */
function PointerRow({ pointers, col, row }: { pointers: ArrPointer[]; col: (i: number) => number; row: number }) {
  const level = new Map<number, number>();
  return (
    <>
      {pointers.map((p, k) => {
        const lv = level.get(p.index) ?? 0;
        level.set(p.index, lv + 1);
        return (
          <m.div
            key={p.name}
            layout
            className="flex flex-col items-center"
            style={{ gridColumn: col(p.index), gridRow: row + lv }}
          >
            {lv === 0 && (
              <span aria-hidden className="text-[10px] leading-none text-muted">
                ▲
              </span>
            )}
            <span className={`tone ${tone(pointerTone(p.tone, k))} mt-0.5 rounded border px-1 font-mono text-[11px] font-bold leading-4`}>
              {p.name}
            </span>
          </m.div>
        );
      })}
    </>
  );
}

function ghostCols(n: number, pointers: ArrPointer[] = []) {
  const lead = pointers.some((p) => p.index < 0) ? 1 : 0;
  const trail = pointers.some((p) => p.index >= n) ? 1 : 0;
  // index -1 → column 1 when lead; index n → last column
  const col = (i: number) => Math.min(Math.max(i, -lead), n - 1 + trail) + lead + 1;
  return { lead, trail, cols: n + lead + trail, col };
}

export function ArrayViz({ p }: { p: ArrayPanel }) {
  const n = p.values.length;
  const pointers = p.pointers ?? [];
  const { lead, trail, cols, col } = ghostCols(n, pointers);
  const ranges = p.ranges ?? [];
  const longest = Math.max(1, ...p.values.map((v) => fmt(v).length));
  const text = longest > 4 ? 'text-[11px]' : longest > 2 ? 'text-xs' : 'text-sm';
  const indexRow = 3;
  const rangeRow = 4;
  const pointerRow = rangeRow + ranges.length;

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div
        className="mx-auto grid w-full gap-x-1 gap-y-0.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(1.9rem, 1fr))`, maxWidth: `${cols * 3.1}rem` }}
      >
        {p.address &&
          p.values.map((_, i) => (
            <div key={`a${i}`} className="text-center font-mono text-[10px] text-muted" style={{ gridColumn: col(i), gridRow: 1 }}>
              {p.address!.base + i * p.address!.size}
            </div>
          ))}
        {p.values.map((v, i) => {
          const t = p.tones?.[i];
          return (
            <m.div
              key={p.ids?.[i] ?? `i${i}`}
              layout
              className={`tone ${tone(t)} relative flex h-10 items-center justify-center rounded-md border-2 font-mono font-semibold ${text} ${
                v === null ? 'border-dashed opacity-60' : ''
              }`}
              style={{ gridColumn: col(i), gridRow: 2 }}
            >
              {fmt(v)}
              <Mark t={t} />
            </m.div>
          );
        })}
        {lead > 0 && <Ghost col={1} />}
        {trail > 0 && <Ghost col={cols} />}
        {!p.hideIndex &&
          p.values.map((_, i) => (
            <div key={`x${i}`} className="text-center font-mono text-[11px] text-muted" style={{ gridColumn: col(i), gridRow: indexRow }}>
              {i}
            </div>
          ))}
        {ranges.map((r, k) => (
          <m.div
            key={`r${k}`}
            layout
            className={`tone ${tone(r.tone ?? 'active')} mt-0.5 flex h-5 items-center justify-center rounded-b-md border-x-2 border-b-2 bg-transparent text-[10px] font-semibold`}
            style={{ gridColumn: `${col(r.from)} / ${col(r.to) + 1}`, gridRow: rangeRow + k }}
          >
            {r.label}
          </m.div>
        ))}
        <PointerRow pointers={pointers} col={col} row={pointerRow} />
      </div>
    </div>
  );
}

function Ghost({ col }: { col: number }) {
  return (
    <div
      aria-hidden
      className="flex h-10 items-center justify-center rounded-md border-2 border-dashed border-line text-[10px] text-muted"
      style={{ gridColumn: col, gridRow: 2 }}
    >
      bahar
    </div>
  );
}

export function BarsViz({ p }: { p: BarsPanel }) {
  const n = p.values.length;
  const pointers = p.pointers ?? [];
  const { cols, col } = ghostCols(n, pointers);
  const lo = Math.min(0, ...p.values);
  const hi = Math.max(1, ...p.values);
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div
        className="mx-auto grid w-full gap-x-1 gap-y-0.5"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(1.6rem, 1fr))`,
          gridTemplateRows: '9rem auto auto',
          maxWidth: `${cols * 3}rem`,
        }}
      >
        {p.values.map((v, i) => {
          const t = p.tones?.[i];
          const h = 6 + ((v - lo) / (hi - lo)) * 76;
          return (
            <m.div key={p.ids?.[i] ?? `b${i}`} layout className="flex flex-col items-center justify-end" style={{ gridColumn: col(i), gridRow: 1 }}>
              <span className="mb-0.5 font-mono text-[11px] font-semibold">{v}</span>
              <div className={`tone ${tone(t)} relative w-full rounded-t-md border-2`} style={{ height: `${h}%` }}>
                <Mark t={t} />
              </div>
            </m.div>
          );
        })}
        {p.values.map((_, i) => (
          <div key={`x${i}`} className="text-center font-mono text-[11px] text-muted" style={{ gridColumn: col(i), gridRow: 2 }}>
            {i}
          </div>
        ))}
        <PointerRow pointers={pointers} col={col} row={3} />
      </div>
    </div>
  );
}
