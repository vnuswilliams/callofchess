import { describe, expect, it } from "vitest";
import { authRedirect, authRedirectOrigin } from "@/lib/authRedirects";

describe("authentication redirects", () => {
  it("uses the production Call of Chess origin by default", () => {
    expect(authRedirectOrigin).toBe("https://callofchess.vercel.app");
  });

  it("normalizes paths without exposing a local origin", () => {
    expect(authRedirect("/account")).toBe("https://callofchess.vercel.app/account");
    expect(authRedirect("account?reset=1")).toBe("https://callofchess.vercel.app/account?reset=1");
  });
});
