import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../../config.js';
import { getPosts, postSlug } from '../../lib/posts';

export const GET: APIRoute = async (context) =>
  rss({
    title: SITE.name.en,
    description: 'Ski guides, gear and resorts — Ski Professor',
    site: context.site!,
    customData: '<language>en-us</language>',
    items: (await getPosts('en')).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/en/blog/${postSlug(post)}/`,
    })),
  });
