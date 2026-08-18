export const lessonWorkspaceLayout = {
  mobile: {
    order: ["mission", "board", "feedback", "history"],
    missionClass: "lesson-mission order-1 sticky top-2 z-20 xl:order-2 xl:static xl:z-auto xl:col-start-2",
    boardClass: "lesson-board-card order-2 min-w-0 xl:order-1 xl:row-span-3",
    feedbackClass: "lesson-feedback order-3 min-w-0 xl:order-3 xl:col-start-2",
    historyClass: "lesson-history order-4 min-w-0 xl:order-4 xl:col-start-2",
  },
  desktop: {
    order: ["board", "mission", "feedback", "history"],
    missionClass: "lesson-mission order-1 sticky top-2 z-20 xl:order-2 xl:static xl:z-auto xl:col-start-2",
    boardClass: "lesson-board-card order-2 min-w-0 xl:order-1 xl:row-span-3",
    feedbackClass: "lesson-feedback order-3 min-w-0 xl:order-3 xl:col-start-2",
    historyClass: "lesson-history order-4 min-w-0 xl:order-4 xl:col-start-2",
  },
} as const;
