# Hero de la obra viva — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la ventana de la obra del hero de `/` (y `/en/`) por una obra grande de fondo que se arma en la primera visita y después queda trabajando, con monigotes que dicen su oficio.

**Architecture:** Los datos de la escena (quién está dónde, sus recorridos y su orden de llegada) son puros y con tests en `src/lib/obra.ts`. `Obra.astro` los dibuja con HTML y CSS (`src/styles/obra.css`), sin depender de JavaScript. Un script chico agrega lo que el CSS no puede: saltarse la entrada en visitas repetidas, la reacción al clic y pausar fuera de pantalla.

**Tech Stack:** Astro 7, CSS (`steps()`, `transform`, `clip-path`), TypeScript, Vitest + happy-dom + Astro Container.

**Spec:** `docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md`. Bocetos: lienzo «Portafolio · 3 bocetos», artboards `HeroA.dc.html` (escena y recorridos) y `HeroB.dc.html` (entrada).

## Global Constraints

- Arte dibujado con código: sprites de `art/sprites` vía `Sprite.astro`; piezas de la obra en HTML/CSS. Nada de canvas ni PixiJS en `/`.
- Sin JavaScript, `/` se ve completa: la escena se arma y trabaja solo con CSS.
- Con `prefers-reduced-motion: reduce`: la obra aparece armada y quieta.
- Solo se animan `transform`, `opacity`, `clip-path` y `background-position` (sprites).
- La revelación del título dura ≤ 0,6 s; la entrada completa ≤ 4 s.
- Lighthouse móvil de `/` y `/en/`: rendimiento ≥ 95, accesibilidad y SEO 100.
- Rótulos de oficio desde `contenido(lang).oficios` (`src/i18n.ts`), nunca escritos a mano.
- Textos del hero sin cambios.

## Review Focus

1. `sessionStorage` inaccesible (navegación privada, almacenamiento bloqueado): la página no se rompe y la entrada se reproduce.
2. Teclado: el foco en un monigote muestra su oficio igual que el hover, sin mover el layout.
3. 375 px: sin scroll horizontal y el texto sigue legible sobre la escena.
4. Movimiento reducido: obra armada y quieta, y los rótulos siguen funcionando.
5. Hero fuera de pantalla: las animaciones se pausan y vuelven al regresar.

---

### Task 1: Datos de la escena

**Files:**
- Create: `src/lib/obra.ts`
- Test: `tests/obra.test.ts`

**Interfaces:**
- Produces:
  - `export const ESCENA = { ancho: 860, alto: 700, suelo: 640, pisos: { 1: 480, 2: 330, 3: 180 } } as const` (y del borde superior de cada tablón y del suelo, en px dentro de la escena).
  - `export type Piso = 'suelo' | 1 | 2 | 3`
  - `export type Recorrido = { tipo: 'ida'; dx: number; s: number } | { tipo: 'sube'; alto: number; s: number } | { tipo: 'salto' } | null`
  - `export type Monigote = { sprite: string; anim: 'walk' | 'action' | 'idle'; x: number; piso: Piso; recorrido: Recorrido; llegada: number }` (`llegada`: segundos de retraso de su aparición en la entrada).
  - `export const cuadrilla: Monigote[]`
  - `export function pies(m: Monigote): number` → la y del tablón o del suelo de su piso.
  - `export const ENTRADA = { columnas: [0.3, 0.6], pisos: { 1: 1.0, 2: 1.5, 3: 2.0 }, total: 4 } as const`

- [ ] **Step 1: Write the failing tests** en `tests/obra.test.ts`:
  - `cada oficio está una vez, y Bryan también`: los `sprite` de `cuadrilla` ordenados son `[...oficios.map(o => o.sprite), 'bryan']` ordenados.
  - `la escalera llega del suelo al último piso`: el electricista tiene `recorrido.tipo === 'sube'` y `alto === ESCENA.suelo - ESCENA.pisos[3]` (460).
  - `todos caben en la escena`: para cada uno, `x >= 0` y `x + 64 <= ESCENA.ancho`, y con `tipo 'ida'`, `x + dx + 64 <= ESCENA.ancho` y `x + dx >= 0`.
  - `la entrada termina a tiempo`: cada `llegada <= ENTRADA.total` y cada monigote llega después de que cae su piso (`llegada > ENTRADA.pisos[piso]` si `piso !== 'suelo'`).
  - `pies` devuelve 180 para piso 3 y 640 para el suelo.
- [ ] **Step 2: Run** `npx vitest run tests/obra.test.ts` → FAIL (módulo inexistente).
- [ ] **Step 3: Implement** `src/lib/obra.ts` con los valores del boceto A: capataz x150 piso 3 `ida` dx 260 s 12; maestro x190 piso 2 action; doble x530 piso 2 `salto`; decorador x350 piso 1 action; electricista x634 suelo `sube` alto 460 s 11; archivista x60 suelo `ida` dx 150 s 9; bryan x470 suelo idle. Llegadas entre 2.5 y 3.9 en el orden de Hero B.
- [ ] **Step 4: Run** `npx vitest run tests/obra.test.ts` → PASS.
- [ ] **Step 5: Commit** `feat: datos de la escena de la obra`

### Task 2: La obra de fondo en el hero (solo CSS)

**Files:**
- Create: `src/components/pro/Obra.astro`, `src/styles/obra.css`
- Modify: `src/components/pro/Hero.astro`, `src/styles/global.css` (quitar `.obra-window`, `.obra-bar`, `.obra`, `.obra-andamio`, `.obra-tablon`, `.obra-suelo`, `.obra .spr`, `.obra .arriba`, `.obra .abajo`), `src/i18n.ts` (quitar `obraBar`, que queda sin uso)
- Test: `tests/obra.test.ts`, `tests/pro.test.ts`, `tests/en.test.ts`

**Interfaces:**
- Consumes: `ESCENA`, `cuadrilla`, `pies`, `ENTRADA` (Task 1); `contenido(lang).oficios`, `t[lang]` (`src/i18n.ts`); `Sprite.astro`.
- Produces: `Obra.astro` con prop `lang: Lang`. Su raíz es `<div class="obra-viva" data-obra>`; cada monigote es `<button type="button" class="quien" data-oficio="…" aria-label="…">` con su `Sprite` adentro; las piezas van en un contenedor `aria-hidden="true"`. Clases que el script usa (Task 3): `.armada` y `.pausada` en la raíz, `.reacciona` en un `.quien`.

- [ ] **Step 1: Write the failing tests:**
  - en `tests/obra.test.ts`, renderizando `Obra.astro` con `lang: 'es'` y `'en'`: hay 7 `button.quien`; el `aria-label` del capataz es `` `${oficio}: ${area}` `` del oficio en ese idioma («Capataz: Planificación y método» / «Foreman: Planning and method») y el de Bryan es «Bryan Marin»; el contenedor de piezas tiene `aria-hidden="true"`; cada botón lleva `style` con su `top` = `pies - fh*4` y su `left` = `x`.
  - en `tests/pro.test.ts` el test existente «la escena de la obra tiene a los 6 oficios y a Bryan» sigue en verde sin cambios, y el h1 sigue siendo el mismo texto.
- [ ] **Step 2: Run** `npx vitest run tests/obra.test.ts tests/pro.test.ts` → FAIL.
- [ ] **Step 3: Implement** `Obra.astro` y `obra.css` siguiendo `HeroA.dc.html` (piezas, velo hacia el texto, recorridos `ida`/`sube`/`salto`, pared que se pinta, grúa, chispas, polvo, rótulo con `content: attr(data-oficio)` en `:hover` y `:focus-visible`) y la entrada de `HeroB.dc.html` (`crece`, `cae`, `llega` con los tiempos de `ENTRADA` y `llegada`; la entrada solo bajo `.obra-viva:not(.armada)`). Las variables `--dx`, `--s`, `--alto` y `animation-delay` salen de los datos en `style`. Movimiento reducido: sin animaciones, todo armado.
- [ ] **Step 4: Modify `Hero.astro`:** la sección `.hero` pasa a tener la obra de fondo a todo el ancho y el texto encima a la izquierda (como `HeroA.dc.html`); el h1 se revela con `clip-path` en `steps(10)` durante 0,6 s. En ≤ 900 px la escena queda detrás, corrida a la derecha y apagada; sin scroll horizontal.
- [ ] **Step 5: Run** `npx vitest run` → PASS (todos).
- [ ] **Step 6: Check in the browser** (`portafolio-dev`): `/` a 1440 y 375 px, `/en/` a 1440. A 375 px `document.documentElement.scrollWidth === 375`. Con `prefers-reduced-motion` emulado, la obra se ve armada y quieta. Tab llega a cada monigote y muestra su oficio.
- [ ] **Step 7: Commit** `feat: la obra de fondo se arma y trabaja en el hero`

### Task 3: El script chico

**Files:**
- Create: `src/scripts/obra.ts`
- Modify: `src/components/pro/Obra.astro` (script inline y script del módulo), `architecture.md`
- Test: `tests/obra-script.test.ts`, `tests/pro.test.ts`, `tests/en.test.ts`

**Interfaces:**
- Consumes: la raíz `[data-obra]` y las clases de Task 2.
- Produces: `export function initObra(root: HTMLElement, opts?: { storage?: Pick<Storage, 'getItem' | 'setItem'>; observe?: (cb: (visible: boolean) => void) => void }): void`. Clave de sesión: `'obra-armada'`.

- [ ] **Step 1: Write the failing tests** en `tests/obra-script.test.ts` (`// @vitest-environment happy-dom`):
  - `marca la obra como vista`: tras `initObra`, `storage.getItem('obra-armada') === '1'`.
  - `sin almacenamiento no se rompe`: con un `storage` cuyos métodos lanzan, `initObra` no lanza.
  - `el clic hace reaccionar al monigote`: clic en un `button.quien` → tiene `.reacciona`; tras `vi.advanceTimersByTime(700)` ya no.
  - `pausa fuera de pantalla`: con `observe` falso, `cb(false)` → la raíz tiene `.pausada`; `cb(true)` → no.
- [ ] **Step 2: Run** `npx vitest run tests/obra-script.test.ts` → FAIL.
- [ ] **Step 3: Implement** `initObra` (delegación de clic en la raíz; `IntersectionObserver` por defecto en `observe`; todo acceso a `storage` en `try`). En `Obra.astro`: justo después de la raíz, un `<script is:inline>` que, si `sessionStorage.getItem('obra-armada')`, agrega `.armada` a la raíz antes del primer pintado (en `try`); y un `<script>` de módulo que llama a `initObra`. CSS: `.obra-viva.pausada *{animation-play-state:paused}` y la reacción `.quien.reacciona` (salto de 0,6 s).
- [ ] **Step 4: Update** los tests «no carga JavaScript propio» de `tests/pro.test.ts` y `tests/en.test.ts` a «solo carga el script de la obra»: a lo sumo dos `<script` en el HTML, ninguno con `pixi`.
- [ ] **Step 5: Update `architecture.md`:** el invariante «`/` no carga motor de juego ni scripts de cliente propios» pasa a «`/` no carga motor de juego; solo un script chico y diferido para la obra, y sin él la página se ve igual». Validar con `node ~/.claude/skills/project-specs/scripts/validate-specs.mjs .` → 0 errores.
- [ ] **Step 6: Run** `npx vitest run` y `npm run build` → PASS; `dist/index.html` sin `pixi`.
- [ ] **Step 7: Commit** `feat: la obra recuerda la visita, reacciona al clic y se pausa fuera de pantalla`

### Task 4: Verificación y capturas

**Files:**
- Modify: `public/og.png` solo si Bryan lo pide (la imagen para compartir de `/` hoy muestra la obra vieja).

- [ ] **Step 1:** `npm run build` y `npx astro preview --port 4322`; Lighthouse móvil 3 veces en `/` y `/en/` → rendimiento ≥ 95, accesibilidad y SEO 100. Si no llega, corregir y volver a medir.
- [ ] **Step 2:** Capturas de `/` a 1440 y 375 px (con la entrada terminada) para que Bryan apruebe.
- [ ] **Step 3:** Parar el servidor de preview.
