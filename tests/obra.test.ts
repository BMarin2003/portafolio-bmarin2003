import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import Obra from '../src/components/pro/Obra.astro';
import { oficios } from '../src/data/site';
import { contenido, type Lang } from '../src/i18n';
import { ENTRADA, ESCENA, cuadrilla, pies } from '../src/lib/obra';
import { spriteMeta } from '../src/lib/sprite-meta';

const ANCHO_MONIGOTE = 64;

describe('datos de la escena de la obra', () => {
  it('cada oficio está una vez, y Bryan también', () => {
    const sprites = cuadrilla.map((m) => m.sprite).sort();
    expect(sprites).toEqual([...oficios.map((o) => o.sprite), 'bryan'].sort());
  });

  it('la escalera llega del suelo al último piso', () => {
    const electricista = cuadrilla.find((m) => m.sprite === 'electricista');
    expect(electricista?.recorrido).toEqual({ tipo: 'sube', alto: ESCENA.suelo - ESCENA.pisos[3], s: 11 });
  });

  it('todos caben en la escena', () => {
    for (const m of cuadrilla) {
      expect(m.x).toBeGreaterThanOrEqual(0);
      expect(m.x + ANCHO_MONIGOTE).toBeLessThanOrEqual(ESCENA.ancho);
      if (m.recorrido?.tipo === 'ida') {
        expect(m.x + m.recorrido.dx + ANCHO_MONIGOTE).toBeLessThanOrEqual(ESCENA.ancho);
        expect(m.x + m.recorrido.dx).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('la entrada termina a tiempo', () => {
    for (const m of cuadrilla) {
      expect(m.llegada).toBeLessThanOrEqual(ENTRADA.total);
      if (m.piso !== 'suelo') expect(m.llegada).toBeGreaterThan(ENTRADA.pisos[m.piso]);
    }
  });

  it('pies devuelve la y del tablón o del suelo', () => {
    const base = { anim: 'idle' as const, x: 0, recorrido: null, llegada: 0, sprite: 'x' };
    expect(pies({ ...base, piso: 3 })).toBe(180);
    expect(pies({ ...base, piso: 'suelo' })).toBe(640);
  });
});

const docs = {} as Record<Lang, Document>;
beforeAll(async () => {
  const c = await AstroContainer.create({ astroConfig: { site: 'https://example.com' } as never });
  for (const lang of ['es', 'en'] as const) {
    const win = new Window();
    win.document.body.innerHTML = await c.renderToString(Obra, { props: { lang } });
    docs[lang] = win.document as unknown as Document;
  }
});

const boton = (doc: Document, sprite: string) =>
  [...doc.querySelectorAll('button.quien')].find((b) => b.querySelector('.spr')?.getAttribute('style')?.includes(`url(/sprites/${sprite}.png)`));

describe.each(['es', 'en'] as const)('Obra.astro (%s)', (lang) => {
  it('cada monigote es un botón, y nadie más', () => {
    const doc = docs[lang];
    expect(doc.querySelector('[data-obra]')?.classList.contains('obra-viva')).toBe(true);
    const botones = [...doc.querySelectorAll('button.quien')];
    expect(botones.length).toBe(7);
    for (const b of botones) {
      expect(b.getAttribute('type')).toBe('button');
      expect(b.closest('[aria-hidden="true"]')).toBeNull();
    }
  });

  it('los rótulos salen de los oficios del idioma', () => {
    const doc = docs[lang];
    const capataz = contenido(lang).oficios.find((o) => o.sprite === 'capataz')!;
    expect(boton(doc, 'capataz')?.getAttribute('aria-label')).toBe(`${capataz.oficio}: ${capataz.area}`);
    expect(boton(doc, 'bryan')?.getAttribute('aria-label')).toBe('Bryan Marin');
    for (const o of contenido(lang).oficios) expect(boton(doc, o.sprite)?.getAttribute('data-oficio')).toContain(o.oficio);
  });

  it('las piezas son decorativas', () => {
    expect(docs[lang].querySelector('[data-obra] .obra-piezas')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('cada monigote está parado sobre su piso', () => {
    for (const m of cuadrilla) {
      const style = boton(docs[lang], m.sprite)?.getAttribute('style') ?? '';
      const fh = spriteMeta(m.sprite, m.anim).height;
      expect(style, m.sprite).toMatch(new RegExp(`(^|;)\\s*left:\\s*${m.x}px`));
      expect(style, m.sprite).toMatch(new RegExp(`(^|;)\\s*top:\\s*${pies(m) - fh * 4}px`));
    }
  });
});
