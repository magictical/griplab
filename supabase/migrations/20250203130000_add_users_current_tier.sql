-- Clerk 동기화용 users 테이블에 티어 컬럼 추가 (ON-03 티어 배정 저장용)
-- current_tier: 1~6 (Silver ~ Grandmaster)
alter table public.users
add column if not exists current_tier int check (current_tier between 1 and 6);
