// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { startRotation } from '../src/scripts/rotate';

const visible = (list: Element) =>
  [...list.children].findIndex((c) => !c.hasAttribute('hidden'));

function setup() {
  document.body.innerHTML = `<div data-rotate id="l"><i></i><i hidden></i><i hidden></i></div>`;
  return document.getElementById('l')!;
}

describe('startRotation', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('rota y vuelve al primero', () => {
    const l = setup();
    startRotation(document, { intervalMs: 3200, reducedMotion: false });
    vi.advanceTimersByTime(3200);
    expect(visible(l)).toBe(1);
    vi.advanceTimersByTime(6400);
    expect(visible(l)).toBe(0);
  });

  it('con reducedMotion no rota', () => {
    const l = setup();
    startRotation(document, { intervalMs: 3200, reducedMotion: true });
    vi.advanceTimersByTime(10000);
    expect(visible(l)).toBe(0);
  });

  it('salta data-paused, incluso si se pausa en runtime', () => {
    const l = setup();
    startRotation(document, { intervalMs: 3200, reducedMotion: false });
    l.setAttribute('data-paused', '');
    vi.advanceTimersByTime(6400);
    expect(visible(l)).toBe(0);
    l.removeAttribute('data-paused');
    vi.advanceTimersByTime(3200);
    expect(visible(l)).toBe(1);
  });

  it('la función de parada detiene la rotación', () => {
    const l = setup();
    const stop = startRotation(document, { intervalMs: 3200, reducedMotion: false });
    stop();
    vi.advanceTimersByTime(10000);
    expect(visible(l)).toBe(0);
  });

  it('pausa solo la lista con foco; la hermana sigue rotando', () => {
    document.body.innerHTML = `
      <div data-rotate id="a"><a href="#x">uno</a><i hidden></i></div>
      <div data-rotate id="b"><i></i><i hidden></i></div>`;
    const a = document.getElementById('a')!;
    const b = document.getElementById('b')!;
    // happy-dom no implementa :focus-within; se simula con contains(activeElement).
    const orig = Element.prototype.matches;
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, sel: string) {
      return sel.includes(':focus-within') ? this.contains(document.activeElement) : orig.call(this, sel);
    });
    startRotation(document, { intervalMs: 3200, reducedMotion: false });
    (a.firstElementChild as HTMLElement).focus();
    vi.advanceTimersByTime(3200);
    expect(visible(a)).toBe(0);
    expect(visible(b)).toBe(1);
  });
  it('pausa las listas dentro de una .card con foco; una lista de otra .card sigue rotando', () => {
    document.body.innerHTML = `
      <a href="#t" class="card" id="f"><span data-rotate id="a"><i></i><i hidden></i></span></a>
      <div class="card"><div data-rotate id="c"><i></i><i hidden></i></div></div>`;
    const orig = Element.prototype.matches;
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, sel: string) {
      return sel.includes(':focus-within') ? this.contains(document.activeElement) : orig.call(this, sel);
    });
    startRotation(document, { intervalMs: 3200, reducedMotion: false });
    (document.getElementById('f') as HTMLElement).focus();
    vi.advanceTimersByTime(3200);
    expect(visible(document.getElementById('a')!)).toBe(0);
    expect(visible(document.getElementById('c')!)).toBe(1);
  });
});
