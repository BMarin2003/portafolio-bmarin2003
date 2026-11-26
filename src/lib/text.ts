import type { People, Person } from '../data/site';
import type { Lang } from './casa/textos';

/** Separador antes del elemento i+1 de una lista de len: ", " entre los primeros y " y " (o " and ") antes del último. */
export function separator(i: number, len: number, lang: Lang = 'es'): string {
  if (i >= len - 1) return '';
  return i === len - 2 ? (lang === 'en' ? ' and ' : ' y ') : ', ';
}

type Group = { label: string; people: Person[] };

const rotulos: Record<Lang, [string, string][]> = {
  es: [['compañero', 'compañeros'], ['supervisor', 'supervisores'], ['gerente', 'gerentes']],
  en: [['teammate', 'teammates'], ['supervisor', 'supervisors'], ['manager', 'managers']],
};

/** Grupos de personas no vacíos, en el orden compañeros, supervisores, gerentes, con el rótulo en singular si hay una sola persona. */
export function peopleGroups(p: People, lang: Lang = 'es'): Group[] {
  return [p.companeros, p.supervisores, p.gerentes]
    .map((people, i) => ({ people, one: rotulos[lang][i][0], many: rotulos[lang][i][1] }))
    .filter((g) => g.people.length > 0)
    .map((g) => ({ label: g.people.length === 1 ? g.one : g.many, people: g.people }));
}

/** Apertura de la frase: «Equipo:» / «Team:». */
export const opening = (lang: Lang = 'es'): string => (lang === 'en' ? 'Team:' : 'Equipo:');

/** Separador entre grupos de la frase: punto y coma, y nada tras el último. */
export const groupSeparator = (i: number, len: number): string => (i < len - 1 ? '; ' : '');
