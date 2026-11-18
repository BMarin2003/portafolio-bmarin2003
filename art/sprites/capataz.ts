import { blink, low, over, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Capataz (planificación y método): bloque ámbar con casco blanco de visera y el plano enrollado.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const bare = [
  '.....oooooo.....',
  '...ooHHhhhhoo...',
  '..ohhhhhhhhhho..',
  '.okkkkkkkkkkkko.',
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
// el plano enrollado bajo la mano derecha
const body = over(bare, 14, 5, ['nn', 'bB', 'bB', 'cB', 'dB', 'bB', 'bB', 'nn']);

// acción: toma el rollo con las dos manos, lo despliega y marca un cuarto del plano
const roll = over(bare, 1, 9, ['nbbbbbbbbbbbbn', 'nBBBBBBBBBBBBn']);
const plan = over(bare, 1, 8, [
  'BbbbbbbbbbbbbB',
  'BbnnnnnnnnnnbB',
  'BbnbbbnbbbbnbB',
  'BbnnnnnnnnnnbB',
  'BbbbbbbbbbbbbB',
]);
const mark = over(plan, 9, 10, ['r']);

const def: SpriteDef = {
  name: 'capataz',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#D9A55B',
    d: '#A97B3A',
    e: '#1C2129',
    w: '#F4EFE6',
    h: '#E6DFD0',
    H: '#FBF8F1',
    k: '#B3AC9E',
    n: '#E8EEF6',
    b: '#6F9BD1',
    B: '#46699A',
    r: '#D0574A',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [stand(roll), stand(plan), stand(mark)],
  },
};

export default def;
