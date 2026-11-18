import { blink, low, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// hallmark (diseño): bot rosado con un lápiz en alto en el puño derecho.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const body = [
  '..............o.',
  '..............tt',
  '.....oooooo...yY',
  '...oollllccoo.yY',
  '..ollccccccccoyY',
  '..olceecceeccoyY',
  '..occewccewccocc',
  '..occeecceeccodd',
  '..occcccccccccoo',
  '..occccddcccco..',
  '..odccccccccdo..',
  '..oddccccccddo..',
  '...oddddddddo...',
  '....oooooooo....',
];

// acción: la punta del lápiz deja un trazo en el aire que crece
const trace = (marks: string[]) => [...marks, ...body.slice(2)];
const draw1 = trace(['............wwo.', '..............tt']);
const draw2 = trace(['.........w..wwo.', '..........ww..tt']);
const draw3 = trace(['......w..w..wwo.', '.......ww.ww..tt']);

const def: SpriteDef = {
  name: 'hallmark',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#C48A96',
    l: '#E2B4BE',
    d: '#9A6470',
    e: '#1C2129',
    w: '#F4EFE6',
    y: '#E8C46A',
    Y: '#B8913F',
    t: '#F2DEC0',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [stand(draw1), stand(draw2), stand(draw3)],
  },
};

export default def;
