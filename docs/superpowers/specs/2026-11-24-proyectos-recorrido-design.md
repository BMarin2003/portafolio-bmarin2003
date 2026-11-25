# Proyectos de `/`: el recorrido

Fecha: 2026-11-24 · Rama: `feat/proyectos-recorrido` · Boceto aprobado: lienzo «Portafolio · 3 bocetos», artboard `ProyB.dc.html`.

## Para qué

Que quien pase por Proyectos en 10 segundos se quede con la información general de cada proyecto y con el recorrido de Bryan en CorAll, como en los portafolios de referencia (midudev, Brittany Chiang, adevsays). Hoy la sección son 5 tarjetas con unas 690 palabras, todas a la vista.

## Objetivos

- Una línea de tiempo vertical, en orden cronológico, con las tarjetas a un lado y otro de la línea (en el celular, todas de un lado).
- A la vista, por proyecto: período, cantidad de commits de Bryan, rol (`area`), nombre, una frase de resumen, etiquetas de tecnología y el monigote de su oficio.
- «Qué hice y con quién» (el texto de siempre, las personas y «El reto») se abre al tocar.
- La sección se mueve: Bryan camina por la línea y cada proyecto entra al llegar a la pantalla.

## No-objetivos

- Cambiar los textos largos (`did`, `challenge`) o las personas: se conservan, en los dos idiomas.
- Agregar proyectos o capturas.

## Anti-objetivos

- Esconder contenido sin JavaScript: el detalle se abre con `<details>`, que funciona sin scripts.
- Que `/` cargue más JavaScript: el movimiento es CSS.
- Datos inventados: períodos, commits y tecnologías salen de los commits de Bryan en los repos de CorAll-Software (consultados el 2026-11-24).

## Datos (confirmados por Bryan)

| Proyecto | Desde | Hasta | Commits | Tecnologías |
|---|---|---|---|---|
| Totem Multimedia | 2026-02 | 2026-04 | 259 | React, Ant Design, Bun, Elysia, PostgreSQL |
| CCAE | 2026-03 | 2026-03 | 9 | React, Ant Design |
| Corall-ERP | 2026-04 | hoy | 581 | React, Ant Design, Bun, Elysia, PostgreSQL, Drizzle |
| MaqinPro | 2026-08 | hoy | 1493 | React, Ant Design, Bun, Elysia, PostgreSQL, Drizzle, Playwright |
| Comphill | 2026-09 | 2026-10 | 136 | React, Ant Design, Bun, Elysia, PostgreSQL |

Frases de resumen (español, redactadas desde los textos de Bryan y mostradas en el boceto):
- Totem: «Mi primer proyecto en CorAll: construí funcionalidades y presenté cada avance al cliente.»
- CCAE: «Diseñé un par de interfaces de la extranet de un sistema de arbitrajes.»
- Corall-ERP: «El ERP con el que CorAll organiza su trabajo; levanté los procesos de cada área antes de convertirlos en módulos.»
- MaqinPro: «La plataforma de un taller de maquinaria y el portal de sus clientes. A mitad de camino quedó a mi cargo.»
- Comphill: «Con Luis Mostacero cerramos el sistema de operaciones de un mercado mayorista que había construido otra persona.»

Entradilla de la sección: «Desde que llegué a CorAll, en orden: lo que hice en cada obra y con quién.» El inglés se traduce con el mismo criterio que el resto de `/en/`.

## Enfoques considerados

- **A. La obra por pisos** (más reciente arriba): descartado por Bryan en el boceto.
- **B. El recorrido** (elegido): línea central cronológica con tarjetas alternadas.
- **C. Tarjetas compactas en grilla**: descartado, no cuenta una historia.

## Diseño

- **Orden:** por fecha de inicio (`desde`), no por el orden del arreglo de datos.
- **Período:** mes abreviado y año, en el idioma de la página («feb – abr 2026», «abr 2026 – hoy»; en inglés «Feb – Apr 2026», «Apr 2026 – present»). Si empieza y termina el mismo mes, un solo mes.
- **Movimiento, solo CSS:** cada proyecto entra al aparecer en pantalla y Bryan recorre la línea según el scroll (animaciones ligadas al scroll, `animation-timeline`). Donde el navegador no las soporta, todo queda visible y quieto. Con `prefers-reduced-motion`, quieto.
- **Detalle:** `<details>` con «qué hice y con quién» / «what I did and with whom»; adentro, el texto de siempre, la frase de personas y «El reto».
- **Accesibilidad:** cada proyecto es un `<article>` con su `h3`; la línea, los nodos y los monigotes son decorativos.

## Queda a criterio de quien construye

- Cómo se modelan período, commits, resumen y etiquetas en los datos (sin duplicar entre idiomas lo que no es texto).
- Tiempos y curvas de las animaciones, mientras se vean como en el boceto.
