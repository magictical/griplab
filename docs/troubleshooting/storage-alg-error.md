# Storage API "alg" (Algorithm) Header Parameter 에러 해결 가이드

## 🔴 에러 메시지

```
StorageApiError: "alg" (Algorithm) Header Parameter value not allowed
```

## 📋 에러 원인

이 에러는 **Clerk의 JWT 토큰 알고리즘이 Supabase Storage API에서 허용하지 않는 알고리즘**일 때 발생합니다.

### 주요 원인:

1. **Supabase에서 Clerk를 Third-Party Auth로 설정하지 않음**
   - Supabase가 Clerk의 JWT를 검증할 수 없어서 발생

2. **JWT 알고리즘 불일치**
   - Clerk의 기본 JWT 알고리즘과 Supabase가 허용하는 알고리즘이 다름
   - Supabase는 기본적으로 HS256 또는 등록된 RS256/ES256을 허용

3. **JWT 템플릿 미설정**
   - Storage API는 특정 형식의 JWT가 필요할 수 있음

## ✅ 해결 방법

### 방법 1: Supabase에서 Clerk를 Third-Party Auth로 설정 (권장)

**이 방법이 가장 확실한 해결책입니다.**

#### 단계별 설정:

1. **Clerk Frontend API URL 확인**
   - Clerk Dashboard → **API Keys** 메뉴
   - **"Frontend API"** URL 복사 (예: `https://your-app-12.clerk.accounts.dev`)

2. **Supabase Dashboard 설정**
   - Supabase Dashboard → 프로젝트 선택
   - **Settings** → **Authentication** → **Providers**
   - 페이지 하단의 **"Third-Party Auth"** 섹션으로 스크롤
   - **"Enable Custom Access Token"** 또는 **"Add Provider"** 클릭

3. **Clerk Provider 추가**
   - **Provider Name**: `Clerk`
   - **JWT Issuer (Issuer URL)**:
     ```
     https://your-app-12.clerk.accounts.dev
     ```
     (실제 Clerk Frontend API URL로 교체)
   - **JWKS Endpoint (JWKS URI)**:
     ```
     https://your-app-12.clerk.accounts.dev/.well-known/jwks.json
     ```
     (실제 URL로 교체)

4. **저장**
   - **"Save"** 또는 **"Add Provider"** 클릭

5. **코드 확인**
   - 현재 코드는 이미 올바르게 설정되어 있습니다:
     ```typescript
     // lib/supabase/clerk-client.ts
     const token = await getToken({ template: "supabase" });
     ```

### 방법 2: Clerk Dashboard에서 Supabase JWT 템플릿 생성

만약 방법 1로 해결되지 않으면, Clerk에서 Supabase용 JWT 템플릿을 생성하세요.

#### 단계별 설정:

1. **Clerk Dashboard 접속**
   - [Clerk Dashboard](https://dashboard.clerk.com/) 로그인

2. **JWT Templates 메뉴**
   - 프로젝트 선택 → **Configure** → **JWT Templates**
   - 또는 직접 URL: `https://dashboard.clerk.com/[your-app]/jwt-templates`

3. **새 템플릿 생성**
   - **"New template"** 또는 **"Create template"** 클릭
   - **Template name**: `supabase`
   - **Token lifetime**: `3600` (1시간, 필요에 따라 조정)

4. **Claims 설정**
   - **Claims** 섹션에서 다음 클레임 추가:
     ```json
     {
       "role": "authenticated",
       "sub": "{{user.id}}"
     }
     ```

5. **저장**
   - **"Save"** 클릭

### 방법 3: 코드 수정 (임시 해결책)

만약 위 방법들이 작동하지 않으면, 기본 토큰을 사용하되 에러 처리를 개선할 수 있습니다:

```typescript
// lib/supabase/clerk-client.ts
async accessToken() {
  try {
    // 먼저 Supabase 템플릿 시도
    const supabaseToken = await getToken({ template: "supabase" });
    if (supabaseToken) return supabaseToken;

    // 기본 토큰 사용
    const defaultToken = await getToken();
    return defaultToken ?? null;
  } catch (error) {
    console.error("Token retrieval error:", error);
    return null;
  }
}
```

## 🔍 확인 사항

### 1. Supabase 설정 확인

다음 명령어로 Supabase 프로젝트의 JWT 설정을 확인하세요:

```bash
# Supabase CLI 사용 시
supabase status
```

또는 Supabase Dashboard에서:

- **Settings** → **API** → **JWT Settings** 확인
- **JWT Secret** 또는 **JWT Signing Keys** 확인

### 2. Clerk 설정 확인

Clerk Dashboard에서:

- **Configure** → **JWT Templates** → `supabase` 템플릿 존재 여부 확인
- **API Keys** → Frontend API URL 확인

### 3. 네트워크 요청 확인

브라우저 개발자 도구에서:

1. **Network** 탭 열기
2. Storage API 요청 확인
3. **Request Headers**에서 `Authorization` 헤더 확인
4. JWT 토큰이 올바르게 전달되는지 확인

## 📝 추가 참고 자료

- [Clerk + Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth 설정](https://supabase.com/docs/guides/auth/auth-deep-dive/auth-deep-dive-jwts#third-party-auth)
- [Supabase Storage RLS 정책](https://supabase.com/docs/guides/storage/security/access-control)

## 🚨 여전히 문제가 발생하는 경우

1. **에러 로그 전체 확인**
   - 브라우저 콘솔의 전체 에러 메시지 확인
   - Network 탭에서 실패한 요청의 Response 확인

2. **환경 변수 확인**
   - `.env` 파일의 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 확인

3. **Supabase 프로젝트 재생성 고려**
   - 완전히 새로운 Supabase 프로젝트에서 테스트

4. **Clerk 프로젝트 재생성 고려**
   - 새로운 Clerk 프로젝트에서 테스트

## ✅ 예상 결과

설정이 완료되면:

- Storage API 요청이 성공적으로 처리됨
- 파일 업로드/다운로드/삭제가 정상 작동
- 에러 메시지가 사라짐
