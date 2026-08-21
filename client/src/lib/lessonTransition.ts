import { PUBLIC_LESSON_ID_BY_KEY } from "./lessonIds";

export const LESSON_MOVE_ANIMATION_MS = 650;
export const LESSON_STEP_TRANSITION_DELAY_MS = 950;
export const LESSON_SUCCESS_ANIMATION_MS = 2400;

export function getFirstIncompleteLessonDestination(completedLessonIds: ReadonlySet<string>): string {
  const firstIncompleteLessonId = Object.values(PUBLIC_LESSON_ID_BY_KEY).find((lessonId) => !completedLessonIds.has(lessonId));

  return firstIncompleteLessonId ? `/lesson/${firstIncompleteLessonId}` : "/path";
}
