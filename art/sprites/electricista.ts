import { blink, low, over, stand, step } from '../lib/frames.ts';
import type { SpriteDef } from '../lib/sprite.ts';

// Electricista (infraestructura y despliegue): bloque azul con casco de linterna y un rollo de cable.
// Cuerpo de las filas 0-13; los pies van aparte para el rebote de la caminata.
const bare = [
  '.....oooooo.....',
  '...ooHhLLhhoo...',
  '..ohhhhLLhhhho..',
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
const COIL = [' xx ', 'x  X', 'x  X', ' XX '];
const body = over(bare, 0, 7, COIL);

// acción: alza el enchufe, lo conecta y salta la chispa
const plug = over(body, 14, 4, ['zz', 'zz', 'x ', 'x ']);
const spark = over(plug, 12, 0, ['Y  Y', ' YL ', ' LY ', 'Y  Y']);
const flash = over(plug, 12, 0, ['  L ', 'LYYL', ' YL ', '  Y ']);

const def: SpriteDef = {
  name: 'electricista',
  width: 16,
  height: 16,
  palette: {
    '.': null,
    o: '#39414E',
    c: '#7C93B8',
    d: '#58698A',
    e: '#1C2129',
    w: '#F4EFE6',
    h: '#E0823D',
    H: '#F0A766',
    k: '#A85A26',
    L: '#FFF2B0',
    Y: '#F5D547',
    x: '#E8C46A',
    X: '#B8913F',
    z: '#C9CED6',
  },
  animations: {
    idle: [stand(body), stand(blink(body))],
    walk: [step(body, 'left'), low(body), step(body, 'right'), low(body)],
    action: [stand(plug), stand(spark), stand(flash)],
  },
};

export default def;
