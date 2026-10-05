'use client';

import { useRef, type ReactNode } from 'react';
import { useElementWidth } from '../engine/hooks';

/** Draws an SVG at natural size, shrinks to fit the container, but never below `minScale` (then scrolls). */
export function ScaledSvg({
  width,
  height,
  minScale = 0.6,
  label,
  children,
}: {
  width: number;
  height: number;
  minScale?: number;
  label?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cw = useElementWidth(ref);
  const scale = cw > 0 ? Math.max(minScale, Math.min(1, cw / width)) : 1;
  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${width} ${height}`}
        width={width * scale}
        height={height * scale}
        className="mx-auto block overflow-visible"
      >
        {children}
      </svg>
    </div>
  );
}
