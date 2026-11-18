// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyNowPlaying, startNowPlaying } from '../src/scripts/now-playing';

function speaker() {
  document.body.innerHTML = `<div data-speaker><div data-rotate><span>A</span><span hidden>B</span></div><span data-live hidden></span></div>`;
  return document.querySelector<HTMLElement>('[data-speaker]')!;
}

describe('applyNowPlaying', () => {
  it('suena: pausa la rotación y muestra la canción', () => {
    const s = speaker();
    applyNowPlaying(s, { playing: true, title: 'Bohemian', artist: 'Queen', url: 'https://x' });
    const list = s.querySelector<HTMLElement>('[data-rotate]')!;
    const live = s.querySelector<HTMLElement>('[data-live]')!;
    expect(list.hasAttribute('data-paused')).toBe(true);
    expect(list.hidden).toBe(true);
    expect(live.hidden).toBe(false);
    expect(live.textContent).toBe('Bohemian — Queen');
  });
  it('no suena: vuelve la rotación', () => {
    const s = speaker();
    applyNowPlaying(s, { playing: true, title: 'a', artist: 'b', url: 'u' });
    applyNowPlaying(s, { playing: false });
    const list = s.querySelector<HTMLElement>('[data-rotate]')!;
    expect(list.hasAttribute('data-paused')).toBe(false);
    expect(list.hidden).toBe(false);
    expect(s.querySelector<HTMLElement>('[data-live]')!.hidden).toBe(true);
  });
});

describe('startNowPlaying', () => {
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
  it('un fetch por ciclo para todos los parlantes; fallo = no suena', async () => {
    const a = speaker();
    const b = a.cloneNode(true) as HTMLElement;
    document.body.append(b);
    const f = vi.fn().mockResolvedValueOnce(Response.json({ playing: true, title: 'T', artist: 'A', url: 'u' }))
      .mockRejectedValueOnce(new Error('x'));
    vi.stubGlobal('fetch', f);
    vi.useFakeTimers();
    startNowPlaying([a, b], 30000);
    await vi.advanceTimersByTimeAsync(0);
    expect(f).toHaveBeenCalledTimes(1);
    expect(a.querySelector('[data-live]')!.textContent).toBe('T — A');
    expect(b.querySelector('[data-live]')!.textContent).toBe('T — A');
    await vi.advanceTimersByTimeAsync(30000);
    expect(f).toHaveBeenCalledTimes(2);
    expect(a.querySelector<HTMLElement>('[data-live]')!.hidden).toBe(true);
    expect(b.querySelector('[data-rotate]')!.hasAttribute('data-paused')).toBe(false);
  });
});
