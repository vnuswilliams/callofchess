import { describe, expect, it } from "vitest";
import { classifyMistake, enrichMistakeWithEngine } from "./pedagogicalFeedback";

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
