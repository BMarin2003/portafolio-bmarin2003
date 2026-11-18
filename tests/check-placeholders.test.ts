import { describe, expect, it } from 'vitest';
import { findPlaceholders } from '../scripts/check-placeholders.mjs';

describe('findPlaceholders', () => {
  it('encuentra los corchetes pendientes', () => {
    expect(findPlaceholders('<p>[Qué hice] · Con [nombres]</p>')).toEqual(['[Qué hice]', '[nombres]']);
  });
  it('no marca HTML normal', () => {
    expect(findPlaceholders('<a href="x">Andor</a>')).toEqual([]);
  });
  it('ve corchetes en valores de atributos', () => {
    expect(findPlaceholders('<a href="[linkedin]">linkedin</a>')).toEqual(['[linkedin]']);
  });
  it('ignora script y style', () => {
    expect(findPlaceholders('<script>a[0]</script>')).toEqual([]);
    expect(findPlaceholders('<style>a[href]{}</style>')).toEqual([]);
  });
});
