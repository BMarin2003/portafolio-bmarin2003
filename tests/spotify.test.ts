import { describe, expect, it, vi } from 'vitest';
import { getNowPlaying } from '../functions/_lib/spotify';

const env = { SPOTIFY_CLIENT_ID: 'id', SPOTIFY_CLIENT_SECRET: 'secret', SPOTIFY_REFRESH_TOKEN: 'REFRESH-XYZ' };
const tokenOk = () => Response.json({ access_token: 'ACCESS-ABC' });
const track = {
  is_playing: true,
  currently_playing_type: 'track',
  item: { name: 'Bohemian', artists: [{ name: 'Queen' }, { name: 'Otro' }], external_urls: { spotify: 'https://open.spotify.com/track/1' } },
};
const mock = (second: () => Response | Promise<Response>) =>
  vi.fn().mockResolvedValueOnce(tokenOk()).mockImplementationOnce(async () => second()) as unknown as typeof fetch;

describe('getNowPlaying', () => {
  it('204 -> no suena', async () => {
    expect(await getNowPlaying(env, mock(() => new Response(null, { status: 204 })))).toEqual({ playing: false });
  });
  it('track sonando', async () => {
    const f = mock(() => Response.json(track));
    expect(await getNowPlaying(env, f)).toEqual({
      playing: true, title: 'Bohemian', artist: 'Queen, Otro', url: 'https://open.spotify.com/track/1',
    });
    const calls = (f as any).mock.calls;
    expect(calls[0][0]).toBe('https://accounts.spotify.com/api/token');
    expect(calls[0][1].headers.Authorization).toBe('Basic ' + btoa('id:secret'));
    expect(calls[1][0]).toBe('https://api.spotify.com/v1/me/player/currently-playing');
  });
  it.each([
    ['la más chica de al menos 64 px', [{ url: 'a', width: 640 }, { url: 'b', width: 300 }, { url: 'c', width: 64 }], 'c'],
    ['salta las menores a 64', [{ url: 'b', width: 300 }, { url: 'd', width: 40 }], 'b'],
    ['width null no cuenta', [{ url: 'n', width: null }, { url: 'b', width: 300 }], 'b'],
    ['sin imágenes', [], undefined],
  ])('cover: %s', async (_n, images, cover) => {
    const body = { ...track, item: { ...track.item, album: { images } } };
    const r = await getNowPlaying(env, mock(() => Response.json(body)));
    expect(r).toMatchObject({ playing: true });
    expect((r as any).cover).toBe(cover);
  });
  it('cover: sin album es undefined', async () => {
    const r = await getNowPlaying(env, mock(() => Response.json(track)));
    expect((r as any).cover).toBeUndefined();
  });
  it.each([
    ['episode', { ...track, currently_playing_type: 'episode' }],
    ['ad', { ...track, currently_playing_type: 'ad' }],
    ['item null', { ...track, item: null }],
    ['pausado', { ...track, is_playing: false }],
  ])('%s -> no suena', async (_n, body) => {
    expect(await getNowPlaying(env, mock(() => Response.json(body)))).toEqual({ playing: false });
  });
  it('401 en el token', async () => {
    const f = vi.fn().mockResolvedValue(new Response('no', { status: 401 })) as unknown as typeof fetch;
    expect(await getNowPlaying(env, f)).toEqual({ playing: false });
  });
  it('429 en currently-playing', async () => {
    expect(await getNowPlaying(env, mock(() => new Response('', { status: 429 })))).toEqual({ playing: false });
  });
  it('fetch que lanza', async () => {
    const f = vi.fn().mockRejectedValue(new Error('red')) as unknown as typeof fetch;
    expect(await getNowPlaying(env, f)).toEqual({ playing: false });
  });
  it.each(['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN'])('falta %s', async (k) => {
    const f = vi.fn() as unknown as typeof fetch;
    expect(await getNowPlaying({ ...env, [k]: undefined }, f)).toEqual({ playing: false });
    expect(f).not.toHaveBeenCalled();
  });
  it('nunca filtra tokens', async () => {
    const out = JSON.stringify(await getNowPlaying(env, mock(() => Response.json(track))));
    expect(out).not.toContain('REFRESH-XYZ');
    expect(out).not.toContain('ACCESS-ABC');
  });
});
