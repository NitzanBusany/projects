import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../config.js';
import { getPosts, postSlug } from '../lib/posts';

export const GET: APIRoute = async (context) =>
  rss({
    title: SITE.name.he,
    description: 'מדריכי סקי, ציוד ואתרים — סקי פרופסור',
    site: context.site!,
    customData: '<language>he-il</language>',
    items: (await getPosts('he')).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/blog/${postSlug(post)}/`,
    })),
  });
