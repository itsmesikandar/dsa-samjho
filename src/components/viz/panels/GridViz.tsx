'use client';

import type { GridPanel, TextPanel } from '../engine/types';
import { tone } from '../engine/tones';
import { Mark } from './ArrayViz';

export function GridViz({ p }: { p: GridPanel }) {
  const rows = p.values.length;
  const cols = Math.max(0, ...p.values.map((r) => r.length));
  const hasRow = !!p.rowLabels;
  const hasCol = !!p.colLabels;
  const longest = Math.max(1, ...p.values.flat().map((v) => String(v ?? '').length));
  const text = longest > 3 ? 'text-[11px]' : 'text-sm';
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div
        className={`mx-auto grid gap-1 ${p.dense ? 'w-full justify-center' : 'w-max'}`}
        style={{ gridTemplateColumns: `${hasRow ? 'auto ' : ''}repeat(${cols}, ${p.dense ? 'minmax(1.1rem, 2rem)' : 'minmax(2rem, 2.6rem)'})` }}
      >
        {hasCol && (
          <>
            {hasRow && <div className="text-center font-mono text-[11px] text-muted">{p.corner ?? ''}</div>}
            {Array.from({ length: cols }, (_, c) => (
              <div key={`c${c}`} className="text-center font-mono text-[11px] text-muted">
                {p.colLabels![c] ?? ''}
              </div>
            ))}
          </>
        )}
        {p.values.map((row, r) => (
          <Row key={r}>
            {hasRow && <div className="flex items-center justify-end pr-1 font-mono text-[11px] text-muted">{p.rowLabels![r] ?? ''}</div>}
            {Array.from({ length: cols }, (_, c) => {
              const v = row[c];
              const t = p.tones?.[`${r},${c}`];
              return (
                <div
                  key={c}
                  className={`tone ${tone(t)} relative flex ${p.dense ? 'h-6' : 'h-9'} items-center justify-center rounded border-2 font-mono font-semibold ${text}`}
                >
                  {v === null || v === undefined ? '' : String(v)}
                  {!p.dense && <Mark t={t} />}
                </div>
              );
            })}
          </Row>
        ))}
      </div>
      {rows === 0 && <p className="text-center text-sm text-muted">khaali grid</p>}
    </div>
  );
}

const Row = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export function TextViz({ p }: { p: TextPanel }) {
  return (
    <div className={`tone ${tone(p.tone)} rounded-md border px-3 py-2 font-mono text-sm whitespace-pre-wrap break-words`}>
      {p.text || ' '}
    </div>
  );
}
