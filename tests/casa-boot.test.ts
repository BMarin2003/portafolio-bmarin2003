import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Index from '../src/pages/index.astro';
import { bootCasa } from '../src/scripts/casa/boot';
import type { MountScene } from '../src/scripts/casa/scene';

// Ventana de happy-dom propia: el Container API de Astro no renderiza dentro del entorno happy-dom.
function mount(): HTMLElement {
  const document = new Window().document as unknown as Document;
  document.body.innerHTML = `
  <main data-casa>
    <div class="casa-escena" data-scene aria-hidden="true"><img src="/casa-estatica.png" alt=""></div>
  </main>`;
  return document.querySelector('[data-casa]') as HTMLElement;
}

const fakeUI = () => ({
  open: vi.fn(),
  onFase: vi.fn(),
  getFase: () => 'dia' as const,
  setOffset: vi.fn(),
  destroy: vi.fn(),
});

let root: HTMLElement;
beforeEach(() => {
  root = mount();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('bootCasa', () => {
  it('con reducedMotion queda estática y no carga la escena', async () => {
    const loadScene = vi.fn();
    await expect(bootCasa(root, { reducedMotion: true, ui: fakeUI(), loadScene })).resolves.toBe('static');
    expect(loadScene).not.toHaveBeenCalled();
  });

  it('si la carga falla da error, no lanza y la imagen sigue visible', async () => {
    const loadScene = () => Promise.reject(new Error('sin red'));
    await expect(bootCasa(root, { reducedMotion: false, ui: fakeUI(), loadScene })).resolves.toBe('error');
    const img = root.querySelector<HTMLImageElement>('[data-scene] img')!;
    expect(img.style.visibility).not.toBe('hidden');
  });

  it('si el montaje falla da error y deja la imagen visible', async () => {
    const mountScene: MountScene = async (container) => {
      container.querySelector('img')!.style.visibility = 'hidden';
      throw new Error('sprite 404');
    };
    await expect(bootCasa(root, { reducedMotion: false, ui: fakeUI(), loadScene: async () => ({ mountScene }) })).resolves.toBe('error');
    expect(root.querySelector<HTMLImageElement>('[data-scene] img')!.style.visibility).not.toBe('hidden');
  });

  it('monta la escena en [data-scene] con open, onFase y la fase actual', async () => {
    const ui = fakeUI();
    const mountScene = vi.fn<MountScene>(async () => ({ destroy() {} }));
    await expect(bootCasa(root, { reducedMotion: false, ui, loadScene: async () => ({ mountScene }) })).resolves.toBe('scene');
    expect(mountScene).toHaveBeenCalledTimes(1);
    const [container, sceneUI] = mountScene.mock.calls[0];
    expect(container).toBe(root.querySelector('[data-scene]'));
    expect(sceneUI.fase).toBe('dia');
    sceneUI.open('tv');
    expect(ui.open).toHaveBeenCalledWith('tv');
    const cb = () => {};
    sceneUI.onFase(cb);
    expect(ui.onFase).toHaveBeenCalledWith(cb);
  });
});

describe('fase durante el montaje', () => {
  it('la escena lee la fase vigente, no la del inicio del montaje', async () => {
    const ui = fakeUI();
    let fase: 'dia' | 'noche' = 'dia';
    ui.getFase = () => fase as never;
    let leida: string | undefined;
    const mountScene: MountScene = async (_c, sceneUI) => {
      fase = 'noche'; // el reloj cambia de fase mientras se monta
      leida = sceneUI.fase;
      return { destroy() {} };
    };
    await bootCasa(root, { reducedMotion: false, ui, loadScene: async () => ({ mountScene }) });
    expect(leida).toBe('noche');
  });
});

describe('/ sin motor de juego', () => {
  it('el HTML de / no menciona pixi', async () => {
    const container = await AstroContainer.create({ astroConfig: { site: 'https://example.com' } as never });
    const html = await container.renderToString(Index, { request: new Request('https://example.com/') });
    expect(html.length).toBeGreaterThan(0);
    expect(html.toLowerCase()).not.toContain('pixi');
  });
});
