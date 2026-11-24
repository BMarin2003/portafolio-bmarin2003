import { describe, expect, it } from 'vitest';
import { oficios } from '../src/data/site';
import { ENTRADA, ESCENA, cuadrilla, pies } from '../src/lib/obra';

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
