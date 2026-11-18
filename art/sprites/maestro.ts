import { blink, low, over, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Maestro de obra (backend y datos): bloque terracota con casco amarillo y el badilejo en la mano.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const bare = [
  '.....oooooo.....',
  '...ooyyHHyyoo...',
  '..oyyyyHHyyyyo..',
  '.oYYYYYYYYYYYYo.',
  '..oddddddddddo..',
  '..occeecceecco..',
  '..occewccewcco..',
  '.oocceecceeccoo.',
  'occccccddcccccco',
  'odccccccccccccdo',
  '.ooccccccccccoo.',
  '..odccccccccdo..',
  '..oddddddddddo..',
  '..oooooooooooo..',
];
const TROWEL = ['  g', ' gG', 'ggG', 'gGG', ' k '];
const body = over(bare, 13, 3, TROWEL);

// acción: alza un ladrillo, lo asienta sobre otro y lo golpea con el badilejo
const BRICK = ['rrR', 'RRR'];
const lift = over(stand(bare), 13, 6, BRICK);
const laid = over(stand(bare), 13, 11, [...BRICK, 'zzz', ...BRICK]);
const tap = over(laid, 12, 9, ['z gG', ' gGG']);

const def: SpriteDef = {
  name: 'maestro',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#C27A5C',
    d: '#93573F',
    e: '#1C2129',
    w: '#F4EFE6',
    y: '#E8C46A',
    H: '#F6DE9A',
    Y: '#B8913F',
    g: '#D5DAE0',
    G: '#9AA3AE',
    k: '#8C6A4E',
    r: '#B4553B',
    R: '#7E3726',
    z: '#D8D2C4',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [lift, laid, tap],
  },
};

export default def;
