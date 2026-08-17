import { friendlyAuthError, genericAuthError } from "@/lib/authErrors";

describe("account authentication messages", () => {
  it("keeps generic errors provider-neutral in French and English", () => {
    expect(genericAuthError(true)).toContain("Vérifiez vos informations");
    expect(genericAuthError(false)).toContain("Check your details");
    expect(friendlyAuthError(new Error("unexpected provider failure"), true)).not.toContain("Supabase");
  });

  it("translates common registration and login errors", () => {
    expect(friendlyAuthError(new Error("User already registered"), true)).toContain("déjà utilisée");
    expect(friendlyAuthError(new Error("User already registered"), false)).toContain("already in use");
    expect(friendlyAuthError(new Error("Invalid login credentials"), true)).toContain("incorrect");
    expect(friendlyAuthError(new Error("Password is too weak"), false)).toContain("at least 8 characters");
    expect(friendlyAuthError(new Error("email rate limit exceeded"), true)).toContain("Trop de tentatives");
    expect(friendlyAuthError(new Error("over_email_send_rate_limit"), false)).toContain("Too many attempts");
  });
});

