create schema if not exists private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Not signed in.' using errcode = '42501';
  end if;

  delete from auth.users where id = current_user_id;
end;
$$;

revoke execute on function private.delete_own_account() from public, anon;
grant execute on function private.delete_own_account() to authenticated;

create or replace function public.delete_own_account()
returns void
language sql
security invoker
set search_path = ''
as $$
  select private.delete_own_account();
$$;

revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
