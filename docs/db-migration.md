# GripLab 데이터베이스 마이그레이션 가이드

> **1.1 데이터베이스 설정** – setup_schema.sql 적용 및 검증 절차

## 1. 마이그레이션 실행

### 방법 A: Supabase Dashboard (권장)

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속 후 프로젝트 선택
2. 왼쪽 메뉴 **SQL Editor** → **New query**
3. [`supabase/migrations/setup_schema.sql`](../supabase/migrations/setup_schema.sql) 파일 내용 **전체 복사** 후 에디터에 붙여넣기
4. **Run** 실행

실행 순서는 파일 그대로 유지됩니다: Extension → Enum → 테이블 생성 → FK 추가 → RLS → 트리거.

### 방법 B: Supabase CLI

```bash
# 프로젝트 연결 (project-ref는 package.json gen:types 스크립트 참고)
npx supabase link --project-ref <project-id>

# 마이그레이션 적용
npx supabase db push
```

로컬에 `supabase/migrations/` 아래 마이그레이션 파일이 있으면 위 명령으로 적용할 수 있습니다.

### 검증용 RPC (Step 3)

1.1 검증(트리거·RLS 자동 확인)을 쓰려면 **검증용 함수** 마이그레이션도 적용해야 합니다.

- **파일**: [`supabase/migrations/20250203100000_add_griplab_schema_checks.sql`](../supabase/migrations/20250203100000_add_griplab_schema_checks.sql)
- **내용**: `get_griplab_schema_checks()` RPC – 트리거 존재 여부 및 5개 테이블 RLS 상태 반환
- **적용**: Dashboard SQL Editor에서 해당 파일 내용 복사 후 Run, 또는 `npx supabase db push`로 전체 마이그레이션 적용

이 RPC가 없어도 5개 테이블 조회·Storage 확인은 동작하며, API/스크립트에서 트리거·RLS 항목만 생략되거나 안내 메시지가 출력됩니다.

### `users` 테이블과의 관계 (중요)

- **setup_schema.sql에는 `public.users` 생성/삭제가 없습니다.**  
  이 SQL이 만드는 테이블은 다음 5개뿐입니다: `profiles`, `gyms`, `gym_grade_scales`, `routines`, `training_logs`.
- **`users` 테이블(clerk_id, name 등)은 Clerk 웹훅 동기화용으로 별도로 만든 테이블**이며, 다른 마이그레이션/스키마로 관리됩니다.
- **`users` 테이블은 지우지 마세요.**  
  Dashboard에서 setup_schema.sql을 실행할 때도 `users`를 삭제하거나 수정할 필요가 없습니다. 그대로 두고 setup_schema.sql만 실행하면 됩니다.

### 이미 GripLab 테이블이 있는 경우

- `profiles`, `gyms` 등 **위 5개 테이블이 이미 있으면** `CREATE TABLE`이 실패합니다.
- 그때는 (1) 이미 적용된 테이블 생성 구문은 건너뛰고, 누락된 RLS·트리거만 추가 실행하거나, (2) GripLab 데이터를 지워도 된다면 **5개 테이블만** 삭제한 뒤 setup_schema.sql 전체를 다시 실행할 수 있습니다. **`users` 테이블은 삭제하지 마세요.**

---

## 2. 검증 (수동)

### 2.1 테이블 존재 확인

**Table Editor**에서 다음 5개 테이블이 보이는지 확인:

- `public.profiles`
- `public.gyms`
- `public.gym_grade_scales`
- `public.routines`
- `public.training_logs`

### 2.2 RLS 정책 확인

**Authentication** → **Policies** 또는 **SQL Editor**에서 정책 목록 확인.  
[setup_schema.sql](../supabase/migrations/setup_schema.sql) 106–130행과 일치하는지 확인합니다.

### 2.3 트리거 확인

**SQL Editor**에서 실행:

```sql
SELECT tgname, tgrelid::regclass
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

`auth.users`에 대한 `on_auth_user_created` 트리거가 1건 있으면 정상입니다.

### 2.4 자동 검증 (로컬)

마이그레이션 적용 후 아래로 5개 테이블 접근 가능 여부를 확인할 수 있습니다.

- **API**: `GET /api/check-db` → `tables.griplab` 5개 테이블·`tables.users`·`storage`·(선택) `schemaChecks`(트리거·RLS) 반환
- **스크립트**: `pnpm run check-db` → 5개 테이블 조회·users·Storage·**트리거/RLS** 상태 출력

검증용 RPC(`get_griplab_schema_checks`)를 적용해 두면 API 응답에 `schemaChecks`가 포함되고, 스크립트에서 “트리거 적용됨” 및 테이블별 RLS 여부가 출력됩니다.

---

## 3. Clerk와 profiles 연동

인증을 Clerk만 사용하는 경우, `handle_new_user` 트리거는 Supabase Auth 가입 시에만 동작합니다.  
Clerk ↔ `profiles` 연동 방안은 [docs/clerk-profiles-integration.md](./clerk-profiles-integration.md)를 참고하세요.
