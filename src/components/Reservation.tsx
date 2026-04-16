import { useMemo, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Phone,
  Sparkles,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
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

type TableType = 'normal' | 'bbq';

type ReservationForm = {
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  tableType: TableType;
  note: string;
};

const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const Reservation = () => {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState<ReservationForm>({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    tableType: 'normal',
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

  const updateField = <K extends keyof ReservationForm>(field: K, value: ReservationForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorKey(null);
    setShowSuccess(false);
  };

  const handleDateChange = (value: string) => {
    // Si le jour sélectionné est un mardi, on réinitialise la date
    const day = value ? new Date(`${value}T12:00:00`).getDay() : -1;
    if (day === 2) {
      setErrorKey('reservation_error_closed_day');
      setForm((prev) => ({ ...prev, date: '', time: '' }));
      setShowSuccess(false);
      return;
    }

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
    const tableTypeLabel =
      form.tableType === 'bbq'
        ? t('reservation_table_bbq')
        : t('reservation_table_normal');

    const message = [
      t('reservation_whatsapp_header'),
      '',
      `👤 ${t('reservation_name')}: ${form.name}`,
      `📞 ${t('reservation_phone')}: ${form.phone}`,
      `👥 ${t('reservation_guests')}: ${form.guests}`,
      `📅 ${t('reservation_date')}: ${formattedDate}`,
      `🕐 ${t('reservation_time')}: ${form.time}`,
      selectedServiceKey ? `🍽️ ${t('reservation_selected_service')}: ${t(selectedServiceKey)}` : null,
      `🔥 ${t('reservation_table_type')}: ${tableTypeLabel}`,
      form.note ? `💬 ${t('reservation_note')}: ${form.note}` : null,
      '',
      t('reservation_whatsapp_footer'),
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setErrorKey(null);
    setShowSuccess(true);
  };

  // Indicateur de disponibilité des créneaux restants
  const slotsCount = availableSlots.length;

  return (
    <section id="reservation" className="py-28 bg-[#090909] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.14),_transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 mb-5">
            {t('reservation_kicker')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-white/90 mb-4">
            {t('reservation_title')}
          </h2>
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mb-6" />
          <p className="text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            {t('reservation_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.15fr] gap-8 items-start">

          {/* ── Panneau informatif gauche ── */}
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

              {/* Services */}
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
                    <p className="text-[10px] text-white/35 mt-1">
                      {t('reservation_last_slot_hint')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Horaires */}
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5 mb-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/45 mb-4">
                  {t('reservation_panel_hours')}
                </p>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex justify-between gap-3 text-white/72">
                    <span>{t('footer_monday')}</span>
                    <span>12:00–15:00 · 18:00–22:30</span>
                  </div>
                  <div className="flex justify-between gap-3 text-red-300/75">
                    <span className="flex items-center gap-1.5">
                      {t('footer_tuesday')}
                      <span className="text-[9px] border border-red-400/30 rounded px-1.5 py-0.5 uppercase tracking-wider">
                        {t('footer_closed')}
                      </span>
                    </span>
                    <span>—</span>
                  </div>
                  <div className="flex justify-between gap-3 text-white/72">
                    <span>{t('footer_wed_sun')}</span>
                    <span>12:00–15:00 · 18:00–22:30</span>
                  </div>
                </div>
              </div>

              {/* Appel */}
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

              {/* Service sélectionné */}
              {selectedServiceKey && (
                <div className="rounded-2xl border border-[#D4AF37]/18 bg-[#D4AF37]/8 px-4 py-4 mb-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]/70 mb-2">
                    {t('reservation_selected_service')}
                  </p>
                  <p className="text-white/90 font-light">{t(selectedServiceKey)}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Formulaire droit ── */}
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[28px] border border-[#D4AF37]/16 bg-[linear-gradient(180deg,rgba(19,19,19,0.97),rgba(10,10,10,0.98))] p-6 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.38),_transparent_30%)]" />
            <div className="relative">

              {/* Titre formulaire */}
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/55 mb-3">
                    WhatsApp
                  </p>
                  <h3 className="text-2xl font-serif text-white/92">
                    {t('reservation_form_title')}
                  </h3>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
                  <CalendarDays size={14} className="text-[#D4AF37]/65" />
                  {t('reservation_kicker')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Nom */}
                <label className="space-y-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">
                    {t('reservation_name')}
                  </span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full rounded-2xl bg-black/25 border border-white/10 px-4 py-3.5 text-white/90 placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                  />
                </label>

                {/* Téléphone */}
                <label className="space-y-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">
                    {t('reservation_phone')}
                  </span>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60" />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+237 6 XX XX XX XX"
                      className="w-full rounded-2xl bg-black/25 border border-white/10 pl-11 pr-4 py-3.5 text-white/90 placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                    />
                  </div>
                </label>

                {/* Nombre de personnes */}
                <label className="space-y-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">
                    {t('reservation_guests')}
                  </span>
                  <div className="relative">
                    <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60" />
                    <select
                      value={form.guests}
                      onChange={(e) => updateField('guests', e.target.value)}
                      className="w-full appearance-none rounded-2xl bg-black/25 border border-white/10 pl-11 pr-4 py-3.5 text-white/90 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                    >
                      {guestOptions.map((option) => (
                        <option key={option} value={option} className="bg-[#121212] text-white">
                          {option} {t('reservation_persons')}
                        </option>
                      ))}
                      <option value="11+" className="bg-[#121212] text-white">11+</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-white/35 font-light">
                    {t('reservation_guest_hint')}
                  </p>
                </label>

                {/* Date — les mardis sont bloqués côté JS via handleDateChange */}
                <label className="space-y-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">
                    {t('reservation_date')}
                  </span>
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
                  <p className="text-[11px] text-white/35 font-light">
                    {t('reservation_tuesday_hint')}
                  </p>
                </label>

                {/* Type de table — pleine largeur */}
                <div className="md:col-span-2 space-y-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58 block">
                    {t('reservation_table_type')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Table normale */}
                    <button
                      type="button"
                      onClick={() => updateField('tableType', 'normal')}
                      className={`relative flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                        form.tableType === 'normal'
                          ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10'
                          : 'border-white/8 bg-black/20 hover:border-white/16'
                      }`}
                    >
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        form.tableType === 'normal' ? 'bg-[#D4AF37]/20' : 'bg-white/5'
                      }`}>
                        <UtensilsCrossed size={18} className={form.tableType === 'normal' ? 'text-[#D4AF37]' : 'text-white/40'} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${form.tableType === 'normal' ? 'text-[#D4AF37]' : 'text-white/70'}`}>
                          {t('reservation_table_normal')}
                        </p>
                        <p className="text-[11px] text-white/35 font-light mt-0.5">
                          {t('reservation_table_normal_desc')}
                        </p>
                      </div>
                      {form.tableType === 'normal' && (
                        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#D4AF37]" />
                      )}
                    </button>

                    {/* Table Barbecue */}
                    <button
                      type="button"
                      onClick={() => updateField('tableType', 'bbq')}
                      className={`relative flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                        form.tableType === 'bbq'
                          ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10'
                          : 'border-white/8 bg-black/20 hover:border-white/16'
                      }`}
                    >
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        form.tableType === 'bbq' ? 'bg-[#D4AF37]/20' : 'bg-white/5'
                      }`}>
                        <Flame size={18} className={form.tableType === 'bbq' ? 'text-[#D4AF37]' : 'text-white/40'} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${form.tableType === 'bbq' ? 'text-[#D4AF37]' : 'text-white/70'}`}>
                          {t('reservation_table_bbq')}
                        </p>
                        <p className="text-[11px] text-white/35 font-light mt-0.5">
                          {t('reservation_table_bbq_desc')}
                        </p>
                      </div>
                      {form.tableType === 'bbq' && (
                        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#D4AF37]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Heure — pleine largeur */}
                <div className="md:col-span-2 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/58">
                      {t('reservation_time')}
                    </span>
                    {form.date && !isTuesday && slotsCount > 0 && (
                      <span className="text-[10px] text-[#D4AF37]/60 uppercase tracking-wider">
                        {slotsCount} {t('reservation_slots_available')}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <Clock3 size={16} className="absolute left-4 top-4 text-[#D4AF37]/60" />
                    <select
                      required
                      value={form.time}
                      onChange={(e) => updateField('time', e.target.value)}
                      disabled={!form.date || isTuesday || availableSlots.length === 0}
                      className="w-full appearance-none rounded-2xl bg-black/25 border border-white/10 pl-11 pr-4 py-3.5 text-white/90 focus:border-[#D4AF37]/50 focus:outline-none transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                    >
                      <option value="" className="bg-[#121212] text-white">
                        {!form.date
                          ? t('reservation_select_date_first')
                          : isTuesday
                          ? t('reservation_error_closed_day')
                          : t('reservation_time_placeholder')}
                      </option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot} className="bg-[#121212] text-white">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Créneaux rapides */}
                  {form.date && !isTuesday && availableSlots.length > 0 && (
                    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]/65 mb-3">
                        {t('reservation_available_slots')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => updateField('time', slot)}
                            className={`rounded-full px-3 py-1.5 text-xs transition-colors border ${
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

                  {/* Aucun créneau dispo aujourd'hui */}
                  {form.date && !isTuesday && availableSlots.length === 0 && (
                    <p className="text-xs text-amber-300/70 font-light mt-1">
                      {t('reservation_no_slots_today')}
                    </p>
                  )}
                </div>

                {/* Note */}
                <label className="space-y-2.5 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/58">
                    {t('reservation_note')}
                  </span>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={(e) => updateField('note', e.target.value)}
                    placeholder={t('reservation_note_placeholder')}
                    className="w-full rounded-2xl bg-black/25 border border-white/10 px-4 py-3.5 text-white/90 placeholder:text-white/20 resize-none focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                  />
                </label>
              </div>

              {/* Récapitulatif date */}
              {form.date && !isTuesday && (
                <div className="mt-6 rounded-2xl border border-[#D4AF37]/14 bg-[#D4AF37]/6 px-4 py-4 text-sm text-white/72 font-light">
                  <span className="text-[#D4AF37]/75 uppercase tracking-[0.2em] text-[10px] mr-2">
                    {t('reservation_date')}
                  </span>
                  {formatLongDate(form.date, localeByLang[lang])}
                </div>
              )}

              {/* ── Erreur (affiché UNIQUEMENT dans le formulaire) ── */}
              {errorKey && (
                <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/8 px-5 py-4 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-red-300/85 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-100/90 font-light">{t(errorKey)}</p>
                    {errorKey === 'reservation_error_closed_day' && nextOpenLabel && (
                      <p className="text-xs text-red-200/55 uppercase tracking-wider mt-1">
                        {t('reservation_next_open')}: {nextOpenLabel}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Succès ── */}
              {showSuccess && (
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/8 px-5 py-4 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-300/85 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-emerald-100/90 font-light">{t('reservation_success')}</p>
                </div>
              )}

              {/* Bouton */}
              <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <p className="text-xs text-white/38 font-light max-w-xl leading-relaxed">
                  {t('reservation_hint')}
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] text-black px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] hover:bg-[#e5bf4a] transition-colors duration-300 shadow-[0_12px_30px_rgba(212,175,55,0.18)] font-medium"
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
