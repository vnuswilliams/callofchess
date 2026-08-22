export const PUBLIC_LESSON_IDS = {
  board: "f3a1c235-5531-4c1c-845b-6d684808259b",
  pieces: "0ce3ec0e-348e-4300-b88a-c4a939cd8960",
  capture: "4f9942af-62e4-4754-9e1b-cdad46dfbe7d",
  special: "32ffa48c-fa82-5825-9d6c-7ffb79a60781",
  endings: "358114a7-8876-588e-bd0d-3fbcbfeecb14",
  complete: "bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4",
  center: "a116805b-1c51-4578-b66c-5c1d437c0cd6",
  development: "fbdc9b42-1e39-44fc-8f3c-d4910ec99fc6",
  safety: "d7b4c6a1-0cb9-4e92-8d7a-7e2f1b1b8e01",
  material: "e10f3b2a-6d35-4f9d-a5f8-62f69f7d9c12",
  threats: "f24a9d63-4c1e-4bf9-9a2e-3a2f6c8d5b40",
  opponent: "a5c7e2f1-8b39-4d64-9e10-5f6a7b2c3d48",
} as const;

export const PUBLIC_LESSON_ID_BY_KEY = {
  "1": PUBLIC_LESSON_IDS.board,
  "2": PUBLIC_LESSON_IDS.pieces,
  "3": PUBLIC_LESSON_IDS.capture,
  "4": PUBLIC_LESSON_IDS.special,
  "5": PUBLIC_LESSON_IDS.endings,
  "6": PUBLIC_LESSON_IDS.complete,
  "7": PUBLIC_LESSON_IDS.center,
  "8": PUBLIC_LESSON_IDS.development,
  "9": PUBLIC_LESSON_IDS.safety,
  "10": PUBLIC_LESSON_IDS.material,
  "11": PUBLIC_LESSON_IDS.threats,
  "12": PUBLIC_LESSON_IDS.opponent,
} as const;

export type PublicLessonKey = keyof typeof PUBLIC_LESSON_ID_BY_KEY;
export type PublicLessonId = (typeof PUBLIC_LESSON_ID_BY_KEY)[PublicLessonKey];

const LEGACY_LESSON_KEY_BY_ID: Record<string, PublicLessonKey> = {
  "c997761e-bf19-5bc6-b295-42505e6aa6e1": "1",
  "bca26f7f-0c27-551d-b173-28d9536cd91b": "2",
  "a7ee38d7-6164-5e62-9fad-18e39412e7cc": "3",
};

const PUBLIC_LESSON_KEY_BY_ID: Record<string, PublicLessonKey> = {
  ...Object.fromEntries(Object.entries(PUBLIC_LESSON_ID_BY_KEY).map(([key, id]) => [id, key as PublicLessonKey])),
  ...Object.fromEntries(Object.entries(LEGACY_LESSON_KEY_BY_ID).map(([id, key]) => [id, key])),
};

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

export const firstPublicLessonId = PUBLIC_LESSON_IDS.board;
