import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { createDrawPosition, getNextStepPosition, lessonCatalog } from "./levelZeroLessons";

describe("lesson catalogue", () => {
  it("contains the six level-zero, six level-one and 22 level-two lessons", () => {
    expect(Object.keys(lessonCatalog)).toEqual(Array.from({ length: 34 }, (_, index) => String(index + 1)));
    expect(lessonCatalog["1"].mode).toBe("theory");
    expect(lessonCatalog["5"].mode).toBe("draws");
    expect(lessonCatalog["6"].mode).toBe("computer");
    expect(lessonCatalog["7"].title.fr).toBe("Les objectifs d’une position");
    expect(lessonCatalog["8"].title.fr).toBe("Les principes d’ouverture");
    expect(lessonCatalog["12"].title.fr).toBe("Que veut faire l’adversaire ?");

    for (const lesson of Object.values(lessonCatalog)) {
      expect(lesson.title.fr.length).toBeGreaterThan(0);
      expect(lesson.title.en.length).toBeGreaterThan(0);
      expect(lesson.objective.fr.length).toBeGreaterThan(0);
      expect(lesson.objective.en.length).toBeGreaterThan(0);
      if (lesson.mode === "guided" || lesson.mode === "draws") expect(lesson.steps.length).toBeGreaterThan(0);
      if (lesson.mode === "theory") expect(lesson.theorySections.length).toBeGreaterThanOrEqual(4);
      if (lesson.mode === "computer") expect(lesson.computerGoal).toBeTruthy();
    }
  });

  it("switches the board to the next piece position after a completed exercise", () => {
    const lesson = lessonCatalog["2"];
    const afterKingGame = new Chess(lesson.steps[0].positionFen);
    afterKingGame.move({ from: lesson.steps[0].from, to: lesson.steps[0].to });
    const afterKingMove = afterKingGame.fen();

    expect(getNextStepPosition(lesson.steps, 1, afterKingMove)).toBe(lesson.steps[1].positionFen);
    expect(getNextStepPosition(lesson.steps, lesson.steps.length, afterKingMove)).toBe(afterKingMove);
  });

  it("keeps every guided sequence legal", () => {
    for (const lesson of Object.values(lessonCatalog)) {
      if (lesson.mode === "theory" || lesson.mode === "computer") continue;
      const game = new Chess(lesson.startingFen);
      for (const step of lesson.steps) {
        if (step.positionFen) game.load(step.positionFen);
        game.move({ from: step.from, to: step.to, promotion: "q" });
        if (step.reply) game.move(step.reply);
      }
      expect(game.fen()).toMatch(/^[rnbqkpRNBQKP1-8/]+ [wb] /);
    }
  });

  it("explains the requested material and Elo principle in the theory lesson", () => {
    const theory = lessonCatalog["1"];
    const text = theory.theorySections.map((section) => `${section.title.fr} ${section.text.fr} ${(section.items ?? []).map((item) => `${item.label.fr} ${item.text.fr}`).join(" ")}`).join(" ");
    expect(text).toContain("Elo");
    expect(text).toContain("Roi");
    expect(text).toContain("Dame");
    expect(text).toContain("Pion");
  });

  it("gives each draw type a definition, condition and concrete example", () => {
    const draws = lessonCatalog["5"];
    for (const position of draws.drawPositions) {
      expect(position.definition.fr.length).toBeGreaterThan(30);
      expect(position.condition.fr.length).toBeGreaterThan(30);
      expect(position.example.fr.length).toBeGreaterThan(30);
      expect(position.definition.en.length).toBeGreaterThan(30);
      expect(position.condition.en.length).toBeGreaterThan(30);
      expect(position.example.en.length).toBeGreaterThan(30);
    }
  });

  it("keeps the draw lesson explicit and interactive", () => {
    const draws = lessonCatalog["5"];
    const text = draws.drawPositions.map((position) => `${position.title.fr} ${position.explanation.fr}`).join(" ").toLocaleLowerCase("fr");
    expect(draws.mode).toBe("draws");
    expect(draws.drawPositions).toHaveLength(4);
    expect(text).toContain("répétition");
    expect(text).toContain("50 coups");
    expect(text).toContain("matériel insuffisant");
    expect(createDrawPosition(draws.drawPositions[0]).isStalemate()).toBe(true);
    expect(createDrawPosition(draws.drawPositions[1]).isThreefoldRepetition()).toBe(true);
    expect(createDrawPosition(draws.drawPositions[2]).isDraw()).toBe(true);
    expect(createDrawPosition(draws.drawPositions[3]).isInsufficientMaterial()).toBe(true);
  });
});
