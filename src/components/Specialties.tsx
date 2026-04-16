import { useLanguage } from '../i18n/LanguageContext';

const Specialties = () => {
  const { t } = useLanguage();

  const specialtiesData = [
    {
      titleKey: 'spec_bbq_title',
      descKey: 'spec_bbq_desc',
      emoji: '🔥',
      image: '/images/food/bbq.jpg',
    },
    {
      titleKey: 'spec_sushi_title',
      descKey: 'spec_sushi_desc',
      emoji: '🍣',
      image: '/images/food/sushi.jpg',
    },
    {
      titleKey: 'spec_trad_title',
      descKey: 'spec_trad_desc',
      emoji: '🍲',
      image: '/images/food/bibimbap.jpg',
    },
  ];

  return (
    <section id="specialties" className="py-28 bg-[#080808] relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 mb-6">Seoul Restaurant</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-white/90 mb-4">{t('spec_title')}</h2>
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mb-8"></div>
          <p className="mt-6 text-gray-500 max-w-xl mx-auto text-sm font-light leading-relaxed">
            {t('spec_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialtiesData.map((specialty, index) => (
            <div
              key={index}
              className="group relative flex flex-col bg-[#111] overflow-hidden border border-white/[0.04] hover:border-[#D4AF37]/15 transition-all duration-700"
            >
              <div className="h-72 relative overflow-hidden">
                <img
                  src={specialty.image}
                  alt={t(specialty.titleKey)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 text-2xl">{specialty.emoji}</div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-serif text-white/90 mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">
                  {t(specialty.titleKey)}
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed flex-grow">
                  {t(specialty.descKey)}
                </p>
                <div className="mt-6">
                  <a href="#menu" className="text-[#D4AF37]/50 text-[11px] uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-colors duration-300 font-light">
                    {t('hero_cta_menu')} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialties;
