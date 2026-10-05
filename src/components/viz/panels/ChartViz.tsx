'use client';

import { useId } from 'react';
import type { ChartPanel, Tone } from '../engine/types';
import { tone } from '../engine/tones';
import { ScaledSvg } from './ScaledSvg';

const W = 360;
const H = 220;
const PL = 40;
const PB = 30;
const PT = 12;
const PR = 14;
const CYCLE: Tone[] = ['active', 'compare', 'swap', 'error', 'done', 'new'];

export function ChartViz({ p }: { p: ChartPanel }) {
  const clipId = `plot${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const xs = p.series.flatMap((s) => s.points.map(([x]) => x));
  const xMax = Math.max(1, ...xs);
  const yMax = p.yMax ?? Math.max(1, ...p.series.flatMap((s) => s.points.map(([, y]) => y)));
  const sx = (x: number) => PL + (x / xMax) * (W - PL - PR);
  const sy = (y: number) => H - PB - (Math.min(y, yMax * 1.04) / yMax) * (H - PB - PT);
  const valueAt = (pts: [number, number][], x: number) => pts.find(([px]) => px === x)?.[1];
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

  return (
    <div>
      <ScaledSvg width={W} height={H} minScale={0.8} label={p.label ?? 'chart'}>
        <defs>
          <clipPath id={clipId}>
            <rect x={PL} y={PT - 4} width={W - PL - PR + 4} height={H - PB - PT + 4} />
          </clipPath>
        </defs>
        <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="var(--line-strong)" />
        <line x1={PL} y1={PT} x2={PL} y2={H - PB} stroke="var(--line-strong)" />
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <text x={sx(xMax * f)} y={H - PB + 14} textAnchor="middle" className="fill-[var(--muted)] font-mono text-[10px]">
              {fmt(xMax * f)}
            </text>
            <text x={PL - 5} y={sy(yMax * f) + 3} textAnchor="end" className="fill-[var(--muted)] font-mono text-[10px]">
              {fmt(yMax * f)}
            </text>
          </g>
        ))}
        {p.xLabel && (
          <text x={W - PR} y={H - 3} textAnchor="end" className="fill-[var(--muted)] text-[10px]">
            {p.xLabel}
          </text>
        )}
        {p.yLabel && (
          <text x={PL + 6} y={PT + 8} className="fill-[var(--muted)] text-[10px]">
            {p.yLabel}
          </text>
        )}
        <g clipPath={`url(#${clipId})`}>
          {p.series.map((s, i) => (
            <polyline
              key={s.label}
              points={s.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
              fill="none"
              className={`${tone(s.tone ?? CYCLE[i % CYCLE.length])} tone-stroke`}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          ))}
        </g>
        {p.marker !== undefined && (
          <g>
            <line x1={sx(p.marker)} y1={PT} x2={sx(p.marker)} y2={H - PB} stroke="var(--muted)" strokeDasharray="4 3" />
            {p.series.map((s, i) => {
              const v = valueAt(s.points, p.marker!);
              return v === undefined || v > yMax ? null : (
                <circle key={s.label} cx={sx(p.marker!)} cy={sy(v)} r={4} className={`${tone(s.tone ?? CYCLE[i % CYCLE.length])} tone-svg`} strokeWidth={2} />
              );
            })}
          </g>
        )}
      </ScaledSvg>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {p.series.map((s, i) => {
          const v = p.marker !== undefined ? valueAt(s.points, p.marker) : undefined;
          return (
            <li key={s.label} className="flex items-center gap-1.5">
              <span className={`tone ${tone(s.tone ?? CYCLE[i % CYCLE.length])} inline-block h-1 w-4 rounded border-2`} />
              <span className="font-mono font-semibold">{s.label}</span>
              {v !== undefined && <span className="font-mono text-muted">= {fmt(v)}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
