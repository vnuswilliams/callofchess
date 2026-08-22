import { describe, expect, it } from "vitest";
import { computeProfileStats } from "./profileStats";
import { PUBLIC_LESSON_ID_BY_KEY } from "./lessonIds";

const FIRST_LESSON_ID = PUBLIC_LESSON_ID_BY_KEY["1"];
const SECOND_LESSON_ID = PUBLIC_LESSON_ID_BY_KEY["2"];
const THIRD_LESSON_ID = PUBLIC_LESSON_ID_BY_KEY["3"];

const EMPTY_LESSONS = Object.values(PUBLIC_LESSON_ID_BY_KEY).slice(2).map((lessonId) => ({ lessonId, steps: 0, completed: false }));

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
      completionRate: 17,
      averageSteps: 2,
      recentActivity: [
        { lessonId: FIRST_LESSON_ID, steps: 2, completed: true },
        { lessonId: SECOND_LESSON_ID, steps: 3, completed: true },
        ...EMPTY_LESSONS,
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
      recentActivity: Object.values(PUBLIC_LESSON_ID_BY_KEY).map((lessonId) => ({ lessonId, steps: 0, completed: false })),
    });
  });
});
