-- Public leaderboard is opt-in. No email, auth id or private lesson rows are exposed.
create table if not exists public.leaderboard_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 24),
  public_opt_in boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.leaderboard_profiles enable row level security;

drop policy if exists "Users can read their leaderboard profile" on public.leaderboard_profiles;
create policy "Users can read their leaderboard profile"
  on public.leaderboard_profiles for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their leaderboard profile" on public.leaderboard_profiles;
create policy "Users can insert their leaderboard profile"
  on public.leaderboard_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their leaderboard profile" on public.leaderboard_profiles;
create policy "Users can update their leaderboard profile"
  on public.leaderboard_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.get_public_leaderboard(p_limit integer default 50)
returns table (
  display_name text,
  completed_lessons bigint,
  total_steps bigint,
  score integer,
  rank bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with eligible as (
    select
      lp.user_id,
      lp.display_name,
      count(distinct progress.lesson_id) filter (where progress.completed) as completed_lessons,
      coalesce(sum(progress.completed_steps), 0)::bigint as total_steps
    from public.leaderboard_profiles lp
    left join public.lesson_progress progress on progress.user_id = lp.user_id
    where lp.public_opt_in = true
      and lp.display_name <> ''
    group by lp.user_id, lp.display_name
  ), ranked as (
    select
      display_name,
      completed_lessons,
      total_steps,
      least(1000, (completed_lessons * 250 + total_steps * 10))::integer as score,
      row_number() over (
        order by completed_lessons desc, total_steps desc, display_name asc
      ) as rank
    from eligible
  )
  select display_name, completed_lessons, total_steps, score, rank
  from ranked
  order by rank
  limit greatest(1, least(coalesce(p_limit, 50), 100));
$$;

grant execute on function public.get_public_leaderboard(integer) to anon, authenticated;
