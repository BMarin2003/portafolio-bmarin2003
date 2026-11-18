import type { PagesFunction } from '@cloudflare/workers-types';
import { getNowPlaying, type SpotifyEnv } from '../_lib/spotify';

// Caché de borde: todos los visitantes de una región comparten una consulta a Spotify cada 30 s.
export const onRequestGet: PagesFunction<SpotifyEnv> = async ({ request, env, waitUntil }) => {
  const cache = caches.default;
  const hit = await cache.match(request).catch(() => undefined);
  if (hit) return hit;
  const res = Response.json(await getNowPlaying(env), { headers: { 'cache-control': 'public, max-age=30' } });
  // Guardar nunca debe romper la respuesta.
  waitUntil(Promise.resolve(cache.put(request, res.clone())).catch(() => {}));
  return res;
};
