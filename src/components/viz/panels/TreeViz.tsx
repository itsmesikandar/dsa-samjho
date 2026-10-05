'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { TreeNode, TreePanel } from '../engine/types';
import { pointerTone, tone, TONE_MARK } from '../engine/tones';
import { ScaledSvg } from './ScaledSvg';

const R = 18;
const XG = 46;
const YG = 64;
const PAD = 22;

function layout(p: TreePanel) {
  const byId = new Map(p.nodes.map((n) => [n.id, n]));
  const pos = new Map<string, { col: number; depth: number }>();
  let col = 0;
  const walk = (id: string | null | undefined, depth: number) => {
    if (!id || pos.has(id)) return;
    const n = byId.get(id);
    if (!n) return;
    walk(n.left, depth + 1);
    pos.set(id, { col: col++, depth });
    walk(n.right, depth + 1);
  };
  walk(p.root, 0);
  // detached nodes (e.g. while deleting): draw to the right, each as its own little tree
  const children = new Set(p.nodes.flatMap((n) => [n.left, n.right]).filter(Boolean) as string[]);
  for (const n of p.nodes) if (!pos.has(n.id) && !children.has(n.id)) walk(n.id, 0);
  for (const n of p.nodes) if (!pos.has(n.id)) walk(n.id, 0);
  return pos;
}

export function TreeViz({ p }: { p: TreePanel }) {
  const pos = layout(p);
  const cols = Math.max(1, pos.size);
  const maxDepth = Math.max(0, ...[...pos.values()].map((v) => v.depth));
  const pointers = p.pointers ?? [];
  const stack = new Map<string, number>();
  const ptrLv = pointers.map((q) => {
    const lv = stack.get(q.at) ?? 0;
    stack.set(q.at, lv + 1);
    return lv;
  });
  const maxPtr = Math.max(0, ...stack.values());
  const cx = (id: string) => PAD + pos.get(id)!.col * XG + R;
  const cy = (id: string) => PAD + 6 + pos.get(id)!.depth * YG + R;
  const width = PAD * 2 + cols * XG;
  const height = PAD * 2 + 6 + (maxDepth + 1) * YG - (YG - 2 * R) + maxPtr * 16;

  const edges: { from: TreeNode; to: string }[] = [];
  for (const n of p.nodes) {
    for (const c of [n.left, n.right]) if (c && pos.has(c) && pos.has(n.id)) edges.push({ from: n, to: c });
  }

  if (!p.root && p.nodes.length === 0) {
    return <p className="py-4 text-center font-mono text-sm text-muted">root = null (khaali tree)</p>;
  }

  return (
    <ScaledSvg width={width} height={height} minScale={0.55} label={p.label ?? 'tree'}>
      {edges.map(({ from, to }) => {
        const t = p.edgeTones?.[`${from.id}>${to}`];
        const [x1, y1, x2, y2] = [cx(from.id), cy(from.id), cx(to), cy(to)];
        const d = Math.hypot(x2 - x1, y2 - y1) || 1;
        const k = R / d;
        return (
          <m.line
            key={`${from.id}>${to}`}
            initial={false}
            animate={{ x1: x1 + (x2 - x1) * k, y1: y1 + (y2 - y1) * k, x2: x2 - (x2 - x1) * k, y2: y2 - (y2 - y1) * k }}
            className={t ? `${tone(t)} tone-stroke` : ''}
            stroke={t ? undefined : 'var(--line-strong)'}
            strokeWidth={t ? 3 : 2}
          />
        );
      })}
      <AnimatePresence initial={false}>
        {p.nodes
          .filter((n) => pos.has(n.id))
          .map((n) => (
            <m.g
              key={n.id}
              initial={{ opacity: 0, x: cx(n.id), y: cy(n.id) - 10 }}
              animate={{ opacity: 1, x: cx(n.id), y: cy(n.id) }}
              exit={{ opacity: 0 }}
              className={tone(n.tone)}
            >
              <circle r={R} className="tone-svg" strokeWidth={2} />
              <text y={5} textAnchor="middle" className="tone-text font-mono text-[13px] font-semibold">
                {n.value === null ? '' : String(n.value)}
              </text>
              {n.tone && TONE_MARK[n.tone] && (
                <text x={R - 2} y={-R + 6} className="text-[11px] font-bold" style={{ fill: 'var(--t-bd)' }}>
                  {TONE_MARK[n.tone]}
                </text>
              )}
              {n.badge && (
                <text x={R + 3} y={-R + 2} className="fill-[var(--accent)] font-mono text-[10px] font-bold">
                  {n.badge}
                </text>
              )}
            </m.g>
          ))}
      </AnimatePresence>
      {pointers.map((q, k) =>
        pos.has(q.at) ? (
          <m.g
            key={q.name}
            initial={false}
            animate={{ x: cx(q.at), y: cy(q.at) + R + 4 + ptrLv[k] * 16 }}
            className={tone(pointerTone(q.tone, k))}
          >
            <rect x={-(q.name.length * 3.6 + 5)} y={0} width={q.name.length * 7.2 + 10} height={14} rx={3} className="tone-svg" strokeWidth={1} />
            <text y={11} textAnchor="middle" className="tone-text font-mono text-[10px] font-bold">
              {q.name}
            </text>
          </m.g>
        ) : null,
      )}
    </ScaledSvg>
  );
}
