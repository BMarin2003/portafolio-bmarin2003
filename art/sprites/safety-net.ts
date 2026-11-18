import type { SpriteDef } from '../lib/sprite.ts';

// cc-safety-net (seguridad): bot terracota con casco ámbar.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const body = [
  '.....oooooo.....',
  '...ooaahhaaoo...',
  '..ohaaahhaaaao..',
  '..oaaaahhaaaao..',
  '.oAAAAAAAAAAAAo.',
  '..occeecceecco..',
  '..occewccewcco..',
  '..occeecceecco..',
  '..occcccccccco..',
  '..occccddcccco..',
  '..odccccccccdo..',
  '..oddccccccddo..',
  '...oddddddddo...',
  '....oooooooo....',
];

// acción: levanta la mano abierta, «alto». `cols` reemplaza el final de cada fila (el brazo
// derecho); `mouth` abre la boca para el grito.
const arm = (cols: string[], mouth = false) =>
  body.map((r, y) => {
    let row = cols[y] ? r.slice(0, 16 - cols[y].length) + cols[y] : r;
    if (mouth && (y === 9 || y === 10)) row = row.slice(0, 7) + 'ee' + row.slice(9);
    return row;
  });
const out = arm(['', '', '', '', '', '', 'oo', 'cc', 'dd', 'oo']);
const rise = arm(['', '', '', '', 'lc', 'cc', 'dc', 'dc', 'dd', 'oo']);
const palm = ['', '', 'c.c', 'ccc', 'ccc', 'dc', 'dc', 'dc', 'dd', 'oo'];
const halt = arm(palm);
const shout = arm(palm, true);

const FEET = '....oo....oo....';
const stand = (b: string[]) => [...b, FEET, FEET];
const step = (b: string[], up: 'left' | 'right') => [
  ...b,
  FEET,
  up === 'left' ? '..........oo....' : '....oo..........',
];
const low = (b: string[]) => ['................', ...b, FEET];
const blink = (b: string[]) => b.map((r, y) => (y === 5 || y === 6 ? r.replace(/[ew]/g, 'c') : r));

const def: SpriteDef = {
  name: 'safety-net',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#C27A5C',
    l: '#DDA088',
    d: '#985A40',
    e: '#1C2129',
    w: '#F4EFE6',
    a: '#D9A55B',
    h: '#F0CB86',
    A: '#A97B3A',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [stand(out), stand(rise), stand(halt), stand(shout)],
  },
};

export default def;
