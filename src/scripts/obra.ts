// La obra de fondo del hero: recuerda la visita, reacciona al clic y se pausa fuera de pantalla.
// Sin este script la página se ve igual. Contrato en architecture.md.
const CLAVE = 'obra-armada';

type Opts = {
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
  observe?: (cb: (visible: boolean) => void) => void;
};

export function initObra(root: HTMLElement, opts: Opts = {}): void {
  try {
    (opts.storage ?? sessionStorage).setItem(CLAVE, '1');
  } catch {}

  root.addEventListener('click', (e) => {
    const q = (e.target as Element).closest('.quien');
    if (!q) return;
    q.classList.add('reacciona');
    setTimeout(() => q.classList.remove('reacciona'), 600);
  });

  const observe =
    opts.observe ??
    ((cb) => new IntersectionObserver((es) => cb(es[es.length - 1].isIntersecting)).observe(root));
  observe((visible) => root.classList.toggle('pausada', !visible));
}
