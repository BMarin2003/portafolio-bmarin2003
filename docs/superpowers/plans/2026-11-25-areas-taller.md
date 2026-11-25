# Las áreas como taller — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir la sección de áreas de `/` y `/en/` en «la mesa de trabajo»: seis pestañas-monigote nativas sin JavaScript y un panel con herramientas, uso por proyecto, «En la obra» y la formación del área.

**Architecture:** Una función pura calcula en qué proyectos se usó cada herramienta a partir del `stack` de los proyectos. `Oficios.astro` dibuja radios + labels + paneles con estilos propios en `src/styles/areas.css`.

**Tech Stack:** Astro 7, CSS (`:checked ~`, `color-mix`), TypeScript, Vitest + happy-dom + Astro Container.

**Spec:** `docs/superpowers/specs/2026-11-25-areas-taller-design.md`. Boceto aprobado: artboard `AreasA.dc.html` (una copia queda en la carpeta del plan al ejecutar).

## Global Constraints

- Áreas, herramientas y certificado sin cambios (`oficios` / `oficiosEn` de `src/data/site*.ts`).
- El uso por herramienta sale solo del `stack` de `corall`; nada inventado. Proyectos en orden cronológico (`cronologico` de `src/lib/periodo.ts`).
- `/` no carga más JavaScript (hoy: 2 `<script`, ninguno con pixi).
- Pestañas: `<input type="radio">` + `<label>`; la primera (Planificación y método) abierta al cargar; teclado con flechas; foco visible.
- Con `prefers-reduced-motion: reduce`, monigotes quietos.
- Lighthouse móvil de `/` y `/en/`: rendimiento, accesibilidad y SEO 100.
- Textos nuevos exactos (es / en): «En la obra:» / «Used on:»; «El número es en cuántos proyectos la usé.» / «The number is how many projects I used it on.»; «Herramientas de trabajo diario; todavía sin un proyecto de CorAll asociado en el recorrido.» / «Everyday tools; not yet tied to a CorAll project on the timeline.»

## Review Focus

1. Sin CSS o con lector de pantalla: cada área se lee como un grupo de radios con su nombre, y el panel elegido se anuncia con su título.
2. Teclado: Tab entra al grupo, las flechas cambian de área y el panel cambia con ellas.
3. 375 px: dos filas de tres pestañas, sin scroll horizontal.
4. Área sin proyectos asociados (Infraestructura, Documentación…): muestra el texto de «trabajo diario», nunca una línea vacía.
5. «Bun / Elysia» cuenta los proyectos que usaron Bun o Elysia, sin contar dos veces el mismo proyecto.

---

### Task 1: Uso por herramienta y textos

**Files:**
- Create: `src/lib/uso.ts`
- Modify: `src/i18n.ts` (`t[lang].pro.areas`: `enLaObra`, `numero`, `sinProyectos`)
- Test: `tests/uso.test.ts`

**Interfaces:**
- Produces:
  - `export function proyectosDe(tag: string, proyectos: readonly { name: string; desde: string; stack: string[] }[]): string[]` — nombres, en orden cronológico, de los proyectos cuyo `stack` contiene alguna parte de `tag` separada por `/` (con espacios recortados), sin repetir.
  - `export function proyectosDelArea(tags: string[], proyectos: …): string[]` — unión ordenada cronológicamente de `proyectosDe` de cada tag.
  - `t[lang].pro.areas = { enLaObra, numero, sinProyectos }` con los textos exactos de Global Constraints.

- [ ] **Step 1: Write the failing tests** en `tests/uso.test.ts` (con los datos reales de `corall`):
  - `proyectosDe('React', corall)` → `['Totem Multimedia', 'CCAE', 'Corall-ERP', 'MaqinPro', 'Comphill']`.
  - `proyectosDe('Bun / Elysia', corall)` → `['Totem Multimedia', 'Corall-ERP', 'MaqinPro', 'Comphill']` (cada proyecto una vez).
  - `proyectosDe('Playwright', corall)` → `['MaqinPro']`; `proyectosDe('Sentry', corall)` → `[]`.
  - `proyectosDelArea(['Drizzle', 'Playwright'], corall)` → `['Corall-ERP', 'MaqinPro']`.
  - `proyectosDelArea(['Obsidian', 'Notion'], corall)` → `[]`.
- [ ] **Step 2: Run** `npx vitest run tests/uso.test.ts` → FAIL.
- [ ] **Step 3: Implement** `src/lib/uso.ts` y los textos en `src/i18n.ts`.
- [ ] **Step 4: Run** `npx vitest run` → PASS.
- [ ] **Step 5: Commit** `feat: en qué proyectos se usó cada herramienta`

### Task 2: La mesa de trabajo

**Files:**
- Create: `src/styles/areas.css`
- Modify: `src/components/pro/Oficios.astro`, `src/styles/global.css` (quitar `.oficio`, `.oficio-body`, `.oficio h3`, `.tags`, `.tags li` si quedan sin uso)
- Test: `tests/pro.test.ts`, `tests/en.test.ts`

**Interfaces:**
- Consumes: `proyectosDe`, `proyectosDelArea`, `t[lang].pro.areas` (Task 1); `contenido(lang).oficios` y `contenido(lang).corall`; `Sprite.astro`.
- Produces: en `#oficios`, un `<fieldset>` (o `role="radiogroup"` con nombre) con 6 `input[type=radio][name=area]` y sus `<label>`, y 6 paneles `.panel-area` (cada uno con `h3` = área, lista de herramientas, línea «En la obra» o «trabajo diario», y `cert` cuando hay).

- [ ] **Step 1: Update the tests** en `tests/pro.test.ts` (y lo mismo en inglés en `tests/en.test.ts`):
  - `seis pestañas nativas`: 6 `input[type="radio"][name="area"]`, cada una con un `label[for]` que dice su área; la primera tiene `checked`.
  - `cada panel tiene su área, herramientas y uso`: los `h3` de `.panel-area` son las áreas en orden; los `li` son `o.tags`; cada herramienta con proyectos lleva el número `proyectosDe(tag).length` y los nombres en `title`.
  - `En la obra`: el panel de Backend dice «En la obra: Totem Multimedia, Corall-ERP, MaqinPro, Comphill»; el de Documentación dice el texto de «trabajo diario».
  - `el certificado queda en Planificación`: se conserva el test existente del programa de Metodologías Ágiles.
  - `sin JavaScript nuevo`: `/` sigue con a lo sumo 2 `<script`.
- [ ] **Step 2: Run** `npx vitest run tests/pro.test.ts tests/en.test.ts` → FAIL.
- [ ] **Step 3: Implement** según `AreasA.dc.html`: radios visualmente ocultos pero enfocables (no `display:none`), labels en fila sobre la mesa (borde de madera), la pestaña elegida se une al panel; el monigote elegido usa `anim="action"` (o la fila de trabajo) y los demás reposan; `:focus-visible` en la pestaña; ≤ 760 px en 3 columnas. Los paneles no elegidos con `display:none` (fuera del árbol de accesibilidad); el elegido visible.
- [ ] **Step 4: Run** `npx vitest run` y `npm run build` → PASS; `dist/index.html` con 2 `<script` y sin pixi.
- [ ] **Step 5: Check in the browser** (`astro preview --port 4322`, nunca 4321): `/` a 1440 y 375 (o su equivalente con CDP), `/en/` a 1440; Tab + flechas cambian de panel; `scrollWidth` sin desborde; movimiento reducido.
- [ ] **Step 6: Commit** `feat: las áreas como mesa de trabajo`

### Task 3: Verificación

- [ ] **Step 1:** Lighthouse móvil 3 veces en `/` y `/en/` → 100 en rendimiento, accesibilidad y SEO.
- [ ] **Step 2:** Capturas de la sección a 1440 y 375 px para que Bryan apruebe; parar el servidor.
