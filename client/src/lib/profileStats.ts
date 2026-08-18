import { PUBLIC_LESSON_ID_BY_KEY } from "@/lib/lessonIds";

export type ProfileProgressRow = {
  lesson_id: string;
  completed_steps: number;
  completed: boolean;
  updated_at?: string;
};

const lessonIds = Object.values(PUBLIC_LESSON_ID_BY_KEY);

export function computeProfileStats(rows: ProfileProgressRow[], totalLessons = lessonIds.length) {
  const completed = rows.filter((row) => row.completed).length;
  const activeLessons = new Set(rows.map((row) => row.lesson_id)).size;
  const totalSteps = rows.reduce((sum, row) => sum + Math.max(0, row.completed_steps || 0), 0);
  const completionRate = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  const averageSteps = rows.length > 0 ? Math.round((totalSteps / rows.length) * 10) / 10 : 0;
  const recentActivity = Array.from({ length: totalLessons }, (_, index) => {
    const lessonId = lessonIds[index] ?? `lesson-${index + 1}`;
    const matching = rows.filter((row) => row.lesson_id === lessonId);
    return { lessonId, steps: matching.reduce((max, row) => Math.max(max, row.completed_steps || 0), 0), completed: matching.some((row) => row.completed) };
  });
  return { completed, activeLessons, totalSteps, completionRate, averageSteps, recentActivity };
}
