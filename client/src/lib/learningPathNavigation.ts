export function getLevelLessonDestination(
  lessonIds: readonly (string | null | undefined)[],
  completedLessonIds: ReadonlySet<string>
): string | null {
  const playableLessonIds = lessonIds.filter((lessonId): lessonId is string =>
    Boolean(lessonId)
  );
  const nextLessonId = playableLessonIds.find(
    lessonId => !completedLessonIds.has(lessonId)
  );
  const destinationLessonId = nextLessonId ?? playableLessonIds.at(-1);

  return destinationLessonId ? `/lesson/${destinationLessonId}` : null;
}
