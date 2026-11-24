import { AnimatedSprite, Application, Assets, Container, Graphics, Rectangle, Text, Texture } from 'pixi.js';
import type { Ticker } from 'pixi.js';
import { HEIGHT, WIDTH, actoresPorFase, habitaciones, objetos } from '../../lib/casa/scene';
import type { Actor, ObjetoId, Rect } from '../../lib/casa/scene';
import { positionAt } from '../../lib/casa/route';
import { esDeNoche } from '../../lib/casa/time';
import type { Fase } from '../../lib/casa/time';

export type MountScene = (
  container: HTMLElement,
  ui: { open(id: ObjetoId): void; onFase(cb: (f: Fase) => void): void; fase: Fase },
) => Promise<{ destroy(): void }>;

type SheetMeta = { frameWidth: number; frameHeight: number; animations: Record<string, { row: number; frames: number }> };
type Hoja = { meta: SheetMeta; anims: Record<string, Texture[]> };

const FASES: Fase[] = ['noche', 'amanecer', 'dia', 'tarde'];
const LINEA = 0x39414e;
const ACENTO = 0xd9a55b;
const MADERA = 0x5a4a3a;
const OSCURO = 0x0b0e13;
const PARED = { noche: 0x1a2030, dia: 0x2a303c };
const CIELO = { noche: 0x0b1022, dia: 0x3b4b60 };
const SOL = 0xf2c94c;
const LUNA = 0xe6e3dd;
const PANTALLA = 0x7c93b8;
const CIAN = 0x8ad0e0;
const CALIDO = 0xf2d49b;
const PISO = 0x3b3027;
const JUNTA = 0x2a221b;
const CIUDAD = { noche: 0x141b2c, dia: 0x2c3747 };
const SUELO = { noche: OSCURO, dia: 0x22262a };
/** Edificios lejanos a los costados de la casa: [x, ancho, techo]; llegan hasta la vereda (y=172). */
const EDIFICIOS = [
  [-64, 14, 126], [-50, 12, 140], [-38, 15, 116], [-23, 10, 132], [-13, 13, 122], [0, 11, 140], [11, 9, 150],
  [301, 10, 146], [311, 13, 124], [324, 10, 138], [334, 15, 114], [349, 12, 130], [361, 14, 120], [375, 12, 138],
];
const VENTANAS_CIUDAD = [
  [-60, 132], [-35, 122], [-33, 130], [-19, 140], [-9, 128], [3, 146], [14, 156],
  [304, 152], [315, 130], [318, 140], [338, 120], [341, 134], [353, 138], [365, 128], [368, 146],
];
const ESTRELLAS = [
  [-30, 52], [-20, 10], [-8, 34], [5, 18], [12, 60], [-16, 86], [2, 98], [30, 6], [48, 2], [66, 10], [92, 4], [118, 1],
  [202, 2], [226, 7], [250, 4], [270, 14], [290, 8], [306, 36], [318, 16], [330, 62], [312, 88], [342, 40], [356, 10], [372, 74],
];
/** Lámparas colgantes, una por habitación: [x del cordón, techo, largo del cordón, suelo]. */
const LAMPARAS = [
  [118, 29, 7, 93],
  [231, 29, 7, 93],
  [78, 102, 10, 166],
  [245, 102, 12, 166],
];
/** Cuadros por tick a 60 fps (0.1 ≈ 6 cuadros por segundo). */
const VELOCIDAD: Record<Actor['anim'], number> = { walk: 0.1, action: 0.05, roll: 0.04, idle: 0.03, sit: 0 };

function colores(f: Fase) {
  const paleta = esDeNoche(f) ? 'noche' : 'dia';
  return { pared: PARED[paleta], cielo: CIELO[paleta], ciudad: CIUDAD[paleta], suelo: SUELO[paleta], sol: !esDeNoche(f) };
}

/** Borde de 1 px por fuera del rectángulo, con rectángulos llenos para que quede nítido. */
function marco(g: Graphics, r: Rect, color: number): void {
  g.rect(r.x - 1, r.y - 1, r.w + 2, 1).rect(r.x - 1, r.y + r.h, r.w + 2, 1).rect(r.x - 1, r.y, 1, r.h).rect(r.x + r.w, r.y, 1, r.h).fill(color);
}

function dibujarCasa(g: Graphics, f: Fase): void {
  const { pared, cielo, ciudad, suelo, sol } = colores(f);
  g.clear();
  // exterior: pasa del borde del mundo para cubrir el margen que deja la escala entera
  g.rect(-400, -400, 1120, 572).fill(cielo);
  for (const [x, w, y] of EDIFICIOS) g.rect(x, y, w, 172 - y);
  g.fill(ciudad);
  if (!sol) {
    for (const [x, y] of VENTANAS_CIUDAD) g.rect(x, y, 1, 1);
    g.fill(0xb08d55);
    for (const [x, y] of ESTRELLAS) g.rect(x, y, 1, 1);
    g.fill(0x8f97a3);
  }
  g.rect(-400, 172, 1120, 408).fill(suelo);
  g.poly([20, 26, 160, 3, 300, 26]).fill(LINEA); // techo
  g.rect(20, 25, 280, 147).fill(LINEA); // marco
  g.rect(22, 27, 276, 143).fill(pared);
  // pisos de tablas: dos hileras con las juntas trabadas
  for (const y of [93, 166]) {
    g.rect(22, y, 276, 4).fill(PISO);
    g.rect(22, y + 2, 276, 1);
    for (let x = 30; x <= 286; x += 16) g.rect(x, y, 1, 2).rect(x + 8, y + 3, 1, 1);
    g.fill(JUNTA);
  }
  g.rect(22, 27, 276, 2).rect(22, 100, 276, 2).fill(MADERA); // vigas del techo
  g.rect(22, 97, 276, 3).fill(LINEA); // entrepiso
  g.rect(159, 27, 2, 70).fill(LINEA); // biblioteca | música
  g.rect(181, 100, 2, 70).fill(LINEA); // cuarto | mesa de rol
  g.rect(158, 29, 1, 64).rect(161, 29, 1, 64).rect(180, 102, 1, 64).rect(183, 102, 1, 64).fill(MADERA); // postes
  g.rect(12, 172, 296, 3).fill(LINEA); // vereda
  g.rect(262, 35, 26, 20).fill(LINEA); // ventana
  g.rect(264, 37, 22, 16).fill(cielo);
  if (sol) {
    g.circle(275, 45, 3).fill(SOL);
  } else {
    g.circle(275, 45, 3).fill(LUNA);
    g.circle(273, 44, 3).fill(cielo); // luna menguante
  }
  // ventana del cuarto, con cortinas
  g.rect(144, 110, 22, 18).fill(LINEA).rect(146, 112, 18, 14).fill(cielo).rect(154, 112, 1, 14).rect(146, 118, 18, 1).fill(LINEA);
  if (sol) {
    g.rect(148, 115, 5, 1).rect(149, 114, 3, 1).rect(157, 121, 6, 1).fill(0x8796a8); // nubes
  } else {
    g.rect(159, 113, 2, 1).rect(158, 114, 4, 2).rect(159, 116, 2, 1).fill(LUNA);
    g.rect(148, 114, 1, 1).rect(151, 123, 1, 1).rect(157, 124, 1, 1).rect(162, 121, 1, 1).fill(0x8f97a3);
  }
  g.rect(140, 108, 30, 1).fill(MADERA); // barral
  g.rect(141, 109, 4, 21).rect(165, 109, 4, 21).fill(0x3d4866);
  g.rect(142, 110, 1, 19).rect(167, 110, 1, 19).fill(0x2e3750);
}

function dibujarMuebles(g: Graphics): void {
  // alfombras bajo el escritorio y bajo la mesa de rol: color liso, borde arriba y flecos en las puntas
  g.rect(30, 167, 52, 3).fill(0x263049).rect(30, 167, 52, 1).fill(0x3a4663);
  g.rect(200, 167, 90, 3).fill(0x46292a).rect(200, 167, 90, 1).fill(0x613c37);
  g.rect(29, 168, 1, 2).rect(82, 168, 1, 2).rect(199, 168, 1, 2).rect(290, 168, 1, 2).fill(0x7d776a);
  // lámparas colgantes: cordón y pantalla
  for (const [x, techo, largo] of LAMPARAS) {
    const y = techo + largo;
    g.rect(x, techo, 1, largo).fill(LINEA);
    g.rect(x - 2, y, 5, 1).rect(x - 3, y + 1, 7, 1).rect(x - 4, y + 2, 9, 1).fill(0x4a5244);
  }
  // estante de la biblioteca, dos repisas de libros
  g.rect(34, 44, 50, 45).fill(MADERA).rect(35, 45, 48, 43).fill(0x2a221b).rect(35, 66, 48, 1).fill(MADERA);
  const repisa = (y: number, libros: [number, number, number][]) => {
    let x = 37;
    for (const [w, h, c] of libros) {
      g.rect(x, y - h, w, h).fill(c);
      x += w + 1;
    }
  };
  repisa(65, [[3, 9, 0xb0564b], [3, 8, 0x7c93b8], [4, 10, 0xd9a55b], [3, 7, 0x958ac0], [3, 9, 0x8fa86b]]);
  repisa(87, [[4, 8, 0xc27a5c], [3, 10, 0xe6e3dd], [3, 9, 0x7c93b8], [4, 9, 0xb0564b]]);
  // parlante
  g.rect(180, 52, 20, 37).fill(0x262c36);
  g.circle(190, 65, 6).fill(OSCURO).circle(190, 65, 4).fill(0x262c36);
  g.circle(190, 80, 3).fill(OSCURO).circle(190, 80, 1).fill(0x262c36);
  // televisor
  g.rect(89, 111, 44, 22).fill(LINEA).rect(91, 113, 40, 18).fill(OSCURO).rect(94, 127, 16, 1).fill(LUNA);
  g.rect(105, 133, 12, 4).fill(LINEA);
  // PC: monitor y escritorio
  g.rect(50, 138, 15, 11).fill(LINEA).rect(51, 139, 13, 9).fill(PANTALLA).rect(56, 149, 3, 3).fill(LINEA);
  g.rect(44, 152, 22, 2).fill(MADERA).rect(45, 154, 2, 16).fill(MADERA).rect(63, 154, 2, 16).fill(MADERA);
  // sillas en las cabeceras, detrás de quien juega: respaldo de dos travesaños, asiento y pata delantera
  for (const [respaldo, asiento, pata] of [[200, 200, 209], [286, 279, 280]]) {
    g.rect(respaldo, 142, 1, 28).rect(respaldo + 3, 142, 1, 28).rect(respaldo, 143, 4, 1).rect(respaldo, 147, 4, 1);
    g.rect(asiento, 157, 11, 2).rect(pata, 159, 2, 11);
  }
  g.fill(0x4a3b2e);
  // mesa de rol: tablero visto desde arriba, faldón, mapa, el d20 y tres dados
  g.rect(213, 139, 65, 20).fill(LINEA).rect(214, 140, 63, 18).fill(MADERA);
  g.rect(214, 140, 63, 8).fill(0x6b5844).rect(214, 148, 63, 1).fill(LINEA);
  g.rect(238, 141, 24, 6).fill(LINEA).rect(239, 142, 22, 4).fill(0x8c8466);
  g.rect(240, 142, 5, 2).rect(251, 144, 6, 2).fill(0x6c7a55).rect(247, 142, 1, 4).fill(0x5f7894);
  g.rect(256, 143, 1, 1).fill(0xb0564b).rect(243, 145, 1, 1).fill(PANTALLA);
  g.rect(216, 159, 3, 11).fill(LINEA).rect(272, 159, 3, 11).fill(LINEA);
  g.poly([251, 132, 254, 134, 254, 137, 251, 138, 248, 137, 248, 134]).fill(0xb0564b);
  g.rect(243, 136, 3, 3).fill(0x958ac0).rect(257, 136, 3, 3).fill(PANTALLA).rect(261, 136, 3, 3).fill(0x8fa86b);
  g.rect(244, 137, 1, 1).rect(258, 137, 1, 1).rect(262, 137, 1, 1).fill(LUNA);
}

/** Lo que se enciende de noche: las lámparas (aureola detrás de la pantalla, foco y reflejo en las tablas), el monitor y la ciudad en el televisor. */
function dibujarNoche(aureolas: Graphics, g: Graphics): void {
  for (const [x, techo, largo, suelo] of LAMPARAS) {
    const y = techo + largo;
    aureolas.rect(x - 4, y, 9, 1).rect(x - 5, y + 1, 11, 1).rect(x - 6, y + 2, 13, 3).rect(x - 5, y + 5, 11, 1).rect(x - 3, y + 6, 7, 1).fill(0x302e34);
    aureolas.rect(x - 3, y, 7, 1).rect(x - 4, y + 1, 9, 1).rect(x - 5, y + 2, 11, 3).rect(x - 3, y + 5, 7, 1).fill(0x4d4237);
    g.rect(x - 1, y + 3, 3, 1).rect(x, y + 4, 1, 1).fill(CALIDO);
    g.rect(x - 9, suelo, 19, 1).fill(0x6e5539);
  }
  g.rect(51, 139, 13, 9).fill(CIAN).rect(53, 141, 6, 1).rect(53, 143, 8, 1).rect(53, 145, 4, 1).fill(0x5f9fb2);
  // ciudad de noche en el televisor
  g.rect(91, 113, 40, 18).fill(0x1b2742);
  for (const [x, w, y] of [[91, 6, 122], [97, 5, 118], [102, 7, 124], [109, 4, 116], [113, 8, 121], [121, 5, 119], [126, 5, 125]]) g.rect(x, y, w, 131 - y);
  g.fill(0x0d1322);
  g.rect(99, 120, 1, 1).rect(104, 126, 1, 1).rect(110, 118, 1, 1).rect(116, 123, 1, 1).rect(118, 127, 1, 1).rect(123, 121, 1, 1).fill(ACENTO);
  g.rect(94, 115, 1, 1).rect(119, 114, 1, 1).rect(128, 116, 1, 1).fill(0x8f97a3);
}

async function cargarHoja(nombre: string): Promise<Hoja> {
  const res = await fetch(`/sprites/${nombre}.json`);
  if (!res.ok) throw new Error(`/sprites/${nombre}.json: ${res.status}`);
  const meta = (await res.json()) as SheetMeta;
  const base = await Assets.load<Texture>({ src: `/sprites/${nombre}.png`, data: { scaleMode: 'nearest' } });
  const { frameWidth: w, frameHeight: h } = meta;
  const anims = Object.fromEntries(
    Object.entries(meta.animations).map(([anim, { row, frames }]) => [
      anim,
      Array.from({ length: frames }, (_, i) => new Texture({ source: base.source, frame: new Rectangle(i * w, row * h, w, h) })),
    ]),
  );
  return { meta, anims };
}

/** Casa en corte con PixiJS, decorativa: todo lo que hace también existe en el DOM. */
export const mountScene: MountScene = async (container, ui) => {
  const nombres = [...new Set(FASES.flatMap((f) => actoresPorFase(f).map((a) => a.sprite)))];
  const pngs = nombres.map((n) => `/sprites/${n}.png`);
  const cuadros: Texture[] = [];
  const liberar = () => {
    cuadros.forEach((t) => t.destroy());
    Assets.unload(pngs).catch(() => {});
  };
  let app: Application | undefined;
  try {
    const resultados = await Promise.allSettled(nombres.map(cargarHoja));
    const hojas: Record<string, Hoja> = {};
    resultados.forEach((r, i) => {
      if (r.status !== 'fulfilled') return;
      hojas[nombres[i]] = r.value;
      cuadros.push(...Object.values(r.value.anims).flat());
    });
    const fallo = resultados.find((r) => r.status === 'rejected');
    if (fallo) throw fallo.reason;
    await container.ownerDocument.fonts?.ready.catch(() => {});
    app = new Application();
    const resolution = Math.max(1, container.ownerDocument.defaultView?.devicePixelRatio ?? 1);
    await app.init({ backgroundAlpha: 0, preference: 'webgl', antialias: false, roundPixels: true, resolution, autoDensity: true, resizeTo: container });
    return montar(app, container, ui, hojas, liberar);
  } catch (err) {
    try {
      app?.destroy(true, { children: true });
    } catch {
      // init a medias: no hay nada más que soltar
    }
    liberar();
    throw err;
  }
};

function montar(
  app: Application,
  container: HTMLElement,
  ui: Parameters<MountScene>[1],
  hojas: Record<string, Hoja>,
  liberar: () => void,
): { destroy(): void } {
  const doc = container.ownerDocument;
  const world = new Container();
  const casa = new Graphics();
  const muebles = new Graphics();
  // halo del monitor en la pared: dos escalones pegados a la pantalla, sin bajar del borde del monitor
  const brillo = new Graphics();
  for (const m of [4, 2]) brillo.rect(50 - m, 138 - m, 15 + 2 * m, 11 + m).fill({ color: CIAN, alpha: 0.1 });
  const aureolas = new Graphics();
  const nocturno = new Graphics();
  const actores = new Container();
  const hover = new Graphics();
  const zonas = new Container();
  dibujarMuebles(muebles);
  dibujarNoche(aureolas, nocturno);
  world.addChild(casa, brillo, aureolas, muebles, nocturno, actores, hover, zonas);

  for (const o of objetos) {
    const z = new Container();
    z.hitArea = new Rectangle(o.rect.x, o.rect.y, o.rect.w, o.rect.h);
    z.eventMode = 'static';
    z.cursor = 'pointer';
    z.on('pointertap', () => ui.open(o.id));
    z.on('pointerover', () => marco(hover.clear(), o.rect, ACENTO));
    z.on('pointerout', () => hover.clear());
    zonas.addChild(z);
  }

  // Las etiquetas van a resolución de pantalla, fuera del mundo escalado, para que el texto no se pixele.
  const etiquetas = habitaciones.map(
    (h) => new Text({ text: h.label, style: { fontFamily: "'DM Mono', monospace", fontSize: 11, fill: 0x8f97a3, letterSpacing: 0.5 } }),
  );
  app.stage.addChild(world, ...etiquetas);

  // Escala entera en píxeles del dispositivo: con 125 % o 150 % de zoom de Windows, cada píxel de sprite sigue siendo un bloque parejo.
  const layout = () => {
    const r = app.renderer.resolution;
    const w = app.screen.width * r;
    const h = app.screen.height * r;
    const s = Math.max(1, Math.floor(Math.min(w / WIDTH, h / HEIGHT)));
    const ox = Math.floor((w - WIDTH * s) / 2);
    const oy = Math.floor((h - HEIGHT * s) / 2);
    world.scale.set(s / r);
    world.position.set(ox / r, oy / r);
    etiquetas.forEach((t, i) => {
      const rect = habitaciones[i].rect;
      t.style.fontSize = Math.max(8, Math.round((3.6 * s) / r));
      t.position.set((ox + (rect.x + 4) * s) / r, (oy + (rect.y + 3) * s) / r);
    });
  };

  let sprites: { s: AnimatedSprite; a: Actor; medio: number }[] = [];
  let noche = false;
  const ponerFase = (f: Fase) => {
    dibujarCasa(casa, f);
    noche = esDeNoche(f);
    brillo.visible = noche;
    aureolas.visible = noche;
    nocturno.visible = noche;
    actores.removeChildren().forEach((c) => c.destroy());
    sprites = actoresPorFase(f).map((a) => {
      const hoja = hojas[a.sprite];
      const s = new AnimatedSprite(hoja.anims[a.anim], false);
      s.anchor.set(0.5, 0);
      s.animationSpeed = VELOCIDAD[a.anim];
      if (s.totalFrames > 1 && s.animationSpeed > 0) s.play();
      actores.addChild(s);
      return { s, a, medio: hoja.meta.frameWidth / 2 };
    });
  };

  let t = 0;
  const tick = (ticker: Ticker) => {
    t += ticker.deltaMS;
    for (const { s, a, medio } of sprites) {
      s.update(ticker);
      const p = positionAt(a.route, a.speed, t);
      s.position.set(Math.round(p.x) + medio, Math.round(p.y));
      s.scale.x = p.flip ? -1 : 1;
    }
    if (noche) brillo.alpha = 0.8 + 0.2 * Math.sin(t / 400);
  };

  let vivo = true;
  const alCambiarVisibilidad = () => (doc.hidden ? app.ticker.stop() : app.ticker.start());

  ponerFase(ui.fase);
  layout();
  tick(app.ticker);
  app.renderer.on('resize', layout);
  app.ticker.add(tick);
  ui.onFase((f) => vivo && ponerFase(f));
  doc.addEventListener('visibilitychange', alCambiarVisibilidad);
  alCambiarVisibilidad();

  const canvas = app.canvas;
  const img = container.querySelector('img');
  canvas.setAttribute('aria-hidden', 'true');
  // autoDensity fija el ancho y alto en px exactos: sin estirar el canvas, no se pierden filas de píxeles.
  Object.assign(canvas.style, { position: 'absolute', left: '0', top: '0' });
  container.appendChild(canvas);
  if (img) img.style.visibility = 'hidden';

  return {
    destroy() {
      if (!vivo) return;
      vivo = false;
      doc.removeEventListener('visibilitychange', alCambiarVisibilidad);
      img?.style.removeProperty('visibility');
      app.destroy(true, { children: true });
      liberar();
    },
  };
}
