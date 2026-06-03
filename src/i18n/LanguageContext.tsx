import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Lang, translations } from './translations';

const htmlLangMap: Record<Lang, string> = {
  fr: 'fr',
  ko: 'ko',
  en: 'en',
  zh: 'zh',
};

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'fr',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('fr');

  // Met à jour l'attribut lang de <html> à chaque changement de langue
  // Cela force les éléments natifs (input date, etc.) à suivre la langue choisie
  useEffect(() => {
    document.documentElement.lang = htmlLangMap[lang];
  }, [lang]);

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['fr']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
