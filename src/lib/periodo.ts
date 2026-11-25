import type { Lang } from '../i18n';

const meses = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** «feb – abr 2026»; sin `hasta`, sigue en curso. */
export function periodo(desde: string, hasta: string | undefined, lang: Lang): string {
  const [a, m] = desde.split('-').map(Number);
  const ini = meses[lang][m - 1];
  if (!hasta) return `${ini} ${a} – ${lang === 'es' ? 'hoy' : 'present'}`;
  const [a2, m2] = hasta.split('-').map(Number);
  const fin = meses[lang][m2 - 1];
  if (desde === hasta) return `${ini} ${a}`;
  return a === a2 ? `${ini} – ${fin} ${a}` : `${ini} ${a} – ${fin} ${a2}`;
}

/** Copia ordenada por fecha de inicio (estable). */
export const cronologico = <T extends { desde: string }>(xs: readonly T[]): T[] =>
  [...xs].sort((a, b) => a.desde.localeCompare(b.desde));
