'use client';

import type { GraphPanel } from '../engine/types';
import { tone, TONE_MARK } from '../engine/tones';
import { ScaledSvg } from './ScaledSvg';
import { Arrowhead } from './svg';

const W = 420;
const H = 280;
const R = 17;

export function GraphViz({ p }: { p: GraphPanel }) {
  const n = p.nodes.length;
  const authored = n > 0 && p.nodes.every((v) => v.x !== undefined && v.y !== undefined);
  const pos = new Map<string, { x: number; y: number }>();
  p.nodes.forEach((v, i) => {
    if (authored) pos.set(v.id, { x: 34 + (v.x! / 100) * (W - 68), y: 34 + (v.y! / 100) * (H - 68) });
    else if (n <= 2) pos.set(v.id, { x: W / 2 + (i - (n - 1) / 2) * 160, y: H / 2 });
    else {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = Math.min(W, H) / 2 - 42;
      pos.set(v.id, { x: W / 2 + r * Math.cos(a), y: H / 2 + r * Math.sin(a) });
    }
  });

  const keys = new Set(p.edges.map((e) => `${e.from}>${e.to}`));
  const seen = new Set<string>();
  const edges = p.edges.filter((e) => {
    if (!pos.has(e.from) || !pos.has(e.to)) return false;
    if (p.directed) return true;
    const k = [e.from, e.to].sort().join('|');
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return (
    <ScaledSvg width={W} height={H} minScale={0.7} label={p.label ?? 'graph'}>
      {edges.map((e, i) => {
        const a = pos.get(e.from)!;
        const b = pos.get(e.to)!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const curved = p.directed && keys.has(`${e.to}>${e.from}`);
        const off = curved ? 16 : 0;
        const [nx, ny] = [-uy * off, ux * off];
        const sx = a.x + ux * R + nx * 0.4;
        const sy = a.y + uy * R + ny * 0.4;
        const ex = b.x - ux * (R + 2) + nx * 0.4;
        const ey = b.y - uy * (R + 2) + ny * 0.4;
        const mx = (a.x + b.x) / 2 + nx;
        const my = (a.y + b.y) / 2 + ny;
        const t = e.tone;
        const stroke = t ? 'var(--t-bd)' : 'var(--line-strong)';
        const tdx = curved ? ex - mx : dx;
        const tdy = curved ? ey - my : dy;
        return (
          <g key={i} className={t ? tone(t) : ''}>
            <path
              d={curved ? `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}` : `M ${sx} ${sy} L ${ex} ${ey}`}
              fill="none"
              stroke={stroke}
              strokeWidth={t ? 3 : 2}
            />
            {p.directed && <Arrowhead x={ex} y={ey} dx={tdx} dy={tdy} fill={stroke} size={6} />}
            {e.w !== undefined && (
              <g>
                <rect x={mx - 11} y={my - 9} width={22} height={16} rx={4} fill="var(--bg)" stroke={stroke} strokeWidth={1} />
                <text x={mx} y={my + 3} textAnchor="middle" className="fill-[var(--fg)] font-mono text-[10px] font-semibold">
                  {e.w}
                </text>
              </g>
            )}
          </g>
        );
      })}
      {p.nodes.map((v) => {
        const q = pos.get(v.id)!;
        return (
          <g key={v.id} transform={`translate(${q.x} ${q.y})`} className={tone(v.tone)}>
            <circle r={R} className="tone-svg" strokeWidth={2.5} />
            <text y={4.5} textAnchor="middle" className="tone-text font-mono text-[13px] font-semibold">
              {v.label ?? v.id}
            </text>
            {v.tone && TONE_MARK[v.tone] && (
              <text x={R - 3} y={-R + 5} className="text-[11px] font-bold" style={{ fill: 'var(--t-bd)' }}>
                {TONE_MARK[v.tone]}
              </text>
            )}
            {v.badge && (
              <text y={-R - 6} textAnchor="middle" className="fill-[var(--accent)] font-mono text-[11px] font-bold">
                {v.badge}
              </text>
            )}
          </g>
        );
      })}
    </ScaledSvg>
  );
}
