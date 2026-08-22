import { toPublicLessonId } from "./lessonIds";

export type LearningPathProgressRow = {
  lesson_id: string;
  completed: boolean;
  completed_steps: number;
};

export type LessonListState = "completed" | "available";
export type CompletionNoticeStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

type FirstCompletionNotice = { lessonId: string };

function firstCompletionStorageKey(userId: string) {
  return `callofchess:first-completion-notice:${userId}`;
}

export function storeFirstCompletionNotice(storage: CompletionNoticeStorage, userId: string, lessonId: string): void {
  try {
    storage.setItem(firstCompletionStorageKey(userId), JSON.stringify({ lessonId } satisfies FirstCompletionNotice));
  } catch {
    // The path remains usable when browser storage is unavailable.
  }
}

export function consumeFirstCompletionNotice(storage: CompletionNoticeStorage, userId: string): string | null {
  try {
    const raw = storage.getItem(firstCompletionStorageKey(userId));
    if (!raw) return null;
    storage.removeItem(firstCompletionStorageKey(userId));
    const notice = JSON.parse(raw) as Partial<FirstCompletionNotice>;
    return typeof notice.lessonId === "string" ? notice.lessonId : null;
  } catch {
    return null;
  }
}

export function shouldAnnounceFirstCompletion(previouslyCompleted: boolean, currentlyCompleted: boolean): boolean {
  return !previouslyCompleted && currentlyCompleted;
}

export function getLessonListState(completedLessons: ReadonlySet<string>, lessonId: string): LessonListState {
  return completedLessons.has(lessonId) ? "completed" : "available";
}

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
