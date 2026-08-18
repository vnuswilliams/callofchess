-- Enforce UUID primary keys for every future table in the public schema.
-- Supabase supports event triggers for DDL governance; this guard runs after
-- CREATE TABLE / CREATE TABLE AS / ALTER TABLE and rolls back invalid DDL.

begin;

create or replace function public.enforce_public_uuid_primary_key()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  command_record record;
  primary_key_name text;
  table_identity text;
begin
  for command_record in
    select command_record.*
    from pg_event_trigger_ddl_commands() as command_record
    where command_record.schema_name = 'public'
      and command_record.object_type = 'table'
  loop
    if command_record.objid is null
       or not exists (
         select 1
         from pg_class table_record
         join pg_namespace schema_record on schema_record.oid = table_record.relnamespace
         where table_record.oid = command_record.objid
           and schema_record.nspname = 'public'
           and table_record.relkind in ('r', 'p')
       ) then
      continue;
    end if;

    select constraint_record.conname
      into primary_key_name
    from pg_constraint constraint_record
    where constraint_record.conrelid = command_record.objid
      and constraint_record.contype = 'p'
    limit 1;

    select format('%I.%I', schema_record.nspname, table_record.relname)
      into table_identity
    from pg_class table_record
    join pg_namespace schema_record on schema_record.oid = table_record.relnamespace
    where table_record.oid = command_record.objid;

    if primary_key_name is null then
      raise exception 'Table % must define a UUID primary key', table_identity
        using errcode = 'check_violation';
    end if;

    if exists (
      select 1
      from pg_constraint constraint_record
      cross join lateral unnest(constraint_record.conkey) as key_record(attnum)
      join pg_attribute attribute_record
        on attribute_record.attrelid = constraint_record.conrelid
       and attribute_record.attnum = key_record.attnum
      where constraint_record.conrelid = command_record.objid
        and constraint_record.contype = 'p'
        and attribute_record.atttypid <> 'uuid'::regtype
    ) then
      raise exception 'Table % must use UUID for every primary-key column', table_identity
        using errcode = 'datatype_mismatch';
    end if;
  end loop;
end;
$$;

revoke all on function public.enforce_public_uuid_primary_key() from public;

drop event trigger if exists enforce_public_uuid_primary_keys;
create event trigger enforce_public_uuid_primary_keys
on ddl_command_end
when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'ALTER TABLE')
execute function public.enforce_public_uuid_primary_key();

comment on function public.enforce_public_uuid_primary_key() is
  'Rejects public tables whose primary key is missing or contains a non-UUID column.';
comment on event trigger enforce_public_uuid_primary_keys is
  'Requires UUID primary keys for all tables created or altered in public.';

commit;
