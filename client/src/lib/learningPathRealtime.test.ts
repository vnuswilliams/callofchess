import { describe, expect, it } from "vitest";
import { mergeRealtimeProgressRows, type RealtimeProgressPayload } from "./learningPathRealtime";

const userId = "user-1";
const lessonId = "a116805b-1c51-4578-b66c-5c1d437c0cd6";

function payload(overrides: Partial<RealtimeProgressPayload>): RealtimeProgressPayload {
  return {
    eventType: "UPDATE",
    new: { user_id: userId, lesson_id: lessonId, completed_steps: 2, completed: false },
    old: {},
    ...overrides,
  };
}

describe("Realtime learning progress", () => {
  it("merges a newer row without losing a previously completed state", () => {
    const current = [{ lesson_id: lessonId, completed_steps: 4, completed: true }];
    const next = mergeRealtimeProgressRows(current, payload({ new: { user_id: userId, lesson_id: lessonId, completed_steps: 2, completed: false } }), userId);

    expect(next).toEqual([{ lesson_id: lessonId, completed_steps: 4, completed: true }]);
  });

  it("ignores progress events belonging to another user", () => {
    const current = [{ lesson_id: lessonId, completed_steps: 1, completed: false }];
    const next = mergeRealtimeProgressRows(current, payload({ new: { user_id: "user-2", lesson_id: lessonId, completed_steps: 9, completed: true } }), userId);

    expect(next).toEqual(current);
  });

  it("removes only the authenticated user's deleted lesson row", () => {
    const current = [
      { lesson_id: lessonId, completed_steps: 2, completed: false },
      { lesson_id: "fbdc9b42-1e39-44fc-8f3c-d4910ec99fc6", completed_steps: 1, completed: false },
    ];
    const next = mergeRealtimeProgressRows(current, payload({ eventType: "DELETE", new: {}, old: { user_id: userId, lesson_id: lessonId } }), userId);

    expect(next).toEqual([{ lesson_id: "fbdc9b42-1e39-44fc-8f3c-d4910ec99fc6", completed_steps: 1, completed: false }]);
  });
});
