import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import {
  calculationLessonCatalog,
  getCalculationProgress,
  getCalculationStepState,
  validateCalculationLine,
  type CalculationAnswer,
} from "./calculationLessons";

describe("calculation lesson catalogue", () => {
  it("publishes seven bilingual lessons for level three", () => {
    expect(Object.keys(calculationLessonCatalog)).toEqual(["35", "36", "37", "38", "39", "40", "41"]);
    expect(Object.values(calculationLessonCatalog).every((lesson) => lesson.title.fr && lesson.title.en)).toBe(true);
    expect(Object.values(calculationLessonCatalog).every((lesson) => lesson.exercises.length >= 2)).toBe(true);
  });

  it("keeps every calculation line legal from its FEN", () => {
    for (const lesson of Object.values(calculationLessonCatalog)) {
      for (const exercise of lesson.exercises) {
        const game = new Chess(exercise.fen);
        for (const move of exercise.solutionLine) {
          expect(() => game.move(move.uci)).not.toThrow();
        }
      }
    }
  });
});

describe("calculation exercise state", () => {
  const answers: CalculationAnswer[] = [
    { id: "candidate", label: { fr: "Échec", en: "Check" }, correct: true },
    { id: "quiet", label: { fr: "Coup calme", en: "Quiet move" }, correct: false },
  ];

  it("marks only the selected correct answer as successful", () => {
    expect(getCalculationStepState(answers, "candidate")).toBe("correct");
    expect(getCalculationStepState(answers, "quiet")).toBe("wrong");
    expect(getCalculationStepState(answers, null)).toBe("idle");
  });

  it("does not let an incorrect attempt inflate progress", () => {
    expect(getCalculationProgress(1, 4, false)).toBe(25);
    expect(getCalculationProgress(1, 4, true)).toBe(25);
    expect(getCalculationProgress(4, 4, true)).toBe(100);
  });

  it("accepts a complete line only when every move matches the expected UCI", () => {
    const expected = ["e2e4", "e7e5", "g1f3"];
    expect(validateCalculationLine(expected, expected)).toBe(true);
    expect(validateCalculationLine(["e2e4", "e7e5"], expected)).toBe(false);
    expect(validateCalculationLine(["e2e3", "e7e5", "g1f3"], expected)).toBe(false);
  });
});
