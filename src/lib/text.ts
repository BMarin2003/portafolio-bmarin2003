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

/** Apertura de la frase: en español concuerda en número con el primer grupo ("Con mi estimado supervisor…"); en inglés no cambia. */
export function opening(groups: Group[], lang: Lang = 'es'): string {
  if (lang === 'en') return 'With my esteemed';
  return groups[0]?.people.length === 1 ? 'Con mi estimado' : 'Con mis estimados';
}
