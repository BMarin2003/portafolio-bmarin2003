import { describe, expect, it } from 'vitest';
import { bands, comoTrabajo, corall, games, manuales, oficios, screens } from '../src/data/site';
import { cronologico } from '../src/lib/periodo';
import { spriteMeta } from '../src/lib/sprite-meta';

describe('oficios', () => {
  it('son los seis, en orden', () => {
    expect(oficios.map((o) => o.sprite)).toEqual(['capataz', 'maestro', 'decorador', 'electricista', 'doble', 'archivista']);
  });
  it('cada sprite de oficios y de proyectos existe', () => {
    for (const name of [...oficios.map((o) => o.sprite), ...corall.map((p) => p.sprite)]) {
      expect(() => spriteMeta(name, 'idle')).not.toThrow();
    }
  });
  it('ningún área nombra herramientas', () => {
    const texto = [...oficios.map((o) => o.area), ...corall.map((p) => p.area)].join(' ');
    expect(texto).not.toMatch(/hallmark|ponytail|superpowers|safety|obsidian/i);
  });
  it('cada proyecto trae su area', () => {
    expect(corall.map((p) => p.area)).toEqual(['DESARROLLADOR', 'DISEÑO DE UI', 'PLATAFORMA · A MI CARGO', 'CIERRE DE PROYECTO', 'ERP INTERNO']);
  });
  it('comoTrabajo es un texto no vacío', () => {
    expect(typeof comoTrabajo).toBe('string');
    expect(comoTrabajo.trim()).not.toBe('');
  });
});

describe('proyectos: período, commits, resumen y stack', () => {
  const base = ['React', 'Ant Design', 'Bun', 'Elysia', 'PostgreSQL'];
  const esperado: Record<string, [string, string | undefined, number, string[], string]> = {
    'Totem Multimedia': ['2026-02', '2026-04', 259, base, 'Mi primer proyecto en CorAll: construí funcionalidades y presenté cada avance al cliente.'],
    CCAE: ['2026-03', '2026-03', 9, ['React', 'Ant Design'], 'Diseñé un par de interfaces de la extranet de un sistema de arbitrajes.'],
    'Corall-ERP': ['2026-04', undefined, 581, [...base, 'Drizzle'], 'El ERP con el que CorAll organiza su trabajo; levanté los procesos de cada área antes de convertirlos en módulos.'],
    MaqinPro: ['2026-08', undefined, 1493, [...base, 'Drizzle', 'Playwright'], 'Plataforma de un taller de maquinaria y portal de sus clientes; a mi cargo desde la mitad del proyecto.'],
    Comphill: ['2026-09', '2026-10', 136, base, 'Con Luis Mostacero cerramos el sistema de operaciones de un mercado mayorista que había construido otra persona.'],
  };
  it('cada proyecto trae los valores de la spec', () => {
    for (const p of corall) {
      const [desde, hasta, commits, stack, resumen] = esperado[p.name];
      expect({ desde: p.desde, hasta: p.hasta, commits: p.commits, stack: p.stack, resumen: p.resumen }).toEqual({ desde, hasta, commits, stack, resumen });
    }
  });
  it('el orden cronológico', () => {
    expect(cronologico(corall).map((p) => p.name)).toEqual(['Totem Multimedia', 'CCAE', 'Corall-ERP', 'MaqinPro', 'Comphill']);
  });
});

describe('casa: portadas', () => {
  // Sin imagen, con el OK de Bryan: tarjeta con solo el título.
  const sinPortada = ['The Walking Dead', 'Game of Thrones'];
  it('cada juego, título y banda trae su portada', () => {
    for (const c of [...games, ...screens, ...bands]) {
      if (sinPortada.includes(c.title)) continue;
      expect(c.cover?.src, c.title).toBeTruthy();
    }
  });
  it('las dos sin portada siguen en la lista', () => {
    const titulos = screens.map((s) => s.title);
    for (const t of sinPortada) expect(titulos).toContain(t);
  });
  it('bandas y manuales', () => {
    expect(bands.map((b) => b.title)).toEqual(['Enjambre', 'Los Bunkers', 'Rio', 'Enanitos Verdes', 'Jamiroquai']);
    bands.forEach((b) => expect(b.sourceUrl).toMatch(/^https:\/\/open\.spotify\.com\/artist\//));
    expect(manuales).toHaveLength(2);
    manuales.forEach((m) => expect(m.sourceUrl).toMatch(/^https:\/\//));
  });
});
