# anantsudarshan.com

A personal academic website built with **Astro + MDX + Tailwind**, designed
around the idea that each paper is more than a PDF. Every publication carries
optional "add-on" material — interactive figures, before/after sliders, press,
awards, field photos, and follow-up projects — and renders at one of three
depths depending on how much there is to say.

## The tiered dossier model

Each paper is one MDX file in `src/content/papers/<slug>.mdx`. Its `tier`
controls how richly it renders:

| Tier | Treatment | Use for |
|------|-----------|---------|
| **0** | List entry only (title, venue, links) | Papers with no extra material |
| **1** | Light page + inline "press & recognition" peek on the list | Papers with some add-ons |
| **2** | Full dossier page: hero image, narrative, interactive plots, comparison sliders, photo gallery, follow-ups | Flagship work |

Promoting a paper is just changing `tier: 1` → `tier: 2` and adding content.

## Adding or editing a paper

1. Create `src/content/papers/my-paper.mdx`.
2. Fill in the frontmatter (see `surat-emissions-market.mdx` for the full set:
   `title`, `authors`, `year`, `venue`, `status`, `tier`, `summary`,
   `abstract`, `topics`, `links`, `press`, `awards`, `followUps`, `bibtex`).
3. Put images under `public/papers/my-paper/` and reference them with
   root-relative paths like `/papers/my-paper/fig.png`.
4. For Tier 2, write the story in the MDX body and drop in components:

   ```mdx
   import Figure from '@/components/Figure.astro';
   import Plot from '@/components/Plot.astro';
   import CompareSlider from '@/components/CompareSlider.astro';
   import Gallery from '@/components/Gallery.astro';
   ```

   `press`, `awards`, and `followUps` come from frontmatter and are rendered
   automatically — you don't place them in the body.

## Content components

- `<Figure src caption credit wide />` — captioned image.
- `<Plot data type xLabel yLabel caption />` — interactive Observable Plot chart
  (hover tooltips, responsive). `data` is `[{ x, y, series? }]`.
- `<CompareSlider before after beforeLabel afterLabel caption />` — before/after.
- `<Gallery images={[{ src, alt, caption }]} />` — lightbox photo grid.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321/website
npm run build    # static output in ./dist
npm run preview
```

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to
GitHub Pages on push. To turn it on: **repo Settings → Pages → Build and
deployment → Source: GitHub Actions**.

- Project-site URL: `https://annsud.github.io/website/`
- To use the custom domain `anantsudarshan.com`, set `site` to it and `base` to
  `'/'` in `astro.config.mjs`, add a `public/CNAME` file containing the domain,
  and point DNS at GitHub Pages.

> Page text and the publication list have been populated from public sources
> (journal pages, EPIC / UChicago profiles, Google Scholar). Figures and
> statistics on dossier pages cite their source. The CV PDF link and a handful
> of secondary entries may still want a pass against Anant's own records.
