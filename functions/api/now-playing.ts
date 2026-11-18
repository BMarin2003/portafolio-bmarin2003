import type { PagesFunction } from '@cloudflare/workers-types';
import { getNowPlaying, type SpotifyEnv } from '../_lib/spotify';

// Caché de borde: todos los visitantes de una región comparten una consulta a Spotify cada 30 s.
// La clave es la ruta sin query string, para que `?x=algo` no salte la caché.
// La caché es una optimización: si falta o falla, se responde igual.
export const onRequestGet: PagesFunction<SpotifyEnv> = async ({ request, env, waitUntil }) => {
  const url = new URL(request.url);
  const key = url.origin + url.pathname;
  let cache: Cache | undefined;
  try {
    cache = caches.default;
    const hit = await cache.match(key);
    if (hit) return hit;
  } catch {
    cache = undefined;
  }
  const res = Response.json(await getNowPlaying(env), { headers: { 'cache-control': 'public, max-age=30' } });
  if (cache) {
    try {
      waitUntil(Promise.resolve(cache.put(key, res.clone())).catch(() => {}));
    } catch {
      // Guardar nunca debe romper la respuesta.
    }
  }
  return res;
};
