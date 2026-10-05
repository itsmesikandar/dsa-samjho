import type { Metadata } from 'next';
import { VizPlayer } from '@/components/viz/engine/VizPlayer';

export const metadata: Metadata = { title: 'Visualizer playground' };

const DEMOS = [
  { tracer: 'arrayDemo', title: 'ArrayViz — pointers, range, swap' },
  { tracer: 'memoryDemo', title: 'MemoryViz — scattered nodes + arrows' },
  { tracer: 'barsDemo', title: 'BarsViz — selection sort' },
  { tracer: 'gridDemo', title: 'GridViz — DP table' },
  { tracer: 'listDemo', title: 'LinkedListViz — reverse' },
  { tracer: 'stackQueueDemo', title: 'StackQueueViz — LIFO vs FIFO' },
  { tracer: 'ringDemo', title: 'Circular queue (ring)' },
  { tracer: 'hashDemo', title: 'HashTableViz — chaining + rehash' },
  { tracer: 'mapDemo', title: 'MapViz + TextViz — frequency count' },
  { tracer: 'treeDemo', title: 'TreeViz — BST insert' },
  { tracer: 'graphDemo', title: 'GraphViz — BFS' },
  { tracer: 'recursionDemo', title: 'RecursionTreeViz — fib(n)' },
  { tracer: 'chartDemo', title: 'ChartViz — Big-O growth' },
];

export default function Playground() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Visualizer playground</h1>
      <p className="mt-2 text-muted">Har visual type ka ek demo. Play dabao, step badlo, ya apna input daal ke dekho.</p>
      {DEMOS.map((d) => (
        <VizPlayer key={d.tracer} topicKey="playground" tracer={d.tracer} title={d.title} />
      ))}
    </div>
  );
}
