-- ============================================================
-- 수동 적용용: Supabase 대시보드 SQL Editor에 붙여 넣어 실행하세요.
-- 오류 "could not find the 'home_gym_id' column of 'users'" 해결.
-- ============================================================

-- 1) users 테이블에 home_gym_id 컬럼 추가 (홈짐 선택 저장)
alter table public.users
add column if not exists home_gym_id uuid references public.gyms(id) on delete set null;

-- 2) users 테이블에 current_tier 컬럼 추가 (티어 배정 저장)
alter table public.users
add column if not exists current_tier int check (current_tier between 1 and 6);
