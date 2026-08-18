-- Convert curriculum identifiers to UUIDs without changing lesson content.
-- This migration is intentionally append-only and keeps deterministic mappings
-- for the three legacy lesson routes used by the first released client.

begin;

create temporary table _learning_level_id_map (
  old_id integer primary key,
  new_id uuid not null unique default extensions.uuid_generate_v4()
) on commit drop;
insert into _learning_level_id_map (old_id)
select id from public.learning_levels;

create temporary table _lesson_id_map (
  old_id text primary key,
  new_id uuid not null unique default extensions.uuid_generate_v4()
) on commit drop;
insert into _lesson_id_map (old_id)
select id from public.lessons;

create temporary table _lesson_exercise_id_map (
  old_id text primary key,
  new_id uuid not null unique default extensions.uuid_generate_v4()
) on commit drop;
insert into _lesson_exercise_id_map (old_id)
select id from public.lesson_exercises;

alter table public.learning_levels
  add column id_uuid uuid,
  add column prerequisite_id_uuid uuid;
update public.learning_levels level
set id_uuid = (select level_map.new_id from _learning_level_id_map level_map where level_map.old_id = level.id),
    prerequisite_id_uuid = (select prerequisite_map.new_id from _learning_level_id_map prerequisite_map where prerequisite_map.old_id = level.prerequisite_id);

alter table public.lessons
  add column id_uuid uuid,
  add column level_id_uuid uuid;
update public.lessons lesson
set id_uuid = (select lesson_map.new_id from _lesson_id_map lesson_map where lesson_map.old_id = lesson.id),
    level_id_uuid = (select level_map.new_id from _learning_level_id_map level_map where level_map.old_id = lesson.level_id);

alter table public.lesson_exercises
  add column id_uuid uuid,
  add column lesson_id_uuid uuid,
  add column level_id_uuid uuid;
update public.lesson_exercises exercise
set id_uuid = (select exercise_map.new_id from _lesson_exercise_id_map exercise_map where exercise_map.old_id = exercise.id),
    lesson_id_uuid = (select lesson_map.new_id from _lesson_id_map lesson_map where lesson_map.old_id = exercise.lesson_id),
    level_id_uuid = (select level_map.new_id from _learning_level_id_map level_map where level_map.old_id = exercise.level_id);

alter table public.lesson_progress add column lesson_id_uuid uuid;
update public.lesson_progress
set lesson_id_uuid = case lesson_id
  when '1' then 'c997761e-bf19-5bc6-b295-42505e6aa6e1'::uuid
  when '2' then 'bca26f7f-0c27-551d-b173-28d9536cd91b'::uuid
  when '3' then 'a7ee38d7-6164-5e62-9fad-18e39412e7cc'::uuid
end
where lesson_id in ('1', '2', '3');
update public.lesson_progress progress
set lesson_id_uuid = lesson_map.new_id
from _lesson_id_map lesson_map
where lesson_map.old_id = progress.lesson_id
  and progress.lesson_id not in ('1', '2', '3');

-- Abort before changing keys if any relation could not be mapped.
do $$
begin
  if exists (select 1 from public.learning_levels where id_uuid is null) then
    raise exception 'learning_levels UUID mapping is incomplete';
  end if;
  if exists (select 1 from public.lessons where id_uuid is null or level_id is not null and level_id_uuid is null) then
    raise exception 'lessons UUID mapping is incomplete';
  end if;
  if exists (select 1 from public.lesson_exercises where id_uuid is null or lesson_id is not null and lesson_id_uuid is null or level_id is not null and level_id_uuid is null) then
    raise exception 'lesson_exercises UUID mapping is incomplete';
  end if;
  if exists (select 1 from public.lesson_progress where lesson_id_uuid is null) then
    raise exception 'lesson_progress UUID mapping is incomplete';
  end if;
end $$;

alter table public.lesson_exercises drop constraint if exists lesson_exercises_lesson_id_fkey;
alter table public.lesson_exercises drop constraint if exists lesson_exercises_level_id_fkey;
alter table public.lessons drop constraint if exists lessons_level_id_fkey;
alter table public.learning_levels drop constraint if exists learning_levels_prerequisite_id_fkey;

alter table public.lesson_progress drop constraint if exists lesson_progress_pkey;
alter table public.lesson_exercises drop constraint if exists lesson_exercises_pkey;
alter table public.lessons drop constraint if exists lessons_pkey;
alter table public.learning_levels drop constraint if exists learning_levels_pkey;

alter table public.learning_levels
  drop column prerequisite_id,
  drop column id;
alter table public.learning_levels rename column prerequisite_id_uuid to prerequisite_id;
alter table public.learning_levels rename column id_uuid to id;

alter table public.lessons
  drop column level_id,
  drop column id;
alter table public.lessons rename column level_id_uuid to level_id;
alter table public.lessons rename column id_uuid to id;

alter table public.lesson_exercises
  drop column lesson_id,
  drop column level_id,
  drop column id;
alter table public.lesson_exercises rename column lesson_id_uuid to lesson_id;
alter table public.lesson_exercises rename column level_id_uuid to level_id;
alter table public.lesson_exercises rename column id_uuid to id;

alter table public.lesson_progress
  drop column lesson_id;
alter table public.lesson_progress
  rename column lesson_id_uuid to lesson_id;

alter table public.learning_levels
  alter column id set default extensions.uuid_generate_v4();
alter table public.lessons
  alter column id set default extensions.uuid_generate_v4();
alter table public.lesson_exercises
  alter column id set default extensions.uuid_generate_v4();

alter table public.learning_levels add primary key (id);
alter table public.lessons add primary key (id);
alter table public.lesson_exercises add primary key (id);
alter table public.lesson_progress add primary key (user_id, lesson_id);

alter table public.learning_levels
  add constraint learning_levels_prerequisite_id_fkey
  foreign key (prerequisite_id) references public.learning_levels(id);
alter table public.lessons
  add constraint lessons_level_id_fkey
  foreign key (level_id) references public.learning_levels(id);
alter table public.lesson_exercises
  add constraint lesson_exercises_lesson_id_fkey
  foreign key (lesson_id) references public.lessons(id),
  add constraint lesson_exercises_level_id_fkey
  foreign key (level_id) references public.learning_levels(id);

create index if not exists lessons_level_id_idx on public.lessons(level_id);
create index if not exists lesson_exercises_lesson_id_idx on public.lesson_exercises(lesson_id);
create index if not exists lesson_exercises_level_id_idx on public.lesson_exercises(level_id);
create index if not exists lesson_progress_lesson_id_idx on public.lesson_progress(lesson_id);

commit;
