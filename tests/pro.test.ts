import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import Index from '../src/pages/index.astro';
import Casa from '../src/pages/casa.astro';
import { comoTrabajo, corall, oficios } from '../src/data/site';

const parse = (html: string) => {
  const win = new Window();
  win.document.body.innerHTML = html;
  return win.document as unknown as Document;
};
const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

let indexHtml: string;
let casaHtml: string;
let index: Document;
let casa: Document;

beforeAll(async () => {
  const container = await AstroContainer.create({ astroConfig: { site: 'https://example.com' } as never });
  indexHtml = await container.renderToString(Index, { request: new Request('https://example.com/') });
  casaHtml = await container.renderToString(Casa, { request: new Request('https://example.com/casa') });
  index = parse(indexHtml);
  casa = parse(casaHtml);
});

describe('/ · proyectos', () => {
  it('un article por proyecto, en el orden de corall', () => {
    const names = [...index.querySelectorAll('#proyectos article h3')].map(text);
    expect(names).toEqual(corall.map((p) => p.name));
  });
  it('cada proyecto lleva el sprite de su oficio', () => {
    const articles = [...index.querySelectorAll('#proyectos article')];
    corall.forEach((p, i) => {
      const spr = articles[i].querySelector('.spr');
      expect(spr?.getAttribute('style'), p.name).toContain(`url(/sprites/${p.sprite}.png)`);
    });
  });
  it('muestra el área, el texto completo y la frase de personas', () => {
    const articles = [...index.querySelectorAll('#proyectos article')];
    corall.forEach((p, i) => {
      const t = text(articles[i]) ?? '';
      expect(t).toContain(p.area);
      expect(t).toContain(p.did);
      expect(t).toMatch(/Con mis? estimados? /);
    });
  });
  it('muestra "El reto" solo en los proyectos que lo tienen', () => {
    const articles = [...index.querySelectorAll('#proyectos article')];
    corall.forEach((p, i) => {
      const reto = articles[i].querySelector('[data-challenge]');
      if (p.challenge) expect(text(reto)).toBe(`El reto: ${p.challenge}`);
      else expect(reto).toBeNull();
    });
    expect(corall.find((p) => p.name === 'MaqinPro')?.challenge).toContain('En proceso en el taller');
  });
});

describe('/ · oficios', () => {
  it('un article por oficio, en el orden de oficios', () => {
    const titles = [...index.querySelectorAll('#oficios article h3')].map(text);
    expect(titles).toEqual(oficios.map((o) => o.oficio));
  });
  it('cada oficio lleva su sprite, su área y sus etiquetas', () => {
    const articles = [...index.querySelectorAll('#oficios article')];
    oficios.forEach((o, i) => {
      expect(articles[i].querySelector('.spr')?.getAttribute('style')).toContain(`url(/sprites/${o.sprite}.png)`);
      expect(text(articles[i])).toContain(o.area);
      expect([...articles[i].querySelectorAll('li')].map(text)).toEqual(o.tags);
    });
  });
});

describe('/ · cómo trabajo', () => {
  it('tiene el título y el texto de comoTrabajo', () => {
    const ia = index.querySelector('#ia');
    expect(text(ia?.querySelector('h2'))).toBe('Con IA, sin dejar de aprender');
    expect(text(ia)).toContain(comoTrabajo.replace(/\s+/g, ' ').trim());
  });
});

describe('/ · página', () => {
  it('la escena de la obra tiene a los 6 oficios y a Bryan', () => {
    const urls = [...index.querySelectorAll('[data-obra] .spr')].map((s) => s.getAttribute('style') ?? '');
    for (const o of oficios) expect(urls.some((u) => u.includes(`url(/sprites/${o.sprite}.png)`)), o.sprite).toBe(true);
    expect(urls.some((u) => u.includes('url(/sprites/bryan.png)'))).toBe(true);
  });
  it('no nombra herramientas', () => {
    expect(indexHtml).not.toMatch(/hallmark|ponytail|superpowers|safety-net/i);
  });
  it('enlaza a /casa desde el encabezado y desde la puerta', () => {
    const toCasa = [...index.querySelectorAll('a[href="/casa"]')].map(text);
    expect(toCasa).toContain('la casa →');
    expect(toCasa.some((t) => t?.includes('entrar a la casa →'))).toBe(true);
  });
  it('enlaza a las secciones, a GitHub y a LinkedIn', () => {
    const hrefs = [...index.querySelectorAll('header a')].map((a) => a.getAttribute('href'));
    for (const h of ['#proyectos', '#oficios', '#ia', 'https://github.com/BMarin2003', 'https://www.linkedin.com/in/bmarin2003']) {
      expect(hrefs).toContain(h);
    }
  });
  it('no carga JavaScript propio', () => {
    expect(indexHtml).not.toMatch(/<script/i);
  });
  it('todo sprite es decorativo', () => {
    const sprites = [...index.querySelectorAll('.spr')];
    expect(sprites.length).toBeGreaterThan(0);
    for (const s of sprites) expect(s.getAttribute('aria-hidden')).toBe('true');
  });
  it('el pie acredita a Claude y queda fuera de main', () => {
    expect(index.querySelector('footer')?.textContent).toContain('Construido junto a Claude (Anthropic)');
    expect(index.querySelector('main')).not.toBeNull();
    expect(index.querySelector('main footer')).toBeNull();
  });
});

describe('/casa', () => {
  it('tiene el h1 de noche y el parlante', () => {
    expect(text(casa.querySelector('h1'))).toBe('La casa, después de las 6');
    expect(casa.querySelector('[data-speaker]')).not.toBeNull();
  });
  it('vuelve a la obra', () => {
    const back = casa.querySelector('a[href="/"]');
    expect(text(back)).toBe('← volver a la obra');
  });
  it('carga la rotación y el parlante', () => {
    expect(casaHtml).toMatch(/<script/i);
  });
  it('tiene el mismo pie que /', () => {
    expect(text(casa.querySelector('footer'))).toBe(text(index.querySelector('footer')));
  });
});
