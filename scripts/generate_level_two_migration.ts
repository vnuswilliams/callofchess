import { levelTwoLessons } from "../client/src/lib/levelTwoLessons";
import { PUBLIC_LESSON_ID_BY_KEY } from "../client/src/lib/lessonIds";

const sql = (value: string) => `'${value.replaceAll("'", "''")}'`;
const json = (value: unknown) => `$$${JSON.stringify(value)}$$::jsonb`;
const lessonRows: string[] = [];
const exerciseRows: string[] = [];

for (const [key, lesson] of Object.entries(levelTwoLessons).sort(([a], [b]) => Number(a) - Number(b))) {
  const lessonId = PUBLIC_LESSON_ID_BY_KEY[key as keyof typeof PUBLIC_LESSON_ID_BY_KEY];
  const firstStep = lesson.steps[0];
  const steps = lesson.steps.map((step) => ({
    from: step.from,
    to: step.to,
    san: step.san,
    answer_fr: step.answer.fr,
    answer_en: step.answer.en,
    idea_fr: step.idea.fr,
    idea_en: step.idea.en,
  }));
  lessonRows.push(`(${sql(lessonId)}, (select id from level), ${Number(key) - 12}, ${sql(lesson.title.fr)}, ${sql(lesson.title.en)}, ${sql(lesson.kicker.fr)}, ${sql(lesson.kicker.en)}, ${sql(lesson.headline.fr)}, ${sql(lesson.headline.en)}, ${sql(lesson.objective.fr)}, ${sql(lesson.objective.en)}, ${sql(lesson.startingFen)}, ${json(steps)}, ${sql(lesson.solution.fr)}, ${sql(lesson.solution.en)}, true, now())`);
  const exerciseId = `d213${key.padStart(4, "0")}-2b00-4e00-9000-0000000000${key.padStart(2, "0")}`;
  exerciseRows.push(`(${sql(exerciseId)}, ${sql(lessonId)}, (select id from level), ${sql(Number(key) === 27 || Number(key) === 34 ? "calculation" : "puzzle")}, ${Number(key) - 12}, ${sql(lesson.title.fr)}, ${sql(lesson.title.en)}, ${sql(lesson.objective.fr)}, ${sql(lesson.objective.en)}, ${sql(lesson.reflection?.fr ?? lesson.objective.fr)}, ${sql(lesson.reflection?.en ?? lesson.objective.en)}, ${sql(lesson.solution.fr)}, ${sql(lesson.solution.en)}, ${sql(firstStep.positionFen ?? lesson.startingFen)}, ${sql(firstStep.san)})`);
}

const migration = `begin;

-- Niveau 2 approfondi : 22 leçons bilingues, chacune avec théorie et trois positions légales.
with level as (select id from public.learning_levels where slug = 'tactics' limit 1)
insert into public.lessons (
  id, level_id, sort_order, title_fr, title_en, kicker_fr, kicker_en,
  headline_fr, headline_en, objective_fr, objective_en, starting_fen,
  steps, solution_fr, solution_en, is_published, updated_at
)
values
${lessonRows.join(",\n")}
on conflict (id) do update set
  level_id = excluded.level_id,
  sort_order = excluded.sort_order,
  title_fr = excluded.title_fr,
  title_en = excluded.title_en,
  kicker_fr = excluded.kicker_fr,
  kicker_en = excluded.kicker_en,
  headline_fr = excluded.headline_fr,
  headline_en = excluded.headline_en,
  objective_fr = excluded.objective_fr,
  objective_en = excluded.objective_en,
  starting_fen = excluded.starting_fen,
  steps = excluded.steps,
  solution_fr = excluded.solution_fr,
  solution_en = excluded.solution_en,
  is_published = excluded.is_published,
  updated_at = now();

with level as (select id from public.learning_levels where slug = 'tactics' limit 1)
insert into public.lesson_exercises (
  id, lesson_id, level_id, kind, sort_order, title_fr, title_en, goal_fr, goal_en,
  prompt_fr, prompt_en, solution_fr, solution_en, position_fen, expected_san
)
values
${exerciseRows.join(",\n")}
on conflict (id) do update set
  lesson_id = excluded.lesson_id,
  level_id = excluded.level_id,
  kind = excluded.kind,
  sort_order = excluded.sort_order,
  title_fr = excluded.title_fr,
  title_en = excluded.title_en,
  goal_fr = excluded.goal_fr,
  goal_en = excluded.goal_en,
  prompt_fr = excluded.prompt_fr,
  prompt_en = excluded.prompt_en,
  solution_fr = excluded.solution_fr,
  solution_en = excluded.solution_en,
  position_fen = excluded.position_fen,
  expected_san = excluded.expected_san;

commit;
`;

process.stdout.write(migration);
