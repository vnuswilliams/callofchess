export const PUBLIC_LESSON_IDS = {
  first: "c997761e-bf19-5bc6-b295-42505e6aa6e1",
  second: "bca26f7f-0c27-551d-b173-28d9536cd91b",
  third: "a7ee38d7-6164-5e62-9fad-18e39412e7cc",
} as const;

export const PUBLIC_LESSON_ID_BY_KEY = {
  "1": PUBLIC_LESSON_IDS.first,
  "2": PUBLIC_LESSON_IDS.second,
  "3": PUBLIC_LESSON_IDS.third,
} as const;

export type PublicLessonKey = keyof typeof PUBLIC_LESSON_ID_BY_KEY;
export type PublicLessonId = (typeof PUBLIC_LESSON_ID_BY_KEY)[PublicLessonKey];

const PUBLIC_LESSON_KEY_BY_ID: Record<string, PublicLessonKey> = Object.fromEntries(
  Object.entries(PUBLIC_LESSON_ID_BY_KEY).map(([key, id]) => [id, key as PublicLessonKey]),
) as Record<string, PublicLessonKey>;

export function toPublicLessonId(value: string | undefined): PublicLessonId | null {
  if (!value) return null;
  if (value in PUBLIC_LESSON_ID_BY_KEY) return PUBLIC_LESSON_ID_BY_KEY[value as PublicLessonKey];
  const key = PUBLIC_LESSON_KEY_BY_ID[value];
  return key ? PUBLIC_LESSON_ID_BY_KEY[key] : null;
}

export function toLessonKey(value: string | undefined): PublicLessonKey | null {
  if (!value) return null;
  if (value in PUBLIC_LESSON_ID_BY_KEY) return value as PublicLessonKey;
  return PUBLIC_LESSON_KEY_BY_ID[value] ?? null;
}

export const firstPublicLessonId = PUBLIC_LESSON_IDS.first;
