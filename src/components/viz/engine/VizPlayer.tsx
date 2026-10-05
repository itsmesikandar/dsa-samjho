'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { LayoutGroup } from 'motion/react';
import { tracerLoaders } from '@/generated/tracers';
import type { CodeViews } from '@/lib/codefile';
import { CodePane } from '@/components/code/CodePane';
import { defaultInputs, isTracer, runTracer, type InputValues, type RunResult, type Tracer } from './tracer';
import { useNearViewport } from './hooks';
import { Caption, Legend, Panels, VarsPanel } from './Panels';
import { Controls } from './Controls';
import { InputForm } from './InputForm';
import { collectTones } from './tones';

const BASE_MS = 1500;

export interface VizPlayerProps {
  /** "<chapter>/<topic>" (or "playground") */
  topicKey: string;
  tracer: string;
  title?: string;
  code?: CodeViews;
}

export function VizPlayer(props: VizPlayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);
  const [def, setDef] = useState<Tracer | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    if (!near || def) return;
    let alive = true;
    const load = tracerLoaders[props.topicKey];
    if (!load) {
      setLoadErr(`Animation module "${props.topicKey}" nahi mila.`);
      return;
    }
    load()
      .then((mod) => {
        if (!alive) return;
        const t = (mod as Record<string, unknown>)[props.tracer];
        if (isTracer(t)) setDef(t);
        else setLoadErr(`Animation "${props.tracer}" nahi mila.`);
      })
      .catch(() => alive && setLoadErr('Animation load nahi hua. Page refresh karke dekho.'));
    return () => {
      alive = false;
    };
  }, [near, def, props.topicKey, props.tracer]);

  return (
    <div ref={ref} className="my-4 overflow-hidden rounded-xl border border-line bg-card/40">
      {def ? (
        <PlayerBody def={def} {...props} />
      ) : (
        <div className="flex min-h-56 items-center justify-center p-6 text-sm text-muted">{loadErr ?? 'Animation load ho raha hai…'}</div>
      )}
    </div>
  );
}

function safeRun(def: Tracer, input: InputValues): RunResult {
  try {
    return runTracer(def, input);
  } catch {
    return { frames: [], error: 'Is input pe animation nahi chal paya. Koi aur input try karo.' };
  }
}

function PlayerBody({ def, title, code }: { def: Tracer } & VizPlayerProps) {
  const groupId = useId();
  const [input, setInput] = useState<InputValues>(() => defaultInputs(def.inputs));
  const run = useMemo(() => safeRun(def, input), [def, input]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const total = run.frames.length;
  const cur = Math.min(step, Math.max(0, total - 1));
  const frame = run.frames[cur];

  useEffect(() => {
    if (!playing) return;
    if (cur >= total - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep(cur + 1), BASE_MS / speed);
    return () => clearTimeout(id);
  }, [playing, cur, total, speed]);

  const go = (s: number) => {
    setPlaying(false);
    setStep(Math.max(0, Math.min(total - 1, s)));
  };
  const toggle = () => {
    if (!playing && cur >= total - 1) setStep(0);
    setPlaying(!playing);
  };
  const apply = (v: InputValues) => {
    setInput(v);
    setStep(0);
    setPlaying(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return;
    if (e.key === 'ArrowRight') go(cur + 1);
    else if (e.key === 'ArrowLeft') go(cur - 1);
    else if (e.key === ' ') toggle();
    else return;
    e.preventDefault();
  };

  const tones = frame ? collectTones(frame.panels) : [];
  const single = total <= 1;

  return (
    <div role="group" aria-label={title ?? 'Animation'} tabIndex={0} onKeyDown={onKey} className="outline-none focus-visible:ring-2 focus-visible:ring-accent">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-card px-3 py-2">
        <span className="min-w-0 truncate text-sm font-semibold">{title ?? 'Animation'}</span>
        {def.inputs.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            aria-expanded={showForm}
            className="shrink-0 rounded-md border border-line bg-bg px-2.5 py-1 text-xs font-semibold hover:border-accent"
          >
            {showForm ? 'Band karo' : '✎ Apna input try karo'}
          </button>
        )}
      </div>
      {showForm && <InputForm def={def} current={input} onApply={apply} onReset={() => apply(defaultInputs(def.inputs))} />}
      {run.error && <p className="border-b border-line bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{run.error}</p>}
      {frame && (
        <div className="space-y-3 p-3">
          <LayoutGroup id={groupId}>
            <div className="py-2">
              <Panels panels={frame.panels} />
            </div>
          </LayoutGroup>
          <Legend tones={tones} labels={frame.legend} />
          {frame.vars && <VarsPanel vars={frame.vars} />}
          <div
            aria-live="polite"
            className="min-h-[4.5rem] rounded-lg border border-line bg-accent-soft px-3 py-2.5 text-[15px] leading-relaxed"
            onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
            onTouchEnd={(e) => {
              const s = touch.current;
              touch.current = null;
              if (!s) return;
              const dx = e.changedTouches[0].clientX - s.x;
              const dy = e.changedTouches[0].clientY - s.y;
              if (Math.abs(dx) > 50 && Math.abs(dx) > 2 * Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1));
            }}
          >
            <Caption text={frame.caption} />
          </div>
          {!single && <Controls step={cur} total={total} playing={playing} speed={speed} onStep={go} onToggle={toggle} onSpeed={setSpeed} />}
          {code && <CodePane views={code} active={frame.line} maxHeight="17rem" showOutput={false} />}
          {run.result !== undefined && cur === total - 1 && (
            <p className="text-sm">
              <span className="text-muted">Final answer: </span>
              <code className="rounded bg-bg px-1.5 py-0.5 font-mono font-semibold">{run.result}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
