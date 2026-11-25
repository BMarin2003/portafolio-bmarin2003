import { corall, oficios, screens } from './site';
import type { CorallProject, Credit, Oficio } from './site';

/** El inglés reemplaza solo los textos; personas, oficios y enlaces salen de site.ts, así no se desfasan. */
const proyectos: Record<string, Pick<CorallProject, 'area' | 'did' | 'challenge' | 'resumen'>> = {
  'Totem Multimedia': {
    area: 'FIRST PROJECT',
    resumen: "My first project at CorAll: I built features and presented each step forward to the client.",
    did: 'My first project at CorAll, when I was new to the team. My role was developer: building the features assigned to me and presenting each step forward to the client, explaining clearly what changed and why. It was the stage where I learned the craft inside a real product, with constant review and deliveries that other people were going to use.',
    challenge: 'adapting, as a newcomer, to a way of working very different from university: new frameworks and technologies, tools like Tailscale and Infisical, and learning to use AI well as a work tool. Moving from a more manual, classic workflow to this one was my first big lesson at CorAll.',
  },
  CCAE: {
    area: 'ONE-OFF CONTRIBUTION',
    resumen: "I designed a couple of interfaces for the extranet of an arbitration management system.",
    did: 'An arbitration management system for a chamber of commerce: requests, parties involved, payments, documents and the follow-up of each case. My contribution was small and specific: the design of a couple of interfaces in its extranet.',
  },
  MaqinPro: {
    area: 'PLATFORM · IN MY CHARGE',
    resumen: "The platform for a machinery workshop and its customer portal. Halfway through, it became my responsibility.",
    did: 'A management platform for Maqinpro, an industrial and professional machinery company: an internal panel for its workshop and a portal where its customers track their equipment, approve quotes and check their documents. It was the project with the most people involved and, halfway through, it became my responsibility. Since then I have been carrying it forward, with support from Luis Hume on the customer portal.',
    challenge: 'understanding in depth how the workshop works and finding the balance between what is comfortable for them and what is most efficient. In the portal, for example, customers come in from their phones by scanning the QR code on their ticket, often standing up and with one hand. Instead of showing them every internal workshop stage, which only confused them, we grouped those stages into “In process at the workshop” and always tell them what comes next.',
  },
  Comphill: {
    area: 'PROJECT CLOSE-OUT',
    resumen: "With Luis Mostacero, I closed out the operations system of a wholesale market that someone else had built.",
    did: 'An integrated operations system for COMPHILL, a wholesale fish market: transport and weighing, stalls, warehouses, payments and sanitary quality on a single platform. Most of it was built by Cristian Ventura; Luis Mostacero and I were tasked with closing it out by completing the pending modules: the operations dashboard with real data, separating financial information by each user’s role, gate access control with national ID (DNI) and QR readers, and adapting the system to phones and tablets.',
    challenge: 'closing out a system built mostly by someone else: understanding how it had been built, adapting to its conventions and completing what was pending without breaking what already worked.',
  },
  'Corall-ERP': {
    area: 'INTERNAL ERP',
    resumen: "The ERP CorAll uses to organize its work; I gathered each area's processes before turning them into modules.",
    did: 'The system CorAll uses to automate and streamline its own work, from marketing and finance to projects and inventory, in a single platform. Here the work went beyond code: I talked with the people in each area to understand their processes before turning them into modules. I started under the supervision of Cristian Ventura and continued with Luis Mostacero after Luis’s promotion; with the arrival of the new intern team, development picked up a remarkable pace.',
    challenge: 'the accounting area, where there was little experience: detracciones (a Peruvian tax withholding system), the legal framework that applies, and which payments and expenses apply to a small business. Before turning it into modules we had to learn those rules and fully understand what each area needed, to capture it correctly in the system. We solved it by researching as a team and consulting our supervisor, Cristian Ventura, and the person who handled CorAll’s accounting at the time.',
  },
};

const oficiosTexto: Record<string, Pick<Oficio, 'area' | 'cert'>> = {
  capataz: { area: 'Planning and method', cert: 'Agile Methodologies specialization program · IED Stratton · 120 h · 19/20' },
  maestro: { area: 'Backend and data' },
  decorador: { area: 'Frontend and design' },
  electricista: { area: 'Infrastructure and deployment' },
  doble: { area: 'Quality and security' },
  archivista: { area: 'Documentation and knowledge' },
};

const titulosEn: Record<string, string> = {
  'Django sin cadenas': 'Django Unchained',
  'El Señor de los Anillos (trilogía)': 'The Lord of the Rings (trilogy)',
  'Las Crónicas de Narnia (trilogía)': 'The Chronicles of Narnia (trilogy)',
};

export const corallEn: CorallProject[] = corall.map((p) => ({ ...p, ...proyectos[p.name] }));
export const oficiosEn: Oficio[] = oficios.map((o) => ({ ...o, ...oficiosTexto[o.sprite] }));
export const screensEn: Credit[] = screens.map((s) => ({ ...s, title: titulosEn[s.title] ?? s.title }));

export const comoTrabajoEn =
  'Claude is a fundamental tool for any developer today, and in my work I use it as one. But my role does not change: I am a software engineer, and tools are there to build software. AI writes code fast; what it does not do for me is understand what the Maqinpro workshop needs or how detracciones (a Peruvian tax withholding system) work for a small business. That part (asking, understanding, deciding and reviewing what gets built) is still the job, and it is where I learn the most.';
