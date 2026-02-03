# Supabase 통합 개발 가이드

이 문서는 Next.js 15 프로젝트에 Supabase를 통합하는 전체 과정을 설명합니다. Clerk 인증과 함께 사용하는 모범 사례를 포함합니다.

> **참고**: 이 가이드는 [Supabase 공식 Next.js 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)와 [Clerk + Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)를 기반으로 작성되었습니다.

## 목차

1. [개요](#개요)
2. [Supabase 프로젝트 생성](#supabase-프로젝트-생성)
3. [Clerk + Supabase 통합 설정](#clerk--supabase-통합-설정)
4. [환경 변수 설정](#환경-변수-설정)
5. [Supabase 클라이언트 구현](#supabase-클라이언트-구현)
6. [데이터베이스 스키마 설정](#데이터베이스-스키마-설정)
7. [Storage 설정](#storage-설정)
8. [사용 예제](#사용-예제)
9. [문제 해결](#문제-해결)

---

## 개요

### 기술 스택

- **Next.js 15.5.9** (App Router)
- **React 19**
- **Supabase** (PostgreSQL 데이터베이스, Storage)
- **Clerk** (인증 제공자)
- **TypeScript**

### 아키텍처 개요

이 프로젝트는 **Clerk + Supabase 네이티브 통합** 방식을 사용합니다:

1. **인증**: Clerk가 사용자 인증 처리
2. **데이터베이스**: Supabase PostgreSQL 사용
3. **토큰 전달**: Clerk JWT 토큰을 Supabase에 전달하여 인증
4. **사용자 동기화**: Clerk 사용자를 Supabase `users` 테이블에 자동 동기화

### 참고 문서

- [Supabase Next.js 공식 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Clerk + Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)

---

## Supabase 프로젝트 생성

### 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 로그인
2. **"New Project"** 클릭
3. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 안전한 비밀번호 생성
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서비스용)
   - **Pricing Plan**: Free 또는 Pro 선택
4. **"Create new project"** 클릭하고 프로젝트가 준비될 때까지 대기 (~2분)

### 2. API 키 확인

프로젝트 생성 후 다음 키들을 확인하세요:

1. Supabase Dashboard → **Settings** → **API**
2. 다음 값들을 복사 (나중에 `.env` 파일에 사용):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ 절대 공개하지 마세요!)

---

## Clerk + Supabase 통합 설정

### 1. Clerk Frontend API URL 확인

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 접속
2. 프로젝트 선택 → **API Keys** 메뉴
3. **"Frontend API"** URL 복사 (예: `https://your-app-12.clerk.accounts.dev`)
   - 이 URL을 메모해두세요 (다음 단계에서 사용)

### 2. Supabase에서 Clerk 인증 제공자 설정

**⚠️ 중요**: 이 설정이 없으면 Storage API에서 "alg" (Algorithm) 에러가 발생할 수 있습니다.

1. Supabase Dashboard로 돌아가기
2. 프로젝트 선택 → **Settings** → **Authentication** → **Providers**
3. 페이지 하단으로 스크롤하여 **"Third-Party Auth"** 섹션 찾기
4. **"Enable Custom Access Token"** 또는 **"Add Provider"** 클릭
5. 다음 정보 입력:
   - **Provider Name**: `Clerk`
   - **JWT Issuer (Issuer URL)**:
     ```
     https://your-app-12.clerk.accounts.dev
     ```
     (`your-app-12` 부분을 실제 Clerk Frontend API URL로 교체)
   - **JWKS Endpoint (JWKS URI)**:
     ```
     https://your-app-12.clerk.accounts.dev/.well-known/jwks.json
     ```
     (동일하게 실제 URL로 교체)

6. **"Save"** 또는 **"Add Provider"** 클릭

### 3. 통합 확인

설정이 완료되면 Supabase가 Clerk의 JWT 토큰을 검증할 수 있게 됩니다.

**참고**:

- [Clerk 공식 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Storage API 에러 해결 가이드](../troubleshooting/storage-alg-error.md)

---

## 환경 변수 설정

### 1. `.env` 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=data-griplab
```

### 2. 환경 변수 설명

| 변수명                              | 설명                                   | 사용 위치                          |
| ----------------------------------- | -------------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk 공개 키 (클라이언트에서 사용)    | 클라이언트 컴포넌트                |
| `CLERK_SECRET_KEY`                  | Clerk 비밀 키 (서버에서만 사용)        | 서버 컴포넌트, API 라우트          |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase 프로젝트 URL                  | 모든 Supabase 클라이언트           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Supabase 공개 키 (클라이언트에서 사용) | 클라이언트 컴포넌트, 서버 컴포넌트 |
| `SUPABASE_SERVICE_ROLE_KEY`         | Supabase 관리자 키 (⚠️ 절대 공개 금지) | 서버 사이드 관리 작업만            |
| `NEXT_PUBLIC_STORAGE_BUCKET`        | Storage 버킷 이름                      | Storage 작업                       |

### 3. 보안 주의사항

- ⚠️ **`SUPABASE_SERVICE_ROLE_KEY`는 절대 공개하지 마세요!**
  - 이 키는 모든 RLS를 우회하는 관리자 권한입니다
  - 서버 사이드에서만 사용하고, 클라이언트 코드에 포함하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않습니다
- 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요 (Vercel, Railway 등)

---

## Supabase 클라이언트 구현

프로젝트는 사용 환경에 따라 4가지 Supabase 클라이언트를 제공합니다:

### 1. Clerk 통합 클라이언트 (Client Component용)

**파일**: `lib/supabase/clerk-client.ts`

**용도**: React Client Component에서 사용

**특징**:

- Clerk 세션 토큰을 자동으로 Supabase에 전달
- `useAuth().getToken()`으로 현재 사용자의 토큰 사용
- Supabase JWT 템플릿 사용 시도 (Storage API 호환성)

**사용 예제**:

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();

  async function fetchData() {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error:", error);
      return;
    }

    return data;
  }

  return <div>...</div>;
}
```

### 2. Clerk 통합 클라이언트 (Server Component용)

**파일**: `lib/supabase/server.ts`

**용도**: Server Component, Server Actions에서 사용

**특징**:

- `auth().getToken()`으로 서버 사이드에서 Clerk 토큰 가져오기
- Supabase JWT 템플릿 사용 시도

**사용 예제**:

```tsx
// Server Component
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 3. 공개 데이터용 클라이언트

**파일**: `lib/supabase/client.ts`

**용도**: 인증이 필요 없는 공개 데이터 조회

**특징**:

- Clerk 토큰 없이 anon key만 사용
- RLS 정책이 `to anon`인 데이터만 접근 가능

**사용 예제**:

```tsx
import { supabase } from "@/lib/supabase/client";

// 공개 데이터 조회 (인증 불필요)
const { data } = await supabase.from("public_posts").select("*");
```

### 4. Service Role 클라이언트 (관리자용)

**파일**: `lib/supabase/service-role.ts`

**용도**: RLS를 우회해야 하는 관리 작업

**특징**:

- 모든 RLS 정책을 우회
- 서버 사이드에서만 사용
- ⚠️ 클라이언트에 노출하면 안 됨

**사용 예제**:

```tsx
// API Route 또는 Server Action
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(req: Request) {
  const supabase = getServiceRoleClient();

  // RLS를 우회하여 모든 데이터 접근 가능
  const { data, error } = await supabase.from("users").select("*");

  return Response.json({ data });
}
```

### 클라이언트 선택 가이드

| 상황                                           | 사용할 클라이언트                                             |
| ---------------------------------------------- | ------------------------------------------------------------- |
| Client Component에서 인증된 사용자 데이터 조회 | `useClerkSupabaseClient()`                                    |
| Server Component에서 인증된 사용자 데이터 조회 | `createClerkSupabaseClient()`                                 |
| 공개 데이터 조회 (인증 불필요)                 | `supabase` (client.ts)                                        |
| 관리자 작업 (RLS 우회 필요)                    | `getServiceRoleClient()`                                      |
| Storage 작업 (인증 필요)                       | `useClerkSupabaseClient()` 또는 `createClerkSupabaseClient()` |

---

## 데이터베이스 스키마 설정

### 1. 마이그레이션 파일 실행

프로젝트의 마이그레이션 파일을 Supabase에 적용하세요:

1. Supabase Dashboard → **SQL Editor** 메뉴
2. **"New query"** 클릭
3. `supabase/migrations/setup_schema.sql` 파일 내용을 복사하여 붙여넣기
4. **"Run"** 클릭하여 실행
5. 성공 메시지 확인 (`Success. No rows returned`)

### 2. 생성되는 테이블

**`users` 테이블**:

- `id` (UUID, Primary Key) - 자동 생성
- `clerk_id` (TEXT, Unique) - Clerk 사용자 ID
- `name` (TEXT) - 사용자 이름
- `created_at` (TIMESTAMP) - 생성 시간

**RLS 설정**:

- 개발 중: RLS 비활성화
- 프로덕션: RLS 활성화 필요

### 3. 사용자 동기화

Clerk 사용자가 로그인하면 자동으로 Supabase `users` 테이블에 동기화됩니다:

- **동기화 훅**: `hooks/use-sync-user.ts`
- **프로바이더**: `components/providers/sync-user-provider.tsx`
- **API 라우트**: `app/api/sync-user/route.ts`

---

## Storage 설정

### 1. Storage 버킷 생성

1. Supabase Dashboard → **Storage** 메뉴
2. **"New bucket"** 클릭
3. 버킷 정보 입력:
   - **Name**: `data-griplab` (`.env` 파일의 `NEXT_PUBLIC_STORAGE_BUCKET`와 동일하게)
   - **Public bucket**: `false` (Private - 인증된 사용자만 접근)
4. **"Create bucket"** 클릭

### 2. RLS 정책 적용

마이그레이션 파일을 실행하여 RLS 정책을 적용하세요:

1. Supabase Dashboard → **SQL Editor** 메뉴
2. **"New query"** 클릭
3. `supabase/migrations/setup_storage.sql` 파일 내용을 복사하여 붙여넣기
4. **"Run"** 클릭하여 실행

### 3. Storage 정책 설명

**버킷**: `data-griplab` (Private)

**RLS 정책**:

- **INSERT**: 인증된 사용자만 자신의 폴더(`{clerk_user_id}/`)에 업로드 가능
- **SELECT**: 인증된 사용자만 자신의 파일 조회 가능
- **DELETE**: 인증된 사용자만 자신의 파일 삭제 가능
- **UPDATE**: 인증된 사용자만 자신의 파일 업데이트 가능

**파일 경로 구조**: `{clerk_user_id}/{filename}`

### 4. Storage 사용 예제

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";

export default function FileUpload() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();

  async function uploadFile(file: File) {
    if (!user) return;

    const filePath = `${user.id}/${file.name}`;

    const { error } = await supabase.storage
      .from("data-griplab")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    console.log("File uploaded successfully!");
  }

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
    />
  );
}
```

---

## 사용 예제

### 1. 데이터 조회 (Client Component)

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useEffect, useState } from "react";

export default function UsersList() {
  const supabase = useClerkSupabaseClient();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error:", error);
        return;
      }

      setUsers(data || []);
    }

    fetchUsers();
  }, [supabase]);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 2. 데이터 조회 (Server Component)

```tsx
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export default async function UsersPage() {
  const supabase = createClerkSupabaseClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 3. 데이터 삽입

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";

export default function CreateUser() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();

  async function createUser() {
    if (!user) return;

    const { data, error } = await supabase.from("users").insert({
      clerk_id: user.id,
      name: user.fullName || user.emailAddresses[0]?.emailAddress || "Unknown",
    });

    if (error) {
      console.error("Error:", error);
      return;
    }

    console.log("User created:", data);
  }

  return <button onClick={createUser}>Create User</button>;
}
```

### 4. Storage 파일 업로드

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";

export default function FileUpload() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !event.target.files?.[0]) return;

    const file = event.target.files[0];
    const filePath = `${user.id}/${file.name}`;

    const { error } = await supabase.storage
      .from("data-griplab")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    console.log("File uploaded successfully!");
  }

  return <input type="file" onChange={handleUpload} />;
}
```

### 5. Storage 파일 목록 조회

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function FileList() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function fetchFiles() {
      const { data, error } = await supabase.storage
        .from("data-griplab")
        .list(user.id, {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error:", error);
        return;
      }

      setFiles(data || []);
    }

    fetchFiles();
  }, [user, supabase]);

  return (
    <div>
      {files.map((file) => (
        <div key={file.id}>{file.name}</div>
      ))}
    </div>
  );
}
```

---

## 문제 해결

### Storage API "alg" (Algorithm) 에러

**에러 메시지**: `StorageApiError: "alg" (Algorithm) Header Parameter value not allowed`

**원인**: Supabase에서 Clerk를 Third-Party Auth로 설정하지 않았거나, JWT 알고리즘이 호환되지 않음

**해결 방법**:

1. Supabase Dashboard → **Settings** → **Authentication** → **Providers**
2. **"Third-Party Auth"** 섹션에서 Clerk가 등록되어 있는지 확인
3. 등록되지 않았다면 [Clerk + Supabase 통합 설정](#clerk--supabase-통합-설정) 섹션을 따라 설정

**자세한 해결 방법**: [`docs/troubleshooting/storage-alg-error.md`](../troubleshooting/storage-alg-error.md)

### 환경 변수 오류

**에러 메시지**: `Supabase URL or Service Role Key is missing`

**원인**: `.env` 파일에 필요한 환경 변수가 설정되지 않음

**해결 방법**:

1. 프로젝트 루트에 `.env` 파일이 있는지 확인
2. 모든 필수 환경 변수가 설정되어 있는지 확인
3. 환경 변수 이름에 오타가 없는지 확인

### 인증 오류

**에러 메시지**: `Invalid API key` 또는 `JWT expired`

**원인**:

- 잘못된 API 키 사용
- 만료된 JWT 토큰

**해결 방법**:

1. Supabase Dashboard에서 API 키가 올바른지 확인
2. Clerk Dashboard에서 JWT 설정 확인
3. 브라우저를 새로고침하여 새로운 토큰 받기

### RLS 정책 오류

**에러 메시지**: `new row violates row-level security policy`

**원인**: RLS 정책이 데이터 접근을 차단함

**해결 방법**:

1. 개발 중: RLS를 비활성화 (프로덕션에서는 권장하지 않음)
2. 프로덕션: 적절한 RLS 정책 작성
3. Service Role 클라이언트 사용 (관리 작업만)

---

## 추가 리소스

### 공식 문서

- [Supabase 공식 문서](https://supabase.com/docs)
- [Clerk 공식 문서](https://clerk.com/docs)
- [Next.js 공식 문서](https://nextjs.org/docs)

### 프로젝트 문서

- [README.md](../../README.md) - 프로젝트 개요 및 시작 가이드
- [AGENTS.md](../../AGENTS.md) - 개발 가이드라인
- [문제 해결 가이드](../troubleshooting/storage-alg-error.md) - Storage API 에러 해결

### 유용한 링크

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new)

---

## 요약

### 통합 완료 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] Clerk 프로젝트 생성 완료
- [ ] Supabase에서 Clerk를 Third-Party Auth로 설정 완료
- [ ] `.env` 파일에 모든 환경 변수 설정 완료
- [ ] 데이터베이스 스키마 마이그레이션 실행 완료
- [ ] Storage 버킷 생성 및 RLS 정책 적용 완료
- [ ] 개발 서버 실행 및 테스트 완료

### 다음 단계

1. **인증 테스트**: `/auth-test` 페이지에서 Clerk + Supabase 통합 테스트
2. **Storage 테스트**: `/storage-test` 페이지에서 파일 업로드/다운로드 테스트
3. **데이터베이스 테스트**: 사용자 데이터 조회 및 생성 테스트

---

---

## 통합 과정 요약

### 전체 통합 단계 요약

이 프로젝트에 Supabase를 통합하는 전체 과정은 다음과 같습니다:

#### 1단계: 프로젝트 생성 및 설정

- ✅ Supabase 프로젝트 생성
- ✅ Clerk 프로젝트 생성
- ✅ 환경 변수 설정 (`.env` 파일)

#### 2단계: Clerk + Supabase 통합

- ✅ Clerk Frontend API URL 확인
- ✅ Supabase에서 Clerk를 Third-Party Auth로 설정
- ✅ JWT Issuer 및 JWKS Endpoint 등록

#### 3단계: 데이터베이스 설정

- ✅ `users` 테이블 생성 (`setup_schema.sql`)
- ✅ RLS 정책 설정 (개발 중 비활성화)
- ✅ 사용자 동기화 로직 구현

#### 4단계: Storage 설정

- ✅ `data-griplab` 버킷 생성 (`setup_storage.sql`)
- ✅ Storage RLS 정책 설정
- ✅ 파일 경로 구조 정의 (`{clerk_user_id}/{filename}`)

#### 5단계: 클라이언트 구현

- ✅ Client Component용 클라이언트 (`clerk-client.ts`)
- ✅ Server Component용 클라이언트 (`server.ts`)
- ✅ 공개 데이터용 클라이언트 (`client.ts`)
- ✅ 관리자용 클라이언트 (`service-role.ts`)

#### 6단계: 테스트 및 검증

- ✅ 인증 통합 테스트 (`/auth-test`)
- ✅ Storage 기능 테스트 (`/storage-test`)
- ✅ 데이터베이스 쿼리 테스트

### 현재 프로젝트 상태

**✅ 완료된 작업**:

- Supabase 클라이언트 구현 (4가지 타입)
- Clerk + Supabase 네이티브 통합
- 사용자 동기화 시스템
- Storage 버킷 및 RLS 정책 설정
- 한국어 로컬라이제이션 (Clerk)

**📋 설정 필요**:

- Supabase Dashboard에서 Clerk를 Third-Party Auth로 설정
- `.env` 파일에 실제 API 키 입력
- 데이터베이스 마이그레이션 실행
- Clerk 웹훅 설정 (사용자 자동 동기화용)

### 다음 단계

1. **Supabase Dashboard 설정**
   - Clerk를 Third-Party Auth로 등록
   - Storage 버킷 생성 확인

2. **환경 변수 설정**
   - `.env` 파일 생성 및 API 키 입력

3. **마이그레이션 실행**
   - `setup_schema.sql` 실행
   - `setup_storage.sql` 실행

4. **Clerk 웹훅 설정** (선택사항)
   - 로컬 개발: ngrok 사용 (`ngrok http 3000`)
   - Clerk Dashboard → Webhooks → Endpoint 추가
   - URL: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - Events: `user.created`, `user.updated` 선택
   - Signing Secret을 `.env`에 추가 (`CLERK_WEBHOOK_SIGNING_SECRET`)

5. **테스트**
   - 개발 서버 실행 (`pnpm dev`)
   - `/auth-test` 페이지에서 인증 테스트
   - `/storage-test` 페이지에서 Storage 테스트
   - 웹훅 테스트: Clerk Dashboard → Webhooks → Send Example

---

**마지막 업데이트**: 2026년 1월
**프로젝트 버전**: Next.js 15.5.9, Supabase JS 2.49.8, Clerk Next.js 6.36.9

**참고 문서**:

- [Supabase 공식 Next.js 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Clerk + Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)
