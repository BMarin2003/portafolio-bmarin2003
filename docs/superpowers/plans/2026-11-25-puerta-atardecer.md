# La puerta con atardecer — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rehacer la franja «puerta a la casa» de `/` y `/en/`: atardecer ligado al scroll y una puerta que se abre y deja ver la casa de noche, solo CSS.

**Architecture:** `PuertaCasa.astro` dibuja cielo, estrellas, suelo, monigotes, casa y la puerta-enlace; los estilos van en `src/styles/puerta.css`. El movimiento usa `animation-timeline: view()` dentro de `@supports` y fuera de `prefers-reduced-motion`.

**Tech Stack:** Astro 7, CSS, Vitest + happy-dom + Astro Container.

**Spec:** `docs/superpowers/specs/2026-11-25-puerta-atardecer-design.md`. Boceto: `Puerta.dc.html` (copia en la carpeta del plan al ejecutar).

## Global Constraints

- Textos sin cambios: `t[lang].pro.puertaKicker`, `puertaH2`, `puertaP`, `puertaCta`.
- Un solo enlace a `href(lang, '/casa')`; lo decorativo con `aria-hidden`.
- `/` sin JavaScript nuevo (2 `<script`, sin pixi). Solo se animan `opacity`, `transform` y `background-position`.
- Sin soporte de `animation-timeline` o con `prefers-reduced-motion`: de noche, quieto, luces prendidas; la puerta igual se abre (sin transición con movimiento reducido).
- La imagen de la casa (`/casa-estatica.png`) entra como fondo CSS.
- Lighthouse móvil de `/` y `/en/`: rendimiento, accesibilidad y SEO 100; CLS 0.

## Review Focus

1. Firefox/Safari sin `animation-timeline`: la franja se ve de noche y completa, nada invisible.
2. Teclado: el foco en el enlace abre la puerta y se ve el anillo de foco.
3. 375 px: casa y puerta debajo del texto, sin scroll horizontal.
4. Movimiento reducido: sin movimiento y con luces prendidas.
5. Lector de pantalla: un enlace con nombre «entrar a la casa» / «enter the house» y el `h2` de la sección.

---

### Task 1: La franja

**Files:**
- Create: `src/styles/puerta.css`
- Modify: `src/components/pro/PuertaCasa.astro`, `src/styles/global.css` (quitar `.puerta*` y `.paseo` que queden sin uso)
- Test: `tests/pro.test.ts`, `tests/en.test.ts`

- [ ] **Step 1: Update the tests:** la sección `.puerta-band` tiene el `h2` «Fuera del trabajo» (en: «Outside work»), un solo `a[href="/casa"]` (en: `/en/casa`) dentro de la franja con su nombre accesible, y los elementos de cielo, estrellas, monigotes y casa con `aria-hidden="true"`. Se mantienen los tests existentes que enlazan a la casa desde el encabezado y desde la puerta.
- [ ] **Step 2: Run** `npx vitest run tests/pro.test.ts tests/en.test.ts` → FAIL.
- [ ] **Step 3: Implement** según el boceto, con el movimiento ligado al scroll de la franja (`view-timeline` / `animation-range`) en lugar del bucle del boceto; base sin animación = estado de noche.
- [ ] **Step 4: Run** `npx vitest run` y `npm run build` → PASS; `dist/index.html` con 2 `<script` y sin pixi.
- [ ] **Step 5: Check in the browser** (`astro preview --port 4322`, nunca 4321): 1440 al entrar y al terminar el scroll, 375, `/en/`, foco con teclado, movimiento reducido; capturas en la carpeta del plan.
- [ ] **Step 6: Commit** `feat: la puerta a la casa con atardecer`

### Task 2: Verificación

- [ ] Lighthouse móvil 3 veces en `/` y `/en/` → 100 en rendimiento, accesibilidad y SEO, CLS 0.
