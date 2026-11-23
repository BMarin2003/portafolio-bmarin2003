/** Fase del día en Trujillo: noche 19–05, amanecer 06–07, día 08–17, tarde 18. */
export type Fase = 'noche' | 'amanecer' | 'dia' | 'tarde';

/** Hora local de Trujillo (UTC−5, sin horario de verano) más un adelanto opcional en horas. */
export function trujilloHour(now: Date, offsetHours = 0): { hour: number; minute: number } {
  const totalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes() - 5 * 60 + offsetHours * 60;
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  return { hour: Math.floor(wrapped / 60), minute: wrapped % 60 };
}

/** Fase del día que corresponde a una hora entera de 0 a 23. */
export function faseAt(hour: number): Fase {
  if (hour === 18) return 'tarde';
  if (hour >= 8 && hour <= 17) return 'dia';
  if (hour >= 6 && hour <= 7) return 'amanecer';
  return 'noche';
}

/** Hora en formato HH:MM de 24 horas. */
export function formatClock(h: { hour: number; minute: number }): string {
  return `${String(h.hour).padStart(2, '0')}:${String(h.minute).padStart(2, '0')}`;
}

/** Milisegundos hasta el próximo minuto exacto, para refrescar el reloj sin intervalos de 1 s. */
export function msUntilNextMinute(now: Date): number {
  return 60_000 - (now.getUTCSeconds() * 1000 + now.getUTCMilliseconds());
}
