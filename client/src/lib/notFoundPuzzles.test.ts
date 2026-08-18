import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { getNotFoundPuzzlePosition, NOT_FOUND_PUZZLES, selectNotFoundPuzzle } from "./notFoundPuzzles";

describe("404 mate-in-one puzzles", () => {
  it("contains distinct validated checkmate positions", () => {
    expect(NOT_FOUND_PUZZLES.length).toBeGreaterThanOrEqual(4);
    expect(new Set(NOT_FOUND_PUZZLES.map((puzzle) => puzzle.id)).size).toBe(NOT_FOUND_PUZZLES.length);

    for (const puzzle of NOT_FOUND_PUZZLES) {
      const game = new Chess(puzzle.fen);
      expect(game.isCheck()).toBe(false);
      game.move({ from: puzzle.from, to: puzzle.to });
      expect(game.isCheckmate()).toBe(true);
      expect(getNotFoundPuzzlePosition(puzzle, true)).toMatch(/^[rnbqkpRNBQKP1-8/]+ [wb] /);
    }
  });

  it("does not repeat the previous puzzle when another choice exists", () => {
    const selected = selectNotFoundPuzzle(NOT_FOUND_PUZZLES[0].id, () => 0);
    expect(selected.id).not.toBe(NOT_FOUND_PUZZLES[0].id);
  });
});
