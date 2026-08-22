import { mergeLessonProgress, normalizeProgressLessonIds, type LearningPathProgressRow } from "./learningPathProgress";

type ProgressRow = Pick<LearningPathProgressRow, "lesson_id" | "completed" | "completed_steps" | "updated_at"> & {
  user_id?: string;
};

export type RealtimeProgressPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: unknown;
  old: unknown;
};

function isProgressIdentity(value: unknown): value is Pick<ProgressRow, "lesson_id" | "user_id"> {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<ProgressRow>;
  return typeof row.lesson_id === "string" && typeof row.user_id === "string";
}

function isProgressRow(value: unknown): value is ProgressRow {
  return isProgressIdentity(value)
    && typeof (value as ProgressRow).completed === "boolean"
    && typeof (value as ProgressRow).completed_steps === "number";
}

export function mergeRealtimeProgressRows(
  currentRows: readonly LearningPathProgressRow[],
  payload: RealtimeProgressPayload,
  authenticatedUserId: string,
): LearningPathProgressRow[] {
  const candidate = payload.eventType === "DELETE" ? payload.old : payload.new;
  if (!isProgressIdentity(candidate) || candidate.user_id !== authenticatedUserId) return [...currentRows];

  if (payload.eventType === "DELETE") {
    const normalizedLessonId = normalizeProgressLessonIds([{ lesson_id: candidate.lesson_id, completed: false, completed_steps: 0 }])[0].lesson_id;
    const existingIndex = currentRows.findIndex((row) => row.lesson_id === normalizedLessonId);
    return existingIndex < 0 ? [...currentRows] : currentRows.filter((_, index) => index !== existingIndex);
  }

  if (!isProgressRow(candidate)) return [...currentRows];
  const { user_id: _userId, ...progressFields } = candidate;
  const normalized = normalizeProgressLessonIds([progressFields])[0];
  const existingIndex = currentRows.findIndex((row) => row.lesson_id === normalized.lesson_id);

  if (existingIndex < 0) return [...currentRows, normalized];

  const nextRows = [...currentRows];
  nextRows[existingIndex] = mergeLessonProgress(nextRows[existingIndex], normalized);
  return nextRows;
}
