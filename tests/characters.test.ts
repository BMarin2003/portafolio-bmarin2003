import { describe, expect, it } from 'vitest';
import { validateSprite } from '../art/lib/sprite.ts';
import type { SpriteDef } from '../art/lib/sprite.ts';

const OUTLINE = '#39414E';
const CREW: Record<string, string> = {
  hallmark: '#C48A96',
  ponytail: '#D9A55B',
  superpowers: '#7C93B8',
  'safety-net': '#C27A5C',
  obsidian: '#958AC0',
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
