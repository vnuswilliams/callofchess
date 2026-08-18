import { describe, expect, it } from "vitest";
import frSettings from "@/locales/fr/settings.json";
import enSettings from "@/locales/en/settings.json";

describe("account settings translations", () => {
  it("contains the French account and danger-zone labels", () => {
    expect(frSettings.accountMenu).toBe("Mon compte");
    expect(frSettings.signOut).toBe("Se déconnecter");
    expect(frSettings.dangerZone).toBe("Zone de danger");
    expect(frSettings.deleteAccount).toBe("Supprimer mon compte");
    expect(frSettings.confirmDeleteAccount).toBeTruthy();
  });

  it("contains the English account and danger-zone labels", () => {
    expect(enSettings.accountMenu).toBe("My account");
    expect(enSettings.signOut).toBe("Sign out");
    expect(enSettings.dangerZone).toBe("Danger zone");
    expect(enSettings.deleteAccount).toBe("Delete my account");
    expect(enSettings.confirmDeleteAccount).toBeTruthy();
  });
});
