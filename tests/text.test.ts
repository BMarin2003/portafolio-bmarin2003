import { describe, expect, it } from 'vitest';
import { peopleGroups, separator } from '../src/lib/text';

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
      { label: 'supervisores', people: [b] },
    ]);
  });

  it('conserva el orden compañeros, supervisores, gerentes', () => {
    const labels = peopleGroups({ companeros: [a], supervisores: [b], gerentes: [c] }).map((g) => g.label);
    expect(labels).toEqual(['compañeros', 'supervisores', 'gerentes']);
  });
});
