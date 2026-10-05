'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { CallNode, RecursionPanel, Tone } from '../engine/types';
import { tone } from '../engine/tones';
import { ScaledSvg } from './ScaledSvg';

const BH = 28;
const YG = 66;
const PAD = 16;

const callTone = (c: CallNode): Tone | undefined => c.tone ?? (c.state === 'active' ? 'active' : c.state === 'done' ? 'done' : undefined);

export function RecursionTreeViz({ p }: { p: RecursionPanel }) {
  const byId = new Map(p.calls.map((c) => [c.id, c]));
  const kids = new Map<string, string[]>();
  const roots: string[] = [];
  for (const c of p.calls) {
    if (c.parent && byId.has(c.parent)) (kids.get(c.parent) ?? kids.set(c.parent, []).get(c.parent)!).push(c.id);
    else roots.push(c.id);
  }
  const longest = Math.max(4, ...p.calls.map((c) => c.label.length));
  const BW = Math.min(150, Math.max(56, longest * 7.4 + 18));
  const XG = BW + 14;

  const pos = new Map<string, { x: number; depth: number }>();
  let leaf = 0;
  const place = (id: string, depth: number): number => {
    const ch = kids.get(id) ?? [];
    let x: number;
    if (ch.length === 0) x = PAD + leaf++ * XG + BW / 2;
    else {
      const xs = ch.map((c) => place(c, depth + 1));
      x = (xs[0] + xs[xs.length - 1]) / 2;
    }
    pos.set(id, { x, depth });
    return x;
  };
  roots.forEach((r) => place(r, 0));
  const maxDepth = Math.max(0, ...[...pos.values()].map((v) => v.depth));
  const width = PAD * 2 + Math.max(1, leaf) * XG;
  const height = PAD * 2 + 14 + maxDepth * YG + BH;
  const y = (id: string) => PAD + 14 + pos.get(id)!.depth * YG;

  // call stack = active call and its ancestors
  const active = p.calls.find((c) => c.state === 'active');
  const stack: CallNode[] = [];
  for (let c = active; c; c = c.parent ? byId.get(c.parent) : undefined) stack.push(c);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="min-w-0 flex-1">
        <ScaledSvg width={width} height={height} minScale={0.6} label={p.label ?? 'recursion tree'}>
          {p.calls.map((c) =>
            c.parent && pos.has(c.parent) ? (
              <line
                key={`e-${c.id}`}
                x1={pos.get(c.parent)!.x}
                y1={y(c.parent) + BH}
                x2={pos.get(c.id)!.x}
                y2={y(c.id)}
                stroke="var(--line-strong)"
                strokeWidth={1.5}
              />
            ) : null,
          )}
          <AnimatePresence initial={false}>
            {p.calls.map((c) => {
              const t = callTone(c);
              const px = pos.get(c.id)!.x;
              return (
                <m.g
                  key={c.id}
                  initial={{ opacity: 0, x: px, y: y(c.id) - 8 }}
                  animate={{ opacity: c.state === 'waiting' ? 0.85 : 1, x: px, y: y(c.id) }}
                  exit={{ opacity: 0 }}
                  className={tone(t)}
                >
                  <rect x={-BW / 2} y={0} width={BW} height={BH} rx={7} className="tone-svg" strokeWidth={c.state === 'active' ? 3 : 1.5} />
                  <text y={BH / 2 + 4.5} textAnchor="middle" className="tone-text font-mono text-[12px] font-semibold">
                    {c.label}
                  </text>
                  {c.ret !== undefined && (
                    <g transform={`translate(${BW / 4} -9)`}>
                      <rect x={-(c.ret.length * 3.3 + 10)} y={-7} width={c.ret.length * 6.6 + 20} height={14} rx={7} className="tone-done tone-svg" strokeWidth={1} />
                      <text y={3.5} textAnchor="middle" className="tone-done tone-text font-mono text-[10px] font-bold">
                        ↩ {c.ret}
                      </text>
                    </g>
                  )}
                </m.g>
              );
            })}
          </AnimatePresence>
        </ScaledSvg>
      </div>
      <div className="shrink-0 sm:w-40">
        <div className="mb-1 text-[11px] font-semibold text-muted">Call stack (upar = abhi chal raha)</div>
        <div className="flex flex-col gap-1 rounded-lg border border-line p-1.5">
          <AnimatePresence initial={false}>
            {stack.map((c, i) => (
              <m.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`tone ${tone(i === 0 ? 'active' : undefined)} truncate rounded border px-2 py-1 font-mono text-xs`}
              >
                {c.label}
              </m.div>
            ))}
          </AnimatePresence>
          {stack.length === 0 && <span className="py-1 text-center text-xs text-muted">khaali</span>}
        </div>
      </div>
    </div>
  );
}
