import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { setPageMeta } from '@/lib/seo';

const pages = {
  fr: {
    '/': ['Call of Chess — Apprendre les échecs, un coup après l’autre', 'Call of Chess propose des leçons courtes et pratiques pour apprendre les échecs avec confiance.'],
    '/account': ['Compte — Call of Chess', 'Gérez votre connexion, votre compte et la sauvegarde de votre progression sur Call of Chess.'],
    '/profile': ['Profil — Call of Chess', 'Retrouvez votre progression, vos badges et vos repères d’apprentissage sur Call of Chess.'],
    '/path': ['Parcours — Call of Chess', 'Suivez un parcours progressif pour comprendre, pratiquer et mesurer vos progrès aux échecs.'],
    '/ranking': ['Classement — Call of Chess', 'Consultez le classement public de Call of Chess lorsque vos résultats sont disponibles.'],
    '/404': ['Page introuvable — Call of Chess', 'Cette page Call of Chess est introuvable. Retournez à l’accueil pour poursuivre votre apprentissage.'],
  },
  en: {
    '/': ['Call of Chess — Learn chess one move at a time', 'Call of Chess offers short, practical lessons to help you learn chess with confidence.'],
    '/account': ['Account — Call of Chess', 'Manage your sign-in, account and saved learning progress on Call of Chess.'],
    '/profile': ['Profile — Call of Chess', 'Review your progress, badges and learning markers on Call of Chess.'],
    '/path': ['Learning path — Call of Chess', 'Follow a progressive path to understand, practise and measure your chess progress.'],
    '/ranking': ['Leaderboard — Call of Chess', 'View the public Call of Chess leaderboard when results are available.'],
    '/404': ['Page not found — Call of Chess', 'This Call of Chess page could not be found. Return home to continue learning.'],
  },
} as const;

export default function PageMeta() {
  const [location] = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    const basePath = location.startsWith('/lesson/') ? '/lesson' : location.split('?')[0];
    const lesson = language === 'fr'
      ? ['Leçon — Call of Chess', 'Jouez une position guidée et progressez étape par étape avec Call of Chess.']
      : ['Lesson — Call of Chess', 'Play a guided position and improve step by step with Call of Chess.'];
    const [title, description] = basePath === '/lesson' ? lesson : (pages[language][basePath as keyof typeof pages[typeof language]] ?? pages[language]['/404']);
    setPageMeta({ title, description, path: basePath === '/lesson' ? location.split('?')[0] : basePath, language });
  }, [language, location]);
  return null;
}
