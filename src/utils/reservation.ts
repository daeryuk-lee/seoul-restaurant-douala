export const SERVICE_WINDOWS = [
  { key: 'reservation_service_lunch', start: '12:00', end: '15:00' },
  { key: 'reservation_service_dinner', start: '18:00', end: '22:30' },
] as const;

const SLOT_INTERVAL_MINUTES = 30;

export const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const pad = (value: number) => value.toString().padStart(2, '0');

const dateAtMidnight = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getTodayISO = () => {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

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
  return SERVICE_WINDOWS.some((window) => minutes >= toMinutes(window.start) && minutes <= toMinutes(window.end));
};

export const isPastTime = (dateString: string, time: string) => {
  if (!dateString || !time) return false;
  const now = new Date();
  const selectedDate = new Date(`${dateString}T00:00:00`);
  const today = dateAtMidnight(now);

  if (dateAtMidnight(selectedDate).getTime() !== today.getTime()) return false;

  return toMinutes(time) < now.getHours() * 60 + now.getMinutes();
};

const buildSlotsBetween = (start: string, end: string) => {
  const slots: string[] = [];
  for (let current = toMinutes(start); current <= toMinutes(end); current += SLOT_INTERVAL_MINUTES) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    slots.push(`${pad(hours)}:${pad(minutes)}`);
  }
  return slots;
};

export const getAvailableTimeSlots = (dateString: string) => {
  if (isClosedDay(dateString) || isPastDate(dateString)) return [];

  const allSlots = SERVICE_WINDOWS.flatMap((window) => buildSlotsBetween(window.start, window.end));

  if (!dateString) return allSlots;

  const now = new Date();
  const selectedDate = new Date(`${dateString}T00:00:00`);
  const isToday = dateAtMidnight(selectedDate).getTime() === dateAtMidnight(now).getTime();

  if (!isToday) return allSlots;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return allSlots.filter((slot) => toMinutes(slot) >= currentMinutes);
};

export const getServiceWindowKey = (time: string) => {
  const minutes = toMinutes(time);
  const window = SERVICE_WINDOWS.find((item) => minutes >= toMinutes(item.start) && minutes <= toMinutes(item.end));
  return window?.key ?? null;
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

  if (isPastDate(payload.date)) {
    return 'reservation_error_past_date';
  }

  if (isClosedDay(payload.date)) {
    return 'reservation_error_closed_day';
  }

  if (!isWithinServiceHours(payload.time)) {
    return 'reservation_error_closed_time';
  }

  if (isPastTime(payload.date, payload.time)) {
    return 'reservation_error_past_time';
  }

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

export const formatLongDate = (dateString: string, locale: string) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${dateString}T12:00:00`));
};
