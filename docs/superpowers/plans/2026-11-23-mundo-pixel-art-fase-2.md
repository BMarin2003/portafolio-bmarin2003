# Mundo pixel art · Fase 2 (página profesional): plan de construcción

> **Para agentes:** sub-skill requerido: superpowers:subagent-driven-development o superpowers:executing-plans, tarea por tarea. Los pasos usan casillas (`- [ ]`).

**Meta:** que `/` sea la página profesional del boceto aprobado. La cuadrilla de oficios pixel art acompaña cada sección, animada solo con CSS. El contenido personal se muda a `/casa` en su versión actual, hasta que la fase 3 la reemplace por la escena con PixiJS.

**Arquitectura:**
- Un componente `Sprite.astro` lee, al compilar, la definición del sprite en `art/sprites/` y pinta un `<span>` con la hoja PNG de fondo.
- Las animaciones son CSS con `steps()`, a partir de variables CSS.
- Las secciones de `/` son componentes chicos que leen `src/data/site.ts`.
- No se agrega JavaScript de cliente a `/` más allá del que ya existe.

**Stack:** Astro 7 y CSS. Sin dependencias nuevas.

**Specs:**
- Diseño: [`docs/superpowers/specs/2026-11-18-mundo-pixel-art-design.md`](../specs/2026-11-18-mundo-pixel-art-design.md).
- Contrato de sprites: [`art/SPEC.md`](../../../art/SPEC.md).
- [`SPEC.md`](../../../SPEC.md) y [`architecture.md`](../../../architecture.md).
- **Referencia visual aprobada:** [`docs/reference/boceto-pro.html`](../../reference/boceto-pro.html). Está escrita para el runtime del lienzo de diseño (`<x-dc>`, `{{…}}`, `<sc-for>`, `DCLogic`): se porta su marcado y su CSS, no su runtime. Sus clases `.spr`, `.x3`, `.act` y `@keyframes play` son la técnica que se pasa a `Sprite.astro`.

## Restricciones globales

- **Colores:**
  - Fondo `#11151B`, paneles `#161B23`, fondo de la franja final `#0C0F14`.
  - Texto `#E6E3DD`, secundario `#B3B9C2`, apagado `#8F97A3`.
  - Líneas `#262C36` y `#39414E`.
  - Acento único `#D9A55B`.
  - Fuentes Schibsted Grotesk y DM Mono desde `@fontsource` (ya instaladas).
- **Sprites:** siempre a escala entera, con `image-rendering: pixelated`. URLs `/sprites/<name>.png`. La hoja tiene una fila por animación, en el orden de las claves, y los cuadros de izquierda a derecha (`art/SPEC.md`).
- **Nunca un nombre de herramienta en la página:** ni hallmark, ni ponytail, ni superpowers, ni safety-net, ni Obsidian como personaje. La cuadrilla son los 6 oficios: Capataz, Maestro de obra, Decorador, Electricista, Doble de riesgo y Archivista. Obsidian sí puede aparecer como etiqueta de tecnología del Archivista.
- **`prefers-reduced-motion: reduce`** detiene todas las animaciones de sprites y de paseo.
- **Sin JavaScript** se lee todo el contenido. Los sprites son decorativos (`aria-hidden="true"`).
- **Contraste mínimo de 4.5:1.**
- **Lighthouse en móvil:** rendimiento ≥ 90, accesibilidad ≥ 95 y SEO ≥ 95.
- **Sin scroll horizontal a 375 px.**
- **Contenido real:**
  - Los textos de los proyectos y los retos se toman tal cual de `src/data/site.ts`.
  - Lo que falta va entre corchetes. La guardia de `npm run build` bloquea el deploy hasta que Bryan lo complete; eso es lo esperado.
- **`/casa` existe desde esta fase** con el contenido personal actual. La fase 3 la reemplaza.

## Foco de revisión

1. **Nombre de sprite o de animación inexistente:** el build falla con un mensaje que nombra el sprite y la animación. Nunca debe salir un `<span>` vacío. Lo cubre la Task 1.
2. **`prefers-reduced-motion`:** ningún sprite ni paseo se anima. Lo cubre la Task 1 (regla CSS) y la verificación de la Task 5.
3. **Se cuela un nombre de herramienta:** el HTML de `/` no contiene `hallmark`, `ponytail`, `superpowers`, `safety-net` ni `cc-safety-net`. Lo cubre la Task 3.
4. **Celular de 375 px:** la escena de la obra y la puerta a la casa no generan scroll horizontal. Lo cubre la Task 5.
5. **Enlaces viejos a `/#cuarto` y `/#taller`:** la página carga igual, sin errores, y el menú enlaza a `/casa`. Lo cubre la Task 3.

---

### Task 1: Componente `Sprite`

**Archivos:**
- Crear: `src/components/Sprite.astro`, `src/lib/sprite-meta.ts`, `src/styles/sprites.css`
- Test: `tests/sprite.test.ts`

**Interfaces:**
- Consume los `art/sprites/*.ts`: `export default` es un `SpriteDef` (`art/lib/sprite.ts`).
- Produce, en `src/lib/sprite-meta.ts`: `spriteMeta(name: string, anim: string): { width: number; height: number; row: number; frames: number }`.
  - Usa `import.meta.glob('../../art/sprites/*.ts', { eager: true })`.
  - `row` es el índice de la animación en el orden de las claves.
  - Si el sprite no existe, lanza `Error("sprite '<name>' no existe")`. Si la animación no existe, lanza `Error("sprite '<name>' no tiene la animación '<anim>'")`.
- Produce `Sprite.astro` con props `{ name: string; anim: string; scale?: 2 | 3 | 4 | 5; paused?: boolean; class?: string; style?: string }`:
  - Escala por defecto 3.
  - Con `paused` o con un solo cuadro, muestra el cuadro 0 sin animación.
  - Renderiza `<span class="spr …" aria-hidden="true" style="--s:…;--row:…;--n:…;--fw:…;--fh:…;background-image:url(/sprites/<name>.png)">`.
- Produce, en `src/styles/sprites.css`, la clase `.spr`, `@keyframes spr-play` y la regla `@media (prefers-reduced-motion: reduce)` que apaga la animación.
  - El ancho es `--fw × --s`, el alto `--fh × --s` y el tamaño del fondo `(--fw × 4) × --s`. El ancho de la hoja es el de la animación más larga, y para estos sprites es de 4 cuadros.
  - Para no fijar ese 4, el componente pasa también `--cols` (el máximo de cuadros entre las animaciones del sprite) y el tamaño del fondo usa `--cols`.

- [ ] **Paso 1:** escribir los tests que fallan en `tests/sprite.test.ts`. Usan la Container API, como `tests/sections.test.ts`.
  - `spriteMeta('capataz', 'action')` da `{ width: 16, height: 16, row: 2, frames: 3 }`.
  - `spriteMeta('bryan', 'sit')` da `{ width: 16, height: 24, row: 2, frames: 1 }`.
  - `spriteMeta('nadie', 'walk')` lanza `"sprite 'nadie' no existe"`.
  - `spriteMeta('capataz', 'volar')` lanza `"sprite 'capataz' no tiene la animación 'volar'"`.
  - `Sprite` con `name="capataz" anim="walk" scale={4}` renderiza un `span` con `aria-hidden="true"`, `url(/sprites/capataz.png)`, `--s:4`, `--row:1`, `--n:4` y `--cols:4`.
  - Con `paused`, no tiene la clase de animación (`spr-anim`).
  - `src/styles/sprites.css` contiene `prefers-reduced-motion` y `animation: none` (se lee como texto).
- [ ] **Paso 2:** correr `npx vitest run tests/sprite.test.ts`. Se espera FAIL.
- [ ] **Paso 3:** implementar los tres archivos. Importar `sprites.css` desde `src/layouts/Base.astro`.
- [ ] **Paso 4:** correr `npx vitest run tests/sprite.test.ts` (PASS) y después `npm test`, todo en verde.
- [ ] **Paso 5:** commit `feat: componente Sprite animado con CSS`.

### Task 2: Datos de los oficios y textos de la página

**Archivos:**
- Modificar: `src/data/site.ts`
- Test: `tests/data.test.ts`

**Interfaces:**
- Produce, en `src/data/site.ts`:
  - `type Oficio = { sprite: string; oficio: string; area: string; tags: string[] }`
  - `export const oficios: Oficio[]`
  - En `CorallProject` se suman `sprite: string` (el oficio que lo acompaña en la tarjeta) y `area: string` (la etiqueta corta de la tarjeta).
  - `export const comoTrabajo: string`
- Se borra `crew` y el tipo `CrewMember`. Las tareas 3 y 4 dejan de usarlos.
- **Valores exactos:**
  - Oficios, en este orden:
    - `capataz`, `Capataz`, `Planificación y método`, `['PMBOK', 'ITIL', 'Scrum', 'Jira', 'Trello']`
    - `maestro`, `Maestro de obra`, `Backend y datos`, `['Java / Spring', 'Bun / Elysia', 'Node.js', 'FastAPI', 'PostgreSQL', 'MySQL']`
    - `decorador`, `Decorador`, `Frontend y diseño`, `['React', 'Angular', 'Astro', 'Ant Design', 'Tailwind']`
    - `electricista`, `Electricista`, `Infraestructura y despliegue`, `['Docker', 'Cloudflare', 'AWS', 'Nginx', 'Terraform', 'Jenkins']`
    - `doble`, `Doble de riesgo`, `Calidad y seguridad`, `['Pruebas e2e', 'Caja negra', 'Caja blanca', 'Postman']`
    - `archivista`, `Archivista`, `Documentación y conocimiento`, `['Obsidian', 'Notion', 'Markdown']`
  - `sprite` y `area` de cada proyecto:
    - Totem Multimedia: `maestro`, `PRIMER PROYECTO`
    - CCAE: `decorador`, `APORTE PUNTUAL`
    - MaqinPro: `capataz`, `PLATAFORMA · A MI CARGO`
    - Comphill: `electricista`, `CIERRE DE PROYECTO`
    - Corall-ERP: `archivista`, `ERP INTERNO`
  - `comoTrabajo = '[Tu párrafo: cómo trabajas con Claude, dónde la IA no alcanza y lo resuelves tú, y cómo aprendes usándola.]'`. Es un hueco a propósito, que bloquea el deploy hasta que Bryan lo escriba.

- [ ] **Paso 1:** escribir los tests que fallan en `tests/data.test.ts`.
  - `oficios.map((o) => o.sprite)` es `['capataz', 'maestro', 'decorador', 'electricista', 'doble', 'archivista']`.
  - Cada `sprite` de `oficios` y de `corall` existe en `art/sprites/` (con `spriteMeta(name, 'idle')`, que no debe lanzar).
  - Ningún `oficio` ni ningún `area` contiene `hallmark`, `ponytail`, `superpowers`, `safety` ni `obsidian` (sin distinguir mayúsculas).
- [ ] **Paso 2:** correr `npx vitest run tests/data.test.ts`. Se espera FAIL.
- [ ] **Paso 3:** implementar los cambios en `site.ts`.
  - Lo que todavía use `crew` (`Taller.astro`, `House.astro` y sus tests) se rompe a propósito. Esta tarea **solo** cambia datos y sus tests; para que `npm test` siga en verde, se marcan con `it.skip` los tests de `crew` en `tests/sections.test.ts` y `tests/house.test.ts`, con el comentario `// fase 2: la Task 3 reemplaza este componente`.
  - `npm run build:draft` puede fallar hasta la Task 3, y se anota en el reporte.
- [ ] **Paso 4:** correr `npm test`, todo en verde salvo los tests marcados.
- [ ] **Paso 5:** commit `feat: oficios de obra y textos de la página profesional`.

### Task 3: La página profesional y `/casa` provisoria

**Archivos:**
- Crear:
  - `src/components/pro/Hero.astro`, `Proyectos.astro`, `Oficios.astro`, `ComoTrabajo.astro`, `PuertaCasa.astro`
  - `src/pages/casa.astro`
- Modificar: `src/pages/index.astro` y `src/styles/global.css`
- Borrar: `src/components/House.astro`, `src/components/Taller.astro`, `src/components/Bot.astro` y los tests que solo los cubrían. `Cuarto.astro`, `People.astro` y sus tests se quedan.
- Test: `tests/pro.test.ts`, que reemplaza los casos de `tests/sections.test.ts` y `tests/house.test.ts` que ya no aplican.

**Interfaces:**
- Consume `Sprite` (Task 1), `oficios`, `corall` y `comoTrabajo` (Task 2), además de `People.astro`, `peopleGroups`, `links` y `Cuarto.astro`.
- **`/`** porta `docs/reference/boceto-pro.html`, sección por sección:
  1. **Encabezado:**
     - Tu sprite en reposo y tu nombre.
     - Enlaces a `#proyectos`, `#oficios` y `#ia`, más `links.github` y `links.linkedin`.
     - Un botón «la casa →» que enlaza a `/casa`.
  2. **`Hero`:**
     - La etiqueta en mono, el `h1` «Construyo sistemas con una cuadrilla de oficios.», el párrafo y los dos botones.
     - La ventana «LA OBRA · EN VIVO» con el andamio, los 6 oficios en `action` a escala 4 y Bryan en `idle` en el centro.
  3. **`Proyectos`:** `id="proyectos"`, un `article` por proyecto de `corall`. Cada uno lleva su `area`, el nombre, el sprite en `action` a escala 3, `did` completo y la frase de personas (`People`). Si hay `challenge`, va «El reto:» y el texto.
  4. **`Oficios`:** `id="oficios"`, un `article` por oficio, con el sprite en `action` a escala 4, el oficio, el área y las etiquetas.
  5. **`ComoTrabajo`:** `id="ia"`, con el título «Con IA, sin dejar de aprender», el texto de `comoTrabajo`, el doble en `action` y Bryan en `roll`.
  6. **`PuertaCasa`:** «DESPUÉS DE LAS 6», «La obra cierra. La casa se enciende.», Bryan caminando (`walk` dentro de un contenedor con la animación de paseo) y la puerta. Todo es un `<a href="/casa">` con texto visible «entrar a la casa →».
  7. **Pie:** «Bryan Marin Yupanqui · Trujillo, Perú» y «Construido junto a Claude (Anthropic) · pixel art original».
- **`/casa` provisoria:**
  - `Base` con `title` «La casa de Bryan» y un enlace «← volver a la obra» a `/`.
  - Un `h1` «La casa, después de las 6» y `<Cuarto />` tal como está, con la rotación y el parlante de Spotify.
  - Los `<script>` de rotación y del parlante se mueven de `index.astro` a `casa.astro`.
  - El pie es el mismo de `/`.
- El script del parlante ya no va en `/`. `/` queda sin JavaScript propio.

- [ ] **Paso 1:** escribir los tests que fallan en `tests/pro.test.ts`. Renderizan `index.astro` y `casa.astro` con la Container API, con `astroConfig.site` como en `sections.test.ts`.
  - `/` tiene `#proyectos` con 5 `article`, cuyos `h3` siguen el orden de `corall`, y `#oficios` con 6 `article`, cuyos títulos siguen el orden de `oficios`.
  - Cada tarjeta de proyecto contiene un `.spr` con `url(/sprites/<p.sprite>.png)`.
  - El HTML de `/` no contiene (sin distinguir mayúsculas) `hallmark`, `ponytail`, `superpowers` ni `safety-net`.
  - `/` tiene un `<a href="/casa">` con el texto «entrar a la casa →» y otro con «la casa →».
  - `/` no carga `rotate` ni `now-playing`: ningún `<script>` los menciona.
  - El pie contiene «Construido junto a Claude (Anthropic)».
  - `/casa` contiene `[data-speaker]` y los cuatro `data-card` de `Cuarto`, y un enlace a `/`.
  - Todo `.spr` tiene `aria-hidden="true"`.
- [ ] **Paso 2:** correr `npx vitest run tests/pro.test.ts`. Se espera FAIL.
- [ ] **Paso 3:** implementar.
  - El CSS que solo usaban la casa y el taller viejos se borra de `global.css`.
  - El que necesitan las secciones nuevas sale del boceto, usando las variables existentes de `global.css`.
  - Se sacan los `it.skip` de la Task 2: o se borran los tests de componentes eliminados, o se pasan a `pro.test.ts`.
- [ ] **Paso 4:** correr `npm test` (todo en verde, sin tests saltados) y `npm run build:draft` (sin errores).
- [ ] **Paso 5:** commit `feat: página profesional con la cuadrilla y la casa provisoria`.

### Task 4: Specs al día

**Archivos:**
- Modificar: `SPEC.md`, `architecture.md`, `art/SPEC.md` (solo si cambia algo del contrato)

- [ ] **Paso 1:** cargar el skill `project-specs` y actualizar `SPEC.md`.
  - **Principios:** dos páginas (`/` profesional, `/casa` personal) y el mundo pixel art original. La cuadrilla son oficios de obra, nunca nombres de herramientas. Esto reemplaza «una casa, dos pisos» y «Claude con crédito» en lo que se contradiga.
  - **Capacidades:**
    - `/`: los proyectos con su oficio, los 6 oficios con sus etiquetas, «Con IA, sin dejar de aprender» y la puerta a la casa.
    - `/casa` hoy: el cuarto con la PC, la TV, el parlante y la mesa de rol, que la fase 3 convierte en escena.
- [ ] **Paso 2:** en `architecture.md`, sumar a Topología «`Sprite.astro` lee `art/sprites` al compilar y anima con CSS; `/` no carga JavaScript propio». En Invariantes: «`/` no carga motor de juego ni scripts de cliente propios».
- [ ] **Paso 3:** correr `node ~/.claude/skills/project-specs/scripts/validate-specs.mjs .`. Debe dar 0 errores.
- [ ] **Paso 4:** commit `docs: specs de la página profesional y la casa`.

### Task 5: Verificación en el navegador, imagen para compartir y Lighthouse (controlador y subagente)

**Archivos:**
- Modificar: `public/og.png` (captura nueva de `/`) y `src/layouts/Base.astro` (texto alternativo de la imagen)

- [ ] **Paso 1 (controlador):** en el panel del navegador con `npm run dev`, a 1440 y a 375 px:
  - En 375, `document.documentElement.scrollWidth <= 375`.
  - Los sprites se ven nítidos y animados.
  - Con `prefers-reduced-motion` emulado, nada se mueve.
  - Comparar con el boceto aprobado.
- [ ] **Paso 2:** capturar `og.png` de 1200×630 con el Chrome local en modo headless, encuadrando la portada con la obra, igual que en la fase anterior.
  - Cambiar `imageAlt` en `Base.astro` a «Bryan Marin y su cuadrilla de oficios pixel art trabajando en la obra».
- [ ] **Paso 3:** correr Lighthouse en móvil sobre `astro preview` con el Chrome local. Metas: rendimiento ≥ 90, accesibilidad ≥ 95 y SEO ≥ 95. Corregir lo que falte.
- [ ] **Paso 4:** commit `chore: imagen para compartir y verificación de la página profesional`.
- [ ] **Paso 5 (Bryan, antes del merge):**
  - Confirmar las etiquetas de cada oficio, incluido si van PMBOK e ITIL.
  - Escribir el párrafo de `comoTrabajo`.
  - Hasta entonces `npm run build` falla a propósito por la guardia de corchetes y no se mergea.
