-- ==========================================
-- GripLab 스키마 검증용 헬퍼 함수
-- ==========================================
-- check-db API 및 scripts/check-db.ts에서 트리거·RLS 상태 확인 시 사용.
-- @see docs/db-migration.md, plan 1.1 Step 3
-- ==========================================

create or replace function public.get_griplab_schema_checks()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  trigger_ok boolean;
  rls_result jsonb;
begin
  -- on_auth_user_created 트리거 존재 여부 (auth.users)
  select exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where t.tgname = 'on_auth_user_created'
      and n.nspname = 'auth'
      and c.relname = 'users'
  ) into trigger_ok;

  -- GripLab 5개 테이블 RLS 활성화 여부
  select jsonb_object_agg(relname, relrowsecurity)
  into rls_result
  from pg_class
  where relnamespace = (select oid from pg_namespace where nspname = 'public')
    and relname in (
      'profiles', 'gyms', 'gym_grade_scales', 'routines', 'training_logs'
    );

  return jsonb_build_object(
    'trigger_on_auth_user_created', coalesce(trigger_ok, false),
    'rls', coalesce(rls_result, '{}'::jsonb)
  );
end;
$$;

comment on function public.get_griplab_schema_checks() is
  'GripLab 스키마 검증: on_auth_user_created 트리거 및 5개 테이블 RLS 상태를 반환합니다.';
