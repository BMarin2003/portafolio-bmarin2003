# Proyectos como recorrido — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir la sección Proyectos de `/` y `/en/` en una línea de tiempo cronológica («el recorrido»): período, commits, rol, resumen y etiquetas a la vista, el detalle en `<details>`, y movimiento ligado al scroll solo con CSS.

**Architecture:** Los datos nuevos (período, commits, resumen, tecnologías) viven en `src/data/site.ts`, con el resumen en inglés en `site.en.ts`. Funciones puras en `src/lib/periodo.ts` formatean el período y ordenan por fecha. `Proyectos.astro` dibuja el recorrido con estilos propios en `src/styles/proyectos.css`.

**Tech Stack:** Astro 7, CSS (`animation-timeline: view()`/`scroll()` con `@supports`), TypeScript, Vitest + happy-dom + Astro Container.

**Spec:** `docs/superpowers/specs/2026-11-24-proyectos-recorrido-design.md`. Boceto aprobado: lienzo «Portafolio · 3 bocetos», artboard `ProyB.dc.html` (una copia queda en la carpeta del plan al ejecutar).

## Global Constraints

- Datos exactos de la tabla de la spec (desde, hasta, commits, tecnologías) y las frases de resumen en español tal cual; nada inventado.
- `did`, `challenge` y las personas no cambian; siguen en los dos idiomas.
- `/` no carga más JavaScript: el movimiento es CSS. `<details>` funciona sin scripts.
- Sin soporte de animaciones ligadas al scroll, y con `prefers-reduced-motion: reduce`, todo queda visible y quieto.
- Línea, nodos, puntos y monigotes son decorativos (`aria-hidden`); cada proyecto es un `<article>` con su `h3`.
- Lighthouse móvil de `/` y `/en/`: rendimiento, accesibilidad y SEO 100 (como hoy).

## Review Focus

1. Navegador sin `animation-timeline` (Firefox, Safari viejo): ninguna tarjeta queda invisible ni desplazada.
2. Sin JavaScript o con lector de pantalla: el texto del detalle sigue en el DOM y el `<summary>` se abre con teclado y tiene foco visible.
3. 375 px: una sola columna, línea a la izquierda, sin scroll horizontal.
4. Proyecto en curso (sin `hasta`): se lee «… – hoy» / «… – present», nunca «undefined».
5. Movimiento reducido: Bryan quieto y tarjetas visibles desde el inicio.

---

### Task 1: Datos y período

**Files:**
- Create: `src/lib/periodo.ts`
- Modify: `src/data/site.ts` (tipo `CorallProject` y los 5 proyectos), `src/data/site.en.ts` (resumen en inglés), `src/i18n.ts` (textos nuevos)
- Test: `tests/periodo.test.ts`, `tests/data.test.ts`, `tests/en.test.ts`

**Interfaces:**
- Produces:
  - En `CorallProject`: `desde: string` (`'AAAA-MM'`), `hasta?: string` (`'AAAA-MM'`; ausente = en curso), `commits: number`, `resumen: string`, `stack: string[]`.
  - `export function periodo(desde: string, hasta: string | undefined, lang: Lang): string` en `src/lib/periodo.ts`.
  - `export function cronologico<T extends { desde: string }>(xs: readonly T[]): T[]` (copia ordenada por `desde`, estable).
  - En `t[lang].pro`: `proyectosLede`, `detalle` («qué hice y con quién» / «what I did and with whom»), `commits` («commits» en los dos idiomas).

- [ ] **Step 1: Write the failing tests** en `tests/periodo.test.ts`:
  - `periodo('2026-02', '2026-04', 'es') === 'feb – abr 2026'` y en inglés `'Feb – Apr 2026'`.
  - `periodo('2026-03', '2026-03', 'es') === 'mar 2026'`.
  - `periodo('2026-04', undefined, 'es') === 'abr 2026 – hoy'` y en inglés `'Apr 2026 – present'`.
  - `periodo('2025-11', '2026-02', 'es') === 'nov 2025 – feb 2026'`.
  - `cronologico` ordena `[{desde:'2026-08'},{desde:'2026-02'},{desde:'2026-04'}]` a `['2026-02','2026-04','2026-08']` y no muta la entrada.
  - en `tests/data.test.ts`: los 5 proyectos traen exactamente los valores de la tabla de la spec (desde, hasta, commits, stack); `cronologico(corall).map(p => p.name)` es `['Totem Multimedia','CCAE','Corall-ERP','MaqinPro','Comphill']`; cada `resumen` es el de la spec.
  - en `tests/en.test.ts`: `corallEn` conserva `desde`, `hasta`, `commits` y `stack` de `corall`, y su `resumen` difiere del español.
- [ ] **Step 2: Run** `npx vitest run tests/periodo.test.ts tests/data.test.ts tests/en.test.ts` → FAIL.
- [ ] **Step 3: Implement.** Meses abreviados: `es` = ene feb mar abr may jun jul ago sep oct nov dic; `en` = Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec; separador ` – ` (raya con espacios). Mismo año: el año solo al final. En `site.en.ts`, el `resumen` en inglés de cada proyecto (copia exacta):
  - Totem Multimedia: «My first project at CorAll: I built features and presented each step forward to the client.»
  - CCAE: «I designed a couple of interfaces for the extranet of an arbitration management system.»
  - Corall-ERP: «The ERP CorAll uses to organize its work; I gathered each area's processes before turning them into modules.»
  - MaqinPro: «The platform for a machinery workshop and its customer portal. Halfway through, it became my responsibility.»
  - Comphill: «With Luis Mostacero, I closed out the operations system of a wholesale market that someone else had built.»
  - `proyectosLede`: es «Desde que llegué a CorAll, en orden: lo que hice en cada obra y con quién.»; en «Since I joined CorAll, in order: what I did on each project and with whom.»
- [ ] **Step 4: Run** `npx vitest run` → PASS.
- [ ] **Step 5: Commit** `feat: período, commits, resumen y tecnologías de cada proyecto`

### Task 2: El recorrido

**Files:**
- Create: `src/styles/proyectos.css`
- Modify: `src/components/pro/Proyectos.astro`, `src/styles/global.css` (quitar `.proyecto`, `.proyecto-head`, `.proyecto h3`, `.proyecto p` si quedan sin uso)
- Test: `tests/pro.test.ts`, `tests/en.test.ts`

**Interfaces:**
- Consumes: `cronologico`, `periodo`, los campos nuevos de `CorallProject` y `t[lang].pro.{proyectosLede,detalle,commits,reto}` (Task 1); `Sprite.astro`; `People.astro`.
- Produces: `#proyectos` con `<p>` de entradilla, un contenedor `.recorrido` y un `<article class="hito">` por proyecto en orden cronológico, cada uno con `h3`, `.periodo`, `.commits`, `.resumen`, una lista `.stack` y un `<details>` con el `did`, la frase de personas y `[data-challenge]`.

- [ ] **Step 1: Update the tests** en `tests/pro.test.ts`:
  - `un article por proyecto, en orden cronológico`: los `h3` de `#proyectos article` son `cronologico(corall).map(p => p.name)`.
  - `cada proyecto muestra período, commits, resumen y tecnologías`: para cada uno, el texto del article contiene `periodo(p.desde, p.hasta, 'es')`, `` `${p.commits} commits` ``, `p.resumen`, y los `li` de `.stack` son `p.stack`.
  - `el detalle está en un details`: cada article tiene un `details > summary` con «qué hice y con quién», y el `did`, la frase de personas y `[data-challenge]` (cuando hay reto) están dentro del `details`.
  - Los tests de «El reto» y de personas existentes se adaptan al orden cronológico; en `tests/en.test.ts`, lo mismo con `corallEn`, «what I did and with whom» y «… – present» para MaqinPro.
  - `línea y monigotes decorativos`: `.recorrido` tiene la línea y los nodos con `aria-hidden="true"`.
- [ ] **Step 2: Run** `npx vitest run tests/pro.test.ts tests/en.test.ts` → FAIL.
- [ ] **Step 3: Implement** según `ProyB.dc.html`: línea central punteada, nodo con punto, período, commits y el monigote de su oficio (`Sprite`, `anim="action"`, escala 2), tarjetas alternadas izquierda/derecha; Bryan (`walk`) recorre la línea. Movimiento solo dentro de `@supports (animation-timeline: view())` y fuera de `prefers-reduced-motion`: cada `.hito` entra con `animation-timeline: view()` (opacity y transform), y Bryan avanza por la línea con una animación ligada al scroll de `.recorrido`. ≤ 860 px: una columna, línea a la izquierda. Hover y `:focus-within` iluminan el borde de la tarjeta; `summary` con `:focus-visible`.
- [ ] **Step 4: Run** `npx vitest run` y `npm run build` → PASS; `dist/index.html` sigue con 2 `<script` y sin pixi.
- [ ] **Step 5: Check in the browser** (`portafolio-dev` o `astro preview` en 4322): `/` a 1440 y 375 px, `/en/` a 1440; a 375, `scrollWidth === 375`. Con `prefers-reduced-motion` emulado, todo visible y quieto. Abrir un `<details>` con teclado (Tab + Enter).
- [ ] **Step 6: Commit** `feat: Proyectos como recorrido cronológico`

### Task 3: Verificación y capturas

- [ ] **Step 1:** `npm run build` y `npx astro preview --port 4322`; Lighthouse móvil 3 veces en `/` y `/en/` → rendimiento, accesibilidad y SEO 100.
- [ ] **Step 2:** Capturas de `#proyectos` a 1440 y 375 px para que Bryan apruebe.
- [ ] **Step 3:** Parar el servidor de preview (nunca usar el puerto 4321).
