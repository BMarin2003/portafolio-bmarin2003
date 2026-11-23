import { describe, expect, it } from 'vitest';
import { comoTrabajo, corall, oficios } from '../src/data/site';
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
  it('ningún oficio ni area nombra herramientas', () => {
    const texto = [...oficios.map((o) => o.oficio), ...oficios.map((o) => o.area), ...corall.map((p) => p.area)].join(' ');
    expect(texto).not.toMatch(/hallmark|ponytail|superpowers|safety|obsidian/i);
  });
  it('cada proyecto trae su area', () => {
    expect(corall.map((p) => p.area)).toEqual(['PRIMER PROYECTO', 'APORTE PUNTUAL', 'PLATAFORMA · A MI CARGO', 'CIERRE DE PROYECTO', 'ERP INTERNO']);
  });
  it('comoTrabajo es un hueco entre corchetes', () => {
    expect(comoTrabajo).toMatch(/^\[.*\]$/);
  });
});
