import { comoTrabajo, corall, esteSitio, games, oficios, screens } from './data/site';
import { comoTrabajoEn, corallEn, esteSitioEn, oficiosEn, screensEn } from './data/site.en';
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
    ? { corall: corallEn, esteSitio: esteSitioEn, oficios: oficiosEn, comoTrabajo: comoTrabajoEn, screens: screensEn, games }
    : { corall, esteSitio, oficios, comoTrabajo, screens, games };

export const t = {
  es: {
    otroIdioma: 'english',
    pie: ['Bryan Marin Yupanqui · Trujillo, Perú', 'Construido junto a Claude (Anthropic) · pixel art original'],
    ogLocale: 'es_PE',
    ogAlt: 'Bryan Marin y su cuadrilla pixel art trabajando en la obra',
    pro: {
      title: 'Bryan Marin · ingeniero de sistemas junior, Perú',
      description: 'Ingeniero de sistemas junior en CorAll D&R (Trujillo, Perú). Sistemas web con React, Bun/Elysia y PostgreSQL: un ERP, plataformas de gestión y un portal de clientes.',
      navAria: 'Principal',
      nav: { proyectos: 'proyectos', oficios: 'stack', ia: 'cómo trabajo', casa: 'la casa →' },
      heroTag: 'INGENIERO DE SISTEMAS JUNIOR · CORALL D&R · TRUJILLO, PERÚ',
      h1: 'Desarrollo sistemas web de punta a punta.',
      lede: 'Un ERP, plataformas de gestión y un portal de clientes, con React, Bun/Elysia y PostgreSQL.',
      verObra: 'Ver proyectos',
      conocer: 'ver stack',
      proyectosKicker: '01 · EXPERIENCIA',
      proyectosH2: 'Proyectos en CorAll D&R',
      reto: 'El reto:',
      proyectosLede: 'Cinco proyectos desde febrero de 2026: rol, stack, equipo y reto de cada uno.',
      detalle: 'qué hice y con quién',
      commits: 'commits míos',
      oficiosKicker: '02 · STACK',
      oficiosH2: 'Herramientas por área',
      oficiosLede: 'Herramientas que he usado en trabajo real, agrupadas por área.',
      iaKicker: '03 · CÓMO TRABAJO',
      iaH2: 'Proceso de trabajo con IA',
      ciclo: {
        pasos: [
          { titulo: 'Entender', frase: 'Antes de escribir código: qué se necesita, para quién y con qué datos reales.', prueba: 'Portada del sitio: la referencia fue runkiri.com', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md', sprite: 'archivista' },
          { titulo: 'Decidir', frase: 'Bocetos para comparar y un diseño escrito que apruebo antes de construir.', prueba: 'Portada del sitio: 2 bocetos, elegí la mezcla y aprobé el diseño', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md', sprite: 'capataz' },
          { titulo: 'Construir junto a Claude', frase: 'Un plan por tareas chicas, cada una con sus tests escritos antes del código.', prueba: 'Portada del sitio: plan de 4 tareas', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/plans/2026-11-23-hero-obra-viva.md', sprite: 'maestro' },
          { titulo: 'Revisar', frase: 'Code review por tarea y del cambio completo; mido y verifico en vivo.', prueba: 'Este sitio: los tests corren en cada deploy', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/actions', sprite: 'doble' },
        ],
        cierre: 'El diseño y el plan de cada parte de este sitio están en su repositorio: ',
        cierreEnlace: 'ver el proceso en GitHub →',
        cierreHref: 'https://github.com/BMarin2003/portafolio-bmarin2003/tree/main/docs/superpowers',
      },
      puertaKicker: 'DESPUÉS DE LAS 6',
      puertaH2: 'Fuera del trabajo',
      puertaP: 'Rol, juegos, series y lo que suena ahora en Spotify.',
      puertaCta: 'entrar a la casa →',
      areas: {
        enLaObra: 'En proyectos:',
        numero: 'El número: en cuántos proyectos (de CorAll y este sitio) la usé.',
        sinProyectos: 'Herramientas de uso diario; no forman parte del stack de los proyectos listados.',
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
      title: 'Bryan Marin · junior systems engineer, Peru',
      description: 'Junior systems engineer at CorAll D&R (Trujillo, Peru). Web systems with React, Bun/Elysia and PostgreSQL: an ERP, management platforms and a customer portal.',
      navAria: 'Main',
      nav: { proyectos: 'projects', oficios: 'stack', ia: 'how I work', casa: 'the house →' },
      heroTag: 'JUNIOR SYSTEMS ENGINEER · CORALL D&R · TRUJILLO, PERU',
      h1: 'I build web systems end to end.',
      lede: 'An ERP, management platforms and a customer portal, built with React, Bun/Elysia and PostgreSQL.',
      verObra: 'See projects',
      conocer: 'see the stack',
      proyectosKicker: '01 · EXPERIENCE',
      proyectosH2: 'Projects at CorAll D&R',
      reto: 'The challenge:',
      proyectosLede: 'Five projects since February 2026: role, stack, team and challenge for each.',
      detalle: 'what I did and with whom',
      commits: 'of my commits',
      oficiosKicker: '02 · STACK',
      oficiosH2: 'Tools by area',
      oficiosLede: 'Tools I have used in real work, grouped by area.',
      iaKicker: '03 · HOW I WORK',
      iaH2: 'My AI-assisted process',
      ciclo: {
        pasos: [
          { titulo: 'Understand', frase: 'Before writing code: what is needed, for whom and with what real data.', prueba: 'Site header: the reference was runkiri.com', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md', sprite: 'archivista' },
          { titulo: 'Decide', frase: 'Sketches to compare and a written design I approve before building.', prueba: 'Site header: 2 sketches, I picked the mix and approved the design', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md', sprite: 'capataz' },
          { titulo: 'Build alongside Claude', frase: 'A plan of small tasks, each with its tests written before the code.', prueba: 'Site header: a 4-task plan', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/blob/main/docs/superpowers/plans/2026-11-23-hero-obra-viva.md', sprite: 'maestro' },
          { titulo: 'Review', frase: 'Code review per task and of the whole change; I measure and verify live.', prueba: 'This site: tests run on every deploy', href: 'https://github.com/BMarin2003/portafolio-bmarin2003/actions', sprite: 'doble' },
        ],
        cierre: 'The design and plan of every part of this site are in its repository: ',
        cierreEnlace: 'see the process on GitHub →',
        cierreHref: 'https://github.com/BMarin2003/portafolio-bmarin2003/tree/main/docs/superpowers',
      },
      puertaKicker: 'AFTER 6',
      puertaH2: 'Outside work',
      puertaP: 'Role-playing, games, shows and what is playing on Spotify right now.',
      puertaCta: 'enter the house →',
      areas: {
        enLaObra: 'Used on:',
        numero: 'The number: how many projects (CorAll and this site) I used it on.',
        sinProyectos: 'Everyday tools; not part of the stack of the projects listed.',
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
