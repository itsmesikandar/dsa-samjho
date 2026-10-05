'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { Cell, HashPanel, MapPanel } from '../engine/types';
import { tone } from '../engine/tones';
import { Mark } from './ArrayViz';

const fmt = (v: Cell | undefined) => (v === null || v === undefined ? '' : String(v));

export function HashTableViz({ p }: { p: HashPanel }) {
  return (
    <div className="space-y-2">
      {p.calc && (
        <div className="tone tone-active mx-auto w-fit rounded-md border px-3 py-1 font-mono text-xs font-semibold">{p.calc}</div>
      )}
      <div className="w-full overflow-x-auto pb-1">
        <div className="mx-auto w-max min-w-56 space-y-1">
          {p.buckets.map((chain, b) => {
            const bt = p.bucketTones?.[b];
            return (
              <div key={b} className="flex items-center gap-1.5">
                <div className={`tone ${tone(bt)} flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 font-mono text-xs font-bold`}>
                  {b}
                </div>
                <span className="text-xs text-muted">→</span>
                <div className="flex items-center gap-1">
                  <AnimatePresence initial={false}>
                    {chain.map((e, i) => (
                      <m.div
                        key={e.id ?? fmt(e.key)}
                        layoutId={`h-${e.id ?? fmt(e.key)}`}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="flex items-center gap-1"
                      >
                        {i > 0 && <span className="text-xs text-muted">→</span>}
                        <div className={`tone ${tone(e.tone)} relative flex h-9 items-center rounded border-2 px-2 font-mono text-xs font-semibold whitespace-nowrap`}>
                          {fmt(e.key)}
                          {e.value !== undefined && <span className="ml-1 font-normal opacity-80">: {fmt(e.value)}</span>}
                          <Mark t={e.tone} />
                        </div>
                      </m.div>
                    ))}
                  </AnimatePresence>
                  {chain.length === 0 && <span className="font-mono text-xs text-muted">null</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MapViz({ p }: { p: MapPanel }) {
  return (
    <div className="mx-auto w-fit min-w-48 overflow-hidden rounded-lg border border-line">
      <table className="w-full font-mono text-sm">
        <thead className="bg-card text-xs text-muted">
          <tr>
            <th className="px-3 py-1.5 text-left font-semibold">{p.keyLabel ?? 'key'}</th>
            <th className="px-3 py-1.5 text-left font-semibold">{p.valueLabel ?? 'value'}</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {p.entries.map((e) => (
              <m.tr
                key={fmt(e.key)}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`tone ${tone(e.tone)} border-t border-line`}
              >
                <td className="px-3 py-1.5 font-semibold">{fmt(e.key)}</td>
                <td className="px-3 py-1.5">{fmt(e.value)}</td>
              </m.tr>
            ))}
          </AnimatePresence>
          {p.entries.length === 0 && (
            <tr>
              <td colSpan={2} className="px-3 py-2 text-center text-xs text-muted">
                khaali
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
