import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import Taller from '../src/components/Taller.astro';
import Cuarto from '../src/components/Cuarto.astro';
import People from '../src/components/People.astro';
import Index from '../src/pages/index.astro';
import { bands, corall, crew, games, screens } from '../src/data/site';

const parse = (html: string) => {
  const win = new Window();
  win.document.body.innerHTML = html;
  return win.document as unknown as Document;
};

let taller: Document;
let cuarto: Document;
let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create({ astroConfig: { site: 'https://example.com' } as never });
  taller = parse(await container.renderToString(Taller));
  cuarto = parse(await container.renderToString(Cuarto));
});

const children = (doc: Document, sel: string) => [...doc.querySelectorAll(`${sel} > *`)];

describe('Taller', () => {
  it('lista los 6 proyectos en orden', () => {
    const names = [...taller.querySelectorAll('[data-project] h4')].map((e) => e.textContent?.trim());
    expect(names).toEqual(corall.map((p) => p.name));
  });
  it('lista la cuadrilla', () => {
    const names = [...taller.querySelectorAll('[data-crew-name]')].map((e) => e.textContent?.trim());
    expect(names).toEqual(crew.map((c) => c.name));
    expect(names.length).toBe(5);
  });
  it('muestra "El reto" solo en los proyectos que lo tienen', () => {
    const articles = [...taller.querySelectorAll('[data-project]')];
    corall.forEach((p, i) => {
      const reto = articles[i].querySelector('[data-challenge]');
      if (p.challenge) expect(reto?.textContent?.replace(/\s+/g, ' ').trim()).toBe(`El reto: ${p.challenge}`);
      else expect(reto).toBeNull();
    });
    expect(corall.find((p) => p.name === 'MaqinPro')?.challenge).toContain('En proceso en el taller');
  });
});

describe('People', () => {
  it('une los grupos y enlaza solo a quien tiene url', async () => {
    const html = await container.renderToString(People, {
      props: { people: { companeros: [{ name: 'Ana', url: 'https://a.dev' }, { name: 'Luis' }], supervisores: [], gerentes: [{ name: 'Rosa' }] } },
    });
    const doc = parse(html);
    expect(doc.body.textContent?.replace(/\s+/g, ' ').trim()).toBe('Con mis estimados compañeros Ana y Luis y gerente Rosa.');
    expect(doc.querySelectorAll('a').length).toBe(1);
    expect(doc.querySelector('a')?.getAttribute('href')).toBe('https://a.dev');
  });
  it('no renderiza nada si los tres grupos están vacíos', async () => {
    const html = await container.renderToString(People, { props: { people: { companeros: [], supervisores: [], gerentes: [] } } });
    expect(html.trim()).toBe('');
  });
});

describe('Cuarto', () => {
  it('menciona el rol', () => {
    expect(cuarto.body.textContent).toContain('D&D');
    expect(cuarto.body.textContent).toContain('Cyberpunk RED');
  });
  it.each([
    ['[data-card="pc"] [data-rotate]', games.map((g) => g.title)],
    ['[data-card="tv"] [data-rotate]', screens.map((s) => s.title)],
    ['[data-card="speaker"] [data-rotate]', bands],
  ])('%s muestra el primero y esconde el resto', (sel, items) => {
    const kids = children(cuarto, sel);
    expect(kids.length).toBe(items.length);
    expect(kids.map((k) => k.hasAttribute('hidden'))).toEqual(items.map((_, i) => i > 0));
    expect(kids[0].textContent).toContain(items[0]);
  });
  it('data-rotate no va en el contenedor de la tarjeta', () => {
    expect(cuarto.querySelector('[data-card][data-rotate]')).toBeNull();
  });
  it('cada juego y serie lleva crédito enlazado a su fuente', () => {
    for (const item of [...games, ...screens]) {
      const link = [...cuarto.querySelectorAll('a')].find((a) => a.getAttribute('href') === item.sourceUrl);
      expect(link, item.title).toBeTruthy();
      expect(link!.textContent).toContain(item.source);
      expect(link!.getAttribute('aria-label')).toBe(`${item.title} en ${item.source}`);
    }
  });
});

describe('Pie', () => {
  it('acredita a Claude', async () => {
    const doc = parse(await container.renderToString(Index, { request: new Request('https://example.com/') }));
    expect(doc.querySelector('footer')?.textContent).toContain('Construido junto a Claude (Anthropic)');
    expect(doc.querySelector('main')).not.toBeNull();
    expect(doc.querySelector('main footer')).toBeNull();
  });
});
