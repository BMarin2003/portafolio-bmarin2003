---
id: portfolio
type: goal-and-requirements
status: active
title: Portafolio de Bryan Marin — la obra y la casa
---

## Objetivo

Un sitio que presente a Bryan Marin en lo profesional y en lo personal, para que quien llegue sepa qué construye, cómo trabaja y quién es fuera de horario.

## Problema

Bryan no tiene presencia profesional pública. Su README de GitHub es personal, y su trabajo principal (CorAll D&R) no se puede mostrar en código. Sus amigos y los reclutadores no tienen dónde verlo completo.

## Para quién

- **Amigos y conocidos**, que llegan cuando Bryan publica el portafolio (LinkedIn, redes).
- **Reclutadores y empresas**, que llegan cuando Bryan se postula.

Ambos deben conocerlo en lo profesional y en lo personal; ninguno de los dos lados se esconde.

## Principios

- **Dos páginas.** `/` es la profesional y lo primero que se ve: manda el contenido y los muñequitos acompañan. `/casa` es la personal, de noche, con lo que Bryan hace después de las 6. Cada una lleva a la otra.
- **Un mundo pixel art original.** El arte del mundo, personajes y escenas, es 100 % original y está dibujado con código: nada de packs, assets de terceros ni generadores de imagen. Es el mismo muñequito en las dos páginas. Sobrio: se mueve poco y respeta `prefers-reduced-motion`.
- **La cuadrilla son oficios de obra, nunca herramientas.** Cada oficio es un área de desarrollo de Bryan; ninguno lleva el nombre de una herramienta, de una marca ni de un stack fijo.
- **Material real, siempre.** Nada inventado: ni cifras, ni descripciones, ni personas. Lo que Bryan no ha dado no se publica.
- **Bryan decide qué proyectos aparecen.** No se lista ninguno sin su confirmación. Quedan fuera Agrotrack (inconcluso y dependía de hardware ajeno), los proyectos de Calradia (primero tienen que existir como paper) y KenshiCoop (no es suyo).
- **Lo de CorAll se cuenta, no se expone.** Ni código, ni repos, ni capturas internas. De cada proyecto va qué hizo Bryan y con quién. Las personas se nombran solo como "mis estimados compañeros …, supervisores … y gerentes …", con enlace a su portafolio si tienen uno.
- **Claude, dicho abiertamente.** Bryan trabaja junto a Claude y el sitio lo dice, junto a cómo aprende usándolo. Claude no es un integrante de la cuadrilla.
- **El arte ajeno lleva crédito.** Las portadas de juegos y los pósters de series y películas son de terceros: cada uno lleva su crédito y enlaza a su página oficial.

## Capacidades

- **`/` (profesional):**
  - Presentación con una escena de la cuadrilla trabajando.
  - Proyectos de CorAll en los que Bryan formó parte: Totem Multimedia, CCAE, MaqinPro, Comphill y Corall-ERP. Cada uno lleva su oficio, cuenta qué hizo Bryan y, cuando él lo da, "el reto": un obstáculo concreto y cómo se resolvió.
  - Los seis oficios con sus etiquetas de tecnologías: Capataz (planificación y método), Maestro de obra (backend y datos), Decorador (frontend y diseño), Electricista (infraestructura y despliegue), Doble de riesgo (calidad y seguridad) y Archivista (documentación y conocimiento). La lista crece con la experiencia de Bryan.
  - "Con IA, sin dejar de aprender": cómo trabaja con Claude, dónde la IA no alcanza y cómo aprende usándola.
  - La puerta a la casa.
- **`/casa` (personal):** la casa de Bryan vista en corte, con la biblioteca, el parlante, el cuarto (la PC y la TV) y la mesa de rol con dados. Es una escena animada en PixiJS, con día y noche según la hora real de Trujillo, encima de una página accesible que dice lo mismo en el DOM: el reloj, un botón por objeto y un panel por objeto. Sin escena (sin JavaScript, con `prefers-reduced-motion` o si la carga falla) queda la imagen estática de la casa de noche.
  - Rol (mesa de rol): D&D primero, después Cyberpunk RED.
  - Juegos (PC): RimWorld, Mount & Blade: Warband, Crusader Kings II y III, Project Zomboid, Fallout 4 y Fallout: New Vegas, como lista con portadas.
  - Series y películas (TV): Django sin cadenas, The Batman, Superman (2025), la trilogía de El Señor de los Anillos, la trilogía de Las Crónicas de Narnia, Andor, Vinland Saga, Power Rangers SPD, The Walking Dead, Game of Thrones y Brooklyn Nine-Nine, como lista con pósters.
  - Estante: «Leo sobre historia».
  - El parlante muestra lo que Bryan escucha en Spotify en ese momento. Si no suena nada, rota entre Enjambre, Los Bunkers, Rio, Enanitos Verdes y Jamiroquai. Es lo único que rota.
- **Enlaces** a GitHub y LinkedIn.
- **En español.** El inglés se suma antes de que Bryan empiece a postular.

## No-objetivos

- Mostrar código, repositorios o pantallas internas de CorAll.
- Listar toda la biblioteca de Steam: solo los títulos que Bryan destacó.
- Estética de terminal: es la del portafolio de Adrian Cisneros, y este busca otra.
