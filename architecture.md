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
- **Scripts de cliente chicos:** en `/`, el de la obra (recordar la visita, reacción al clic, pausa fuera de pantalla); en `/casa`, solo dos: el reloj de Trujillo (texto) y la consulta periódica de "qué suena ahora", que escribe en el parlante únicamente cuando cambia la canción o la carátula. La escena no lleva JavaScript.
- **Paso de build de sprites:** un script de Node convierte los módulos de `art/sprites/` en hojas PNG y su JSON en `public/sprites/`, antes de compilar y antes de `dev`. Contrato en `module-art`.
- **Función `/api/now-playing`** (Cloudflare Pages Functions). Consulta la Web API de Spotify con el token de Bryan y devuelve canción, artista y carátula, o nada si no suena nada.

## Decisiones

- **Astro, no Next.js ni una SPA de Vite.** La página casi no cambia, así que no necesita React entero; Next.js además haría el sitio igual por dentro al de Adrian. Una SPA llega vacía a los buscadores y a las vistas previas de LinkedIn, que es justo por donde entran los reclutadores. Astro ya está en el stack de Bryan.
- **Cloudflare Pages, no Vercel.** Bryan ya usa Cloudflare, el plan gratuito alcanza y Pages Functions resuelve Spotify sin otro servicio.
- **Spotify directo, con las bandas a la vista.** Si la API falla o no suena nada, el parlante muestra las 5 bandas fijas con su foto; nunca queda vacío. Last.fm queda como plan B si la API de Spotify complica el acceso (sin confirmar).
- **CSS para animar los sprites, sin librerías.** En `/` son pocos movimientos (reposo, trabajar) y `steps()` los cubre sin peso extra.
- **Español primero; el inglés solo reemplaza textos.** Las páginas son vistas con un `lang`, y el inglés toma de los datos en español todo lo que no es texto (personas, oficios, enlaces), así los dos idiomas no se desfasan. Los textos que usa el cliente de `/casa` (rótulos del reloj y del parlante) van aparte y chicos, porque viajan en el bundle; el cliente elige idioma por `<html lang>`.
- **Portadas y pósters como archivos propios del sitio, optimizados al compilar.** Cargar las imágenes desde la CDN de Steam u otros sitios deja la página a merced de terceros. Decisión mía: Bryan puede cambiarla.
- **Dos páginas, sin motor de juego en ninguna.** La profesional debe ser liviana y legible; la casa es un recorrido de tres habitaciones (cuarto, sala, mesa de rol) hecho solo con HTML y CSS, sin canvas ni PixiJS.
- **Cada habitación: contenido en el DOM y escena decorativa debajo.** Portadas, nombres y enlaces son HTML normal; la escena dibujada va aparte con `aria-hidden` y sin nada enfocable. Las animaciones son CSS (`steps()` y, donde el navegador lo soporta, ligadas al scroll con `@supports`), así lo importante nunca depende de una animación ni de JavaScript.
- **Hora real de Trujillo, UTC−5 fijo, solo como texto.** El reloj muestra la hora de Trujillo, no la de la zona del visitante. Perú no tiene horario de verano. No hay fase de día y noche ni botón para adelantar el reloj: la casa se ve igual a toda hora.
- **Pixel art como código.** Los personajes son módulos TypeScript con la rejilla de píxeles y la paleta; un script los convierte en hojas PNG durante el build. Así el arte es original, versionado, revisable en un diff y sin licencias. Se descartaron los packs de terceros (licencias y estilo ajeno) y los generadores de IA de pago (costo y poco control).

## Invariantes

- **El token de Spotify nunca llega al navegador.** Vive como secreto de Cloudflare y solo lo lee la función.
- **`/` no carga motor de juego; solo un script chico y diferido para la obra, y sin él la página se ve igual.**
- **Las dos páginas funcionan sin JavaScript.** `/` se ve completa. `/casa` muestra las tres habitaciones con sus listas completas y las cinco bandas; solo faltan el reloj y la canción en vivo.
- **Se respeta `prefers-reduced-motion`.** Si el visitante lo pide, todo lo que se mueve en `/casa` queda quieto en su estado final y cada tira muestra su primer elemento; las animaciones infinitas viven solo dentro de `prefers-reduced-motion: no-preference`.
- **La escena es solo decoración.** Va con `aria-hidden` y sin elementos enfocables; todo lo que dice algo (juegos, series, bandas, manuales) existe como contenido en el DOM.
- **Ningún texto entre corchetes (`[nombres]`, `[Qué hice]`) llega a producción.** El build falla si encuentra uno. Decisión mía.
- **Contraste mínimo de 4.5:1** en todo el texto, también en las anotaciones chicas.
- **Los PNG de sprites se generan en el build; nunca se editan ni se versionan a mano.**
