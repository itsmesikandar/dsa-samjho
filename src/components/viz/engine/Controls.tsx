'use client';

const Icon = ({ d, fill }: { d: string; fill?: boolean }) => (
  <svg aria-hidden viewBox="0 0 24 24" width="20" height="20" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const btn = 'flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg text-fg hover:border-accent disabled:opacity-40 disabled:hover:border-line';

export function Controls({
  step,
  total,
  playing,
  speed,
  onStep,
  onToggle,
  onSpeed,
}: {
  step: number;
  total: number;
  playing: boolean;
  speed: number;
  onStep: (s: number) => void;
  onToggle: () => void;
  onSpeed: (s: number) => void;
}) {
  const last = total - 1;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-2">
        <button className={btn} onClick={() => onStep(0)} disabled={step === 0} aria-label="Shuru se (restart)">
          <Icon d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
        </button>
        <button className={btn} onClick={() => onStep(step - 1)} disabled={step === 0} aria-label="Pichla step">
          <Icon d="M15 18l-6-6 6-6" />
        </button>
        <button
          className="flex h-13 w-13 items-center justify-center rounded-full bg-accent text-accent-fg shadow-sm hover:opacity-90"
          onClick={onToggle}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Icon d="M8 5v14M16 5v14" /> : <Icon d="M7 4.5v15l12-7.5z" fill />}
        </button>
        <button className={btn} onClick={() => onStep(step + 1)} disabled={step >= last} aria-label="Agla step">
          <Icon d="M9 18l6-6-6-6" />
        </button>
        <span className="min-w-[4.5rem] text-center font-mono text-xs text-muted" aria-live="off">
          Step {step + 1}/{total}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted">
        <input
          type="range"
          min={0}
          max={Math.max(0, last)}
          value={step}
          onChange={(e) => onStep(Number(e.target.value))}
          aria-label="Step chuno"
          className="h-2 min-w-0 flex-1 cursor-pointer"
        />
        <label className="flex shrink-0 items-center gap-1.5">
          <span>Speed</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={speed}
            onChange={(e) => onSpeed(Number(e.target.value))}
            className="h-2 w-16 cursor-pointer"
          />
          <span className="w-7 font-mono">{speed}×</span>
        </label>
      </div>
    </div>
  );
}
