/** Données structurées schema.org (JSON-LD) pour les moteurs de recherche. */
import { hours, site } from '../config/site';
import { menu, type Dish } from '../data/menu';
import { localeMeta, pathTo, type Locale, type PageId } from '../i18n/locales';

const abs = (path: string) => new URL(path, site.url).href;
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const priceValues = (dish: Dish) => (typeof dish.price === 'number' ? [dish.price] : dish.price.map((p) => p.value));
const allPrices = menu.flatMap((c) => c.dishes.flatMap(priceValues));

export const restaurantId = abs('/#restaurant');

export function restaurantSchema(locale: Locale, description: string) {
  const openDays = [0, 1, 2, 3, 4, 5, 6]
    .filter((d) => !(hours.closedWeekdays as readonly number[]).includes(d))
    .map((d) => dayNames[d]);

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': restaurantId,
    name: site.fullName,
    alternateName: site.name,
    description,
    url: abs(pathTo(locale, 'home')),
    image: abs('/og-image.jpg'),
    logo: abs('/icons/icon-512.png'),
    telephone: site.phone.e164,
    ...(site.email ? { email: site.email } : {}),
    servesCuisine: ['Korean', 'Korean barbecue', 'Sushi'],
    priceRange: `${Math.min(...allPrices)} – ${Math.max(...allPrices)} XAF`,
    currenciesAccepted: 'XAF',
    acceptsReservations: abs(pathTo(locale, 'reservation')),
    hasMenu: abs(pathTo(locale, 'menu')),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.street} (${site.address.landmark[locale]})`,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: hours.services.map((s) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: openDays,
      opens: s.start,
      closes: s.end,
    })),
    sameAs: Object.values(site.social),
    inLanguage: localeMeta[locale].hreflang,
  };
}

export function menuSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': abs(`${pathTo(locale, 'menu')}#menu`),
    name: site.fullName,
    inLanguage: localeMeta[locale].hreflang,
    mainEntityOfPage: abs(pathTo(locale, 'menu')),
    hasMenuSection: menu.map((category) => ({
      '@type': 'MenuSection',
      name: category.title[locale],
      description: category.intro[locale],
      hasMenuItem: category.dishes.map((dish) => ({
        '@type': 'MenuItem',
        name: dish.name[locale],
        ...(dish.desc ? { description: dish.desc[locale] } : {}),
        ...(dish.veg === true ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {}),
        offers: priceValues(dish).map((price) => ({ '@type': 'Offer', price, priceCurrency: 'XAF' })),
      })),
    })),
  };
}

export function breadcrumbSchema(locale: Locale, items: { page: PageId; name: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: abs(pathTo(locale, item.page)),
    })),
  };
}
