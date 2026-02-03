# 로그인 필요 모달 → Clerk 로그인 모달 테스트

비로그인 시 DB 접근(암장 추가, 홈짐 저장 등)을 시도하면 **로그인 필요 모달**이 뜨고, [로그인] 클릭 시 **Clerk 로그인 모달**이 같은 화면 위에 열립니다. 로그인 완료 후 Clerk 모달만 닫히며 **페이지 이동 없이** 같은 화면에 남아 다시 저장/다음을 시도할 수 있습니다.

---

## 1. 수동 테스트 (브라우저)

### 사전 조건

- 개발 서버 실행: `pnpm dev`
- **로그아웃 상태**로 시작 (Clerk 로그아웃 또는 시크릿/다른 브라우저)

### 1-1. 커스텀 암장 등록 (모달에서 로그인)

| 단계 | 동작 | 확인 사항 |
|------|------|------------|
| 1 | `/onboarding/safety` 접속 후 동의 → `/onboarding/gym-select`로 이동 | 홈짐 선택 화면 표시 |
| 2 | [새 암장 등록] 클릭 → `/onboarding/gym-create` 이동 | 커스텀 암장 등록 화면 표시 |
| 3 | 암장 이름 입력, 색상 하나 이상 티어에 매핑 후 [저장하기] 클릭 | **로그인이 필요합니다** 모달 표시 |
| 4 | 모달에서 [로그인] 클릭 | 우리 모달이 닫히고 **Clerk 로그인 모달**이 같은 화면 위에 열리는지 확인 |
| 5 | Clerk 모달에서 로그인 완료 | Clerk 모달만 닫히고 **URL 변경 없이** `/onboarding/gym-create` 화면이 그대로 보이는지 확인 |
| 6 | 다시 [저장하기] 클릭 | 로그인된 상태이므로 저장이 진행되고 tier-assign으로 이동하는지 확인 |

### 1-2. 홈짐 선택 (모달에서 로그인)

| 단계 | 동작 | 확인 사항 |
|------|------|------------|
| 1 | 로그아웃 후 `/onboarding/gym-select` 접속 | 홈짐 선택 화면 표시 |
| 2 | 목록에서 암장 하나 선택 후 [다음] 클릭 | **로그인이 필요합니다** 모달 표시 |
| 3 | [로그인] 클릭 | 우리 모달 닫힘 → **Clerk 로그인 모달**이 같은 화면 위에 열림 |
| 4 | 로그인 완료 | Clerk 모달만 닫히고 **URL 변경 없이** gym-select 화면 유지 |
| 5 | 다시 [다음] 클릭 | 로그인된 상태이므로 홈짐 저장 후 tier-assign으로 이동하는지 확인 |

---

## 2. E2E 테스트 (Playwright) – 선택

Playwright로 **로그인 필요 모달 표시**와 **Clerk 로그인 모달이 열리는지**까지 자동 검증할 수 있습니다. (실제 로그인 완료는 테스트 계정/설정이 필요합니다.)

### 2-1. Playwright 설치 (미설치 시)

```bash
pnpm add -D @playwright/test
npx playwright install
```

### 2-2. 설정 파일 예시

**playwright.config.ts** (프로젝트 루트):

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2-3. 로그인 필요 모달 + Clerk 모달 열림 테스트 예시

**tests/e2e/login-redirect.spec.ts**:

```ts
import { test, expect } from "@playwright/test";

test.describe("로그인 필요 모달 → Clerk 로그인 모달", () => {
  test("gym-create에서 [저장하기] 시 로그인 모달 표시, [로그인] 클릭 시 Clerk 모달 영역 노출", async ({
    page,
  }) => {
    await page.goto("/onboarding/safety");
    await page.getByRole("button", { name: /시작하기|동의/ }).click();
    await expect(page).toHaveURL(/\/onboarding\/gym-select/);

    await page.getByRole("link", { name: /새 암장 등록/ }).click();
    await expect(page).toHaveURL(/\/onboarding\/gym-create/);

    await page.getByLabel(/암장 이름/).fill("테스트 암장");
    // 색상이 티어에 매핑되어 있어야 저장하기 활성화 – 드래그 또는 티어별 + 로 색상 추가
    await page.getByRole("button", { name: "저장하기" }).click();

    await expect(page.getByRole("dialog").getByText("로그인이 필요합니다")).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "로그인" }).click();

    // 우리 모달이 닫히고 Clerk 로그인 UI가 보이면 성공 (Clerk은 iframe/별도 DOM 사용)
    await expect(page).toHaveURL(/\/onboarding\/gym-create/);
    // Clerk 모달이 열렸다면 로그인 관련 텍스트나 iframe이 있음
    await expect(page.getByText("로그인이 필요합니다").first()).not.toBeVisible();
  });

  test("gym-select에서 [다음] 시 로그인 모달 표시", async ({ page }) => {
    await page.goto("/onboarding/gym-select");
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "다음" }).click();

    await expect(page.getByRole("dialog").getByText("로그인이 필요합니다")).toBeVisible();
  });
});
```

- 위 테스트는 **비로그인** 상태에서 우리 모달이 뜨고, [로그인] 클릭 후 URL이 바뀌지 않으며 우리 모달이 닫히는지 검증합니다.
- Clerk 로그인 완료까지 자동 검증하려면 테스트 계정 또는 인증 모킹이 필요합니다.

### 2-4. 실행

```bash
pnpm exec playwright test tests/e2e/login-redirect.spec.ts
```

---

## 3. 요약

| 방법 | 확인 내용 |
|------|------------|
| **수동** | 로그인 필요 모달 표시 → [로그인] 클릭 → Clerk 로그인 모달이 같은 화면에 열림 → 로그인 후 모달만 닫히고 같은 URL 유지 → 다시 저장/다음 시도 시 정상 동작 |
| **E2E** | 비로그인 시 모달 노출 및 [로그인] 클릭 후 URL 유지 검증 (선택 시 Playwright 추가) |

모달에서 바로 Clerk 로그인을 하므로 **리다이렉트 없이** 같은 화면에서 로그인 후 재시도할 수 있습니다.
