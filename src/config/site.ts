/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONFIGURATION DU RESTAURANT — le seul fichier à modifier pour les infos pratiques.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Toute valeur entre crochets « [ … ] » est à compléter : elle apparaît telle quelle
 *  sur le site et un avertissement s'affiche pendant la compilation tant qu'elle reste.
 */

export const site = {
  name: 'Seoul',
  fullName: 'Seoul Restaurant Coréen',
  url: 'https://restaurant-seoul-douala.com',

  phone: {
    display: '+237 6 99 21 13 00',
    e164: '+237699211300',
  },
  /** Numéro WhatsApp au format international, sans « + » ni espaces. */
  whatsapp: '237699211300',
  /** Adresse e-mail publique (facultative : laisser vide pour la masquer). */
  email: '',

  address: {
    street: 'Rue Chococho',
    landmark: { fr: 'À côté de LGM', en: 'Next to LGM', ko: 'LGM 옆', zh: 'LGM 旁边' },
    city: 'Douala',
    region: 'Littoral',
    country: { fr: 'Cameroun', en: 'Cameroon', ko: '카메룬', zh: '喀麦隆' },
    countryCode: 'CM',
  },
  geo: { lat: 4.027474387401219, lng: 9.69693699325819 },

  social: {
    instagram: 'https://www.instagram.com/seoulkorea237/',
    facebook: 'https://www.facebook.com/K.Restaurant.Seoul/',
    tripadvisor:
      'https://www.tripadvisor.fr/Restaurant_Review-g297392-d25460141-Reviews-Restaurant_SEOUL-Douala_Littoral_Region.html',
  },

  /**
   * Informations légales obligatoires (loi n° 2010/021 régissant le commerce électronique
   * au Cameroun) : identification complète de l'exploitant du site.
   */
  legal: {
    companyName: '[Raison sociale de l’exploitant]',
    legalForm: '[Forme juridique — ex. SARL, Établissement individuel]',
    rccm: '[Numéro RCCM]',
    niu: '[Numéro d’identifiant unique (NIU)]',
    publicationDirector: '[Nom et qualité du directeur de la publication]',
    host: {
      name: 'Cloudflare, Inc. (Cloudflare Pages)',
      address: '101 Townsend St, San Francisco, CA 94107, États-Unis',
      url: 'https://www.cloudflare.com',
    },
    /** Date de dernière mise à jour des pages légales (AAAA-MM-JJ). */
    lastUpdated: '2026-09-29',
  },
} as const;

/**
 * Horaires d'ouverture. Jours : 0 = dimanche, 1 = lundi, … 6 = samedi.
 * Le fuseau horaire du restaurant est utilisé pour tous les calculs (réservations,
 * « ouvert maintenant »), quel que soit le pays du visiteur.
 */
export const hours = {
  timeZone: 'Africa/Douala',
  services: [
    { id: 'lunch', start: '12:00', end: '15:00' },
    { id: 'dinner', start: '18:00', end: '22:30' },
  ],
  closedWeekdays: [2],
  /** Fermetures exceptionnelles (jours fériés, congés…) au format AAAA-MM-JJ. */
  closedDates: [] as string[],
} as const;

export const booking = {
  /** Intervalle entre deux créneaux proposés, en minutes. */
  slotStep: 15,
  /** Dernier créneau réservable avant la fin de chaque service, en minutes. */
  lastSlotBeforeClose: 60,
  /** Nombre de jours ouverts à la réservation. */
  windowDays: 60,
  /** Au-delà, le client est invité à appeler. */
  maxGuests: 10,
} as const;

/**
 * Plats signalés « Nouveau » : l'étiquette et la rubrique d'accueil disparaissent
 * automatiquement après cette date.
 */
export const newDishesUntil = '2026-10-20';
