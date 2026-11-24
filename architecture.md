---
id: architecture
type: architecture-design
status: active
title: Arquitectura del portafolio
parent: portfolio
---

## Topología

- **Sitio Astro estático**, desplegado en Cloudflare Pages. Las dos páginas, `/` y `/casa`, y su versión en inglés bajo `/en/`, salen como HTML al compilar.
- **Contenido como datos:** proyectos, oficios y gustos viven en archivos de datos del sitio, no dentro del marcado. Cambiar un texto no toca componentes.
- **Muñequitos:** `Sprite.astro` lee `art/sprites` al compilar y anima con CSS; `/` anima con CSS y solo suma el script chico de la obra.
- **Scripts de cliente chicos, solo en `/casa`:**
  - La rotación de la PC, la TV y el parlante.
  - La consulta periódica de "qué suena ahora".
- **Paso de build de sprites:** un script de Node convierte los módulos de `art/sprites/` en hojas PNG y su JSON en `public/sprites/`, antes de compilar y antes de `dev`. Contrato en `module-art`.
- **Función `/api/now-playing`** (Cloudflare Pages Functions). Consulta la Web API de Spotify con el token de Bryan y devuelve canción y artista, o nada si no suena nada.

## Decisiones

- **Astro, no Next.js ni una SPA de Vite.** La página casi no cambia, así que no necesita React entero; Next.js además haría el sitio igual por dentro al de Adrian. Una SPA llega vacía a los buscadores y a las vistas previas de LinkedIn, que es justo por donde entran los reclutadores. Astro ya está en el stack de Bryan.
- **Cloudflare Pages, no Vercel.** Bryan ya usa Cloudflare, el plan gratuito alcanza y Pages Functions resuelve Spotify sin otro servicio.
- **Spotify directo, con rotación de respaldo.** Si la API falla o no suena nada, el parlante rota las bandas fijas; nunca queda vacío. Last.fm queda como plan B si la API de Spotify complica el acceso (sin confirmar).
- **CSS para animar los sprites, sin librerías.** En `/` son pocos movimientos (reposo, trabajar) y `steps()` los cubre sin peso extra.
- **Español primero; el inglés solo reemplaza textos.** Las páginas son vistas con un `lang`, y el inglés toma de los datos en español todo lo que no es texto (personas, oficios, enlaces), así los dos idiomas no se desfasan. Los textos que usa el cliente de `/casa` (título por fase, rótulos de la escena) van aparte y chicos, porque viajan en el bundle; el cliente elige idioma por `<html lang>`.
- **Portadas y pósters como archivos propios del sitio, optimizados al compilar.** Cargar las imágenes desde la CDN de Steam u otros sitios deja la página a merced de terceros. Decisión mía: Bryan puede cambiarla.
- **Dos páginas, y el motor de juego solo en `/casa`.** La profesional debe ser liviana y legible; la escena viva de la casa (PixiJS) se carga únicamente allí.
- **Escena en capas: lógica pura, DOM accesible y PixiJS decorativo.** Las reglas (fase del día, rutas, qué actor está dónde) son funciones puras y con tests; el DOM trae todo el contenido y la interacción; PixiJS solo dibuja y delega los clics al DOM. Así lo importante nunca depende del canvas ni de WebGL. PixiJS va fijado en versión exacta, porque su API cambia entre menores.
- **Hora real de Trujillo, UTC−5 fijo.** La fase sale del reloj del visitante convertido a Trujillo, no de su zona: todos ven la casa a la misma hora que vive Bryan. Perú no tiene horario de verano. «Adelantar reloj» (+10 h) deja ver la otra fase sin esperar.
- **Pixel art como código.** Los personajes son módulos TypeScript con la rejilla de píxeles y la paleta; un script los convierte en hojas PNG durante el build. Así el arte es original, versionado, revisable en un diff y sin licencias. Se descartaron los packs de terceros (licencias y estilo ajeno) y los generadores de IA de pago (costo y poco control).

## Invariantes

- **El token de Spotify nunca llega al navegador.** Vive como secreto de Cloudflare y solo lo lee la función.
- **`/` no carga motor de juego; solo un script chico y diferido para la obra, y sin él la página se ve igual.**
- **Las dos páginas funcionan sin JavaScript.** `/` se ve completa. `/casa` muestra la imagen de la casa de noche, los cinco paneles con sus listas completas y la primera banda en el parlante.
- **Se respeta `prefers-reduced-motion`.** Si el visitante lo pide, se detienen las animaciones y la rotación; con ello la escena de `/casa` no se monta y queda la imagen estática.
- **El canvas siempre tiene su equivalente accesible en el DOM.** El canvas va oculto a lectores de pantalla (`aria-hidden`); todo objeto de la escena existe como botón y panel.
- **Ningún texto entre corchetes (`[nombres]`, `[Qué hice]`) llega a producción.** El build falla si encuentra uno. Decisión mía.
- **Contraste mínimo de 4.5:1** en todo el texto, también en las anotaciones chicas.
- **Los PNG de sprites se generan en el build; nunca se editan ni se versionan a mano.**
