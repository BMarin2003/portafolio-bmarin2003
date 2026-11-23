import type { Point } from './scene';

/** Posición sobre la ruta recorrida de ida y vuelta a `speed` px/s; `flip` si va hacia la izquierda. */
export function positionAt(route: Point[], speed: number, tMs: number): { x: number; y: number; flip: boolean } {
  if (route.length < 2) return { x: route[0].x, y: route[0].y, flip: false };
  const lens = route.slice(1).map((p, i) => Math.hypot(p.x - route[i].x, p.y - route[i].y));
  const total = lens.reduce((a, b) => a + b, 0);
  if (total === 0) return { x: route[0].x, y: route[0].y, flip: false };
  let d = ((speed * tMs) / 1000) % (2 * total);
  const back = d > total;
  if (back) d = 2 * total - d;
  let i = 0;
  while (i < lens.length - 1 && d > lens[i]) d -= lens[i++];
  const a = route[i];
  const b = route[i + 1];
  const k = lens[i] === 0 ? 0 : d / lens[i];
  const dx = b.x - a.x;
  return { x: a.x + dx * k, y: a.y + (b.y - a.y) * k, flip: back ? dx > 0 : dx < 0 };
}
