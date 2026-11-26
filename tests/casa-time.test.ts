// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatClock, msUntilNextMinute, trujilloHour } from '../src/lib/casa/time';
import { initReloj } from '../src/scripts/casa/reloj';

describe('trujilloHour', () => {
  it('da la hora de Trujillo (UTC−5) desde UTC', () => {
    expect(trujilloHour(new Date('2026-11-23T02:30:00Z'))).toEqual({ hour: 21, minute: 30 });
  });

  it('da la vuelta al día', () => {
    expect(trujilloHour(new Date('2026-11-23T03:30:00Z'))).toEqual({ hour: 22, minute: 30 });
    expect(trujilloHour(new Date('2026-11-23T04:59:00Z'))).toEqual({ hour: 23, minute: 59 });
    expect(trujilloHour(new Date('2026-11-23T05:00:00Z'))).toEqual({ hour: 0, minute: 0 });
  });
});

describe('formatClock', () => {
  it('formatea HH:MM en 24 h', () => {
    expect(formatClock({ hour: 7, minute: 5 })).toBe('07:05');
  });
});

describe('msUntilNextMinute', () => {
  it('cuenta hasta el próximo minuto exacto', () => {
    expect(msUntilNextMinute(new Date('2026-11-23T02:30:15.500Z'))).toBe(44500);
  });
});

describe('initReloj', () => {
  const now = () => new Date('2026-11-23T02:30:00Z'); // 21:30 en Trujillo
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('pinta la hora de Trujillo', () => {
    const el = document.createElement('span');
    initReloj(el, { now });
    expect(el.textContent).toBe('TRUJILLO · 21:30');
  });

  it('con movimiento reducido pinta una vez y no programa timers', () => {
    const el = document.createElement('span');
    initReloj(el, { now, reducido: true });
    expect(el.textContent).toBe('TRUJILLO · 21:30');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('se refresca cada minuto', () => {
    let ms = Date.parse('2026-11-23T02:30:15Z');
    const el = document.createElement('span');
    initReloj(el, { now: () => new Date(ms) });
    ms += 45_000;
    vi.advanceTimersByTime(45_000);
    expect(el.textContent).toBe('TRUJILLO · 21:31');
  });

  it('la función que devuelve limpia el timer', () => {
    const el = document.createElement('span');
    const stop = initReloj(el, { now });
    expect(vi.getTimerCount()).toBe(1);
    stop();
    expect(vi.getTimerCount()).toBe(0);
  });
});
