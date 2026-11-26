import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import People from '../src/components/People.astro';

const parse = (html: string) => {
  const win = new Window();
  win.document.body.innerHTML = html;
  return win.document as unknown as Document;
};

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create({ astroConfig: { site: 'https://example.com' } as never });
});

describe('People', () => {
  it('une los grupos y enlaza solo a quien tiene url', async () => {
    const html = await container.renderToString(People, {
      props: { people: { companeros: [{ name: 'Ana', url: 'https://a.dev' }, { name: 'Luis' }], supervisores: [], gerentes: [{ name: 'Rosa' }] } },
    });
    const doc = parse(html);
    expect(doc.body.textContent?.replace(/\s+/g, ' ').trim()).toBe('Equipo: compañeros Ana y Luis; gerente Rosa.');
    expect(doc.querySelectorAll('a').length).toBe(1);
    expect(doc.querySelector('a')?.getAttribute('href')).toBe('https://a.dev');
  });
  it('no renderiza nada si los tres grupos están vacíos', async () => {
    const html = await container.renderToString(People, { props: { people: { companeros: [], supervisores: [], gerentes: [] } } });
    expect(html.trim()).toBe('');
  });
});
