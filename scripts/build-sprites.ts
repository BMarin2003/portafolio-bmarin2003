import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { encodePng } from '../art/lib/png.ts';
import { buildSheet } from '../art/lib/sheet.ts';
import { validateSprite } from '../art/lib/sprite.ts';
import type { SpriteDef } from '../art/lib/sprite.ts';

type Opts = { srcDir: string; outDir: string; previewDir?: string };

// Cada módulo de srcDir exporta por defecto un SpriteDef. Si alguno es inválido no se escribe nada.
export async function buildAll({ srcDir, outDir, previewDir }: Opts) {
  const files = (await readdir(srcDir)).filter((f) => f.endsWith('.ts')).sort();
  const defs: SpriteDef[] = [];
  const errors: string[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(srcDir, file)).href);
    const def: SpriteDef = mod.default;
    if (typeof def !== 'object' || def === null) {
      errors.push(`${file}: sin export default`);
      continue;
    }
    if (def.name !== basename(file, '.ts')) errors.push(`${file}: name '${def.name}' no coincide con el archivo`);
    errors.push(...validateSprite(def));
    defs.push(def);
  }
  if (errors.length) return { built: [], errors };

  await mkdir(outDir, { recursive: true });
  if (previewDir) await mkdir(previewDir, { recursive: true });
  for (const def of defs) {
    const sheet = buildSheet(def);
    await writeFile(join(outDir, `${def.name}.png`), encodePng(sheet.width, sheet.height, sheet.rgba));
    await writeFile(join(outDir, `${def.name}.json`), JSON.stringify(sheet.meta));
    if (previewDir) {
      const big = buildSheet(def, 10, '#11151B');
      await writeFile(join(previewDir, `${def.name}.png`), encodePng(big.width, big.height, big.rgba));
    }
  }
  return { built: defs.map((d) => d.name), errors: [] };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { built, errors } = await buildAll({
    srcDir: 'art/sprites',
    outDir: 'public/sprites',
    previewDir: process.argv.includes('--preview') ? 'art/preview' : undefined,
  });
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(`sprites: ${built.length} generados`);
}
