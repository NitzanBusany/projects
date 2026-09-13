import { defaultLang, localeMeta, ui, type Lang, type UIKey } from './ui';

/** Every locale the site ships, default first. */
export const locales = Object.keys(ui) as Lang[];

export function isLang(value: string): value is Lang {
  return (locales as string[]).includes(value);
}

/**
 * Reads the active locale from a URL. The default locale (Hebrew) lives at the
 * site root, every other locale is prefixed — `/en/blog` -> `en`.
 */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang && isLang(maybeLang)) return maybeLang;
  return defaultLang;
}

/** Returns a `t('some.key')` lookup bound to a locale, falling back to Hebrew. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function getDir(lang: Lang) {
  return localeMeta[lang].dir;
}

/**
 * Builds a path for a locale. Pass the *unprefixed* path (`/blog`, `/about`,
 * `/`), get back the locale-correct one (`/blog` for he, `/en/blog` for en).
 */
export function localizePath(lang: Lang, path = '/'): string {
  const clean = `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  if (lang === defaultLang) return clean === '/' ? '/' : clean;
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

/**
 * Inverse of `localizePath`: strips the locale prefix so a path can be
 * re-localized into another language.
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length && isLang(segments[0]!)) segments.shift();
  return `/${segments.join('/')}`;
}

/** Absolute URL for a path, using the configured site origin. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  const origin = site?.origin ?? '';
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${clean === '/' ? '/' : clean.replace(/\/$/, '')}`;
}

/**
 * Formats a date in the reader's locale. Hebrew uses the Israeli convention,
 * English uses a long month name so it is unambiguous for US/UK readers.
 */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'he' ? 'he-IL' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Machine-readable date for <time datetime> and structured data. */
export function isoDate(date: Date): string {
  return date.toISOString();
}

/**
 * Rough reading time. Hebrew averages fewer words per minute than English for
 * the same idea, so the divisor differs per locale.
 */
export function readingTime(body: string, lang: Lang): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const wpm = lang === 'he' ? 180 : 225;
  return Math.max(1, Math.round(words / wpm));
}

export { defaultLang, localeMeta, type Lang, type UIKey };
