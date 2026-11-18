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
  afterEach(() => vi.useRealTimers());

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
});
