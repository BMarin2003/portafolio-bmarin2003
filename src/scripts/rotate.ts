export function startRotation(
  root: ParentNode,
  opts: { intervalMs: number; reducedMotion: boolean },
): () => void {
  if (opts.reducedMotion) return () => {};
  const id = setInterval(() => {
    root.querySelectorAll('[data-rotate]').forEach((list) => {
      if (list.hasAttribute('data-paused')) return;
      const items = [...list.children];
      if (items.length < 2) return;
      const i = items.findIndex((c) => !c.hasAttribute('hidden'));
      items.forEach((c, n) => c.toggleAttribute('hidden', n !== (i + 1) % items.length));
    });
  }, opts.intervalMs);
  return () => clearInterval(id);
}
