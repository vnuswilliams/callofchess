-- Fix the event-trigger loop variable name; keep the original migration immutable.

begin;

create or replace function public.enforce_public_uuid_primary_key()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  command_row record;
  primary_key_name text;
  table_identity text;
begin
  for command_row in
    select ddl_command.*
    from pg_event_trigger_ddl_commands() as ddl_command
    where ddl_command.schema_name = 'public'
      and ddl_command.object_type = 'table'
  loop
    if command_row.objid is null
       or not exists (
         select 1
         from pg_class table_record
         join pg_namespace schema_record on schema_record.oid = table_record.relnamespace
         where table_record.oid = command_row.objid
           and schema_record.nspname = 'public'
           and table_record.relkind in ('r', 'p')
       ) then
      continue;
    end if;

    select constraint_record.conname
      into primary_key_name
    from pg_constraint constraint_record
    where constraint_record.conrelid = command_row.objid
      and constraint_record.contype = 'p'
    limit 1;

    select format('%I.%I', schema_record.nspname, table_record.relname)
      into table_identity
    from pg_class table_record
    join pg_namespace schema_record on schema_record.oid = table_record.relnamespace
    where table_record.oid = command_row.objid;

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
      where constraint_record.conrelid = command_row.objid
        and constraint_record.contype = 'p'
        and attribute_record.atttypid <> 'uuid'::regtype
    ) then
      raise exception 'Table % must use UUID for every primary-key column', table_identity
        using errcode = 'datatype_mismatch';
    end if;
  end loop;
end;
$$;

commit;
