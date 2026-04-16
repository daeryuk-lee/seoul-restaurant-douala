import { useEffect, useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { langLabels, type Lang } from '../i18n/translations';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 36);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = () => setIsLangOpen(false);
    if (isLangOpen) {
      setTimeout(() => document.addEventListener('click', handleClick), 0);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isLangOpen]);

  const navLinks = [
    { name: t('nav_home'), href: '#home' },
    { name: t('nav_specialties'), href: '#specialties' },
    { name: t('nav_menu'), href: '#menu' },
    { name: t('nav_reservation'), href: '#reservation' },
    { name: t('nav_contact'), href: '#contact' },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
      <div
        className={`max-w-7xl mx-auto transition-all duration-500 ${
          isScrolled
            ? 'bg-black/88 backdrop-blur-xl border border-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]'
            : 'bg-black/28 backdrop-blur-md border border-white/6'
        } rounded-full`}
      >
        <div className="absolute inset-x-24 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/22 to-transparent rounded-full pointer-events-none" />

        <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'px-4 sm:px-5 py-3' : 'px-4 sm:px-6 py-3.5 sm:py-4'}`}>
          <a href="#home" className="flex items-center gap-3 min-w-0">
            <img
              src="/images/seoul-logo.png"
              alt="Seoul"
              className={`w-auto transition-all duration-500 ${isScrolled ? 'h-8 sm:h-9' : 'h-9 sm:h-11'}`}
            />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-[#D4AF37] transition-colors duration-300 uppercase tracking-[0.2em] text-[11px] font-light"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangOpen(!isLangOpen);
                }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-white/55 hover:text-[#D4AF37] hover:border-[#D4AF37]/25 transition-colors duration-300 text-[11px] font-light"
              >
                <Globe size={13} />
                <span className="tracking-[0.2em] uppercase">{langLabels[lang]}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 min-w-[128px] overflow-hidden rounded-2xl border border-white/10 bg-black/96 shadow-2xl">
                  {(Object.keys(langLabels) as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                        lang === l
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                          : 'text-white/55 hover:bg-white/5 hover:text-white/85'
                      }`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#reservation"
              className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
            >
              {t('nav_reservation')}
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2.5">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangOpen(!isLangOpen);
                }}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-white/50 text-[10px] tracking-[0.18em] uppercase"
              >
                <Globe size={12} />
                <span>{langLabels[lang]}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 min-w-[106px] overflow-hidden rounded-2xl border border-white/10 bg-black/96 shadow-2xl z-50">
                  {(Object.keys(langLabels) as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2.5 text-[11px] transition-colors ${
                        lang === l
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                          : 'text-white/55 hover:bg-white/5 hover:text-white/85'
                      }`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] p-2.5 text-white/70 hover:text-[#D4AF37] transition-colors"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.06] px-5 pb-5 pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-white/70 text-sm font-light uppercase tracking-[0.18em] hover:text-[#D4AF37] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#reservation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-1 inline-flex items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]"
              >
                {t('nav_reservation')}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
