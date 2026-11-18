import { describe, expect, it } from 'vitest';
import { validateSprite } from '../art/lib/sprite.ts';
import type { SpriteDef } from '../art/lib/sprite.ts';

const OUTLINE = '#39414E';
const CREW: Record<string, string> = {
  capataz: '#D9A55B',
  maestro: '#C27A5C',
  decorador: '#C48A96',
  electricista: '#7C93B8',
  doble: '#8FA86B',
  archivista: '#958AC0',
};

// El color más frecuente en todos los cuadros, sin contar transparente ni contorno.
function dominant(def: SpriteDef): string {
  const counts = new Map<string, number>();
  for (const frames of Object.values(def.animations)) {
    for (const rows of frames) {
      for (const row of rows) {
        for (const ch of row) {
          const color = def.palette[ch]?.toUpperCase();
          if (!color || color === OUTLINE) continue;
          counts.set(color, (counts.get(color) ?? 0) + 1);
        }
      }
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0][0];
}

describe.each(Object.entries(CREW))('%s', (name, color) => {
  const load = async (): Promise<SpriteDef> => (await import(`../art/sprites/${name}.ts`)).default;

  it('es un sprite válido de 16×16 con su nombre', async () => {
    const def = await load();
    expect(validateSprite(def)).toEqual([]);
    expect(def.name).toBe(name);
    expect([def.width, def.height]).toEqual([16, 16]);
  });

  it('tiene idle de 2 cuadros, walk de 4 y action de 2 a 4', async () => {
    const def = await load();
    expect(def.animations.idle).toHaveLength(2);
    expect(def.animations.walk).toHaveLength(4);
    expect(def.animations.action.length).toBeGreaterThanOrEqual(2);
    expect(def.animations.action.length).toBeLessThanOrEqual(4);
  });

  it(`su color dominante es ${color}`, async () => {
    expect(dominant(await load())).toBe(color);
  });
});

describe('bryan', () => {
  const load = async (): Promise<SpriteDef> => (await import('../art/sprites/bryan.ts')).default;

  it('es un sprite válido de 16×24 con su nombre', async () => {
    const def = await load();
    expect(validateSprite(def)).toEqual([]);
    expect(def.name).toBe('bryan');
    expect([def.width, def.height]).toEqual([16, 24]);
  });

  it('tiene idle de 2 cuadros, walk de 4, sit de 1 y roll de 2 a 4', async () => {
    const def = await load();
    expect(def.animations.idle).toHaveLength(2);
    expect(def.animations.walk).toHaveLength(4);
    expect(def.animations.sit).toHaveLength(1);
    expect(def.animations.roll.length).toBeGreaterThanOrEqual(2);
    expect(def.animations.roll.length).toBeLessThanOrEqual(4);
  });
});
