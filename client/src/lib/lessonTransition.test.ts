import { describe, expect, it } from "vitest";
import { getFirstIncompleteLessonDestination, LESSON_MOVE_ANIMATION_MS, LESSON_STEP_TRANSITION_DELAY_MS, LESSON_SUCCESS_ANIMATION_MS } from "./lessonTransition";

describe("lesson completion destination", () => {
  it("keeps the success animation visible before redirecting", () => {
    expect(LESSON_SUCCESS_ANIMATION_MS).toBeGreaterThanOrEqual(2000);
  });

  it("keeps piece arrivals and next-step loading visibly separated", () => {
    expect(LESSON_MOVE_ANIMATION_MS).toBeGreaterThanOrEqual(500);
    expect(LESSON_STEP_TRANSITION_DELAY_MS).toBeGreaterThan(LESSON_MOVE_ANIMATION_MS);
  });

  it("opens the first incomplete canonical lesson instead of always using the next lesson", () => {
    expect(getFirstIncompleteLessonDestination(new Set([
      "f3a1c235-5531-4c1c-845b-6d684808259b",
      "0ce3ec0e-348e-4300-b88a-c4a939cd8960",
      "358114a7-8876-588e-bd0d-3fbcbfeecb14",
      "bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4",
    ]))).toBe("/lesson/4f9942af-62e4-4754-9e1b-cdad46dfbe7d");
  });

  it("opens the first published level-one lesson after chapter zero is complete", () => {
    expect(getFirstIncompleteLessonDestination(new Set([
      "f3a1c235-5531-4c1c-845b-6d684808259b",
      "0ce3ec0e-348e-4300-b88a-c4a939cd8960",
      "4f9942af-62e4-4754-9e1b-cdad46dfbe7d",
      "32ffa48c-fa82-5825-9d6c-7ffb79a60781",
      "358114a7-8876-588e-bd0d-3fbcbfeecb14",
      "bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4",
    ]))).toBe("/lesson/a116805b-1c51-4578-b66c-5c1d437c0cd6");
  });

  it("starts again at the first lesson when only a later lesson is complete", () => {
    expect(getFirstIncompleteLessonDestination(new Set([
      "bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4",
    ]))).toBe("/lesson/f3a1c235-5531-4c1c-845b-6d684808259b");
  });

  it("returns to the learning path when every published lesson is complete", () => {
    expect(getFirstIncompleteLessonDestination(new Set([
      "f3a1c235-5531-4c1c-845b-6d684808259b",
      "0ce3ec0e-348e-4300-b88a-c4a939cd8960",
      "4f9942af-62e4-4754-9e1b-cdad46dfbe7d",
      "32ffa48c-fa82-5825-9d6c-7ffb79a60781",
      "358114a7-8876-588e-bd0d-3fbcbfeecb14",
      "bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4",
      "a116805b-1c51-4578-b66c-5c1d437c0cd6",
      "fbdc9b42-1e39-44fc-8f3c-d4910ec99fc6",
    ]))).toBe("/path");
  });
});
