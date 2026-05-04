# Portfolio paolocetti.com — Project Brief

> Brief técnico completo para construir el portfolio de Paolo Cetti.
> Pegar este documento en Claude Code como punto de partida.
> Idioma del brief: español (los textos del sitio son bilingües ES/EN).

---

## 1. Visión general

Portfolio personal de **Paolo Cetti**, Backend & Cloud Engineer.

**Objetivos:**
1. Funcionar como vidriera profesional para recruiters y empresas tech.
2. Reflejar la marca personal alineada con LinkedIn.
3. Mostrar proyectos, experiencia, stack técnico y contacto.
4. Ser memorable visualmente sin sacrificar profesionalismo.
5. Escalar a blog técnico en el futuro.

**Dominio de producción:** `paolocetti.com`

---

## 2. Stack técnico

| Capa | Tecnología | Justificación |
|---|---|---|
| Framework | **Astro** (última versión) | Sitio estático ultrarrápido, ideal para GitHub Pages |
| UI components | **React** (vía Astro Islands) | Solo donde se necesite interactividad / animaciones |
| Estilos | **Tailwind CSS v4** + CSS variables | Velocidad de desarrollo + theming |
| Animaciones | **Framer Motion** (React) + **GSAP** (vanilla JS para canvas) | UI animations + scroll triggers |
| 3D / partículas | **Three.js** + **react-three-fiber** | Hero con red de nodos animada |
| Tipografía | **Geist Sans** + **JetBrains Mono** | Self-hosted (vía `@fontsource`) |
| Iconos | **Lucide** (`lucide-react`) | Set consistente |
| Markdown content | **Astro Content Collections** | Para blog posts en `.md/.mdx` |
| i18n | **Astro i18n built-in** | Switcher ES/EN |
| Hosting | **GitHub Pages** | Vía GitHub Actions |
| CI/CD | **GitHub Actions** | Build automático on push a `main` |
| Analytics | **Plausible** o **Umami** (opcional) | Privacy-friendly, dejarlo preparado |

---

## 3. Identidad visual

### Paleta de colores

```css
--bg-primary: #0a0a0a;        /* casi negro, fondo principal */
--bg-secondary: #111111;      /* secciones alternadas */
--bg-tertiary: #1a1a1a;       /* cards, elementos elevados */
--border: #262626;            /* bordes sutiles */

--text-primary: #fafafa;      /* texto principal */
--text-secondary: #a3a3a3;    /* texto secundario / labels */
--text-tertiary: #525252;     /* texto deshabilitado / hints */

--accent: #3b82f6;            /* azul eléctrico — color protagonista */
--accent-hover: #60a5fa;      /* azul más claro para hover */
--accent-glow: #3b82f680;     /* azul con alpha para glows */

--success: #10b981;           /* verde para estados ok */
--warning: #f59e0b;           /* ámbar para warnings */
```

### Tipografía

- **Headings:** Geist Sans (weights: 500, 600, 700)
- **Body:** Geist Sans (weights: 400, 500)
- **Mono / código / detalles técnicos:** JetBrains Mono (weight: 400, 500)
- **Escala tipográfica:** sistema modular (1.25 ratio) — mobile first

### Principios de diseño

- **Mucho espacio en blanco (negativo).** Aire entre secciones.
- **Jerarquía clara:** un solo elemento dominante por viewport.
- **Microinteracciones:** todo lo clickeable tiene feedback visual.
- **Performance > efectos:** ningún efecto rompe los 60fps.
- **Mobile-first:** todo se ve perfecto desde 375px hasta 1920px+.

---

## 4. Estructura de páginas

```
/                       → Home (hero + secciones)
/es                     → Home en español
/about                  → About expandido (opcional, también está en home)
/projects               → Lista completa de proyectos
/projects/[slug]        → Detalle de proyecto individual
/blog                   → Lista de posts
/blog/[slug]            → Post individual
/404                    → Página 404 creativa
```

**Decisión de arquitectura:** la home concentra todas las secciones en single-page-scroll (about, experience, projects, skills, contact), con páginas separadas opcionales para casos como detalle de proyecto o blog.

---

## 5. Secciones de la home

### 5.1 — Navbar (sticky con backdrop-blur)

- Logo: `pc.` o `paolocetti` en JetBrains Mono.
- Nav links: About · Experience · Projects · Stack · Blog · Contact
- Switcher de idioma (ES / EN) con icono de globo.
- En mobile: hamburger menu fullscreen con animación de entrada.
- Behavior: aparece blur+dim al hacer scroll (>50px).

### 5.2 — Hero (la primera pantalla)

**Visual principal:**
- Fondo: red de nodos animada en canvas (Three.js o vanilla canvas) — partículas conectadas con líneas que reaccionan sutilmente al cursor.
- Color de partículas: tonos de azul accent con opacidad variable.
- Performance: máximo ~80 nodos, requestAnimationFrame con throttling.
- Disabled en mobile (o reemplazar por gradiente animado para no quemar batería).

**Contenido:**
- Pre-título pequeño en mono: `// backend & cloud engineer`
- H1 grande: nombre completo (`Paolo Cetti`) con efecto de revelado letra por letra al cargar.
- Sub-headline: tagline corta. Ejemplo: "Building scalable backends and serverless architectures on AWS." (en EN) / "Construyo backends escalables y arquitecturas serverless en AWS." (en ES).
- CTAs: dos botones — primario "Get in touch" y secundario "View projects".
- Indicador de scroll abajo (línea + flecha animada).

### 5.3 — About

**Layout:** 2 columnas en desktop, stack en mobile.
- Izquierda: foto profesional (la del LinkedIn) con tratamiento duotone azul al hover (filtro CSS o canvas).
- Derecha: texto del about. Reutilizar el "Acerca de" del LinkedIn pero un poquito más conversacional para el portfolio.
- Stats rápidos abajo (cards horizontales): "5+ years coding · 4 companies · AWS Certified · Systems Engineer".

**Animación:** fade-in + slide-up al entrar en viewport (Framer Motion `useInView`).

### 5.4 — Experience (Timeline)

**Layout:** timeline vertical centrado en desktop, alineado a la izquierda en mobile.

Empresas a mostrar (en orden cronológico inverso):
1. **Leanmote** — Full Stack Developer (Nov 2025 - Present)
2. **Pi Data Strategy & Consulting** — AI Engineer (Feb 2025 - 2026)
3. **Qanlex** — Backend Developer (Jan 2025 - Mar 2025)
4. **Omixom Ingeniería** — Backend Developer (Sep 2021 - Aug 2022)

**Cada item:**
- Logo de la empresa (cuando esté disponible).
- Cargo + empresa + fechas + ubicación.
- 2-3 bullets de logros (versión corta del LinkedIn).
- Tags de tecnologías.
- Link a "ver más" (opcional, abre modal con descripción larga).

**Animación:** la línea de la timeline se "dibuja" a medida que el usuario scrollea (GSAP + ScrollTrigger).

### 5.5 — Projects

**Layout:** grid de 2 columnas en desktop, 1 en mobile.

Proyectos a mostrar:
1. **SaveApp** — Mobile app para gestión de beneficios bancarios.
2. **RAGPi** — Sistema RAG modular en Azure.
3. **Web Scraper (Qanlex)** — Scraper serverless multi-país en AWS.
4. **Repos pinned de GitHub** — sección dinámica que trae los repos pinned de la API de GitHub durante el build.

**Cada card:**
- Imagen / preview del proyecto (placeholder si no hay).
- Título + descripción corta.
- Stack tags.
- Links: GitHub, Demo, Caso de estudio.
- Hover: zoom sutil de la imagen + glow azul en bordes.

**Integración GitHub:**
- Script en `astro.config.mjs` o utility `src/lib/github.ts` que fetcha la API de GitHub durante build.
- Endpoint: `https://api.github.com/users/cettipao/repos?sort=updated&per_page=6`
- Filtrar solo los marcados como "pinned" (requiere GraphQL API) o los más actualizados como fallback.
- Tener en cuenta: GraphQL API requiere token. Para el build en GitHub Actions, usar `GITHUB_TOKEN` (built-in en Actions, no requiere setup).

### 5.6 — Stack técnico

**Layout:** grid de tarjetas pequeñas agrupadas por categoría.

Categorías:
- **Languages:** Python, JavaScript, TypeScript, SQL
- **Cloud (AWS):** Lambda, RDS, API Gateway, Cognito, S3, EC2, EventBridge
- **Backend:** REST APIs, Serverless, Microservices, Django, Flask
- **Databases:** MySQL, PostgreSQL
- **AI/ML:** LLMs, RAG, NLP, Prompt Engineering
- **DevOps:** Git, Docker, GitHub Actions, Scrum

**Cada item:**
- Icono de la tecnología (Lucide o Simple Icons).
- Nombre.
- Hover: tooltip con nivel de experiencia (opcional).

**Animación:** las cards aparecen con stagger al entrar en viewport.

### 5.7 — Education & Certifications

- Universidad Católica de Córdoba — Systems Engineering (2022-2025) — GPA 8.97
- AWS Certified Cloud Practitioner
- First Certificate in English (Cambridge B2)

Layout simple, dos columnas.

### 5.8 — Blog (preview)

- Mostrar las últimas 3 entradas si existen.
- Si no hay entradas todavía: placeholder elegante "Writing soon — first article on its way."
- Link a `/blog` para ver todas.

### 5.9 — Contact

**Layout:** centrado, con CTAs grandes.

Opciones:
- Email → mailto + copiar al clipboard con feedback.
- LinkedIn → linkedin.com/in/cettipao
- GitHub → github.com/cettipao
- Twitter / X → (pendiente, dejar variable de entorno)
- Calendly → (pendiente, dejar variable de entorno)
- CV en PDF → botón "Download CV" que descarga `/cv-paolo-cetti.pdf` (archivo a subir luego).

**Animación de fondo:** efecto sutil de líneas/grid animado.

### 5.10 — Footer

- Línea sutil con: `© 2026 Paolo Cetti · Built with Astro · Deployed on GitHub Pages`
- Comentario HTML escondido para devs curiosos: `<!-- hey curious dev! 👋 source code at github.com/cettipao/portfolio -->`
- Easter egg en consola: `console.log("%cPaolo Cetti", "color: #3b82f6; font-size: 24px; font-weight: bold;")` + mensaje de bienvenida tipo "looking around? let's chat: cettipao@gmail.com"

---

## 6. Animaciones y microinteracciones

### Globales
- **Cursor custom:** dot pequeño + ring que sigue al cursor con lerp. Crece al hover sobre links/botones. Solo en desktop.
- **Smooth scroll:** Lenis o nativo (`scroll-behavior: smooth`).
- **Page transitions:** fade simple entre páginas (Astro View Transitions API).

### Por sección
- **Hero:** red de nodos animada (Three.js o canvas vanilla).
- **Headings:** efecto de "split text" donde las letras aparecen una por una con stagger (Framer Motion + variants).
- **Timeline:** línea que se "dibuja" con scroll progress (GSAP ScrollTrigger).
- **Cards de proyectos:** tilt 3D sutil al mover el mouse encima (vanilla JS o `react-tilt`).
- **Botones:** efecto magnético en CTAs principales (vanilla JS — el botón "atrae" al cursor cuando está cerca).
- **Imágenes:** lazy load con fade-in.
- **Hovers:** todo lo clickeable tiene transición de 200ms.

### Performance
- Disable animaciones complejas en `prefers-reduced-motion: reduce`.
- Disable canvas hero en mobile (o version simplificada).
- Lazy load de Three.js (solo cargar si hay viewport con el hero).

---

## 7. i18n (bilingüe ES/EN)

**Configuración Astro:**
```js
// astro.config.mjs
i18n: {
  defaultLocale: "en",
  locales: ["en", "es"],
  routing: { prefixDefaultLocale: false }
}
```

**Estructura:**
```
src/i18n/
├── en.json
├── es.json
└── ui.ts  (helper para traducir)
```

**Switcher:** botón en navbar con icono de globo. Detecta idioma del browser en primera visita y guarda preferencia en localStorage.

---

## 8. SEO y metadata

- `<title>` y `<meta description>` dinámicos por página.
- Open Graph tags (imagen OG generada — puede ser una imagen estática inicial).
- Twitter Card tags.
- `sitemap.xml` automático (Astro tiene integración).
- `robots.txt`.
- Schema.org Person + WebSite (JSON-LD).

---

## 9. Estructura del proyecto

```
paolocetti-portfolio/
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── cv-paolo-cetti.pdf       (placeholder, lo subo después)
│   └── images/
│       ├── profile.jpg
│       └── projects/
├── src/
│   ├── assets/
│   │   └── fonts/                (si decidimos self-host)
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   ├── LanguageSwitcher.tsx
│   │   ├── hero/
│   │   │   ├── Hero.astro
│   │   │   └── ParticleNetwork.tsx     (React + Three.js)
│   │   ├── about/
│   │   │   └── About.astro
│   │   ├── experience/
│   │   │   ├── Experience.astro
│   │   │   └── TimelineItem.tsx
│   │   ├── projects/
│   │   │   ├── Projects.astro
│   │   │   ├── ProjectCard.tsx
│   │   │   └── GitHubRepos.tsx
│   │   ├── stack/
│   │   │   └── Stack.astro
│   │   ├── education/
│   │   │   └── Education.astro
│   │   ├── blog/
│   │   │   └── BlogPreview.astro
│   │   ├── contact/
│   │   │   └── Contact.astro
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Tag.tsx
│   │       └── CustomCursor.tsx
│   ├── content/
│   │   ├── projects/
│   │   │   ├── saveapp.md
│   │   │   ├── ragpi.md
│   │   │   └── qanlex-scraper.md
│   │   ├── experience/
│   │   │   ├── leanmote.md
│   │   │   ├── pi-data.md
│   │   │   ├── qanlex.md
│   │   │   └── omixom.md
│   │   └── blog/
│   │       └── (vacío al inicio)
│   ├── i18n/
│   │   ├── en.json
│   │   ├── es.json
│   │   └── ui.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── github.ts             (fetch repos pinned en build time)
│   │   └── utils.ts
│   ├── pages/
│   │   ├── index.astro           (home en EN, default)
│   │   ├── es/
│   │   │   └── index.astro       (home en ES)
│   │   ├── projects/
│   │   │   └── [slug].astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css            (CSS variables + reset)
│   └── env.d.ts
├── .github/
│   └── workflows/
│       └── deploy.yml            (GitHub Actions)
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── README.md
└── CNAME                         (con "paolocetti.com")
```

---

## 10. GitHub Actions (deploy.yml)

Workflow que:
1. Triggea on push a `main`.
2. Instala dependencias con pnpm.
3. Corre el build (`pnpm build`).
4. Pasa `GITHUB_TOKEN` para que el script de fetch de repos funcione.
5. Sube el output a la rama `gh-pages` o usa la action oficial de Astro.
6. Configura el dominio custom `paolocetti.com` (vía CNAME en `public/`).

---

## 11. Contenido — Datos del perfil

### Personal
- **Nombre completo:** Paolo Cetti
- **Título profesional (EN):** Backend & Cloud Engineer
- **Título profesional (ES):** Backend & Cloud Engineer
- **Email:** cettipao@gmail.com
- **LinkedIn:** linkedin.com/in/cettipao
- **GitHub:** github.com/cettipao
- **Ubicación:** Córdoba, Argentina

### Tagline (hero)
- **EN:** "Building scalable backends and serverless architectures on AWS."
- **ES:** "Construyo backends escalables y arquitecturas serverless en AWS."

### About
- Reutilizar el "Acerca de" del documento `perfil-linkedin-paolo-cetti.md` (versión EN y versión ES), adaptándolo levemente para tono más conversacional de portfolio.

### Experiencia, proyectos, educación
- Reutilizar contenido del documento `perfil-linkedin-paolo-cetti.md`.

---

## 12. Toques de personalidad (easter eggs)

1. **Console.log de bienvenida:** mensaje en la consola del navegador en azul accent dando la bienvenida a quien inspeccione el sitio.
2. **Comentario escondido en HTML:** invitando a contactar.
3. **Cursor custom:** dot + ring que sigue el cursor (solo desktop).
4. **404 creativo:** página de error con un node "perdido" en el grafo de la red (en el mismo estilo del hero) y un link de vuelta a home con humor.
5. **Konami code (opcional):** activa un mini-juego o cambia el tema a "matrix mode" (verde fosforescente).
6. **Footer:** "Built with care from Córdoba" o algo similar.

---

## 13. Roadmap / Pendientes

**Fase 1 — Setup inicial:**
- [ ] Crear repo `cettipao/portfolio` en GitHub.
- [ ] Inicializar Astro con TypeScript + Tailwind + React.
- [ ] Configurar tipografías Geist + JetBrains Mono.
- [ ] Configurar i18n (ES/EN).
- [ ] Configurar GitHub Actions deploy.

**Fase 2 — Contenido y secciones:**
- [ ] Layout base + Navbar + Footer.
- [ ] Hero con particle network.
- [ ] About con foto.
- [ ] Experience timeline.
- [ ] Projects grid.
- [ ] Stack técnico.
- [ ] Education/Certifications.
- [ ] Contact.
- [ ] Blog (estructura, sin posts iniciales).

**Fase 3 — Animaciones:**
- [ ] Cursor custom.
- [ ] Scroll animations (Framer Motion + GSAP).
- [ ] Page transitions.
- [ ] Microinteracciones en botones.

**Fase 4 — Pulido:**
- [ ] Easter eggs (console, comentarios, 404).
- [ ] SEO + Open Graph.
- [ ] Performance audit (Lighthouse 95+).
- [ ] Accessibility audit (WCAG AA mínimo).

**Fase 5 — Deploy:**
- [ ] CNAME para paolocetti.com.
- [ ] Configurar DNS del dominio.
- [ ] Deploy a producción.

**Pendientes externos (no de código):**
- [ ] Subir CV en PDF a `public/cv-paolo-cetti.pdf`.
- [ ] Subir foto de perfil a `public/images/profile.jpg`.
- [ ] Subir imágenes de proyectos a `public/images/projects/`.
- [ ] Generar imagen Open Graph (`public/og-image.png`).
- [ ] Configurar dominio en GitHub Pages.
- [ ] Decidir Calendly link.
- [ ] Decidir Twitter handle (si aplica).

---

## 14. Prompt inicial sugerido para Claude Code

> Una vez tengas este documento abierto en tu repo, podés arrancar con un prompt como este en Claude Code:

```
Voy a construir mi portfolio personal en paolocetti.com siguiendo el brief
detallado en este archivo (PORTFOLIO-BRIEF.md).

Stack: Astro + React (Astro Islands) + Tailwind CSS v4 + TypeScript.
Hosting: GitHub Pages vía GitHub Actions.

Por favor:
1. Inicializá el proyecto Astro con todas las integraciones necesarias
   (React, Tailwind, sitemap, MDX para blog, content collections).
2. Configurá TypeScript en modo strict.
3. Creá la estructura de carpetas que figura en la sección 9 del brief.
4. Configurá las variables CSS de la paleta (sección 3).
5. Configurá las tipografías Geist Sans y JetBrains Mono via @fontsource.
6. Configurá i18n con rutas /en (default) y /es.
7. Creá el layout base con navbar sticky y footer.
8. Creá el workflow de GitHub Actions para deploy a GitHub Pages.

No empezamos con secciones todavía, solo el setup base. Cuando termines,
mostrame la estructura final y dejame correr `pnpm dev` para verificar
que todo arranca antes de seguir con las secciones de contenido.
```

Después podés ir pidiendo sección por sección en orden:
1. Hero con particle network.
2. About.
3. Experience timeline.
4. Projects grid + integración con GitHub API.
5. Stack técnico.
6. Education/Certifications.
7. Blog.
8. Contact.
9. Easter eggs y pulido final.

---

## 15. Recursos útiles

- **Astro docs:** https://docs.astro.build
- **Tailwind v4:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion
- **GSAP ScrollTrigger:** https://greensock.com/scrolltrigger
- **react-three-fiber:** https://r3f.docs.pmnd.rs
- **Geist font:** https://vercel.com/font
- **JetBrains Mono:** https://www.jetbrains.com/lp/mono
- **Lucide icons:** https://lucide.dev
- **Astro deploy a GitHub Pages:** https://docs.astro.build/en/guides/deploy/github/

---

## 16. Inspiración (referencias visuales)

Sitios para mirar mientras se construye:
- https://leerob.io (elegante, simple)
- https://brittanychiang.com (timeline y stack muy bien)
- https://rauno.me (animaciones de calidad)
- https://emilkowalski.com (microinteracciones impecables)
- https://josh.comm (personalidad + technical)
- https://linear.app (paleta y tipografía de referencia)
- https://vercel.com (Geist en acción)

---

> Documento generado el 03/05/2026 como brief inicial.
> Iterar y ajustar a medida que se construye.
