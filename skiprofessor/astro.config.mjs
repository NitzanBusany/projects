// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/config.js';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',

  // Hebrew is the primary locale and is served from the root (`/`).
  // English is served from `/en/`. See src/i18n/ for the string tables.
  i18n: {
    defaultLocale: 'he',
    locales: ['he', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      // Emits <xhtml:link rel="alternate" hreflang="..."> for every page that
      // exists in both locales, which is what search engines actually use for
      // geo/language targeting.
      i18n: {
        defaultLocale: 'he',
        locales: {
          he: 'he-IL',
          en: 'en',
        },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
