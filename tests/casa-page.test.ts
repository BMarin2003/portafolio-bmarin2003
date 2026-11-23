import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import Casa from '../src/pages/casa.astro';
import { bands, games, screens } from '../src/data/site';
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
  it('tiene 5 botones de objeto en orden', () => {
    const ids = [...casa.querySelectorAll('nav[aria-label="Objetos de la casa"] button[data-objeto]')].map((b) => b.getAttribute('data-objeto'));
    expect(ids).toEqual(['pc', 'tv', 'parlante', 'mesa', 'estante']);
  });
  it('tiene parlante, escena decorativa con imagen y panel en vivo', () => {
    expect(casa.querySelectorAll('[data-speaker]').length).toBe(1);
    const scene = casa.querySelector('[data-scene][aria-hidden="true"]');
    expect(scene?.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(casa.querySelector('aside[aria-live="polite"]')).not.toBeNull();
  });
  it('las 5 secciones de panel están en el HTML, cada una con su h2', () => {
    const secs = [...casa.querySelectorAll('aside section[data-panel]')];
    expect(secs.map((s) => s.getAttribute('data-panel'))).toEqual(['pc', 'tv', 'parlante', 'mesa', 'estante']);
    secs.forEach((s) => expect(s.querySelector('h2')).not.toBeNull());
  });
  it('cada juego y serie enlaza a su fuente con nombre accesible', () => {
    for (const item of [...games, ...screens]) {
      const link = [...casa.querySelectorAll('a')].find((a) => a.getAttribute('href') === item.sourceUrl);
      expect(link, item.title).toBeTruthy();
      expect(link!.textContent).toContain(item.source);
      expect(link!.getAttribute('aria-label')).toBe(`${item.title} vía ${item.source}`);
    }
  });
  it('trae rol, bandas y estante con contenido real', () => {
    const t = text(casa.body)!;
    expect(t).toContain('D&D');
    expect(t).toContain('Cyberpunk RED');
    bands.forEach((b) => expect(t).toContain(b));
    expect(t).toContain('Leo sobre historia');
  });
  it('vuelve a la obra, tiene reloj y botón de adelantar', () => {
    expect(text(casa.querySelector('a[href="/"]'))).toBe('← volver a la obra');
    expect(casa.querySelector('[data-reloj]')).not.toBeNull();
    expect(casa.querySelector('button[data-adelantar][aria-pressed="false"]')).not.toBeNull();
    expect(casa.querySelector('h1')).not.toBeNull();
  });
  it('no deja corchetes de marcador', () => {
    expect(findPlaceholders(html)).toEqual([]);
  });
});
