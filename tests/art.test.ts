import { describe, expect, it } from 'vitest';
import { validateSprite } from '../art/lib/sprite.ts';
import type { SpriteDef } from '../art/lib/sprite.ts';
import { encodePng } from '../art/lib/png.ts';
import { buildSheet } from '../art/lib/sheet.ts';

const def = (animations: SpriteDef['animations']): SpriteDef => ({
  name: 't',
  width: 2,
  height: 2,
  palette: { '.': null, r: '#ff0000' },
  animations,
});

describe('validateSprite', () => {
  it('acepta un sprite válido', () => {
    expect(validateSprite(def({ idle: [['r.', '.r']] }))).toEqual([]);
  });
  it('informa una fila de largo incorrecto', () => {
    expect(validateSprite(def({ idle: [['r.', 'r.r']] }))).toContain('t/idle/0/1: largo 3, se esperaba 2');
  });
  it('informa un carácter fuera de la paleta', () => {
    expect(validateSprite(def({ idle: [['rz', '..']] }))).toContain("t/idle/0/0: carácter 'z' fuera de la paleta");
  });
  it('informa un número de filas incorrecto', () => {
    expect(validateSprite(def({ idle: [['r.', '.r', '..']] }))).toContain('t/idle/0: 3 filas, se esperaban 2');
  });
  it('rechaza un sprite sin animaciones', () => {
    expect(validateSprite(def({}))).toContain('t: sin animaciones');
  });
  it('rechaza una animación sin cuadros', () => {
    expect(validateSprite(def({ idle: [] }))).toContain('t/idle: sin cuadros');
  });
  it('rechaza un tamaño que no es entero positivo', () => {
    expect(validateSprite({ ...def({ idle: [['r.', '.r']] }), width: 0 })).toContain('t: tamaño inválido');
    expect(validateSprite({ ...def({ idle: [['r.', '.r']] }), height: 1.5 })).toContain('t: tamaño inválido');
  });
});

describe('encodePng', () => {
  it('escribe firma e IHDR RGBA de 8 bits', () => {
    const png = encodePng(1, 1, new Uint8Array([1, 2, 3, 255]));
    expect([...png.slice(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const v = new DataView(png.buffer, png.byteOffset);
    expect(v.getUint32(16)).toBe(1);
    expect(v.getUint32(20)).toBe(1);
    expect(png[24]).toBe(8);
    expect(png[25]).toBe(6);
  });
});

describe('buildSheet', () => {
  const d = def({ idle: [['r.', '.r'], ['r.', '.r']], walk: [['r.', '.r'], ['r.', '.r'], ['r.', '.r']] });
  const px = (s: ReturnType<typeof buildSheet>, x: number, y: number) =>
    [...s.rgba.slice((y * s.width + x) * 4, (y * s.width + x) * 4 + 4)];

  it('calcula tamaño y meta', () => {
    const s = buildSheet(d);
    expect(s.width).toBe(6);
    expect(s.height).toBe(4);
    expect(s.meta.animations).toEqual({ idle: { row: 0, frames: 2 }, walk: { row: 1, frames: 3 } });
  });
  it('deja transparente la celda inexistente', () => {
    const s = buildSheet(d);
    for (let y = 0; y < 2; y++) for (let x = 4; x < 6; x++) expect(px(s, x, y)[3]).toBe(0);
  });
  it('mapea colores y transparencia', () => {
    const s = buildSheet(d);
    expect(px(s, 0, 0)).toEqual([255, 0, 0, 255]);
    expect(px(s, 1, 0)).toEqual([0, 0, 0, 0]);
  });
  it('escala cada píxel', () => {
    const s = buildSheet(d, 3);
    expect(s.width).toBe(18);
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) expect(px(s, x, y)).toEqual([255, 0, 0, 255]);
    expect(px(s, 3, 0)).toEqual([0, 0, 0, 0]);
  });
  it('rellena el fondo', () => {
    expect(px(buildSheet(d, 1, '#11151B'), 1, 0)).toEqual([17, 21, 27, 255]);
  });
});
