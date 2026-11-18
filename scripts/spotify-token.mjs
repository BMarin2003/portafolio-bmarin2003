// Uso (lo corre Bryan, con sus credenciales en el entorno):
//   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-token.mjs
// PowerShell:
//   $env:SPOTIFY_CLIENT_ID='...'; $env:SPOTIFY_CLIENT_SECRET='...'; node scripts/spotify-token.mjs
// Imprime el refresh token en consola; no escribe nada a disco.
import http from 'node:http';

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error('Faltan SPOTIFY_CLIENT_ID y/o SPOTIFY_CLIENT_SECRET en el entorno.');
  process.exit(1);
}
const redirect = 'http://127.0.0.1:8888/callback';
const auth = new URL('https://accounts.spotify.com/authorize');
auth.search = new URLSearchParams({
  client_id: id,
  response_type: 'code',
  redirect_uri: redirect,
  scope: 'user-read-currently-playing',
}).toString();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:8888');
  if (url.pathname !== '/callback') return res.writeHead(404).end();
  const code = url.searchParams.get('code');
  if (!code) return res.writeHead(400).end('Sin código');
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirect }),
  });
  const body = await r.json();
  res.end(body.refresh_token ? 'Listo, vuelve a la terminal.' : 'Error, mira la terminal.');
  console.log(body.refresh_token ? `SPOTIFY_REFRESH_TOKEN=${body.refresh_token}` : body);
  server.close();
});
server.listen(8888, '127.0.0.1', () => console.log('Abre esta URL:\n' + auth));
