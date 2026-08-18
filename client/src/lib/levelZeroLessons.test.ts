import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { lessonCatalog } from "./levelZeroLessons";

describe("level zero lesson catalogue", () => {
  it("contains six bilingual lessons with playable sequences", () => {
    expect(Object.keys(lessonCatalog)).toEqual(["1", "2", "3", "4", "5", "6"]);
    for (const lesson of Object.values(lessonCatalog)) {
      expect(lesson.title.fr.length).toBeGreaterThan(0);
      expect(lesson.title.en.length).toBeGreaterThan(0);
      expect(lesson.steps.length).toBeGreaterThan(0);
      const game = new Chess(lesson.startingFen);
      for (const step of lesson.steps) {
        game.move({ from: step.from, to: step.to, promotion: "q" });
        if (step.reply) game.move(step.reply);
      }
      expect(game.fen()).toMatch(/^[rnbqkpRNBQKP1-8/]+ [wb] /);
    }
  });
});
