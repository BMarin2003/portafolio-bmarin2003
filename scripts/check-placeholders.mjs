import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Corchetes pendientes ([Qué hice], [nombres]) en el texto visible de un HTML. */
export function findPlaceholders(html) {
  const text = html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, '');
  return text.match(/\[[^\[\]\n]{1,60}\]/g) ?? [];
}

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return htmlFiles(path);
    return e.name.endsWith('.html') ? [path] : [];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) {
    console.error('Uso: node scripts/check-placeholders.mjs <dir>');
    process.exit(2);
  }
  let found = 0;
  for (const file of htmlFiles(dir)) {
    for (const match of findPlaceholders(readFileSync(file, 'utf8'))) {
      console.error(`${file}: ${match}`);
      found++;
    }
  }
  if (found) process.exit(1);
}
