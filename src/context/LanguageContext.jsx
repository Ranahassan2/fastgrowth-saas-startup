import React, { createContext, useState, useContext, useEffect } from 'react';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    const keys = key.split('.');
    let value = lang === 'ar' ? ar : en;
    for (let k of keys) {
      if (value[k] === undefined) {
        return key; // fallback to key
      }
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
