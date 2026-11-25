import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import Index from '../src/pages/index.astro';
import Casa from '../src/pages/casa.astro';
import { comoTrabajo, corall, oficios } from '../src/data/site';
import { cronologico, periodo } from '../src/lib/periodo';
import { proyectosDe } from '../src/lib/uso';

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

describe('/ · áreas', () => {
  const areas = ['Planificación y método', 'Backend y datos', 'Frontend y diseño', 'Infraestructura y despliegue', 'Calidad y seguridad', 'Documentación y conocimiento'];
  const paneles = () => [...index.querySelectorAll('#oficios .panel-area')];
  it('seis pestañas nativas, la primera elegida', () => {
    const radios = [...index.querySelectorAll('#oficios input[type="radio"][name="area"]')];
    expect(radios.length).toBe(6);
    radios.forEach((r, i) => {
      const label = index.querySelector(`#oficios label[for="${r.id}"]`);
      expect(text(label), areas[i]).toBe(areas[i]);
      expect(label?.querySelector('.spr')?.getAttribute('style')).toContain(`url(/sprites/${oficios[i].sprite}.png)`);
    });
    expect(radios[0].hasAttribute('checked')).toBe(true);
    expect(radios.slice(1).some((r) => r.hasAttribute('checked'))).toBe(false);
    const grupo = index.querySelector('#oficios [role="radiogroup"]');
    expect(grupo?.getAttribute('aria-labelledby')).toBe('oficios-h');
    expect(grupo?.querySelectorAll('input[type="radio"]').length).toBe(6);
  });
  it('cada panel tiene su área, herramientas y uso, sin nombres de oficio', () => {
    expect(paneles().map((p) => text(p.querySelector('h3')))).toEqual(areas);
    expect(indexHtml).not.toMatch(/Capataz|Maestro de obra|Decorador|Electricista|Doble de riesgo|Archivista/);
    oficios.forEach((o, i) => {
      const lis = [...paneles()[i].querySelectorAll('li')];
      expect(lis.map((li) => text(li.querySelector('.herr')))).toEqual(o.tags);
      o.tags.forEach((tag, j) => {
        const usados = proyectosDe(tag, corall);
        const n = lis[j].querySelector('.n');
        if (usados.length === 0) return expect(n, tag).toBeNull();
        expect(text(n), tag).toBe(String(usados.length));
        expect(n?.getAttribute('title'), tag).toBe(usados.join(', '));
        expect(text(lis[j].querySelector('.sr')), tag).toBe(`(${usados.join(', ')})`);
      });
    });
    expect(text(paneles()[1].querySelector('li .n'))).toBe('4');
  });
  it('En la obra', () => {
    expect(text(paneles()[1])).toContain('En la obra: Totem Multimedia, Corall-ERP, MaqinPro, Comphill. El número es en cuántos proyectos la usé.');
    expect(text(paneles()[5])).toContain('Herramientas de trabajo diario; todavía sin un proyecto de CorAll asociado en el recorrido.');
    expect(text(paneles()[5])).not.toContain('En la obra');
  });
  it('las etiquetas son herramientas, no prácticas', () => {
    const calidad = oficios.find((o) => o.sprite === 'doble')!;
    expect(calidad.tags).toEqual(['Playwright', 'Vitest', 'Testing Library', 'ESLint', 'axe', 'Lighthouse', 'Sentry', 'Postman']);
    expect(oficios.flatMap((o) => o.tags)).not.toContain('Caja negra');
  });
  it('el certificado queda en Planificación, sin datos personales', () => {
    expect(text(paneles()[0])).toContain('Programa de especialización en Metodologías Ágiles · IED Stratton · 120 h · 19/20');
    expect(paneles().slice(1).some((p) => text(p)?.includes('IED Stratton'))).toBe(false);
    expect(indexHtml).not.toMatch(/72539291/);
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
  it('el título del hero habla de punta a punta, junto a Claude', () => {
    expect(text(index.querySelector('#top h1'))).toBe('Construyo sistemas de punta a punta, junto a Claude.');
  });
  it('los monigotes de la obra son botones con su área', () => {
    const nombres = [...index.querySelectorAll('#top [data-obra] button.quien')].map((b) => b.getAttribute('aria-label'));
    expect(nombres).toContain('Planificación y método');
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
