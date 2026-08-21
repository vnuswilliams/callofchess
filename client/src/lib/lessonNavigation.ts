import { PUBLIC_LESSON_ID_BY_KEY, type PublicLessonKey } from "./lessonIds";

const PUBLIC_LESSON_KEYS = Object.keys(PUBLIC_LESSON_ID_BY_KEY) as PublicLessonKey[];

export function getNextLessonHref(lessonKey: PublicLessonKey): string {
  const currentIndex = PUBLIC_LESSON_KEYS.indexOf(lessonKey);
  const nextLessonKey = currentIndex >= 0 ? PUBLIC_LESSON_KEYS[currentIndex + 1] : undefined;

  return nextLessonKey ? `/lesson/${PUBLIC_LESSON_ID_BY_KEY[nextLessonKey]}` : "/path";
}
