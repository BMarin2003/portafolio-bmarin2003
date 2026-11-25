import { cronologico } from './periodo';

type Proyecto = { name: string; desde: string; stack: string[] };

/** «Bun / Elysia» → ['Bun', 'Elysia'] */
const partesDe = (tag: string): string[] => tag.split('/').map((s) => s.trim());

/** Nombres, en orden cronológico, de los proyectos con alguna de esas herramientas. */
const conAlguna = (proyectos: readonly Proyecto[], herramientas: string[]): string[] =>
  cronologico(proyectos.filter((p) => p.stack.some((s) => herramientas.includes(s)))).map((p) => p.name);

/** En qué proyectos se usó una herramienta (o una de las partes de «A / B»). */
export const proyectosDe = (tag: string, proyectos: readonly Proyecto[]): string[] =>
  conAlguna(proyectos, partesDe(tag));

/** Unión cronológica, sin repetir, de los proyectos de un área. */
export const proyectosDelArea = (tags: string[], proyectos: readonly Proyecto[]): string[] =>
  conAlguna(proyectos, tags.flatMap(partesDe));
