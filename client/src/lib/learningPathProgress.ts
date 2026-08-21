import { toPublicLessonId } from "./lessonIds";

export type LearningPathProgressRow = {
  lesson_id: string;
  completed: boolean;
  completed_steps: number;
};

export function normalizeProgressLessonIds(rows: LearningPathProgressRow[]) {
  return rows.map((row) => ({
    ...row,
    lesson_id: toPublicLessonId(row.lesson_id) ?? row.lesson_id,
  }));
}
