import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import Casa from '../src/pages/casa.astro';
import { bands, games, manuales, screens } from '../src/data/site';
import { findPlaceholders } from '../scripts/check-placeholders.mjs';

const parse = (html: string) => {
  const win = new Window();
  win.document.body.innerHTML = html;
  return win.document as unknown as Document;
};
const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

let html: string;
let casa: Document;

beforeAll(async () => {
  const container = await AstroContainer.create({ astroConfig: { site: 'https://example.com' } as never });
  html = await container.renderToString(Casa, { request: new Request('https://example.com/casa') });
  casa = parse(html);
});

describe('/casa accesible', () => {
  it('tiene 3 habitaciones en orden, cada una con su h2', () => {
    const habs = [...casa.querySelectorAll('section.hab')];
    expect(habs.map((h) => h.getAttribute('data-hab'))).toEqual(['cuarto', 'sala', 'mesa']);
    expect(habs.map((h) => text(h.querySelector('h2')))).toEqual(['Juegos', 'Lo que veo', 'Rol']);
  });
  it('cada juego, serie, banda y manual enlaza a su fuente con nombre accesible', () => {
    for (const item of [...games, ...screens, ...bands, ...manuales]) {
      const link = [...casa.querySelectorAll('a')].find((a) => a.getAttribute('href') === item.sourceUrl);
      expect(link, item.title).toBeTruthy();
      expect(link!.textContent).toContain(item.source);
      expect(link!.getAttribute('aria-label')).toBe(`${item.title} vía ${item.source}`);
      if (item.cover) {
        const img = [...casa.querySelectorAll('img')].find((i) => i.getAttribute('alt') === item.title);
        expect(img, `img ${item.title}`).toBeTruthy();
      }
    }
  });
  it('los ítems sin portada son tarjeta de solo título', () => {
    for (const item of [...screens, ...manuales].filter((i) => !i.cover)) {
      expect(text(casa.body)).toContain(item.title);
      expect(casa.querySelector(`img[alt="${item.title}"]`)).toBeNull();
    }
  });
  it('el parlante rota las 5 bandas y tiene el bloque en vivo anunciado', () => {
    const sp = casa.querySelector('[data-speaker]')!;
    const bandas = [...sp.querySelectorAll('[data-rotate] > *')];
    expect(bandas.length).toBe(5);
    bandas.forEach((b) => expect(b.hasAttribute('hidden')).toBe(false));
    expect(sp.querySelector('[data-live] img[data-live-cover]')).not.toBeNull();
    const txt = sp.querySelector('[data-live-text]');
    expect(txt).not.toBeNull();
    expect(txt!.closest('[aria-live="polite"]')).not.toBeNull();
  });
  it('trae el texto de rol y la nota de créditos', () => {
    const t = text(casa.body)!;
    expect(t).toContain('Juego y dirijo D&D y Cyberpunk RED, en línea.');
    expect(t).toContain('Las portadas y los pósters son de sus dueños; se muestran como referencia.');
  });
  it('ya no queda nada de la escena vieja', () => {
    expect(text(casa.body)).not.toContain('Leo sobre historia');
    expect(html).not.toContain('data-adelantar');
    expect(html).not.toContain('data-objeto');
    expect(html.toLowerCase()).not.toContain('pixi');
  });
  it('vuelve a la obra, tiene reloj y h1', () => {
    expect(text(casa.querySelector('a[href="/"]'))).toBe('← volver a la obra');
    expect(casa.querySelector('[data-reloj]')).not.toBeNull();
    expect(text(casa.querySelector('h1'))).toBe('La casa, después de las 6');
  });
  it('las escenas son decorativas y no contienen nada enfocable', () => {
    const escenas = [...casa.querySelectorAll('.hab-escena')];
    expect(escenas.length).toBe(3);
    escenas.forEach((e) => {
      expect(e.getAttribute('aria-hidden')).toBe('true');
      expect(e.querySelector('a, button, input, [tabindex]')).toBeNull();
    });
  });
  it('no deja corchetes de marcador', () => {
    expect(findPlaceholders(html)).toEqual([]);
  });
});
