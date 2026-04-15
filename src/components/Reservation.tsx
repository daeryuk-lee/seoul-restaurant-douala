import { useMemo, useState, type FormEvent } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, Phone, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  SERVICE_WINDOWS,
  formatLongDate,
  getAvailableTimeSlots,
  getNextOpenDate,
  getServiceWindowKey,
  getTodayISO,
  isClosedDay,
  validateReservation,
} from '../utils/reservation';

const WHATSAPP_NUMBER = '237699211300';
const RESTAURANT_PHONE = '+237699211300';

const localeByLang = {
  fr: 'fr-FR',
  ko: 'ko-KR',
  en: 'en-US',
  zh: 'zh-CN',
} as const;

type ReservationForm = {
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  note: string;
};

const guestOptions = ['1', '2', '3', '4', '5', '6', '8', '10'];

const Reservation = () => {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState<ReservationForm>({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    note: '',
  });
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const availableSlots = useMemo(() => getAvailableTimeSlots(form.date), [form.date]);
  const selectedServiceKey = form.time ? getServiceWindowKey(form.time) : null;
  const isTuesday = isClosedDay(form.date);

  const nextOpenLabel = useMemo(() => {
    if (!isTuesday) return '';
    const baseDate = form.date ? new Date(`${form.date}T12:00:00`) : new Date();
    return new Intl.DateTimeFormat(localeByLang[lang], {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(getNextOpenDate(baseDate));
  }, [form.date, isTuesday, lang]);

  const updateField = (field: keyof ReservationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorKey(null);
    setShowSuccess(false);
  };

  const handleDateChange = (value: string) => {
    const nextSlots = getAvailableTimeSlots(value);

    setForm((prev) => ({
      ...prev,
      date: value,
      time: nextSlots.includes(prev.time) ? prev.time : '',
    }));
    setErrorKey(null);
    setShowSuccess(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateReservation(form);
    if (validationError) {
      setErrorKey(validationError);
      setShowSuccess(false);
      return;
    }

    const formattedDate = formatLongDate(form.date, localeByLang[lang]);
    const message = [
      t('reservation_whatsapp_header'),
      '',
      `${t('reservation_name')}: ${form.name}`,
      `${t('reservation_phone')}: ${form.phone}`,
      `${t('reservation_guests')}: ${form.guests}`,
      `${t('reservation_date')}: ${formattedDate}`,
      `${t('reservation_time')}: ${form.time}`,
      selectedServiceKey ? `${t('reservation_selected_service')}: ${t(selectedServiceKey)}` : null,
      `${t('reservation_note')}: ${form.note || '-'}`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setErrorKey(null);
    setShowSuccess(true);
  };

  return (
    <section id="reservation" className="py-28 bg-[#090909] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.14),_transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 mb-5">{t('reservation_kicker')}</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-white/90 mb-4">{t('reservation_title')}</h2>
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mb-6"></div>
          <p className="text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">{t('reservation_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.15fr] gap-8 items-start">
          <div className="relative overflow-hidden rounded-[28px] border border-[#D4AF37]/16 bg-[linear-gradient(180deg,rgba(24,24,24,0.96),rgba(9,9,9,0.98))] p-7 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.45),_transparent_28%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]/80 mb-6">
                <Sparkles size={12} /> Seoul Restaurant
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-white/95 leading-tight mb-4">
                {t('reservation_panel_title')}
              </h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed mb-8 max-w-md">
                {t('reservation_panel_desc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {SERVICE_WINDOWS.map((window) => (
                  <div
                    key={window.key}
                    className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#D4AF37]/70 mb-2">
                      {t(window.key)}
                    </p>
                    <p className="text-white/85 text-sm font-light">
                      {window.start} – {window.end}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-5 mb-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/45 mb-4">
                  {t('reservation_panel_hours')}
                </p>
                <div className="space-y-3 text-sm font-light text-white/72">
                  <div className="flex justify-between gap-3">
                    <span>{t('footer_monday')}</span>
                    <span>12:00–15:00 · 18:00–22:30</span>
                  </div>
                  <div className="flex justify-between gap-3 text-red-300/75">
                    <span>{t('footer_tuesday')}</span>
                    <span>{t('footer_closed')}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>{t('footer_wed_sun')}</span>
                    <span>12:00–15:00 · 18:00–22:30</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <a
                  href={`tel:${RESTAURANT_PHONE}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] hover:bg-[#D4AF37]/16 transition-colors"
                >
                  <Phone size={14} /> {t('reservation_call_cta')}
                </a>
                <span className="text-sm text-white/55 font-light">+237 6 99 21 13 00</span>
              </div>

              <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                {t('reservation_panel_policy')}
              </p>

              {selectedServiceKey && (
                <div className="rounded-2xl border border-[#D4AF37]/18 bg-[#D4AF37]/8 px-4 py-4 mb-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]/70 mb-2">
                    {t('reservation_selected_service')}
                  </p>
                  <p className="text-white/90 font-light">{t(selectedServiceKey)}</p>
                </div>
              )}

              {isTuesday && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/6 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-300/85 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-100/90 font-light mb-1">{t('reservation_closed_notice')}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-red-200/55">
                        {t('reservation_next_open')}: {nextOpenLabel}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[28px] border border-[#D4AF37]/16 bg-[linear-gradient(180deg,rgba(19,19,19,0.97),rgba(10,10,10,0.98))] p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.38),_transparent_30%)]" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/55 mb-3">WhatsApp</p>
                  <h3 className="text-2xl font-serif text-white/92">{t('reservation_form_title')}</h3>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
                  <CalendarDays size={14} className="text-[#D4AF37]/65" />
                  {t('reservation_kicker')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="space-y-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">{t('reservation_name')}</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full rounded-2xl bg-black/25 border border-white/10 px-4 py-3.5 text-white/90 placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                  />
                </label>

                <label className="space-y-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">{t('reservation_phone')}</span>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60" />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full rounded-2xl bg-black/25 border border-white/10 pl-11 pr-4 py-3.5 text-white/90 placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                    />
                  </div>
                </label>

                <label className="space-y-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">{t('reservation_guests')}</span>
                  <div className="relative">
                    <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60" />
                    <select
                      value={form.guests}
                      onChange={(e) => updateField('guests', e.target.value)}
                      className="w-full appearance-none rounded-2xl bg-black/25 border border-white/10 pl-11 pr-4 py-3.5 text-white/90 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                    >
                      {guestOptions.map((option) => (
                        <option key={option} value={option} className="bg-[#121212] text-white">
                          {option}
                        </option>
                      ))}
                      <option value="12+" className="bg-[#121212] text-white">12+</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-white/35 font-light">{t('reservation_guest_hint')}</p>
                </label>

                <label className="space-y-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">{t('reservation_date')}</span>
                  <div className="relative">
                    <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60" />
                    <input
                      type="date"
                      required
                      min={getTodayISO()}
                      value={form.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full rounded-2xl bg-black/25 border border-white/10 pl-11 pr-4 py-3.5 text-white/90 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                    />
                  </div>
                </label>

                <label className="space-y-2.5 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">{t('reservation_time')}</span>
                  <div className="relative">
                    <Clock3 size={16} className="absolute left-4 top-4 text-[#D4AF37]/60" />
                    <select
                      required
                      value={form.time}
                      onChange={(e) => updateField('time', e.target.value)}
                      disabled={!form.date || availableSlots.length === 0}
                      className="w-full appearance-none rounded-2xl bg-black/25 border border-white/10 pl-11 pr-4 py-3.5 text-white/90 focus:border-[#D4AF37]/50 focus:outline-none transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                    >
                      <option value="" className="bg-[#121212] text-white">
                        {t('reservation_time_placeholder')}
                      </option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot} className="bg-[#121212] text-white">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {form.date && availableSlots.length > 0 && (
                    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]/65 mb-3">
                        {t('reservation_available_slots')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availableSlots.slice(0, 10).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => updateField('time', slot)}
                            className={`rounded-full px-3.5 py-1.5 text-xs transition-colors border ${
                              form.time === slot
                                ? 'border-[#D4AF37]/45 bg-[#D4AF37]/12 text-[#D4AF37]'
                                : 'border-white/8 bg-white/[0.02] text-white/50 hover:border-[#D4AF37]/20 hover:text-white/80'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </label>

                <label className="space-y-2.5 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">{t('reservation_note')}</span>
                  <textarea
                    rows={4}
                    value={form.note}
                    onChange={(e) => updateField('note', e.target.value)}
                    className="w-full rounded-2xl bg-black/25 border border-white/10 px-4 py-3.5 text-white/90 resize-none focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                  />
                </label>
              </div>

              {form.date && !isTuesday && (
                <div className="mt-6 rounded-2xl border border-[#D4AF37]/14 bg-[#D4AF37]/6 px-4 py-4 text-sm text-white/72 font-light">
                  <span className="text-[#D4AF37]/75 uppercase tracking-[0.2em] text-[10px] mr-2">{t('reservation_date')}</span>
                  {formatLongDate(form.date, localeByLang[lang])}
                </div>
              )}

              {errorKey && (
                <div className="mt-6 rounded-2xl border border-red-400/18 bg-red-500/7 px-4 py-4 text-sm text-red-100/90 font-light flex items-start gap-3">
                  <AlertTriangle size={18} className="text-red-300/85 mt-0.5 flex-shrink-0" />
                  <span>{t(errorKey)}</span>
                </div>
              )}

              {showSuccess && (
                <div className="mt-6 rounded-2xl border border-emerald-400/18 bg-emerald-500/7 px-4 py-4 text-sm text-emerald-100/90 font-light flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-300/85 mt-0.5 flex-shrink-0" />
                  <span>{t('reservation_success')}</span>
                </div>
              )}

              <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <p className="text-xs text-white/38 font-light max-w-xl leading-relaxed">{t('reservation_hint')}</p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] text-black px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] hover:bg-[#e5bf4a] transition-colors duration-300 shadow-[0_12px_30px_rgba(212,175,55,0.18)]"
                >
                  {t('reservation_submit')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
