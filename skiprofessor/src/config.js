/**
 * Site-wide constants. Imported by both `astro.config.mjs` and page components,
 * so keep this file plain ESM JavaScript with no Astro-only imports.
 */

export const SITE = {
  /** Canonical origin. Change this before the first production deploy. */
  url: 'https://skiprofessor.co.il',
  /** Primary brand name, per locale. */
  name: {
    he: 'סקי פרופסור',
    en: 'Ski Professor',
  },
  /** Latin-script name used in structured data and OG tags for both locales. */
  legalName: 'Ski Professor',
  /** The person behind the blog — used for Person/author structured data. */
  author: {
    name: {
      he: 'ניצן בוסני',
      en: 'Nitzan Busany',
    },
    url: 'https://skiprofessor.co.il/about',
  },
  /** Primary audience region. Drives geo targeting signals. */
  region: {
    country: 'IL',
    countryName: 'Israel',
  },
  /** Social / contact profiles. Empty strings are skipped in structured data. */
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    email: '',
  },
  /** Default social sharing image, relative to the site root. */
  defaultImage: '/og-default.svg',
};

/** Locales in priority order. The first entry is the default locale. */
export const LOCALES = ['he', 'en'];

export const DEFAULT_LOCALE = 'he';
