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

// Los colores por frecuencia en todos los cuadros, sin contar transparente ni contorno.
function byFrequency(def: SpriteDef, only?: (ch: string) => boolean): string[] {
  const counts = new Map<string, number>();
  for (const frames of Object.values(def.animations)) {
    for (const rows of frames) {
      for (const row of rows) {
        for (const ch of row) {
          if (only && !only(ch)) continue;
          const color = def.palette[ch]?.toUpperCase();
          if (!color || color === OUTLINE) continue;
          counts.set(color, (counts.get(color) ?? 0) + 1);
        }
      }
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1]).map(([color]) => color);
}
const dominant = (def: SpriteDef) => byFrequency(def)[0];

// Luminancia relativa (WCAG) de un #RRGGBB.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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

  it('tiene la piel trigueña: su tono más frecuente no es #F0C8A0 ni más claro', async () => {
    const def = await load();
    // En la paleta de bryan la piel son las claves 's' (base) y 'S' (sombra).
    const skin = byFrequency(def, (ch) => ch === 's' || ch === 'S')[0];
    expect(skin).not.toBe('#F0C8A0');
    expect(luminance(skin)).toBeLessThan(0.55);
  });
});
