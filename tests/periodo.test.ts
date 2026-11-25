import { describe, expect, it } from 'vitest';
import { cronologico, periodo } from '../src/lib/periodo';

describe('periodo', () => {
  it('rango en el mismo año', () => {
    expect(periodo('2026-02', '2026-04', 'es')).toBe('feb – abr 2026');
    expect(periodo('2026-02', '2026-04', 'en')).toBe('Feb – Apr 2026');
  });
  it('un solo mes', () => {
    expect(periodo('2026-03', '2026-03', 'es')).toBe('mar 2026');
  });
  it('en curso', () => {
    expect(periodo('2026-04', undefined, 'es')).toBe('abr 2026 – hoy');
    expect(periodo('2026-04', undefined, 'en')).toBe('Apr 2026 – present');
  });
  it('cruza de año', () => {
    expect(periodo('2025-11', '2026-02', 'es')).toBe('nov 2025 – feb 2026');
  });
});

describe('cronologico', () => {
  it('ordena por desde sin mutar', () => {
    const xs = [{ desde: '2026-08' }, { desde: '2026-02' }, { desde: '2026-04' }];
    expect(cronologico(xs).map((x) => x.desde)).toEqual(['2026-02', '2026-04', '2026-08']);
    expect(xs.map((x) => x.desde)).toEqual(['2026-08', '2026-02', '2026-04']);
  });
});
