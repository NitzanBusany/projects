# Ski Professor

The new bilingual site for the Ski Professor blog, replacing skiprofessor.co.il.

Built with [Astro](https://astro.build) — Markdown posts, a static build, and no
client-side JavaScript shipped by default.

**Status: scaffold.** The plumbing (routing, i18n, content pipeline, SEO and
structured data) is done and working. The visual design and the real content are
deliberately still placeholders — see [Next steps](#next-steps).

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Dev server with hot reload; drafts are visible |
| `npm run build` | Production build into `dist/`                  |
| `npm run check` | Type-checks `.astro` and `.ts` files           |
| `npm run preview` | Serves the built `dist/` locally             |

## Languages

Hebrew is the primary locale and is served from the site root. English is served
under `/en/`.

| Page      | Hebrew            | English              |
| --------- | ----------------- | -------------------- |
| Home      | `/`               | `/en/`               |
| Blog      | `/blog`           | `/en/blog`           |
| Post      | `/blog/<slug>`    | `/en/blog/<slug>`    |
| Tag       | `/tags/<tag>`     | `/en/tags/<tag>`     |
| About     | `/about`          | `/en/about`          |
| RSS       | `/rss.xml`        | `/en/rss.xml`        |

Direction (`rtl` / `ltr`) is set on `<html>` per locale. The stylesheet uses CSS
logical properties (`margin-inline-start`, `border-inline-end`, …) throughout, so
both directions are handled by one set of rules — there is no `[dir=rtl]`
override block to keep in sync.

UI strings live in `src/i18n/ui.ts`. Add a key to both locales and use it via
`useTranslations(lang)`.

## Writing a post

Create a Markdown file under `src/content/blog/<lang>/<slug>.md`. The folder
decides the language.

```markdown
---
title: 'Post title, under 70 characters'
description: 'Meta description, 50–165 characters. This is the search snippet.'
pubDate: 2026-01-14
updatedDate: 2026-02-01      # optional
lang: 'he'                   # must match the folder
translationKey: 'first-ski-lesson'
tags: ['מתחילים', 'טכניקה']
draft: false                 # drafts show in dev, never in production
heroImage: '/images/foo.jpg' # optional
places:                      # optional, feeds geo structured data
  - name: 'Chamonix'
    country: 'FR'
takeaways:                   # optional, rendered above the post
  - 'A complete sentence that answers the question in the title.'
faq:                         # optional, rendered + emitted as FAQPage schema
  - q: 'A question a reader would actually type'
    a: 'A direct answer.'
---

Body in Markdown.
```

The schema in `src/content.config.ts` enforces this and **fails the build** on a
bad post — including title and description lengths, so you cannot accidentally
ship a truncated search snippet.

### Linking translations

Two posts with the same `translationKey` are treated as translations of each
other. That one field drives:

- the "also available in English / בעברית" link on the post,
- the language switcher going to the *matching* post rather than the homepage,
- the `hreflang` alternates in `<head>` and in the sitemap.

Slugs may differ between languages — the `translationKey` is what links them, so
each language can use a slug that reads naturally for its readers.

A post with no counterpart simply gets no alternates, which is correct: claiming
an alternate that does not exist is worse than claiming none.

## SEO

Handled centrally in `src/components/BaseHead.astro` and `src/lib/seo.ts`, so
pages get it by default rather than by remembering to add it:

- Canonical URL on every page.
- Bidirectional `hreflang` (`he-IL`, `en`, plus `x-default` → Hebrew) in the
  `<head>` and as `xhtml:link` entries in the sitemap.
- Open Graph + Twitter card tags, with `og:locale:alternate` per translation.
- JSON-LD as a single cross-referenced `@graph`: `WebSite`, `Organization`,
  `Person`, and on posts `BlogPosting`, `BreadcrumbList` and `FAQPage`.
- `sitemap-index.xml` generated at build time.
- Per-locale RSS feeds.

### Geo targeting

`hreflang` with a region subtag (`he-IL`) is the signal search engines actually
act on, and it is emitted automatically. `Organization.areaServed` and per-post
`contentLocation` reinforce it in structured data. The legacy `geo.region` meta
tags are included too — modern crawlers ignore them, but some audit tools still
read them.

### GEO (answer engines)

Being quoted by ChatGPT, Claude, Perplexity and AI Overviews needs different
things from ranking in blue links, so the scaffold also ships:

- **`/llms.txt`** — a generated plain-text map of the site in the
  [llmstxt.org](https://llmstxt.org) convention. Generated, so it never drifts
  from the real post list.
- **`takeaways`** — self-contained sentences rendered *above* the post body.
  These are the most quotable unit on the page, and putting them first means a
  model summarizing the page hits your conclusions before your preamble.
- **`faq`** — real Q&A pairs emitted as `FAQPage` schema, matching how people
  phrase questions to an assistant.
- **AI crawlers explicitly allowed** in `/robots.txt`. Being crawlable is the
  entry ticket for being cited. If you would rather not be used as a training or
  answer source, flip those entries to `Disallow: /` in
  `src/pages/robots.txt.ts` — it is one edit in one place.

## Project layout

```
src/
├── config.js              # site name, URL, author, region — edit this first
├── content.config.ts      # post frontmatter schema
├── content/blog/{he,en}/  # posts, one folder per language
├── i18n/                  # ui.ts (strings) + utils.ts (helpers)
├── lib/
│   ├── posts.ts           # queries: by locale, translations, tags, related
│   └── seo.ts             # structured data builders
├── components/            # page bodies + shared UI
├── layouts/BaseLayout.astro
├── pages/                 # thin routes; Hebrew at root, English under /en
└── styles/global.css      # design tokens + primitives
```

Routes are intentionally thin — `src/pages/blog/index.astro` is three lines that
render `<BlogIndex lang="he" />`. The real markup lives in `src/components/`, so
each page is written once and used by both locales.

## Before going live

1. Set the real origin in `src/config.js` (`SITE.url`) — canonical URLs,
   sitemap, RSS and `llms.txt` all derive from it.
2. Fill in `SITE.social` and the author details.
3. Replace the `/about` placeholder copy.
4. Replace `public/og-default.svg` with a real social image (1200×630).
5. Delete the sample `first-ski-lesson` posts.
6. Plan redirects from the old skiprofessor.co.il URLs to the new ones.

## Deploying

Static output — `npm run build` produces `dist/`, which any static host serves.

- **Netlify / Vercel / Cloudflare Pages**: point at the repo, build command
  `npm run build`, publish directory `dist`.
- The build has no server runtime, so there is nothing to keep warm and nothing
  to pay for at low traffic.

## Next steps

The page layouts are working placeholders, not a finished design. The intended
flow is to design the pages visually and then port the result back into the
components in `src/components/` — the content pipeline, routing and SEO layer
underneath do not need to change when the design does.

`src/styles/global.css` is structured for that: design tokens (colour, spacing,
type) at the top, layout primitives below. A redesign should mostly be new token
values plus component markup.
