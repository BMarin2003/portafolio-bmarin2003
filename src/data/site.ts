import type { ImageMetadata } from 'astro';

export type Person = { name: string; url?: string };
export type People = { companeros: Person[]; supervisores: Person[]; gerentes: Person[] };
export type CorallProject = { name: string; did: string; people: People };
export type CrewMember = { name: string; title: string; color: string; role: string; variant?: 'sleepy' | 'helmet' };
export type Credit = { title: string; cover?: ImageMetadata; source: string; sourceUrl: string };

const noPeople = (): People => ({ companeros: [], supervisores: [], gerentes: [] });
const pending = (name: string): CorallProject => ({ name, did: '[Qué hice]', people: noPeople() });

const p = (name: string, url?: string): Person => (url ? { name, url } : { name });
const gerentes = [p('Diego Cieza'), p('Alonso Gil')];

export const corall: CorallProject[] = [
  {
    name: 'Totem Multimedia',
    did: 'Mi primer proyecto en CorAll, recién llegado al equipo. Mi labor fue la de desarrollador: construir las funcionalidades que se me asignaban y presentar cada avance al cliente, explicándole con claridad qué cambiaba y por qué. Fue la etapa en que aprendí el oficio dentro de un producto real, con revisión constante y entregas que otras personas iban a usar.',
    people: {
      companeros: [p('Hugo Marquez'), p('Luis Mostacero')],
      supervisores: [p('Kevin Lora'), p('Cristian Ventura')],
      gerentes,
    },
  },
  pending('CCAE'),
  {
    name: 'MaqinPro',
    did: 'Plataforma de gestión para Maqinpro, empresa de maquinaria industrial y profesional: un panel interno para su taller y un portal desde el que sus clientes siguen sus equipos, aprueban cotizaciones y consultan sus documentos. Fue el proyecto con más personas involucradas y, a mitad de camino, quedó bajo mi responsabilidad. Desde entonces lo llevo adelante, con el apoyo de Luis Hume en el portal del cliente.',
    people: {
      companeros: [p('Luis Hume'), p('Adrian Cisneros', 'https://acisneros-portfolio.vercel.app/es'), p('Alfredo Guzman'), p('Angelmauricio Oncoy')],
      supervisores: [p('Luis Mostacero')],
      gerentes,
    },
  },
  pending('Comphill'),
  {
    name: 'Corall-ERP',
    did: 'El sistema con el que CorAll automatiza y optimiza su propio trabajo, de marketing y finanzas a proyectos e inventario, reunido en una sola plataforma. Aquí el trabajo fue más allá del código: conversé con las personas de cada área para entender sus procesos antes de convertirlos en módulos. Empecé bajo la supervisión de Cristian Ventura y continué con Luis Mostacero tras su ascenso; con la llegada del nuevo equipo de practicantes, el desarrollo ganó un ritmo notable.',
    people: {
      companeros: [p('Hugo Marquez'), p('Luis Hume'), p('Adrian Cisneros', 'https://acisneros-portfolio.vercel.app/es'), p('Alfredo Guzman'), p('Angelmauricio Oncoy')],
      supervisores: [p('Cristian Ventura'), p('Luis Mostacero')],
      gerentes,
    },
  },
  {
    name: 'ITN',
    did: 'El proyecto más reciente, todavía en etapa de propuesta: el sitio público y la intranet de ITN, que hoy estamos presentando al cliente.',
    people: { companeros: [], supervisores: [p('Luis Mostacero')], gerentes },
  },
];

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
const imdbTitle = (title: string, id: string) => imdb(title, `https://www.imdb.com/title/${id}/`);
// Las trilogías no tienen una página de título propia: enlazan a la búsqueda.
const imdbSearch = (title: string, query = title) =>
  imdb(title, `https://www.imdb.com/find/?q=${encodeURIComponent(query)}&s=tt`);

export const screens: Credit[] = [
  imdbTitle('Django sin cadenas', 'tt1853728'),
  imdbTitle('The Batman', 'tt1877830'),
  imdbTitle('Superman (2025)', 'tt5950044'),
  imdbSearch('El Señor de los Anillos (trilogía)', 'The Lord of the Rings'),
  imdbSearch('Las Crónicas de Narnia (trilogía)', 'The Chronicles of Narnia'),
  imdbTitle('Andor', 'tt9253284'),
  imdbTitle('Vinland Saga', 'tt10233448'),
  imdbTitle('Power Rangers SPD', 'tt0414762'),
  imdbTitle('The Walking Dead', 'tt1520211'),
  imdbTitle('Game of Thrones', 'tt0944947'),
  imdbTitle('Brooklyn Nine-Nine', 'tt2467372'),
];

export const bands: string[] = ['Enjambre', 'Los Bunkers', 'Rio', 'Enanitos Verdes', 'Jamiroquai'];

export const rol: string[] = ['D&D', 'Cyberpunk RED'];

export const links = {
  github: 'https://github.com/BMarin2003',
  linkedin: 'https://www.linkedin.com/in/bmarin2003',
};
