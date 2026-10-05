'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { ListPanel, Tone } from '../engine/types';
import { pointerTone, tone } from '../engine/tones';
import { Arrowhead } from './svg';

const VAL_W = 44;
const PTR_W = 16;
const H = 34;
const GAP = 34;
const TOP = 38;
const PAD = 8;

export function LinkedListViz({ p }: { p: ListPanel }) {
  const nodeW = VAL_W + PTR_W + (p.doubly ? PTR_W : 0);
  const slot = nodeW + GAP;
  const index = new Map(p.nodes.map((n, i) => [n.id, i]));
  const pointers = p.pointers ?? [];
  const nullSlot = pointers.some((q) => q.at === null);
  const n = p.nodes.length;
  const x = (i: number) => PAD + i * slot;
  const yMid = TOP + H / 2;
  const labelTop = TOP + H + (p.doubly ? 30 : 12);

  const stacks = new Map<string, number>();
  const labelPos = pointers.map((q) => {
    const key = q.at ?? '__null';
    const lv = stacks.get(key) ?? 0;
    stacks.set(key, lv + 1);
    const i = q.at === null ? n : (index.get(q.at) ?? -1);
    const cx = q.at === null ? x(n) + 22 : x(i) + nodeW / 2;
    return { q, cx, y: labelTop + lv * 18, hidden: i < 0 };
  });
  const maxStack = Math.max(0, ...stacks.values());
  const width = PAD * 2 + n * slot + (nullSlot ? 50 : 0);
  const height = labelTop + maxStack * 18 + 6;

  return (
    <div className="w-full overflow-x-auto pb-1">
      <svg role="img" aria-label={p.label ?? 'linked list'} width={Math.max(width, 120)} height={height} className="mx-auto block overflow-visible">
        {p.nodes.map((nd, i) => {
          const out: React.ReactNode[] = [];
          const nextCx = x(i) + nodeW - PTR_W / 2;
          if (nd.next) {
            const j = index.get(nd.next);
            if (j !== undefined) {
              if (j === i + 1) {
                const y = p.doubly ? yMid - 6 : yMid;
                out.push(
                  <g key="n" className="tone-none">
                    <line x1={nextCx} y1={y} x2={x(j) - 3} y2={y} stroke="var(--muted)" strokeWidth={2} />
                    <Arrowhead x={x(j) - 1} y={y} dx={1} dy={0} fill="var(--muted)" />
                  </g>,
                );
              } else {
                const ex = x(j) + nodeW / 2 + (j < i ? 8 : -8);
                const lift = Math.min(TOP - 4, 14 + Math.abs(j - i) * 5);
                out.push(
                  <g key="n">
                    <path d={`M ${nextCx} ${TOP} C ${nextCx} ${TOP - lift}, ${ex} ${TOP - lift}, ${ex} ${TOP - 3}`} fill="none" stroke="var(--muted)" strokeWidth={2} />
                    <Arrowhead x={ex} y={TOP - 1} dx={0} dy={1} fill="var(--muted)" />
                  </g>,
                );
              }
            }
          }
          if (p.doubly && nd.prev) {
            const j = index.get(nd.prev);
            const prevCx = x(i) + PTR_W / 2;
            if (j !== undefined) {
              if (j === i - 1) {
                const y = yMid + 6;
                out.push(
                  <g key="p">
                    <line x1={prevCx} y1={y} x2={x(j) + nodeW + 3} y2={y} stroke="var(--muted)" strokeWidth={2} strokeDasharray="4 2" />
                    <Arrowhead x={x(j) + nodeW + 1} y={y} dx={-1} dy={0} fill="var(--muted)" />
                  </g>,
                );
              } else {
                const ex = x(j) + nodeW / 2;
                const drop = 22;
                out.push(
                  <g key="p">
                    <path d={`M ${prevCx} ${TOP + H} C ${prevCx} ${TOP + H + drop}, ${ex} ${TOP + H + drop}, ${ex} ${TOP + H + 3}`} fill="none" stroke="var(--muted)" strokeWidth={2} strokeDasharray="4 2" />
                    <Arrowhead x={ex} y={TOP + H + 1} dx={0} dy={-1} fill="var(--muted)" />
                  </g>,
                );
              }
            }
          }
          return <g key={`arr-${nd.id}`}>{out}</g>;
        })}

        <AnimatePresence initial={false}>
          {p.nodes.map((nd, i) => (
            <m.g
              key={nd.id}
              initial={{ opacity: 0, x: x(i), y: -16 }}
              animate={{ opacity: 1, x: x(i), y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className={tone(nd.tone)}
            >
              <rect x={0} y={TOP} width={nodeW} height={H} rx={6} className="tone-svg" strokeWidth={2} />
              {p.doubly && <PtrBox x0={0} value={nd.prev} />}
              <text x={(p.doubly ? PTR_W : 0) + VAL_W / 2} y={yMid + 5} textAnchor="middle" className="tone-text font-mono text-[13px] font-semibold">
                {nd.value === null ? '' : String(nd.value)}
              </text>
              <PtrBox x0={nodeW - PTR_W} value={nd.next} />
            </m.g>
          ))}
        </AnimatePresence>

        {nullSlot && (
          <g>
            <rect x={x(n)} y={TOP + 4} width={44} height={H - 8} rx={5} fill="none" stroke="var(--line-strong)" strokeDasharray="3 3" />
            <text x={x(n) + 22} y={yMid + 4} textAnchor="middle" className="fill-[var(--muted)] font-mono text-[11px]">
              null
            </text>
          </g>
        )}

        {labelPos.map(({ q, cx, y, hidden }, k) =>
          hidden ? null : (
            <m.g key={q.name} initial={false} animate={{ x: cx, y }} className={tone(pointerTone(q.tone as Tone | undefined, k))}>
              <text x={0} y={-2} textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
                ▲
              </text>
              <rect x={-(q.name.length * 3.6 + 6)} y={1} width={q.name.length * 7.2 + 12} height={15} rx={3} className="tone-svg" strokeWidth={1} />
              <text x={0} y={12} textAnchor="middle" className="tone-text font-mono text-[11px] font-bold">
                {q.name}
              </text>
            </m.g>
          ),
        )}
      </svg>
    </div>
  );
}

function PtrBox({ x0, value }: { x0: number; value: string | null | undefined }) {
  return (
    <g>
      <line x1={x0} y1={TOP} x2={x0} y2={TOP + H} className="tone-stroke" strokeWidth={1.5} />
      {value === null ? (
        <line x1={x0 + 3} y1={TOP + H - 4} x2={x0 + PTR_W - 3} y2={TOP + 4} stroke="var(--muted)" strokeWidth={1.5} />
      ) : value !== undefined ? (
        <circle cx={x0 + PTR_W / 2} cy={TOP + H / 2} r={2.5} fill="var(--muted)" />
      ) : null}
    </g>
  );
}
