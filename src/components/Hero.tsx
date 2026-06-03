import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[100svh] sm:h-screen flex items-start sm:items-center justify-center overflow-hidden pt-24 sm:pt-0 pb-28 sm:pb-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundPosition: 'center 60%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
      </div>

      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}></div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-8 sm:pt-0 w-full">
        <h1 className="sr-only">Seoul Restaurant, restaurant coréen à Douala</h1>
        {/* Logo intégré dans un écrin noir/or, sans flou */}
        <div className="mb-10 inline-flex flex-col items-center">
          <div className="rounded-[2rem] border border-[#D4AF37]/35 bg-[#050505]/88 px-5 py-4 sm:px-7 sm:py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.45)]">
            <img
              src="/images/seoul-logo.png"
              alt="Seoul Restaurant"
              className="h-24 sm:h-32 md:h-40 w-auto mx-auto rounded-2xl object-contain"
            />
          </div>
          <div className="mt-4 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />
        </div>

        {/* Ligne dorée subtile */}
        <div className="w-12 h-px bg-[#D4AF37]/45 mx-auto mb-10"></div>

        {/* Sous-titre luxueux */}
        <div className="mb-14">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60"></div>
            <p className="text-lg sm:text-xl font-light text-white/80 tracking-[0.4em] uppercase">
              {t('hero_subtitle')}
            </p>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60"></div>
          </div>
        </div>

        {/* Spécialités avec séparateurs élégants */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 mb-16">
          <span className="text-white/60 text-xs uppercase tracking-[0.25em] hover:text-[#D4AF37] transition-colors duration-500 cursor-default font-light">
            {t('hero_sushi')}
          </span>
          <span className="hidden sm:block w-1.5 h-1.5 bg-[#D4AF37]/40 rounded-full"></span>
          <span className="text-white/60 text-xs uppercase tracking-[0.25em] hover:text-[#D4AF37] transition-colors duration-500 cursor-default font-light">
            {t('hero_bbq')}
          </span>
          <span className="hidden sm:block w-1.5 h-1.5 bg-[#D4AF37]/40 rounded-full"></span>
          <span className="text-white/60 text-xs uppercase tracking-[0.25em] hover:text-[#D4AF37] transition-colors duration-500 cursor-default font-light">
            {t('hero_traditional')}
          </span>
        </div>

        {/* Boutons premium */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-md sm:max-w-none mx-auto">
          <a
            href="#menu"
            className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 bg-transparent border border-[#D4AF37]/60 text-[#D4AF37] font-light uppercase tracking-[0.22em] sm:tracking-[0.3em] text-xs sm:text-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-700 overflow-hidden text-center"
          >
            <span className="relative z-10">{t('hero_cta_menu')}</span>
          </a>
          <a
            href="#contact"
            className="group w-full sm:w-auto px-8 sm:px-12 py-4 bg-transparent border border-white/20 text-white/70 font-light uppercase tracking-[0.22em] sm:tracking-[0.3em] text-xs sm:text-sm hover:border-white/40 hover:text-white transition-all duration-700 text-center"
          >
            {t('hero_cta_find')}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <a href="#specialties" className="flex flex-col items-center gap-3 group">
          <span className="text-white/30 text-[10px] uppercase tracking-[0.4em] group-hover:text-[#D4AF37]/60 transition-colors duration-500">
            {t('hero_scroll')}
          </span>
          <ChevronDown size={20} className="text-white/30 group-hover:text-[#D4AF37]/60 transition-colors animate-bounce" />
        </a>
      </div>

      {/* Coins dorés minimaux */}
      <div className="absolute top-10 left-10 w-12 h-12 border-l border-t border-[#D4AF37]/15"></div>
      <div className="absolute top-10 right-10 w-12 h-12 border-r border-t border-[#D4AF37]/15"></div>
      <div className="absolute bottom-10 left-10 w-12 h-12 border-l border-b border-[#D4AF37]/15"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 border-r border-b border-[#D4AF37]/15"></div>
    </section>
  );
};

export default Hero;
