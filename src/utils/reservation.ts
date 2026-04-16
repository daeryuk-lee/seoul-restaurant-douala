export const SERVICE_WINDOWS = [
  { key: 'reservation_service_lunch',  start: '12:00', end: '15:00' },
  { key: 'reservation_service_dinner', start: '18:00', end: '22:30' },
] as const;

// Créneaux toutes les 15 minutes, dernier créneau 1h avant la fermeture
const SLOT_INTERVAL_MINUTES = 15;
const CUTOFF_BEFORE_CLOSE_MINUTES = 60;

export const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const pad = (value: number) => value.toString().padStart(2, '0');

const dateAtMidnight = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getTodayISO = () => {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

/** Retourne true si le jour est un mardi (getDay() === 2) */
export const isClosedDay = (dateString: string) => {
  if (!dateString) return false;
  return new Date(`${dateString}T12:00:00`).getDay() === 2;
};

export const isPastDate = (dateString: string) => {
  if (!dateString) return false;
  const selected = new Date(`${dateString}T00:00:00`);
  return dateAtMidnight(selected).getTime() < dateAtMidnight(new Date()).getTime();
};

export const isWithinServiceHours = (time: string) => {
  if (!time) return false;
  const minutes = toMinutes(time);
  return SERVICE_WINDOWS.some(
    (w) =>
      minutes >= toMinutes(w.start) &&
      minutes <= toMinutes(w.end) - CUTOFF_BEFORE_CLOSE_MINUTES,
  );
};

export const isPastTime = (dateString: string, time: string) => {
  if (!dateString || !time) return false;
  const now = new Date();
  const selectedDate = new Date(`${dateString}T00:00:00`);
  if (dateAtMidnight(selectedDate).getTime() !== dateAtMidnight(now).getTime()) return false;
  return toMinutes(time) < now.getHours() * 60 + now.getMinutes();
};

/**
 * Génère les créneaux entre start et (end - CUTOFF) toutes les 15 minutes.
 */
const buildSlotsBetween = (start: string, end: string): string[] => {
  const slots: string[] = [];
  const limit = toMinutes(end) - CUTOFF_BEFORE_CLOSE_MINUTES;
  for (
    let current = toMinutes(start);
    current <= limit;
    current += SLOT_INTERVAL_MINUTES
  ) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    slots.push(`${pad(hours)}:${pad(minutes)}`);
  }
  return slots;
};

export const getAvailableTimeSlots = (dateString: string): string[] => {
  if (!dateString || isClosedDay(dateString) || isPastDate(dateString)) return [];

  const allSlots = SERVICE_WINDOWS.flatMap((w) => buildSlotsBetween(w.start, w.end));

  const now = new Date();
  const selectedDate = new Date(`${dateString}T00:00:00`);
  const isToday =
    dateAtMidnight(selectedDate).getTime() === dateAtMidnight(now).getTime();

  if (!isToday) return allSlots;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return allSlots.filter((slot) => toMinutes(slot) > currentMinutes);
};

export const getServiceWindowKey = (time: string) => {
  if (!time) return null;
  const minutes = toMinutes(time);
  const w = SERVICE_WINDOWS.find(
    (item) =>
      minutes >= toMinutes(item.start) &&
      minutes <= toMinutes(item.end) - CUTOFF_BEFORE_CLOSE_MINUTES,
  );
  return w?.key ?? null;
};

export const validateReservation = (payload: {
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
}) => {
  if (!payload.name || !payload.phone || !payload.guests || !payload.date || !payload.time) {
    return 'reservation_error_required';
  }
  if (isPastDate(payload.date))    return 'reservation_error_past_date';
  if (isClosedDay(payload.date))   return 'reservation_error_closed_day';
  if (!isWithinServiceHours(payload.time)) return 'reservation_error_closed_time';
  if (isPastTime(payload.date, payload.time)) return 'reservation_error_past_time';
  return null;
};

export const getNextOpenDate = (from = new Date()) => {
  const date = new Date(from);
  for (let i = 0; i < 14; i += 1) {
    if (date.getDay() !== 2) return date;
    date.setDate(date.getDate() + 1);
  }
  return from;
};

/**
 * Retourne la liste des dates de mardis dans les prochains 365 jours
 * au format "YYYY-MM-DD", utile pour les désactiver côté HTML si besoin.
 */
export const getUpcomingTuesdays = (fromISO?: string): string[] => {
  const tuesdays: string[] = [];
  const start = fromISO ? new Date(`${fromISO}T00:00:00`) : new Date();
  for (let i = 0; i <= 365; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 2) {
      tuesdays.push(
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      );
    }
  }
  return tuesdays;
};

export const formatLongDate = (dateString: string, locale: string) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${dateString}T12:00:00`));
};
