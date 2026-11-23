import type { SpriteDef } from '../../art/lib/sprite.ts';

const mods = import.meta.glob<{ default: SpriteDef }>('../../art/sprites/*.ts', { eager: true });
const defs = new Map<string, SpriteDef>(Object.values(mods).map((m) => [m.default.name, m.default]));

export function spriteDef(name: string): SpriteDef {
  const def = defs.get(name);
  if (!def) throw new Error(`sprite '${name}' no existe`);
  return def;
}

export function spriteMeta(name: string, anim: string) {
  const def = spriteDef(name);
  const keys = Object.keys(def.animations);
  const row = keys.indexOf(anim);
  if (row < 0) throw new Error(`sprite '${name}' no tiene la animación '${anim}'`);
  return { width: def.width, height: def.height, row, frames: def.animations[anim].length };
}

// Ancho de la hoja en cuadros: el de la animación más larga.
export function spriteCols(name: string): number {
  return Math.max(...Object.values(spriteDef(name).animations).map((f) => f.length));
}
