import { describe, expect, it } from "vitest";
import { getLessonCompletionDestination, LESSON_SUCCESS_ANIMATION_MS } from "./lessonTransition";


describe("lesson completion destination", () => {
  it("keeps the success animation visible before redirecting", () => {
    expect(LESSON_SUCCESS_ANIMATION_MS).toBeGreaterThanOrEqual(2000);
  });

  it("opens the next canonical lesson after a completed lesson", () => {
    expect(getLessonCompletionDestination("5")).toBe("/lesson/bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4");
  });

  it("returns to the learning path after the final lesson", () => {
    expect(getLessonCompletionDestination("6")).toBe("/path");
  });
});
