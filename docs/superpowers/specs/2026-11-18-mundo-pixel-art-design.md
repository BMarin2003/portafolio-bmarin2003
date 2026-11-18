# Mundo pixel art: página profesional y casa habitada

Fecha: 2026-11-18 · Estado: borrador para aprobación de Bryan
Specs vigentes: [`SPEC.md`](../../../SPEC.md), [`architecture.md`](../../../architecture.md). Este diseño las cambia (ver «Cambios a las specs»).

## Intención

El sitio publicado es fiel al boceto B, pero Bryan lo siente **simple y estático, como un wireframe**. Quiere una **escena habitada donde pasan cosas**: personitas pixel art que hacen cosas, como las «oficinas de agentes» y los pueblos de agentes que vio. Sin perder que el portafolio siga siendo una **vista profesional** para reclutadores.

## Decisiones de Bryan

- **Dos páginas.** `/` es la profesional y es lo primero que se ve. `/casa` es la personal.
- **Profesional, al estilo Kiri:** los muñequitos van de decoración y de guía mientras se navega; el contenido manda.
- **Personal:** la casa con ciclo de día y noche y elementos animados que van mostrando la información.
- **Pixel art 100 % original, dibujado con código** por Claude. Nada de packs comprados, assets de terceros ni generadores de imagen de pago.
- **Motor de juego para la casa** (la opción 3 de las conversadas): las personitas se mueven solas por la escena.

## Objetivos

- Que la casa se sienta viva: personitas que caminan, se sientan, juegan y tiran dados, y luz que cambia con la hora.
- Que la página profesional tenga vida sin costar legibilidad: un reclutador entiende en 10 segundos quién es Bryan, qué hizo en CorAll y cómo trabaja.
- Un mismo mundo visual en las dos páginas: el muñequito que guía en `/` es el mismo que vive en `/casa`.

## No-objetivos

- No es un juego: no hay controles de personaje, puntajes ni niveles.
- No se agregan proyectos ni contenido nuevo fuera de lo que Bryan dé (regla de memoria `portfolio-content-rules`).

## Anti-objetivos (fracaso aunque funcione)

- Que la página profesional pese o tarde: el motor de juego **nunca** carga en `/`.
- Que un reclutador tenga que «jugar» para encontrar los proyectos.
- Arte que parezca copiado de un juego o de un pack conocido.
- Que la casa sea inaccesible: sin teclado, sin lector de pantalla o mareando a quien pidió menos movimiento.

## Restricciones (heredadas, siguen vigentes)

Todo lo de `SPEC.md` y `architecture.md`: material real, CorAll sin código, crédito a Claude, arte ajeno con crédito, contraste ≥ 4.5:1, `prefers-reduced-motion`, sin JavaScript se ve el contenido, el token de Spotify no llega al navegador, la guardia de corchetes y el deploy por GitHub Actions.

## Enfoques considerados

| Tema | Opciones | Elegido y por qué |
|---|---|---|
| Origen del arte | Pack LimeZu (pago, no redistribuible en repo público) · Kenney CC0 (genérico) · Aseprite + MCP · generadores con IA (API de pago, inconsistentes) · **pixel art como código** | **Código**: gratis, original, versionado como texto en el repo público, y Claude puede revisar cada PNG que genera. La prueba con ponytail (16×16, caminata de 4 cuadros) salió legible. Aseprite + MCP queda como mejora si una animación se complica. |
| Técnica en `/` | **CSS (sprites con `steps()`) + IntersectionObserver** · canvas | CSS: liviano, accesible, mantiene Lighthouse alto. |
| Técnica en `/casa` | CSS · **PixiJS** · Phaser | **PixiJS**: dibuja sprites y anima muchas personitas a la vez. Más chico que Phaser y sin traer un sistema de juego que no se usa. Se carga solo en `/casa`. *(Decisión mía.)* |

## Diseño

### El mundo pixel art (común a las dos páginas)

- **Grilla base de 16 px**, siempre escalada por enteros (×3 o ×4), con `image-rendering: pixelated`.
- **Paleta limitada** que sale de la actual (fondo `#11151B`, ámbar `#D9A55B`, los 5 colores de la cuadrilla) más los tonos de piel, madera y luz que haga falta. Todo color nuevo pasa el contraste cuando hay texto encima.
- **Lección de la prueba:** sobre fondo oscuro, el contorno no puede ser casi negro, porque se pierde. Los personajes llevan un borde de luz (*rim*) o un contorno de color.
- **Personajes (revisado con Bryan el 2026-11-18):** Bryan y una cuadrilla de **oficios de obra**, cada uno un área de desarrollo. Nunca llevan el nombre de una herramienta: ni publicidad ni un stack fijo. La lista crece con la experiencia de Bryan.
  - Capataz: planificación y método.
  - Maestro de obra: backend y datos.
  - Decorador: frontend y diseño.
  - Electricista: infraestructura y despliegue.
  - Doble de riesgo: calidad y seguridad.
  - Archivista: documentación y conocimiento.

  La silueta es de bloque: cuerpo cuadrado, salientes laterales y patitas. Es propia, no una copia de la mascota de Claude Code. Cada oficio tiene su color, su indumentaria y su acción. Animaciones mínimas: reposo con parpadeo, caminar (4 cuadros) y la acción propia (2 a 4 cuadros). Las tecnologías de cada oficio (etiquetas en la página profesional) las confirma Bryan en la fase 2.

### Flujo de los assets

- Cada sprite vive como **texto** en `art/`: una paleta y grillas de un carácter por píxel, un archivo por personaje u objeto.
- Un script (`scripts/build-sprites.mjs`, solo con Node, sin dependencias) genera las hojas PNG y un JSON con los cuadros en `public/sprites/`. Corre antes de `astro build`, local y en CI.
- Un test valida que cada cuadro tenga el tamaño correcto y use solo colores de su paleta.
- Por cada personaje se genera una hoja de vista previa ampliada, para que Claude la revise y Bryan la apruebe antes de usarla.

### Página profesional (`/`)

- Mantiene el contenido profesional actual: presentación, proyectos de CorAll con sus retos, la cuadrilla y los enlaces. *(Decisión mía.)*
- **La casa en corte y la sección del cuarto se mudan a `/casa`.** En `/` queda una portada nueva: el nombre y una escena chica de la cuadrilla trabajando, más la puerta a la casa. El parlante de Spotify también se muda a `/casa`.
- **Los muñequitos guían:** aparecen al hacer scroll. Cada proyecto tiene al lado a quien lo acompaña trabajando; en «La cuadrilla» cada skill hace su manía; y una puerta pixel art al final, «después de las 6 →», lleva a `/casa`.
- Diseño más rico que el actual (que hoy parece wireframe): composición, jerarquía y detalle con aire de producto, como Kiri. **Se boceta primero** y Bryan lo aprueba antes de construir.
- Sin canvas. Debe seguir en Lighthouse móvil ≥ 90 en rendimiento y ≥ 95 en accesibilidad y SEO.

### Página personal (`/casa`)

- **Escena en canvas con PixiJS:** la casa en corte, viva.
  - Cuarto con PC, TV, parlante y mesa de rol, que ya existen como contenido.
  - Habitaciones propuestas, que Bryan confirma: estante de libros de historia (está en su README) y algo que represente la música.
- **Personitas** que se mueven entre puntos de interés con rutas definidas a mano. No hace falta una librería de búsqueda de caminos. Ejemplos: Bryan va de la PC a la mesa de rol y alguien tira dados.
- **Ciclo de día y noche** según la hora real de Trujillo (UTC-5), para que sea «lo que pasa en mi casa ahora», igual que Spotify. Un control permite adelantar el reloj para ver el ciclo completo. *(Decisión mía.)*
- **Objetos que muestran información:** al pasar el mouse o tocar la PC, la TV, el parlante o la mesa, se abre un panel con la información que hoy está en el cuarto.
  - Pantallas con el título y un ícono pixel art original del género. No se recrean portadas de juegos ni pósters: serían copias de arte ajeno. *(Decisión mía.)*
  - El parlante con Spotify en vivo.
- **Accesibilidad:**
  - El canvas es decorativo (`aria-hidden`). En paralelo hay una lista real de botones, uno por objeto, que abre el mismo panel con teclado.
  - Con `prefers-reduced-motion`, la escena queda quieta y el ciclo no corre.
  - Sin JavaScript se ve una imagen estática de la casa más la lista con toda la información.
- PixiJS se importa solo en `/casa`.
- **Celular:** la escena se escala para entrar al ancho de la pantalla y se puede deslizar si hace falta. El boceto lo define. La lista accesible está siempre debajo.
- **Pruebas:**
  - Tests unitarios de la lógica pura: hora → fase del día, rutas de las personitas y selección de objetos.
  - La escena se verifica en el navegador.
- **Imagen para compartir:** `/casa` tiene su propio `og.png`.

### Cambios a las specs

- `SPEC.md`: dos páginas, mundo pixel art original y casa habitada.
- `architecture.md`: PixiJS solo en `/casa`, el flujo de assets como código y las nuevas invariantes:
  - el motor no carga en `/`;
  - el canvas siempre tiene su equivalente accesible.

## Qué queda a criterio del constructor

- La distribución exacta de las habitaciones y las rutas de las personitas, sobre el boceto aprobado.
- La escala (×3 o ×4) según el ancho de pantalla.
- La organización interna de los archivos en `art/`, siempre que se cumpla «un archivo por personaje u objeto».

## Lo que tiene que dar Bryan

- La aprobación de los bocetos de las dos páginas y de cada personaje.
- La confirmación de las habitaciones extra de la casa.
- El párrafo de cómo trabaja con IA y cómo aprende usándola (consejo del entrevistador), que va en la página profesional.
