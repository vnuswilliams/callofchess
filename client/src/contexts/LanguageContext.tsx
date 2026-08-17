import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "fr" | "en";

const translations = {
  fr: {
    language: "Langue",
    french: "Français",
    english: "English",
    darkMode: "Activer le mode sombre",
    lightMode: "Activer le mode clair",
    dark: "Sombre",
    light: "Clair",
    guidedLesson: "Leçon guidée",
    learnByPlaying: "Apprendre en jouant",
    back: "Retour",
    tryFirstMove: "Essayer le premier coup",
    startLesson: "Commencer la leçon",
    viewMethod: "Voir la méthode",
    lesson: "Leçon",
    progress: "Progression",
    completed: "Terminé",
    whiteToMove: "Les blancs jouent",
    reset: "Recommencer",
    dragHint: "Glissez une pièce ou sélectionnez sa case, puis sa destination.",
    analyze: "Analyser la position",
    analyzing: "Analyse en cours",
    loadingEngine: "Chargement du moteur",
    stop: "Arrêter",
    localAnalysis: "Analyse locale",
    engineView: "Le regard du moteur",
    engineDescription: "Stockfish analyse cette position directement dans votre navigateur, sans envoyer votre partie à un serveur.",
    evaluation: "Évaluation",
    depth: "Profondeur",
    bestMove: "Meilleur coup",
    mainLine: "Ligne principale",
    waitingAnalysis: "Recherche en cours…",
    moveSheet: "Feuille de partie",
    waitingMove: "En attente du premier coup…",
    hint: "Voir l’indice",
    hideHint: "Masquer l’indice",
    tryAgain: "Essayez encore",
    wrongMove: "Ce coup n’est pas l’objectif de cette étape. Utilisez l’indice si vous souhaitez revoir les cases à relier.",
    advice: "Un bon coup d’ouverture aide vos pièces à respirer et contrôle les cases importantes.",
    whyBest: "Pourquoi ce coup est meilleur",
    takeaway: "Le principe à retenir",
    personalized: "Diagnostic personnalisé",
    focus: "Focus",
    engineBest: "Meilleur coup",
    engineFooter: "Moteur Stockfish 17.1 · profondeur pédagogique 12",
    objectiveFilled: "Objectif rempli",
    noteCenter: "Le centre",
    noteDevelopment: "Le développement",
    noteSafety: "La sécurité",
    account: "Compte",
  },
  en: {
    language: "Language",
    french: "Français",
    english: "English",
    darkMode: "Enable dark mode",
    lightMode: "Enable light mode",
    dark: "Dark",
    light: "Light",
    guidedLesson: "Guided lesson",
    learnByPlaying: "Learn by playing",
    back: "Back",
    tryFirstMove: "Try the first move",
    startLesson: "Start the lesson",
    viewMethod: "View the method",
    lesson: "Lesson",
    progress: "Progress",
    completed: "Complete",
    whiteToMove: "White to move",
    reset: "Reset",
    dragHint: "Drag a piece or select its square, then choose its destination.",
    analyze: "Analyze the position",
    analyzing: "Analyzing",
    loadingEngine: "Loading engine",
    stop: "Stop",
    localAnalysis: "Local analysis",
    engineView: "The engine’s view",
    engineDescription: "Stockfish analyzes this position directly in your browser, without sending your game to a server.",
    evaluation: "Evaluation",
    depth: "Depth",
    bestMove: "Best move",
    mainLine: "Principal variation",
    waitingAnalysis: "Searching…",
    moveSheet: "Scoresheet",
    waitingMove: "Waiting for the first move…",
    hint: "Show hint",
    hideHint: "Hide hint",
    tryAgain: "Try again",
    wrongMove: "This move is not the objective of this step. Use the hint if you want to review the squares to connect.",
    advice: "A good opening move gives your pieces room to breathe and controls important squares.",
    whyBest: "Why this move is better",
    takeaway: "The principle to remember",
    personalized: "Personalized diagnosis",
    focus: "Focus",
    engineBest: "Best move",
    engineFooter: "Stockfish 17.1 engine · educational depth 12",
    objectiveFilled: "Objective complete",
    noteCenter: "The center",
    noteDevelopment: "Development",
    noteSafety: "King safety",
    account: "Account",
  },
} as const;

type TranslationKey = keyof typeof translations.fr;

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
    return window.localStorage.getItem("echequier-language") === "en" ? "en" : "fr";
  });

  useEffect(() => {
    window.localStorage.setItem("echequier-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === "fr" ? "en" : "fr"),
    t: (key: TranslationKey) => translations[language][key],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
