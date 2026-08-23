import { describe, expect, test } from "vitest";
import { Chess } from "chess.js";
import { lessonCatalog } from "./levelZeroLessons";
import { learningPath } from "./learningPath";
import { playableLessonIdForExercise } from "./learningPathCompletion";
import { PUBLIC_LESSON_ID_BY_KEY } from "./lessonIds";

const levelTwoKeys = Array.from({ length: 22 }, (_, index) => String(index + 13));
const motifTerms = [
  "Attaque double",
  "Fourchette",
  "Clouage",
  "Enfilade",
  "Attaque à la découverte",
  "Échec à la découverte",
  "Échec double",
  "Déviation",
  "Attraction",
  "Surcharge",
  "Élimination du défenseur",
  "Interférence",
  "Rayon X",
  "Sacrifice",
  "Zwischenzug",
  "Défense par contre-attaque",
  "Menace directe",
  "Menace double",
  "Menace de mat",
  "Menace positionnelle",
  "Menace tactique",
  "Menace latente",
];

describe("Niveau 2 — La vision tactique", () => {
  test("publie une leçon approfondie pour chaque motif et type de menace", () => {
    expect(levelTwoKeys.every((key) => Boolean(lessonCatalog[key]))).toBe(true);

    for (const key of levelTwoKeys) {
      const lesson = lessonCatalog[key];
      expect(lesson.theorySections.length, key).toBeGreaterThanOrEqual(4);
      expect(lesson.steps.length, key).toBeGreaterThanOrEqual(3);
      expect(lesson.title.fr.length, key).toBeGreaterThan(0);
      expect(lesson.title.en.length, key).toBeGreaterThan(0);
      expect(lesson.objective.fr.length, key).toBeGreaterThan(0);
      expect(lesson.objective.en.length, key).toBeGreaterThan(0);
      expect(lesson.solution.fr.length, key).toBeGreaterThan(0);
      expect(lesson.solution.en.length, key).toBeGreaterThan(0);
    }
  });

  test("explique explicitement les 16 motifs et les 6 types de menace", () => {
    const text = levelTwoKeys
      .map((key) => {
        const lesson = lessonCatalog[key];
        return [lesson.title.fr, lesson.title.en, ...lesson.theorySections.flatMap((section) => [section.title.fr, section.text.fr, section.title.en, section.text.en])].join(" ");
      })
      .join(" ");

    const normalizedText = text.replace(/\b(?:L’|Le |La |Les )/g, "").toLocaleLowerCase();
    for (const term of motifTerms) expect(normalizedText).toContain(term.toLocaleLowerCase());
    expect(text).toMatch(/Double attack|Fork|Pin|Skewer|Discovered attack|Discovered check|Double check|Deflection|Decoy|Overload|Remove the defender|Interference|X-ray|Sacrifice|Zwischenzug|Counterattack defense|Direct threat|Double threat|Mating threat|Positional threat|Tactical threat|Latent threat/);
  });

  test("chaque exercice du niveau 2 accepte le coup attendu et la réponse adverse", () => {
    for (const key of levelTwoKeys) {
      const lesson = lessonCatalog[key];
      for (const step of lesson.steps) {
        const game = new Chess(step.positionFen ?? lesson.startingFen);
        const move = game.move({ from: step.from, to: step.to, promotion: "q" });
        expect(move.san, `${key}: ${step.from}-${step.to}`).toBeTruthy();
        expect(step.san.length, key).toBeGreaterThan(0);
        if (step.reply) expect(() => game.move(step.reply), `${key}: ${step.reply}`).not.toThrow();
      }
    }
  });

  test("relie les 22 entrées du parcours aux leçons publiques et augmente le niveau estimé", () => {
    const level = learningPath.find((item) => item.id === 2);
    expect(level?.estimatedLessons).toBe(22);
    expect(level?.exercises).toHaveLength(22);
    expect(level?.exercises.every((exercise) => Boolean(playableLessonIdForExercise[exercise.id]))).toBe(true);
    expect(levelTwoKeys.every((key) => Boolean(PUBLIC_LESSON_ID_BY_KEY[key as keyof typeof PUBLIC_LESSON_ID_BY_KEY]))).toBe(true);
  });
});
