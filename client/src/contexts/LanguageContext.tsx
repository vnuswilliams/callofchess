import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import frCommon from "@/locales/fr/common.json";
import frAuth from "@/locales/fr/auth.json";
import frChess from "@/locales/fr/chess.json";
import frLessons from "@/locales/fr/lessons.json";
import frProfile from "@/locales/fr/profile.json";
import frSettings from "@/locales/fr/settings.json";
import enCommon from "@/locales/en/common.json";
import enAuth from "@/locales/en/auth.json";
import enChess from "@/locales/en/chess.json";
import enLessons from "@/locales/en/lessons.json";
import enProfile from "@/locales/en/profile.json";
import enSettings from "@/locales/en/settings.json";

export type Language = "fr" | "en";
type TranslationTree = Record<string, unknown>;
type TranslationKey = string;

const resources: Record<Language, TranslationTree> = {
  fr: { common: frCommon, auth: frAuth, chess: frChess, lessons: frLessons, profile: frProfile, settings: frSettings },
  en: { common: enCommon, auth: enAuth, chess: enChess, lessons: enLessons, profile: enProfile, settings: enSettings },
};

function resolve(tree: TranslationTree, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as TranslationTree)[segment];
  }, tree);
  return typeof value === "string" ? value : undefined;
}

function translate(language: Language, key: TranslationKey): string {
  return resolve(resources[language], key)
    ?? resolve(resources.en, key)
    ?? (key.startsWith("common.") ? resolve(resources[language], key.slice("common.".length)) : undefined)
    ?? resolve(resources.en, key.slice("common.".length))
    ?? key;
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "fr";
    const stored = window.localStorage.getItem("echequier-language");
    return stored === "en" ? "en" : "fr";
  });

  useEffect(() => {
    window.localStorage.setItem("echequier-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === "fr" ? "en" : "fr"),
    t: (key) => translate(language, key.includes(".") ? key : `common.${key}`),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
