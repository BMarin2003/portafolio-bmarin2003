# Hero de `/`: la obra viva

Fecha: 2026-11-23 · Rama: `feat/hero-obra` · Bocetos: lienzo «Portafolio · 3 bocetos», artboards Hero A y Hero B.

## Para qué

Bryan quiere que el portafolio se vea vivo y hecho con oficio, no como un wireframe: monigotes trabajando de fondo, como en runkiri.com, y animaciones con impacto. El hero es lo primero que ven los amigos y los reclutadores, por eso va primero en el rediseño por apartados.

## Objetivos

- Una obra grande de fondo, detrás del texto, con los seis oficios y Bryan trabajando todo el tiempo (Hero A).
- En la primera visita la obra se arma antes de quedar trabajando: crecen las columnas, los pisos bajan de la grúa, la cuadrilla llega piso por piso y el título se revela en bloques (Hero B).
- Al pasar el cursor, o el foco, sobre un monigote, se detiene y dice su oficio. Al hacer clic, reacciona.

## No-objetivos

- Rediseñar el resto de `/` o `/casa`: cada apartado va después, uno a la vez.
- Cambiar textos: el contenido del hero queda igual, en español y en inglés.

## Anti-objetivos (sería un fracaso aunque funcione)

- Que el texto cueste leerse por la escena.
- Que `/` deje de verse completa sin JavaScript, o que baje de 95 en rendimiento móvil.
- Arte que no esté dibujado con código: Higgsfield y 21st.dev solo como referencia.
- Que la entrada se repita cada vez que alguien vuelve a la página y estorbe.

## Restricciones

- Sprites existentes (`art/sprites`), animados con CSS `steps()` como hoy. La escena es HTML y CSS; nada de canvas ni PixiJS en `/`.
- Con `prefers-reduced-motion` la obra aparece armada y quieta.
- La escena es decorativa (`aria-hidden`), salvo los monigotes, que son botones con su oficio como nombre accesible.
- Los rótulos de oficio salen de `oficios` en los datos, en el idioma de la página.
- Sin CLS: la escena ocupa su lugar desde el primer pintado.
- El LCP no debe esperar a la revelación del título: la revelación es corta (≤ 0,6 s) o el título no la usa en pantallas chicas.

## Enfoques considerados

- **A. Solo CSS.** Mantiene `/` sin JavaScript, pero la escena no reacciona al visitante y la entrada se repetiría en cada visita.
- **A + un script chico (elegido por Bryan).** El CSS hace todo lo visible; un script propio, diferido y de pocos KB, solo suma lo que el CSS no puede: saltarse la entrada en visitas repetidas de la misma sesión, la reacción al clic y pausar las animaciones cuando el hero sale de la pantalla.
- **C. PixiJS en `/`.** Descartado: unos 300 KB más y el rendimiento bajaría a unos 85.

## Diseño

- **Composición:** la obra de Hero A ocupa todo el ancho del hero, anclada abajo a la derecha; un velo la apaga hacia el texto. En pantallas chicas la obra queda detrás, más apagada.
- **Entrada (primera visita de la sesión):** el orden de Hero B, aplicado a la obra de fondo: columnas, pisos de abajo hacia arriba, cuadrilla, y después el trabajo en bucle. Unos 3 a 4 segundos en total.
- **Trabajo en bucle:** los recorridos de Hero A (capataz, escalera, pared que se pinta, grúa, salto del doble, polvo y chispas), con Bryan en la obra.
- **Interacción:** hover y foco muestran el oficio; el clic hace una reacción corta (salto o saludo).
- **Cambio de regla:** el invariante «`/` no carga scripts de cliente propios» pasa a «`/` carga solo un script chico y diferido; sin él todo se ve igual». Se actualiza `architecture.md`.

## Queda a criterio de quien construye

- Los recorridos exactos, tiempos y posiciones, mientras se vean como en los bocetos.
- Qué reacción tiene cada oficio al clic.
- Cómo se reparte la escena entre componentes y CSS.
