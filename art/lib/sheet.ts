import type { SpriteDef } from './sprite.ts';

export type SheetMeta = {
  frameWidth: number;
  frameHeight: number;
  animations: Record<string, { row: number; frames: number }>;
};

function hex(color: string): [number, number, number] {
  const n = parseInt(color.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Una fila por animación (orden de las claves), cuadros de izquierda a derecha.
export function buildSheet(def: SpriteDef, scale = 1, background?: string) {
  const names = Object.keys(def.animations);
  const maxFrames = Math.max(...names.map((n) => def.animations[n].length));
  const width = maxFrames * def.width * scale;
  const height = names.length * def.height * scale;
  const rgba = new Uint8Array(width * height * 4);
  const bg = background ? hex(background) : null;
  const meta: SheetMeta = { frameWidth: def.width, frameHeight: def.height, animations: {} };

  names.forEach((name, row) => {
    const frames = def.animations[name];
    meta.animations[name] = { row, frames: frames.length };
    for (let f = 0; f < maxFrames; f++) {
      for (let y = 0; y < def.height; y++) {
        for (let x = 0; x < def.width; x++) {
          const color = frames[f] ? def.palette[frames[f][y][x]] : null;
          const rgb = color ? hex(color) : bg;
          if (!rgb) continue;
          for (let dy = 0; dy < scale; dy++) {
            for (let dx = 0; dx < scale; dx++) {
              const sx = (f * def.width + x) * scale + dx;
              const sy = (row * def.height + y) * scale + dy;
              rgba.set([rgb[0], rgb[1], rgb[2], 255], (sy * width + sx) * 4);
            }
          }
        }
      }
    }
  });
  return { width, height, rgba, meta };
}
