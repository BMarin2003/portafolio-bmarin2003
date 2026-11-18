# Portafolio "la casa en corte": plan de construcción

> **Para agentes:** sub-skill requerido: superpowers:subagent-driven-development o superpowers:executing-plans, tarea por tarea. Los pasos usan casillas (`- [ ]`).

**Meta:** publicar en Cloudflare Pages el portafolio de una página de Bryan Marin. La portada es la casa en corte: arriba el taller (de día), abajo el cuarto (de noche).

**Arquitectura:**
- Astro estático. El contenido vive en `src/data/site.ts` y los componentes solo lo pintan.
- Dos scripts de cliente chicos: la rotación y el parlante.
- Una Pages Function (`/api/now-playing`) habla con Spotify. El token nunca sale del servidor.

**Stack:** Astro 7.4, TypeScript estricto, Vitest 5.1 (+ happy-dom para los scripts de cliente), Wrangler 4 y Cloudflare Pages Functions. Fuentes con `@fontsource`. Node 24.

**Specs:** [`SPEC.md`](../../../SPEC.md) y [`architecture.md`](../../../architecture.md), ambas `active`. Referencia visual: [`docs/reference/boceto-b.html`](../../reference/boceto-b.html), la versión sobria del boceto B. Hay que portar su marcado y sus colores, no copiar su runtime (`<x-dc>`, `DCLogic`).

## Restricciones globales

- **Colores:**
  - Fondo `#11151B`, fondo del cuarto `#0C0F14`.
  - Texto `#E6E3DD`, secundario `#B3B9C2`, apagado `#8F97A3`.
  - Líneas `#262C36` y `#39414E`.
  - Acento único `#D9A55B`.
  - Piso del taller `#E4DFD4` con texto `#1A1E25` y etiqueta `#5B6270`.
- **Colores de la cuadrilla:** hallmark `#C48A96`, ponytail `#D9A55B`, superpowers `#7C93B8`, cc-safety-net `#C27A5C`, Obsidian `#958AC0`.
- **Fuentes:** Schibsted Grotesk (texto) y DM Mono (etiquetas de plano), servidas desde el propio sitio con `@fontsource`. Nada se carga desde Google Fonts.
- **Contraste mínimo de 4.5:1** en todo el texto.
- **`prefers-reduced-motion: reduce`** detiene las animaciones CSS y la rotación.
- **Sin JavaScript,** la página muestra el primer elemento de cada lista y el parlante muestra una banda.
- **Nada de CorAll expone código, repos ni capturas.** Las personas aparecen solo como "mis estimados compañeros …, supervisores … y gerentes …", con enlace si tienen portafolio.
- **No se agrega ningún proyecto** fuera de Totem Multimedia, CCAE, MaqinPro, Comphill, Corall-ERP e ITN.
- **Ningún texto entre corchetes llega a `dist/`.** `npm run build` falla si encuentra uno; mientras se trabaja se usa `npm run build:draft`.
- **Sin librerías de animación ni frameworks de UI.**
- **Crédito visible a Claude (Anthropic)** en el pie.

## Foco de revisión

1. **JS desactivado:** se ven la primera portada, el primer título y una banda, y los pisos siguen siendo enlaces. Lo cubre la Tarea 3.
2. **`prefers-reduced-motion`:** no rota nada y no corre ninguna animación. Lo cubre la Tarea 4.
3. **Spotify caído, token vencido o `429`:** la función responde `{ playing: false }` con 200 y el parlante sigue rotando. Lo cubre la Tarea 5.
4. **Spotify reproduce un podcast o un anuncio** (`currently_playing_type` distinto de `track`, o `item: null`): se trata como "no suena nada". Lo cubre la Tarea 5.
5. **Celular de 375 px:** la casa se apila, no hay scroll horizontal y los títulos largos ("Mount & Blade: Warband") hacen salto de línea. Lo cubre la Tarea 2.

---

### Task 1: Proyecto, datos y guardia de corchetes

**Archivos:**
- Crear: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `CLAUDE.md`
- Crear: `src/data/site.ts`, `src/lib/text.ts`, `scripts/check-placeholders.mjs`
- Tests: `tests/text.test.ts`, `tests/check-placeholders.test.ts`

**Interfaces:**
- Produce, en `src/data/site.ts`:
  - `type Person = { name: string; url?: string }`
  - `type People = { companeros: Person[]; supervisores: Person[]; gerentes: Person[] }`
  - `type CorallProject = { name: string; did: string; people: People }`
  - `type CrewMember = { name: string; title: string; color: string; role: string; variant?: 'sleepy' | 'helmet' }`
  - `type Credit = { title: string; cover?: ImageMetadata; source: string; sourceUrl: string }`
  - Exporta `corall: CorallProject[]`, `crew: CrewMember[]`, `games: Credit[]`, `screens: Credit[]`, `bands: string[]`, `rol: string[]`, `links: { github: string; linkedin: string }`.
- Produce, en `src/lib/text.ts`: `separator(i: number, len: number): string` y `peopleGroups(p: People): { label: 'compañeros' | 'supervisores' | 'gerentes'; people: Person[] }[]`.
- Produce, en `scripts/check-placeholders.mjs`: `findPlaceholders(html: string): string[]` y un CLI `node scripts/check-placeholders.mjs <dir>` que sale con código 1 si encuentra alguno.

- [ ] **Paso 1:** inicializar el repositorio y el proyecto.
  - Correr `git init`.
  - Crear el proyecto con la plantilla mínima de Astro (`npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`) y luego `npm i`.
  - Instalar como dependencias de desarrollo `vitest@5 happy-dom wrangler@4`, y como dependencias `@fontsource/schibsted-grotesk @fontsource/dm-mono`.
- [ ] **Paso 2:** configurar.
  - `astro.config.mjs` con `site: 'https://<proyecto>.pages.dev'` (el nombre real sale en la Tarea 6) y `i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: false } }`.
  - `vitest.config.ts` con `getViteConfig` de `astro/config`.
  - Scripts en `package.json`:
    - `"build:draft": "astro build"`
    - `"build": "astro build && node scripts/check-placeholders.mjs dist"`
    - `"test": "vitest run"`
  - `.gitignore` con `node_modules/`, `dist/`, `.astro/`, `.wrangler/` y `.dev.vars`.
  - `CLAUDE.md` con una línea: "Antes de tocar un módulo, carga el skill `project-specs` y lee su SPEC.md."
- [ ] **Paso 3:** escribir los tests que fallan.
  - `tests/text.test.ts`:
    - `separator`: `(0,1)→''`, `(0,2)→' y '`, `(1,2)→''`, `(0,3)→', '`, `(1,3)→' y '`.
    - `peopleGroups`: omite los grupos vacíos y conserva el orden compañeros → supervisores → gerentes.
  - `tests/check-placeholders.test.ts`:
    - `findPlaceholders('<p>[Qué hice] · Con [nombres]</p>')` devuelve `['[Qué hice]', '[nombres]']`.
    - `findPlaceholders('<a href="x">Andor</a>')` devuelve `[]`.
    - `findPlaceholders('<script>a[0]</script>')` devuelve `[]`, porque se ignora el contenido de `<script>` y `<style>`.
- [ ] **Paso 4:** correr `npm test`. Se espera FAIL porque los módulos no existen.
- [ ] **Paso 5:** implementar `src/lib/text.ts` y `scripts/check-placeholders.mjs`.
  - El detector primero quita `<script>`, `<style>` y las etiquetas, y después busca `/\[[^\[\]\n]{1,60}\]/g`.
  - El CLI recorre `**/*.html` e imprime `archivo: coincidencia`.
- [ ] **Paso 6:** escribir `src/data/site.ts` con los valores exactos de la sección Capacidades de `SPEC.md`.
  - Juegos, pantallas y bandas: en el orden de la spec. Las bandas se escriben así: `Enjambre`, `Los Bunkers`, `Rio`, `Enanitos Verdes`, `Jamiroquai`.
  - `rol: ['D&D', 'Cyberpunk RED']`.
  - Cuadrilla: con los textos de la referencia visual. `ponytail` lleva `variant: 'sleepy'` y `cc-safety-net` lleva `variant: 'helmet'`.
  - Proyectos de CorAll: `did: '[Qué hice]'` y personas vacías hasta que Bryan las dé.
  - `links.linkedin: '[linkedin]'`.
  - Créditos: `source` y `sourceUrl` apuntan a la página oficial (Steam para los juegos). `cover` queda sin definir hasta que existan las imágenes.
- [ ] **Paso 7:** verificar. `npm test` debe pasar y `npm run build:draft` debe terminar sin errores.
- [ ] **Paso 8:** hacer commit: `git add -A && git commit -m "chore: proyecto astro, datos y guardia de corchetes"`.

### Task 2: Layout, muñequito y la casa en corte

**Archivos:**
- Crear: `src/layouts/Base.astro`, `src/components/Bot.astro`, `src/components/House.astro`, `src/styles/global.css`, `src/pages/index.astro`
- Test: `tests/house.test.ts`

**Interfaces:**
- Consume: `crew`, `games`, `screens`, `bands` (Tarea 1).
- Produce:
  - `Bot.astro` con props `{ color: string; variant?: 'sleepy' | 'helmet'; motion?: 'breathe' | 'type'; delay?: 0 | 1 | 2; size?: 'sm' | 'md' }`. Es un `<svg aria-hidden="true">` o un `<span>` decorativo.
  - `House.astro`, sin props. Para la Tarea 4, sus pantallas llevan `data-rotate` con un hijo por elemento, todos `hidden` salvo el primero. El parlante lleva además `data-speaker`.
  - `Base.astro` con props `{ title: string; description: string }`. Carga las fuentes, `global.css` y las metaetiquetas Open Graph.

- [ ] **Paso 1:** escribir el test que falla en `tests/house.test.ts`. Usa la Container API de Astro (`experimental_AstroContainer` de `astro/container`; si en 7.4 ya tiene otro nombre, usar el actual) para renderizar `House`. Debe comprobar:
  - Que tiene `href="#taller"` y `href="#cuarto"`.
  - Que hay exactamente 5 muñequitos en el taller (`data-bot` dentro de `[data-floor="taller"]`).
  - Que la primera entrada de `games`, `screens` y `bands` aparece en hijos sin `hidden`.
  - Que el resto aparece con `hidden`.
- [ ] **Paso 2:** correr `npm test -- house`. Se espera FAIL.
- [ ] **Paso 3:** portar la casa desde `docs/reference/boceto-b.html` a `House.astro` y `Bot.astro`.
  - Las clases van en `global.css`.
  - Las animaciones (`breathe`, `type`, `blink`, `glow`) van en CSS, con su bloque `@media (prefers-reduced-motion: reduce)`.
  - Por debajo de `720px` los pisos van a todo el ancho y se ocultan las anotaciones de plano (columna derecha).
  - Las pantallas usan `overflow-wrap: anywhere`.
- [ ] **Paso 4:** armar `index.astro` con `Base` y `House`, más el encabezado y la portada de la referencia.
- [ ] **Paso 5:** correr `npm test` (PASS) y `npm run build:draft` (sin errores).
- [ ] **Paso 6:** verificar en el navegador.
  - Correr `npm run dev` y abrir la página en el panel del navegador a 1440 px y a 375 px.
  - En 375 px, `document.documentElement.scrollWidth <= 375` debe dar `true`.
  - Comparar contra la referencia visual.
- [ ] **Paso 7:** commit `feat: casa en corte con la cuadrilla`.

### Task 3: Secciones del taller y del cuarto

**Archivos:**
- Crear: `src/components/Taller.astro`, `src/components/Cuarto.astro`, `src/components/People.astro`
- Modificar: `src/pages/index.astro`
- Test: `tests/sections.test.ts`

**Interfaces:**
- Consume: `corall`, `crew`, `games`, `screens`, `bands`, `rol`, `links`, `separator`, `peopleGroups` (Tarea 1).
- Produce: `People.astro` con props `{ people: People }`. Renderiza "Con mis estimados compañeros A y B, supervisores C y gerentes D.":
  - Cada persona con `url` va como `<a href>`.
  - Si los tres grupos están vacíos no renderiza nada.

- [ ] **Paso 1:** escribir los tests que fallan en `tests/sections.test.ts`.
  - `Taller` contiene los 6 nombres de proyecto en el orden de la spec y los 5 nombres de la cuadrilla.
  - `People` con `{ companeros: [{name:'Ana', url:'https://a.dev'}, {name:'Luis'}], supervisores: [], gerentes: [{name:'Rosa'}] }` produce el texto "Con mis estimados compañeros Ana y Luis y gerentes Rosa.", con un solo `<a href="https://a.dev">`.
  - `Cuarto` contiene "D&D", "Cyberpunk RED" y el primer elemento de cada lista sin `hidden`.
  - Cada portada con `cover` lleva un `<a href={sourceUrl}>` con su `source`.
  - El pie contiene "Construido junto a Claude (Anthropic)".
- [ ] **Paso 2:** correr `npm test -- sections`. Se espera FAIL.
- [ ] **Paso 3:** implementar los tres componentes según las secciones `#taller` y `#cuarto` de la referencia.
  - Si una portada no tiene `cover`, se muestra el título en texto, como en el boceto.
  - Las portadas se renderizan con `<Image>` de `astro:assets`.
- [ ] **Paso 4:** correr `npm test` (PASS) y `npm run build:draft`.
- [ ] **Paso 5:** verificar con JS desactivado. En el panel del navegador, abrir la página sin scripts: deben verse el primer título, la primera portada y una banda, y los enlaces de piso deben bajar a su sección.
- [ ] **Paso 6:** commit `feat: secciones del taller y del cuarto`.

### Task 4: Rotación

**Archivos:**
- Crear: `src/scripts/rotate.ts`
- Modificar: `src/pages/index.astro`, para cargar el script con `<script>`
- Test: `tests/rotate.test.ts` (`// @vitest-environment happy-dom`)

**Interfaces:**
- Produce `startRotation(root: ParentNode, opts: { intervalMs: number; reducedMotion: boolean }): () => void`.
  - Cada `[data-rotate]` muestra un hijo a la vez y alterna el atributo `hidden`.
  - Salta los contenedores que tengan `data-paused`.
  - Devuelve una función que detiene la rotación.
  - `index.astro` la llama con `intervalMs: 3200` y `reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches`.

- [ ] **Paso 1:** escribir los tests que fallan, con temporizadores falsos.
  - Con 3 hijos, después de 3200 ms se ve el segundo, y después de 9600 ms vuelve al primero.
  - Con `reducedMotion: true`, después de 10 000 ms sigue visible el primero.
  - Con `data-paused`, no cambia.
  - Después de llamar a la función de parada, no cambia.
- [ ] **Paso 2:** correr `npm test -- rotate`. Se espera FAIL.
- [ ] **Paso 3:** implementar.
- [ ] **Paso 4:** correr `npm test` y se espera PASS. Después, en el navegador, ver que la PC, la TV y el parlante rotan.
- [ ] **Paso 5:** commit `feat: rotación de pantallas y parlante`.

### Task 5: El parlante con Spotify

**Archivos:**
- Crear: `functions/_lib/spotify.ts`, `functions/api/now-playing.ts`, `src/scripts/now-playing.ts`, `scripts/spotify-token.mjs`
- Modificar: `src/components/House.astro`, que suma un hijo `[data-live] hidden` al parlante; `src/pages/index.astro`
- Tests: `tests/spotify.test.ts`, `tests/now-playing.test.ts` (`// @vitest-environment happy-dom`)

**Interfaces:**
- Produce, en `functions/_lib/spotify.ts`:
  - `type NowPlaying = { playing: false } | { playing: true; title: string; artist: string; url: string }`
  - `interface SpotifyEnv { SPOTIFY_CLIENT_ID?: string; SPOTIFY_CLIENT_SECRET?: string; SPOTIFY_REFRESH_TOKEN?: string }`
  - `getNowPlaying(env: SpotifyEnv, fetchFn?: typeof fetch): Promise<NowPlaying>`. Nunca lanza un error.
  - Primero hace `POST https://accounts.spotify.com/api/token` con `grant_type=refresh_token` y Basic auth `id:secret`. Después hace `GET https://api.spotify.com/v1/me/player/currently-playing`.
- Produce `functions/api/now-playing.ts`: `onRequestGet`, que responde `Response.json(await getNowPlaying(env))` con `cache-control: public, max-age=30`.
- Produce, en `src/scripts/now-playing.ts`:
  - `applyNowPlaying(speaker: HTMLElement, data: NowPlaying): void`. Si suena algo, pone `data-paused` y muestra `[data-live]` con "título — artista". Si no, quita `data-paused` y oculta `[data-live]`.
  - `startNowPlaying(speaker: HTMLElement, intervalMs = 30000): void`. Si el `fetch` falla, cuenta como `{ playing: false }`.

- [ ] **Paso 1:** escribir los tests que fallan en `tests/spotify.test.ts`, con un `fetchFn` simulado.
  - Un 204 en currently-playing da `{ playing: false }`.
  - Un 200 con `is_playing: true`, `currently_playing_type: 'track'` y `item` (nombre, artistas, `external_urls.spotify`) da `playing: true` con título, artistas unidos por ", " y la URL.
  - `currently_playing_type: 'episode'` o `'ad'`, o `item: null`, dan `{ playing: false }`.
  - Un 401 en el token, un 429, o un `fetchFn` que lanza error, dan `{ playing: false }`.
  - Si falta cualquier variable de entorno, no se llama a `fetchFn` y da `{ playing: false }`.
  - El JSON serializado del resultado nunca contiene el `refresh_token` ni el `access_token`.
- [ ] **Paso 2:** escribir los tests que fallan en `tests/now-playing.test.ts`.
  - `applyNowPlaying` con `playing: true` pone `data-paused` y muestra "Bohemian — Queen".
  - Con `playing: false`, vuelve el estado de rotación.
- [ ] **Paso 3:** correr `npm test`. Se espera FAIL.
- [ ] **Paso 4:** implementar los tres módulos.
- [ ] **Paso 5:** correr `npm test` y se espera PASS.
- [ ] **Paso 6:** escribir `scripts/spotify-token.mjs`, el script para obtener el token.
  - Lee `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET` del entorno.
  - Levanta `http://127.0.0.1:8888/callback`, imprime la URL de autorización con scope `user-read-currently-playing`, canjea el código e imprime el refresh token.
  - **Lo corre Bryan**, no el agente: las credenciales son suyas.
- [ ] **Paso 7 (Bryan):** crear la app en developer.spotify.com con el redirect `http://127.0.0.1:8888/callback`, correr el script y guardar las tres variables en `.dev.vars` (ignorado por git).
  - Spotify cambió las condiciones del modo desarrollo en 2025 y 2026 (sin confirmar). Si no deja crear la app o pide Premium, se pasa al plan B, Last.fm, y se vuelve a la spec.
- [ ] **Paso 8:** verificar en local. Correr `npm run build:draft && npx wrangler pages dev dist`.
  - Con música sonando, el parlante muestra la canción en 30 s o menos.
  - Pausada, vuelve a rotar.
  - Sin `.dev.vars`, la página carga, rota y `/api/now-playing` responde `{"playing":false}`.
- [ ] **Paso 9:** commit `feat: parlante con lo que suena en spotify`.

### Task 6: Pulido y publicación

**Archivos:**
- Crear: `public/og.png`, `public/favicon.svg` (un muñequito)
- Modificar: `src/layouts/Base.astro` y `astro.config.mjs`, para fijar el `site` real

- [ ] **Paso 1:** hacer la revisión de `web-standards` y `design:accessibility-review` sobre la página y corregir lo que salga.
  - Objetivo de Lighthouse en móvil: rendimiento ≥ 90, accesibilidad ≥ 95, SEO ≥ 95.
  - Usar el skill `web-perf` si el rendimiento no llega.
- [ ] **Paso 2:** generar `og.png` (1200×630): una captura de la casa a 1200 px de ancho tomada en el panel del navegador.
- [ ] **Paso 3 (Bryan):** completar el contenido en `src/data/site.ts`.
  - Qué hizo en cada proyecto de CorAll y las personas de cada uno.
  - La URL de LinkedIn.
  - Las portadas que quiera mostrar, en `src/assets/covers/`. El agente puede bajarlas de la tienda oficial con un OK explícito por archivo.
- [ ] **Paso 4:** correr `npm run build`. Debe terminar sin errores y el detector no debe encontrar corchetes.
- [ ] **Paso 5 (Bryan, con OK explícito):**
  - Correr `npx wrangler login`.
  - Elegir el nombre del proyecto de Pages y correr `npx wrangler pages project create <nombre>` y `npx wrangler pages deploy dist`.
  - Cargar los tres secretos de Spotify con `npx wrangler pages secret put <NOMBRE> --project-name <nombre>`.
- [ ] **Paso 6:** verificar en producción. La URL `*.pages.dev` carga, `/api/now-playing` responde y la vista previa de LinkedIn (Post Inspector) muestra el título y `og.png`.
- [ ] **Paso 7:** commit `chore: og, favicon y publicación`. Crear el repositorio público en GitHub y hacer push solo con el OK de Bryan.
