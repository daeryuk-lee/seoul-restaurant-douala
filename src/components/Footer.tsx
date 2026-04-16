import { MapPin, Phone, Clock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-[#050505] text-white pt-24 pb-12 border-t border-[#D4AF37]/10 relative overflow-hidden">
      {/* Ligne dorée subtile */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section titre */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 mb-6">{t('footer_find_us')}</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-white/90 mb-3">{t('footer_contact')}</h2>
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src="/images/seoul-logo.png" 
              alt="Seoul" 
              className="h-14 w-auto mb-6 object-contain"
            />
            <p className="text-gray-500 mb-8 text-center md:text-left leading-relaxed font-light text-sm">
              {t('footer_desc')}
            </p>
            {/* Réseaux sociaux */}
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/K.Restaurant.Seoul/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 text-gray-500 hover:text-[#D4AF37]"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/seoulkorea237/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 text-gray-500 hover:text-[#D4AF37]"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://www.tripadvisor.fr/Restaurant_Review-g297392-d25460141-Reviews-Restaurant_SEOUL-Douala_Littoral_Region.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 text-gray-500 hover:text-[#D4AF37]"
                aria-label="TripAdvisor"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5.3c2.16 0 4.18.63 5.88 1.72l3.35-.38-.9 1.87c.56.73 1.01 1.56 1.33 2.46H24l-1.74 1.75a5.43 5.43 0 0 1-5.34 6.42 5.45 5.45 0 0 1-4.92-3.12 5.45 5.45 0 0 1-4.92 3.12 5.43 5.43 0 0 1-5.34-6.42L0 10.97h2.34c.32-.9.77-1.73 1.33-2.46l-.9-1.87 3.35.38A10.62 10.62 0 0 1 12 5.3Zm-4.92 4.4a3.45 3.45 0 1 0 0 6.9 3.45 3.45 0 0 0 0-6.9Zm9.84 0a3.45 3.45 0 1 0 0 6.9 3.45 3.45 0 0 0 0-6.9Zm-9.84 1.6a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7Zm9.84 0a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7ZM12 7.1c-1.4 0-2.73.28-3.94.79.28.36.52.76.72 1.18a5.4 5.4 0 0 1 6.44 0c.2-.42.44-.82.72-1.18A10.05 10.05 0 0 0 12 7.1Z"/></svg>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-light mb-8 uppercase tracking-[0.3em] text-white/40">
              {t('footer_info')}
            </h3>
            <ul className="space-y-6 text-gray-400">
              <li className="flex items-start">
                <MapPin size={18} className="text-[#D4AF37]/60 mr-4 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed text-sm font-light">
                  A côté de LGM<br />
                  Rue Chococho<br />
                  Douala, Cameroun
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-[#D4AF37]/60 mr-4 flex-shrink-0" />
                <a href="tel:+237699211300" className="text-white/80 hover:text-[#D4AF37] transition-colors duration-300 font-light">
                  +237 6 99 21 13 00
                </a>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="text-[#D4AF37]/60 mr-4 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm font-light">
                  <p className="text-white/50 uppercase tracking-wider text-xs mb-3">{t('footer_hours_title')}</p>
                  <div className="space-y-1.5">
                    <p><span className="text-white/40">{t('footer_monday')}:</span> <span className="text-white/70">12h00-15h00, 18h00-22h30</span></p>
                    <p className="text-red-400/70">{t('footer_tuesday')}: {t('footer_closed')}</p>
                    <p><span className="text-white/40">{t('footer_wed_sun')}:</span> <span className="text-white/70">12h00-15h00, 18h00-22h30</span></p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Map - Coordonnées corrigées */}
          <div className="w-full h-72 bg-gray-900 rounded-lg overflow-hidden relative border border-white/[0.06]">
            <iframe
              src="https://maps.google.com/maps?q=4.027474387401219,9.69693699325819&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation Seoul Restaurant"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border border-[#D4AF37]/10 rounded-lg"></div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.05] pt-8 text-center">
          <p className="text-[#D4AF37]/30 text-[11px] font-light tracking-[0.3em] uppercase mb-3">
            {t('footer_tagline')}
          </p>
          <p className="text-[11px] text-gray-700 font-light">
            &copy; {new Date().getFullYear()} Seoul Restaurant Coréen — {t('footer_rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
