import { describe, expect, it } from "vitest";
import { formatScore, parseInfo } from "./useStockfish";

describe("Stockfish UCI parsing", () => {
  it("formats centipawn scores as beginner-friendly pawns", () => {
    expect(formatScore(40, null)).toBe("+0.40");
    expect(formatScore(-125, null)).toBe("-1.25");
  });

  it("formats mate scores without exposing raw UCI syntax", () => {
    expect(formatScore(null, 3)).toBe("Mat en 3");
  });

  it("extracts depth, score and principal variation from info lines", () => {
    const parsed = parseInfo(
      "info depth 12 seldepth 18 score cp 40 nodes 123 pv e2e4 e7e5 g1f3",
      {
        depth: 0,
        scoreCp: null,
        mate: null,
        scoreLabel: "—",
        bestMove: null,
        principalVariation: [],
      },
    );

    expect(parsed).toMatchObject({
      depth: 12,
      scoreCp: 40,
      mate: null,
      scoreLabel: "+0.40",
      principalVariation: ["e2e4", "e7e5", "g1f3"],
    });
  });
});
