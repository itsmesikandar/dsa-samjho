'use client';

/** header ke neeche chipka filter box (patterns, glossary) */
export function StickyFilter({ id, value, onChange, placeholder, label, status }: { id: string; value: string; onChange: (v: string) => void; placeholder: string; label: string; status: string }) {
  return (
    <div className="sticky top-14 z-10 -mx-4 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full rounded-lg border border-line bg-bg px-3 text-base outline-none placeholder:text-muted focus:border-accent"
      />
      <p aria-live="polite" className="mt-1.5 text-xs text-muted">
        {status}
      </p>
    </div>
  );
}

/** chapter / letter par kudne wale chhote chips */
export function JumpChips({ label, items }: { label: string; items: { href: string; text: string }[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label={label} className="mt-4 flex flex-wrap gap-1.5">
      {items.map((it) => (
        <a key={it.href} href={it.href} className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent">
          {it.text}
        </a>
      ))}
    </nav>
  );
}
