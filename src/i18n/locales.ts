export const locales = ['fr', 'en', 'ko', 'zh'] as const;
export type Locale = (typeof locales)[number];
export type Localized<T = string> = Record<Locale, T>;

export const defaultLocale: Locale = 'fr';

export const localeMeta: Record<
  Locale,
  { label: string; short: string; htmlLang: string; hreflang: string; intl: string; og: string }
> = {
  fr: { label: 'Français', short: 'FR', htmlLang: 'fr', hreflang: 'fr', intl: 'fr-FR', og: 'fr_FR' },
  en: { label: 'English', short: 'EN', htmlLang: 'en', hreflang: 'en', intl: 'en-GB', og: 'en_GB' },
  ko: { label: '한국어', short: '한', htmlLang: 'ko', hreflang: 'ko', intl: 'ko-KR', og: 'ko_KR' },
  zh: { label: '中文', short: '中', htmlLang: 'zh-Hans', hreflang: 'zh-Hans', intl: 'zh-CN', og: 'zh_CN' },
};

export const pageIds = ['home', 'menu', 'reservation', 'visit', 'legal', 'privacy'] as const;
export type PageId = (typeof pageIds)[number];

const intlSlugs: Record<PageId, string> = {
  home: '',
  menu: 'menu',
  reservation: 'reservations',
  visit: 'visit',
  legal: 'legal-notice',
  privacy: 'privacy',
};

const slugs: Record<Locale, Record<PageId, string>> = {
  fr: {
    home: '',
    menu: 'carte',
    reservation: 'reservation',
    visit: 'nous-rendre-visite',
    legal: 'mentions-legales',
    privacy: 'confidentialite',
  },
  en: intlSlugs,
  ko: intlSlugs,
  zh: intlSlugs,
};

/** Segment d'URL (sans barres obliques) d'une page, utilisé par getStaticPaths. */
export function routeParam(locale: Locale, page: PageId): string | undefined {
  const parts = [locale === defaultLocale ? '' : locale, slugs[locale][page]].filter(Boolean);
  return parts.length ? parts.join('/') : undefined;
}

/** Chemin absolu d'une page, avec barre oblique finale. */
export function pathTo(locale: Locale, page: PageId, hash = ''): string {
  const param = routeParam(locale, page);
  return `${param ? `/${param}/` : '/'}${hash ? `#${hash}` : ''}`;
}

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
