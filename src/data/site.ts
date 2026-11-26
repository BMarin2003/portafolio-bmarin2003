import type { ImageMetadata } from 'astro';
import rimworld from '../assets/casa/rimworld.jpg';
import warband from '../assets/casa/mount-blade-warband.jpg';
import ck2 from '../assets/casa/crusader-kings-ii.jpg';
import ck3 from '../assets/casa/crusader-kings-iii.jpg';
import zomboid from '../assets/casa/project-zomboid.jpg';
import fallout4 from '../assets/casa/fallout-4.jpg';
import falloutNv from '../assets/casa/fallout-new-vegas.jpg';
import django from '../assets/casa/django-sin-cadenas.jpg';
import batman from '../assets/casa/the-batman.jpg';
import superman from '../assets/casa/superman-2025.jpg';
import anillos from '../assets/casa/el-senor-de-los-anillos.jpg';
import narnia from '../assets/casa/las-cronicas-de-narnia.jpg';
import andor from '../assets/casa/andor.png';
import vinland from '../assets/casa/vinland-saga.png';
import spd from '../assets/casa/power-rangers-spd.png';
import brooklyn from '../assets/casa/brooklyn-nine-nine.png';
import enjambre from '../assets/casa/enjambre.jpg';
import bunkers from '../assets/casa/los-bunkers.jpg';
import rio from '../assets/casa/rio.jpg';
import enanitos from '../assets/casa/enanitos-verdes.jpg';
import jamiroquai from '../assets/casa/jamiroquai.jpg';

export type Person = { name: string; url?: string };
export type People = { companeros: Person[]; supervisores: Person[]; gerentes: Person[] };
export type CorallProject = { name: string; sprite: string; area: string; did: string; challenge?: string; people: People; desde: string; hasta?: string; commits: number; resumen: string; stack: string[] };
/** Un área de trabajo de Bryan: el monigote no lleva nombre propio, solo su área. `cert`: formación verificable del área. */
export type Oficio = { sprite: string; area: string; tags: string[]; cert?: string };
export type Credit = { title: string; cover?: ImageMetadata; source: string; sourceUrl: string };


const p = (name: string, url?: string): Person => (url ? { name, url } : { name });
const gerentes = [p('Diego Cieza'), p('Alonso Gil')];

export const corall: CorallProject[] = [
  {
    name: 'Totem Multimedia',
    desde: '2026-02',
    hasta: '2026-04',
    commits: 259,
    resumen: 'Mi primer proyecto en CorAll: construí funcionalidades y presenté cada avance al cliente.',
    stack: ['React', 'Ant Design', 'Bun', 'Elysia', 'PostgreSQL'],
    sprite: 'maestro',
    area: 'DESARROLLADOR',
    did: 'Mi rol fue de desarrollador: construir las funcionalidades asignadas y presentar cada avance al cliente, explicando qué cambiaba y por qué. Fue mi primer producto real, con revisión constante y entregas para usuarios finales.',
    challenge: 'adaptarme a una forma de trabajar muy distinta a la de la universidad: frameworks y tecnologías nuevas, herramientas como Tailscale e Infisical y la IA bien usada como herramienta de trabajo.',
    people: {
      companeros: [p('Hugo Marquez'), p('Luis Mostacero')],
      supervisores: [p('Kevin Lora'), p('Cristian Ventura')],
      gerentes,
    },
  },
  {
    name: 'CCAE',
    desde: '2026-03',
    hasta: '2026-03',
    commits: 9,
    resumen: 'Diseñé un par de interfaces de la extranet de un sistema de arbitrajes.',
    stack: ['React', 'Ant Design'],
    sprite: 'decorador',
    area: 'DISEÑO DE UI',
    did: 'Sistema de gestión de arbitrajes para una cámara de comercio: solicitudes, partes involucradas, pagos, documentos y el seguimiento de cada trámite. Mi aporte fue acotado y puntual: el diseño de un par de interfaces de su extranet.',
    people: { companeros: [], supervisores: [p('Cristian Ventura')], gerentes },
  },
  {
    name: 'MaqinPro',
    desde: '2026-08',
    commits: 1493,
    resumen: 'Plataforma de un taller de maquinaria y portal de sus clientes; a mi cargo desde la mitad del proyecto.',
    stack: ['React', 'Ant Design', 'Bun', 'Elysia', 'PostgreSQL', 'Drizzle', 'Playwright'],
    sprite: 'capataz',
    area: 'PLATAFORMA · A MI CARGO',
    did: 'Plataforma de gestión para Maqinpro, empresa de maquinaria industrial y profesional: un panel interno para su taller y un portal donde sus clientes siguen sus equipos, aprueban cotizaciones y consultan documentos. Es el proyecto con más personas involucradas; desde la mitad del proyecto es mi responsabilidad, con el apoyo de Luis Hume en el portal del cliente.',
    challenge: 'entender a fondo cómo trabaja el taller y encontrar el equilibrio entre lo que les resulta cómodo y lo que es más eficiente. En el portal, por ejemplo, el cliente entra desde el celular escaneando el QR de su ticket, muchas veces de pie y con una mano. En vez de mostrarle cada etapa interna del taller, que solo lo confundía, las agrupamos en «En proceso en el taller» y siempre le decimos qué sigue.',
    people: {
      companeros: [p('Luis Hume'), p('Adrian Cisneros', 'https://acisneros-portfolio.vercel.app/es'), p('Alfredo Guzman'), p('Angelmauricio Oncoy')],
      supervisores: [p('Luis Mostacero')],
      gerentes,
    },
  },
  {
    name: 'Comphill',
    desde: '2026-09',
    hasta: '2026-10',
    commits: 136,
    resumen: 'Con Luis Mostacero cerramos el sistema de operaciones de un mercado mayorista que había construido otra persona.',
    stack: ['React', 'Ant Design', 'Bun', 'Elysia', 'PostgreSQL'],
    sprite: 'electricista',
    area: 'CIERRE DE PROYECTO',
    did: 'Sistema integrado de operaciones para el Mercado Mayorista Pesquero COMPHILL: transporte y pesaje, puestos, almacenes, cobros y calidad sanitaria en una sola plataforma. El grueso lo construyó Cristian Ventura; a Luis Mostacero y a mí se nos encargó darle cierre, completando los módulos pendientes: el panel operativo con datos reales, la separación de la información financiera según el rol de cada usuario, el control de acceso en garita con lectores de DNI y QR, y la adaptación del sistema a celulares y tabletas.',
    challenge: 'cerrar un sistema construido en su mayor parte por otra persona: entender cómo venía trabajando, adaptarnos a sus convenciones y completar lo pendiente sin romper lo que ya funcionaba.',
    people: { companeros: [p('Luis Mostacero')], supervisores: [], gerentes },
  },
  {
    name: 'Corall-ERP',
    desde: '2026-04',
    commits: 581,
    resumen: 'El ERP con el que CorAll organiza su trabajo; levanté los procesos de cada área antes de convertirlos en módulos.',
    stack: ['React', 'Ant Design', 'Bun', 'Elysia', 'PostgreSQL', 'Drizzle'],
    sprite: 'archivista',
    area: 'ERP INTERNO',
    did: 'El sistema con el que CorAll gestiona su propio trabajo, de marketing y finanzas a proyectos e inventario. Antes de programar, conversé con las personas de cada área para levantar sus procesos y convertirlos en módulos. Empecé bajo la supervisión de Cristian Ventura y continué con Luis Mostacero.',
    challenge: 'el área contable, con poca experiencia previa en el equipo: las detracciones, el marco legal aplicable y qué pagos y gastos corresponden a una PYME. Hubo que aprender esas reglas antes de modelarlas. Lo resolvimos investigando en equipo y consultando con nuestro supervisor, Cristian Ventura, y con quien entonces llevaba la contabilidad de CorAll.',
    people: {
      companeros: [p('Hugo Marquez'), p('Luis Hume'), p('Adrian Cisneros', 'https://acisneros-portfolio.vercel.app/es'), p('Alfredo Guzman'), p('Angelmauricio Oncoy')],
      supervisores: [p('Cristian Ventura'), p('Luis Mostacero')],
      gerentes,
    },
  },
];

export const oficios: Oficio[] = [
  {
    sprite: 'capataz',
    area: 'Planificación y método',
    tags: ['PMBOK', 'ITIL', 'Scrum', 'Kanban', 'Jira', 'Trello'],
    cert: 'Programa de especialización en Metodologías Ágiles · IED Stratton · 120 h · 19/20',
  },
  { sprite: 'maestro', area: 'Backend y datos', tags: ['Bun / Elysia', 'PostgreSQL', 'Drizzle', 'OpenAPI', 'Node.js', 'Java / Spring', 'FastAPI', 'MySQL'] },
  { sprite: 'decorador', area: 'Frontend y diseño', tags: ['React', 'Vite', 'Ant Design', 'Astro', 'Angular', 'Tailwind'] },
  {
    sprite: 'electricista',
    area: 'Infraestructura y despliegue',
    tags: ['Docker', 'Cloudflare', 'GitHub Actions', 'Turborepo', 'Infisical', 'Tailscale', 'AWS', 'Nginx', 'Terraform', 'Jenkins'],
  },
  { sprite: 'doble', area: 'Calidad y seguridad', tags: ['Playwright', 'Vitest', 'Testing Library', 'ESLint', 'axe', 'Lighthouse', 'Sentry', 'Postman'] },
  { sprite: 'archivista', area: 'Documentación y conocimiento', tags: ['Obsidian', 'Notion', 'Markdown'] },
];

export const comoTrabajo = 'Uso Claude a diario como herramienta de trabajo. La IA escribe código rápido; lo que no hace por mí es entender qué necesita el taller de Maqinpro o cómo funcionan las detracciones de una PYME. Esa parte (preguntar, entender, decidir y revisar) es mi trabajo.';

/** Este sitio cuenta como un uso más en el stack: solo lo que este repo usa de verdad. */
export const esteSitio = { name: 'Este sitio', desde: '2026-11', stack: ['Astro', 'Cloudflare', 'GitHub Actions', 'Vitest', 'Lighthouse'] };

const steam = (title: string, id: number, cover: ImageMetadata): Credit => ({
  title,
  cover,
  source: 'Steam',
  sourceUrl: `https://store.steampowered.com/app/${id}/`,
});

export const games: Credit[] = [
  steam('RimWorld', 294100, rimworld),
  steam('Mount & Blade: Warband', 48700, warband),
  steam('Crusader Kings II', 203770, ck2),
  steam('Crusader Kings III', 1158310, ck3),
  steam('Project Zomboid', 108600, zomboid),
  steam('Fallout 4', 377160, fallout4),
  steam('Fallout: New Vegas', 22380, falloutNv),
];

const imdb = (title: string, url: string, cover?: ImageMetadata): Credit => ({ title, ...(cover && { cover }), source: 'IMDb', sourceUrl: url });
const imdbTitle = (title: string, id: string, cover?: ImageMetadata) => imdb(title, `https://www.imdb.com/title/${id}/`, cover);
// Las trilogías no tienen una página de título propia: enlazan a la búsqueda.
const imdbSearch = (title: string, query: string, cover: ImageMetadata) =>
  imdb(title, `https://www.imdb.com/find/?q=${encodeURIComponent(query)}&s=tt`, cover);

export const screens: Credit[] = [
  imdbTitle('Django sin cadenas', 'tt1853728', django),
  imdbTitle('The Batman', 'tt1877830', batman),
  imdbTitle('Superman (2025)', 'tt5950044', superman),
  imdbSearch('El Señor de los Anillos (trilogía)', 'The Lord of the Rings', anillos),
  imdbSearch('Las Crónicas de Narnia (trilogía)', 'The Chronicles of Narnia', narnia),
  imdbTitle('Andor', 'tt9253284', andor),
  imdbTitle('Vinland Saga', 'tt10233448', vinland),
  imdbTitle('Power Rangers SPD', 'tt0414762', spd),
  imdbTitle('The Walking Dead', 'tt1520211'),
  imdbTitle('Game of Thrones', 'tt0944947'),
  imdbTitle('Brooklyn Nine-Nine', 'tt2467372', brooklyn),
];

const spotify = (title: string, id: string, cover: ImageMetadata): Credit => ({
  title,
  cover,
  source: 'Spotify',
  sourceUrl: `https://open.spotify.com/artist/${id}`,
});

export const bands: Credit[] = [
  spotify('Enjambre', '1ZdhAl62G6ZlEKqIwUAfZR', enjambre),
  spotify('Los Bunkers', '3RTAXX6KGdljBsOIupyZgT', bunkers),
  spotify('Rio', '1Y08JdtP0X185Yk0tjjc2E', rio),
  spotify('Enanitos Verdes', '4TK1gDgb7QKoPFlzRrBRgR', enanitos),
  spotify('Jamiroquai', '6J7biCazzYhU3gM9j1wfid', jamiroquai),
];

// Sin portada: tarjeta con solo el título.
export const manuales: Credit[] = [
  { title: 'Dungeons & Dragons', source: 'Wizards of the Coast', sourceUrl: 'https://dnd.wizards.com/' },
  { title: 'Cyberpunk RED', source: 'R. Talsorian Games', sourceUrl: 'https://rtalsorian.com/cyberpunk-red/' },
];

export const rol: string[] = ['D&D', 'Cyberpunk RED'];

export const links = {
  github: 'https://github.com/BMarin2003',
  linkedin: 'https://www.linkedin.com/in/bmarin2003',
};
