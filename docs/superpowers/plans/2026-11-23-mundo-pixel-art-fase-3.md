# Mundo pixel art · Fase 3 (la casa habitada): plan de construcción

> **Para agentes:** sub-skill requerido: superpowers:subagent-driven-development o superpowers:executing-plans, tarea por tarea. Los pasos usan casillas (`- [ ]`).

**Meta:** que `/casa` sea la casa en corte del boceto aprobado, viva. Las personitas pixel art se mueven solas, la luz cambia con la hora real de Trujillo y cada objeto abre su información. Todo sigue accesible con teclado, sin JavaScript y para quien pide menos movimiento.

**Arquitectura:** tres capas, de abajo hacia arriba:
1. **Lógica pura en `src/lib/casa/`** (hora → fase, escena, rutas). Tiene tests unitarios.
2. **Página DOM accesible y completa por sí sola** (`src/pages/casa.astro` + `src/components/casa/*`): reloj, lista de objetos, panel de información y parlante de Spotify. Es lo que ven sin JS o con menos movimiento.
3. **Escena PixiJS** (`src/scripts/casa/scene.ts`): se carga con `import()` dinámico solo en `/casa`, solo con JS y solo sin `prefers-reduced-motion`. Dibuja la casa y anima a las personitas, y al tocar un objeto abre el mismo panel del DOM. El canvas es decorativo (`aria-hidden`).

**Stack:** Astro 7, CSS y PixiJS 8, la única dependencia nueva, en versión exacta. Sin otros paquetes.

**Specs:**
- Diseño: [`docs/superpowers/specs/2026-11-18-mundo-pixel-art-design.md`](../specs/2026-11-18-mundo-pixel-art-design.md), sección «Página personal».
- [`SPEC.md`](../../../SPEC.md), [`architecture.md`](../../../architecture.md) y [`art/SPEC.md`](../../../art/SPEC.md).
- **Referencia visual aprobada:** [`docs/reference/boceto-casa.html`](../../reference/boceto-casa.html). Se portan su composición y sus estados, no su runtime (`<x-dc>`, `{{…}}`, `DCLogic`).

## Restricciones globales

- **Colores:**
  - Fondo `#0C0F14`, paneles `#161B23`.
  - Paredes: de noche `#1A2030`, de día `#2A303C`.
  - Cielo: de noche `#0B1022`, de día `#9CC3E0`.
  - Líneas `#39414E`, texto `#E6E3DD`, secundario `#B3B9C2`, apagado `#8F97A3`.
  - Acento `#D9A55B`.
- **Sprites:** se leen de `/sprites/<name>.png` y `/sprites/<name>.json` (contrato en `art/SPEC.md`). Escala entera, sin suavizado; en PixiJS, `scaleMode: 'nearest'` o el equivalente de la v8.
- **PixiJS se instala con versión exacta** (sin `^`). Se usa la última 8.x publicada hace al menos 14 días antes de instalar; se verifica con `npm view pixi.js time`. Se importa **solo** desde `src/scripts/casa/scene.ts` y por `import()` dinámico. `/` no lo carga nunca.
- **Sin JavaScript:** `/casa` muestra una imagen estática de la casa más la lista completa de objetos con su información.
- **Con `prefers-reduced-motion: reduce`:** no se monta la escena. Se ve la imagen estática y la lista, y el reloj no avanza solo.
- **El canvas es `aria-hidden`.** Toda la información y toda acción existen en el DOM: un botón por objeto, panel con `aria-live="polite"` y foco que vuelve al botón al cerrar.
- **Hora:** la de Trujillo (UTC−5, sin horario de verano). Las fases son `noche` de 19:00 a 05:59, `amanecer` de 06:00 a 07:59, `dia` de 08:00 a 17:59 y `tarde` de 18:00 a 18:59. El control «adelantar reloj» suma horas al reloj mostrado; nunca cambia la hora real.
- **Contenido real.** Lo que la página muestra sale de `src/data/site.ts` (`games`, `screens`, `bands`, `rol`) y del parlante de Spotify. El estante dice «Leo sobre historia» y no muestra títulos que Bryan no dio.
- **Contraste ≥ 4.5:1, sin scroll horizontal a 375 px y Lighthouse móvil ≥ 90/95/95 en `/casa`.** `/` sigue en 100/100/100 y sin JS propio.

## Foco de revisión

1. **`prefers-reduced-motion`:** no se importa `pixi.js` ni se crea ningún canvas. Lo cubre la Task 4.
2. **Fallo al cargar PixiJS o un sprite** (red caída, PNG 404): la página sigue usable con la imagen estática y la lista, sin errores sin capturar. Lo cubre la Task 4.
3. **Cambio de fase en vivo:** si el reloj cruza las 19:00 con la pestaña abierta, la escena pasa a noche sin recargar. Lo cubre la Task 1 (función pura) y se ve en la Task 4.
4. **Teclado:**
   - Tab recorre los botones de objetos.
   - Enter abre el panel.
   - Escape lo cierra y el foco vuelve al botón.
   - Abrir otro objeto reemplaza el contenido.

   Lo cubre la Task 3.
5. **Celular de 375 px:** la escena se escala por enteros o se desliza dentro de su caja, sin scroll horizontal de la página. Lo cubre la Task 5.

---

### Task 1: Hora de Trujillo y fases del día

**Archivos:**
- Crear: `src/lib/casa/time.ts`
- Test: `tests/casa-time.test.ts`

**Interfaces:**
- Produce `type Fase = 'noche' | 'amanecer' | 'dia' | 'tarde'`.
- Produce `trujilloHour(now: Date, offsetHours = 0): { hour: number; minute: number }`: hora local de Trujillo (UTC−5) más el adelanto.
- Produce `faseAt(hour: number): Fase`, con los rangos de las restricciones globales.
- Produce `formatClock(h: { hour: number; minute: number }): string`, con el formato `HH:MM` en 24 h.
- Produce `msUntilNextMinute(now: Date): number`, para refrescar el reloj sin intervalos de 1 s.

- [ ] **Paso 1:** escribir los tests que fallan.
  - `trujilloHour(new Date('2026-11-23T02:30:00Z'))` es `{ hour: 21, minute: 30 }`.
  - Con `offsetHours = 10`, la misma fecha da `{ hour: 7, minute: 30 }`.
  - `faseAt(19)`, `faseAt(3)` y `faseAt(5)` son `'noche'`. `faseAt(6)` y `faseAt(7)` son `'amanecer'`. `faseAt(8)` y `faseAt(17)` son `'dia'`. `faseAt(18)` es `'tarde'`.
  - `formatClock({ hour: 7, minute: 5 })` es `'07:05'`.
  - `msUntilNextMinute(new Date('2026-11-23T02:30:15.500Z'))` es `44500`.
- [ ] **Paso 2:** correr `npx vitest run tests/casa-time.test.ts`. Se espera FAIL.
- [ ] **Paso 3:** implementar.
- [ ] **Paso 4:** correr el test (PASS) y después `npm test`.
- [ ] **Paso 5:** commit `feat: hora de Trujillo y fases del día para la casa`.

### Task 2: La escena como datos y las rutas

**Archivos:**
- Crear: `src/lib/casa/scene.ts`, `src/lib/casa/route.ts`
- Test: `tests/casa-scene.test.ts`

**Interfaces:**
- Produce, en `scene.ts`, el mundo en unidades de **píxel de sprite** (grilla de 16). La escena mide `WIDTH = 320` × `HEIGHT = 180`, y se escala por enteros en pantalla.
  - `type Rect = { x: number; y: number; w: number; h: number }`
  - `type ObjetoId = 'pc' | 'tv' | 'parlante' | 'mesa' | 'estante'`
  - `type Objeto = { id: ObjetoId; label: string; rect: Rect }`. Las `label` son, en orden: `PC`, `Televisor`, `Parlante`, `Mesa de rol`, `Estante`.
  - `type Habitacion = { id: 'biblioteca' | 'musica' | 'cuarto' | 'rol'; label: string; rect: Rect }`. Las `label` son `BIBLIOTECA`, `MÚSICA`, `CUARTO` y `MESA DE ROL`.
  - `type Actor = { sprite: string; route: Point[]; anim: 'walk' | 'action' | 'sit' | 'roll' | 'idle'; speed: number }`, con `type Point = { x: number; y: number }`.
  - Exporta `habitaciones`, `objetos` y `actoresPorFase(f: Fase): Actor[]`.
  - Distribución, como en el boceto: biblioteca y música arriba, cuarto y mesa de rol abajo. El reparto de actores:
    - **`noche` y `tarde`:** `bryan` en `sit` frente a la PC (ruta de un solo punto). `capataz` en `idle`, `doble` en `action` y `decorador` en `idle` alrededor de la mesa de rol.
    - **`dia`:** `bryan` en `walk` por la biblioteca, con una ruta de ida y vuelta de 2 puntos. Los oficios no están, porque están en la obra.
    - **`amanecer`:** `bryan` en `walk` del cuarto a la biblioteca, sin oficios.
  - Cada `rect` de objeto queda dentro de la habitación que le corresponde.
- Produce, en `route.ts`, `positionAt(route: Point[], speed: number, tMs: number): { x: number; y: number; flip: boolean }`.
  - Recorre la ruta ida y vuelta (ping-pong) a `speed` píxeles por segundo.
  - `flip` es `true` cuando va hacia la izquierda.
  - Con un solo punto, devuelve ese punto con `flip: false`.

- [ ] **Paso 1:** escribir los tests que fallan.
  - Los 5 objetos están dentro de `0..WIDTH` × `0..HEIGHT`, y cada uno queda contenido en el `rect` de su habitación: PC y TV en `cuarto`, parlante en `musica`, mesa en `rol` y estante en `biblioteca`.
  - `actoresPorFase('noche')` incluye `bryan` con `anim: 'sit'` y los sprites `capataz`, `doble` y `decorador`.
  - `actoresPorFase('dia')` es solo `bryan` con `anim: 'walk'` y una ruta de 2 o más puntos.
  - Cada `sprite` de cada fase existe (`spriteMeta(sprite, anim)` no lanza).
  - `positionAt([{x:0,y:0},{x:100,y:0}], 50, 1000)` da `x` 50 y `flip` false. Con `tMs = 3000` da `x` 50 y `flip` true, porque vuelve. Con un punto devuelve ese punto.
- [ ] **Paso 2:** correr `npx vitest run tests/casa-scene.test.ts`. Se espera FAIL.
- [ ] **Paso 3:** implementar. Las coordenadas exactas se derivan del boceto, escalando su caja de la casa de 1100×640 px a 320×180.
- [ ] **Paso 4:** correr el test (PASS) y `npm test`.
- [ ] **Paso 5:** commit `feat: escena de la casa como datos y rutas de las personitas`.

### Task 3: La página `/casa` accesible (sin canvas)

**Archivos:**
- Crear:
  - `src/components/casa/Reloj.astro`, `Objetos.astro`, `Panel.astro`
  - `src/scripts/casa/ui.ts`
  - `public/casa-estatica.png`, un marcador de posición temporal que la Task 5 reemplaza por la captura real
- Modificar: `src/pages/casa.astro` y `src/styles/global.css`
- Borrar: `src/components/Cuarto.astro`. Su contenido pasa al panel. `src/scripts/rotate.ts` **se queda**, porque la leyenda del parlante sigue rotando las bandas con `startRotation`.
- Test: `tests/casa-ui.test.ts` (happy-dom) y `tests/casa-page.test.ts` (Container API)

**Interfaces:**
- Consume `faseAt`, `trujilloHour`, `formatClock` y `msUntilNextMinute` (Task 1), y `objetos` (Task 2).
- Consume de `site.ts`: `games`, `screens`, `bands` y `rol`.
- Consume `startNowPlaying` (`src/scripts/now-playing.ts`).
- La página, de arriba hacia abajo:
  - **Encabezado:** «← volver a la obra» enlazado a `/`, el reloj `TRUJILLO · HH:MM` y un botón «adelantar reloj» con `aria-pressed`. El botón alterna entre la hora real y +10 h; un clic más vuelve a la real.
  - **`h1` según la fase:** «La casa, después de las 6» de noche o de tarde, y «La casa, de día» de día o al amanecer. Debajo, un subtítulo por fase, igual al del boceto.
  - **Caja de la escena** (`data-scene`, `aria-hidden="true"`): dentro, `<img src="/casa-estatica.png" alt="">`. La Task 4 monta ahí el canvas encima de la imagen.
  - **Leyenda del parlante:** `[data-speaker]`, con la lista que rota y `[data-live] hidden`, igual que hoy, para que `startNowPlaying` funcione sin cambios.
  - **`Objetos`:** `nav` con `aria-label="Objetos de la casa"` y un `<button>` por objeto (`data-objeto="<id>"`), en el orden de `objetos`.
  - **`Panel`:** `aside` con `aria-live="polite"`, que muestra el objeto abierto. Por defecto, el parlante.
    - PC: los `games`, cada uno con su enlace de crédito «vía Steam», como en `Cuarto`.
    - TV: los `screens` con el mismo formato.
    - Parlante: lo que suena (el `[data-live]` refleja Spotify) más los `bands`.
    - Mesa: `rol`.
    - Estante: «Leo sobre historia».
  - **Sin JS:** se ve el panel del parlante. Los paneles de los otros objetos también están en el HTML, como `<section>` con su `h2`, uno debajo del otro, para que nada dependa de JS. Con JS, `ui.ts` muestra uno a la vez.
- Produce, en `ui.ts`:
  - `initCasaUI(root: HTMLElement, opts: { now?: () => Date }): { open(id: ObjetoId): void; setOffset(h: number): void; onFase(cb: (f: Fase) => void): void; destroy(): void }`
  - Pone el reloj y la fase en `root.dataset.fase`.
  - Refresca el reloj al cambiar el minuto (`msUntilNextMinute`). Con `prefers-reduced-motion` no lo refresca, porque la hora es estática.
  - `open` muestra el panel del objeto, marca `aria-pressed` en su botón y mueve el foco al `h2` del panel.
  - Escape devuelve el foco al botón del objeto abierto.

- [ ] **Paso 1:** escribir los tests que fallan.
  - En `casa-page.test.ts`:
    - `/casa` tiene 5 `button[data-objeto]` en orden: `pc`, `tv`, `parlante`, `mesa`, `estante`.
    - Hay un `[data-speaker]`, un `[data-scene][aria-hidden="true"]` con su `img`, y un `aside[aria-live="polite"]`.
    - Las 5 secciones de panel están en el HTML.
    - Cada juego y cada serie tiene un enlace con `href` a su `sourceUrl`.
    - No aparece ningún corchete en el texto (`findPlaceholders` da `[]`).
  - En `casa-ui.test.ts`, con happy-dom y un `now` fijo a las 02:30Z, es decir 21:30 en Trujillo:
    - `root.dataset.fase` es `'noche'` y el reloj muestra `21:30`.
    - `setOffset(10)` lo deja en `'amanecer'` y `07:30`.
    - `open('tv')` muestra solo la sección de la TV, pone `aria-pressed="true"` en su botón y le da el foco a su `h2`.
    - Escape devuelve el foco al botón de la TV.
    - `onFase` avisa el cambio de fase al cambiar el adelanto.
- [ ] **Paso 2:** correr `npx vitest run tests/casa-page.test.ts tests/casa-ui.test.ts`. Se espera FAIL.
- [ ] **Paso 3:** implementar, con el estilo del boceto y las variables de `global.css`. Borrar `Cuarto.astro`; `casa.astro` sigue llamando a `startRotation` y a `startNowPlaying` para la leyenda del parlante. Mover a `casa-page.test.ts` los tests de `Cuarto` que sigan valiendo.
- [ ] **Paso 4:** correr `npm test` (todo en verde) y `npm run build`, que debe pasar la guardia.
- [ ] **Paso 5:** commit `feat: casa accesible con reloj, objetos y panel`.

### Task 4: La escena PixiJS

**Archivos:**
- Crear: `src/scripts/casa/scene.ts` y `src/scripts/casa/boot.ts`
- Modificar: `package.json`, para agregar `pixi.js` con versión exacta, y `src/pages/casa.astro`, para cargar `boot.ts`
- Test: `tests/casa-boot.test.ts`

**Interfaces:**
- Consume `habitaciones`, `objetos`, `actoresPorFase`, `positionAt`, `WIDTH` y `HEIGHT` (Task 2); `Fase` (Task 1); `initCasaUI` y su `open` y `onFase` (Task 3); los `/sprites/*.png|json`.
- Produce, en `boot.ts`, `bootCasa(root: HTMLElement, deps: { reducedMotion: boolean; loadScene: () => Promise<{ mountScene: MountScene }> }): Promise<'static' | 'scene' | 'error'>`:
  - Con `reducedMotion`, devuelve `'static'` sin llamar a `loadScene`.
  - Si `loadScene` o el montaje fallan, captura el error, deja la imagen estática y devuelve `'error'`.
  - Si no, monta la escena y devuelve `'scene'`.
  - En la página: `bootCasa(root, { reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, loadScene: () => import('../scripts/casa/scene') })`.
- Produce, en `scene.ts`, `type MountScene = (container: HTMLElement, ui: { open(id: ObjetoId): void; onFase(cb: (f: Fase) => void): void; fase: Fase }) => Promise<{ destroy(): void }>`:
  - Crea una `Application` de PixiJS del tamaño de la caja, con escala entera `floor(min(ancho / WIDTH, alto / HEIGHT))` y mínimo 1, y fondo transparente.
  - **Casa:** paredes, pisos, techo y ventana dibujados con `Graphics`, con los colores por fase de las restricciones globales. La ventana muestra sol de día y luna de noche, como en el boceto.
  - **Objetos:** los muebles se dibujan con `Graphics` simples, en pixel art de bloques. Cada `objeto.rect` es una zona interactiva (`eventMode: 'static'`, `cursor: 'pointer'`) que llama a `ui.open(id)`.
  - **Actores:** `AnimatedSprite` a partir de cada hoja (cuadros cortados según el JSON y la fila de la animación), con `animationSpeed` acorde y la posición de `positionAt` en el ticker. Con `flip`, se invierte `scale.x`.
  - `ui.onFase` rehace los actores y los colores sin recrear la `Application`.
  - Al cargar, el canvas se pone encima de la imagen estática, que pasa a `visibility: hidden`. El canvas lleva `aria-hidden="true"`.
  - `destroy` libera la `Application` y las texturas.

- [ ] **Paso 1:** elegir la versión exacta de `pixi.js` (la última 8.x publicada hace al menos 14 días, con `npm view pixi.js time`) e instalarla con `npm i -E pixi.js@<versión>`. Anotar la versión y su fecha en el reporte.
- [ ] **Paso 2:** escribir los tests que fallan en `tests/casa-boot.test.ts`, con happy-dom.
  - Con `reducedMotion: true`, `bootCasa` da `'static'` y `loadScene` no se llama.
  - Con un `loadScene` que rechaza, da `'error'`, no lanza y la `img` de `[data-scene]` sigue visible.
  - Con un `loadScene` que devuelve un `mountScene` falso, da `'scene'` y `mountScene` recibe el contenedor `[data-scene]`.
  - El HTML de `/` (Container API, `index.astro`) no contiene `pixi`.
- [ ] **Paso 3:** correr `npx vitest run tests/casa-boot.test.ts`. Se espera FAIL.
- [ ] **Paso 4:** implementar `boot.ts` y `scene.ts`.
- [ ] **Paso 5:** correr `npm test` y `npm run build`, los dos en verde. Revisar en `dist/` que el chunk de pixi solo se referencie desde `/casa`: `grep -l pixi dist -r` no debe listar `dist/index.html`.
- [ ] **Paso 6:** commit `feat: escena de la casa con PixiJS`.

### Task 5: Imagen estática, verificación y specs (controlador y subagente)

**Archivos:**
- Modificar:
  - `public/casa-estatica.png` (captura real de la escena)
  - `src/pages/casa.astro`, para sumar una `og:image` propia
  - `SPEC.md` y `architecture.md`
- Crear: `public/og-casa.png`

- [ ] **Paso 1 (controlador):** verificar en el panel del navegador con `npm run dev`, a 1440 y a 375 px:
  - La escena se anima y las personitas caminan.
  - Al tocar un objeto se abre su panel.
  - «adelantar reloj» cambia la fase y la escena.
  - En 375, `scrollWidth <= 375`.
  - No hay errores en la consola.
  - Comparar con el boceto aprobado.
- [ ] **Paso 2:** capturar la escena de noche con el Chrome local en headless:
  - `public/casa-estatica.png`, a la escala que use la caja en escritorio.
  - `public/og-casa.png`, de 1200×630.
  - `casa.astro` pasa a `Base` una `ogImage` propia. Se agrega el prop opcional `ogImage` a `Base.astro`, con `/og.png` por defecto, y un `alt` propio: «La casa de Bryan de noche: la PC, la mesa de rol y la cuadrilla jugando».
- [ ] **Paso 3:** correr Lighthouse en móvil sobre `astro preview` para `/casa` (meta ≥ 90/95/95) y para `/` (debe seguir en 100/100/100). Corregir lo que falte.
- [ ] **Paso 4:** cargar el skill `project-specs` y actualizar las specs:
  - `SPEC.md`: la capacidad de `/casa` deja de ser provisoria.
  - `architecture.md`: decisiones «escena en capas: lógica pura, DOM accesible y PixiJS decorativo» e «hora real de Trujillo». Invariantes nuevos: «el canvas siempre tiene su equivalente accesible en el DOM» y «con `prefers-reduced-motion`, la escena no se monta».
  - El validador debe dar 0 errores.
- [ ] **Paso 5:** commit `chore: imagen de la casa, verificación y specs de la fase 3`.
