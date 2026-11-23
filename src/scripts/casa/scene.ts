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
const CIELO = { noche: 0x0b1022, dia: 0x9cc3e0 };
const SOL = 0xf2c94c;
const LUNA = 0xe6e3dd;
const PANTALLA = 0x7c93b8;
/** Cuadros por tick a 60 fps (0.1 ≈ 6 cuadros por segundo). */
const VELOCIDAD: Record<Actor['anim'], number> = { walk: 0.1, action: 0.05, roll: 0.04, idle: 0.03, sit: 0 };

function colores(f: Fase) {
  const paleta = esDeNoche(f) ? 'noche' : 'dia';
  return { pared: PARED[paleta], cielo: CIELO[paleta], sol: !esDeNoche(f) };
}

/** Borde de 1 px por fuera del rectángulo, con rectángulos llenos para que quede nítido. */
function marco(g: Graphics, r: Rect, color: number): void {
  g.rect(r.x - 1, r.y - 1, r.w + 2, 1).rect(r.x - 1, r.y + r.h, r.w + 2, 1).rect(r.x - 1, r.y, 1, r.h).rect(r.x + r.w, r.y, 1, r.h).fill(color);
}

function dibujarCasa(g: Graphics, f: Fase): void {
  const { pared, cielo, sol } = colores(f);
  g.clear();
  g.poly([20, 26, 160, 3, 300, 26]).fill(LINEA); // techo
  g.rect(20, 25, 280, 147).fill(LINEA); // marco
  g.rect(22, 27, 276, 143).fill(pared);
  g.rect(22, 97, 276, 3).fill(LINEA); // entrepiso
  g.rect(159, 27, 2, 70).fill(LINEA); // biblioteca | música
  g.rect(181, 100, 2, 70).fill(LINEA); // cuarto | mesa de rol
  g.rect(12, 172, 296, 3).fill(LINEA); // vereda
  g.rect(262, 35, 26, 20).fill(LINEA); // ventana
  g.rect(264, 37, 22, 16).fill(cielo);
  if (sol) {
    g.circle(275, 45, 3).fill(SOL);
  } else {
    g.circle(275, 45, 3).fill(LUNA);
    g.circle(273, 44, 3).fill(cielo); // luna menguante
  }
}

function dibujarMuebles(g: Graphics): void {
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
  // mesa de rol con su d20
  g.rect(213, 139, 65, 20).fill(LINEA).rect(214, 140, 63, 18).fill(MADERA);
  g.rect(216, 159, 3, 11).fill(LINEA).rect(272, 159, 3, 11).fill(LINEA);
  g.poly([251, 132, 254, 134, 254, 137, 251, 138, 248, 137, 248, 134]).fill(0xb0564b);
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
  const brillo = new Graphics().rect(46, 134, 24, 20).fill({ color: PANTALLA, alpha: 0.18 });
  const actores = new Container();
  const hover = new Graphics();
  const zonas = new Container();
  dibujarMuebles(muebles);
  world.addChild(casa, muebles, brillo, actores, hover, zonas);

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
