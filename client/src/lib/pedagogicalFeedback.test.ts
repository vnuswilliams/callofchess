import { describe, expect, it } from "vitest";
import { classifyMistake, enrichMistakeWithEngine, formatEngineMove, formatPrincipalVariation, formatUciAsSan } from "./pedagogicalFeedback";

describe("pedagogical feedback", () => {
  it("explains why e3 is less ambitious than e4 for the center lesson", () => {
    const feedback = classifyMistake({
      attemptedFrom: "e2",
      attemptedTo: "e3",
      expectedFrom: "e2",
      expectedTo: "e4",
      stepIndex: 0,
      attemptNumber: 1,
    });

    expect(feedback.category).toBe("centre");
    expect(feedback.title).toContain("centre");
    expect(feedback.explanation).toContain("e4");
    expect(feedback.recommendation).toContain("case centrale");
  });

  it("uses the engine best move to enrich the coaching signal", () => {
    const mistake = classifyMistake({ attemptedFrom: "e2", attemptedTo: "e3", expectedFrom: "e2", expectedTo: "e4", stepIndex: 0, attemptNumber: 1 });
    const enriched = enrichMistakeWithEngine(mistake, "e2e4");

    expect(enriched.engineBestMove).toBe("e2e4");
    expect(enriched.engineGap).toContain("confirme");
    expect(enriched.bestMoveWhy).toContain("occupe davantage le centre");
    expect(enriched.bestMoveWhy).toContain("e2–e3");
    expect(enriched.lessonTakeaway).toContain("gagne de l’espace");
    expect(formatEngineMove("e2e4")).toBe("e2–e4");
  });

  it("explains why the engine prefers active knight development", () => {
    const mistake = classifyMistake({ attemptedFrom: "g1", attemptedTo: "h3", expectedFrom: "g1", expectedTo: "f3", stepIndex: 1, attemptNumber: 1 });
    const enriched = enrichMistakeWithEngine(mistake, "g1f3");

    expect(enriched.bestMoveWhy).toContain("case active");
    expect(enriched.lessonTakeaway).toContain("centre");
  });

  it("formats engine coordinates as readable SAN", () => {
    const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(formatUciAsSan(start, "e2e4")).toBe("e4");
    expect(formatPrincipalVariation(start, ["e2e4", "e7e5", "g1f3"])).toEqual(["e4", "e5", "Nf3"]);
  });

  it("writes the center diagnostic in English when requested", () => {
    const feedback = classifyMistake({ attemptedFrom: "e2", attemptedTo: "e3", expectedFrom: "e2", expectedTo: "e4", stepIndex: 0, attemptNumber: 1, language: "en" });
    expect(feedback.title).toBe("The center needs more space");
    expect(feedback.explanation).toContain("controls more central squares");
  });

  it("personalizes a knight development error", () => {
    const feedback = classifyMistake({
      attemptedFrom: "g1",
      attemptedTo: "h3",
      expectedFrom: "g1",
      expectedTo: "f3",
      stepIndex: 1,
      attemptNumber: 2,
    });

    expect(feedback.category).toBe("developpement");
    expect(feedback.explanation).toContain("bord");
    expect(feedback.focus).toBe("Développement des pièces");
    expect(feedback.attemptNumber).toBe(2);
  });
});
