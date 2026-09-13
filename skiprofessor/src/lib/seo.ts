import { SITE } from '../config.js';
import { localeMeta, type Lang } from '../i18n/ui';
import { absoluteUrl } from '../i18n/utils';

type Json = Record<string, unknown>;

const idFor = (site: URL | undefined, fragment: string) =>
  `${site?.origin ?? ''}/#${fragment}`;

/** Strips empty social handles so we never emit `"sameAs": [""]`. */
function sameAs(): string[] {
  return Object.values(SITE.social).filter((value): value is string =>
    Boolean(value && value.startsWith('http')),
  );
}

export function publisherSchema(lang: Lang, site: URL | undefined): Json {
  const links = sameAs();
  return {
    '@type': 'Organization',
    '@id': idFor(site, 'organization'),
    name: SITE.name[lang],
    alternateName: SITE.legalName,
    url: site?.origin,
    ...(links.length ? { sameAs: links } : {}),
    // Tells search engines and answer engines who this content is written for.
    areaServed: {
      '@type': 'Country',
      name: SITE.region.countryName,
      identifier: SITE.region.country,
    },
    knowsLanguage: ['he-IL', 'en'],
  };
}

export function authorSchema(lang: Lang, site: URL | undefined): Json {
  return {
    '@type': 'Person',
    '@id': idFor(site, 'author'),
    name: SITE.author.name[lang],
    url: absoluteUrl(lang === 'he' ? '/about' : '/en/about', site),
  };
}

export function websiteSchema(lang: Lang, site: URL | undefined): Json {
  return {
    '@type': 'WebSite',
    '@id': idFor(site, 'website'),
    name: SITE.name[lang],
    alternateName: SITE.legalName,
    url: site?.origin,
    inLanguage: localeMeta[lang].schemaLang,
    publisher: { '@id': idFor(site, 'organization') },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  site: URL | undefined,
): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url, site),
    })),
  };
}

export function faqSchema(faq: Array<{ q: string; a: string }>): Json | undefined {
  if (!faq.length) return undefined;
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function blogPostingSchema(
  opts: {
    title: string;
    description: string;
    url: string;
    lang: Lang;
    pubDate: Date;
    updatedDate?: Date;
    tags: string[];
    image?: string;
    places: Array<{ name: string; country: string }>;
    wordCount?: number;
  },
  site: URL | undefined,
): Json {
  const canonical = absoluteUrl(opts.url, site);
  return {
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    headline: opts.title,
    description: opts.description,
    inLanguage: localeMeta[opts.lang].schemaLang,
    datePublished: opts.pubDate.toISOString(),
    dateModified: (opts.updatedDate ?? opts.pubDate).toISOString(),
    author: { '@id': idFor(site, 'author') },
    publisher: { '@id': idFor(site, 'organization') },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    url: canonical,
    ...(opts.tags.length ? { keywords: opts.tags.join(', ') } : {}),
    ...(opts.image ? { image: absoluteUrl(opts.image, site) } : {}),
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    ...(opts.places.length
      ? {
          contentLocation: opts.places.map((place) => ({
            '@type': 'Place',
            name: place.name,
            address: {
              '@type': 'PostalAddress',
              addressCountry: place.country,
            },
          })),
        }
      : {}),
  };
}

/**
 * Wraps schema nodes in a single `@graph`. One script tag with cross-referenced
 * `@id`s is easier for crawlers to resolve than several disconnected blocks.
 */
export function buildGraph(nodes: Array<Json | undefined>): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': nodes.filter(Boolean),
    },
    null,
    0,
  );
}
