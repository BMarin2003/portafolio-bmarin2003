import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import Index from '../src/pages/index.astro';
import IndexEn from '../src/pages/en/index.astro';
import CasaEn from '../src/pages/en/casa.astro';
import { corall, oficios, screens } from '../src/data/site';
import { corallEn, oficiosEn, screensEn } from '../src/data/site.en';
import { href, otraRuta } from '../src/i18n';
import { opening, peopleGroups, separator } from '../src/lib/text';
import { cronologico, periodo } from '../src/lib/periodo';
import { findPlaceholders } from '../scripts/check-placeholders.mjs';

const parse = (html: string) => {
  const win = new Window();
  win.document.write(html);
  return win.document as unknown as Document;
};
const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

let es: Document;
let en: Document;
let casa: Document;
let enHtml: string;
let casaHtml: string;

beforeAll(async () => {
  const c = await AstroContainer.create({ astroConfig: { site: 'https://example.com' } as never });
  es = parse(await c.renderToString(Index, { request: new Request('https://example.com/') }));
  enHtml = await c.renderToString(IndexEn, { request: new Request('https://example.com/en/') });
  casaHtml = await c.renderToString(CasaEn, { request: new Request('https://example.com/en/casa') });
  en = parse(enHtml);
  casa = parse(casaHtml);
});

describe('rutas', () => {
  it('el inglés va bajo /en y cada página apunta a su par', () => {
    expect(href('en', '/')).toBe('/en/');
    expect(href('en', '/casa')).toBe('/en/casa');
    expect(href('es', '/casa')).toBe('/casa');
    expect(otraRuta('/')).toEqual({ lang: 'en', path: '/en/' });
    expect(otraRuta('/casa')).toEqual({ lang: 'en', path: '/en/casa' });
    expect(otraRuta('/en/casa')).toEqual({ lang: 'es', path: '/casa' });
    expect(otraRuta('/en/')).toEqual({ lang: 'es', path: '/' });
  });
});

describe('datos en inglés', () => {
  it('cambian solo los textos: mismas personas, sprites, etiquetas y enlaces', () => {
    corall.forEach((p, i) => {
      expect(corallEn[i]).toMatchObject({ name: p.name, sprite: p.sprite, people: p.people });
      expect(corallEn[i].did).not.toBe(p.did);
      expect(Boolean(corallEn[i].challenge)).toBe(Boolean(p.challenge));
    });
    oficios.forEach((o, i) => {
      expect(oficiosEn[i].sprite).toBe(o.sprite);
      expect(oficiosEn[i].oficio).not.toBe(o.oficio);
      expect(oficiosEn[i].tags.length).toBe(o.tags.length);
    });
    expect(screensEn.map((s) => s.sourceUrl)).toEqual(screens.map((s) => s.sourceUrl));
    expect(screensEn.map((s) => s.title)).toContain('Django Unchained');
  });
});

describe('personas en inglés', () => {
  it('une con "and" y no concuerda en número', () => {
    expect(separator(0, 2, 'en')).toBe(' and ');
    const g = peopleGroups({ companeros: [{ name: 'A' }], supervisores: [], gerentes: [{ name: 'B' }, { name: 'C' }] }, 'en');
    expect(g.map((x) => x.label)).toEqual(['teammate', 'managers']);
    expect(opening(g, 'en')).toBe('With my esteemed');
  });
});

describe('/en/', () => {
  it('declara el idioma y el par en español', () => {
    expect(en.documentElement.getAttribute('lang')).toBe('en');
    expect(en.querySelector('link[rel="alternate"][hreflang="es"]')?.getAttribute('href')).toBe('https://example.com/');
    expect(en.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('en_US');
    expect(es.querySelector('link[rel="alternate"][hreflang="en"]')?.getAttribute('href')).toBe('https://example.com/en/');
  });
  it('muestra los proyectos y oficios en inglés', () => {
    expect(text(en.querySelector('h1'))).toBe('I build systems with a crew of trades.');
    expect(text(en.querySelector('#proyectos > p.seccion-lede'))).toBe('Since I joined CorAll, in order: what I did on each project and with whom.');
    const articles = [...en.querySelectorAll('#proyectos article')];
    const orden = cronologico(corallEn);
    expect(articles.map((a) => text(a.querySelector('h3')))).toEqual(orden.map((p) => p.name));
    orden.forEach((p, i) => {
      const d = articles[i].querySelector('details');
      expect(text(d?.querySelector(':scope > summary'))).toBe('what I did and with whom');
      expect(text(articles[i].querySelector('.periodo'))).toBe(periodo(p.desde, p.hasta, 'en'));
      expect(text(articles[i].querySelector('.commits'))).toBe(`${p.commits} commits`);
      expect(text(articles[i].querySelector('.resumen'))).toBe(p.resumen);
      expect([...articles[i].querySelectorAll('.stack li')].map(text)).toEqual(p.stack);
      expect(text(d)).toContain(p.did);
      expect(text(d)).toContain('With my esteemed');
      if (p.challenge) expect(text(d?.querySelector('[data-challenge]'))).toBe(`The challenge: ${p.challenge}`);
    });
    const maqinpro = articles.find((a) => text(a.querySelector('h3')) === 'MaqinPro');
    expect(text(maqinpro?.querySelector('.periodo'))).toBe('Aug 2026 – present');
    expect([...en.querySelectorAll('#oficios h3')].map(text)).toEqual(oficiosEn.map((o) => o.oficio));
  });
  it('la obra dice los oficios en inglés', () => {
    const nombres = [...en.querySelectorAll('#top [data-obra] button.quien')].map((b) => b.getAttribute('aria-label'));
    expect(nombres).toContain('Foreman: Planning and method');
    expect(nombres).toContain('Bryan Marin');
  });
  it('enlaza a la casa en inglés y al español', () => {
    expect(en.querySelectorAll('a[href="/en/casa"]').length).toBe(2);
    expect(en.querySelector('header a[hreflang="es"]')?.getAttribute('href')).toBe('/');
    expect(es.querySelector('header a[hreflang="en"]')?.getAttribute('href')).toBe('/en/');
  });
  it('solo carga el script de la obra ni deja corchetes', () => {
    expect((enHtml.match(/<script/gi) ?? []).length).toBeLessThanOrEqual(2);
    expect(enHtml).not.toMatch(/pixi/i);
    expect(findPlaceholders(enHtml)).toEqual([]);
  });
});

describe('/en/casa', () => {
  it('está en inglés, vuelve a /en/ y tiene la misma estructura accesible', () => {
    expect(casa.documentElement.getAttribute('lang')).toBe('en');
    expect(text(casa.querySelector('h1'))).toBe('The house, after 6');
    expect(text(casa.querySelector('a[href="/en/"]'))).toBe('← back to the site');
    expect([...casa.querySelectorAll('nav[aria-label="Objects in the house"] button')].map(text)).toEqual(['PC', 'TV', 'Speaker', 'RPG table', 'Shelf']);
    expect(casa.querySelectorAll('aside section[data-panel]').length).toBe(5);
    expect(text(casa.querySelector('[data-panel="mesa"] h2'))).toBe('D&D, then Cyberpunk RED');
    expect(casaHtml).toContain('Django Unchained');
    expect(findPlaceholders(casaHtml)).toEqual([]);
  });
});

describe('datos del recorrido en inglés', () => {
  it('conserva período, commits y stack; el resumen se traduce', () => {
    corallEn.forEach((p, i) => {
      const o = corall[i];
      expect({ desde: p.desde, hasta: p.hasta, commits: p.commits, stack: p.stack }).toEqual({ desde: o.desde, hasta: o.hasta, commits: o.commits, stack: o.stack });
      expect(p.resumen).not.toBe(o.resumen);
    });
  });
});
