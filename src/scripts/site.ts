/**
 * Améliorations progressives communes à toutes les pages.
 * Le site reste entièrement lisible et navigable sans ce script.
 */
import { formatDate, formatTime, nowAtRestaurant, openStatus, weekdayOf } from '../lib/hours';

const now = nowAtRestaurant();

/* En-tête : fond plein dès que l'on quitte le haut de page */
const root = document.documentElement;
let ticking = false;
const syncHeader = () => {
  root.toggleAttribute('data-scrolled', window.scrollY > 24);
  ticking = false;
};
syncHeader();
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(syncHeader);
    }
  },
  { passive: true },
);

/* Jour courant (heure de Douala) dans les tableaux d'horaires */
const today = String(weekdayOf(now.date));
document.querySelectorAll<HTMLElement>('[data-hours] [data-weekday]').forEach((row) => {
  row.toggleAttribute('data-today', row.dataset.weekday === today);
});

/* Indicateur « Ouvert / Fermé » */
type StatusStrings = {
  open: string;
  closed: string;
  until: string;
  reopensToday: string;
  reopensTomorrow: string;
  reopensOn: string;
  intl: string;
  locale: string;
};

const status = openStatus(now);
document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
  const s = JSON.parse(el.dataset.openStatus ?? '{}') as StatusStrings;
  const text = el.querySelector('.open-status__text');
  if (!text) return;

  const strong = document.createElement('strong');
  let detail = '';
  if (status.open) {
    strong.textContent = s.open;
    detail = s.until.replace('{time}', formatTime(status.until, s.locale));
  } else {
    strong.textContent = s.closed;
    const next = status.next;
    if (next) {
      const time = formatTime(next.time, s.locale);
      detail =
        next.inDays === 0
          ? s.reopensToday.replace('{time}', time)
          : next.inDays === 1
            ? s.reopensTomorrow.replace('{time}', time)
            : s.reopensOn
                .replace('{day}', formatDate(next.date, s.intl, { weekday: 'long' }))
                .replace('{time}', time);
    }
  }
  text.replaceChildren(strong, document.createTextNode(detail ? ` · ${detail}` : ''));
  el.dataset.state = status.open ? 'open' : 'closed';
  el.hidden = false;
});

/* Contenus datés (« Nouveau ») : retirés automatiquement après leur date */
document.querySelectorAll<HTMLElement>('[data-expires]').forEach((el) => {
  if (el.dataset.expires && now.date > el.dataset.expires) el.remove();
});

/* Anciennes adresses de l'ancien site (ex. /#menu) → nouvelles pages */
const legacy = document.querySelector<HTMLElement>('[data-legacy-hashes]');
if (legacy && location.hash) {
  const map = JSON.parse(legacy.dataset.legacyHashes ?? '{}') as Record<string, string>;
  const target = map[location.hash.slice(1)];
  if (target) location.replace(target);
}
