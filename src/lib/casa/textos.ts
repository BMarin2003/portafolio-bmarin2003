import { esDeNoche } from './time';
import type { Fase } from './time';
import type { ObjetoId } from './scene';

export type Lang = 'es' | 'en';
type Habitacion = 'biblioteca' | 'musica' | 'cuarto' | 'rol';

/** Textos de /casa que también usa el cliente (reloj, escena): chicos a propósito, porque viajan en el bundle. */
export const textosCasa: Record<
  Lang,
  { noche: string; dia: string; subtitulo: Record<'noche' | 'dia', string>; habitaciones: Record<Habitacion, string>; objetos: Record<ObjetoId, string> }
> = {
  es: {
    noche: 'La casa, después de las 6',
    dia: 'La casa, de día',
    subtitulo: {
      noche: 'Bryan en la PC; la cuadrilla llegó para la partida de rol.',
      dia: 'La cuadrilla está en la obra; Bryan pasea por la biblioteca.',
    },
    habitaciones: { biblioteca: 'BIBLIOTECA', musica: 'MÚSICA', cuarto: 'CUARTO', rol: 'MESA DE ROL' },
    objetos: { pc: 'PC', tv: 'Televisor', parlante: 'Parlante', mesa: 'Mesa de rol', estante: 'Estante' },
  },
  en: {
    noche: 'The house, after 6',
    dia: 'The house, by day',
    subtitulo: {
      noche: 'Bryan at the PC; the crew came over for the role-playing session.',
      dia: 'The crew is at the site; Bryan wanders through the library.',
    },
    habitaciones: { biblioteca: 'LIBRARY', musica: 'MUSIC', cuarto: 'BEDROOM', rol: 'RPG TABLE' },
    objetos: { pc: 'PC', tv: 'TV', parlante: 'Speaker', mesa: 'RPG table', estante: 'Shelf' },
  },
};

/** Idioma de la página según `<html lang>`; todo lo que no es inglés es español. */
export const langOf = (doc: Document): Lang => (doc.documentElement.lang === 'en' ? 'en' : 'es');

export const tituloCasa = (lang: Lang, f: Fase) => (esDeNoche(f) ? textosCasa[lang].noche : textosCasa[lang].dia);
export const subtituloCasa = (lang: Lang, f: Fase) => textosCasa[lang].subtitulo[esDeNoche(f) ? 'noche' : 'dia'];
