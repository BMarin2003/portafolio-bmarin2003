import { blink, low, over, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Bryan: el humano de la cuadrilla. Piel trigueña, pelo negro ondulado con flequillo, cara redonda
// y polo granate con cuello; los ojos de la familia.
// Cuerpo de las filas 0-21; los zapatos van aparte para el rebote de la caminata.
const head = [
  '....ooo.oooo....',
  '...ohhhohhHhoo..',
  '..ohhHhhhhhHhhho',
  '.ohhhhhHhhhhhhho',
  '.ohhhHhhhhhHhhho',
  '.ohhseesseeshho.',
  '.ohssewssewssho.',
  '.ohsseesseessho.',
  '..osssssssssso..',
  '..osssssssssso..',
  '...osssmmssso...',
  '....oSSSSSSo....',
  '..oocclllccoo...',
];
const legs = [
  '..oppppppppppo..',
  '..oppppppppppo..',
  '..oppppooppppo..',
  '..opppo..opppo..',
  '..oPPPo..oPPPo..',
];
// brazos a los lados (caminata, tirada) y cruzados sobre la panza (reposo)
const body = [
  ...head,
  '.occcclSSlcccco.',
  '.occdcccdccdcco.',
  '.occdccccccdcco.',
  '.ossoddddddosso.',
  ...legs,
];
const crossed = [
  ...head,
  '.occcclSSlcccco.',
  '.oclsssssssssco.',
  '.ocSSSSSSSSSlco.',
  '.ocddddddddddco.',
  ...legs,
];
const SHOES = '..ozzzo..ozzzo..';

// tirada: sube el dado en la mano, lo suelta y cae junto a los pies.
const DIE = ['www', 'wew', 'www'];
const TUMBLE = [' ww', 'wew', 'ww '];
const up = over(stand(body, SHOES), 12, 9, [' www', ' wew', ' www', 'osso', 'ccso', 'cco.', 'ddo.']);
const toss = over(stand(body, SHOES), 13, 18, TUMBLE);
const land = over(stand(body, SHOES), 13, 21, DIE);

// sentado de perfil frente a la PC, en un piso
const sit = [
  '...ooo.oooo.....',
  '..ohhhohhHhoo...',
  '..ohhHhhhhhhho..',
  '.ohhhhhhhHhhhho.',
  '.ohhhHhhhhhshho.',
  '..ohhhhsseeso...',
  '..ohhhSssewso...',
  '..ohhhSsseesso..',
  '..ohhhsssssmso..',
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
    h: '#26222B',
    H: '#4A4252',
    s: '#B97A57',
    S: '#94593D',
    m: '#6E3B2A',
    e: '#1C2129',
    w: '#F4EFE6',
    c: '#8E2232',
    l: '#A8384A',
    d: '#6A1824',
    p: '#4B5468',
    P: '#3C4456',
    k: '#8C6A4E',
    b: '#8FB8DE',
    z: '#C9CED6',
  },
  animations: {
    idle: [stand(crossed, SHOES), stand(blink(crossed, 's'), SHOES)],
    walk: [step(body, 'left', SHOES), low(body, SHOES), step(body, 'right', SHOES), low(body, SHOES)],
    sit: [sit],
    roll: [up, toss, land],
  },
};

export default def;
