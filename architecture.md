---
id: architecture
type: architecture-design
status: active
title: Arquitectura del portafolio
parent: portfolio
---

## Topología

- **Sitio Astro estático**, desplegado en Cloudflare Pages. Toda la página sale como HTML al compilar.
- **Contenido como datos:** proyectos, cuadrilla y gustos viven en archivos de datos del sitio, no dentro del marcado. Cambiar un texto no toca componentes.
- **Muñequitos y la casa:** componentes SVG con animaciones CSS.
- **Scripts de cliente chicos:**
  - La rotación de la PC, la TV y el parlante.
  - La consulta periódica de "qué suena ahora".
- **Función `/api/now-playing`** (Cloudflare Pages Functions). Consulta la Web API de Spotify con el token de Bryan y devuelve canción y artista, o nada si no suena nada.

## Decisiones

- **Astro, no Next.js ni una SPA de Vite.** La página casi no cambia, así que no necesita React entero; Next.js además haría el sitio igual por dentro al de Adrian. Una SPA llega vacía a los buscadores y a las vistas previas de LinkedIn, que es justo por donde entran los reclutadores. Astro ya está en el stack de Bryan.
- **Cloudflare Pages, no Vercel.** Bryan ya usa Cloudflare, el plan gratuito alcanza y Pages Functions resuelve Spotify sin otro servicio.
- **Spotify directo, con rotación de respaldo.** Si la API falla o no suena nada, el parlante rota las bandas fijas; nunca queda vacío. Last.fm queda como plan B si la API de Spotify complica el acceso (sin confirmar).
- **SVG y CSS para animar, sin librerías.** Son pocos movimientos (respirar, parpadear, teclear) y CSS los cubre.
- **Español primero, con rutas de idioma listas.** El sistema de idiomas de Astro se configura desde el inicio, así sumar el inglés solo agrega textos y no obliga a reestructurar.
- **Portadas y pósters como archivos propios del sitio, optimizados al compilar.** Cargar las imágenes desde la CDN de Steam u otros sitios deja la página a merced de terceros. Decisión mía: Bryan puede cambiarla.
- **En celular, la casa se apila.** Los pisos van uno debajo del otro a todo el ancho y las anotaciones de plano se ocultan. Decisión mía.
- **Pixel art como código.** Los personajes son módulos TypeScript con la rejilla de píxeles y la paleta; un script los convierte en hojas PNG durante el build. Así el arte es original, versionado, revisable en un diff y sin licencias. Se descartaron los packs de terceros (licencias y estilo ajeno) y los generadores de IA de pago (costo y poco control).

## Invariantes

- **El token de Spotify nunca llega al navegador.** Vive como secreto de Cloudflare y solo lo lee la función.
- **La página funciona sin JavaScript.** Sin scripts, la PC, la TV y el parlante muestran el primer título de su lista.
- **Se respeta `prefers-reduced-motion`.** Si el visitante lo pide, se detienen las animaciones y la rotación.
- **Ningún texto entre corchetes (`[nombres]`, `[Qué hice]`) llega a producción.** El build falla si encuentra uno. Decisión mía.
- **Contraste mínimo de 4.5:1** en todo el texto, también en las anotaciones chicas.
- **Los PNG de sprites se generan en el build; nunca se editan ni se versionan a mano.**
