import { describe, expect, it } from "vitest";
import { PUBLIC_LESSON_IDS } from "./lessonIds";
import { consumeFirstCompletionNotice, getLessonListState, mergeLessonProgress, normalizeProgressLessonIds, shouldAnnounceFirstCompletion, storeFirstCompletionNotice } from "./learningPathProgress";

describe("learning path progress identifiers", () => {
  it("normalizes legacy lesson identifiers to the public UUID used by the path", () => {
    const rows = normalizeProgressLessonIds([
      { lesson_id: "1", completed: true, completed_steps: 3 },
      { lesson_id: "c997761e-bf19-5bc6-b295-42505e6aa6e1", completed: true, completed_steps: 3 },
      { lesson_id: PUBLIC_LESSON_IDS.board, completed: true, completed_steps: 3 },
    ]);

    expect(rows.map((row) => row.lesson_id)).toEqual([
      PUBLIC_LESSON_IDS.board,
      PUBLIC_LESSON_IDS.board,
      PUBLIC_LESSON_IDS.board,
    ]);
  });
});

describe("first completion notification", () => {
  it("announces only a transition from incomplete to complete", () => {
    expect(shouldAnnounceFirstCompletion(false, true)).toBe(true);
    expect(shouldAnnounceFirstCompletion(true, true)).toBe(false);
    expect(shouldAnnounceFirstCompletion(false, false)).toBe(false);
  });

  it("consumes a stored notice once for the matching user", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    };
    storeFirstCompletionNotice(storage, "user-1", PUBLIC_LESSON_IDS.board);
    expect(consumeFirstCompletionNotice(storage, "user-1")).toBe(PUBLIC_LESSON_IDS.board);
    expect(consumeFirstCompletionNotice(storage, "user-1")).toBeNull();
  });
});

describe("lesson list completion state", () => {
  it("marks a completed lesson for the path list without changing replay access", () => {
    expect(getLessonListState(new Set([PUBLIC_LESSON_IDS.board]), PUBLIC_LESSON_IDS.board)).toBe("completed");
  });

  it("keeps an unfinished lesson available", () => {
    expect(getLessonListState(new Set(), PUBLIC_LESSON_IDS.board)).toBe("available");
  });
});

describe("monotonic lesson completion", () => {
  it("keeps a completed lesson completed when a replay saves an earlier step", () => {
    const progress = mergeLessonProgress(
      { lesson_id: PUBLIC_LESSON_IDS.board, completed: true, completed_steps: 6 },
      { lesson_id: PUBLIC_LESSON_IDS.board, completed: false, completed_steps: 1 },
    );

    expect(progress).toMatchObject({ completed: true, completed_steps: 6 });
  });

  it("uses the new progress when the lesson has not been completed before", () => {
    const progress = mergeLessonProgress(undefined, {
      lesson_id: PUBLIC_LESSON_IDS.board,
      completed: false,
      completed_steps: 2,
    });

    expect(progress).toMatchObject({ completed: false, completed_steps: 2 });
  });
});

