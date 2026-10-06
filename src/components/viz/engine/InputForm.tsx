'use client';

import { useState } from 'react';
import { formatInput, parseInputs, type InputSpec, type InputValues, type Tracer } from './tracer';

function hintFor(s: InputSpec): string {
  switch (s.type) {
    case 'int':
      return `${s.min} se ${s.max} tak`;
    case 'intArray':
      return `comma se alag, ${s.minLen}–${s.maxLen} numbers${s.sorted ? ', sorted' : ''}${s.distinct ? ', sab alag' : ''}`;
    case 'string':
      return `${s.minLen}–${s.maxLen} characters`;
    case 'intGrid':
      return `rows ko ; se alag karo (jaise 1 2; 3 4), max ${s.maxRows}×${s.maxCols}`;
    case 'charGrid':
      return `rows ko ; se alag karo (jaise ${s.charset.slice(0, 2).repeat(2)}; ...), max ${s.maxRows}×${s.maxCols}`;
    case 'edges': {
      const lo = s.base ?? 0;
      return `jaise ${lo}-${lo + 1}, ${lo + 1}-${lo + 2}${s.weighted ? ` (weight ke saath: ${lo}-${lo + 1}:4)` : ''}; nodes ${lo}–${lo + s.nodes - 1}`;
    }
    case 'tree':
      return `level order, # = khaali (jaise 3, 9, 20, #, #, 15, 7); max ${s.maxNodes} nodes${s.bst ? ', BST' : ''}`;
  }
}

export function InputForm({
  def,
  current,
  onApply,
  onReset,
}: {
  def: Tracer;
  current: InputValues;
  onApply: (v: InputValues) => void;
  onReset: () => void;
}) {
  const [raw, setRaw] = useState<Record<string, string>>(() =>
    Object.fromEntries(def.inputs.map((s) => [s.name, formatInput(s, current[s.name])])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formErr, setFormErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = parseInputs(def.inputs, raw);
    if (!r.ok) {
      setErrors(r.errors);
      setFormErr(null);
      return;
    }
    setErrors({});
    const msg = def.check?.(r.value) ?? null;
    setFormErr(msg);
    if (!msg) onApply(r.value);
  };

  return (
    <form onSubmit={submit} className="space-y-3 border-b border-line bg-card px-3 py-3">
      {def.inputs.map((s) => {
        const multi = s.type === 'intGrid' || s.type === 'charGrid' || s.type === 'edges';
        const common = {
          id: `in-${s.name}`,
          value: raw[s.name],
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setRaw({ ...raw, [s.name]: e.target.value }),
          'aria-invalid': !!errors[s.name],
          className: `w-full rounded-md border bg-bg px-2.5 py-2 font-mono text-sm outline-none focus:border-accent ${
            errors[s.name] ? 'border-red-500' : 'border-line'
          }`,
          spellCheck: false,
          autoCapitalize: 'off',
          autoComplete: 'off',
        };
        return (
          <div key={s.name}>
            <label htmlFor={common.id} className="mb-1 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
              {s.label}
              <span className="text-xs font-normal text-muted">{s.hint ?? hintFor(s)}</span>
            </label>
            {multi ? <textarea rows={2} {...common} /> : <input inputMode={s.type === 'string' ? 'text' : 'numeric'} {...common} />}
            {errors[s.name] && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[s.name]}</p>}
          </div>
        );
      })}
      {formErr && <p className="text-sm text-red-600 dark:text-red-400">{formErr}</p>}
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90">
          Chalao ▶
        </button>
        <button
          type="button"
          onClick={() => {
            setRaw(Object.fromEntries(def.inputs.map((s) => [s.name, formatInput(s, s.default)])));
            setErrors({});
            setFormErr(null);
            onReset();
          }}
          className="rounded-md border border-line px-4 py-2 text-sm hover:border-accent"
        >
          Default wapas
        </button>
      </div>
    </form>
  );
}
