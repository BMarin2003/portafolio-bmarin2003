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
- Números fijos del hero (184 tests al publicarlo): no se actualizan con el sitio.
- Sin JavaScript nuevo en `/`.

## Textos (aprobados en el boceto; inglés con el mismo criterio que `/en/`)

| Paso | Frase (es) | Prueba (es) | Enlace |
|---|---|---|---|
| Entender | Antes de escribir código: qué se necesita, para quién y con qué datos reales. | En el hero: la referencia fue runkiri.com | diseño del hero |
| Decidir | Bocetos para comparar y un diseño escrito que apruebo antes de construir. | En el hero: 2 bocetos, elegí la mezcla y aprobé el diseño | diseño del hero |
| Construir junto a Claude | Un plan por tareas chicas, cada una con sus tests escritos antes del código. | En el hero: plan de 4 tareas | plan del hero |
| Revisar | Revisión de cada tarea y de todo el cambio, medición y verificación en vivo. | En el hero: 184 tests y Lighthouse móvil 100 | ejecuciones de GitHub Actions |

| Step | Sentence (en) | Evidence (en) |
|---|---|---|
| Understand | Before writing code: what is needed, for whom and with what real data. | In the hero: the reference was runkiri.com |
| Decide | Sketches to compare and a written design I approve before building. | In the hero: 2 sketches, I picked the mix and approved the design |
| Build alongside Claude | A plan of small tasks, each with its tests written before the code. | In the hero: a 4-task plan |
| Review | A review of each task and of the whole change, measurement and live verification. | In the hero: 184 tests and mobile Lighthouse 100 |

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
