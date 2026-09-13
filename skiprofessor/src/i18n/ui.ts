export const languages = {
  he: 'עברית',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'he';

/** Per-locale document metadata: html lang/dir plus the tags SEO tooling reads. */
export const localeMeta = {
  he: {
    htmlLang: 'he',
    dir: 'rtl',
    /** Value for <link rel="alternate" hreflang="..."> — region-targeted. */
    hreflang: 'he-IL',
    /** Value for <meta property="og:locale">. */
    ogLocale: 'he_IL',
    /** BCP-47 tag for schema.org inLanguage. */
    schemaLang: 'he-IL',
  },
  en: {
    htmlLang: 'en',
    dir: 'ltr',
    hreflang: 'en',
    ogLocale: 'en_US',
    schemaLang: 'en',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export const ui = {
  he: {
    'nav.home': 'בית',
    'nav.blog': 'הבלוג',
    'nav.about': 'עליי',
    'nav.skipToContent': 'דילוג לתוכן הראשי',
    'nav.menu': 'תפריט',

    'lang.switchTo': 'English',
    'lang.label': 'שפה',

    'home.tagline': 'מדריכי סקי, ציוד ואתרים — בעברית פשוטה',
    'home.intro':
      'הבלוג של סקי פרופסור: מדריכים מעשיים לגולשי סקי וסנובורד ישראלים — מהשיעור הראשון ועד יציאה עצמאית לאלפים.',
    'home.latest': 'הפוסטים האחרונים',
    'home.allPosts': 'לכל הפוסטים',
    'home.readMore': 'קריאה נוספת',

    'blog.title': 'הבלוג',
    'blog.description': 'כל המדריכים, הטיפים והביקורות של סקי פרופסור.',
    'blog.empty': 'עדיין אין פוסטים כאן. בקרוב.',
    'blog.backToBlog': 'חזרה לבלוג',

    'post.publishedOn': 'פורסם ב־',
    'post.updatedOn': 'עודכן ב־',
    'post.readingTime': 'זמן קריאה',
    'post.minutes': 'דקות',
    'post.tags': 'תגיות',
    'post.takeaways': 'עיקרי הדברים',
    'post.faq': 'שאלות נפוצות',
    'post.translationAvailable': 'This post is also available in English',
    'post.related': 'פוסטים נוספים',

    'tags.title': 'תגיות',
    'tags.postsTagged': 'פוסטים בתגית',

    'about.title': 'עליי',

    'footer.rights': 'כל הזכויות שמורות',
    'footer.rss': 'RSS',
    'footer.builtWith': 'נבנה עם Astro',

    '404.title': 'הדף לא נמצא',
    '404.body': 'נראה שירדת מהמסלול המסומן. אפשר לחזור לדף הבית.',
    '404.home': 'חזרה לדף הבית',
  },
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.skipToContent': 'Skip to main content',
    'nav.menu': 'Menu',

    'lang.switchTo': 'עברית',
    'lang.label': 'Language',

    'home.tagline': 'Ski guides, gear and resorts — in plain language',
    'home.intro':
      'Ski Professor is a practical blog for skiers and snowboarders: from your very first lesson to planning an independent trip to the Alps.',
    'home.latest': 'Latest posts',
    'home.allPosts': 'All posts',
    'home.readMore': 'Read more',

    'blog.title': 'Blog',
    'blog.description': 'Every guide, tip and review from Ski Professor.',
    'blog.empty': 'No posts here yet. Coming soon.',
    'blog.backToBlog': 'Back to the blog',

    'post.publishedOn': 'Published',
    'post.updatedOn': 'Updated',
    'post.readingTime': 'Reading time',
    'post.minutes': 'min',
    'post.tags': 'Tags',
    'post.takeaways': 'Key takeaways',
    'post.faq': 'Frequently asked questions',
    'post.translationAvailable': 'הפוסט הזה זמין גם בעברית',
    'post.related': 'More posts',

    'tags.title': 'Tags',
    'tags.postsTagged': 'Posts tagged',

    'about.title': 'About',

    'footer.rights': 'All rights reserved',
    'footer.rss': 'RSS',
    'footer.builtWith': 'Built with Astro',

    '404.title': 'Page not found',
    '404.body': 'Looks like you skied off-piste. Let us get you back on the groomed run.',
    '404.home': 'Back to the homepage',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)[typeof defaultLang];
