import type { ImageMetadata } from 'astro';

export type Person = { name: string; url?: string };
export type People = { companeros: Person[]; supervisores: Person[]; gerentes: Person[] };
export type CorallProject = { name: string; did: string; people: People };
export type CrewMember = { name: string; title: string; color: string; role: string; variant?: 'sleepy' | 'helmet' };
export type Credit = { title: string; cover?: ImageMetadata; source: string; sourceUrl: string };

const noPeople = (): People => ({ companeros: [], supervisores: [], gerentes: [] });
const project = (name: string): CorallProject => ({ name, did: '[Qué hice]', people: noPeople() });

export const corall: CorallProject[] = [
  'Totem Multimedia',
  'CCAE',
  'MaqinPro',
  'Comphill',
  'Corall-ERP',
  'ITN',
].map(project);

export const crew: CrewMember[] = [
  { name: 'hallmark', title: 'Diseño', color: '#C48A96', role: 'Hace páginas que parecen diseñadas, no generadas.' },
  { name: 'ponytail', title: 'Criterio', color: '#D9A55B', role: 'El senior flojo: antes de escribir código pregunta si hace falta.', variant: 'sleepy' },
  { name: 'superpowers', title: 'Método', color: '#7C93B8', role: 'Planifica, depura con método y verifica antes de decir listo.' },
  { name: 'cc-safety-net', title: 'Seguridad', color: '#C27A5C', role: 'Bloquea los comandos que rompen cosas.', variant: 'helmet' },
  { name: 'obsidian', title: 'Memoria', color: '#958AC0', role: 'Todo lo aprendido termina en el vault.' },
];

const steam = (title: string, id: number): Credit => ({
  title,
  source: 'Steam',
  sourceUrl: `https://store.steampowered.com/app/${id}/`,
});

export const games: Credit[] = [
  steam('RimWorld', 294100),
  steam('Mount & Blade: Warband', 48700),
  steam('Crusader Kings II', 203770),
  steam('Crusader Kings III', 1158310),
  steam('Project Zomboid', 108600),
  steam('Fallout 4', 377160),
  steam('Fallout: New Vegas', 22380),
];

const imdb = (title: string, url: string): Credit => ({ title, source: 'IMDb', sourceUrl: url });
// IMDb bloquea las consultas automáticas (403): sin IDs verificados, cada título
// apunta a la búsqueda. Reemplazar por https://www.imdb.com/title/tt<id>/ al verificar.
const imdbSearch = (title: string, query = title) =>
  imdb(title, `https://www.imdb.com/find/?q=${encodeURIComponent(query)}&s=tt`);

export const screens: Credit[] = [
  imdbSearch('Django sin cadenas', 'Django Unchained'),
  imdbSearch('The Batman', 'The Batman 2022'),
  imdbSearch('Superman (2025)'),
  imdbSearch('El Señor de los Anillos'),
  imdbSearch('Andor'),
  imdbSearch('Vinland Saga'),
  imdbSearch('Power Rangers SPD', 'Power Rangers S.P.D.'),
  imdbSearch('The Walking Dead'),
  imdbSearch('Game of Thrones'),
  imdbSearch('Brooklyn Nine-Nine'),
];

export const bands: string[] = ['Enjambre', 'Los Bunkers', 'Rio', 'Enanitos Verdes', 'Jamiroquai'];

export const rol: string[] = ['D&D', 'Cyberpunk RED'];

export const links = {
  github: 'https://github.com/BMarin2003',
  linkedin: '[linkedin]',
};
