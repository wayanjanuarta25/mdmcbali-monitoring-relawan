create type public.user_role as enum (
  'SUPER_ADMIN',
  'ADMIN_WILAYAH',
  'ADMIN_DAERAH'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.user_role not null,
  province_id uuid,
  district_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_scope_check check (
    (role = 'SUPER_ADMIN' and province_id is null and district_id is null)
    or (role = 'ADMIN_WILAYAH' and province_id is not null and district_id is null)
    or (role = 'ADMIN_DAERAH' and province_id is not null and district_id is not null)
  )
);

comment on table public.profiles is
  'Application identity and authorization scope for each Supabase Auth user.';

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

-- Profile writes are intentionally unavailable to authenticated clients.
-- Account provisioning must use a trusted server-side administrative flow.
revoke insert, update, delete on table public.profiles from authenticated;
grant select on table public.profiles to authenticated;
