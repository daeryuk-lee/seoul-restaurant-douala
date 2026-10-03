/**
 * Formulaire de réservation : propose les dates et créneaux ouverts (heure de Douala),
 * valide la saisie puis prépare le message WhatsApp. Aucune donnée n'est envoyée au serveur.
 */
import { availableSlots, bookableDays, formatDate, formatTime, nowAtRestaurant, type ServiceId } from '../lib/hours';

type Config = {
  locale: string;
  intl: string;
  whatsapp: string;
  maxGuests: number;
  strings: {
    today: string;
    tomorrow: string;
    closed: string;
    noSlots: string;
    services: Record<ServiceId, string>;
    errors: Record<'date' | 'time' | 'name' | 'phone', string>;
    whatsapp: Record<'header' | 'name' | 'phone' | 'guests' | 'date' | 'time' | 'service' | 'table' | 'message' | 'footer', string> & {
      services: Record<ServiceId, string>;
      tables: Record<'classic' | 'bbq', string>;
    };
  };
};

const form = document.querySelector<HTMLFormElement>('form[data-booking]');

if (form) {
  const config = JSON.parse(form.dataset.booking ?? '{}') as Config;
  const s = config.strings;
  const now = nowAtRestaurant();

  const datesEl = form.querySelector<HTMLElement>('[data-dates]')!;
  const slotsEl = form.querySelector<HTMLElement>('[data-slots]')!;
  const guests = form.querySelector<HTMLInputElement>('#guests')!;
  const summary = form.querySelector<HTMLElement>('.booking__summary')!;
  const success = form.querySelector<HTMLElement>('.booking__success')!;
  const fallback = form.querySelector<HTMLAnchorElement>('[data-fallback]')!;

  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  /* ── Dates ── */
  const days = bookableDays(now);
  const fragment = document.createDocumentFragment();
  days.forEach((day, index) => {
    const label = el('label', 'date-chip');
    const input = el('input');
    input.type = 'radio';
    input.name = 'date';
    input.value = day.date;
    input.disabled = day.closed || day.full;
    input.setAttribute('aria-label', formatDate(day.date, config.intl, { weekday: 'long', day: 'numeric', month: 'long' }) + (day.closed ? ` — ${s.closed}` : ''));

    const note = day.closed || day.full ? s.closed : index === 0 ? s.today : index === 1 ? s.tomorrow : '';
    label.append(
      input,
      el('span', 'date-chip__dow', formatDate(day.date, config.intl, { weekday: 'short' })),
      el('span', 'date-chip__day', formatDate(day.date, config.intl, { day: 'numeric' })),
      el('span', 'date-chip__month', formatDate(day.date, config.intl, { month: 'short' })),
      el('span', 'date-chip__note', note),
    );
    fragment.append(label);
  });
  datesEl.replaceChildren(fragment);

  /* ── Créneaux ── */
  const renderSlots = (date: string) => {
    const groups = availableSlots(date, nowAtRestaurant());
    if (!groups.length) {
      slotsEl.replaceChildren(el('p', 'booking__placeholder', s.noSlots));
      return;
    }
    slotsEl.replaceChildren(
      ...groups.map((group) => {
        const wrapper = el('div', 'slot-group');
        const titleId = `slots-${group.service}`;
        const title = el('p', 'slot-group__title', s.services[group.service]);
        title.id = titleId;
        const list = el('div', 'slot-group__list');
        list.setAttribute('role', 'group');
        list.setAttribute('aria-labelledby', titleId);
        group.slots.forEach((slot) => {
          const label = el('label', 'slot');
          const input = el('input');
          input.type = 'radio';
          input.name = 'time';
          input.value = slot;
          input.dataset.service = group.service;
          label.append(input, el('span', undefined, formatTime(slot, config.locale)));
          list.append(label);
        });
        wrapper.append(title, list);
        return wrapper;
      }),
    );
  };

  datesEl.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.name === 'date') {
      renderSlots(input.value);
      clearError('date');
    }
  });
  slotsEl.addEventListener('change', () => clearError('time'));

  // Présélection du premier jour réservable
  const first = datesEl.querySelector<HTMLInputElement>('input:not(:disabled)');
  if (first) {
    first.checked = true;
    renderSlots(first.value);
  }

  /* ── Convives ── */
  const clampGuests = () => {
    const value = Math.min(config.maxGuests, Math.max(1, Math.round(Number(guests.value) || 1)));
    guests.value = String(value);
    form.querySelectorAll<HTMLButtonElement>('.stepper__btn').forEach((btn) => {
      const step = Number(btn.dataset.step);
      btn.disabled = (step < 0 && value <= 1) || (step > 0 && value >= config.maxGuests);
    });
  };
  form.querySelectorAll<HTMLButtonElement>('.stepper__btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      guests.value = String(Number(guests.value) + Number(btn.dataset.step));
      clampGuests();
    }),
  );
  guests.addEventListener('change', clampGuests);
  clampGuests();

  /* ── Table (présélection via ?table=bbq depuis la page d'accueil) ── */
  if (new URLSearchParams(location.search).get('table') === 'bbq') {
    const bbq = form.querySelector<HTMLInputElement>('input[name="table"][value="bbq"]');
    if (bbq) bbq.checked = true;
  }

  /* ── Validation ── */
  type Field = 'date' | 'time' | 'name' | 'phone';

  function showError(field: Field) {
    const message = form!.querySelector<HTMLElement>(`[data-error="${field}"]`);
    if (message) {
      message.textContent = s.errors[field];
      message.hidden = false;
    }
    form!.querySelector(`#${field}`)?.setAttribute('aria-invalid', 'true');
  }

  function clearError(field: Field) {
    const message = form!.querySelector<HTMLElement>(`[data-error="${field}"]`);
    if (message) message.hidden = true;
    form!.querySelector(`#${field}`)?.removeAttribute('aria-invalid');
    if (!form!.querySelector('[data-error]:not([hidden])')) summary.hidden = true;
  }

  (['name', 'phone'] as const).forEach((field) =>
    form.querySelector(`#${field}`)?.addEventListener('input', () => clearError(field)),
  );

  const value = (name: string) => (new FormData(form).get(name) as string | null)?.trim() ?? '';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    success.hidden = true;
    clampGuests(); // un nombre saisi au clavier sans quitter le champ n'a pas encore été borné

    const date = value('date');
    const time = value('time');
    const name = value('name');
    const phone = value('phone');
    const digits = phone.replace(/\D/g, '');

    const invalid: Field[] = [];
    if (!date) invalid.push('date');
    if (!time) invalid.push('time');
    if (name.length < 2) invalid.push('name');
    if (digits.length < 8 || digits.length > 15 || /[^\d\s+().-]/.test(phone)) invalid.push('phone');

    (['date', 'time', 'name', 'phone'] as const).forEach((f) => (invalid.includes(f) ? showError(f) : clearError(f)));

    if (invalid.length) {
      summary.hidden = false;
      summary.focus();
      const firstInvalid = invalid[0];
      if (firstInvalid === 'name' || firstInvalid === 'phone') form.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus();
      return;
    }

    const service = form.querySelector<HTMLInputElement>('input[name="time"]:checked')?.dataset.service as ServiceId | undefined;
    const w = s.whatsapp;
    const longDate = formatDate(date, config.intl, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const message = value('message');

    // Format d'origine du message, identique dans les 4 langues : une ligne par information, précédée d'un émoji
    const text = [
      w.header,
      `👤 ${w.name}: ${name}`,
      `📞 ${w.phone}: ${phone}`,
      `👥 ${w.guests}: ${value('guests')}`,
      `📅 ${w.date}: ${longDate}`,
      `🕐 ${w.time}: ${time}`,
      ...(service ? [`🍽️ ${w.service}: ${w.services[service]}`] : []),
      `🔥 ${w.table}: ${value('table') === 'bbq' ? w.tables.bbq : w.tables.classic}`,
      ...(message ? [`💬 ${w.message}: ${message}`] : []),
      w.footer,
    ].join('\n');

    const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
    fallback.href = url;
    window.open(url, '_blank', 'noopener');
    success.hidden = false;
    success.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}
