import type { PathLevel } from "./learningPath";
import { PUBLIC_LESSON_ID_BY_KEY } from "./lessonIds";

export const playableLessonIdForExercise: Readonly<Record<string, string>> = {
  "0-board": PUBLIC_LESSON_ID_BY_KEY["1"],
  "0-pieces": PUBLIC_LESSON_ID_BY_KEY["2"],
  "0-capture": PUBLIC_LESSON_ID_BY_KEY["3"],
  "0-checkmate": PUBLIC_LESSON_ID_BY_KEY["4"],
  "0-special": PUBLIC_LESSON_ID_BY_KEY["5"],
  "0-complete": PUBLIC_LESSON_ID_BY_KEY["6"],
  "1-goals": PUBLIC_LESSON_ID_BY_KEY["7"],
  "1-opening": PUBLIC_LESSON_ID_BY_KEY["8"],
  "1-safety": PUBLIC_LESSON_ID_BY_KEY["9"],
  "1-material": PUBLIC_LESSON_ID_BY_KEY["10"],
  "1-threats": PUBLIC_LESSON_ID_BY_KEY["11"],
  "1-opponent": PUBLIC_LESSON_ID_BY_KEY["12"],
};

export function getLevelCompletion(
  level: PathLevel,
  completedLessons: ReadonlySet<string>,
  lessonIdByExercise: Readonly<Record<string, string>> = playableLessonIdForExercise,
): number {
  const playableLessonIds = level.exercises
    .map((exercise) => lessonIdByExercise[exercise.id])
    .filter((lessonId): lessonId is string => Boolean(lessonId));

  return Math.min(
    level.exercises.length,
    playableLessonIds.filter((lessonId) => completedLessons.has(lessonId)).length,
  );
}

export function getCompletedLevelIds(
  levels: readonly PathLevel[],
  completedLessons: ReadonlySet<string>,
  lessonIdByExercise: Readonly<Record<string, string>> = playableLessonIdForExercise,
): Set<string> {
  return new Set(
    levels
      .filter((level) => getLevelCompletion(level, completedLessons, lessonIdByExercise) === level.exercises.length)
      .map((level) => `level-${level.id}`),
  );
}
