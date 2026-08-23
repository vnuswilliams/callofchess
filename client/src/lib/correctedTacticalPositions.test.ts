import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { lessonCatalog } from "./levelZeroLessons";

const expected = [
  ["13", "8/8/5k2/2r5/8/8/3N4/4K3 w - - 0 1", "d2", "e4", "Ne4+"],
  ["14", "q3k3/8/8/1N6/8/8/8/4K3 w - - 0 1", "b5", "c7", "Nc7+"],
  ["15", "4k3/4n3/8/8/8/8/8/4R1K1 w - - 0 1", "e1", "e7", "Rxe7+"],
  ["16", "8/7r/6k1/8/8/8/8/3QK3 w - - 0 1", "d1", "h5", "Qh5+"],
  ["17", "q6k/8/8/8/8/8/B7/R3K3 w - - 0 1", "a2", "b3", "Bb3"],
  ["18", "k7/8/8/8/8/8/B7/R3K3 w - - 0 1", "a2", "b3", "Bb3+"],
  ["19", "4k3/8/8/8/8/8/4B3/4R1K1 w - - 0 1", "e2", "b5", "Bb5+"],
  ["20", "4k3/3r4/8/8/8/8/3Q4/4K3 w - - 0 1", "d2", "d7", "Qxd7+"],
  ["21", "6k1/8/8/8/8/3Q4/8/4K3 w - - 0 1", "d3", "h7", "Qh7+"],
  ["22", "4k3/3r4/8/8/8/3Q4/8/4R2K w - - 0 1", "d3", "d7", "Qxd7+"],
  ["23", "4k3/8/8/8/8/3r4/2B5/4K3 w - - 0 1", "c2", "d3", "Bxd3"],
  ["24", "k7/8/8/8/8/8/2B5/R3K3 w - - 0 1", "c2", "a4", "Ba4"],
  ["25", "k7/8/8/r7/8/8/8/R3K3 w - - 0 1", "a1", "a5", "Rxa5+"],
  ["26", "6k1/8/8/8/8/3Q4/8/4K3 w - - 0 1", "d3", "h7", "Qh7+"],
  ["27", "6k1/3r4/8/8/8/3Q4/2B5/3R2K1 w - - 0 1", "d3", "h7", "Qh7+"],
  ["28", "6k1/3r4/8/8/8/3Q4/2B5/4K3 w - - 0 1", "d3", "h7", "Qh7+"],
] as const;

describe("Positions tactiques corrigées — niveau 2", () => {
  it("utilise les FEN et coups attendus validés pour chaque motif", () => {
    for (const [lessonKey, fen, from, to, san] of expected) {
      const step = lessonCatalog[lessonKey].steps[0];
      expect({ fen: step.positionFen, from: step.from, to: step.to, san: step.san }, lessonKey).toEqual({ fen, from, to, san });
      const game = new Chess(fen);
      const move = game.move({ from, to, promotion: "q" });
      expect(move.san, `${lessonKey}: ${from}-${to}`).toBe(san);
      expect(game.isCheck(), `${lessonKey}: expected check state`).toBe(san.includes("+") || san.includes("#"));
    }
  });

  it("ne contient aucune séquence illégale dans les 16 leçons de motifs", () => {
    for (const lessonKey of expected.map(([key]) => key)) {
      const lesson = lessonCatalog[lessonKey];
      for (const [index, step] of lesson.steps.entries()) {
        const game = new Chess(step.positionFen ?? lesson.startingFen);
        expect(() => game.move({ from: step.from, to: step.to, promotion: "q" }), `${lessonKey}/${index + 1}`).not.toThrow();
        if (step.reply) expect(() => game.move(step.reply), `${lessonKey}/${index + 1} reply`).not.toThrow();
      }
    }
  });
});
