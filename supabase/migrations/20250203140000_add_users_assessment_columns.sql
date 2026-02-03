-- Clerk 동기화용 users 테이블에 수행 능력 측정(Assessment) 컬럼 추가 (ON-04)
-- weight_kg: 체중(kg), 추정 또는 추후 설정용
-- max_hang_1rm: Max Hang 1RM (kg)
-- no_hang_lift_1rm: No Hang Lift 1RM (kg)
alter table public.users
add column if not exists weight_kg float,
add column if not exists max_hang_1rm float,
add column if not exists no_hang_lift_1rm float;
