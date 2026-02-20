-- ============================================================
-- 수동 적용용: Supabase 대시보드 SQL Editor에 붙여 넣어 실행하세요.
-- 오류 "insert or update on table routines violates foreign key constraint routines_user_id_fkey" 해결
-- 원인: routines와 training_logs 컬럼이 public.profiles 기반으로 생성되었으나, 실제 앱은 Clerk 연동으로 public.users 기준(UUID가 다름)으로 동작하기 때문에 발생하는 외래키 에러
-- ============================================================

-- 1) routines 테이블의 외래키 제약조건 변경 (profiles -> users)
ALTER TABLE public.routines DROP CONSTRAINT IF EXISTS routines_user_id_fkey;
ALTER TABLE public.routines
  ADD CONSTRAINT routines_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 2) training_logs 테이블의 외래키 제약조건 변경 (profiles -> users)
ALTER TABLE public.training_logs DROP CONSTRAINT IF EXISTS training_logs_user_id_fkey;
ALTER TABLE public.training_logs
  ADD CONSTRAINT training_logs_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
