export function startRotation(
  root: ParentNode,
  opts: { intervalMs: number; reducedMotion: boolean },
): () => void {
  if (opts.reducedMotion) return () => {};
  const id = setInterval(() => {
    root.querySelectorAll('[data-rotate]').forEach((list) => {
      // WCAG 2.2.2: se pausa mientras el piso o la tarjeta de la lista tiene el puntero o el foco.
      const box = list.closest('.floor, .card') ?? list;
      if (list.hasAttribute('data-paused') || box.matches(':hover, :focus-within')) return;
      const items = [...list.children];
      if (items.length < 2) return;
      const i = items.findIndex((c) => !c.hasAttribute('hidden'));
      items.forEach((c, n) => c.toggleAttribute('hidden', n !== (i + 1) % items.length));
    });
  }, opts.intervalMs);
  return () => clearInterval(id);
}
