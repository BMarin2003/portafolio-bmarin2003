# Las áreas de `/`: el taller

Fecha: 2026-11-25 · Rama: `feat/areas-taller` · Boceto aprobado: lienzo «Portafolio · 3 bocetos», artboard `AreasA.dc.html` («La mesa de trabajo»).

## Para qué

La sección de áreas ocupa unos 2.800 px para unas 90 palabras y no conecta con nada. Bryan quiere que muestre no solo qué aplica, sino con qué herramientas exactas y dónde las usó.

## Objetivos

- Los seis monigotes en fila sobre una mesa de trabajo; cada uno es una pestaña con el nombre de su área.
- Al elegir uno, ese monigote trabaja y se abre su panel: herramientas, en cuántos proyectos usó cada una (con los nombres al pasar el cursor), la línea «En la obra» con esos proyectos y la formación verificable del área cuando la hay.
- La sección queda compacta (del orden de 600 px a 1440 de ancho).

## No-objetivos

- Cambiar las áreas, las herramientas o el certificado (aprobados el 2026-11-25).
- Inventar en qué proyecto se usó una herramienta: el dato sale solo del `stack` de cada proyecto, ya confirmado por Bryan.

## Anti-objetivos

- Agregar JavaScript a `/`: las pestañas son radios nativos con `<label>`; el teclado las recorre con las flechas.
- Esconder información a lectores de pantalla o sin CSS: cada panel tiene su título y su contenido en el DOM.

## Enfoques considerados

- **A. La mesa de trabajo** (elegido): pestañas en fila sobre una mesa, panel abajo.
- **B. El andamio**: lista vertical con panel al costado. Descartado por Bryan.
- **Grilla compacta / tablero**: descartados antes; no conectan con los proyectos.

## Diseño

- **Uso por herramienta:** una herramienta cuenta para un proyecto si alguna de sus partes (`'Bun / Elysia'` → Bun, Elysia) está en el `stack` del proyecto. Los proyectos van en orden cronológico y «Este sitio» (pseudo-fuente con Astro, Cloudflare, GitHub Actions, Vitest y Lighthouse) cuenta como un uso más, al final.
- **Panel sin proyectos asociados:** dice que son herramientas de trabajo diario y que todavía no tienen un proyecto de CorAll asociado en el recorrido.
- **Pestaña abierta al cargar:** la primera, Planificación y método.
- **Celular (≤ 760 px):** las pestañas en dos filas de tres.
- **Movimiento:** el monigote elegido usa su animación de trabajo y los demás reposan; con `prefers-reduced-motion`, quietos.
- **Textos** (es / en): «En proyectos:» / «Used on:»; «El número: en cuántos proyectos (de CorAll y este sitio) la usé.» / «The number: how many projects (CorAll and this site) I used it on.»; «Herramientas de uso diario; no forman parte del stack de los proyectos listados.» / «Everyday tools; not part of the stack of the projects listed.»

## Queda a criterio de quien construye

- Cómo se modela el cálculo de uso (función pura con tests).
- Detalles visuales (mesa, sombras, transiciones) mientras se parezca al boceto.
