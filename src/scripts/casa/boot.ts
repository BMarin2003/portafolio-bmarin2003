import type { MountScene } from './scene';
import type { initCasaUI } from './ui';

type CasaUI = ReturnType<typeof initCasaUI>;

/** Monta la escena PixiJS encima de la imagen estática si se puede; si no, la página DOM queda tal cual. */
export async function bootCasa(
  root: HTMLElement,
  deps: { reducedMotion: boolean; ui: CasaUI; loadScene: () => Promise<{ mountScene: MountScene }> },
): Promise<'static' | 'scene' | 'error'> {
  if (deps.reducedMotion) return 'static';
  const container = root.querySelector<HTMLElement>('[data-scene]');
  try {
    if (!container) throw new Error('falta [data-scene]');
    const { mountScene } = await deps.loadScene();
    await mountScene(container, { open: deps.ui.open, onFase: deps.ui.onFase, fase: deps.ui.getFase() });
    return 'scene';
  } catch (err) {
    container?.querySelector('img')?.style.removeProperty('visibility');
    console.warn('La escena de la casa no cargó; queda la imagen estática.', err);
    return 'error';
  }
}
