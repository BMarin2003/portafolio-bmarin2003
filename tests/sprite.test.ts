import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import Sprite from '../src/components/Sprite.astro';
import { spriteMeta } from '../src/lib/sprite-meta';

let container: Awaited<ReturnType<typeof AstroContainer.create>>;
beforeAll(async () => {
  container = await AstroContainer.create({ astroConfig: { site: 'https://example.com' } as never });
});

const span = async (props: Record<string, unknown>) => {
  const html = await container.renderToString(Sprite, { props });
  const win = new Window();
  win.document.body.innerHTML = html;
  return win.document.querySelector('span') as unknown as HTMLElement;
};

describe('spriteMeta', () => {
  it('da tamaño, fila y cuadros', () => {
    expect(spriteMeta('capataz', 'action')).toEqual({ width: 16, height: 16, row: 2, frames: 3 });
    expect(spriteMeta('bryan', 'sit')).toEqual({ width: 16, height: 24, row: 2, frames: 1 });
  });
  it('falla con sprite o animación inexistentes', () => {
    expect(() => spriteMeta('nadie', 'walk')).toThrow("sprite 'nadie' no existe");
    expect(() => spriteMeta('capataz', 'volar')).toThrow("sprite 'capataz' no tiene la animación 'volar'");
  });
});

describe('Sprite', () => {
  it('renderiza el span decorativo con las variables', async () => {
    const el = await span({ name: 'capataz', anim: 'walk', scale: 4 });
    expect(el.getAttribute('aria-hidden')).toBe('true');
    const style = el.getAttribute('style') ?? '';
    for (const s of ['url(/sprites/capataz.png)', '--s:4', '--row:1', '--n:4', '--cols:4']) expect(style).toContain(s);
    expect(el.className).toContain('spr-anim');
  });
  it('con paused no anima', async () => {
    const el = await span({ name: 'capataz', anim: 'idle', paused: true });
    expect(el.className).not.toContain('spr-anim');
    expect(el.getAttribute('style')).toContain('--s:3');
  });
  it('con un solo cuadro no anima', async () => {
    const el = await span({ name: 'bryan', anim: 'sit' });
    expect(el.className).not.toContain('spr-anim');
  });
});

describe('sprites.css', () => {
  it('apaga la animación con prefers-reduced-motion', () => {
    const css = readFileSync('src/styles/sprites.css', 'utf8');
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('animation: none');
  });
});
