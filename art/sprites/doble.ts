import { blink, low, over, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Doble de riesgo (calidad y seguridad): bloque verde con venda en la cabeza, parche en el ojo,
// el brazo vendado y una libreta para anotar lo que se rompió.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const bare = [
  '................',
  '................',
  '................',
  '...oooooooooo.v.',
  '..oVvvvpvvvvvovv',
  '..oppppcceecco..',
  '..ocpppccewcco..',
  '.ooccpccceeccoo.',
  'occccccddccccvco',
  'odccccccccccccVo',
  '.ooccccccccccoo.',
  '..odccccccccdo..',
  '..oddddddddddo..',
  '..oooooooooooo..',
];
const NOTEBOOK = ['zzz', 'quq', 'qqq', 'quq'];
const body = over(bare, 0, 7, NOTEBOOK);

// acción: tropieza, cae sentado mareado y anota el golpe en la libreta
const DIZZY = ['ce', 'ec', 'ce'];
const trip = over(step(body, 'right'), 9, 5, DIZZY);
const fell = over(['.'.repeat(16), '.'.repeat(16), ...body], 3, 1, ['Y      Y', '    Y   ']);
const fallen = over(fell, 9, 7, DIZZY);
const write = over(stand(bare), 5, 7, ['     k', '    y ', 'qqqq', 'quuq', 'qqqq']);

const def: SpriteDef = {
  name: 'doble',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#8FA86B',
    d: '#677B4A',
    e: '#1C2129',
    w: '#F4EFE6',
    v: '#EDE6D6',
    V: '#C9C0AE',
    p: '#262B33',
    q: '#F2E6C8',
    u: '#9AA3AE',
    z: '#C9CED6',
    k: '#8C6A4E',
    y: '#E8C46A',
    Y: '#F5D547',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [trip, fallen, write],
  },
};

export default def;
