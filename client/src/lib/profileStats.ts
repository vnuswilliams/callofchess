export type ProfileProgressRow = {
  lesson_id: string;
  completed_step: number;
  completed: boolean;
  updated_at?: string;
};

export function computeProfileStats(rows: ProfileProgressRow[], totalLessons = 3) {
  const completed = rows.filter((row) => row.completed).length;
  const activeLessons = new Set(rows.map((row) => row.lesson_id)).size;
  const totalSteps = rows.reduce((sum, row) => sum + Math.max(0, row.completed_step || 0), 0);
  const completionRate = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  const averageSteps = rows.length > 0 ? Math.round((totalSteps / rows.length) * 10) / 10 : 0;
  const recentActivity = Array.from({ length: totalLessons }, (_, index) => {
    const lessonId = String(index + 1);
    const matching = rows.filter((row) => row.lesson_id === lessonId);
    return { lessonId, steps: matching.reduce((max, row) => Math.max(max, row.completed_step || 0), 0), completed: matching.some((row) => row.completed) };
  });
  return { completed, activeLessons, totalSteps, completionRate, averageSteps, recentActivity };
}
