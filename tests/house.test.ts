import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import House from '../src/components/House.astro';
import { bands, games, screens } from '../src/data/site';

let doc: Document;

beforeAll(async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(House);
  const win = new Window();
  win.document.body.innerHTML = html;
  doc = win.document as unknown as Document;
});

const visible = (sel: string) =>
  [...doc.querySelectorAll(`${sel} > *`)].filter((e) => !e.hasAttribute('hidden')).map((e) => e.textContent?.trim());
const hidden = (sel: string) =>
  [...doc.querySelectorAll(`${sel} > *`)].filter((e) => e.hasAttribute('hidden')).map((e) => e.textContent?.trim());

describe('House', () => {
  it('enlaza los dos pisos', () => {
    expect(doc.querySelector('a[href="#taller"]')).not.toBeNull();
    expect(doc.querySelector('a[href="#cuarto"]')).not.toBeNull();
  });
  // fase 2: la Task 3 reemplaza este componente
  it.skip('tiene 5 muñequitos en el taller', () => {
    expect(doc.querySelectorAll('[data-floor="taller"] [data-bot]').length).toBe(5);
  });
  it.each([
    ['[data-screen="pc"] [data-rotate]', games.map((g) => g.title)],
    ['[data-screen="tv"] [data-rotate]', screens.map((s) => s.title)],
    ['[data-speaker] [data-rotate]', bands],
  ])('%s muestra el primero y esconde el resto', (sel, items) => {
    expect(visible(sel)).toEqual([items[0]]);
    expect(hidden(sel)).toEqual(items.slice(1));
  });
  it('data-rotate no va en el contenedor data-speaker', () => {
    expect(doc.querySelector('[data-speaker][data-rotate]')).toBeNull();
  });
});
