import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { chooseBeginnerMove, describeGameResult } from "./beginnerComputer";

describe("beginner computer", () => {
  it("returns a legal black move from the current position", () => {
    const game = new Chess();
    game.move("e4");
    const move = chooseBeginnerMove(game);
    expect(move).toBeTruthy();
    expect(game.moves({ verbose: true }).some((candidate) => candidate.from === move?.from && candidate.to === move?.to)).toBe(true);
  });

  it("prefers a simple capture when one is available", () => {
    const game = new Chess("7k/8/8/8/8/8/4p3/3QK3 b - - 0 1");
    const move = chooseBeginnerMove(game);
    expect(move?.from).toBe("e2");
    expect(move?.to).toBe("d1");
  });

  it("describes checkmate, stalemate and an unfinished game without inventing a result", () => {
    expect(describeGameResult(new Chess("7k/6Q1/6K1/8/8/8/8/8 b - - 0 1"))).toBe("checkmate");
    expect(describeGameResult(new Chess("7k/5Q2/5K2/8/8/8/8/8 b - - 0 1"))).toBe("stalemate");
    expect(describeGameResult(new Chess())).toBe("playing");
  });
});
