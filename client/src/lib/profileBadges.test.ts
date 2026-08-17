import { describe, expect, it } from "vitest";
import { computeProfileBadges } from "./profileBadges";

describe("computeProfileBadges", () => {
  it("unlocks badges from distinct completed lessons only", () => {
    const badges = computeProfileBadges([
      { lesson_id: "1", completed: true },
      { lesson_id: "1", completed: true },
      { lesson_id: "2", completed: true },
    ]);
    expect(badges.map(({ id, completed, unlocked }) => ({ id, completed, unlocked }))).toEqual([
      { id: "first-step", completed: 2, unlocked: true },
      { id: "opening-eye", completed: 2, unlocked: true },
      { id: "full-board", completed: 2, unlocked: false },
    ]);
  });

  it("keeps every badge locked for a new account", () => {
    expect(computeProfileBadges([]).every((badge) => !badge.unlocked && badge.completed === 0)).toBe(true);
  });
});
