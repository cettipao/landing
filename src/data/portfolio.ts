import type { Locale } from "@i18n/ui";

/* ---------------------------------------------------------------------------
 * Single source of truth for portfolio content.
 *
 * Everything bilingual lives here so the React/Astro components only have to
 * pick the right locale. Markdown content collections (in src/content/) stay
 * reserved for the blog.
 * ------------------------------------------------------------------------- */

export type Bilingual<T> = Record<Locale, T>;

export interface Stat {
  label: Bilingual<string>;
  value: string;
}

export interface ExperienceEntry {
  slug: string;
  company: string;
  url?: string;
  role: Bilingual<string>;
  location: Bilingual<string>;
  period: Bilingual<string>;
  current: boolean;
  summary: Bilingual<string>;
  highlights: Bilingual<string[]>;
  stack: string[];
}

export interface ProjectEntry {
  slug: string;
  title: string;
  summary: Bilingual<string>;
  description: Bilingual<string>;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  associated?: Bilingual<string>;
  period: string;
}

export interface StackCategory {
  id: string;
  title: Bilingual<string>;
  items: string[];
}

export interface CertEntry {
  title: Bilingual<string>;
  issuer: string;
  year: string;
  url?: string;
}

/* ----- Hero ------------------------------------------------------------- */

export const hero: {
  preTitle: string;
  name: string;
  tagline: Bilingual<string>;
  ctaPrimary: Bilingual<string>;
  ctaSecondary: Bilingual<string>;
} = {
  preTitle: "// backend & cloud engineer",
  name: "Paolo Cetti",
  tagline: {
    en: "Building scalable backends and serverless architectures on AWS.",
    es: "Construyo backends escalables y arquitecturas serverless en AWS.",
  },
  ctaPrimary: { en: "Get in touch", es: "Hablemos" },
  ctaSecondary: { en: "View projects", es: "Ver proyectos" },
};

/* ----- About ------------------------------------------------------------ */

export const about: {
  paragraphs: Bilingual<string[]>;
  stats: Stat[];
} = {
  paragraphs: {
    en: [
      "Systems Engineer (UCC) focused on backend and cloud. I currently build and scale Leanmote's platform, designing serverless infrastructure on AWS and working closely with the CTO on technical decisions.",
      "Before Leanmote, I built AI solutions at Pi Data (a WhatsApp bot for events with 300+ attendees, an LLM-powered email triage system used by government agencies), shipped scrapers across 10+ countries at Qanlex, and got my first formal dev job at Omixom while still in technical high school — migrating an agro-climate IoT platform to microservices.",
      "I particularly enjoy when an architectural change becomes measurable — like migrating a critical PHP query that took 40 seconds to a Python Lambda that resolves it in 5–10s. I also integrate AI tools (Claude Code with subagents, git worktrees, custom skills) into my workflow as part of the craft, not as an extra.",
      "Currently preparing for the AWS Solutions Architect Associate certification.",
    ],
    es: [
      "Ingeniero en Sistemas (UCC) enfocado en backend y cloud. Hoy construyo y escalo la plataforma de Leanmote, diseñando infraestructura serverless en AWS y trabajando codo a codo con el CTO en las decisiones técnicas.",
      "Antes de Leanmote pasé por Pi Data (bot de WhatsApp para eventos de 300+ personas, sistema de triage de emails con LLMs para áreas de gobierno), Qanlex (scrapers en AWS para datos judiciales de 10+ países de LATAM) y Omixom — mi primer trabajo formal, todavía en la secundaria técnica — migrando una plataforma IoT agroclimática a microservicios.",
      "Disfruto especialmente cuando un cambio de arquitectura se traduce en algo medible — por ejemplo, migré una consulta crítica de PHP que tardaba 40 segundos a un Lambda en Python que la resuelve en 5–10s. Integro herramientas de IA en mi flujo de desarrollo (Claude Code con subagentes, git worktrees, skills personalizadas) como parte del oficio actual, no como un extra.",
      "Actualmente preparándome para la certificación AWS Solutions Architect Associate.",
    ],
  },
  stats: [
    { value: "5+", label: { en: "years coding", es: "años codeando" } },
    { value: "4", label: { en: "companies", es: "empresas" } },
    { value: "AWS", label: { en: "Cloud Practitioner", es: "Cloud Practitioner" } },
    {
      value: "8.97",
      label: { en: "GPA — Systems Eng.", es: "Promedio — Ing. Sistemas" },
    },
  ],
};

/* ----- Experience ------------------------------------------------------- */

export const experience: ExperienceEntry[] = [
  {
    slug: "leanmote",
    company: "Leanmote",
    url: "https://leanmote.com",
    role: { en: "Full Stack Developer", es: "Full Stack Developer" },
    location: { en: "Remote", es: "Remoto" },
    period: { en: "Nov 2025 — Present", es: "Nov 2025 — Actualidad" },
    current: true,
    summary: {
      en: "SaaS platform for engineering teams. Working directly with the CTO on the development and scaling of the platform.",
      es: "Plataforma SaaS para equipos de ingeniería. Trabajo directamente con el CTO en el desarrollo y escalado de la plataforma.",
    },
    highlights: {
      en: [
        "Designed and maintain serverless infrastructure on AWS: Lambda, API Gateway, RDS MySQL, Cognito and S3.",
        "Migrated critical PHP aggregated-data queries (~40s) to Python Lambdas, reducing response time to 5–10 seconds.",
        "Modernized the authentication system by implementing AWS Cognito.",
      ],
      es: [
        "Diseño y mantengo infraestructura serverless en AWS: Lambda, API Gateway, RDS MySQL, Cognito y S3.",
        "Migré consultas críticas de data agregada de PHP (~40s) a Lambdas en Python, bajando el tiempo de respuesta a 5–10s.",
        "Modernicé el sistema de autenticación implementando AWS Cognito.",
      ],
    },
    stack: ["Python", "AWS Lambda", "API Gateway", "RDS MySQL", "Cognito", "S3"],
  },
  {
    slug: "pi-data",
    company: "Pi Data Strategy & Consulting",
    role: { en: "AI Engineer", es: "AI Engineer" },
    location: { en: "Córdoba, Argentina", es: "Córdoba, Argentina" },
    period: { en: "Feb 2025 — 2026", es: "Feb 2025 — 2026" },
    current: false,
    summary: {
      en: "Data strategy and AI consultancy. Designed and shipped LLM-powered solutions for clients across multiple sectors.",
      es: "Consultora de estrategia de datos e IA. Diseñé y entregué soluciones con LLMs para clientes de distintos sectores.",
    },
    highlights: {
      en: [
        "Built a WhatsApp bot powered by AI for events with 300+ attendees: giveaways, FAQs, real-time notifications.",
        "Shipped a core consultancy product: an LLM-based email triage system used (among others) by government agencies.",
        "Designed and tuned prompts for production NLP pipelines on Microsoft Azure.",
      ],
      es: [
        "Construí un bot de WhatsApp con IA para eventos de 300+ personas: sorteos, FAQs, notificaciones en tiempo real.",
        "Desarrollé un producto core de la consultora: un sistema de triage de emails con LLMs usado por áreas de gobierno, entre otros.",
        "Diseñé y optimicé prompts para pipelines de NLP en producción sobre Microsoft Azure.",
      ],
    },
    stack: ["Python", "Azure", "LLMs", "NLP", "RAG", "Prompt Engineering"],
  },
  {
    slug: "qanlex",
    company: "Qanlex",
    role: { en: "Backend Developer", es: "Backend Developer" },
    location: {
      en: "Florida, US · Remote",
      es: "Florida, EE.UU. · Remoto",
    },
    period: { en: "Jan 2025 — Mar 2025", es: "Ene 2025 — Mar 2025" },
    current: false,
    summary: {
      en: "US-based litigation finance company using public court data to identify investment opportunities. Worked on backend data extraction at regional scale.",
      es: "Empresa de litigation finance en EE.UU. que usa datos judiciales públicos para identificar oportunidades de inversión. Trabajé en backend, en extracción de datos a escala regional.",
    },
    highlights: {
      en: [
        "Developed and maintained Python scrapers for public litigation data across 10+ LATAM countries.",
        "Implemented relevance filters (claim amount, case type) to flag potentially useful cases.",
        "Deployed scrapers on AWS with scheduled executions for fresh data and high availability.",
      ],
      es: [
        "Desarrollé y mantuve scrapers en Python para datos judiciales públicos en 10+ países de LATAM.",
        "Implementé filtros de relevancia (monto demandado, tipo de causa) para marcar casos potencialmente útiles.",
        "Desplegué los scrapers en AWS con ejecuciones programadas para datos frescos y alta disponibilidad.",
      ],
    },
    stack: ["Python", "AWS", "Web Scraping", "MySQL"],
  },
  {
    slug: "omixom",
    company: "Omixom Ingeniería",
    role: { en: "Backend Developer", es: "Desarrollador Backend" },
    location: { en: "Córdoba, Argentina", es: "Córdoba, Argentina" },
    period: { en: "Sep 2021 — Aug 2022", es: "Sep 2021 — Ago 2022" },
    current: false,
    summary: {
      en: "Argentine IoT and environmental-monitoring company (weather stations, river/tank sensors, silo control) with clients like Zuccardi. My first formal dev job — joined while still in technical high school.",
      es: "Empresa argentina de IoT y monitoreo ambiental (estaciones meteorológicas, sensores de ríos y tanques, control de silos) con clientes como Zuccardi. Mi primer trabajo formal — me sumé mientras cursaba la secundaria técnica.",
    },
    highlights: {
      en: [
        "Developed Python/Django backend modules for an agro-climate metrics platform with national coverage.",
        "Participated in the migration to a microservices architecture using Flask.",
        "Worked with Git, Docker and Scrum on a professional team workflow.",
      ],
      es: [
        "Desarrollé módulos backend en Python/Django para una plataforma de métricas agroclimáticas con cobertura nacional.",
        "Participé en la migración del sistema a una arquitectura de microservicios con Flask.",
        "Trabajé con Git, Docker y Scrum en el flujo profesional de un equipo de desarrollo.",
      ],
    },
    stack: ["Python", "Django", "Flask", "Docker", "Git", "Scrum"],
  },
];

/* ----- Projects --------------------------------------------------------- */

export const projects: ProjectEntry[] = [
  {
    slug: "saveapp",
    title: "SaveApp",
    period: "2025",
    associated: {
      en: "Final degree project · UCC",
      es: "Proyecto final de carrera · UCC",
    },
    summary: {
      en: "Mobile app for managing bank-card benefits and promotions in Argentina.",
      es: "App móvil para gestionar beneficios y promociones de tarjetas bancarias en Argentina.",
    },
    description: {
      en: "Final degree project (UCC), built as a team. I designed and implemented the backend: data modeling, REST APIs for promotion lookup and filtering, business validations and modular architecture prioritizing scalability and maintainability.",
      es: "Proyecto final de carrera (UCC), desarrollado en equipo. Diseñé e implementé el backend: modelado de datos, APIs REST para búsqueda y filtrado de promociones, validaciones de negocio y arquitectura modular priorizando escalabilidad y mantenibilidad.",
    },
    stack: ["Python", "REST API", "MySQL", "Mobile"],
  },
  {
    slug: "ragpi",
    title: "RAGPi",
    period: "2024",
    associated: {
      en: "Pi Data Strategy & Consulting",
      es: "Pi Data Strategy & Consulting",
    },
    summary: {
      en: "Modular RAG system for queries over structured and unstructured data on Azure.",
      es: "Sistema RAG modular para consultas sobre datos estructurados y no estructurados en Azure.",
    },
    description: {
      en: "Retrieval-Augmented Generation pipeline combining semantic retrieval with LLM generation. Service-oriented architecture lets retrieval, embeddings and generation scale independently.",
      es: "Pipeline de Retrieval-Augmented Generation que combina búsqueda semántica con generación vía LLMs. Arquitectura orientada a servicios donde retrieval, embeddings y generación escalan de forma independiente.",
    },
    stack: ["Python", "Azure", "LLMs", "RAG", "NLP"],
  },
  {
    slug: "qanlex-scraper",
    title: "Qanlex Web Scraper",
    period: "2025",
    associated: { en: "Qanlex", es: "Qanlex" },
    summary: {
      en: "Serverless multi-country court-data scraper deployed on AWS.",
      es: "Scraper serverless multi-país de datos judiciales desplegado en AWS.",
    },
    description: {
      en: "Automated Python scraper for public court data across LATAM. EC2 for scheduled processing, Lambda for on-demand, EventBridge for orchestration, MySQL for persistence. CI/CD on GitHub Actions.",
      es: "Scraper automatizado en Python para datos judiciales públicos de LATAM. EC2 para ejecuciones programadas, Lambda on-demand, EventBridge para orquestación, MySQL para persistencia. CI/CD con GitHub Actions.",
    },
    repoUrl: "https://github.com/cettipao/Qanlex-Scrapper",
    stack: ["Python", "AWS Lambda", "EventBridge", "EC2", "MySQL"],
  },
];

/* ----- Stack ------------------------------------------------------------ */

export const stack: StackCategory[] = [
  {
    id: "languages",
    title: { en: "Languages", es: "Lenguajes" },
    items: ["Python", "JavaScript", "TypeScript", "SQL"],
  },
  {
    id: "cloud",
    title: { en: "Cloud (AWS)", es: "Cloud (AWS)" },
    items: ["Lambda", "API Gateway", "RDS", "Cognito", "S3", "EC2", "EventBridge"],
  },
  {
    id: "backend",
    title: { en: "Backend", es: "Backend" },
    items: ["REST APIs", "Serverless", "Microservices", "Django", "Flask"],
  },
  {
    id: "databases",
    title: { en: "Databases", es: "Bases de datos" },
    items: ["MySQL", "PostgreSQL"],
  },
  {
    id: "ai",
    title: { en: "AI / ML", es: "IA / ML" },
    items: ["LLMs", "RAG", "NLP", "Prompt Engineering"],
  },
  {
    id: "devops",
    title: { en: "DevOps", es: "DevOps" },
    items: ["Git", "Docker", "GitHub Actions", "Scrum"],
  },
];

/* ----- Education + Certifications --------------------------------------- */

export const education = {
  school: "Universidad Católica de Córdoba",
  degree: {
    en: "Engineer's degree, Systems Engineering",
    es: "Ingeniería en Sistemas",
  },
  period: { en: "2022 — 2025", es: "2022 — 2025" },
  highlights: {
    en: [
      "GPA 8.97 / 10 — degree completed one year ahead of the official 5-year plan.",
      "Final project: SaveApp — mobile app for managing bank-card benefits.",
      "Studied alongside professional work, applying coursework to real projects.",
    ],
    es: [
      "Promedio 8.97 / 10 — carrera terminada un año antes del plan oficial de 5 años.",
      "Proyecto final: SaveApp — app móvil para gestión de beneficios bancarios.",
      "Cursé en paralelo a trabajos profesionales, aplicando los contenidos en proyectos reales.",
    ],
  },
};

export const certifications: CertEntry[] = [
  {
    title: { en: "AWS Certified Cloud Practitioner", es: "AWS Certified Cloud Practitioner" },
    issuer: "Amazon Web Services",
    year: "2024",
  },
  {
    title: { en: "First Certificate in English (B2)", es: "First Certificate in English (B2)" },
    issuer: "Cambridge",
    year: "—",
  },
];
