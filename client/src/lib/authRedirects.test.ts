import { describe, expect, it } from "vitest";
import { authRedirect, authRedirectOrigin } from "@/lib/authRedirects";

describe("authentication redirects", () => {
  it("uses the production Call of Chess origin by default", () => {
    expect(authRedirectOrigin).toBe("https://www.callofchess.online");
  });

  it("normalizes paths without exposing a local origin", () => {
    expect(authRedirect("/account")).toBe("https://www.callofchess.online/account");
    expect(authRedirect("account?reset=1")).toBe("https://www.callofchess.online/account?reset=1");
  });
});
