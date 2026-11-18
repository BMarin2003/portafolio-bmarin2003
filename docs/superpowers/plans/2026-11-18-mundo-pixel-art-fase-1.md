# Mundo pixel art · Fase 1 (arte y bocetos): plan de construcción

> **Para agentes:** sub-skill requerido: superpowers:subagent-driven-development o superpowers:executing-plans, tarea por tarea. Los pasos usan casillas (`- [ ]`).

**Meta:** que el pixel art del sitio exista como código, con su flujo de generación y los 6 personajes. Después, bocetar con ellos las dos páginas para que Bryan las apruebe.

**Arquitectura:** cada sprite es un módulo TypeScript en `art/sprites/` con una paleta y grillas de texto. Un script de Node, sin dependencias, valida cada sprite y genera hojas PNG y su JSON de cuadros en `public/sprites/`. Esos archivos se generan en cada build y no se versionan.

**Stack:** Node 24 (corre `.ts` directo, quitando los tipos), `node:zlib` para el PNG, Vitest. Sin dependencias nuevas.

**Spec:** [`docs/superpowers/specs/2026-11-18-mundo-pixel-art-design.md`](../specs/2026-11-18-mundo-pixel-art-design.md), aprobado el 2026-11-18. Rigen también [`SPEC.md`](../../../SPEC.md) y [`architecture.md`](../../../architecture.md).

**Alcance:** el diseño tiene tres partes, y esta es la primera. La página profesional (fase 2) y la casa con PixiJS (fase 3) tienen su propio plan, que se escribe **después** de que Bryan apruebe los bocetos de la Task 5, porque su layout depende de ellos.

## Restricciones globales

- **Grilla base de 16 px.** Los personajes de la cuadrilla son de 16×16 y el de Bryan de 16×24. Siempre se escalan por enteros y con `image-rendering: pixelated`.
- **Arte 100 % original:** nada calcado ni recreado de juegos, packs ni pósters.
- **Flujo sin dependencias:** solo la librería estándar de Node 24. Los `.ts` que corre Node usan solo sintaxis que se puede borrar (sin `enum`, sin `namespace`, sin parámetros con propiedades) y `import type` para los tipos. Los imports relativos llevan la extensión `.ts` (si `tsconfig.json` se queja, se agrega `"allowImportingTsExtensions": true`).
- **Paleta base** (los sprites pueden sumar sombras y luces propias):
  - Fondo `#11151B` y contorno sobre fondo oscuro `#39414E`. Nunca un contorno casi negro: la prueba mostró que se pierde.
  - Ámbar `#D9A55B`.
  - Cuadrilla: hallmark `#C48A96`, ponytail `#D9A55B`, superpowers `#7C93B8`, cc-safety-net `#C27A5C`, Obsidian `#958AC0`.
- **Lo generado no se versiona:** `public/sprites/` y `art/preview/` van al `.gitignore`. Se generan en `build:draft`, en `build` y en CI.
- **No se toca** el contenido, Spotify ni el deploy. `npm test` y `npm run build` siguen en verde al final de cada tarea.

## Foco de revisión

1. **Una fila de largo incorrecto o un carácter fuera de la paleta:** la validación lo informa con sprite, animación, cuadro y fila, y el build falla. Lo cubre la Task 1.
2. **Un píxel transparente** (`.`) sale con alfa 0, no negro. Lo cubre la Task 1.
3. **Animaciones con distinta cantidad de cuadros en la misma hoja:** el ancho de la hoja es el de la animación más larga y las celdas sobrantes quedan transparentes. Lo cubre la Task 1.
4. **La vista previa escalada no se ve borrosa:** cada píxel ocupa exactamente un bloque de `escala × escala`. Lo cubre la Task 1.
5. **CI sin las hojas** porque están ignoradas: `build:draft` y `build` generan los sprites antes de `astro build`. Lo cubre la Task 2.

---

### Task 1: Formato de sprite, validación, PNG y hoja

**Archivos:**
- Crear: `art/lib/sprite.ts`, `art/lib/png.ts`, `art/lib/sheet.ts`
- Test: `tests/art.test.ts`

**Interfaces:**
- Produce, en `art/lib/sprite.ts`:
  - `type Palette = Record<string, string | null>`: carácter → `#RRGGBB`, o `null` si es transparente. `.` debe ser `null`.
  - `type SpriteDef = { name: string; width: number; height: number; palette: Palette; animations: Record<string, string[][]> }`: cada animación es una lista de cuadros, y cada cuadro una lista de filas.
  - `validateSprite(def: SpriteDef): string[]`: devuelve los errores, o `[]` si no hay.
- Produce, en `art/lib/png.ts`: `encodePng(width: number, height: number, rgba: Uint8Array): Uint8Array`, un PNG RGBA de 8 bits.
- Produce, en `art/lib/sheet.ts`:
  - `type SheetMeta = { frameWidth: number; frameHeight: number; animations: Record<string, { row: number; frames: number }> }`
  - `buildSheet(def: SpriteDef, scale = 1, background?: string): { width: number; height: number; rgba: Uint8Array; meta: SheetMeta }`
  - El layout es una fila por animación, en el orden de las claves, con los cuadros de izquierda a derecha. `background`, si se da, rellena los píxeles transparentes; solo lo usa la vista previa.

- [ ] **Paso 1:** escribir los tests que fallan en `tests/art.test.ts`, con un sprite de prueba de 2×2.
  - `validateSprite` informa `"t/idle/0/1: largo 3, se esperaba 2"` para una fila de 3, y `"t/idle/0/0: carácter 'z' fuera de la paleta"` para un carácter desconocido. Si hay 3 filas en vez de 2, informa `"t/idle/0: 3 filas, se esperaban 2"`. Un sprite válido devuelve `[]`.
  - `encodePng(1, 1, rgba)` empieza con la firma PNG `89 50 4E 47 0D 0A 1A 0A`, y el IHDR tiene ancho 1, alto 1, profundidad 8 y tipo de color 6.
  - `buildSheet` con `idle` de 2 cuadros y `walk` de 3 da un ancho de 3×2 y un alto de 2×2. La meta es `{ idle: { row: 0, frames: 2 }, walk: { row: 1, frames: 3 } }`. La celda de `idle` cuadro 2, que no existe, queda con alfa 0 en todos sus píxeles.
  - Con `.` → `null`, el píxel correspondiente da `[0,0,0,0]`. Con `'#ff0000'`, da `[255,0,0,255]`.
  - `buildSheet(def, 3)`: el píxel (0,0) del sprite cubre exactamente los píxeles de la hoja de (0,0) a (2,2), y el (3,0) ya es el siguiente píxel del sprite.
  - Con `background: '#11151B'`, los píxeles transparentes salen `[17,21,27,255]`.
- [ ] **Paso 2:** correr `npx vitest run tests/art.test.ts`. Se espera FAIL porque los módulos no existen.
- [ ] **Paso 3:** implementar los tres módulos.
  - El PNG sigue el formato estándar: filas con filtro 0, IDAT comprimido con `deflateSync` y CRC32 calculado con tabla.
- [ ] **Paso 4:** correr `npx vitest run tests/art.test.ts` y se espera PASS. Después `npm test`, todo en verde.
- [ ] **Paso 5:** commit `feat: formato de sprite como código, validación y hoja png`.

### Task 2: Script que genera los sprites, conectado al build

**Archivos:**
- Crear: `scripts/build-sprites.ts`, `art/sprites/.gitkeep`
- Modificar: `package.json` (scripts), `.gitignore`, `architecture.md`
- Test: `tests/build-sprites.test.ts`

**Interfaces:**
- Consume `validateSprite`, `buildSheet` y `encodePng` (Task 1).
- Produce `buildAll(opts: { srcDir: string; outDir: string; previewDir?: string }): Promise<{ built: string[]; errors: string[] }>`, exportada desde `scripts/build-sprites.ts`.
  - Importa cada `*.ts` de `srcDir`, cuyo `export default` es un `SpriteDef`.
  - Si **algún** sprite tiene errores, no escribe nada y los devuelve todos.
  - Si no, escribe `<name>.png` y `<name>.json` (la `SheetMeta`) en `outDir`. Si hay `previewDir`, también `<name>.png` a escala ×10 con fondo `#11151B`.
- Produce la CLI: `node scripts/build-sprites.ts [--preview]` usa `art/sprites` → `public/sprites` (y `art/preview` con `--preview`). Sale con código 1 e imprime los errores si los hay.

- [ ] **Paso 1:** escribir los tests que fallan en `tests/build-sprites.test.ts`, usando carpetas temporales de `fs.mkdtemp`.
  - Un sprite válido en `srcDir` produce `outDir/t.png` y `outDir/t.json`, y `built` es `['t']`.
  - Con un sprite válido y otro inválido, `errors` no está vacío y `outDir` sigue vacío.
  - Con `previewDir`, la vista previa de un sprite de 2×2 mide 20×20.
- [ ] **Paso 2:** correr `npx vitest run tests/build-sprites.test.ts`. Se espera FAIL.
- [ ] **Paso 3:** implementar `buildAll` y la CLI. La CLI solo corre si el archivo es el punto de entrada, igual que en `scripts/check-placeholders.mjs`.
- [ ] **Paso 4:** conectar al build.
  - En `package.json`:
    - `"sprites": "node scripts/build-sprites.ts"`
    - `"sprites:preview": "node scripts/build-sprites.ts --preview"`
    - `"build:draft": "npm run sprites && astro build"`
    - `"build": "npm run sprites && astro build && node scripts/check-placeholders.mjs dist"`
  - En `.gitignore`: `public/sprites/` y `art/preview/`.
  - En `architecture.md`, sección Decisiones: "**Pixel art como código.**" — por qué (original, versionado, revisable, sin licencias) y qué se descartó (packs de terceros, generadores de IA de pago). En Invariantes: "Los PNG de sprites se generan en el build; nunca se editan ni se versionan a mano."
- [ ] **Paso 5:** verificar.
  - `npm test` en verde.
  - `npm run build` en verde: con `art/sprites` vacío, el script no hace nada y sale con 0.
  - `node ~/.claude/skills/project-specs/scripts/validate-specs.mjs .` debe dar 0 errores.
- [ ] **Paso 6:** commit `feat: generación de sprites en el build`.

### Task 3: La cuadrilla (5 personajes)

**Archivos:**
- Crear: `art/sprites/hallmark.ts`, `ponytail.ts`, `superpowers.ts`, `safety-net.ts`, `obsidian.ts`
- Test: `tests/characters.test.ts`

**Interfaces:**
- Consume `SpriteDef` (Task 1) y `buildAll` (Task 2).
- Produce 5 sprites `name` = el nombre del archivo, de 16×16, con las animaciones `idle` (2 cuadros: abierto y parpadeo con los ojos como línea), `walk` (4 cuadros con rebote de 1 px y pies alternados) y `action` (de 2 a 4 cuadros). Las fases 2 y 3 dependen de estos nombres.

- [ ] **Paso 1:** escribir el test que falla en `tests/characters.test.ts`. Para cada uno de los 5 nombres:
  - `validateSprite` devuelve `[]`.
  - El tamaño es 16×16.
  - `idle` tiene 2 cuadros, `walk` 4 y `action` entre 2 y 4.
  - El color dominante (el más frecuente que no sea transparente ni de contorno) es el de la cuadrilla en las restricciones globales.
- [ ] **Paso 2:** correr `npx vitest run tests/characters.test.ts`. Se espera FAIL.
- [ ] **Paso 3:** dibujar los 5. Son bots redondeados como los del sitio actual, con contorno `#39414E` y un brillo arriba. La manía tiene que leerse en 16 px:

  | Personaje | Rasgo visible | `action` |
  |---|---|---|
  | hallmark | lápiz en la mano | trazo de lápiz |
  | ponytail | coleta (ojos entrecerrados, el senior flojo) | bostezo o borrar |
  | superpowers | portapapeles | marca un visto en el portapapeles |
  | cc-safety-net | casco ámbar | brazo en alto: «alto» |
  | Obsidian | libro | abre y cierra el libro |

- [ ] **Paso 4:** correr `npm run sprites:preview` y **mirar cada PNG** de `art/preview/`. Corregir lo que no se lea: contorno perdido, rasgo confuso o salto entre cuadros. Repetir hasta que se lea bien.
- [ ] **Paso 5:** correr `npx vitest run tests/characters.test.ts` (PASS) y `npm test` (todo en verde).
- [ ] **Paso 6:** commit `feat: sprites de la cuadrilla`.

### Task 4: Bryan

**Archivos:**
- Crear: `art/sprites/bryan.ts`
- Modificar: `tests/characters.test.ts`

**Interfaces:**
- Produce un sprite `bryan` de 16×24 (persona, no bot) con `idle` (2), `walk` (4), `sit` (1: sentado frente a una mesa o la PC) y `roll` (de 2 a 4: tira un dado).

- [ ] **Paso 1:** agregar a `tests/characters.test.ts` el caso `bryan`: valida, mide 16×24 y tiene `idle` 2, `walk` 4, `sit` 1 y `roll` de 2 a 4. Correrlo: FAIL.
- [ ] **Paso 2:** dibujarlo. Pelo oscuro y una polera con el acento ámbar, para que se vea de la familia de la cuadrilla. Los rasgos se ajustan cuando Bryan revise la vista previa.
- [ ] **Paso 3:** correr `npm run sprites:preview`, mirar `art/preview/bryan.png` y corregir hasta que se lea bien.
- [ ] **Paso 4:** correr `npm test` y `npm run build`, todo en verde.
- [ ] **Paso 5:** commit `feat: sprite de bryan`.

### Task 5: Bocetos para aprobar (lo hace el controlador, no un subagente)

**Archivos:** ninguno del repo. Se usan los PNG de `art/preview/` y `public/sprites/`.

- [ ] **Paso 1:** mostrarle a Bryan las 6 vistas previas y anotar sus cambios. Si pide cambios, se corrigen en el `.ts` del personaje y se vuelve a generar. Es parte de esta tarea.
- [ ] **Paso 2:** bocetar `/` en el lienzo de diseño (artifact) con los sprites reales:
  - Portada con el nombre y la escena chica de la cuadrilla.
  - Proyectos, cada uno con su personaje al lado.
  - "La cuadrilla" y la puerta a `/casa`.
  - Dirección: Kiri, oscuro y con aire de producto. Que no parezca un wireframe.
- [ ] **Paso 3:** bocetar `/casa` en el mismo lienzo:
  - Corte de la casa con las habitaciones: cuarto con PC, TV, parlante y mesa de rol, y las extra propuestas.
  - Dónde está cada personita, una variante de día y otra de noche, y el panel de un objeto abierto.
- [ ] **Paso 4:** Bryan aprueba o pide ajustes. Con la aprobación se escriben los planes de las fases 2 y 3.
