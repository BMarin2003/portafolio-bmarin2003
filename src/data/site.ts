import type { ImageMetadata } from 'astro';

export type Person = { name: string; url?: string };
export type People = { companeros: Person[]; supervisores: Person[]; gerentes: Person[] };
export type CorallProject = { name: string; sprite: string; area: string; did: string; challenge?: string; people: People };
export type Oficio = { sprite: string; oficio: string; area: string; tags: string[] };
export type Credit = { title: string; cover?: ImageMetadata; source: string; sourceUrl: string };


const p = (name: string, url?: string): Person => (url ? { name, url } : { name });
const gerentes = [p('Diego Cieza'), p('Alonso Gil')];

export const corall: CorallProject[] = [
  {
    name: 'Totem Multimedia',
    sprite: 'maestro',
    area: 'PRIMER PROYECTO',
    did: 'Mi primer proyecto en CorAll, recién llegado al equipo. Mi labor fue la de desarrollador: construir las funcionalidades que se me asignaban y presentar cada avance al cliente, explicándole con claridad qué cambiaba y por qué. Fue la etapa en que aprendí el oficio dentro de un producto real, con revisión constante y entregas que otras personas iban a usar.',
    challenge: 'adaptarme, recién llegado, a una forma de trabajar muy distinta a la de la universidad: nuevos frameworks y tecnologías, herramientas como Tailscale e Infisical, y aprender a usar bien la IA como herramienta de trabajo. Pasar de un flujo más manual y clásico a este fue mi primer gran aprendizaje en CorAll.',
    people: {
      companeros: [p('Hugo Marquez'), p('Luis Mostacero')],
      supervisores: [p('Kevin Lora'), p('Cristian Ventura')],
      gerentes,
    },
  },
  {
    name: 'CCAE',
    sprite: 'decorador',
    area: 'APORTE PUNTUAL',
    did: 'Sistema de gestión de arbitrajes para una cámara de comercio: solicitudes, partes involucradas, pagos, documentos y el seguimiento de cada trámite. Mi aporte fue acotado y puntual: el diseño de un par de interfaces de su extranet.',
    people: { companeros: [], supervisores: [p('Cristian Ventura')], gerentes },
  },
  {
    name: 'MaqinPro',
    sprite: 'capataz',
    area: 'PLATAFORMA · A MI CARGO',
    did: 'Plataforma de gestión para Maqinpro, empresa de maquinaria industrial y profesional: un panel interno para su taller y un portal desde el que sus clientes siguen sus equipos, aprueban cotizaciones y consultan sus documentos. Fue el proyecto con más personas involucradas y, a mitad de camino, quedó bajo mi responsabilidad. Desde entonces lo llevo adelante, con el apoyo de Luis Hume en el portal del cliente.',
    challenge: 'entender a fondo cómo trabaja el taller y encontrar el equilibrio entre lo que les resulta cómodo y lo que es más eficiente. En el portal, por ejemplo, el cliente entra desde el celular escaneando el QR de su ticket, muchas veces de pie y con una mano. En vez de mostrarle cada etapa interna del taller, que solo lo confundía, las agrupamos en «En proceso en el taller» y siempre le decimos qué sigue.',
    people: {
      companeros: [p('Luis Hume'), p('Adrian Cisneros', 'https://acisneros-portfolio.vercel.app/es'), p('Alfredo Guzman'), p('Angelmauricio Oncoy')],
      supervisores: [p('Luis Mostacero')],
      gerentes,
    },
  },
  {
    name: 'Comphill',
    sprite: 'electricista',
    area: 'CIERRE DE PROYECTO',
    did: 'Sistema integrado de operaciones para el Mercado Mayorista Pesquero COMPHILL: transporte y pesaje, puestos, almacenes, cobros y calidad sanitaria en una sola plataforma. El grueso lo construyó Cristian Ventura; a Luis Mostacero y a mí se nos encargó darle cierre, completando los módulos pendientes: el panel operativo con datos reales, la separación de la información financiera según el rol de cada usuario, el control de acceso en garita con lectores de DNI y QR, y la adaptación del sistema a celulares y tabletas.',
    challenge: 'cerrar un sistema construido en su mayor parte por otra persona: entender cómo venía trabajando, adaptarnos a sus convenciones y completar lo pendiente sin romper lo que ya funcionaba.',
    people: { companeros: [p('Luis Mostacero')], supervisores: [], gerentes },
  },
  {
    name: 'Corall-ERP',
    sprite: 'archivista',
    area: 'ERP INTERNO',
    did: 'El sistema con el que CorAll automatiza y optimiza su propio trabajo, de marketing y finanzas a proyectos e inventario, reunido en una sola plataforma. Aquí el trabajo fue más allá del código: conversé con las personas de cada área para entender sus procesos antes de convertirlos en módulos. Empecé bajo la supervisión de Cristian Ventura y continué con Luis Mostacero tras su ascenso; con la llegada del nuevo equipo de practicantes, el desarrollo ganó un ritmo notable.',
    challenge: 'el área contable, donde había poca experiencia: las detracciones, el marco legal que aplica y qué pagos y gastos corresponden a una PYME. Antes de convertirlo en módulos hubo que aprender esas reglas y comprender a fondo lo que cada área necesitaba, para plasmarlo correctamente en el sistema. Lo resolvimos investigando en equipo y consultando con nuestro supervisor, Cristian Ventura, y con quien entonces llevaba la contabilidad de CorAll.',
    people: {
      companeros: [p('Hugo Marquez'), p('Luis Hume'), p('Adrian Cisneros', 'https://acisneros-portfolio.vercel.app/es'), p('Alfredo Guzman'), p('Angelmauricio Oncoy')],
      supervisores: [p('Cristian Ventura'), p('Luis Mostacero')],
      gerentes,
    },
  },
];

export const oficios: Oficio[] = [
  { sprite: 'capataz', oficio: 'Capataz', area: 'Planificación y método', tags: ['PMBOK', 'ITIL', 'Scrum', 'Jira', 'Trello'] },
  { sprite: 'maestro', oficio: 'Maestro de obra', area: 'Backend y datos', tags: ['Java / Spring', 'Bun / Elysia', 'Node.js', 'FastAPI', 'PostgreSQL', 'MySQL'] },
  { sprite: 'decorador', oficio: 'Decorador', area: 'Frontend y diseño', tags: ['React', 'Angular', 'Astro', 'Ant Design', 'Tailwind'] },
  { sprite: 'electricista', oficio: 'Electricista', area: 'Infraestructura y despliegue', tags: ['Docker', 'Cloudflare', 'AWS', 'Nginx', 'Terraform', 'Jenkins'] },
  { sprite: 'doble', oficio: 'Doble de riesgo', area: 'Calidad y seguridad', tags: ['Pruebas e2e', 'Caja negra', 'Caja blanca', 'Postman'] },
  { sprite: 'archivista', oficio: 'Archivista', area: 'Documentación y conocimiento', tags: ['Obsidian', 'Notion', 'Markdown'] },
];

// Hueco a propósito: el guard de corchetes bloquea `npm run build` hasta que Bryan lo escriba.
export const comoTrabajo = '[Tu párrafo: cómo trabajas con Claude, dónde la IA no alcanza y lo resuelves tú, y cómo aprendes usándola.]';

const steam = (title: string, id: number): Credit => ({
  title,
  source: 'Steam',
  sourceUrl: `https://store.steampowered.com/app/${id}/`,
});

export const games: Credit[] = [
  steam('RimWorld', 294100),
  steam('Mount & Blade: Warband', 48700),
  steam('Crusader Kings II', 203770),
  steam('Crusader Kings III', 1158310),
  steam('Project Zomboid', 108600),
  steam('Fallout 4', 377160),
  steam('Fallout: New Vegas', 22380),
];

const imdb = (title: string, url: string): Credit => ({ title, source: 'IMDb', sourceUrl: url });
const imdbTitle = (title: string, id: string) => imdb(title, `https://www.imdb.com/title/${id}/`);
// Las trilogías no tienen una página de título propia: enlazan a la búsqueda.
const imdbSearch = (title: string, query = title) =>
  imdb(title, `https://www.imdb.com/find/?q=${encodeURIComponent(query)}&s=tt`);

export const screens: Credit[] = [
  imdbTitle('Django sin cadenas', 'tt1853728'),
  imdbTitle('The Batman', 'tt1877830'),
  imdbTitle('Superman (2025)', 'tt5950044'),
  imdbSearch('El Señor de los Anillos (trilogía)', 'The Lord of the Rings'),
  imdbSearch('Las Crónicas de Narnia (trilogía)', 'The Chronicles of Narnia'),
  imdbTitle('Andor', 'tt9253284'),
  imdbTitle('Vinland Saga', 'tt10233448'),
  imdbTitle('Power Rangers SPD', 'tt0414762'),
  imdbTitle('The Walking Dead', 'tt1520211'),
  imdbTitle('Game of Thrones', 'tt0944947'),
  imdbTitle('Brooklyn Nine-Nine', 'tt2467372'),
];

export const bands: string[] = ['Enjambre', 'Los Bunkers', 'Rio', 'Enanitos Verdes', 'Jamiroquai'];

export const rol: string[] = ['D&D', 'Cyberpunk RED'];

export const links = {
  github: 'https://github.com/BMarin2003',
  linkedin: 'https://www.linkedin.com/in/bmarin2003',
};
