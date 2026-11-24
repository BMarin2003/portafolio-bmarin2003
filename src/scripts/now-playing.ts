import type { NowPlaying } from '../../functions/_lib/spotify';

export function applyNowPlaying(speaker: HTMLElement, data: NowPlaying): void {
  const list = speaker.querySelector<HTMLElement>('[data-rotate]');
  const live = speaker.querySelector<HTMLElement>('[data-live]');
  if (!list || !live) return;
  if (data.playing) {
    list.setAttribute('data-paused', '');
    list.hidden = true;
    live.textContent = `${data.title} — ${data.artist}`;
    live.hidden = false;
  } else {
    list.removeAttribute('data-paused');
    list.hidden = false;
    live.hidden = true;
  }
}

export function startNowPlaying(speakers: HTMLElement[], intervalMs = 30000): void {
  const tick = async () => {
    if (document.hidden) return;
    let data: NowPlaying = { playing: false };
    try {
      const res = await fetch('/api/now-playing');
      if (res.ok) data = (await res.json()) as NowPlaying;
    } catch {
      // sin red: cuenta como que no suena
    }
    speakers.forEach((s) => applyNowPlaying(s, data));
  };
  void tick();
  setInterval(tick, intervalMs);
  // Si la página cargó en segundo plano, el primer tick se saltó: al volver se consulta sin esperar el ciclo.
  document.addEventListener('visibilitychange', () => void tick());
}
