// Cuadros compartidos por los personajes: el cuerpo va aparte de los pies, que suman las dos
// últimas filas del cuadro, para el rebote de 1 px de la caminata. El alto sale del cuerpo.
const FEET = '....oo....oo....';

// En el paso, el pie del lado `up` se levanta: su mitad de la última fila queda vacía.
const lift = (feet: string, up: 'left' | 'right') => {
  const half = feet.length / 2;
  const empty = '.'.repeat(half);
  return up === 'left' ? empty + feet.slice(half) : feet.slice(0, half) + empty;
};

export const stand = (body: string[], feet = FEET) => [...body, feet, feet];
export const step = (body: string[], up: 'left' | 'right', feet = FEET) => [...body, feet, lift(feet, up)];
export const low = (body: string[], feet = FEET) => ['.'.repeat(feet.length), ...body, feet];

// Ojos cerrados (filas 5 y 6): queda la línea de abajo del ojo. `lid` es el color del párpado.
export const blink = (body: string[], lid = 'c') =>
  body.map((r, y) => (y === 5 || y === 6 ? r.replace(/[ew]/g, lid) : r));

// `over` pinta un parche sobre el cuadro desde (x, y); el espacio deja lo que había.
export const over = (frame: string[], x: number, y: number, patch: string[]) =>
  frame.map((r, i) =>
    patch[i - y] === undefined
      ? r
      : [...r].map((ch, j) => ((patch[i - y][j - x] ?? ' ') === ' ' ? ch : patch[i - y][j - x])).join(''),
  );
