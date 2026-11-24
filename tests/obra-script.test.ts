// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initObra } from '../src/scripts/obra';

function montar() {
  document.body.innerHTML = '<div data-obra><button class="quien"><span>x</span></button></div>';
  return document.querySelector<HTMLElement>('[data-obra]')!;
}
const memoria = () => {
  const d = new Map<string, string>();
  return { getItem: (k: string) => d.get(k) ?? null, setItem: (k: string, v: string) => void d.set(k, v) };
};

describe('el script de la obra', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('marca la obra como vista', () => {
    const storage = memoria();
    initObra(montar(), { storage, observe: () => {} });
    expect(storage.getItem('obra-armada')).toBe('1');
  });

  it('sin almacenamiento no se rompe', () => {
    const storage = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
    expect(() => initObra(montar(), { storage, observe: () => {} })).not.toThrow();
  });

  it('el clic hace reaccionar al monigote', () => {
    const root = montar();
    initObra(root, { storage: memoria(), observe: () => {} });
    const q = root.querySelector('.quien')!;
    q.querySelector('span')!.click();
    expect(q.classList.contains('reacciona')).toBe(true);
    vi.advanceTimersByTime(700);
    expect(q.classList.contains('reacciona')).toBe(false);
  });

  it('pausa fuera de pantalla', () => {
    const root = montar();
    let cb!: (v: boolean) => void;
    initObra(root, { storage: memoria(), observe: (f) => { cb = f; } });
    cb(false);
    expect(root.classList.contains('pausada')).toBe(true);
    cb(true);
    expect(root.classList.contains('pausada')).toBe(false);
  });
});
