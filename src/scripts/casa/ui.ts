import { faseAt, formatClock, msUntilNextMinute, trujilloHour } from '../../lib/casa/time';
import type { Fase } from '../../lib/casa/time';
import type { ObjetoId } from '../../lib/casa/scene';

const ADELANTO = 10;
const subtitulos: Record<Fase, string> = {
  noche: 'Bryan en la PC; la cuadrilla llegó para la partida de rol.',
  tarde: 'Bryan en la PC; la cuadrilla llegó para la partida de rol.',
  dia: 'La cuadrilla está en la obra; Bryan pasea por la biblioteca.',
  amanecer: 'La cuadrilla está en la obra; Bryan pasea por la biblioteca.',
};

/** Reloj, fase, botones de objeto y panel de /casa. La escena (canvas) se monta aparte y escucha onFase. */
export function initCasaUI(
  root: HTMLElement,
  opts: { now?: () => Date } = {},
): {
  open(id: ObjetoId): void;
  setOffset(h: number): void;
  onFase(cb: (f: Fase) => void): void;
  getFase(): Fase;
  destroy(): void;
} {
  const now = opts.now ?? (() => new Date());
  const doc = root.ownerDocument;
  const reloj = root.querySelector<HTMLElement>('[data-reloj]');
  const boton = root.querySelector<HTMLButtonElement>('[data-adelantar]');
  const titulo = root.querySelector<HTMLElement>('[data-titulo]');
  const subtitulo = root.querySelector<HTMLElement>('[data-subtitulo]');
  const botones = [...root.querySelectorAll<HTMLButtonElement>('button[data-objeto]')];
  const paneles = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const reducido = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  let offset = 0;
  let fase: Fase = 'noche';
  let abierto: ObjetoId = 'parlante';
  let timer: ReturnType<typeof setTimeout> | undefined;
  const oyentes: ((f: Fase) => void)[] = [];

  const pintar = () => {
    const h = trujilloHour(now(), offset);
    const nueva = faseAt(h.hour);
    if (reloj) reloj.textContent = `TRUJILLO · ${formatClock(h)}`;
    const cambio = nueva !== fase || root.dataset.fase === undefined;
    fase = nueva;
    root.dataset.fase = fase;
    if (cambio) {
      if (titulo) titulo.textContent = fase === 'noche' || fase === 'tarde' ? 'La casa, después de las 6' : 'La casa, de día';
      if (subtitulo) subtitulo.textContent = subtitulos[fase];
      oyentes.forEach((cb) => cb(fase));
    }
  };

  const programar = () => {
    if (reducido) return; // la hora queda estática
    timer = setTimeout(() => {
      pintar();
      programar();
    }, msUntilNextMinute(now()));
  };

  const mostrar = (id: ObjetoId) => {
    abierto = id;
    paneles.forEach((p) => (p.hidden = p.dataset.panel !== id));
    botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.objeto === id)));
  };

  const open = (id: ObjetoId) => {
    mostrar(id);
    doc.querySelector<HTMLElement>(`[data-panel="${id}"] h2`)?.focus();
  };

  const setOffset = (h: number) => {
    offset = h;
    boton?.setAttribute('aria-pressed', String(h !== 0));
    pintar();
  };

  const onClickBoton = (b: HTMLButtonElement) => () => open(b.dataset.objeto as ObjetoId);
  const manejadores = botones.map((b) => [b, onClickBoton(b)] as const);
  manejadores.forEach(([b, fn]) => b.addEventListener('click', fn));
  const alAdelantar = () => setOffset(offset === 0 ? ADELANTO : 0);
  boton?.addEventListener('click', alAdelantar);
  if (boton) boton.hidden = false;
  const alTeclear = (e: Event) => {
    if ((e as KeyboardEvent).key !== 'Escape' || !doc.activeElement?.closest('[data-panel]')) return;
    botones.find((b) => b.dataset.objeto === abierto)?.focus();
  };
  doc.addEventListener('keydown', alTeclear);

  pintar();
  mostrar(abierto);
  programar();

  return {
    open,
    setOffset,
    onFase: (cb) => void oyentes.push(cb),
    getFase: () => fase,
    destroy() {
      if (timer) clearTimeout(timer);
      manejadores.forEach(([b, fn]) => b.removeEventListener('click', fn));
      boton?.removeEventListener('click', alAdelantar);
      doc.removeEventListener('keydown', alTeclear);
    },
  };
}
