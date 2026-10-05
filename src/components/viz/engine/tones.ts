import type { Panel, Tone } from './types';

export const TONE_LABEL: Record<Tone, string> = {
  active: 'abhi yahan',
  compare: 'compare',
  swap: 'swap',
  done: 'ho gaya',
  found: 'mil gaya',
  error: 'galat',
  new: 'naya',
  muted: 'ignore',
};

/** small glyph so meaning is not colour-only */
export const TONE_MARK: Partial<Record<Tone, string>> = { done: '✓', found: '★', error: '✗' };

export const tone = (t?: Tone) => `tone-${t ?? 'none'}`;

const POINTER_CYCLE: Tone[] = ['active', 'compare', 'swap', 'new', 'found'];
export const pointerTone = (t: Tone | undefined, i: number): Tone => t ?? POINTER_CYCLE[i % POINTER_CYCLE.length];

export function collectTones(panels: Panel[]): Tone[] {
  const out = new Set<Tone>();
  const add = (t?: Tone) => t && out.add(t);
  const addMap = (m?: Record<string | number, Tone>) => m && Object.values(m).forEach(add);
  for (const p of panels) {
    switch (p.kind) {
      case 'array':
      case 'bars':
      case 'stack':
      case 'queue':
      case 'deque':
      case 'ring':
        addMap(p.tones);
        if (p.kind === 'array') p.ranges?.forEach((r) => add(r.tone));
        break;
      case 'grid':
        addMap(p.tones);
        break;
      case 'memory':
        p.cells.forEach((c) => add(c.tone));
        break;
      case 'list':
        p.nodes.forEach((n) => add(n.tone));
        break;
      case 'hash':
        addMap(p.bucketTones);
        p.buckets.flat().forEach((e) => add(e.tone));
        break;
      case 'map':
        p.entries.forEach((e) => add(e.tone));
        break;
      case 'tree':
        p.nodes.forEach((n) => add(n.tone));
        addMap(p.edgeTones);
        break;
      case 'graph':
        p.nodes.forEach((n) => add(n.tone));
        p.edges.forEach((e) => add(e.tone));
        break;
      case 'recursion':
        p.calls.forEach((c) => add(c.tone ?? (c.state === 'active' ? 'active' : c.state === 'done' ? 'done' : undefined)));
        break;
      case 'text':
        add(p.tone);
        break;
      case 'chart':
        break;
    }
  }
  return [...out];
}
