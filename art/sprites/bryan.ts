import { blink, low, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Bryan: el humano de la cuadrilla. Pelo oscuro y polera ámbar, los ojos de la familia.
// Cuerpo de las filas 0-21; los zapatos van aparte para el rebote de la caminata.
const body = [
  '....oooooooo....',
  '...ohHHhhhhho...',
  '..ohHhhhhhhhho..',
  '..ohhhhhhhhhho..',
  '..ohssshssssho..',
  '..ohseesseesho..',
  '..ohsewssewsho..',
  '..osseesseesso..',
  '..osssssssssso..',
  '..ossssSSsssso..',
  '...oSssssssSo...',
  '....ooSSSSoo....',
  '..oolllSSllloo..',
  '.olccccddcccclo.',
  '.occdccccccdcco.',
  '.occdccccccdcco.',
  '.ossoddddddosso.',
  '..ooppppppppoo..',
  '...oppppppppo...',
  '...opppoopppo...',
  '...oppo..oppo...',
  '...oPPo..oPPo...',
];
const SHOES = '...ozzo..ozzo...';

// tirada: sube el dado en la mano, lo suelta y cae junto a los pies.
// `over` pinta un parche sobre el cuadro; el espacio deja lo que había.
const over = (frame: string[], x: number, y: number, patch: string[]) =>
  frame.map((r, i) =>
    patch[i - y] === undefined
      ? r
      : [...r].map((ch, j) => (patch[i - y][j - x] ?? ' ') === ' ' ? ch : patch[i - y][j - x]).join(''),
  );
const DIE = ['www', 'wew', 'www'];
const TUMBLE = [' ww', 'wew', 'ww '];
const up = over(stand(body, SHOES), 12, 10, [
  ' www',
  ' wew',
  ' www',
  'osso',
  'csso',
  'cllo',
  'do..',
  'o...',
]);
const toss = over(stand(body, SHOES), 13, 18, TUMBLE);
const land = over(stand(body, SHOES), 13, 21, DIE);

// sentado de perfil frente a la PC, en un piso
const sit = [
  '....oooooo......',
  '...ohhhhhhoo....',
  '..ohhhhhhhhho...',
  '..ohhhhhhhhho...',
  '..ohhhhhsssso...',
  '..ohhhhsseeso...',
  '..ohhhSssewso...',
  '..ohhhSsseesso..',
  '..ohhhssssssso..',
  '...ohsssssSSo.oo',
  '....osssssso..bo',
  '.....ooSSoo...bo',
  '....olllllo...bo',
  '...ollcccllo..bo',
  '...occccccco..oo',
  '...occcdsssso.o.',
  '...occccooookkkk',
  '...oddddo.....o.',
  '...oppppppppo.o.',
  '...oPPPPPPPPo.o.',
  '..kkkkkkoppo..o.',
  '....o...oppo..o.',
  '....o...ozzzo.o.',
  '....o...ooooo.o.',
];

const def: SpriteDef = {
  name: 'bryan',
  width: 16,
  height: 24,
  palette: {
    '.': null,
    o: '#39414E',
    h: '#3A2C26',
    H: '#5C463A',
    s: '#E8BFA0',
    S: '#C4977A',
    e: '#1C2129',
    w: '#F4EFE6',
    c: '#D9A55B',
    l: '#F0CB86',
    d: '#A97B3A',
    p: '#55627E',
    P: '#434E66',
    k: '#8C6A4E',
    b: '#8FB8DE',
    z: '#C9CED6',
  },
  animations: {
    idle: [stand(body, SHOES), stand(blink(body, 's'), SHOES)],
    walk: [step(body, 'left', SHOES), low(body, SHOES), step(body, 'right', SHOES), low(body, SHOES)],
    sit: [sit],
    roll: [up, toss, land],
  },
};

export default def;
