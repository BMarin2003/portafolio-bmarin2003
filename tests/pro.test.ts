import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import Index from '../src/pages/index.astro';
import Casa from '../src/pages/casa.astro';
import { comoTrabajo, corall, oficios } from '../src/data/site';
import { cronologico, periodo } from '../src/lib/periodo';

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
  const orden = cronologico(corall);
  const articles = () => [...index.querySelectorAll('#proyectos article')];
  it('lleva la entradilla de la sección', () => {
    expect(text(index.querySelector('#proyectos > p.seccion-lede'))).toBe('Desde que llegué a CorAll, en orden: lo que hice en cada obra y con quién.');
  });
  it('un article por proyecto, en orden cronológico', () => {
    const names = [...index.querySelectorAll('#proyectos .recorrido article.hito h3')].map(text);
    expect(names).toEqual(orden.map((p) => p.name));
    expect(names[0]).toBe('Totem Multimedia');
  });
  it('cada proyecto lleva el sprite de su oficio', () => {
    orden.forEach((p, i) => {
      const spr = articles()[i].querySelector('.spr');
      expect(spr?.getAttribute('style'), p.name).toContain(`url(/sprites/${p.sprite}.png)`);
    });
  });
  it('cada proyecto muestra período, commits, resumen y tecnologías', () => {
    orden.forEach((p, i) => {
      const a = articles()[i];
      const t = text(a) ?? '';
      expect(text(a.querySelector('.periodo')), p.name).toBe(periodo(p.desde, p.hasta, 'es'));
      expect(text(a.querySelector('.commits')), p.name).toBe(`${p.commits} commits`);
      expect(text(a.querySelector('.resumen')), p.name).toBe(p.resumen);
      expect(t).toContain(p.area);
      expect([...a.querySelectorAll('.stack li')].map(text)).toEqual(p.stack);
    });
  });
  it('el detalle está en un details: texto, personas y reto', () => {
    orden.forEach((p, i) => {
      const d = articles()[i].querySelector('details');
      expect(text(d?.querySelector(':scope > summary')), p.name).toBe('qué hice y con quién');
      const t = text(d) ?? '';
      expect(t).toContain(p.did);
      expect(t).toMatch(/Con mis? estimados? /);
      if (p.challenge) expect(d?.querySelector('[data-challenge]')).not.toBeNull();
    });
  });
  it('muestra "El reto" solo en los proyectos que lo tienen', () => {
    orden.forEach((p, i) => {
      const reto = articles()[i].querySelector('[data-challenge]');
      if (p.challenge) expect(text(reto)).toBe(`El reto: ${p.challenge}`);
      else expect(reto).toBeNull();
    });
    expect(corall.find((p) => p.name === 'MaqinPro')?.challenge).toContain('En proceso en el taller');
  });
  it('línea y monigotes decorativos', () => {
    const r = index.querySelector('#proyectos .recorrido');
    expect(r?.querySelector('.linea')?.getAttribute('aria-hidden')).toBe('true');
    expect(r?.querySelector('.caminante')?.getAttribute('aria-hidden')).toBe('true');
    expect(r?.querySelector('.caminante .spr')?.getAttribute('style')).toContain('url(/sprites/bryan.png)');
    const puntos = [...(r?.querySelectorAll('.hito .punto') ?? [])];
    expect(puntos.length).toBe(corall.length);
    for (const n of puntos) expect(n.getAttribute('aria-hidden')).toBe('true');
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
  it('el título del hero no cambia', () => {
    expect(text(index.querySelector('#top h1'))).toBe('Construyo sistemas con una cuadrilla de oficios.');
  });
  it('los monigotes de la obra son botones con su oficio', () => {
    const nombres = [...index.querySelectorAll('#top [data-obra] button.quien')].map((b) => b.getAttribute('aria-label'));
    expect(nombres).toContain('Capataz: Planificación y método');
    expect(nombres).toContain('Bryan Marin');
  });
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
  it('solo carga el script de la obra', () => {
    expect((indexHtml.match(/<script/gi) ?? []).length).toBeLessThanOrEqual(2);
    expect(indexHtml).not.toMatch(/pixi/i);
    expect(indexHtml).toContain("sessionStorage.getItem('obra-armada')");
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
