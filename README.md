# paolocetti.com

Personal portfolio of **Paolo Cetti** — Backend & Cloud Engineer.

Built with [Astro](https://astro.build) + React Islands + Tailwind CSS v4.
Hosted on GitHub Pages with a custom domain (`paolocetti.com`).

## Stack

- **Astro 5** — static-first framework, content collections, i18n
- **React 19** (Astro Islands) — interactive UI / animations
- **Tailwind CSS v4** — via `@tailwindcss/vite`
- **TypeScript** — strict mode (`astro/tsconfigs/strictest`)
- **@fontsource-variable** — self-hosted Geist Sans + JetBrains Mono
- **lucide-react** — icon set
- **MDX** — for blog posts
- **GitHub Actions** — build + deploy on push to `main`

## Scripts

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server (http://localhost:4321)
pnpm build            # type-check + build to ./dist
pnpm preview          # preview the production build
pnpm typecheck        # tsc --noEmit
```

## Project structure

See [`PORTFOLIO-BRIEF.md`](./PORTFOLIO-BRIEF.md) §9 for the full layout. In
short:

```
src/
├── components/   # Astro + React UI components, grouped by section
├── content/      # Markdown collections: projects, experience, blog
├── i18n/         # en.json, es.json, ui.ts (translation helper)
├── layouts/      # BaseLayout.astro
├── lib/          # github.ts, utils.ts
├── pages/        # routes (index, /es, /blog, /projects/[slug], 404)
└── styles/       # global.css with @theme tokens
```

## i18n

- Default locale: **English** (served at `/`)
- Spanish: served at `/es`
- Configured via Astro's built-in i18n with `prefixDefaultLocale: false`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site with `pnpm build` and publishes `dist/` to GitHub Pages. The custom
domain is configured via [`public/CNAME`](./public/CNAME).

## License

© Paolo Cetti. All rights reserved.
