begin;

-- Retire uniquement les trois anciennes entrées provisoires du niveau tactics.
-- Les 22 leçons approfondies publiées par la migration précédente restent intactes.
delete from public.lesson_exercises
where lesson_id in (
  '83b7b6a0-62df-4e1a-8d2a-1df994de4242',
  'd4f3f916-b997-497f-aedb-fdf2cc013d7f',
  'a1d0e134-761e-42dd-b4c2-887682a72d83'
);

delete from public.lessons
where id in (
  '83b7b6a0-62df-4e1a-8d2a-1df994de4242',
  'd4f3f916-b997-497f-aedb-fdf2cc013d7f',
  'a1d0e134-761e-42dd-b4c2-887682a72d83'
);

commit;
