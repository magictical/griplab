-- Clerk 동기화용 users 테이블에 홈짐 FK 추가 (ON-01 홈짐 선택 저장용)
-- users 테이블은 별도로 생성되어 있다고 가정 (Clerk 웹훅 동기화)
alter table public.users
add column if not exists home_gym_id uuid references public.gyms(id) on delete set null;
