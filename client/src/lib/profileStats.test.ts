import { describe, expect, it } from "vitest";
import { computeProfileStats } from "./profileStats";

const FIRST_LESSON_ID = "c997761e-bf19-5bc6-b295-42505e6aa6e1";
const SECOND_LESSON_ID = "bca26f7f-0c27-551d-b173-28d9536cd91b";
const THIRD_LESSON_ID = "a7ee38d7-6164-5e62-9fad-18e39412e7cc";

describe("computeProfileStats", () => {
  it("counts completed lessons, distinct lessons, and validated steps", () => {
    expect(computeProfileStats([
      { lesson_id: FIRST_LESSON_ID, completed_steps: 2, completed: true },
      { lesson_id: SECOND_LESSON_ID, completed_steps: 1, completed: false },
      { lesson_id: SECOND_LESSON_ID, completed_steps: 3, completed: true },
    ])).toEqual({
      completed: 2,
      activeLessons: 2,
      totalSteps: 6,
      completionRate: 67,
      averageSteps: 2,
      recentActivity: [
        { lessonId: FIRST_LESSON_ID, steps: 2, completed: true },
        { lessonId: SECOND_LESSON_ID, steps: 3, completed: true },
        { lessonId: THIRD_LESSON_ID, steps: 0, completed: false },
      ],
    });
  });

  it("returns empty statistics for a new account", () => {
    expect(computeProfileStats([])).toEqual({
      completed: 0,
      activeLessons: 0,
      totalSteps: 0,
      completionRate: 0,
      averageSteps: 0,
      recentActivity: [
        { lessonId: FIRST_LESSON_ID, steps: 0, completed: false },
        { lessonId: SECOND_LESSON_ID, steps: 0, completed: false },
        { lessonId: THIRD_LESSON_ID, steps: 0, completed: false },
      ],
    });
  });
});
