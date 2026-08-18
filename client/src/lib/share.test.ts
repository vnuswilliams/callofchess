import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText, shareOrCopy } from "./share";

const originalNavigator = globalThis.navigator;
const originalDocument = globalThis.document;

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: originalNavigator,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: originalDocument,
  });
});

describe("shareOrCopy", () => {
  it("uses native sharing when the browser confirms it can share", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        share,
        canShare: vi.fn().mockReturnValue(true),
        clipboard: { writeText: vi.fn() },
      },
    });

    await expect(
      shareOrCopy({
        title: "Badge",
        text: "Bravo",
        url: "https://callofchess.online/profile?badge=first-step",
      })
    ).resolves.toBe("shared");
    expect(share).toHaveBeenCalledOnce();
  });

  it("copies the public link when native sharing is exposed but unavailable", async () => {
    const share = vi.fn().mockRejectedValue(new Error("No share target"));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        share,
        canShare: vi.fn().mockReturnValue(true),
        clipboard: { writeText },
      },
    });

    await expect(
      shareOrCopy({
        title: "Badge",
        text: "Bravo",
        url: "https://callofchess.online/profile?badge=first-step",
      })
    ).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith(
      "https://callofchess.online/profile?badge=first-step"
    );
  });

  it("falls back to the textarea when clipboard permissions fail", async () => {
    const area = {
      value: "",
      setAttribute: vi.fn(),
      select: vi.fn(),
      remove: vi.fn(),
      style: {},
    };
    const appendChild = vi.fn();
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error("Permission denied")),
        },
      },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        body: { appendChild },
        createElement: vi.fn().mockReturnValue(area),
        execCommand,
      },
    });

    await expect(
      copyText("https://callofchess.online/profile")
    ).resolves.toBeUndefined();
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(area.remove).toHaveBeenCalledOnce();
  });
});
