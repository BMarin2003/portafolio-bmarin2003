import { blink, low, over, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Decorador (frontend y diseño): bloque rosado con boina de pintor, pincel y paleta.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const bare = [
  '.......ovo......',
  '....ooVVvvvoo...',
  '..ooVvvvvvvvvoo.',
  '.ovvvvvvvvvvvvo.',
  '.ovvvddddddddo..',
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
// paleta de pintor en la mano izquierda y pincel en la derecha; `tip` es el color de la punta
const PALETTE = ['tpt', 'qtr', 'tt '];
const brush = (frame: string[], tip: string) => over(frame, 14, 1, [tip, tip, 'z', 'k', 'k', 'k', 'k']);
const body = brush(over(bare, 0, 8, PALETTE), 'p');

// acción: pinceladas en el aire; cada una con otro color de la paleta
const stroke = (tip: string, marks: string) => over(brush(over(bare, 0, 8, PALETTE), tip), 9, 0, [marks]);
const def: SpriteDef = {
  name: 'decorador',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#C48A96',
    d: '#9A6470',
    e: '#1C2129',
    w: '#F4EFE6',
    v: '#4E5A8C',
    V: '#7280B3',
    t: '#D9B48A',
    p: '#E8C46A',
    q: '#7FA8D8',
    r: '#D0574A',
    z: '#C9CED6',
    k: '#8C6A4E',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [stand(stroke('p', '   pp')), stand(stroke('q', ' qqqq')), stand(stroke('r', 'rrrrr'))],
  },
};

export default def;
