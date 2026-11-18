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

const steam = (title: string): Credit => ({
  title,
  source: 'Steam',
  sourceUrl: `https://store.steampowered.com/search/?term=${encodeURIComponent(title)}`,
});

export const games: Credit[] = [
  'RimWorld',
  'Mount & Blade: Warband',
  'Crusader Kings II',
  'Crusader Kings III',
  'Project Zomboid',
  'Fallout 4',
  'Fallout: New Vegas',
].map(steam);

const imdb = (title: string): Credit => ({
  title,
  source: 'IMDb',
  sourceUrl: `https://www.imdb.com/find/?q=${encodeURIComponent(title)}&s=tt`,
});

export const screens: Credit[] = [
  'Django sin cadenas',
  'The Batman',
  'Superman (2025)',
  'El Señor de los Anillos',
  'Andor',
  'Vinland Saga',
  'Power Rangers SPD',
  'The Walking Dead',
  'Game of Thrones',
  'Brooklyn Nine-Nine',
].map(imdb);

export const bands: string[] = ['Enjambre', 'Los Bunkers', 'Rio', 'Enanitos Verdes', 'Jamiroquai'];

export const rol: string[] = ['D&D', 'Cyberpunk RED'];

export const links = {
  github: 'https://github.com/BMARIN2003',
  linkedin: '[linkedin]',
};
