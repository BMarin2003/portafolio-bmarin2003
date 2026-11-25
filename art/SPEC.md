---
id: module-art
type: module-design
status: draft
title: Arte pixel art como código
parent: architecture
---

## Responsabilidad

Define el formato de sprite, lo valida y lo convierte en hojas PNG con su metadato. No dibuja nada en pantalla: las fases 2 (sprites CSS con `steps()`) y 3 (PixiJS) consumen lo que este módulo produce.

## Frontera

- **Posee:** el formato `SpriteDef`, su validación, el layout de la hoja y las hojas generadas.
- **Puede depender de:** solo la librería estándar de Node.
- **Prohibido:** depender de `src/` o de Astro, porque corre antes del build y también en los tests.
- **Superficie pública:** las URLs `/sprites/<name>.png` y `/sprites/<name>.json`, el tipo `SheetMeta` y los nombres de animación garantizados. El resto es interno.

## Contrato para los consumidores

- **`SpriteDef`:** `name`, `width`, `height` (enteros positivos), `palette` y `animations`. Cada cuadro es una lista de filas de texto; cada carácter es una clave de la paleta. `.` es siempre transparente (`null`); los demás colores son `#RRGGBB`.
- **Hoja:** una fila por animación, en el orden de las claves; los cuadros van de izquierda a derecha, sin relleno entre ellos. `SheetMeta` da `frameWidth`, `frameHeight` y, por animación, `row` y `frames`. Los consumidores usan `row`, no índices fijos.
- **URLs:** `name` es igual al nombre del archivo (sin `.ts`); el build lo exige, así que dos sprites no se pisan.
- **Animaciones garantizadas:**
  - Cuadrilla (`capataz`, `maestro`, `decorador`, `electricista`, `doble`, `archivista`): `idle` (2), `walk` (4), `action` (2 a 4).
  - `bryan`: `idle` (2), `walk` (4), `sit` (1), `roll` (2 a 4).
- **Sin tiempos ni bucle:** la hoja no dice cuánto dura cada cuadro ni qué animaciones se repiten. Lo decide cada consumidor.

## Decisiones

- **Arte como código, no PNG a mano.** El diff muestra el dibujo y no hay binarios que revisar. Ver `architecture`.
- **Los PNG se generan en el build.** `build`, `build:draft` y `dev` corren `npm run sprites` primero.
- **Cada monigote es un área de trabajo, sin nombre propio ni de herramienta.** Ni publicidad ni un stack fijo en los nombres ni en las URLs. Comparten la silueta de bloque y los ojos; cada oficio se reconoce por su color, su indumentaria y su acción.
- **El build es todo o nada.** Si un sprite es inválido no se escribe ninguna hoja y el comando sale con error.

## Invariantes

- `art/sprites/` contiene solo sprites; los helpers viven en `art/lib/`. Cada archivo de ahí se trata como sprite, así que un helper rompería el build.
- Los PNG de `public/sprites/` nunca se editan ni se versionan.
- Todo sprite tiene al menos una animación, y toda animación al menos un cuadro (`steps(0)` es inválido en CSS).
