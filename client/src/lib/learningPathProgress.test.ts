import { describe, expect, it } from "vitest";
import { PUBLIC_LESSON_IDS } from "./lessonIds";
import { normalizeProgressLessonIds } from "./learningPathProgress";

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

