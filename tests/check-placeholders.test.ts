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
  it('detecta corchetes largos de una línea', () => {
    expect(findPlaceholders('<p>[' + 'x'.repeat(150) + ']</p>')).toHaveLength(1);
  });
  it('detecta un placeholder de párrafo de ~106 caracteres', () => {
    const parrafo = '[Tu párrafo: cómo trabajas con un cliente, desde el primer mensaje hasta la entrega, en pocas líneas]';
    expect(parrafo.length).toBeGreaterThan(60);
    expect(findPlaceholders('<p>' + parrafo + '</p>')).toEqual([parrafo]);
  });
  it('un corchete suelto entre etiquetas no se reporta como placeholder', () => {
    expect(findPlaceholders('<p>a [ b</p><p>c ] d</p>')).toEqual([]);
  });
});
