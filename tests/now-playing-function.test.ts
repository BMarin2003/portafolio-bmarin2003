import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestGet } from '../functions/api/now-playing';

function run(cache: { match: any; put: any }, waitUntil = vi.fn()) {
  vi.stubGlobal('caches', { default: cache });
  const request = new Request('https://x.test/api/now-playing');
  return { waitUntil, res: (onRequestGet as any)({ request, env: {}, waitUntil }) as Promise<Response> };
}

describe('GET /api/now-playing', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('acierto de caché: devuelve lo guardado sin reconstruir', async () => {
    const hit = Response.json({ playing: false });
    const put = vi.fn();
    const { res, waitUntil } = run({ match: vi.fn().mockResolvedValue(hit), put });
    expect(await res).toBe(hit);
    expect(put).not.toHaveBeenCalled();
    expect(waitUntil).not.toHaveBeenCalled();
  });

  it('fallo de caché: responde, guarda con waitUntil y mantiene cache-control', async () => {
    const put = vi.fn().mockResolvedValue(undefined);
    const { res, waitUntil } = run({ match: vi.fn().mockResolvedValue(undefined), put });
    const r = await res;
    expect(await r.json()).toEqual({ playing: false });
    expect(r.headers.get('cache-control')).toBe('public, max-age=30');
    expect(waitUntil).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenCalledTimes(1);
  });

  it('si cache.put falla, la respuesta no se rompe', async () => {
    const put = vi.fn().mockRejectedValue(new Error('boom'));
    const waitUntil = vi.fn((p: Promise<unknown>) => p);
    const { res } = run({ match: vi.fn().mockResolvedValue(undefined), put }, waitUntil);
    const r = await res;
    expect(r.status).toBe(200);
    await expect(waitUntil.mock.calls[0][0]).resolves.toBeUndefined();
  });
});
