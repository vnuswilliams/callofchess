import { describe, expect, it } from "vitest";
import { PUBLIC_LESSON_IDS } from "./lessonIds";
import { getLessonListState, mergeLessonProgress, normalizeProgressLessonIds } from "./learningPathProgress";

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

