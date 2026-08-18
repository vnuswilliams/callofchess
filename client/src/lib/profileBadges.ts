export type BadgeProgressRow = { lesson_id: string; completed: boolean };

export type ProfileBadge = {
  id: string;
  icon: string;
  completed: number;
  target: number;
  unlocked: boolean;
  fr: { title: string; description: string };
  en: { title: string; description: string };
};

const badgeDefinitions = [
  { id: "first-step", icon: "♟", target: 1, fr: { title: "Premier pas", description: "Terminer votre première leçon" }, en: { title: "First step", description: "Complete your first lesson" } },
  { id: "opening-eye", icon: "♞", target: 2, fr: { title: "Œil de l’ouverture", description: "Terminer deux leçons" }, en: { title: "Opening eye", description: "Complete two lessons" } },
  { id: "full-board", icon: "♛", target: 6, fr: { title: "Maître du parcours", description: "Terminer les six leçons du niveau 0" }, en: { title: "Path master", description: "Complete all six level 0 lessons" } },
];

export function computeProfileBadges(rows: BadgeProgressRow[], totalLessons = 6): ProfileBadge[] {
  const completedLessons = new Set(rows.filter((row) => row.completed).map((row) => row.lesson_id));
  const completed = completedLessons.size;
  return badgeDefinitions.map((badge) => ({ ...badge, target: Math.min(badge.target, totalLessons), completed, unlocked: completed >= badge.target }));
}
