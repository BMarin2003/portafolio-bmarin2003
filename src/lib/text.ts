import type { People } from '../data/site';

/** Separador antes del elemento i+1 de una lista de len: ", " entre los primeros y " y " antes del último. */
export function separator(i: number, len: number): string {
  if (i >= len - 1) return '';
  return i === len - 2 ? ' y ' : ', ';
}

type Group = { label: 'compañeros' | 'supervisores' | 'gerentes'; people: People['companeros'] };

/** Grupos de personas no vacíos, en el orden compañeros, supervisores, gerentes. */
export function peopleGroups(p: People): Group[] {
  const groups: Group[] = [
    { label: 'compañeros', people: p.companeros },
    { label: 'supervisores', people: p.supervisores },
    { label: 'gerentes', people: p.gerentes },
  ];
  return groups.filter((g) => g.people.length > 0);
}
