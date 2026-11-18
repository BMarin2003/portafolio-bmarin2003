import type { SpriteDef } from '../lib/sprite.ts';

// ponytail (criterio): bot ámbar con coleta y párpados caídos, el senior flojo.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const body = [
  '..........hhh...',
  '.........ohHHh..',
  '.....oooooo..hh.',
  '...oollllccoo.hh',
  '..ollccccccccoh.',
  '..olcddccddcco..',
  '..occeecceecco..',
  '..occewccewcco..',
  '..occcccccccco..',
  '..occccddcccco..',
  '..odccccccccdo..',
  '..oddccccccddo..',
  '...oddddddddo...',
  '....oooooooo....',
];

// ojos cerrados: queda una línea
const shut = (b: string[]) =>
  b.map((r, y) => (y === 5 || y === 6 ? r.replace(/[de]/g, 'c') : y === 7 ? r.replace(/w/g, 'e') : r));

// acción: bostezo (filas 8 a 10 de la boca)
const yawn = (mouth: string[]) => shut(body).map((r, y) => (y >= 8 && y <= 10 ? mouth[y - 8] : r));
const yawn1 = yawn([
  '..occcccccccco..',
  '..occcceecccco..',
  '..odccceecccdo..',
]);
const yawn2 = yawn([
  '..occcceecccco..',
  '..occceeeeccco..',
  '..odccemmeccdo..',
]);

const FEET = '....oo....oo....';
const stand = (b: string[]) => [...b, FEET, FEET];
const step = (b: string[], up: 'left' | 'right') => [
  ...b,
  FEET,
  up === 'left' ? '..........oo....' : '....oo..........',
];
const low = (b: string[]) => ['................', ...b, FEET];

const def: SpriteDef = {
  name: 'ponytail',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#D9A55B',
    l: '#F0CB86',
    d: '#A97B3A',
    e: '#1C2129',
    w: '#F4EFE6',
    h: '#8A5A2B',
    H: '#B07A3E',
    m: '#D9776E',
  },
  animations: {
    idle: [stand(body), stand(shut(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [stand(yawn1), stand(yawn2), stand(yawn1)],
  },
};

export default def;
