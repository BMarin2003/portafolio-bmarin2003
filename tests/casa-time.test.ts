import { describe, expect, it } from 'vitest';
import { esDeNoche, faseAt, formatClock, msUntilNextMinute, trujilloHour } from '../src/lib/casa/time';

describe('trujilloHour', () => {
  it('da la hora de Trujillo (UTC−5) desde UTC', () => {
    expect(trujilloHour(new Date('2026-11-23T02:30:00Z'))).toEqual({ hour: 21, minute: 30 });
  });

  it('suma el adelanto y da la vuelta al día', () => {
    expect(trujilloHour(new Date('2026-11-23T02:30:00Z'), 10)).toEqual({ hour: 7, minute: 30 });
  });
});

describe('faseAt', () => {
  it('noche de 19:00 a 05:59', () => {
    expect(faseAt(19)).toBe('noche');
    expect(faseAt(3)).toBe('noche');
    expect(faseAt(5)).toBe('noche');
  });

  it('amanecer de 06:00 a 07:59', () => {
    expect(faseAt(6)).toBe('amanecer');
    expect(faseAt(7)).toBe('amanecer');
  });

  it('día de 08:00 a 17:59', () => {
    expect(faseAt(8)).toBe('dia');
    expect(faseAt(17)).toBe('dia');
  });

  it('tarde de 18:00 a 18:59', () => {
    expect(faseAt(18)).toBe('tarde');
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

describe('esDeNoche', () => {
  it('la tarde va con la noche y el amanecer con el día', () => {
    expect(esDeNoche('noche')).toBe(true);
    expect(esDeNoche('tarde')).toBe(true);
    expect(esDeNoche('dia')).toBe(false);
    expect(esDeNoche('amanecer')).toBe(false);
  });
});
