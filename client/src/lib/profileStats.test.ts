import { describe, expect, it } from "vitest";
import { computeProfileStats } from "./profileStats";

describe("computeProfileStats", () => {
  it("counts completed lessons, distinct lessons, and validated steps", () => {
    expect(computeProfileStats([
      { lesson_id: "1", completed_step: 2, completed: true },
      { lesson_id: "2", completed_step: 1, completed: false },
      { lesson_id: "2", completed_step: 3, completed: true },
    ])).toEqual({ completed: 2, activeLessons: 2, totalSteps: 6 });
  });

  it("returns empty statistics for a new account", () => {
    expect(computeProfileStats([])).toEqual({ completed: 0, activeLessons: 0, totalSteps: 0 });
  });
});
