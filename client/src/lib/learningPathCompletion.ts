import type { PathLevel } from "./learningPath";
import { learningPath } from "./learningPath";

/**
 * Derived directly from each exercise's own `lessonId` in `learningPath`.
 * There is nothing to keep in sync here anymore: add a level, rename an
 * exercise id, or wire up a new lesson by editing `learningPath.ts` only,
 * and this map (and every unlock computed from it) updates automatically.
 */
export const playableLessonIdForExercise: Readonly<Record<string, string>> = Object.fromEntries(
  learningPath
    .flatMap((level) => level.exercises)
    .filter((exercise): exercise is typeof exercise & { lessonId: string } => Boolean(exercise.lessonId))
    .map((exercise) => [exercise.id, exercise.lessonId]),
);

export function getLevelCompletion(
  level: PathLevel,
  completedLessons: ReadonlySet<string>,
  lessonIdByExercise: Readonly<Record<string, string>> = playableLessonIdForExercise,
): number {
  const playableLessonIds = level.exercises
    .map((exercise) => exercise.lessonId ?? lessonIdByExercise[exercise.id])
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

/**
 * Guards against the exact failure mode that once blocked level 2 forever:
 * a level where only SOME exercises have a published lesson. That state is
 * silent poison — the level can never reach 100% completion, so it (and
 * every level after it) can never unlock, no matter what the learner does.
 * A level should have either zero playable lessons (not published yet) or
 * all of them (fully published). Covered by a regression test so a future
 * partial roadmap edit fails `pnpm test` instead of failing silently in
 * production.
 */
export function getLevelsWithPartialLessonMapping(levels: readonly PathLevel[]): PathLevel[] {
  return levels.filter((level) => {
    const publishedCount = level.exercises.filter((exercise) => Boolean(exercise.lessonId)).length;
    return publishedCount > 0 && publishedCount < level.exercises.length;
  });
}