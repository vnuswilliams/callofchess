import { describe, expect, test } from "vitest";
import { Chess } from "chess.js";
import { lessonCatalog } from "./levelZeroLessons";

const levelOneKeys = ["7", "8", "9", "10", "11", "12"];

describe("Niveau 1 approfondi", () => {
  test("publie six leçons progressives avec théorie et positions", () => {
    expect(levelOneKeys.every((key) => Boolean(lessonCatalog[key]))).toBe(true);

    for (const key of levelOneKeys) {
      const lesson = lessonCatalog[key];
      expect(lesson.theorySections.length).toBeGreaterThan(0);
      expect(lesson.steps.length).toBeGreaterThanOrEqual(3);
      expect(lesson.title.fr.length).toBeGreaterThan(0);
      expect(lesson.title.en.length).toBeGreaterThan(0);
      expect(lesson.objective.fr.length).toBeGreaterThan(0);
      expect(lesson.objective.en.length).toBeGreaterThan(0);
    }
  });

  test("chaque position du Niveau 1 accepte le coup attendu et la réponse adverse", () => {
    for (const key of levelOneKeys) {
      const lesson = lessonCatalog[key];
      for (const step of lesson.steps) {
        const game = new Chess(step.positionFen ?? lesson.startingFen);
        const move = game.move({ from: step.from, to: step.to, promotion: "q" });
        expect(move.san, `${key}: ${step.from}-${step.to}`).toBeTruthy();
        expect(step.san.length).toBeGreaterThan(0);
        if (step.reply) expect(() => game.move(step.reply), `${key}: ${step.reply}`).not.toThrow();
      }
    }
  });

  test("le rituel de réflexion est explicitement présent dans la leçon dédiée", () => {
    const lesson = lessonCatalog["12"];
    const text = lesson.theorySections.map((section) => `${section.title.fr} ${section.text.fr} ${section.title.en} ${section.text.en}`).join(" ");
    expect(text).toMatch(/Que veut faire mon adversaire/i);
    expect(text).toMatch(/what does my opponent want/i);
    expect(text).toMatch(/permet/i);
    expect(text).toMatch(/allow/i);
  });
});
