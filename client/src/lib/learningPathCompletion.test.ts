import { describe, expect, it } from "vitest";
import { isLevelUnlocked, learningPath } from "./learningPath";
import { getCompletedLevelIds, getLevelCompletion, playableLessonIdForExercise } from "./learningPathCompletion";

function completedLessonsForLevel(levelIndex: number) {
  return new Set(
    learningPath[levelIndex].exercises
      .map((exercise) => playableLessonIdForExercise[exercise.id])
      .filter((lessonId): lessonId is string => Boolean(lessonId)),
  );
}

describe("learning path completion", () => {
  it("maps all six published lessons of level 1", () => {
    const level = learningPath[1];
    const lessonIds = level.exercises.map((exercise) => playableLessonIdForExercise[exercise.id]);

    expect(lessonIds).toHaveLength(6);
    expect(lessonIds.every(Boolean)).toBe(true);
    expect(new Set(lessonIds)).toHaveLength(6);
  });

  it("marks level 1 complete after its six published lessons", () => {
    const completedLessons = completedLessonsForLevel(1);

    expect(getLevelCompletion(learningPath[1], completedLessons)).toBe(6);
  });

  it("unlocks level 2 when every lesson in level 1 is complete", () => {
    const completedLessons = completedLessonsForLevel(1);
    const completedLevels = getCompletedLevelIds(learningPath, completedLessons);

    expect(completedLevels).toContain("level-1");
    expect(isLevelUnlocked(learningPath[2], completedLevels)).toBe(true);
  });
});
