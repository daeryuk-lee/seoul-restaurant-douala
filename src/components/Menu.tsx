import { useState } from 'react';
import { Leaf, Flame } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { menuData, categories, type MenuItem } from '../data/menuData';

const categoryImages: Record<string, string> = {
  barbecue: '/images/food/bbq.jpg',
  specialite: '/images/food/sushi.jpg',
  entree: '/images/food/kimbap.jpg',
  grillade_saute: '/images/food/grillade.jpg',
  friture: '/images/food/fried-chicken.jpg',
  riz_ragout: '/images/food/bibimbap.jpg',
  pate_nouilles: '/images/food/noodles.jpg',
  supplements: '/images/food/supplements.jpg',
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState('barbecue');
  const { lang, t } = useLanguage();
  const items = menuData[activeTab] || [];
  const activeCategory = categories.find((c) => c.id === activeTab);

  const SpicyIcons = ({ level }: { level: number }) => (
    <div className="flex text-red-500/80 ml-1" title={`Spicy level ${level}`}>
      {[...Array(level)].map((_, i) => (
        <Flame key={i} size={12} />
      ))}
    </div>
  );

  const renderMenuItem = (item: MenuItem, index: number, total: number) => {
    const name = item.name[lang] || item.name.fr;
    const desc = item.desc ? (item.desc[lang] || item.desc.fr) : '';
    const secondaryParts: string[] = [];
    if (lang !== 'ko' && item.name.ko) secondaryParts.push(item.name.ko);
    if (lang !== 'zh' && item.name.zh) secondaryParts.push(item.name.zh);
    const secondaryLine = secondaryParts.join('　');
    const isLastItem = index === total - 1;

    return (
      <div key={`${activeTab}-${index}`} className="group py-5 sm:py-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2 flex-wrap">
              <h4 className="font-serif text-[17px] leading-snug text-white/92 tracking-[0.01em] group-hover:text-white transition-colors">
                {name}
              </h4>
              {item.veg && (
                <span className="mt-0.5" title="Végétarien">
                  <Leaf size={13} className="text-emerald-500/70" />
                </span>
              )}
              {item.spicy && <SpicyIcons level={item.spicy} />}
            </div>

            {secondaryLine && (
              <p className="text-[10px] uppercase text-[#D4AF37]/45 mt-1 font-light tracking-[0.2em]">
                {secondaryLine}
              </p>
            )}

            {desc && (
              <p className="text-[13px] text-gray-400 mt-2 font-light leading-relaxed max-w-[54ch]">
                {desc}
              </p>
            )}
          </div>

          <div className="hidden sm:block flex-1 border-b border-dotted border-[#D4AF37]/30 mt-4"></div>

          <span className="text-[#D4AF37]/90 font-medium whitespace-nowrap text-[15px] tracking-[0.08em] pt-0.5 font-serif">
            {item.price}
          </span>
        </div>

        {!isLastItem && (
          <div className="mt-5 sm:mt-6 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent relative">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]/55" />
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="menu" className="py-28 bg-[#0d0d0d] text-gray-200 relative">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-18 sm:mb-20">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 mb-6">{t('menu_discover')}</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-white/90 mb-3 tracking-wide">{t('menu_title')}</h2>
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mb-5"></div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500 mb-8">FCFA</p>

          <div className="flex flex-wrap justify-center gap-8 text-xs text-gray-500 font-light">
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-red-500/60" /> {t('menu_spicy_legend')}
            </div>
            <div className="flex items-center gap-2">
              <Leaf size={14} className="text-emerald-500/60" /> {t('menu_veg_legend')}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 text-[11px] font-light uppercase tracking-[0.18em] transition-all duration-500 border ${
                activeTab === cat.id
                  ? 'bg-[#D4AF37]/12 border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.08)]'
                  : 'bg-transparent border-white/[0.08] text-gray-500 hover:border-[#D4AF37]/25 hover:text-[#D4AF37]/70'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        <div className="relative h-52 sm:h-64 mb-10 rounded-xl overflow-hidden border border-[#D4AF37]/20">
          <img
            src={categoryImages[activeTab]}
            alt={t(activeCategory?.labelKey || '')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/84 via-black/45 to-black/84"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#D4AF37]/70 mb-3">Selection</p>
              <h3 className="text-2xl sm:text-4xl font-serif text-white/90 tracking-wide">
                {t(activeCategory?.labelKey || '')}
              </h3>
            </div>
          </div>
          <div className="absolute left-5 right-5 top-5 border-t border-[#D4AF37]/35"></div>
          <div className="absolute left-5 right-5 bottom-5 border-b border-[#D4AF37]/35"></div>
          <div className="absolute inset-0 border border-[#D4AF37]/15 rounded-xl pointer-events-none"></div>
        </div>

        <div className="relative bg-gradient-to-b from-[#121212] to-[#0e0e0e] rounded-2xl p-6 sm:p-10 border border-[#D4AF37]/14 shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="absolute inset-y-8 left-1/2 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent hidden md:block"></div>

          <div className="mb-6 pb-4 border-b border-[#D4AF37]/20">
            <h4 className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]/70 text-center font-light">
              {t(activeCategory?.labelKey || '')}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-14">
            {items.map((item, index) => renderMenuItem(item, index, items.length))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;