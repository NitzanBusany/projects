import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Posts live in `src/content/blog/<lang>/<slug>.md`. The folder decides the
 * locale, and `translationKey` links a Hebrew post to its English counterpart
 * so the two can cross-link and emit correct hreflang tags.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().max(70, 'Keep titles under 70 characters so they are not truncated in search results'),
    description: z
      .string()
      .min(50, 'Meta descriptions shorter than 50 characters waste the snippet')
      .max(165, 'Meta descriptions over 165 characters get truncated in search results'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(['he', 'en']),
    /** Shared id across languages, e.g. `first-ski-lesson`. */
    translationKey: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    /** Places the post is about — feeds geo-targeted structured data. */
    places: z
      .array(
        z.object({
          name: z.string(),
          country: z.string(),
        }),
      )
      .default([]),
    /**
     * Short, self-contained statements shown above the post and emitted for
     * answer engines. These are what an LLM is most likely to quote, so write
     * them as complete sentences rather than fragments.
     */
    takeaways: z.array(z.string()).default([]),
    /** Rendered as a Q&A block and as FAQPage structured data. */
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { blog };
