import { Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';

// ── Date d'expiration : 3 mois après activation de la rubrique ──
// Modifier cette date si vous souhaitez prolonger ou raccourcir la période d'affichage.
const EXPIRY_DATE = new Date('2026-10-20T23:59:59');

type NewDish = {
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  price: string;
  spicy?: number;
};

const newDishes: NewDish[] = [
  {
    name: { fr: 'Maki Avocat', ko: '아보카도 마끼', en: 'Avocado Maki', zh: '牛油果卷' },
    desc: { fr: '8 pcs — Maki frais à l’avocat', ko: '아보카도 마끼 8개', en: '8 pcs — Fresh avocado maki', zh: '8个 — 新鲜牛油果卷' },
    price: '5 000 Fcfa',
  },
  {
    name: { fr: 'Maki Saumon', ko: '연어 마끼', en: 'Salmon Maki', zh: '三文鱼卷' },
    desc: { fr: '8 pcs — Maki au saumon frais', ko: '연어 마끼 8개', en: '8 pcs — Fresh salmon maki', zh: '8个 — 新鲜三文鱼卷' },
    price: '8 000 Fcfa',
  },
  {
    name: { fr: 'Maki Avocat-Saumon', ko: '아보카도연어 마끼', en: 'Avocado-Salmon Maki', zh: '牛油果三文鱼卷' },
    desc: { fr: '8 pcs — Maki mixte avocat et saumon', ko: '아보카도연어 마끼 8개', en: '8 pcs — Mixed avocado & salmon maki', zh: '8个 — 牛油果三文鱼混合卷' },
    price: '8 500 Fcfa',
  },
  {
    name: { fr: 'Galbitang', ko: '왕갈비탕', en: 'Galbitang', zh: '牛排骨汤' },
    desc: { fr: 'Bouillon de côte de bœuf', ko: '소갈비 국물', en: 'Beef short rib broth', zh: '牛排骨汤' },
    price: '11 500 Fcfa',
  },
  {
    name: { fr: 'Samgyetang', ko: '삼계탕', en: 'Samgyetang', zh: '参鸡汤' },
    desc: { fr: 'Bouillon de poulet entier au ginseng', ko: '삼계탕 (통닭)', en: 'Whole chicken ginseng broth', zh: '整鸡参汤' },
    price: '15 000 Fcfa',
  },
  {
    name: { fr: 'Crevettes à la crème', ko: '크림새우', en: 'Cream Shrimp', zh: '奶油虾' },
    desc: { fr: 'Crevettes frites à la sauce crème', ko: '크림소스 새우튀김', en: 'Fried shrimp with cream sauce', zh: '奶油炸虾' },
    price: '9 500 Fcfa',
  },
  {
    name: { fr: 'Kanpung Wings', ko: '깐풍윙', en: 'Kanpung Wings', zh: '鸡翅干烹鸡' },
    desc: { fr: 'Ailes de poulet frites, sauce piquante et sucrée (6 pcs)', ko: '매콤달콤 닭날개 (6개)', en: 'Fried wings, sweet & spicy sauce (6 pcs)', zh: '甜辣酱炸鸡翅 (6个)' },
    price: '7 500 Fcfa',
    spicy: 1,
  },
];

const NewDishes = () => {
  const { lang, t } = useLanguage();

  if (new Date() > EXPIRY_DATE) return null;

  return (
    <section className="py-24 bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/8 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-6">
            <Sparkles size={13} />
            {t('new_dishes_badge')}
          </div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 mb-5">{t('new_dishes_kicker')}</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-white/90 mb-4">{t('new_dishes_title')}</h2>
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mb-6" />
          <p className="text-gray-400 font-light max-w-xl mx-auto text-sm leading-relaxed">{t('new_dishes_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newDishes.map((dish, index) => {
            const name = dish.name[lang] || dish.name.fr;
            const desc = dish.desc[lang] || dish.desc.fr;
            const secondaryParts: string[] = [];
            if (lang !== 'ko' && dish.name.ko) secondaryParts.push(dish.name.ko);
            if (lang !== 'zh' && dish.name.zh) secondaryParts.push(dish.name.zh);
            const secondary = secondaryParts.join('  ');

            return (
              <div
                key={index}
                className="group rounded-2xl border border-[#D4AF37]/14 bg-gradient-to-b from-[#121212] to-[#0c0c0c] p-6 transition-all duration-500 hover:border-[#D4AF37]/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/60 border border-[#D4AF37]/20 rounded-full px-2.5 py-1">
                    {t('new_dishes_badge')}
                  </span>
                  {dish.spicy && (
                    <div className="flex text-red-500/70">
                      {[...Array(dish.spicy)].map((_, i) => (
                        <Flame key={i} size={12} />
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-lg text-white/92 mb-1 group-hover:text-[#D4AF37] transition-colors duration-300">
                  {name}
                </h3>

                {secondary && (
                  <p className="text-[10px] text-[#D4AF37]/40 tracking-[0.18em] mb-3">{secondary}</p>
                )}

                <p className="text-xs text-gray-400 font-light leading-relaxed mb-5">{desc}</p>

                <div className="pt-4 border-t border-white/5">
                  <span className="font-serif text-[#D4AF37] text-base tracking-wide">{dish.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewDishes;
