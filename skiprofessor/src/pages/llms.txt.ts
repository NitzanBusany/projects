import type { APIRoute } from 'astro';
import { SITE } from '../config.js';
import { getPosts, postSlug } from '../lib/posts';

/**
 * llms.txt — a plain-text map of the site for answer engines, in the emerging
 * llmstxt.org convention. Keeping it generated (rather than hand-written) means
 * it never drifts from the actual post list.
 */
export const GET: APIRoute = async ({ site }) => {
  const [he, en] = await Promise.all([getPosts('he'), getPosts('en')]);
  const abs = (path: string) => new URL(path.replace(/^\//, ''), site).href;

  const section = (heading: string, posts: typeof he, prefix: string) =>
    posts.length
      ? [
          `## ${heading}`,
          '',
          ...posts.map(
            (post) => `- [${post.data.title}](${abs(`${prefix}/${postSlug(post)}`)}): ${post.data.description}`,
          ),
          '',
        ]
      : [];

  const body = [
    `# ${SITE.legalName}`,
    '',
    `> ${SITE.name.en}: practical ski and snowboard guides for an Israeli audience, published in Hebrew (primary) and English. Topics include lessons and technique, gear selection, and resort planning in Europe.`,
    '',
    `- Primary language: Hebrew (he-IL), served at ${abs('/')}`,
    `- Secondary language: English (en), served at ${abs('/en')}`,
    `- Author: ${SITE.author.name.en}`,
    '',
    ...section('Posts (Hebrew)', he, '/blog'),
    ...section('Posts (English)', en, '/en/blog'),
    '## Feeds',
    '',
    `- [Hebrew RSS](${abs('/rss.xml')})`,
    `- [English RSS](${abs('/en/rss.xml')})`,
    `- [Sitemap](${abs('/sitemap-index.xml')})`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
