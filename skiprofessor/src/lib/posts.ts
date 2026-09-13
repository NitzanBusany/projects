import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;

/** Drafts are visible while developing and dropped from production builds. */
const includeDrafts = import.meta.env.DEV;

/** All published posts for a locale, newest first. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.lang === lang && (includeDrafts || !data.draft),
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** The same post in another language, if it has been translated. */
export async function getTranslation(post: Post, lang: Lang): Promise<Post | undefined> {
  if (lang === post.data.lang) return undefined;
  const candidates = await getCollection(
    'blog',
    ({ data }) =>
      data.lang === lang &&
      data.translationKey === post.data.translationKey &&
      (includeDrafts || !data.draft),
  );
  return candidates[0];
}

/**
 * The URL slug for a post. Collection ids are `he/my-post`, and the locale is
 * already carried by the route, so strip the leading language folder.
 */
export function postSlug(post: Post): string {
  return post.id.replace(/^(he|en)\//, '');
}

/** Every tag used in a locale, with post counts, sorted by frequency. */
export async function getTags(lang: Lang): Promise<Array<{ tag: string; count: number }>> {
  const posts = await getPosts(lang);
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts sharing the most tags with the given post. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const posts = await getPosts(post.data.lang as Lang);
  const tags = new Set(post.data.tags);
  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      candidate,
      shared: candidate.data.tags.filter((tag) => tags.has(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared || b.candidate.data.pubDate.valueOf() - a.candidate.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
