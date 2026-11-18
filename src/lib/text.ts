import type { People, Person } from '../data/site';

/** Separador antes del elemento i+1 de una lista de len: ", " entre los primeros y " y " antes del último. */
export function separator(i: number, len: number): string {
  if (i >= len - 1) return '';
  return i === len - 2 ? ' y ' : ', ';
}

type Group = { label: string; people: Person[] };

/** Grupos de personas no vacíos, en el orden compañeros, supervisores, gerentes, con el rótulo en singular si hay una sola persona. */
export function peopleGroups(p: People): Group[] {
  const groups: [string, string, Person[]][] = [
    ['compañero', 'compañeros', p.companeros],
    ['supervisor', 'supervisores', p.supervisores],
    ['gerente', 'gerentes', p.gerentes],
  ];
  return groups
    .filter(([, , people]) => people.length > 0)
    .map(([one, many, people]) => ({ label: people.length === 1 ? one : many, people }));
}

/** Apertura de la frase: concuerda en número con el primer grupo ("Con mi estimado supervisor…"). */
export function opening(groups: Group[]): string {
  return groups[0]?.people.length === 1 ? 'Con mi estimado' : 'Con mis estimados';
}
