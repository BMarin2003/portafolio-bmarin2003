// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initCasaUI } from '../src/scripts/casa/ui';
import type { Fase } from '../src/lib/casa/time';

const ids = ['pc', 'tv', 'parlante', 'mesa', 'estante'];
const now = () => new Date('2026-11-23T02:30:00Z'); // 21:30 en Trujillo

function mount(): HTMLElement {
  document.body.innerHTML = `
  <main data-casa>
    <span data-reloj></span>
    <button data-adelantar aria-pressed="false">adelantar reloj</button>
    <h1 data-titulo></h1><p data-subtitulo></p>
    <nav>${ids.map((i) => `<button data-objeto="${i}" aria-pressed="false">${i}</button>`).join('')}</nav>
    <aside aria-live="polite">${ids.map((i) => `<section data-panel="${i}"><h2 tabindex="-1">${i}</h2></section>`).join('')}</aside>
  </main>`;
  return document.querySelector('[data-casa]') as HTMLElement;
}
const visible = () => [...document.querySelectorAll<HTMLElement>('[data-panel]')].filter((s) => !s.hidden).map((s) => s.dataset.panel);

let ui: ReturnType<typeof initCasaUI>;
let root: HTMLElement;
beforeEach(() => {
  root = mount();
  ui = initCasaUI(root, { now });
});
afterEach(() => ui.destroy());

describe('initCasaUI', () => {
  it('pone fase y reloj reales', () => {
    expect(root.dataset.fase).toBe('noche');
    expect(root.querySelector('[data-reloj]')!.textContent).toContain('21:30');
    expect(ui.getFase()).toBe('noche');
  });
  it('por defecto muestra el parlante', () => {
    expect(visible()).toEqual(['parlante']);
  });
  it('setOffset(10) adelanta a amanecer 07:30', () => {
    ui.setOffset(10);
    expect(root.dataset.fase).toBe('amanecer');
    expect(root.querySelector('[data-reloj]')!.textContent).toContain('07:30');
    expect(ui.getFase()).toBe('amanecer');
    expect(root.querySelector('h1')!.textContent).toBe('La casa, de día');
  });
  it('el botón alterna entre hora real y +10 h', () => {
    const b = root.querySelector<HTMLButtonElement>('[data-adelantar]')!;
    b.click();
    expect(b.getAttribute('aria-pressed')).toBe('true');
    expect(root.dataset.fase).toBe('amanecer');
    b.click();
    expect(b.getAttribute('aria-pressed')).toBe('false');
    expect(root.dataset.fase).toBe('noche');
  });
  it('open muestra solo esa sección, marca el botón y enfoca el h2', () => {
    ui.open('tv');
    expect(visible()).toEqual(['tv']);
    expect(root.querySelector('[data-objeto="tv"]')!.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('[data-objeto="parlante"]')!.getAttribute('aria-pressed')).toBe('false');
    expect(document.activeElement).toBe(document.querySelector('[data-panel="tv"] h2'));
  });
  it('Escape devuelve el foco al botón del objeto abierto', () => {
    ui.open('tv');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.activeElement).toBe(root.querySelector('[data-objeto="tv"]'));
  });
  it('onFase avisa el cambio al adelantar', () => {
    const got: Fase[] = [];
    ui.onFase((f) => got.push(f));
    ui.setOffset(10);
    ui.setOffset(0);
    expect(got).toEqual(['amanecer', 'noche']);
  });
});

describe('reloj real', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
  const arrancar = (reducido = false) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-23T22:59:30Z')); // 17:59:30 en Trujillo
    if (reducido) vi.stubGlobal('matchMedia', () => ({ matches: true }));
    ui.destroy();
    root = mount();
    ui = initCasaUI(root, { now: () => new Date() });
  };

  it('avisa una sola vez al cruzar 18:00', () => {
    arrancar();
    const got: Fase[] = [];
    ui.onFase((f) => got.push(f));
    expect(ui.getFase()).toBe('dia');
    vi.advanceTimersByTime(31_000);
    expect(got).toEqual(['tarde']);
    vi.advanceTimersByTime(30_000);
    expect(got).toEqual(['tarde']);
  });
  it('destroy limpia el timer', () => {
    arrancar();
    const got: Fase[] = [];
    ui.onFase((f) => got.push(f));
    ui.destroy();
    vi.advanceTimersByTime(120_000);
    expect(got).toEqual([]);
  });
  it('con movimiento reducido no programa timer', () => {
    arrancar(true);
    expect(vi.getTimerCount()).toBe(0);
  });
});
