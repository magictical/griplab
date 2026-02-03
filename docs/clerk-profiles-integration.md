# Clerk와 profiles 연동 방안

> 인증은 Clerk만 사용하고, GripLab 스키마의 `profiles` 테이블을 사용할 때의 연동 옵션 정리.

## 배경

- [setup_schema.sql](../supabase/migrations/setup_schema.sql)의 `profiles`는 `auth.users.id`를 PK로 참조하고, `handle_new_user` 트리거는 **Supabase Auth**에서 회원가입 시에만 `public.profiles`에 행을 삽입합니다.
- 현재 프로젝트는 **Clerk**으로만 인증하며, Clerk 웹훅으로 `users` 테이블(clerk_id, name)에 동기화하고 있습니다.
- 따라서 Clerk 가입/로그인만으로는 `profiles` 행이 생성되지 않습니다. 별도 연동 전략이 필요합니다.

---

## 옵션 A: Clerk 웹훅에서 profiles만 사용

**요약**: 웹훅에서 `users` 대신 `profiles`에 upsert하고, `profiles.id`를 Clerk user id와 매핑하는 방식.

- [app/api/webhooks/clerk/route.ts](../app/api/webhooks/clerk/route.ts)에서 `users` 대신 `profiles`에 upsert.
- `profiles.id`는 Supabase Auth가 아니므로:
  - UUID를 직접 생성하거나,
  - `profiles`에 `clerk_id`(TEXT UNIQUE) 컬럼을 추가하고, `id`는 UUID 기본값으로 두는 방식이 필요합니다.
- RLS는 `auth.uid()` 기준이므로, **Clerk JWT를 Supabase JWT 템플릿**에 맞추어 `auth.uid()`가 Clerk `sub`과 일치하도록 설정해야 “본인” 정책이 동작합니다.
  - Clerk Dashboard → JWT Template for Supabase 설정 참고: [docs/troubleshooting/storage-alg-error.md](./troubleshooting/storage-alg-error.md) 등.

**마이그레이션**: `profiles`에 `clerk_id TEXT UNIQUE` 추가, 기존 `id`는 그대로 두거나 Clerk sub을 UUID로 매핑하는 규칙을 정해야 함.

---

## 옵션 B: auth.users와 Clerk 동기화

**요약**: Clerk 가입/로그인 시 Supabase Auth에도 동일 사용자를 생성·갱신하고, `handle_new_user`로 profiles가 채워지게 함.

- Clerk 웹훅(또는 로그인 후 서버 로직)에서 Supabase Auth Admin API로 사용자 생성/업데이트.
- `auth.users`에 행이 생기면 `handle_new_user` 트리거가 `public.profiles`에 행을 삽입.
- 웹훅은 auth.users 갱신만 하거나, 보조로 profiles 필드(닉네임 등)를 업데이트하는 식으로 설계.

**장점**: 스키마와 RLS를 그대로 사용 가능.  
**단점**: Clerk와 Supabase Auth 두 곳에 사용자를 유지해야 함.

---

## 옵션 C: users와 profiles 병행

**요약**: 기존 `users`(Clerk 동기화)는 유지하고, GripLab 기능에서만 `profiles`를 사용. profiles 행은 “로그인 후 최초 진입 시” 생성.

- 기존 `users` 테이블은 Clerk 웹훅으로 계속 동기화.
- GripLab 기능(온보딩, 루틴, 훈련 로그 등)에서는 `profiles`를 사용.
- profiles 행은 “로그인 후 최초 진입 시” Server Action 또는 API에서 `users.clerk_id`(또는 users.id)와 매핑해 insert/upsert.
- `profiles`에 `clerk_id`(또는 `legacy_user_id`) FK/참조를 두고, RLS는 Clerk JWT의 `sub`과 이 매핑을 이용해 “본인”을 판단하도록 정책 설계.

**장점**: 기존 Clerk ↔ users 흐름을 건드리지 않음.  
**단점**: users와 profiles 간 매핑 및 RLS 정책을 직접 설계해야 함.

---

## 권장

- **1.1 데이터베이스 설정** 범위에서는 위 옵션 중 하나를 **문서/이슈로 선택**해 두고, 실제 연동 구현은 1.2(타입 정의) 또는 온보딩/로그인 플로우 구현 전에 진행하는 것을 권장합니다.
- JWT 템플릿을 이미 사용 중이면 **옵션 A**가 적용하기 수월하고, Supabase Auth를 함께 쓰고 싶으면 **옵션 B**, 기존 users를 유지하면서 GripLab만 profiles를 쓰고 싶으면 **옵션 C**를 검토하면 됩니다.
