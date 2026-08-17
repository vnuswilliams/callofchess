export type ProfileProgressRow = {
  lesson_id: string;
  completed_step: number;
  completed: boolean;
};

export function computeProfileStats(rows: ProfileProgressRow[]) {
  return {
    completed: rows.filter((row) => row.completed).length,
    activeLessons: new Set(rows.map((row) => row.lesson_id)).size,
    totalSteps: rows.reduce((sum, row) => sum + Math.max(0, row.completed_step || 0), 0),
  };
}
