import type { APIRoute } from 'astro';

/**
 * Answer engines (ChatGPT, Claude, Perplexity, Gemini) are allowed on purpose:
 * being crawlable is the entry ticket for being cited in AI answers. Flip any
 * of these to `Disallow: /` if you'd rather not be used as a source.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const llms = new URL('llms.txt', site).href;

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${sitemap}`,
    `# Structured summary for LLMs: ${llms}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
