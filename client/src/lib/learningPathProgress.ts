import { toPublicLessonId } from "./lessonIds";

export type LearningPathProgressRow = {
  lesson_id: string;
  completed: boolean;
  completed_steps: number;
};

export function mergeLessonProgress(
  previous: LearningPathProgressRow | null | undefined,
  next: LearningPathProgressRow,
): LearningPathProgressRow {
  return {
    ...next,
    completed: Boolean(previous?.completed || next.completed),
    completed_steps: Math.max(previous?.completed_steps ?? 0, next.completed_steps),
  };
}

export function normalizeProgressLessonIds(rows: LearningPathProgressRow[]) {
  return rows.map((row) => ({
    ...row,
    lesson_id: toPublicLessonId(row.lesson_id) ?? row.lesson_id,
  }));
}
