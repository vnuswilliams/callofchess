export type ProfileProgressRow = {
  lesson_id: string;
  completed_steps: number;
  completed: boolean;
  updated_at?: string;
};

const lessonIds = [
  "c997761e-bf19-5bc6-b295-42505e6aa6e1",
  "bca26f7f-0c27-551d-b173-28d9536cd91b",
  "a7ee38d7-6164-5e62-9fad-18e39412e7cc",
];

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
