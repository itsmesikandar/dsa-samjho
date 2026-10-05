'use client';

import type { Panel, Prim, Tone } from './types';
import { tone, TONE_LABEL, TONE_MARK } from './tones';
import { ArrayViz, BarsViz } from '../panels/ArrayViz';
import { MemoryViz } from '../panels/MemoryViz';
import { GridViz, TextViz } from '../panels/GridViz';
import { RingViz, StackQueueViz } from '../panels/StackQueueViz';
import { HashTableViz, MapViz } from '../panels/HashViz';
import { LinkedListViz } from '../panels/LinkedListViz';
import { TreeViz } from '../panels/TreeViz';
import { GraphViz } from '../panels/GraphViz';
import { RecursionTreeViz } from '../panels/RecursionViz';
import { ChartViz } from '../panels/ChartViz';

function PanelView({ p }: { p: Panel }) {
  switch (p.kind) {
    case 'array':
      return <ArrayViz p={p} />;
    case 'bars':
      return <BarsViz p={p} />;
    case 'memory':
      return <MemoryViz p={p} />;
    case 'grid':
      return <GridViz p={p} />;
    case 'text':
      return <TextViz p={p} />;
    case 'stack':
    case 'queue':
    case 'deque':
      return <StackQueueViz p={p} />;
    case 'ring':
      return <RingViz p={p} />;
    case 'hash':
      return <HashTableViz p={p} />;
    case 'map':
      return <MapViz p={p} />;
    case 'list':
      return <LinkedListViz p={p} />;
    case 'tree':
      return <TreeViz p={p} />;
    case 'graph':
      return <GraphViz p={p} />;
    case 'recursion':
      return <RecursionTreeViz p={p} />;
    case 'chart':
      return <ChartViz p={p} />;
  }
}

export function Panels({ panels }: { panels: Panel[] }) {
  return (
    <div className="space-y-4">
      {panels.map((p, i) => (
        <div key={`${i}-${p.kind}`}>
          {p.label && <div className="mb-1.5 text-xs font-semibold text-muted">{p.label}</div>}
          <PanelView p={p} />
        </div>
      ))}
    </div>
  );
}

export function Legend({ tones }: { tones: Tone[] }) {
  if (tones.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted" aria-label="Rangon ka matlab">
      {tones.map((t) => (
        <li key={t} className="flex items-center gap-1">
          <span className={`tone ${tone(t)} inline-flex h-3 w-3 items-center justify-center rounded-sm border text-[8px] font-bold`}>
            {TONE_MARK[t] ?? ''}
          </span>
          {TONE_LABEL[t]}
        </li>
      ))}
    </ul>
  );
}

const fmtVar = (v: Prim) => (v === null ? 'null' : typeof v === 'string' ? v : String(v));

export function VarsPanel({ vars }: { vars: Record<string, Prim> }) {
  const entries = Object.entries(vars);
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Variables">
      {entries.map(([k, v]) => (
        <span key={k} className="rounded-md border border-line bg-bg px-2 py-0.5 font-mono text-xs">
          <span className="text-muted">{k}</span> = <span className="font-semibold">{fmtVar(v)}</span>
        </span>
      ))}
    </div>
  );
}

/** captions may use `code` spans */
export function Caption({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return (
    <>
      {parts.map((s, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-bg/70 px-1 font-mono text-[0.9em]">
            {s}
          </code>
        ) : (
          s
        ),
      )}
    </>
  );
}
