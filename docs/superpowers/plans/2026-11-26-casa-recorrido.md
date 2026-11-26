# La casa como recorrido — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rehacer `/casa` y `/en/casa` como un recorrido de 3 habitaciones vivas (cuarto, sala, mesa de rol), dibujado en HTML y CSS, con portadas reales; se quita PixiJS.

**Architecture:**
- Cada habitación es un componente Astro con dos partes: una escena dibujada con CSS y sprites (`aria-hidden`) y un bloque de contenido accesible al lado.
- El movimiento es CSS: los sprites con `steps()`, las tiras de portadas que rotan y el encendido y la caminata ligados al scroll (`animation-timeline: view()`).
- El único JavaScript es el que ya existe: el reloj de Trujillo, la rotación de bandas y Spotify.

**Tech Stack:** Astro 7 (`astro:assets`), CSS, Vitest + happy-dom + Astro Container, sharp (ya instalado).

**Spec:** `docs/superpowers/specs/2026-11-26-casa-recorrido-design.md`. Boceto: lienzo «Portafolio · 3 bocetos», `CasaB.dc.html`. Al ejecutar, va una copia en la carpeta del plan.

## Global Constraints

- **Contenido:** el de `src/data/site.ts` (`games`, `screens`, `bands`, `rol`); no se agrega ningún título. Nada que diga que Bryan lee mucho, es músico o es cinéfilo. El grupo de rol aparece solo como monigotes sin nombre.
- **Imágenes:**
  - Viven en `src/assets/casa/`, a 600 px de ancho como máximo, y las optimiza `astro:assets`.
  - Salvo la carátula de Spotify, nada se carga desde terceros en tiempo de ejecución.
  - No se descarga nada sin el OK de Bryan a la lista de archivos.
- **Sprites:** solo las animaciones que existen: `idle`, `walk`, `action` y, para Bryan, `sit`. No se dibujan sprites nuevos.
- **Animación:**
  - Se animan solo `opacity`, `transform`, `filter` y `background-position`.
  - Las reglas ligadas al scroll van dentro de `@supports (animation-timeline: view())` y `@media (prefers-reduced-motion: no-preference)`, escritas solo con longhands. El minificador mete `animation-timeline` en el shorthand y Chrome lo descarta.
  - Sin soporte de scroll o con movimiento reducido, el estado base es el final: habitaciones encendidas y Bryan quieto.
  - Con movimiento reducido, además, no hay tiras ni sprites animados.
  - Las animaciones de una escena se pausan con el puntero encima (WCAG 2.2.2).
- **Accesibilidad:**
  - Cada habitación es una `section` con su `h2`.
  - La escena va `aria-hidden="true"` y no tiene nada enfocable.
  - Cada título enlaza a su fuente con `aria-label="${title} ${via} ${source}"`; con `via` igual a «vía» en español y «via» en inglés.
- **Celular (375 px):** la escena arriba y el contenido debajo, sin scroll horizontal; la escena se escala sin deformar los píxeles.
- **Lighthouse móvil, 3 veces en `/casa` y `/en/casa`:** rendimiento ≥ 95; accesibilidad y SEO 100; CLS 0.
- **Puerto:** nunca el 4321 para servidores de agentes; `astro preview --port 4322`.

## Review Focus

1. **Firefox o Safari sin `animation-timeline`:** las 3 habitaciones se ven encendidas y completas; nada queda invisible ni en penumbra.
2. **Movimiento reducido:** nada se mueve. El monitor y la TV muestran su primera portada, y los sprites, su primer cuadro.
3. **375 px:** no hay scroll horizontal, y la escena entra entera sin pixeles borrosos.
4. **Spotify sin carátula o sin red:** si suena algo sin imagen, no se ve una imagen rota. Si no hay red, rotan las bandas.
5. **Teclado:** el Tab recorre solo los enlaces de contenido, en orden; dentro de las escenas no hay nada enfocable y el foco se ve.

---

### Task 1: Las portadas (descarga y datos)

**Files:**
- Create: `src/assets/casa/*.jpg` (7 juegos, 11 títulos, 5 bandas, 2 manuales)
- Modify: `src/data/site.ts`, `src/data/site.en.ts` (si hace falta para `bands`/`manuales`), `src/components/casa/Panel.astro` (solo para que `bands` siga compilando: `b.title`)
- Test: `tests/data.test.ts`

**Interfaces:**
- Produces:
  - `games: Credit[]` y `screens: Credit[]`, cada uno con `cover`.
  - `bands: Credit[]`: `{ title, cover, source: 'Spotify', sourceUrl: 'https://open.spotify.com/artist/<id>' }`.
  - `manuales: Credit[]`: D&D Player's Handbook y Cyberpunk RED Core Rulebook, con `cover`, `source` (la editorial) y `sourceUrl`.
  - `rol: string[]` sin cambios.

- [ ] **Step 1 (controlador, antes de despachar): Armar la lista de descargas**, una fila por imagen: título, URL de la imagen, URL de la página fuente, tamaño en KB. Fuentes:
  - juegos: `https://cdn.cloudflare.steamstatic.com/steam/apps/<id>/header.jpg`, con el id que ya está en `site.ts`;
  - títulos: la imagen principal del artículo de Wikipedia (`/api/rest_v1/page/summary/<artículo>` → `originalimage`); en las trilogías, la primera película;
  - bandas: la `og:image` pública de su página de artista en Spotify;
  - manuales: la portada en la página de la editorial;
  - si una no existe, se propone otra fuente o la tarjeta con solo el título.
- [ ] **Step 2 (controlador): Pedir el OK de Bryan** a esa lista. Sin OK no se baja nada.
- [ ] **Step 3: Descargar y reducir** a ≤ 600 px de ancho con sharp, en `src/assets/casa/<slug>.jpg` (slug en minúsculas con guiones, por ejemplo `crusader-kings-iii.jpg`).
- [ ] **Step 4: Write the failing tests** en `tests/data.test.ts`:

```ts
describe('casa: portadas', () => {
  it('cada juego, título, banda y manual trae su portada', () => {
    for (const c of [...games, ...screens, ...bands, ...manuales]) expect(c.cover, c.title).toBeTruthy();
  });
  it('bandas y manuales', () => {
    expect(bands.map((b) => b.title)).toEqual(['Enjambre', 'Los Bunkers', 'Rio', 'Enanitos Verdes', 'Jamiroquai']);
    bands.forEach((b) => expect(b.sourceUrl).toMatch(/^https:\/\/open\.spotify\.com\/artist\//));
    expect(manuales).toHaveLength(2);
  });
});
```

  Si alguna imagen terminó siendo «sin imagen» con el OK de Bryan, el primer test la exceptúa por título.
- [ ] **Step 5: Run** `npx vitest run tests/data.test.ts` → FAIL.
- [ ] **Step 6: Implement:** importar las imágenes en `site.ts` y completar `cover`; `bands` pasa a `Credit[]`; agregar `export const manuales`.
- [ ] **Step 7: Run** `npx vitest run` y `npm run build` → PASS.
- [ ] **Step 8: Commit** `feat: portadas reales de la casa`

### Task 2: La carátula de Spotify

**Files:**
- Modify: `functions/_lib/spotify.ts`, `src/scripts/now-playing.ts`
- Test: `tests/spotify.test.ts`, `tests/now-playing.test.ts`

**Interfaces:**
- Produces:
  - `NowPlaying` en su caso `playing: true` agrega `cover?: string`.
  - `applyNowPlaying(speaker, data)` espera dentro de `[data-live]` un `<img data-live-cover alt="" hidden>` y un `<span data-live-text>`.

- [ ] **Step 1: Write the failing tests:**
  - `spotify.test.ts`: con `item.album.images` = `[{url:'a',width:640},{url:'b',width:300},{url:'c',width:64}]`, `cover` es `'c'`. Con `[{url:'b',width:300},{url:'d',width:40}]` es `'b'` (la más chica de al menos 64 px). Sin `album` o sin imágenes, `cover` es `undefined`.
  - `now-playing.test.ts`:
    - con `{playing:true,title:'T',artist:'A',url:'u',cover:'c'}`, `[data-live-text]` dice `T — A` y el `img` tiene `src="c"` y no está `hidden`;
    - sin `cover`, el `img` queda `hidden` y sin `src`;
    - con `{playing:false}` vuelve la rotación como hoy.
- [ ] **Step 2: Run** `npx vitest run tests/spotify.test.ts tests/now-playing.test.ts` → FAIL.
- [ ] **Step 3: Implement** en los dos archivos. El texto va en `[data-live-text]`, no en `live.textContent`, que borraría la imagen.
- [ ] **Step 4: Run** `npx vitest run` → PASS.
- [ ] **Step 5: Commit** `feat: carátula de lo que suena en Spotify`

### Task 3: La página nueva y lo que se va

**Files:**
- Create: `src/components/casa/Cuarto.astro`, `Sala.astro`, `MesaRol.astro` (por ahora, solo el bloque de contenido); `src/scripts/casa/reloj.ts`
- Modify: `src/views/Casa.astro`, `src/i18n.ts`, `src/lib/casa/textos.ts`, `src/lib/casa/time.ts`, `src/styles/global.css` (quitar `.casa-*` sin uso), `SPEC.md` (la línea de `/casa`), `package.json` (quitar `pixi.js`)
- Delete: `src/scripts/casa/scene.ts`, `boot.ts`, `ui.ts`; `src/lib/casa/scene.ts`, `route.ts`; `src/components/casa/Objetos.astro`, `Panel.astro`, `Reloj.astro` si no se usa; `tests/casa-boot.test.ts`, `casa-scene.test.ts`, `casa-ui.test.ts`
- Test: `tests/casa-page.test.ts` (reescrito), `tests/en.test.ts`, `tests/casa-time.test.ts`

**Interfaces:**
- Consumes: Task 1 (`games`, `screens`, `bands`, `manuales`, `rol`) y Task 2 (estructura de `[data-live]`).
- Produces:
  - Las secciones `section.hab[data-hab="cuarto"|"sala"|"mesa"]`, cada una con `div.hab-escena[aria-hidden="true"]` (vacío por ahora) y `div.hab-info`.
  - `initReloj(el: HTMLElement, opts?: { now?: () => Date; reducido?: boolean }): () => void`, que pinta `TRUJILLO · HH:MM` cada minuto y devuelve la función para detenerlo.
  - Textos en `t[lang].casa`:

| clave | es | en |
|---|---|---|
| `h1` | La casa, después de las 6 | The house, after 6 |
| `sub` | Lo que juego, lo que veo y las partidas de rol. | What I play, what I watch and the role-playing sessions. |
| `cuarto` | `['CUARTO · LO QUE JUEGO', 'Juegos', 'Estrategia, simulación y mundos abiertos.']` | `['BEDROOM · WHAT I PLAY', 'Games', 'Strategy, simulation and open worlds.']` |
| `sala` | `['SALA · LO QUE VEO Y LO QUE SUENA', 'Lo que veo']` | `['LIVING ROOM · WHAT I WATCH AND WHAT’S PLAYING', 'What I watch']` |
| `parlante` | `['EL PARLANTE · EN VIVO DESDE SPOTIFY', 'Lo que suena', 'Si no suena nada, esto es lo que escucho:']` | `['THE SPEAKER · LIVE FROM SPOTIFY', 'What’s playing', 'If nothing is playing, this is what I listen to:']` |
| `mesa` | `['MESA DE ROL · JUEGO Y DIRIJO, EN LÍNEA', 'Rol', 'Juego y dirijo D&D y Cyberpunk RED, en línea.']` | `['RPG TABLE · I PLAY AND RUN GAMES, ONLINE', 'Role-playing', 'I play and run D&D and Cyberpunk RED, online.']` |
| `creditos` | Las portadas y los pósters son de sus dueños; se muestran como referencia. | Covers and posters belong to their owners; shown for reference. |

  - Se quitan `adelantar`, `objetosAria`, `objetosKicker`, `pc`, `tv`, `estante` y el `mesa` viejo. `title`, `description`, `ogAlt`, `volver` y `via` se quedan.

- [ ] **Step 1: Write the failing tests:**
  - `tests/casa-page.test.ts` reescrito:
    - hay 3 `section.hab` en orden `cuarto, sala, mesa`, cada una con `h2` («Juegos», «Lo que veo», «Rol»);
    - cada `games`, `screens`, `bands` y `manuales` tiene un enlace a `sourceUrl` con el `aria-label` de las restricciones y una `img` con `alt` igual al título;
    - `[data-speaker]` contiene `[data-rotate]` con las 5 bandas y `[data-live] img[data-live-cover]` más `[data-live-text]`;
    - el texto incluye «Juego y dirijo D&D y Cyberpunk RED, en línea.» y la nota de créditos;
    - no aparecen «Leo sobre historia», `data-adelantar`, `data-objeto` ni «pixi»;
    - `[data-reloj]` existe;
    - cada `.hab-escena` tiene `aria-hidden="true"` y no contiene `a, button, input, [tabindex]` (Review Focus 5);
    - `findPlaceholders(html)` da `[]`.
  - `tests/en.test.ts`: `/en/casa` tiene los `h2` «Games», «What I watch», «Role-playing» y los enlaces con «via».
  - `tests/casa-time.test.ts`: se quitan los tests de `faseAt`/`esDeNoche` y se agregan los de `initReloj`:
    - con `now = 2026-11-23T02:30:00Z` pinta `TRUJILLO · 21:30`;
    - con `reducido: true` no programa timers;
    - la función que devuelve limpia el timer.
- [ ] **Step 2: Run** `npx vitest run tests/casa-page.test.ts tests/en.test.ts tests/casa-time.test.ts` → FAIL.
- [ ] **Step 3: Implement:**
  - la vista, los 3 componentes (solo el bloque de contenido) y `reloj.ts`;
  - el `<script>` de `Casa.astro` llama a `startRotation`, `startNowPlaying` e `initReloj`, sin nada más;
  - quitar los archivos de la lista, `pixi.js` y lo que quede sin uso en `textos.ts` y `time.ts` (`faseAt`, `esDeNoche`, `Fase`, el día);
  - actualizar la línea de `/casa` en `SPEC.md` y correr `node ~/.claude/skills/project-specs/scripts/validate-specs.mjs .`.
- [ ] **Step 4: Run** `npm install` (para el lockfile), `npx vitest run` y `npm run build` → PASS. `dist/casa/index.html` sin «pixi».
- [ ] **Step 5: Commit** `feat: la casa como recorrido, contenido y sin PixiJS`

### Task 4: Las escenas vivas

**Files:**
- Create: `src/styles/casa.css`, `src/components/casa/Pasillo.astro`
- Modify: `src/components/casa/Cuarto.astro`, `Sala.astro`, `MesaRol.astro` (dibujo dentro de `.hab-escena`), `src/views/Casa.astro` (pasillos entre habitaciones, importar `casa.css`)
- Test: `tests/casa-page.test.ts`

**Interfaces:**
- Consumes: la estructura de la Task 3 (`section.hab`, `.hab-escena`, `.hab-info`), `Sprite.astro` (`name`, `anim`, `scale`, `paused`, `class`, `style`) y los `cover` de la Task 1.

- [ ] **Step 1: Write the failing tests** en `tests/casa-page.test.ts`:
  - la escena del cuarto tiene un sprite `bryan` en `sit` y una tira `.tira` con 7 imágenes;
  - la de la sala tiene una tira con 11 y un sprite en `action`;
  - la de la mesa tiene 4 sprites dentro de `.llamada`;
  - hay 2 `.pasillo`, cada uno con un sprite `bryan` en `walk`;
  - las imágenes de las tiras tienen `alt=""`;
  - solo las de la escena del cuarto cargan de inmediato: en la sala y la mesa todas las `img` llevan `loading="lazy"`.
- [ ] **Step 2: Run** `npx vitest run tests/casa-page.test.ts` → FAIL.
- [ ] **Step 3: Implement** según el boceto `CasaB.dc.html`:
  - **Cuarto:** ventana, póster, repisa, escritorio, 2 monitores (en el principal, la tira de juegos), torre RGB, silla y Bryan con audífonos.
  - **Sala:** TV con la tira de títulos, sofá con 2 monigotes en `idle`, tocadiscos con el disco girando, cuadro con la carátula (de la Task 2 cuando suena; si no, la primera banda) y un monigote en `action` con notas que suben.
  - **Mesa:** pantalla con mapa y fichas, llamada 2×2 con borde que parpadea en quien habla, la pantalla de DM y la hoja de personaje alternándose, d20 que rueda, estante con los 2 manuales.
  - **Pasillo:** Bryan en `walk` cruza ligado al scroll.
  - **Encendido:** cada escena pasa de `filter: brightness(.55)` a `1` al entrar, ligado al scroll.
  - **Pausa:** `.hab-escena:hover` pausa sus animaciones.
  - **Tiras:** las imágenes chicas, de unos 200 px de ancho.
  - Las Global Constraints se cumplen enteras.
- [ ] **Step 4: Run** `npx vitest run` y `npm run build` → PASS.
- [ ] **Step 5: Check in the browser** (`astro preview --port 4322`) y guardar capturas en la carpeta del plan:
  - 1440 al entrar y al terminar el scroll;
  - 375 (sin scroll horizontal: `document.documentElement.scrollWidth <= 375`);
  - `/en/casa`;
  - foco con teclado;
  - movimiento reducido.
- [ ] **Step 6: Commit** `feat: las habitaciones de la casa se mueven`

### Task 5: Verificación (controlador)

- [ ] Lighthouse móvil 3 veces en `/casa` y `/en/casa`: rendimiento ≥ 95, accesibilidad y SEO 100, CLS 0.
- [ ] Recapturar `public/og-casa.png` (1600×840 reducido a 1200×630 con sharp, como `og.png`) y commitear `chore: og de la casa nueva`.
