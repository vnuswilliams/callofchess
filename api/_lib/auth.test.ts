import { describe, expect, it } from "vitest";
import { normalizeEmail, validPassword } from "./auth";

describe("account validation", () => {
  it("normalizes email addresses consistently", () => {
    expect(normalizeEmail("  Player@Example.COM ")).toBe("player@example.com");
  });

  it("requires a usable password length", () => {
    expect(validPassword("short")).toBe(false);
    expect(validPassword("chess-learner-2026")).toBe(true);
    expect(validPassword("x".repeat(201))).toBe(false);
  });
});
