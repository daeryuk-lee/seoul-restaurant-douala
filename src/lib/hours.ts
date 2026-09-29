/**
 * Logique d'horaires, partagée entre la génération statique et le navigateur.
 * Toutes les dates sont manipulées sous forme « AAAA-MM-JJ » et toutes les heures
 * dans le fuseau du restaurant, quel que soit le pays du visiteur.
 */
import { booking, hours } from '../config/site';

export type ServiceId = (typeof hours.services)[number]['id'];
export type IsoDate = string;

export const toMinutes = (time: string): number => {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return h * 60 + m;
};

const pad = (n: number) => String(n).padStart(2, '0');
export const fromMinutes = (minutes: number): string => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

const toUtc = (iso: IsoDate) => {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const weekdayOf = (iso: IsoDate): number => toUtc(iso).getUTCDay();

export const addDays = (iso: IsoDate, days: number): IsoDate => {
  const date = toUtc(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

/** Date et heure actuelles dans le fuseau du restaurant. */
export function nowAtRestaurant(now = new Date()): { date: IsoDate; minutes: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: hours.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export const isClosedOn = (iso: IsoDate): boolean =>
  (hours.closedWeekdays as readonly number[]).includes(weekdayOf(iso)) ||
  (hours.closedDates as readonly string[]).includes(iso);

/** Créneaux réservables d'un service (dernier créneau une heure avant la fin). */
export function slotsFor(service: (typeof hours.services)[number]): string[] {
  const slots: string[] = [];
  const last = toMinutes(service.end) - booking.lastSlotBeforeClose;
  for (let m = toMinutes(service.start); m <= last; m += booking.slotStep) slots.push(fromMinutes(m));
  return slots;
}

/** Créneaux encore disponibles pour une date, regroupés par service. */
export function availableSlots(iso: IsoDate, now = nowAtRestaurant()): { service: ServiceId; slots: string[] }[] {
  if (isClosedOn(iso) || iso < now.date) return [];
  return hours.services
    .map((service) => ({
      service: service.id,
      slots: slotsFor(service).filter((slot) => iso > now.date || toMinutes(slot) > now.minutes),
    }))
    .filter((group) => group.slots.length > 0);
}

/** Jours proposés à la réservation, à partir d'aujourd'hui (heure de Douala). */
export function bookableDays(now = nowAtRestaurant()): { date: IsoDate; closed: boolean; full: boolean }[] {
  return Array.from({ length: booking.windowDays }, (_, i) => {
    const date = addDays(now.date, i);
    const closed = isClosedOn(date);
    return { date, closed, full: !closed && availableSlots(date, now).length === 0 };
  });
}

export type OpenStatus =
  | { open: true; until: string }
  | { open: false; next: { date: IsoDate; time: string; inDays: number } | null };

/** État d'ouverture actuel et prochaine ouverture. */
export function openStatus(now = nowAtRestaurant()): OpenStatus {
  if (!isClosedOn(now.date)) {
    const current = hours.services.find(
      (s) => now.minutes >= toMinutes(s.start) && now.minutes < toMinutes(s.end),
    );
    if (current) return { open: true, until: current.end };
  }
  for (let i = 0; i < 14; i++) {
    const date = addDays(now.date, i);
    if (isClosedOn(date)) continue;
    const next = hours.services.find((s) => i > 0 || toMinutes(s.start) > now.minutes);
    if (next) return { open: false, next: { date, time: next.start, inDays: i } };
  }
  return { open: false, next: null };
}

/** Jours de la semaine dans l'ordre d'affichage (lundi → dimanche). */
export const displayWeek = [1, 2, 3, 4, 5, 6, 0] as const;

export const isOpenWeekday = (weekday: number) => !(hours.closedWeekdays as readonly number[]).includes(weekday);

/** Nom localisé d'un jour de la semaine (0 = dimanche). */
export const weekdayName = (weekday: number, intlLocale: string, style: 'long' | 'short' = 'long') =>
  new Intl.DateTimeFormat(intlLocale, { weekday: style, timeZone: 'UTC' }).format(
    // 4 janvier 1970 était un dimanche
    new Date(Date.UTC(1970, 0, 4 + weekday)),
  );

export const formatDate = (iso: IsoDate, intlLocale: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(intlLocale, { ...options, timeZone: 'UTC' }).format(toUtc(iso));

/** Heure localisée : 12:00 → « 12 h 00 » (fr), « 12:00 » (en), « 12:00 » (ko/zh). */
export const formatTime = (time: string, locale: string) => (locale === 'fr' ? time.replace(':', ' h ') : time);
