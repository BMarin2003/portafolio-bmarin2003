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
    ogAlt: 'Bryan Marin y su cuadrilla pixel art trabajando en la obra',
    pro: {
      title: 'Bryan Marin · ingeniero de sistemas en Trujillo',
      description: 'Ingeniero de sistemas junior en CorAll D&R, en Trujillo. Construyo sistemas de punta a punta, junto a Claude; después de las 6, rol, juegos y música.',
      navAria: 'Principal',
      nav: { proyectos: 'proyectos', oficios: 'áreas', ia: 'cómo trabajo', casa: 'la casa →' },
      heroTag: 'INGENIERO DE SISTEMAS JUNIOR · CORALL D&R · TRUJILLO',
      h1: 'Construyo sistemas de punta a punta, junto a Claude.',
      lede: 'Método, backend, diseño, infraestructura, pruebas y documentación: seis áreas que crecen con cada proyecto.',
      verObra: 'Ver la obra',
      conocer: 'conocer la cuadrilla',
      proyectosKicker: '01 · PROYECTOS EN LOS QUE FORMÉ PARTE',
      proyectosH2: 'La obra en CorAll D&R',
      reto: 'El reto:',
      proyectosLede: 'Desde que llegué a CorAll, en orden: lo que hice en cada obra y con quién.',
      detalle: 'qué hice y con quién',
      commits: 'commits',
      oficiosKicker: '02 · LA CUADRILLA',
      oficiosH2: 'Seis áreas, una sola obra',
      oficiosLede: 'Cada área junta las herramientas que he usado en trabajo real. Las etiquetas crecen con la obra.',
      iaKicker: '03 · CÓMO TRABAJO',
      iaH2: 'Con IA, sin dejar de aprender',
      ciclo: {
        pasos: [
          { titulo: 'Entender', frase: 'Antes de escribir código: qué se necesita, para quién y con qué datos reales.', prueba: 'En el hero: la referencia fue runkiri.com', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md', sprite: 'archivista' },
          { titulo: 'Decidir', frase: 'Bocetos para comparar y un diseño escrito que apruebo antes de construir.', prueba: 'En el hero: 2 bocetos, elegí la mezcla y aprobé el diseño', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md', sprite: 'capataz' },
          { titulo: 'Construir junto a Claude', frase: 'Un plan por tareas chicas, cada una con sus tests escritos antes del código.', prueba: 'En el hero: plan de 4 tareas', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/plans/2026-11-23-hero-obra-viva.md', sprite: 'maestro' },
          { titulo: 'Revisar', frase: 'Revisión de cada tarea y de todo el cambio, medición y verificación en vivo.', prueba: 'En el hero: 184 tests en cada deploy', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/actions', sprite: 'doble' },
        ],
        cierre: 'El diseño y el plan de cada parte de este sitio están en su repositorio: ',
        cierreEnlace: 'ver el proceso en GitHub →',
        cierreHref: 'https://github.com/BMarin2003/portafolio-bmarin2003/tree/main/docs/superpowers',
      },
      puertaKicker: 'DESPUÉS DE LAS 6',
      puertaH2: 'La obra cierra. La casa se enciende.',
      puertaP: 'Rol, juegos, series y lo que suena ahora en Spotify.',
      puertaCta: 'entrar a la casa →',
      areas: {
        enLaObra: 'En la obra:',
        numero: 'El número es en cuántos proyectos la usé.',
        sinProyectos: 'Herramientas de trabajo diario; todavía sin un proyecto de CorAll asociado en el recorrido.',
      },
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
    ogAlt: 'Bryan Marin and his pixel-art crew at work on the site',
    pro: {
      title: 'Bryan Marin · systems engineer in Trujillo, Peru',
      description: 'Junior systems engineer at CorAll D&R in Trujillo, Peru. I build systems end to end, alongside Claude; after 6, role-playing, games and music.',
      navAria: 'Main',
      nav: { proyectos: 'projects', oficios: 'areas', ia: 'how I work', casa: 'the house →' },
      heroTag: 'JUNIOR SYSTEMS ENGINEER · CORALL D&R · TRUJILLO',
      h1: 'I build systems end to end, alongside Claude.',
      lede: 'Method, backend, design, infrastructure, testing and documentation: six areas that grow with every project.',
      verObra: 'See the work',
      conocer: 'meet the crew',
      proyectosKicker: '01 · PROJECTS I HAVE BEEN PART OF',
      proyectosH2: 'The work at CorAll D&R',
      reto: 'The challenge:',
      proyectosLede: 'Since I joined CorAll, in order: what I did on each project and with whom.',
      detalle: 'what I did and with whom',
      commits: 'commits',
      oficiosKicker: '02 · THE CREW',
      oficiosH2: 'Six areas, one build',
      oficiosLede: 'Each area gathers the tools I have used in real work. The tags grow as the work grows.',
      iaKicker: '03 · HOW I WORK',
      iaH2: 'With AI, and still learning',
      ciclo: {
        pasos: [
          { titulo: 'Understand', frase: 'Before writing code: what is needed, for whom and with what real data.', prueba: 'In the hero: the reference was runkiri.com', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md', sprite: 'archivista' },
          { titulo: 'Decide', frase: 'Sketches to compare and a written design I approve before building.', prueba: 'In the hero: 2 sketches, I picked the mix and approved the design', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md', sprite: 'capataz' },
          { titulo: 'Build alongside Claude', frase: 'A plan of small tasks, each with its tests written before the code.', prueba: 'In the hero: a 4-task plan', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/plans/2026-11-23-hero-obra-viva.md', sprite: 'maestro' },
          { titulo: 'Review', frase: 'A review of each task and of the whole change, measurement and live verification.', prueba: 'In the hero: 184 tests on every deploy', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/actions', sprite: 'doble' },
        ],
        cierre: 'The design and plan of every part of this site are in its repository: ',
        cierreEnlace: 'see the process on GitHub →',
        cierreHref: 'https://github.com/BMarin2003/portafolio-bmarin2003/tree/main/docs/superpowers',
      },
      puertaKicker: 'AFTER 6',
      puertaH2: 'The site closes. The house lights up.',
      puertaP: 'Role-playing, games, shows and what is playing on Spotify right now.',
      puertaCta: 'enter the house →',
      areas: {
        enLaObra: 'Used on:',
        numero: 'The number is how many projects I used it on.',
        sinProyectos: 'Everyday tools; not yet tied to a CorAll project on the timeline.',
      },
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
