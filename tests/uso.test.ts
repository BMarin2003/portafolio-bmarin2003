import { describe, expect, it } from 'vitest';
import { corall } from '../src/data/site';
import { proyectosDe, proyectosDelArea } from '../src/lib/uso';

describe('proyectosDe', () => {
  it('lista en orden cronológico los proyectos que usaron la herramienta', () => {
    expect(proyectosDe('React', corall)).toEqual(['Totem Multimedia', 'CCAE', 'Corall-ERP', 'MaqinPro', 'Comphill']);
  });
  it('cada proyecto aparece una vez aunque tenga varias partes', () => {
    expect(proyectosDe('Bun / Elysia', corall)).toEqual(['Totem Multimedia', 'Corall-ERP', 'MaqinPro', 'Comphill']);
  });
  it('devuelve vacío si ningún proyecto la usó', () => {
    expect(proyectosDe('Playwright', corall)).toEqual(['MaqinPro']);
    expect(proyectosDe('Sentry', corall)).toEqual([]);
  });
});

describe('proyectosDelArea', () => {
  it('une los proyectos de cada herramienta sin repetir', () => {
    expect(proyectosDelArea(['Drizzle', 'Playwright'], corall)).toEqual(['Corall-ERP', 'MaqinPro']);
  });
  it('vacío si ninguna herramienta tiene proyectos', () => {
    expect(proyectosDelArea(['Obsidian', 'Notion'], corall)).toEqual([]);
  });
});
