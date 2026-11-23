import { describe, expect, it } from 'vitest';
import { HEIGHT, WIDTH, actoresPorFase, habitaciones, objetos, type Rect } from '../src/lib/casa/scene';
import { positionAt } from '../src/lib/casa/route';
import { spriteMeta } from '../src/lib/sprite-meta';
import type { Fase } from '../src/lib/casa/time';

const dentro = (a: Rect, b: Rect) =>
  a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
const hab = (id: string) => habitaciones.find((h) => h.id === id)!;
const fases: Fase[] = ['noche', 'amanecer', 'dia', 'tarde'];

describe('escena', () => {
  it('mide 320x180 con las etiquetas pedidas', () => {
    expect([WIDTH, HEIGHT]).toEqual([320, 180]);
    expect(habitaciones.map((h) => h.label)).toEqual(['BIBLIOTECA', 'MÚSICA', 'CUARTO', 'MESA DE ROL']);
    expect(objetos.map((o) => o.label)).toEqual(['PC', 'Televisor', 'Parlante', 'Mesa de rol', 'Estante']);
  });

  it('cada objeto cae en el mundo y dentro de su habitación', () => {
    const dueño = { pc: 'cuarto', tv: 'cuarto', parlante: 'musica', mesa: 'rol', estante: 'biblioteca' } as const;
    for (const o of objetos) {
      expect(dentro(o.rect, { x: 0, y: 0, w: WIDTH, h: HEIGHT })).toBe(true);
      expect(dentro(o.rect, hab(dueño[o.id]).rect)).toBe(true);
    }
  });

  it('noche y tarde: Bryan sentado y la cuadrilla en la mesa de rol', () => {
    for (const f of ['noche', 'tarde'] as const) {
      const a = actoresPorFase(f);
      expect(a.find((x) => x.sprite === 'bryan')?.anim).toBe('sit');
      expect(a.find((x) => x.sprite === 'bryan')?.route).toHaveLength(1);
      for (const s of ['capataz', 'doble', 'decorador']) expect(a.some((x) => x.sprite === s)).toBe(true);
    }
  });

  it('día: solo Bryan caminando; amanecer sin oficios', () => {
    const d = actoresPorFase('dia');
    expect(d).toHaveLength(1);
    expect(d[0].sprite).toBe('bryan');
    expect(d[0].anim).toBe('walk');
    expect(d[0].route.length).toBeGreaterThanOrEqual(2);
    const a = actoresPorFase('amanecer');
    expect(a.map((x) => x.sprite)).toEqual(['bryan']);
    expect(a[0].anim).toBe('walk');
  });

  it('los sprites existen y los pies quedan dentro de una habitación', () => {
    for (const f of fases) {
      for (const a of actoresPorFase(f)) {
        const m = spriteMeta(a.sprite, a.anim);
        const h = a.sprite === 'bryan' ? 24 : 16;
        expect(m).toBeTruthy();
        for (const p of a.route) {
          expect(habitaciones.some((r) => p.x >= r.rect.x && p.x + 16 <= r.rect.x + r.rect.w && p.y >= r.rect.y && p.y + h <= r.rect.y + r.rect.h)).toBe(true);
        }
      }
    }
  });
});

describe('pisos', () => {
  it('cada ruta se queda en un piso y los pies pisan una línea de suelo', () => {
    for (const f of fases) {
      for (const a of actoresPorFase(f)) {
        expect(new Set(a.route.map((p) => p.y)).size).toBe(1);
        const pies = a.route[0].y + spriteMeta(a.sprite, a.anim).height;
        // Excepción explícita: el doble actúa parado sobre la mesa de rol (pies en y=139, no en el suelo).
        if (a.sprite === 'doble') expect(pies).toBe(139);
        else expect([97, 170]).toContain(pies);
      }
    }
  });
});

describe('positionAt', () => {
  const r = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
  it('ida y vuelta', () => {
    expect(positionAt(r, 50, 1000)).toEqual({ x: 50, y: 0, flip: false });
    expect(positionAt(r, 50, 3000)).toEqual({ x: 50, y: 0, flip: true });
    expect(positionAt(r, 50, 4000).x).toBe(0);
  });
  it('un punto', () => {
    expect(positionAt([{ x: 7, y: 9 }], 50, 5000)).toEqual({ x: 7, y: 9, flip: false });
  });
});
