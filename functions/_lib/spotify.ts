export type NowPlaying =
  | { playing: false }
  | { playing: true; title: string; artist: string; url: string };

export interface SpotifyEnv {
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_REFRESH_TOKEN?: string;
}

const OFF: NowPlaying = { playing: false };

export async function getNowPlaying(env: SpotifyEnv, fetchFn: typeof fetch = fetch): Promise<NowPlaying> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = env;
  if (!id || !secret || !refresh) return OFF;
  try {
    const tokenRes = await fetchFn('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${id}:${secret}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
    });
    if (!tokenRes.ok) return OFF;
    const { access_token } = (await tokenRes.json()) as { access_token?: string };
    if (!access_token) return OFF;

    const res = await fetchFn('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (res.status !== 200) return OFF;
    const data = (await res.json()) as {
      is_playing?: boolean;
      currently_playing_type?: string;
      item?: { name: string; artists: { name: string }[]; external_urls: { spotify: string } } | null;
    };
    if (!data.is_playing || data.currently_playing_type !== 'track' || !data.item) return OFF;
    return {
      playing: true,
      title: data.item.name,
      artist: data.item.artists.map((a) => a.name).join(', '),
      url: data.item.external_urls.spotify,
    };
  } catch {
    return OFF;
  }
}
