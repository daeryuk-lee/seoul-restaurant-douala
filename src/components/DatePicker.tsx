import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getTodayISO } from '../utils/reservation';
import type { Lang } from '../i18n/translations';

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholderKey: string;
};

const MONTH_KEYS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const MONTH_KEYS_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const MONTH_KEYS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_KEYS_ZH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const WEEKDAY_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
const WEEKDAY_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAY_ZH = ['日', '一', '二', '三', '四', '五', '六'];

const monthKeysByLang: Record<Lang, string[]> = {
  fr: MONTH_KEYS_FR,
  ko: MONTH_KEYS_KO,
  en: MONTH_KEYS_EN,
  zh: MONTH_KEYS_ZH,
};

const weekdayByLang: Record<Lang, string[]> = {
  fr: WEEKDAY_FR,
  ko: WEEKDAY_KO,
  en: WEEKDAY_EN,
  zh: WEEKDAY_ZH,
};

// Les mardis = 2 (JavaScript getDay : 0=dim, 1=lun, 2=mar, ...)
// Mais pour une grille qui commence au lundi (ISO), il faut :
//   lun=0, mar=1, mer=2, jeu=3, ven=4, sam=5, dim=6
const CLOSED_DAY_INDEX = 1; // mardi dans une grille lundi-dimanche

const DatePicker = ({ value, onChange, placeholderKey }: DatePickerProps) => {
  const { lang, t } = useLanguage();
  const todayStr = getTodayISO();

  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  const monthKeys = monthKeysByLang[lang];
  const weekdays = weekdayByLang[lang];

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    // getDay : 0=dim, 1=lun, ..., 6=sam
    // On veut un décalage tel que la grille commence au lundi (0)
    const startOffset = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [viewYear, viewMonth]);

  const isDayDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (date.getDay() === 2) return true; // mardi = fermé
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return iso < todayStr;
  };

  const handleSelect = (day: number) => {
    if (isDayDisabled(day)) return;
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
    setIsOpen(false);
  };

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const today = new Date();
  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());

  // Formatage de la date sélectionnée
  const formattedValue = value
    ? (() => {
        const parts = value.split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const weekday = d.getDay(); // 0=dim
        const weekdayKeys = {
          fr: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
          ko: ['일', '월', '화', '수', '목', '금', '토'],
          en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        }[lang];
        const day = parts[2];
        const month = monthKeys[parts[1] - 1];
        const year = parts[0];
        if (lang === 'fr') return `${weekdayKeys[weekday]} ${day} ${month} ${year}`;
        if (lang === 'ko') return `${year}년 ${month} ${day}일 ${weekdayKeys[weekday]}`;
        if (lang === 'en') return `${weekdayKeys[weekday]} ${month} ${day}, ${year}`;
        return `${year}年${month}${day}日 ${weekdayKeys[weekday]}`;
      })()
    : '';

  return (
    <div className="relative">
      <span className="text-xs uppercase tracking-[0.2em] text-white/58 block mb-2.5">
        {t('reservation_date')}
      </span>

      {/* Bouton d'ouverture du calendrier */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`w-full rounded-2xl border bg-black/25 px-4 py-3.5 text-left transition-colors flex items-center gap-3 ${
          isOpen ? 'border-[#D4AF37]/50' : 'border-white/10 hover:border-[#D4AF37]/30'
        }`}
      >
        <CalendarDays size={16} className="text-[#D4AF37]/60 flex-shrink-0" />
        {formattedValue ? (
          <span className="text-white/90 text-sm font-light">{formattedValue}</span>
        ) : (
          <span className="text-white/20 text-sm">{t(placeholderKey)}</span>
        )}
      </button>

      {/* Calendrier — modale centrée sur mobile/tablette, dropdown sur desktop */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/70 lg:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(360px,calc(100vw-2rem))]
              lg:absolute lg:left-0 lg:right-0 lg:top-full lg:translate-x-0 lg:translate-y-0 lg:mt-2 lg:w-auto
              z-[80] rounded-2xl border border-[#D4AF37]/18 bg-[#0a0a0a] shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-4
            "
          >
            {/* Header du calendrier */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={goToPrevMonth}
                disabled={!canGoPrev}
                className="p-2 text-white/50 hover:text-[#D4AF37] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-serif text-white/90 tracking-wide">
                {monthKeys[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 text-white/50 hover:text-[#D4AF37] transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((wd, i) => (
                <div
                  key={i}
                  className={`text-center text-[10px] uppercase tracking-wider py-1 ${
                    i === CLOSED_DAY_INDEX ? 'text-red-400/40' : 'text-white/30'
                  }`}
                >
                  {wd}
                </div>
              ))}
            </div>

            {/* Jours du mois */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                const isTuesday = day !== null && i % 7 === CLOSED_DAY_INDEX;
                const isDisabled = day === null || (day !== null && isDayDisabled(day));
                const isSelected =
                  day !== null &&
                  value === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday =
                  day !== null &&
                  viewYear === today.getFullYear() &&
                  viewMonth === today.getMonth() &&
                  day === today.getDate();

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => day !== null && handleSelect(day)}
                    className={`
                      aspect-square min-h-[40px] flex items-center justify-center rounded-lg text-sm transition-all
                      ${day === null ? 'invisible' : ''}
                      ${isTuesday ? 'text-red-400/30 line-through cursor-not-allowed' : ''}
                      ${!isTuesday && isDisabled ? 'text-white/15 cursor-not-allowed' : ''}
                      ${!isDisabled && !isSelected ? 'text-white/70 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] cursor-pointer active:bg-[#D4AF37]/25' : ''}
                      ${isSelected ? 'bg-[#D4AF37] text-black font-medium cursor-default' : ''}
                      ${isToday && !isSelected ? 'ring-1 ring-[#D4AF37]/30' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Légende mardi */}
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/35">
              <span className="text-red-400/50 line-through">--</span>
              <span>{t('reservation_closed_notice')}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DatePicker;
