# La casa como recorrido

Fecha: 2026-11-26 · Rama: `feat/casa-recorrido` · Boceto: lienzo «Portafolio · 3 bocetos», artboard `CasaB.dc.html` («Casa B · El recorrido»).

## Para qué

`/casa` (y `/en/casa`) es la página personal: lo que Bryan hace después de las 6. Hoy se siente muerta. Es una escena chica en PixiJS con habitaciones casi vacías, una biblioteca que al tocarla solo muestra un texto, un cuarto de música con una bocina y ninguna imagen de lo que nombra. Bryan quiere que sea el apartado más vivo del sitio: monigotes haciendo cosas, habitaciones llenas y las portadas reales de sus juegos, series y películas.

## Objetivos

- Tres habitaciones, de arriba abajo, cada una como una franja grande con su contenido al lado y siempre a la vista, sin tener que tocar nada:
  1. **Cuarto · lo que juego.** Escritorio largo con 2 monitores, torre con luz RGB, ventana, repisa y póster. Bryan sentado con audífonos. En el monitor principal rotan las portadas de los 7 juegos. Al lado va la grilla de los 7 juegos con portada, cada una enlazada a Steam.
  2. **Sala · lo que veo y lo que suena.** TV con las 11 series y películas rotando, sofá con 2 monigotes, tocadiscos con disco girando, cuadro con la carátula de lo que suena y un monigote moviendo la cabeza con notas que suben. Al lado van los pósters de los 11 títulos (enlazados a IMDb) y el parlante: lo que suena ahora en Spotify, con su carátula, o, si no suena nada, las 5 bandas con su foto.
  3. **Mesa de rol · juego y dirijo, en línea.** Pantalla grande con un mapa de batalla (fichas que se mueven) y una llamada con 4 monigotes sin nombre que se turnan para hablar. Bryan con audífonos. Su pantalla de DM y su hoja de personaje se alternan, y rueda un d20. Al lado: «Juego y dirijo D&D y Cyberpunk RED, en línea.» y las portadas de los dos manuales básicos.
- Entre habitación y habitación hay un pasillo donde Bryan camina a la siguiente.
- Al bajar, cada habitación se enciende al entrar en pantalla (de penumbra a luz) y Bryan avanza por el pasillo, ligado al scroll (`animation-timeline: view()`), como en Proyectos y la puerta.
- Todo es HTML y CSS con los sprites existentes (`Sprite.astro`, animaciones `steps()`), como `/`. Se quita PixiJS.

## Anti-objetivos

- **Nada que diga lo que Bryan no es.** No hay biblioteca (no lee mucho) ni cuarto de música (no es músico; la música va de fondo en la sala). El texto dice «lo que veo», no «cine».
- **El grupo de rol no aparece:** los de la llamada son monigotes sin nombre.
- **Nada de arte generado:** la escena se dibuja con código. Las portadas son imágenes reales de terceros (decisión de Bryan) y se muestran con su crédito.
- **Sin JavaScript para la escena.** Solo queda el JS que ya existe para Spotify y el reloj.

## Restricciones

- **Portadas reales, guardadas en el repo:** se descargan una vez a `src/assets/casa/`, se commitean y Astro las optimiza (`astro:assets`). En tiempo de ejecución no se enlaza ninguna imagen de terceros, salvo la carátula de Spotify, que cambia con cada canción.
- **Las descargas las aprueba Bryan antes:** el plan lista cada archivo, su fuente y su tamaño, y no descarga nada sin su OK.
- **Fuentes de las imágenes (decisión de Claude):**
  - juegos: la imagen de cabecera de Steam (`header.jpg` de cada app);
  - series y películas: el póster del artículo de Wikipedia de cada título; en las trilogías, el de la primera película;
  - bandas: la foto de artista de Spotify;
  - manuales: la portada del manual básico en la página de su editorial (D&D Player's Handbook de Wizards of the Coast; Cyberpunk RED Core Rulebook de R. Talsorian).
- **Créditos:** cada título sigue enlazado a su fuente actual («vía Steam», «vía IMDb»), y el pie de la página dice que las portadas son de sus dueños y se muestran como referencia.
- **La carátula de Spotify:** `functions/_lib/spotify.ts` agrega `cover` (la URL de la imagen de álbum más chica de al menos 64 px) a `NowPlaying` cuando suena algo. El cliente la muestra en el cuadro de la sala.
- **Accesibilidad:**
  - cada habitación es una `section` con su `h2`;
  - la escena dibujada va con `aria-hidden`, y las tiras que rotan en el monitor y la TV también;
  - la grilla de al lado es el contenido real: imágenes con `alt` igual al título y enlaces con nombre accesible;
  - el parlante mantiene su `aria-live` para lo que suena.
- **Sin animaciones ligadas al scroll, o con `prefers-reduced-motion`:** todas las habitaciones quedan encendidas y Bryan queda quieto en el pasillo. Con movimiento reducido, además, no hay rotaciones ni sprites animados: se ve el primer cuadro y la primera portada.
- **Celular (375 px):** la escena va arriba y el contenido debajo, sin scroll horizontal. La escena se escala al ancho disponible sin deformar los píxeles.
- **Lighthouse móvil de `/casa` y `/en/casa`:**
  - accesibilidad y SEO en 100, CLS 0;
  - rendimiento de 95 o más; hoy está entre 77 y 95 por Pixi, y las portadas pesan.
  - Solo cargan de inmediato las imágenes de la primera habitación; el resto con `loading="lazy"`.
- **Textos** en español y en inglés, en `src/i18n.ts` y `src/data/site*.ts`.

## Enfoques considerados

- **A · PixiJS** (descartado): se redibujaba la escena en el canvas. El rendimiento seguía en 77–95 y cada cosa había que hacerla dos veces, en el canvas y en el HTML accesible.
- **B · HTML y CSS** (elegido): el mismo sistema que `/`, con el contenido como HTML accesible y sin dependencia.
- Dentro de B había dos bocetos:
  - **Casa A · La casa se abre** (descartado): la casa entera en corte; al tocar una habitación, se agranda y muestra lo suyo.
  - **Casa B · El recorrido** (elegido por Bryan): franjas grandes con el contenido siempre a la vista.

## Lo decidido

- **Orden y nombres:** Cuarto («LO QUE JUEGO»), Sala («LO QUE VEO Y LO QUE SUENA»), Mesa de rol («JUEGO Y DIRIJO, EN LÍNEA»).
- **h1:** «La casa, después de las 6». Bajada: «Lo que juego, lo que veo y las partidas de rol.»
- **Contenido:** el de `src/data/site.ts` (`games`, `screens`, `bands`, `rol`); no se agrega ningún título.
- **Se quita el día y la noche** (decisión de Claude, para que Bryan la revise): la casa es siempre de noche, como dice su título. Se va el botón «adelantar reloj». El reloj «TRUJILLO · hh:mm» se queda como detalle del encabezado.
- **Se quitan:**
  - `pixi.js`;
  - `src/scripts/casa/scene.ts` y `src/scripts/casa/boot.ts`;
  - `src/lib/casa/scene.ts` y `src/lib/casa/route.ts`;
  - `src/components/casa/Objetos.astro` y `src/components/casa/Panel.astro`;
  - las partes de `src/scripts/casa/ui.ts` y `src/lib/casa/textos.ts` que solo servían a la escena o al día;
  - los tests de lo que se quita.
- **`/casa-estatica.png` se queda:** la usa la puerta de `/`.
- **SPEC.md:** se actualiza la descripción de `/casa`.
- **`og-casa.png`:** se recaptura con la casa nueva.

## Detalles resueltos en la revisión (decisiones de Claude)

- **Datos:**
  - Juegos y títulos usan el campo `cover?: ImageMetadata` que ya existe en `Credit`.
  - Las bandas pasan de `string[]` a `Credit[]`, con su foto y un enlace «vía Spotify» a su página de artista.
  - Los manuales de rol son 2 `Credit`, con portada y enlace a la página de la editorial.
  - Un test verifica que cada título tenga su imagen.
- **Si falta una imagen:**
  - Si un título no tiene póster en Wikipedia, se propone otra fuente en la lista que aprueba Bryan.
  - Si tampoco hay otra, se muestra una tarjeta con el título, del mismo tamaño que las demás.
  - Las trilogías enlazan a la búsqueda de IMDb como hoy, con el póster de la primera película.
- **Peso:**
  - Los originales se guardan a 600 px de ancho como máximo.
  - Astro genera solo los tamaños que se usan: tira del monitor y de la TV, unos 200 px; grilla, unos 240 px de ancho.
- **Fotos de las bandas:** se toman una sola vez de la imagen pública (`og:image`) de la página de artista de cada banda en Spotify, sin usar credenciales, y se guardan como las demás.
- **Sprites:** no hace falta dibujar ninguno nuevo. Alcanzan las animaciones que ya existen:
  - `sit` para Bryan sentado;
  - `walk` para el pasillo;
  - `action` para el que mueve la cabeza;
  - `idle` para el sofá y la llamada; quien habla se marca con un borde que parpadea.
- **Rotaciones:** son tiras CSS con `steps()`. Las imágenes de las tiras son las chicas (200 px). La del monitor carga de inmediato, porque es la primera habitación; las de la TV y la sala, con `loading="lazy"`.
- **Parlante:**
  - Cuando suena algo, el cuadro de la sala muestra la carátula de Spotify. El texto «canción — artista» sigue en el elemento con `aria-live`; la imagen es decorativa (`alt=""`).
  - Cuando no suena nada, el cuadro rota las fotos de las 5 bandas.
- **Seguridad:** el sitio no tiene CSP (no hay `_headers`), así que la carátula de `i.scdn.co` no necesita ningún permiso.
- **Pruebas:**
  - El mismo nivel de hoy: Vitest con Astro Container para la página, tests de datos y del parlante.
  - Lighthouse móvil 3 veces en `/casa` y `/en/casa` antes del merge.
  - Los tests de lo que se quita se borran.

## Queda al criterio de quien construye

- El dibujo exacto de cada habitación, siguiendo el boceto.
- Cómo escalar la escena al ancho en celular sin deformar los píxeles.
- Los tamaños de las portadas en la grilla y en las tiras.
- Cómo se reparten los componentes.
