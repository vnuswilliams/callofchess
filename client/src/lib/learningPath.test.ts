import { describe, expect, it } from "vitest";
import { isLevelUnlocked, learningPath } from "./learningPath";

describe("learning path catalogue", () => {
  it("contains the complete progressive roadmap", () => {
    expect(learningPath).toHaveLength(18);
    expect(learningPath[0].prerequisite).toBeNull();
    expect(learningPath.slice(1).every((level, index) => level.prerequisite === index)).toBe(true);
    expect(learningPath.every((level) => level.exercises.length >= 3)).toBe(true);
  });

  it("keeps exercise copy bilingual and unlocks in sequence", () => {
    const firstExercise = learningPath[0].exercises[0];
    expect(firstExercise.fr.title).toBeTruthy();
    expect(firstExercise.en.title).toBeTruthy();
    expect(isLevelUnlocked(learningPath[0], new Set())).toBe(true);
    expect(isLevelUnlocked(learningPath[1], new Set())).toBe(false);
    expect(isLevelUnlocked(learningPath[1], new Set(["level-0"]))).toBe(true);
  });
});
