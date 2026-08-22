import { describe, expect, it } from "vitest";
import { PUBLIC_LESSON_IDS } from "./lessonIds";
import { getLevelLessonDestination } from "./learningPathNavigation";

describe("level lesson resume destination", () => {
  it("opens the first playable lesson that is not completed in the level order", () => {
    const destination = getLevelLessonDestination(
      [
        PUBLIC_LESSON_IDS.board,
        PUBLIC_LESSON_IDS.pieces,
        PUBLIC_LESSON_IDS.capture,
      ],
      new Set([PUBLIC_LESSON_IDS.board])
    );

    expect(destination).toBe(`/lesson/${PUBLIC_LESSON_IDS.pieces}`);
  });

  it("skips completed lessons and replays the last playable lesson when the level is complete", () => {
    const destination = getLevelLessonDestination(
      [PUBLIC_LESSON_IDS.center, PUBLIC_LESSON_IDS.development],
      new Set([PUBLIC_LESSON_IDS.center, PUBLIC_LESSON_IDS.development])
    );

    expect(destination).toBe(`/lesson/${PUBLIC_LESSON_IDS.development}`);
  });

  it("returns no destination when the level has no published playable lesson", () => {
    expect(getLevelLessonDestination([undefined, null], new Set())).toBeNull();
  });
});
