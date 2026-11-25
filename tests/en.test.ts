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
import { proyectosDe } from '../src/lib/uso';
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
      expect(oficiosEn[i].area).not.toBe(o.area);
      expect(oficiosEn[i].tags).toEqual(o.tags);
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
    expect(text(en.querySelector('h1'))).toBe('I build systems end to end, alongside Claude.');
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
    expect([...en.querySelectorAll('#oficios h3')].map(text)).toEqual(oficiosEn.map((o) => o.area));
    expect(text(en.querySelector('#top h1'))).toBe('I build systems end to end, alongside Claude.');
    expect(enHtml).not.toMatch(/Foreman|Master builder|Stunt double|Archivist/);
  });
  it('la obra dice las áreas en inglés', () => {
    const nombres = [...en.querySelectorAll('#top [data-obra] button.quien')].map((b) => b.getAttribute('aria-label'));
    expect(nombres).toContain('Planning and method');
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

describe('/en/ · areas', () => {
  const paneles = () => [...en.querySelectorAll('#oficios .panel-area')];
  it('six native tabs labelled with their area, the first one chosen', () => {
    const radios = [...en.querySelectorAll('#oficios input[type="radio"][name="area"]')];
    expect(radios.length).toBe(6);
    radios.forEach((r, i) => expect(text(en.querySelector(`#oficios label[for="${r.id}"]`))).toBe(oficiosEn[i].area));
    expect(radios[0].hasAttribute('checked')).toBe(true);
  });
  it('each panel has its area, tools and usage', () => {
    expect(paneles().map((p) => text(p.querySelector('h3')))).toEqual(oficiosEn.map((o) => o.area));
    oficiosEn.forEach((o, i) => {
      const lis = [...paneles()[i].querySelectorAll('li')];
      expect(lis.map((li) => text(li.querySelector('.herr')))).toEqual(o.tags);
      o.tags.forEach((tag, j) => {
        const usados = proyectosDe(tag, corallEn);
        const n = lis[j].querySelector('.n');
        if (usados.length === 0) return expect(n, tag).toBeNull();
        expect(text(n), tag).toBe(String(usados.length));
        expect(n?.getAttribute('title'), tag).toBe(usados.join(', '));
      });
    });
  });
  it('Used on, everyday tools and the credential', () => {
    expect(text(paneles()[1])).toContain('Used on: Totem Multimedia, Corall-ERP, MaqinPro, Comphill. The number is how many projects I used it on.');
    expect(text(paneles()[5])).toContain('Everyday tools; not yet tied to a CorAll project on the timeline.');
    expect(text(paneles()[0])).toContain(oficiosEn[0].cert);
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

describe('/en/ · cycle of how I work', () => {
  const pasos: [string, string, string, string][] = [
    ['Understand', 'Before writing code: what is needed, for whom and with what real data.', 'In the hero: the reference was runkiri.com', 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md'],
    ['Decide', 'Sketches to compare and a written design I approve before building.', 'In the hero: 2 sketches, I picked the mix and approved the design', 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md'],
    ['Build alongside Claude', 'A plan of small tasks, each with its tests written before the code.', 'In the hero: a 4-task plan', 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/plans/2026-11-23-hero-obra-viva.md'],
    ['Review', 'A review of each task and of the whole change, measurement and live verification.', 'In the hero: 184 tests on every deploy', 'https://github.com/BMarin2003/portafolio-bmarin2003/actions'],
  ];
  it('tiene 4 pasos con su frase y su prueba enlazada', () => {
    const arts = [...en.querySelectorAll('#ia article')];
    expect(arts.map((a) => text(a.querySelector('h3')))).toEqual(pasos.map((p) => p[0]));
    pasos.forEach(([, frase, prueba, href], i) => {
      expect(text(arts[i])).toContain(frase);
      const a = arts[i].querySelector('a');
      expect(text(a)).toBe(prueba);
      expect(a?.getAttribute('href')).toBe(href);
    });
  });
  it('cierra enlazando a la carpeta de diseños y planes', () => {
    const a = en.querySelector('#ia .ciclo-cierre a');
    expect(text(a?.parentElement)).toBe('The design and plan of every part of this site are in its repository: see the process on GitHub →');
    expect(a?.getAttribute('href')).toBe('https://github.com/BMarin2003/portafolio-bmarin2003/tree/main/docs/superpowers');
  });
  it('la cinta y el bloque son decorativos', () => {
    expect(en.querySelector('#ia .cinta')?.getAttribute('aria-hidden')).toBe('true');
    expect(en.querySelector('#ia .bloque')?.getAttribute('aria-hidden')).toBe('true');
  });
});
