import type { PagesFunction } from '@cloudflare/workers-types';
import { getNowPlaying, type SpotifyEnv } from '../_lib/spotify';

export const onRequestGet: PagesFunction<SpotifyEnv> = async ({ env }) =>
  Response.json(await getNowPlaying(env), { headers: { 'cache-control': 'public, max-age=30' } });
