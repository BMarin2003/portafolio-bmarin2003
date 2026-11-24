import type { Fase } from './time';

/** Mundo en píxeles de sprite; se escala por enteros en pantalla. Derivado del boceto (casa de 1100×640 → 320×180). */
export const WIDTH = 320;
export const HEIGHT = 180;

export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };
export type ObjetoId = 'pc' | 'tv' | 'parlante' | 'mesa' | 'estante';
export type Objeto = { id: ObjetoId; rect: Rect };
export type Habitacion = { id: 'biblioteca' | 'musica' | 'cuarto' | 'rol'; rect: Rect };
export type Actor = { sprite: string; route: Point[]; anim: 'walk' | 'action' | 'sit' | 'roll' | 'idle'; speed: number };

// Arriba y abajo se separan en y=97..100 (suelo del piso alto: 97; suelo de la planta baja: 170).
export const habitaciones: Habitacion[] = [
  { id: 'biblioteca', rect: { x: 22, y: 27, w: 138, h: 70 } },
  { id: 'musica', rect: { x: 160, y: 27, w: 138, h: 70 } },
  { id: 'cuarto', rect: { x: 22, y: 100, w: 160, h: 70 } },
  { id: 'rol', rect: { x: 182, y: 100, w: 116, h: 70 } },
];

export const objetos: Objeto[] = [
  { id: 'pc', rect: { x: 31, y: 137, w: 35, h: 31 } },
  { id: 'tv', rect: { x: 89, y: 111, w: 44, h: 27 } },
  { id: 'parlante', rect: { x: 180, y: 52, w: 20, h: 37 } },
  { id: 'mesa', rect: { x: 213, y: 139, w: 65, h: 20 } },
  { id: 'estante', rect: { x: 34, y: 44, w: 50, h: 45 } },
];

// Las rutas son la esquina superior izquierda del sprite: y = suelo − alto (Bryan 24, oficios 16).
const bryanSentado: Actor = { sprite: 'bryan', anim: 'sit', speed: 0, route: [{ x: 34, y: 146 }] };
const partida: Actor[] = [
  { sprite: 'capataz', anim: 'idle', speed: 0, route: [{ x: 196, y: 154 }] },
  { sprite: 'doble', anim: 'action', speed: 0, route: [{ x: 217, y: 123 }] },
  { sprite: 'decorador', anim: 'idle', speed: 0, route: [{ x: 279, y: 154 }] },
];

export function actoresPorFase(f: Fase): Actor[] {
  switch (f) {
    case 'dia':
      return [{ sprite: 'bryan', anim: 'walk', speed: 14, route: [{ x: 92, y: 73 }, { x: 136, y: 73 }] }];
    case 'amanecer':
      return [{ sprite: 'bryan', anim: 'walk', speed: 14, route: [{ x: 70, y: 146 }, { x: 120, y: 146 }] }];
    default:
      return [bryanSentado, ...partida];
  }
}
