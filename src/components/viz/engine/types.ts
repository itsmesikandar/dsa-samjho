export type Tone = 'active' | 'compare' | 'swap' | 'done' | 'found' | 'error' | 'new' | 'muted';
export type Cell = number | string | null;
export type Prim = string | number | boolean | null;
/** index → tone */
export type ToneMap = Record<number, Tone>;

export interface ArrPointer {
  name: string;
  index: number;
  tone?: Tone;
}
export interface ArrRange {
  from: number;
  to: number;
  tone?: Tone;
  label?: string;
}

export interface ArrayPanel {
  kind: 'array';
  label?: string;
  /** null = khaali slot */
  values: Cell[];
  /** stable ids → movement animation (swap/shift) */
  ids?: string[];
  tones?: ToneMap;
  /** index -1 or n allowed (pointer just outside array) */
  pointers?: ArrPointer[];
  ranges?: ArrRange[];
  hideIndex?: boolean;
  /** show address row: base + i * size */
  address?: { base: number; size: number };
}

export interface MemoryCell {
  value?: Cell;
  tone?: Tone;
  tag?: string;
}
export interface MemoryPanel {
  kind: 'memory';
  label?: string;
  start: number;
  /** bytes per cell (default 4) */
  step?: number;
  cells: MemoryCell[];
  /** cell index → cell index */
  arrows?: { from: number; to: number; tone?: Tone }[];
}

export interface GridPanel {
  kind: 'grid';
  label?: string;
  values: Cell[][];
  /** "r,c" → tone */
  tones?: Record<string, Tone>;
  rowLabels?: string[];
  colLabels?: string[];
  corner?: string;
}

export interface BarsPanel {
  kind: 'bars';
  label?: string;
  values: number[];
  ids?: string[];
  tones?: ToneMap;
  pointers?: ArrPointer[];
}

export interface ListNode {
  id: string;
  value: Cell;
  /** id of next node; null = null pointer; undefined = no arrow drawn */
  next?: string | null;
  prev?: string | null;
  tone?: Tone;
}
export interface ListPanel {
  kind: 'list';
  label?: string;
  /** display order (left → right) */
  nodes: ListNode[];
  pointers?: { name: string; at: string | null; tone?: Tone }[];
  doubly?: boolean;
}

export interface LinearPanel {
  kind: 'stack' | 'queue' | 'deque';
  label?: string;
  /** stack: index 0 = bottom. queue/deque: index 0 = front */
  items: Cell[];
  ids?: string[];
  tones?: ToneMap;
}

export interface RingPanel {
  kind: 'ring';
  label?: string;
  slots: Cell[];
  front: number;
  rear: number;
  tones?: ToneMap;
}

export interface HashEntry {
  key: Cell;
  value?: Cell;
  tone?: Tone;
  id?: string;
}
export interface HashPanel {
  kind: 'hash';
  label?: string;
  buckets: HashEntry[][];
  bucketTones?: ToneMap;
  /** e.g. "hash(23) = 23 % 7 = 2" */
  calc?: string;
}

export interface MapPanel {
  kind: 'map';
  label?: string;
  keyLabel?: string;
  valueLabel?: string;
  entries: { key: Cell; value: Cell; tone?: Tone }[];
}

export interface TreeNode {
  id: string;
  value: Cell;
  left?: string | null;
  right?: string | null;
  tone?: Tone;
  badge?: string;
}
export interface TreePanel {
  kind: 'tree';
  label?: string;
  root: string | null;
  nodes: TreeNode[];
  pointers?: { name: string; at: string; tone?: Tone }[];
  /** "parentId>childId" → tone */
  edgeTones?: Record<string, Tone>;
}

export interface GraphNode {
  id: string;
  label?: string;
  /** 0..100 (optional; circle layout if missing) */
  x?: number;
  y?: number;
  tone?: Tone;
  badge?: string;
}
export interface GraphEdge {
  from: string;
  to: string;
  w?: number;
  tone?: Tone;
}
export interface GraphPanel {
  kind: 'graph';
  label?: string;
  directed?: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CallNode {
  id: string;
  parent?: string;
  label: string;
  state: 'active' | 'waiting' | 'done';
  ret?: string;
  tone?: Tone;
}
export interface RecursionPanel {
  kind: 'recursion';
  label?: string;
  calls: CallNode[];
}

export interface ChartSeries {
  label: string;
  points: [number, number][];
  tone?: Tone;
}
export interface ChartPanel {
  kind: 'chart';
  label?: string;
  series: ChartSeries[];
  marker?: number;
  xLabel?: string;
  yLabel?: string;
  yMax?: number;
}

export interface TextPanel {
  kind: 'text';
  label?: string;
  text: string;
  tone?: Tone;
}

export type Panel =
  | ArrayPanel
  | MemoryPanel
  | GridPanel
  | BarsPanel
  | ListPanel
  | LinearPanel
  | RingPanel
  | HashPanel
  | MapPanel
  | TreePanel
  | GraphPanel
  | RecursionPanel
  | ChartPanel
  | TextPanel;

export interface Frame {
  /** Hinglish: WHY this step happens */
  caption: string;
  /** code-sync marker name (//@name in code files) */
  line?: string;
  vars?: Record<string, Prim>;
  panels: Panel[];
}
