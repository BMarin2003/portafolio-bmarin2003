/** Escena de la obra: y de cada tablón y del suelo, en px dentro de la escena. */
export const ESCENA = { ancho: 860, alto: 700, suelo: 640, pisos: { 1: 480, 2: 330, 3: 180 } } as const;

export type Piso = 'suelo' | 1 | 2 | 3;
export type Recorrido = { tipo: 'ida'; dx: number; s: number } | { tipo: 'sube'; alto: number; s: number } | { tipo: 'salto' } | null;
export type Monigote = { sprite: string; anim: 'walk' | 'action' | 'idle'; x: number; piso: Piso; recorrido: Recorrido; llegada: number };

// llegada: segundos de retraso de su aparición en la entrada (pisos bajos primero, suelo al final).
export const cuadrilla: Monigote[] = [
  { sprite: 'decorador', anim: 'action', x: 350, piso: 1, recorrido: null, llegada: 2.4 },
  { sprite: 'maestro', anim: 'action', x: 190, piso: 2, recorrido: null, llegada: 2.6 },
  { sprite: 'doble', anim: 'action', x: 530, piso: 2, recorrido: { tipo: 'salto' }, llegada: 2.8 },
  { sprite: 'capataz', anim: 'walk', x: 150, piso: 3, recorrido: { tipo: 'ida', dx: 260, s: 12 }, llegada: 3.0 },
  { sprite: 'electricista', anim: 'walk', x: 634, piso: 'suelo', recorrido: { tipo: 'sube', alto: ESCENA.suelo - ESCENA.pisos[3], s: 11 }, llegada: 3.2 },
  { sprite: 'archivista', anim: 'walk', x: 60, piso: 'suelo', recorrido: { tipo: 'ida', dx: 150, s: 9 }, llegada: 3.4 },
  { sprite: 'bryan', anim: 'idle', x: 470, piso: 'suelo', recorrido: null, llegada: 3.6 },
];

export function pies(m: Monigote): number {
  return m.piso === 'suelo' ? ESCENA.suelo : ESCENA.pisos[m.piso];
}

export const ENTRADA = { columnas: [0.3, 0.6], pisos: { 1: 1.0, 2: 1.5, 3: 2.0 }, total: 4 } as const;

/** Segundos que dura la aparición de cada monigote (animación `llega`). */
export const LLEGA = 0.4;
