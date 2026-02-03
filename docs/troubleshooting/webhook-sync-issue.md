# Clerk 웹훅 동기화 문제 해결 가이드

Clerk 웹훅을 통해 사용자 정보를 Supabase에 자동으로 동기화할 때 발생할 수 있는 문제와 해결 방법을 정리했습니다.

## 문제 진단 체크리스트

### 1. 웹훅 엔드포인트 존재 여부 확인

**문제**: `/api/webhooks/clerk` 엔드포인트가 존재하지 않음

**해결**:

- `app/api/webhooks/clerk/route.ts` 파일이 존재하는지 확인
- 파일이 없다면 프로젝트를 최신 버전으로 업데이트

### 2. 로컬 개발 환경 문제

**문제**: `http://localhost:3000/api/webhooks/clerk`로 설정되어 있음

**원인**:

- Clerk 서버는 인터넷을 통해 웹훅을 전송하므로 `localhost`에 접근할 수 없습니다.
- 로컬 개발 환경에서는 터널링 서비스가 필요합니다.

**해결 방법**:

#### 방법 1: ngrok 사용 (권장)

1. **ngrok 설치**:

   ```bash
   # Windows (Chocolatey)
   choco install ngrok

   # 또는 직접 다운로드
   # https://ngrok.com/download
   ```

2. **ngrok 실행**:

   ```bash
   ngrok http 3000
   ```

3. **생성된 HTTPS URL 복사**:

   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```

4. **Clerk Dashboard 업데이트**:
   - Clerk Dashboard → **Webhooks** → **Endpoint**
   - **Endpoint URL**: `https://abc123.ngrok.io/api/webhooks/clerk`
   - 저장

5. **테스트**:
   - Clerk Dashboard → **Webhooks** → **Send Example**
   - 서버 로그에서 웹훅 수신 확인

#### 방법 2: 프로덕션 환경 사용

- Vercel, Netlify 등에 배포 후 프로덕션 URL 사용
- 예: `https://your-app.vercel.app/api/webhooks/clerk`

### 3. 환경 변수 누락

**문제**: `CLERK_WEBHOOK_SIGNING_SECRET`이 설정되지 않음

**증상**:

- 웹훅 검증 실패 에러
- `Webhook verification failed` 응답

**해결**:

1. **Clerk Dashboard에서 시크릿 확인**:
   - Clerk Dashboard → **Webhooks** → **Endpoint**
   - **Signing Secret** 복사 (예: `whsec_...`)

2. **`.env` 파일에 추가**:

   ```env
   CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
   ```

3. **서버 재시작**:
   ```bash
   pnpm dev
   ```

### 4. 미들웨어 인증 문제

**문제**: 웹훅 엔드포인트가 인증을 요구함

**증상**:

- `401 Unauthorized` 응답
- 웹훅 요청이 거부됨

**해결**:

`middleware.ts` 파일에서 웹훅 경로를 public으로 설정:

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // 웹훅 엔드포인트는 public으로 설정
  publicRoutes: ["/api/webhooks/clerk"],
});
```

### 5. 이벤트 타입 미선택

**문제**: Clerk Dashboard에서 웹훅 이벤트를 선택하지 않음

**증상**:

- 웹훅은 도착하지만 사용자 동기화가 안 됨
- 로그에 "Event received but not handled" 메시지

**해결**:

1. **Clerk Dashboard 설정**:
   - Clerk Dashboard → **Webhooks** → **Endpoint**
   - **Events** 섹션에서 다음 이벤트 선택:
     - ✅ `user.created`
     - ✅ `user.updated`

2. **저장 후 테스트**:
   - **Send Example** 버튼 클릭
   - 서버 로그 확인

### 6. 서명 검증 실패

**문제**: 웹훅 서명이 올바르지 않음

**증상**:

- `Webhook verification failed` 에러
- `400 Bad Request` 응답

**원인**:

- `CLERK_WEBHOOK_SIGNING_SECRET`이 잘못됨
- 환경 변수가 로드되지 않음
- 웹훅 요청이 변조됨

**해결**:

1. **시크릿 재확인**:
   - Clerk Dashboard → **Webhooks** → **Endpoint**
   - **Signing Secret** 다시 복사
   - `.env` 파일에 정확히 입력 (공백 없이)

2. **환경 변수 로드 확인**:

   ```typescript
   // app/api/webhooks/clerk/route.ts에서 확인
   console.log(
     "Webhook secret exists:",
     !!process.env.CLERK_WEBHOOK_SIGNING_SECRET,
   );
   ```

3. **서버 재시작**:
   - 환경 변수 변경 후 반드시 서버 재시작

## 디버깅 방법

### 1. 서버 로그 확인

웹훅이 도착하는지 확인:

```bash
# 개발 서버 실행
pnpm dev

# 웹훅 이벤트 발생 시 로그 확인
[Webhook] Received event: user.created
[Webhook] User synced successfully: { clerk_id: 'user_...', supabase_id: '...' }
```

### 2. Clerk Dashboard에서 테스트

1. Clerk Dashboard → **Webhooks** → **Endpoint**
2. **Send Example** 버튼 클릭
3. 서버 로그에서 응답 확인

### 3. 네트워크 요청 확인

브라우저 개발자 도구나 서버 로그에서:

- 요청 URL 확인
- 요청 헤더 확인 (`svix-id`, `svix-timestamp`, `svix-signature`)
- 응답 상태 코드 확인 (200이어야 함)

### 4. 수동 테스트

Postman이나 curl로 웹훅 엔드포인트 테스트:

```bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -d '{"type":"user.created","data":{"id":"user_test"}}'
```

> **주의**: 실제 Clerk 웹훅은 서명 검증이 필요하므로 수동 테스트는 제한적입니다.

## 일반적인 오류 메시지

### "Webhook verification failed"

**원인**: 서명 검증 실패

**해결**:

- `CLERK_WEBHOOK_SIGNING_SECRET` 확인
- 환경 변수가 올바르게 로드되었는지 확인
- 서버 재시작

### "Unauthorized" 또는 "401"

**원인**: 미들웨어가 웹훅 경로를 인증 요구

**해결**:

- `middleware.ts`에서 `/api/webhooks/clerk`를 `publicRoutes`에 추가

### "Cannot connect to endpoint"

**원인**: 로컬 환경에서 `localhost` 사용

**해결**:

- ngrok 사용
- 또는 프로덕션 URL 사용

### "Event received but not processed"

**원인**: 이벤트 타입이 처리되지 않음

**해결**:

- `user.created` 또는 `user.updated` 이벤트인지 확인
- Clerk Dashboard에서 해당 이벤트가 선택되어 있는지 확인

## 예상되는 정상 동작

웹훅이 정상적으로 작동하면:

1. **사용자 생성 시**:

   ```
   [Webhook] Received event: user.created
   [Webhook] User synced successfully: { clerk_id: 'user_...', supabase_id: '...' }
   ```

2. **사용자 업데이트 시**:

   ```
   [Webhook] Received event: user.updated
   [Webhook] User synced successfully: { clerk_id: 'user_...', supabase_id: '...' }
   ```

3. **Supabase에서 확인**:
   - Supabase Dashboard → **Table Editor** → **users**
   - 새로 생성되거나 업데이트된 사용자 확인

## 추가 리소스

- [Clerk 웹훅 공식 문서](https://clerk.com/docs/guides/development/webhooks/overview)
- [Clerk 웹훅 디버깅 가이드](https://clerk.com/docs/guides/development/webhooks/debugging)
- [ngrok 공식 문서](https://ngrok.com/docs)

---

**마지막 업데이트**: 2026년 1월
