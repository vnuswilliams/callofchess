import { PUBLIC_LESSON_ID_BY_KEY, type PublicLessonKey } from "./lessonIds";

export const LESSON_SUCCESS_ANIMATION_MS = 1200;

export function getLessonCompletionDestination(lessonKey: PublicLessonKey): string {
  const nextKey = String(Number(lessonKey) + 1) as PublicLessonKey;
  const nextLessonId = PUBLIC_LESSON_ID_BY_KEY[nextKey];

  return nextLessonId ? `/lesson/${nextLessonId}` : "/path";
}
