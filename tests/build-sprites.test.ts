import { mkdtemp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildAll } from '../scripts/build-sprites.ts';

const sprite = (name: string, row: string) => `export default {
  name: '${name}', width: 2, height: 2,
  palette: { '.': null, r: '#ff0000' },
  animations: { idle: [['${row}', '.r']] },
};`;

let src: string, out: string, preview: string;

beforeEach(async () => {
  const base = await mkdtemp(join(tmpdir(), 'sprites-'));
  src = join(base, 'src');
  out = join(base, 'out');
  preview = join(base, 'preview');
  await mkdir(src);
  await mkdir(out);
});

describe('buildAll', () => {
  it('escribe png y json de un sprite válido', async () => {
    await writeFile(join(src, 't.ts'), sprite('t', 'r.'));
    const res = await buildAll({ srcDir: src, outDir: out });
    expect(res).toEqual({ built: ['t'], errors: [] });
    expect((await readdir(out)).sort()).toEqual(['t.json', 't.png']);
    expect(JSON.parse(await readFile(join(out, 't.json'), 'utf8')).frameWidth).toBe(2);
  });

  it('con un sprite inválido no escribe nada', async () => {
    await writeFile(join(src, 't.ts'), sprite('t', 'r.'));
    await writeFile(join(src, 'bad.ts'), sprite('bad', 'r.r'));
    const res = await buildAll({ srcDir: src, outDir: out });
    expect(res.errors.length).toBeGreaterThan(0);
    expect(await readdir(out)).toEqual([]);
  });

  it('informa un módulo sin export default y no escribe nada', async () => {
    await writeFile(join(src, 't.ts'), sprite('t', 'r.'));
    await writeFile(join(src, 'malo.ts'), 'export const x = 1;');
    const res = await buildAll({ srcDir: src, outDir: out });
    expect(res.errors).toContain('malo.ts: sin export default');
    expect(await readdir(out)).toEqual([]);
  });

  it('escribe la vista previa a escala x10', async () => {
    await writeFile(join(src, 't.ts'), sprite('t', 'r.'));
    await buildAll({ srcDir: src, outDir: out, previewDir: preview });
    const png = await readFile(join(preview, 't.png'));
    expect(png.readUInt32BE(16)).toBe(20);
    expect(png.readUInt32BE(20)).toBe(20);
  });

  it('sin sprites no hace nada e ignora .gitkeep', async () => {
    await writeFile(join(src, '.gitkeep'), '');
    expect(await buildAll({ srcDir: src, outDir: out })).toEqual({ built: [], errors: [] });
  });
});
