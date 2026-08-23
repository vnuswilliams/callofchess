import { describe, expect, it } from "vitest";
import { getNextLessonHref } from "./lessonNavigation";

describe("getNextLessonHref", () => {
  it("returns the path overview after the final public lesson", () => {
    expect(getNextLessonHref("41")).toBe("/path");
  });

  it("returns the next lesson URL for a non-final lesson", () => {
    expect(getNextLessonHref("7")).toBe("/lesson/fbdc9b42-1e39-44fc-8f3c-d4910ec99fc6");
  });
});
