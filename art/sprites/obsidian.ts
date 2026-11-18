import { blink, low, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Obsidian (memoria): bot violeta que lee un libro abierto, más ancho que él.
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
  '..occcccccccco..',
  '..ppppcddcpppp..',
  '.bpppppccpppppb.',
  '.bpqqqpbbpqqqpb.',
  '.bppppbbbbppppb.',
  '..bbbbbbbbbbbb..',
];

// acción: cierra el libro y lo vuelve a abrir (filas 9 a 13)
const book = (rows: string[]) => [...body.slice(0, 9), ...rows];
const half = book([
  '..ocppcddcppco..',
  '..obpppccpppbo..',
  '..obpqpbbpqpbo..',
  '...bppbbbbppb...',
  '....bbbbbbbb....',
]);
const shut = book([
  '..occbbbbbbcco..',
  '..odbbbbbbbbdo..',
  '..odbbbkbbbbdo..',
  '...obbbbbbbbo...',
  '....pppppppp....',
]);

const def: SpriteDef = {
  name: 'obsidian',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#958AC0',
    l: '#BDB4DE',
    d: '#6F6596',
    e: '#1C2129',
    w: '#F4EFE6',
    b: '#4A3F72',
    k: '#C9BEF0',
    p: '#ECE6D8',
    q: '#9AA3B0',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [stand(half), stand(shut), stand(half), stand(body)],
  },
};

export default def;
