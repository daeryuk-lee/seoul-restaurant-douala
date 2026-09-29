import { localeMeta, type Locale } from '../i18n/locales';

/** Prix localisé : 21000 → « 21 000 » (fr, espace fine insécable), « 21,000 » (en). */
export const formatPrice = (value: number, locale: Locale) =>
  new Intl.NumberFormat(localeMeta[locale].intl, { maximumFractionDigits: 0 }).format(value);

export const whatsappUrl = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
