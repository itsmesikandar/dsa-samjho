/** small triangle arrowhead whose tip is at (x, y), pointing along (dx, dy) */
export function Arrowhead({ x, y, dx, dy, fill, size = 6 }: { x: number; y: number; dx: number; dy: number; fill?: string; size?: number }) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x - ux * size * 1.4;
  const by = y - uy * size * 1.4;
  const px = -uy * size * 0.75;
  const py = ux * size * 0.75;
  return <polygon points={`${x},${y} ${bx + px},${by + py} ${bx - px},${by - py}`} style={fill ? { fill } : { fill: 'var(--t-bd)' }} />;
}
