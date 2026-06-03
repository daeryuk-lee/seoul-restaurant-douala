import { useEffect, useState } from 'react';
import { CalendarDays, Globe, Home, MapPin, Utensils } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { langLabels, type Lang } from '../i18n/translations';

const LogoMark = ({ compact = false }: { compact?: boolean }) => (
  <span
    className={`inline-flex items-center justify-center overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-[#050505]/95 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] ${
      compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
    }`}
  >
    <img
      src="/images/seoul-logo.png"
      alt="Seoul"
      className={`w-auto rounded-xl object-contain ${compact ? 'h-7' : 'h-9'}`}
    />
  </span>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const close = () => setIsLangOpen(false);
    if (isLangOpen) {
      setTimeout(() => document.addEventListener('click', close), 0);
      return () => document.removeEventListener('click', close);
    }
  }, [isLangOpen]);

  const leftLinks = [
    { name: t('nav_home'), href: '#home' },
    { name: t('nav_specialties'), href: '#specialties' },
    { name: t('nav_menu'), href: '#menu' },
  ];

  const rightLinks = [
    { name: t('nav_reservation'), href: '#reservation' },
    { name: t('nav_contact'), href: '#contact' },
  ];

  const mobileLinks = [
    { name: t('nav_home'), href: '#home', icon: Home },
    { name: t('nav_menu'), href: '#menu', icon: Utensils },
    { name: t('nav_reservation'), href: '#reservation', icon: CalendarDays },
    { name: t('nav_contact'), href: '#contact', icon: MapPin },
  ];

  const LanguageMenu = ({ align = 'right' }: { align?: 'left' | 'right' }) => (
    <div className="relative">
      <button
        onClick={(event) => {
          event.stopPropagation();
          setIsLangOpen((open) => !open);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050505]/90 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
      >
        <Globe size={13} />
        {langLabels[lang]}
      </button>

      {isLangOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 min-w-[128px] overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#070707] shadow-2xl`}
        >
          {(Object.keys(langLabels) as Lang[]).map((item) => (
            <button
              key={item}
              onClick={() => {
                setLang(item);
                setIsLangOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-[11px] uppercase tracking-[0.18em] transition-colors ${
                lang === item
                  ? 'bg-[#D4AF37]/12 text-[#D4AF37]'
                  : 'text-white/55 hover:bg-white/[0.04] hover:text-white/85'
              }`}
            >
              {langLabels[item]}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-[#050505]/96 border-b border-[#D4AF37]/14' : 'bg-gradient-to-b from-black/82 via-black/35 to-transparent'
        }`}
      >
        <div className="hidden lg:block max-w-7xl mx-auto px-8 xl:px-10">
          <div className={`grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
            <nav className="flex items-center justify-start gap-9">
              {leftLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group relative text-[11px] uppercase tracking-[0.24em] text-white/58 transition-colors hover:text-[#D4AF37]"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <a href="#home" className="mx-8 block" aria-label="Seoul home">
              <LogoMark compact={isScrolled} />
            </a>

            <nav className="flex items-center justify-end gap-6 xl:gap-8">
              {rightLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={
                    link.href === '#reservation'
                      ? 'rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black'
                      : 'group relative text-[11px] uppercase tracking-[0.24em] text-white/58 transition-colors hover:text-[#D4AF37]'
                  }
                >
                  {link.name}
                  {link.href !== '#reservation' && (
                    <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                  )}
                </a>
              ))}
              <LanguageMenu />
            </nav>
          </div>
        </div>

        <div className="lg:hidden px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <a 
              href="#home" 
              aria-label="Seoul home"
              className={`transition-all duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <LogoMark compact />
            </a>
            <div className="flex items-center gap-2">
              <LanguageMenu />
              <a
                href="#reservation"
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#D4AF37]"
              >
                <CalendarDays size={13} />
                {t('nav_reservation')}
              </a>
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-50 lg:hidden rounded-3xl border border-[#D4AF37]/18 bg-[#060606] px-2 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
        <div className="grid grid-cols-4 gap-1">
          {mobileLinks.map(({ name, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-white/48 transition-colors hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
            >
              <Icon size={17} />
              <span className="text-[9px] uppercase tracking-[0.12em] leading-none">{name}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;