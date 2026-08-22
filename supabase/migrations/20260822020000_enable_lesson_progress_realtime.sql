-- Allow authenticated clients to receive their own lesson_progress changes through Supabase Realtime.
-- RLS remains the privacy boundary; the client subscribes with a user_id filter.
do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'lesson_progress'
  ) then
    alter publication supabase_realtime add table public.lesson_progress;
  end if;
end
$$;
