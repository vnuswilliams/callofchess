import { describe, expect, it } from "vitest";
import frSettings from "@/locales/fr/settings.json";
import enSettings from "@/locales/en/settings.json";

describe("account menu translations", () => {
  it("contains the complete French action set", () => {
    expect(frSettings.accountMenu).toBe("Mon compte");
    expect(frSettings.signOut).toBe("Se déconnecter");
    expect(frSettings.deleteAccount).toBe("Supprimer mon compte");
    expect(frSettings.confirmDeleteAccount).toBeTruthy();
  });

  it("contains the complete English action set", () => {
    expect(enSettings.accountMenu).toBe("My account");
    expect(enSettings.signOut).toBe("Sign out");
    expect(enSettings.deleteAccount).toBe("Delete my account");
    expect(enSettings.confirmDeleteAccount).toBeTruthy();
  });
});
