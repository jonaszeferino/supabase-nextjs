import React from "react";

const languageDictionary = {
  aar: { pt: "Abkhaziano" },
  ar: { pt: "Árabe" },
  as: { pt: "Assamês" },
  az: { pt: "Azerbaijano" },
  bg: { pt: "Bulgária" },
  cn: { pt: "Chinês Tradicional" },
  hr: { pt: "Croata" },
  cs: { pt: "Tcheco" },
  da: { pt: "Dinamarquês" },
  de: { pt: "Alemão" },
  el: { pt: "Grego Moderno" },
  en: { pt: "Inglês" },
  sl: { pt: "Esloveno" },
  sk: { pt: "Eslovaco" },
  et: { pt: "Estoniano" },
  es: { pt: "Espanhol" },
  nb: { pt: "Dano-norueguês" },
  fa: { pt: "Persa" },
  fi: { pt: "Filandês" },
  fr: { pt: "Francês" },
  hi: { pt: "Hindi" },
  hu: { pt: "Húngaro" },
  id: { pt: "Indonésio" },
  is: { pt: "Islandes" },
  it: { pt: "Italiano" },
  ja: { pt: "Japonês" },
  ko: { pt: "Coreano" },
  kn: { pt: "Canarês" },
  lv: { pt: "Letão" },
  ml: { pt: "Malaiala" },
  mk: { pt: "Macedônio" },
  ms: { pt: "Malaio" },
  ne: { pt: "Nepalês" },
  nl: { pt: "Holandês" },
  no: { pt: "Norueguês" },
  pl: { pt: "Polonês" },
  pt: { pt: "Português" },
  ro: { pt: "Romeno" },
  ru: { pt: "Russo" },
  sh: { pt: "Servo-Croata" },
  so: { pt: "Somali" },
  sv: { pt: "Suéco" },
  sr: { pt: "Sérvio" },
  ur: { pt: "Urdo" },
  ta: { pt: "Tâmil" },
  th: { pt: "Tailandês" },
  te: { pt: "Telugu" },
  tl: { pt: "Tagalo" },
  tr: { pt: "Turco" },
  vi: { pt: "Vietnamita" },
  yi: { pt: "Iídiche" },
  zh: { pt: "Chinês" },
};

const TranslationComponent = ({ text, language }) => {
  const translate = (text) => {
    return languageDictionary[text]?.[language] || text;
  };
  return translate(text);
};

export default TranslationComponent;
