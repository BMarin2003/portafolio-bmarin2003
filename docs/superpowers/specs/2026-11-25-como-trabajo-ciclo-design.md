# Cómo trabajo de `/`: el ciclo

Fecha: 2026-11-25 · Rama: `feat/como-trabajo` · Boceto aprobado con sus textos: lienzo «Portafolio · 3 bocetos», artboard `IaCiclo.dc.html`.

## Para qué

El párrafo de Bryan dice que la IA no entiende, decide ni revisa por él. La sección lo demuestra con el proceso real con que se construyó este sitio, y enlaza la evidencia en su repositorio público.

## Objetivos

- Debajo del párrafo (sin cambios), 4 pasos: Entender, Decidir, Construir junto a Claude, Revisar. Cada paso con el monigote de su área (documentación, planificación, backend, calidad), una frase y una prueba del hero que enlaza a su evidencia.
- Una cinta de madera bajo los monigotes, con un bloque que viaja de paso en paso (solo CSS; quieto con movimiento reducido).
- Un cierre que enlaza a la carpeta de diseños y planes del repo.

## No-objetivos y anti-objetivos

- No nombrar skills ni herramientas como publicidad; Claude sí se nombra.
- Sin cifras fijas: la prueba del paso 4 dice «Este sitio: los tests corren en cada deploy», para que no quede vieja.
- Sin JavaScript nuevo en `/`.

## Textos (aprobados en el boceto; inglés con el mismo criterio que `/en/`)

| Paso | Frase (es) | Prueba (es) | Enlace |
|---|---|---|---|
| Entender | Antes de escribir código: qué se necesita, para quién y con qué datos reales. | Portada del sitio: la referencia fue runkiri.com | diseño del hero |
| Decidir | Bocetos para comparar y un diseño escrito que apruebo antes de construir. | Portada del sitio: 2 bocetos, elegí la mezcla y aprobé el diseño | diseño del hero |
| Construir junto a Claude | Un plan por tareas chicas, cada una con sus tests escritos antes del código. | Portada del sitio: plan de 4 tareas | plan del hero |
| Revisar | Code review por tarea y del cambio completo; mido y verifico en vivo. | Este sitio: los tests corren en cada deploy | ejecuciones de GitHub Actions |

| Step | Sentence (en) | Evidence (en) |
|---|---|---|
| Understand | Before writing code: what is needed, for whom and with what real data. | Site header: the reference was runkiri.com |
| Decide | Sketches to compare and a written design I approve before building. | Site header: 2 sketches, I picked the mix and approved the design |
| Build alongside Claude | A plan of small tasks, each with its tests written before the code. | Site header: a 4-task plan |
| Review | Code review per task and of the whole change; I measure and verify live. | This site: tests run on every deploy |

Cierre: «El diseño y el plan de cada parte de este sitio están en su repositorio: ver el proceso en GitHub →» / «The design and plan of every part of this site are in its repository: see the process on GitHub →».

Enlaces (repo público `BMarin2003/portafolio-bmarin2003`, rama `main`):
- diseño del hero: `docs/superpowers/specs/2026-11-23-hero-obra-viva-design.md`
- plan del hero: `docs/superpowers/plans/2026-11-23-hero-obra-viva.md`
- GitHub Actions: `/actions`
- carpeta: `docs/superpowers`

## Diseño

- Escritorio: 4 columnas sobre la cinta; celular (≤ 860 px): una columna, sin cinta ni bloque.
- Cada paso es un `<article>` con su `h3`; monigotes, cinta y bloque son decorativos.
- Solo se animan `transform` y `background-position`.

## Enfoques considerados

- **A. El ciclo** (elegido). **B. La bitácora** (línea de tiempo de todo el rediseño): descartado, repite la forma de Proyectos.
