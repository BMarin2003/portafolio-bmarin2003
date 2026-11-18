import { blink, low, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// superpowers (método): bot azul con un portapapeles en la mano izquierda.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const body = [
  '................',
  '................',
  '.....oooooo.....',
  '...oollllccoo...',
  '..ollcccccccco..',
  '..olceecceecco..',
  '..occewccewcco..',
  '..occeecceecco..',
  '..ssccccccccco..',
  'bbssbbcddcccco..',
  'bqqqpbccccccdo..',
  'bppppbcccccddo..',
  'bqqppbddddddo...',
  'bbbbbboooooo....',
];

// acción: marca un visto en una hoja limpia (filas 10 a 12, columnas 1 a 4)
const sheet = (paper: string[]) => body.map((r, y) => (y >= 10 && y <= 12 ? r[0] + paper[y - 10] + r.slice(5) : r));
const blank = sheet(['pppp', 'pppp', 'pppp']);
const tick1 = sheet(['pppp', 'gppp', 'pgpp']);
const tick2 = sheet(['pppg', 'gpgp', 'pgpp']);

const def: SpriteDef = {
  name: 'superpowers',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#7C93B8',
    l: '#A9BCD9',
    d: '#5A6F94',
    e: '#1C2129',
    w: '#F4EFE6',
    b: '#8A6440',
    s: '#AEB6C2',
    p: '#ECE6D8',
    q: '#9AA3B0',
    g: '#5FAF63',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [stand(blank), stand(tick1), stand(tick2)],
  },
};

export default def;
