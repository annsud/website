# AGENTS.md

## Project Overview

Anant Sudarshan's personal academic website — a publication-centric portfolio
built around a **tiered dossier model** where each paper is an MDX file that
renders at one of three depth levels depending on how much extra material
(plots, press, awards, field photos) it carries.

**Live site:** https://www.anantsudarshan.com
**Repo:** https://github.com/annsud/website

## Tech Stack

- **Astro 5** — static site generator (SSG), content collections, file-based routing
- **MDX** — paper content with embedded interactive components
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin, design tokens in `global.css`
- **Observable Plot** — interactive charts in `<Plot>` components
- **npm** — package manager (no yarn/pnpm)
- **GitHub Pages** — deployment via GitHub Actions on push to `main`

## Commands

```bash
npm install          # install deps
npm run dev          # dev server at http://localhost:4321
npm run build        # static build to ./dist
npm run preview      # preview production build
```

No test suite, linter, or formatter is configured. Verify changes by running
`npm run build` — if it builds clean, it's structurally valid.

## Project Structure

```
src/
├── content.config.ts        # Zod schema for paper frontmatter (source of truth)
├── content/papers/           # One MDX file per paper, named by slug
├── pages/
│   ├── index.astro           # Homepage (hero + featured papers)
│   ├── about.astro           # About page (static content)
│   ├── cv.astro              # CV page (hardcoded publication/appointment data)
│   └── papers/
│       ├── index.astro       # Research list (filterable by topic/status)
│       └── [...slug].astro    # Tier-2 dossier pages (getStaticPaths, filters tier===2)
├── layouts/
│   ├── BaseLayout.astro      # Shell: head + header + main + footer
│   └── PaperLayout.astro     # Article layout for tier-2 paper pages
├── components/
│   ├── BaseHead.astro        # Meta tags, fonts (Inter + Newsreader), OG/Twitter
│   ├── Header.astro          # Sticky nav (links from NAV in site.ts)
│   ├── Footer.astro          # Copyright + links
│   ├── PaperCard.astro       # Card for each paper in the list (expandable abstract/media)
│   ├── PaperLinks.astro      # Renders `links` object as buttons (journal, pdf, etc.)
│   ├── Cite.astro             # "Cite" button → copies BibTeX to clipboard
│   ├── PressList.astro       # Press coverage (featured headlines + compact list)
│   ├── Awards.astro          # Awards/recognition badges
│   ├── FollowUps.astro       # Follow-up projects grid
│   ├── Figure.astro          # Captioned image (root-relative src, auto base-prefixed)
│   ├── Plot.astro            # Interactive Observable Plot chart (line/area/bar)
│   ├── CompareSlider.astro   # Before/after image slider
│   └── Gallery.astro         # Photo grid with lightbox
├── lib/
│   ├── site.ts               # SITE config (name, bio, email, links), url() helper, NAV
│   └── format.ts             # authorParts(), statusLabel(), buildBibtex(), byline()
└── styles/
    └── global.css            # Tailwind import + design tokens + prose styles
public/
├── Headshot.jpg              # Homepage portrait
├── portrait.svg             # Fallback/alt portrait
├── anant-sudarshan-cv.pdf    # CV PDF linked from /cv
├── CNAME                     # Custom domain (www.anantsudarshan.com)
└── papers/                   # Paper assets: figures, PDFs
    └── figures/              # Key figure images referenced by frontmatter
```

## The Paper Content Model

Every paper is `src/content/papers/<slug>.mdx`. The frontmatter schema is
defined in `src/content.config.ts` — that file is the **single source of truth**
for all paper fields. Key fields:

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required |
| `authors` | string[] | Required, alphabetical order (display logic handles reordering) |
| `year` | number | Required |
| `venue` | string | Optional — journal name |
| `status` | `published` \| `working` \| `progress` | Default `published` |
| `tier` | 0 \| 1 \| 2 | Default 0 — controls render depth (see below) |
| `featured` | boolean | Default false — if true, paper appears in homepage "New Research" |
| `summary` | string | Required — one-line hook for cards |
| `abstract` | string | Optional — longer plain-language summary |
| `topics` | string[] | Default `[]` — used by topic filter on research page |
| `teaser`, `teaserAlt` | string | Optional hero image path |
| `figure`, `figureAlt`, `figureCaption` | string | Key figure shown in abstract reveal |
| `links` | object | `pdf`, `journal`, `wp`, `arxiv`, `nber`, `ssrn`, `code`, `data`, `slides`, `website` |
| `press` | array | `{ outlet, title?, url, date? }` |
| `awards` | array | `{ title, org?, year?, url? }` |
| `followUps` | array | `{ title, status?, blurb?, url? }` |
| `bibtex` | string | Optional — auto-generated from frontmatter if absent |
| `draft` | boolean | Default false |

### Tier system

| Tier | Treatment | When to use |
|------|-----------|------------|
| **0** | List entry only (title, venue, links) | Papers with no extra material |
| **1** | Expandable abstract + media on the research list | Papers with some add-ons |
| **2** | Full dedicated dossier page at `/papers/<slug>` | Flagship work with narrative + interactives |

Only **tier 2** papers get a dedicated page (via `papers/[...slug].astro`).
Tier 0 and 1 render inline on the research list with expandable reveals.

To promote a paper: change `tier: 1` → `tier: 2`, write the MDX body, add
interactive components.

### MDX body (Tier 2 only)

The body carries the narrative prose and interactive blocks. Import components
at the top of the MDX body (after frontmatter):

```mdx
import Figure from '@/components/Figure.astro';
import Plot from '@/components/Plot.astro';
import CompareSlider from '@/components/CompareSlider.astro';
import Gallery from '@/components/Gallery.astro';
```

Component APIs:

- **`<Figure src caption credit wide />`** — captioned image. `src` is root-relative
  (e.g. `/papers/my-paper/fig.png`), auto-prefixed by `url()`.
- **`<Plot data type xLabel yLabel caption />`** — interactive Observable Plot chart.
  `data` is `[{ x, y, series? }]`. `type` is `'line'` | `'area'` | `'bar'`.
- **`<CompareSlider before after beforeLabel afterLabel caption />`** — before/after slider.
- **`<Gallery images={[{ src, alt, caption }]} heading />`** — photo grid with lightbox.

`press`, `awards`, and `followUps` come from frontmatter — do **not** place them
in the body. They render automatically via the layout.

### Adding a new paper

1. Create `src/content/papers/<slug>.mdx`.
2. Fill frontmatter — see `surat-emissions-market.mdx` for the full template.
3. Place images under `public/papers/<slug>/` and reference with root-relative
   paths like `/papers/<slug>/fig.png`. Key figures for the research list go in
   `public/papers/figures/` (convention used by existing papers).
4. For tier 2, write the story in the MDX body and drop in components.
5. Set `featured: true` if the paper should appear on the homepage.
6. Run `npm run build` to verify.

## Key Conventions

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`). Use it for all imports:

```ts
import { url } from '@/lib/site';
import Figure from '@/components/Figure.astro';
```

### URL helper

**Always use** `url()` from `@/lib/site` for internal links and image `src`
attributes. It handles base-path prefixing:

```astro
import { url } from '@/lib/site';
<a href={url('/papers')}>Research</a>
<img src={url('/Headshot.jpg')} />
```

Never hardcode `/papers/...` or `/Headshot.jpg` directly — use `url()`.

### Byline logic

`byline()` from `@/lib/format.ts` reorders authors so Anant Sudarshan always
appears first, with others as "(with …)". Author lists in frontmatter stay
alphabetical — the display layer handles reordering. The `me` parameter
defaults to `'Sudarshan'`.

### BibTeX

`buildBibtex()` in `@/lib/format.ts` auto-generates a BibTeX entry from
frontmatter if no `bibtex` field is provided. The `Cite` component copies it
to clipboard. Only hand-write `bibtex` if you need non-standard fields
(DOI, volume, number, pages).

### Design tokens

All colors and fonts are CSS custom properties defined in `src/styles/global.css`
under `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-paper` | `#ffffff` | Background |
| `--color-ink` | `#0d0d0f` | Primary text |
| `--color-muted` | `#6b7280` | Secondary text |
| `--color-line` | `#e8e8eb` | Borders, dividers |
| `--color-accent` | `#1d4ed8` | Links, highlights (use sparingly) |
| `--color-accent-soft` | `#e8eefc` | Active button background |
| `--font-sans` | `Inter` | Body text, UI |
| `--font-serif` | `Newsreader` | Display headings, `.prose-editorial` |

Use these via Tailwind's arbitrary value syntax: `text-[var(--color-accent)]`,
`border-[var(--color-line)]`, etc. Do not introduce new colors outside this
palette.

### Typography classes

- `.font-display` — serif (Newsreader) for headings
- `.prose-editorial` — serif long-form prose for paper bodies (has its own
  `h2`, `h3`, `p`, `a`, `ul`, `blockquote` styles in `global.css`)

### Site configuration

Edit `src/lib/site.ts` to change:
- Name, title, role, affiliation, description
- Email address
- Footer/social links (Google Scholar, CV)
- Navigation items (`NAV` array)

### CV page data

The CV page (`src/pages/cv.astro`) has **hardcoded** arrays for appointments,
education, publications, working papers, and book chapters. These are
**separate** from the content collection — they must be kept in sync manually.
The CV also links to a static PDF at `/anant-sudarshan-cv.pdf`.

## Deployment

- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Triggers on push to `main` (and manual dispatch)
- Uses `withastro/action@v3` to build, then `actions/deploy-pages@v4` to deploy
- Custom domain via `public/CNAME` (contains `www.anantsudarshan.com`)
- `astro.config.mjs` sets `site: 'https://www.anantsudarshan.com'`, `base: '/'`

## Things to Watch Out For

1. **No tests or linters** — the build (`npm run build`) is the only automated
   check. Run it before committing.

2. **CV data is duplicated** — the publication list on `/cv` is hardcoded in
   `cv.astro` and is independent of the MDX content collection. If you add or
   update a paper in the collection, also check whether the CV page needs
   updating.

3. **Internal links must use `url()`** — the site is configured for root-path
   deployment (`base: '/'`), but using `url()` future-proofs against base-path
   changes and is the established convention.

4. **Images go in `public/`** — reference them with root-relative paths
   (`/papers/figures/my-paper.png`). The `url()` helper auto-prefixes them.

5. **Author ordering** — keep frontmatter `authors` in citation order
   (alphabetical). The display layer (`byline()`) handles showing Anant first.

6. **Tier 2 routing** — only papers with `tier: 2` get a dedicated page at
   `/papers/<slug>`. If you set a paper to tier 2, make sure it has an MDX body
   with content.

7. **Draft flag** — `draft: true` in frontmatter is for content awaiting review.
   Drafts still build but should not be deployed to production.

8. **No runtime backend** — this is a fully static site. All interactivity
   (filters, sliders, plot rendering, cite buttons) is client-side JS in
   `<script>` tags within components.

## Git Workflow

- Default branch: `main`
- Commit convention: `type: concise subject` (types: `fix:`, `feat:`,
  `refactor:`, `docs:`, `chore:`)
- Pushing to `main` triggers a deployment — make sure `npm run build` passes
  locally first