import { describe, expect, it } from "vitest";
import { lessonWorkspaceLayout } from "./lessonLayout";

describe("lesson workspace responsive layout", () => {
  it("keeps the active mission before the board on mobile", () => {
    expect(lessonWorkspaceLayout.mobile.order).toEqual(["mission", "board", "feedback", "history"]);
    expect(lessonWorkspaceLayout.mobile.missionClass).toContain("sticky");
    expect(lessonWorkspaceLayout.mobile.missionClass).toContain("top-2");
  });

  it("keeps the board and lesson sidebar columns on desktop", () => {
    expect(lessonWorkspaceLayout.desktop.order).toEqual(["board", "mission", "feedback", "history"]);
    expect(lessonWorkspaceLayout.desktop.boardClass).toContain("xl:row-span-3");
    expect(lessonWorkspaceLayout.desktop.missionClass).toContain("xl:col-start-2");
  });
});
