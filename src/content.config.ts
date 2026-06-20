import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each paper is one MDX file under src/content/papers/<slug>.mdx, with its
// media under public/papers/<slug>/. Frontmatter below is the structured data;
// the MDX body carries the rich Tier-2 narrative + interactive blocks.
const papers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/papers' }),
  schema: () =>
    z.object({
      title: z.string(),
      authors: z.array(z.string()),
      year: z.number(),
      venue: z.string().optional(),
      // published | working | progress
      status: z.enum(['published', 'working', 'progress']).default('published'),
      // Importance tier drives how richly the paper renders:
      //  0 = entry only (title + links)
      //  1 = expandable add-ons (figures / press / awards inline + light page)
      //  2 = full project page (story, interactives, follow-ups)
      tier: z.number().int().min(0).max(2).default(0),
      featured: z.boolean().default(false),
      // One-line hook shown on cards.
      summary: z.string(),
      // Longer plain-language abstract for Tier 1+.
      abstract: z.string().optional(),
      topics: z.array(z.string()).default([]),
      // Path under /public, e.g. '/papers/surat-ets/teaser.jpg'.
      teaser: z.string().optional(),
      teaserAlt: z.string().optional(),
      links: z
        .object({
          pdf: z.string().optional(),
          journal: z.string().optional(),
          wp: z.string().optional(),
          arxiv: z.string().optional(),
          nber: z.string().optional(),
          ssrn: z.string().optional(),
          code: z.string().optional(),
          data: z.string().optional(),
          slides: z.string().optional(),
          website: z.string().optional(),
        })
        .default({}),
      press: z
        .array(
          z.object({
            outlet: z.string(),
            title: z.string().optional(),
            url: z.string(),
            date: z.string().optional(),
          })
        )
        .default([]),
      awards: z
        .array(
          z.object({
            title: z.string(),
            org: z.string().optional(),
            year: z.number().optional(),
            url: z.string().optional(),
          })
        )
        .default([]),
      followUps: z
        .array(
          z.object({
            title: z.string(),
            status: z.enum(['planned', 'ongoing', 'under review']).optional(),
            blurb: z.string().optional(),
            url: z.string().optional(),
          })
        )
        .default([]),
      bibtex: z.string().optional(),
      // Set true while content is auto-drafted and awaiting your review.
      draft: z.boolean().default(false),
    }),
});

export const collections = { papers };
