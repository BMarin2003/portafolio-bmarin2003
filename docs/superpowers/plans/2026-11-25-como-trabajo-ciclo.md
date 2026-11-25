# Cómo trabajo como ciclo — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar a la sección `#ia` de `/` y `/en/`, debajo del párrafo, los 4 pasos del ciclo con monigote, frase, prueba enlazada y la cinta animada, más el cierre con enlace al repo.

**Architecture:** Los pasos son datos en `src/i18n.ts` (`t[lang].pro.ciclo`); `ComoTrabajo.astro` los dibuja con estilos propios en `src/styles/ciclo.css`.

**Tech Stack:** Astro 7, CSS, Vitest + happy-dom + Astro Container.

**Spec:** `docs/superpowers/specs/2026-11-25-como-trabajo-ciclo-design.md` (textos exactos y enlaces en sus tablas). Boceto: `IaCiclo.dc.html` (copia en la carpeta del plan al ejecutar).

## Global Constraints

- Textos exactos de las tablas de la spec, en los dos idiomas; el párrafo `comoTrabajo` sin cambios.
- Enlaces exactos a `https://github.com/BMarin2003/portafolio-bmarin2003/…` (rama `main`) según la spec; se abren en la misma pestaña, sin `target`.
- Monigotes por paso: archivista, capataz, maestro, doble (ids de sprite); todos decorativos.
- `/` sin JavaScript nuevo (2 `<script`, sin pixi). Solo se animan `transform` y `background-position`; con `prefers-reduced-motion`, quieto.
- Lighthouse móvil de `/` y `/en/`: rendimiento, accesibilidad y SEO 100.

## Review Focus

1. Celular (≤ 860 px): una columna, sin cinta ni bloque, sin scroll horizontal.
2. Lector de pantalla: 4 `article` con `h3`; cada prueba es un enlace con texto que se entiende solo («En el hero: …»).
3. Movimiento reducido: bloque y cinta quietos, monigotes quietos.
4. Inglés: los 4 pasos, las pruebas y el cierre en inglés; mismos enlaces.

---

### Task 1: El ciclo

**Files:**
- Create: `src/styles/ciclo.css`
- Modify: `src/i18n.ts` (`t[lang].pro.ciclo = { pasos: { titulo, frase, prueba, href, sprite }[], cierre, cierreEnlace, cierreHref }`), `src/components/pro/ComoTrabajo.astro`, `src/styles/global.css` (quitar `.ia-sprites` y lo que quede sin uso)
- Test: `tests/pro.test.ts`, `tests/en.test.ts`

- [ ] **Step 1: Write the failing tests:**
  - `/ · cómo trabajo`: el párrafo sigue igual; hay 4 `#ia article`, con `h3` «Entender», «Decidir», «Construir junto a Claude», «Revisar»; cada uno contiene su frase y un enlace con su prueba y su `href` exactos de la spec; el cierre enlaza a `…/tree/main/docs/superpowers`; la cinta y el bloque tienen `aria-hidden="true"`.
  - `/en/`: los `h3` son «Understand», «Decide», «Build alongside Claude», «Review», con las pruebas en inglés y los mismos `href`.
- [ ] **Step 2: Run** `npx vitest run tests/pro.test.ts tests/en.test.ts` → FAIL.
- [ ] **Step 3: Implement** según el boceto: 4 columnas sobre la cinta de madera (bloque que viaja con `transform`, cinta con `background-position`), monigote con `anim="action"` por paso, número `01`–`04`, `h3`, frase y la prueba como tarjeta-enlace; cierre en mono con su enlace. ≤ 860 px: una columna, sin cinta ni bloque.
- [ ] **Step 4: Run** `npx vitest run` y `npm run build` → PASS; `dist/index.html` con 2 `<script` y sin pixi.
- [ ] **Step 5: Check in the browser** (`astro preview --port 4322`, nunca 4321): 1440 y 375 (CDP), `/en/` a 1440, movimiento reducido; capturas en la carpeta del plan.
- [ ] **Step 6: Commit** `feat: cómo trabajo como ciclo con evidencia del hero`

### Task 2: Verificación

- [ ] Lighthouse móvil 3 veces en `/` y `/en/` → 100 en rendimiento, accesibilidad y SEO; parar el servidor.
