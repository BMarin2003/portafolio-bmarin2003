# La puerta a la casa: atardecer y puerta

Fecha: 2026-11-25 · Rama: `feat/puerta` · Boceto: lienzo «Portafolio · 3 bocetos», artboard `Puerta.dc.html` (título ya actualizado al texto aprobado en la auditoría).

## Para qué

La franja al final de `/` es el paso de lo profesional a lo personal. Debe invitar a entrar a `/casa` sin tono de cuento: el texto es el de la auditoría («Fuera del trabajo»), y el atardecer y la puerta son decoración.

## Objetivos

- Al llegar a la franja con el scroll, el cielo pasa de día a noche y aparecen estrellas; dos monigotes salen caminando, Bryan camina hacia la puerta y se prenden las ventanas de la casa. Todo ligado al scroll (`animation-timeline: view()`), solo CSS.
- La puerta (el enlace a `/casa`) se abre al pasar el cursor o con el foco y deja ver la imagen real de la casa de noche (`/casa-estatica.png`).
- El texto no cambia: «Después de las 6», «Fuera del trabajo», «Rol, juegos, series y lo que suena ahora en Spotify.», «entrar a la casa →» (y su inglés).

## Anti-objetivos

- Sin JavaScript nuevo en `/`.
- Sin soporte de animaciones ligadas al scroll, o con `prefers-reduced-motion`: la franja queda de noche, quieta y con las luces prendidas; la puerta igual se abre (sin animación con movimiento reducido).
- El enlace sigue siendo uno solo, con nombre accesible «entrar a la casa» / «enter the house»; lo decorativo va con `aria-hidden`.

## Diseño

- Solo se animan `opacity`, `transform` y `background-position`.
- La imagen de la casa entra por CSS (fondo) y no compite con el LCP.
- Celular: la casa y la puerta debajo del texto, sin scroll horizontal.

## Enfoques considerados

- **A + B** (elegido): atardecer con el scroll y puerta que se abre. **A** solo y **B** solo: descartados.
