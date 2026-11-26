import { formatClock, msUntilNextMinute, trujilloHour } from '../../lib/casa/time';

/** Pinta `TRUJILLO · HH:MM` y lo refresca en cada minuto exacto. Devuelve la función que lo detiene. */
export function initReloj(
  el: HTMLElement,
  opts: { now?: () => Date; reducido?: boolean } = {},
): () => void {
  const now = opts.now ?? (() => new Date());
  const reducido = opts.reducido ?? (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const pintar = () => {
    el.textContent = `TRUJILLO · ${formatClock(trujilloHour(now()))}`;
    // Con movimiento reducido la hora no se actualiza sola: se pinta una vez y listo.
    if (!reducido) timer = setTimeout(pintar, msUntilNextMinute(now()));
  };
  pintar();

  return () => clearTimeout(timer);
}
