import { comoTrabajo, corall, games, oficios, screens } from './data/site';
import { comoTrabajoEn, corallEn, oficiosEn, screensEn } from './data/site.en';
import type { Lang } from './lib/casa/textos';

export type { Lang };

/** Ruta en el idioma pedido: el español va sin prefijo, el inglés bajo /en. */
export const href = (lang: Lang, path: string) => (lang === 'en' ? `/en${path === '/' ? '/' : path}` : path);

/** La misma página en el otro idioma. */
export const otraRuta = (pathname: string): { lang: Lang; path: string } =>
  pathname === '/en' || pathname.startsWith('/en/')
    ? { lang: 'es', path: pathname.slice(3) || '/' }
    : { lang: 'en', path: href('en', pathname) };

export const contenido = (lang: Lang) =>
  lang === 'en'
    ? { corall: corallEn, oficios: oficiosEn, comoTrabajo: comoTrabajoEn, screens: screensEn, games }
    : { corall, oficios, comoTrabajo, screens, games };

export const t = {
  es: {
    otroIdioma: 'english',
    pie: ['Bryan Marin Yupanqui · Trujillo, Perú', 'Construido junto a Claude (Anthropic) · pixel art original'],
    ogLocale: 'es_PE',
    ogAlt: 'Bryan Marin y su cuadrilla de oficios pixel art trabajando en la obra',
    pro: {
      title: 'Bryan Marin · ingeniero de sistemas en Trujillo',
      description: 'Ingeniero de sistemas junior en CorAll D&R, en Trujillo. Construyo sistemas con una cuadrilla de oficios, junto a Claude; después de las 6, rol, juegos y música.',
      navAria: 'Principal',
      nav: { proyectos: 'proyectos', oficios: 'oficios', ia: 'cómo trabajo', casa: 'la casa →' },
      heroTag: 'INGENIERO DE SISTEMAS JUNIOR · CORALL D&R · TRUJILLO',
      h1: 'Construyo sistemas con una cuadrilla de oficios.',
      lede: 'Método, backend, diseño, infraestructura, pruebas y documentación: cada área es un oficio de la obra. Trabajo junto a Claude, y la cuadrilla crece con cada proyecto.',
      verObra: 'Ver la obra',
      conocer: 'conocer la cuadrilla',
      obraBar: ['LA OBRA · EN VIVO', '6 oficios trabajando'],
      proyectosKicker: '01 · PROYECTOS EN LOS QUE FORMÉ PARTE',
      proyectosH2: 'La obra en CorAll D&R',
      reto: 'El reto:',
      oficiosKicker: '02 · LA CUADRILLA',
      oficiosH2: 'Un oficio por área',
      oficiosLede: 'Cada oficio junta lo que he usado en trabajo real. Las etiquetas crecen a medida que la obra crece.',
      iaKicker: '03 · CÓMO TRABAJO',
      iaH2: 'Con IA, sin dejar de aprender',
      puertaKicker: 'DESPUÉS DE LAS 6',
      puertaH2: 'La obra cierra. La casa se enciende.',
      puertaP: 'Rol, juegos, series y lo que suena ahora en Spotify.',
      puertaCta: 'entrar a la casa →',
    },
    casa: {
      title: 'La casa de Bryan',
      description: 'La casa de Bryan después de las 6: rol, juegos, series y lo que suena ahora en Spotify.',
      ogAlt: 'La casa de Bryan de noche: la PC, la mesa de rol y la cuadrilla jugando',
      volver: '← volver a la obra',
      adelantar: 'adelantar reloj',
      objetosAria: 'Objetos de la casa',
      objetosKicker: 'OBJETOS · TAMBIÉN CON TECLADO',
      via: 'vía',
      pc: ['LA PC · LO QUE JUEGO', 'Juegos'],
      tv: ['LA TELE · SERIES Y PELIS', 'En pantalla'],
      parlante: ['EL PARLANTE · EN VIVO DESDE SPOTIFY', 'Lo que suena'],
      parlanteNota: 'Lo que suena ahora aparece en la leyenda de la escena. Si no suena nada, esto es lo que escucho:',
      mesa: ['LA MESA', 'luego'],
      estante: ['EL ESTANTE · HISTORIA', 'Leo sobre historia'],
    },
  },
  en: {
    otroIdioma: 'español',
    pie: ['Bryan Marin Yupanqui · Trujillo, Peru', 'Built alongside Claude (Anthropic) · original pixel art'],
    ogLocale: 'en_US',
    ogAlt: 'Bryan Marin and his pixel-art crew of trades at work on the site',
    pro: {
      title: 'Bryan Marin · systems engineer in Trujillo, Peru',
      description: 'Junior systems engineer at CorAll D&R in Trujillo, Peru. I build systems with a crew of trades, alongside Claude; after 6, role-playing, games and music.',
      navAria: 'Main',
      nav: { proyectos: 'projects', oficios: 'trades', ia: 'how I work', casa: 'the house →' },
      heroTag: 'JUNIOR SYSTEMS ENGINEER · CORALL D&R · TRUJILLO',
      h1: 'I build systems with a crew of trades.',
      lede: 'Method, backend, design, infrastructure, testing and documentation: each area is a trade on the site. I work alongside Claude, and the crew grows with every project.',
      verObra: 'See the work',
      conocer: 'meet the crew',
      obraBar: ['THE SITE · LIVE', '6 trades at work'],
      proyectosKicker: '01 · PROJECTS I HAVE BEEN PART OF',
      proyectosH2: 'The work at CorAll D&R',
      reto: 'The challenge:',
      oficiosKicker: '02 · THE CREW',
      oficiosH2: 'One trade per area',
      oficiosLede: 'Each trade gathers what I have used in real work. The tags grow as the work grows.',
      iaKicker: '03 · HOW I WORK',
      iaH2: 'With AI, and still learning',
      puertaKicker: 'AFTER 6',
      puertaH2: 'The site closes. The house lights up.',
      puertaP: 'Role-playing, games, shows and what is playing on Spotify right now.',
      puertaCta: 'enter the house →',
    },
    casa: {
      title: 'Bryan’s house',
      description: 'Bryan’s house after 6: role-playing, games, shows and what is playing on Spotify right now.',
      ogAlt: 'Bryan’s house at night: the PC, the role-playing table and the crew playing',
      volver: '← back to the site',
      adelantar: 'skip ahead',
      objetosAria: 'Objects in the house',
      objetosKicker: 'OBJECTS · KEYBOARD WORKS TOO',
      via: 'via',
      pc: ['THE PC · WHAT I PLAY', 'Games'],
      tv: ['THE TV · SHOWS AND MOVIES', 'On screen'],
      parlante: ['THE SPEAKER · LIVE FROM SPOTIFY', 'What is playing'],
      parlanteNota: 'What is playing right now shows up in the caption under the scene. When nothing is playing, this is what I listen to:',
      mesa: ['THE TABLE', 'then'],
      estante: ['THE SHELF · HISTORY', 'I read about history'],
    },
  },
} as const;
