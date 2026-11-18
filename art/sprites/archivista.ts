import { blink, low, over, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Archivista (documentación y conocimiento): bloque lavanda con lentes y una ficha en la mano.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const bare = [
  '................',
  '................',
  '................',
  '...oooooooooo...',
  '..ollggllggllo..',
  '..ocgeeggeegco..',
  '..ocgewccewgco..',
  '.oocgeecceegcoo.',
  'occccggccggcccco',
  'odcccccddcccccdo',
  '.ooccccccccccoo.',
  '..odccccccccdo..',
  '..oddddddddddo..',
  '..oooooooooooo..',
];
const CARD = ['qqq', 'quq', 'qqq'];
const body = over(bare, 13, 5, CARD);

// acción: abre el cajón, mete la ficha y lo cierra
const open = over(stand(body), 13, 11, ['iii', 'KKK', 'KzK', 'KKK', 'KKK']);
const file = over(stand(bare), 13, 9, ['quq', 'qqq', 'KKK', 'KzK', 'KKK', 'KKK']);
const shut = over(stand(bare), 13, 12, ['KKK', 'KzK', 'KKK', 'KKK']);

const def: SpriteDef = {
  name: 'archivista',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#958AC0',
    l: '#B8AFDB',
    d: '#6E6496',
    e: '#1C2129',
    w: '#F4EFE6',
    g: '#E8C46A',
    q: '#F2E6C8',
    u: '#B9A98A',
    i: '#1C2129',
    K: '#7A8496',
    z: '#C9CED6',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [open, file, shut],
  },
};

export default def;
