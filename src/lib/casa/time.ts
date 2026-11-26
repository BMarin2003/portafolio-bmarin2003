/** Hora local de Trujillo (UTC−5, sin horario de verano). */
export function trujilloHour(now: Date): { hour: number; minute: number } {
  const totalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes() - 5 * 60;
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  return { hour: Math.floor(wrapped / 60), minute: wrapped % 60 };
}

/** Hora en formato HH:MM de 24 horas. */
export function formatClock(h: { hour: number; minute: number }): string {
  return `${String(h.hour).padStart(2, '0')}:${String(h.minute).padStart(2, '0')}`;
}

/** Milisegundos hasta el próximo minuto exacto, para refrescar el reloj sin intervalos de 1 s. */
export function msUntilNextMinute(now: Date): number {
  return 60_000 - (now.getUTCSeconds() * 1000 + now.getUTCMilliseconds());
}
