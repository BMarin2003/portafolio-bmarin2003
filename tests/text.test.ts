import { describe, expect, it } from 'vitest';
import { opening, peopleGroups, separator } from '../src/lib/text';

describe('separator', () => {
  it('une una lista con comas y "y" final', () => {
    expect(separator(0, 1)).toBe('');
    expect(separator(0, 2)).toBe(' y ');
    expect(separator(1, 2)).toBe('');
    expect(separator(0, 3)).toBe(', ');
    expect(separator(1, 3)).toBe(' y ');
  });
});

describe('peopleGroups', () => {
  const a = { name: 'A' };
  const b = { name: 'B' };
  const c = { name: 'C' };

  it('omite los grupos vacíos', () => {
    expect(peopleGroups({ companeros: [], supervisores: [b], gerentes: [] })).toEqual([
      { label: 'supervisor', people: [b] },
    ]);
  });

  it('conserva el orden compañeros, supervisores, gerentes', () => {
    const labels = peopleGroups({ companeros: [a], supervisores: [b], gerentes: [c] }).map((g) => g.label);
    expect(labels).toEqual(['compañero', 'supervisor', 'gerente']);
  });
});

describe('concordancia', () => {
  const a = { name: 'A' };
  const b = { name: 'B' };

  it('usa el singular cuando el grupo tiene una sola persona', () => {
    const labels = peopleGroups({ companeros: [a], supervisores: [a, b], gerentes: [b] }).map((g) => g.label);
    expect(labels).toEqual(['compañero', 'supervisores', 'gerente']);
  });

  it('abre en singular o plural según el primer grupo', () => {
    expect(opening(peopleGroups({ companeros: [], supervisores: [a], gerentes: [a, b] }))).toBe('Con mi estimado');
    expect(opening(peopleGroups({ companeros: [a, b], supervisores: [a], gerentes: [] }))).toBe('Con mis estimados');
  });
});
