# GripLab UI Specifications

**Version:** v1.5
**Last Updated:** 2026-01-22

이 문서는 각 화면의 디자인 참조 파일(Design Ref)과 기능 요구사항(Logic Ref)을 정의합니다.
**Agent Instruction:** 화면을 구현할 때 `Design Ref`의 스타일을 따르되, 텍스트와 레이블은 아래 명시된 **한국어 내용**을 적용하세요.

---

### ON-04: 티어 배정 (Tier Assignment)

Design Ref: docs/design-refs/04_tier_assign.html
Logic Ref: PRD 3.1 [Step 2]
Essential Elements (필수 요소):

[ ] 색상 그리드 (Color Grid): 선택한 암장의 색상 버튼을 난이도 순으로 나열.
[ ] 안내 문구 (Instruction): "한 세션에 50% 이상 완등할 수 있는 난이도를 선택하세요."
[ ] 티어 뱃지 인터랙션 (Tier Badge Interaction):

로직 (Logic): 사용자의 색상 선택에 따라 하단에 실버/골드/플래티넘/다이아몬드/마스터/그랜드마스터 중 해당하는 등급의 뱃지를 즉시 출력. (높은 난이도 색상일수록 상위 티어 매핑)
시각 효과 (Visual Effect): 뱃지 등장 시 애니메이션(Bounce/Fade-in) 적용.
동작 (Action): "[다음]" 버튼 클릭 시 ON-05로 이동.

## 1. Onboarding (진입 및 온보딩)

### ON-01: 안전 동의 (Safety Consent)

- **Design Ref:** `docs/design-refs/01_safety_consent.html`
- **Logic Ref:** PRD 3.1 [Step 0]
- **Essential Elements (필수 요소):**
  - [ ] **경고 아이콘 & 헤드라인:** 고강도 훈련의 위험성을 강조하는 아이콘 및 문구.
  - [ ] **약관 텍스트 박스:** 스크롤 가능한 면책 조항 텍스트 영역.
  - [ ] **동의 체크박스:** "약관에 동의하며 모든 책임은 본인에게 있음을 확인합니다."
  - [ ] **[시작하기] 버튼:**
    - 초기 상태: 비활성화 (Disabled).
    - 동작: 체크박스 선택 시 활성화 -> `ON-02`로 이동.

### ON-02: 홈짐 선택 (Gym Selection)

- **Design Ref:** `docs/design-refs/02_gym_select.html`
- **Logic Ref:** PRD 3.1 [Step 1]
- **Essential Elements (필수 요소):**
  - [ ] **건너뛰기 버튼:** "[건너뛰고 둘러보기]" (텍스트 버튼) -> Guest 모드 설정 -> `HM-01`로 이동.
  - [ ] **검색창:** 암장 이름 검색.
  - [ ] **암장 리스트 아이템:** 암장 이름 + "공식/커뮤니티" 뱃지 표시.
  - [ ] **새 암장 등록 버튼:** "[+ 새 암장 등록]" (플로팅 또는 하단 고정) -> `ON-03`으로 이동.

### ON-03: 커스텀 암장 등록 (Create Gym)

- **Design Ref:** `docs/design-refs/03_gym_create.html`
- **Logic Ref:** PRD 3.1 [Step 1 - Creation]
- **Essential Elements (필수 요소):**
  - [ ] **암장 이름 입력:** 텍스트 필드.
  - [ ] **색상 추가 버튼:** (+) 아이콘을 눌러 색상 원(Circle) 추가.
  - [ ] **티어 박스 (6단계):** 실버, 골드, 플래티넘, 다이아몬드, 마스터, 그랜드마스터 (라벨 고정).
  - [ ] **드래그 앤 드롭 영역:** 생성한 색상 원을 각 티어 박스로 드래그하여 배치.
  - [ ] **[저장하기] 버튼:** 데이터 저장 -> 생성된 암장 ID와 함께 `ON-04`로 이동.

### ON-04: 티어 배정 (Tier Assignment)

Design Ref: docs/design-refs/04_tier_assign.html
Logic Ref: PRD 3.1 [Step 2]
Essential Elements (필수 요소):

[ ] 색상 그리드 (Color Grid): 선택한 암장의 색상 버튼을 난이도 순으로 나열.
[ ] 안내 문구 (Instruction): "한 세션에 50% 이상 완등할 수 있는 난이도를 선택하세요."
[ ] 티어 뱃지 인터랙션 (Tier Badge Interaction):

로직 (Logic): 사용자의 색상 선택에 따라 하단에 실버/골드/플래티넘/다이아몬드/마스터/그랜드마스터 중 해당하는 등급의 뱃지를 즉시 출력. (높은 난이도 색상일수록 상위 티어 매핑)
시각 효과 (Visual Effect): 뱃지 등장 시 애니메이션(Bounce/Fade-in) 적용.
동작 (Action): "[다음]" 버튼 클릭 시 ON-05로 이동.

### ON-05: 수행 능력 측정 (Assessment)

- **Design Ref:** `docs/design-refs/05_assessment.html`
- **Logic Ref:** PRD 3.1 [Step 3]
- **Essential Elements (필수 요소):**
  - [ ] **탭 전환:** [데이터 입력] vs [장비 확인].
  - [ ] **입력 폼 (탭 1):** `Max Hang (kg)` 및 `No Hang Lift (kg)` 숫자 입력 필드.
  - [ ] **장비 선택 카드 (탭 2):**
    - [이미지] 행보드 (선택 가능).
    - [이미지] 로딩핀/블럭 (선택 가능).
    - [텍스트] 없음/모름 (선택 가능).
  - [ ] **로직:**
    - "없음" 선택 시: 체중 기반 추정치 사용 -> 홈으로 이동.
    - 장비 선택 시: "측정 루틴" 시작 (플레이어로 이동).
    - **중요:** 두 장비 모두 선택 시, 종목 간 **5분 강제 휴식 타이머** 로직 적용.

---

## 2. Main Dashboard (메인 대시보드)

### HM-01: 게스트 홈 (Guest Home)

- **Design Ref:** `docs/design-refs/06_home_guest.html`
- **Logic Ref:** PRD 3.4 [Guest Mode]
- **Essential Elements (필수 요소):**
  - [ ] **상단 고정 배너:** "내 티어 확인하고 AI 코칭 받기" -> `ON-01`로 이동.
  - [ ] **티어 영역:** 잠금 아이콘 또는 물음표(?) 뱃지.
  - [ ] **차트 영역:** "데이터가 필요합니다" 문구와 함께 흐릿한(Blur) 예시 차트 표시.
  - [ ] **기능 잠금:** [+ 새 루틴] 버튼 클릭 시 "설정이 필요합니다" 알림 팝업.

### HM-02: 유저 홈 (User Home)

- **Design Ref:** `docs/design-refs/07_home_user.html`
- **Logic Ref:** PRD 3.4 [Regular User]
- **Essential Elements (필수 요소):**
  - [ ] **히어로 섹션:** 유저 닉네임 + **현재 티어 뱃지**.
  - [ ] **스트릭 위젯:** 불꽃 아이콘 + 연속 일수 (예: "🔥 3주 연속").
  - [ ] **차트 영역:**
    - 필터: 1개월 / 3개월 / 전체.
    - 타입: 선 그래프(Daily Max) / 막대 그래프(볼륨).
  - [ ] **플로팅 버튼 (FAB):** "[+ 새 루틴 만들기]" -> `RB-01`로 이동.

---

## 3. Routine Builder (루틴 빌더)

### RB-01: 빌더 모드 선택 (Mode Select)

- **Design Ref:** `docs/design-refs/08_builder_select.html`
- **Logic Ref:** PRD 3.2
- **Essential Elements (필수 요소):**
  - [ ] **카드 A (AI 코치):** Gemini 아이콘 + "컨디션에 맞춰 추천받기".
  - [ ] **카드 B (커스텀):** 설정 아이콘 + "직접 설계하기".
  - [ ] **뒤로가기 버튼:** 홈으로 복귀.

### RB-02: AI 채팅 (AI Coach)

- **Design Ref:** `docs/design-refs/09_ai_chat.html`
- **Logic Ref:** PRD 3.2 [AI Coach]
- **Essential Elements (필수 요소):**
  - [ ] **채팅 인터페이스:** 스크롤 가능한 대화 목록 (User/AI).
  - [ ] **퀵 리플라이 칩:** [컨디션 좋음], [어깨 통증], [시간 부족] 등.
  - [ ] **제안 카드 (AI 출력):**
    - 요약 정보 (예상 시간, 강도).
    - **[빌더로 가져오기] 버튼:** JSON 데이터를 `RB-03`으로 로드.

### RB-03: 루틴 에디터 (Routine Editor)

- **Design Ref:** `docs/design-refs/10_routine_editor.html`
- **Logic Ref:** PRD 3.2 [Custom Builder]
- **Essential Elements (필수 요소):**
  - [ ] **헤더 액션:** 뒤로가기, 루틴 이름 입력, [불러오기/저장] 버튼.
  - [ ] **개요 및 설정 (아코디언):** 보드 트레이닝 활성화 토글, 트레이닝 타입 선택(행보드/리프트).
  - [ ] **블록 리스트 (메인):**
    - **단일 블록:** 운동/휴식 아이템 (좌측 컬러 바: 운동-파랑, 휴식-초록).
    - **세트 그룹 (Loop):** 반복되는 운동 세트를 묶어주는 컨테이너 UI.
    - **인터랙션:** 드래그 앤 드롭 핸들, 삭제(X) 버튼.
  - [ ] **하단 고정 패널 (Footer):**
    - **통계 그리드:** 총 운동 수, 총 세트, **TUT(Time Under Tension)**, 전체 소요 시간.
    - **추가 버튼 그룹:** [+ 운동], [+ 세트(그룹)], [+ 휴식].
    - **비주얼 타임라인:** 전체 루틴의 강도와 시간을 막대그래프로 시각화 (Gamification 요소).
    - **완료 버튼:** "[루틴 생성 완료]" -> 데이터 저장 후 `PL-01`로 이동.

### RB-04: 운동 선택 모달 (Exercise Picker)

- **Design Ref:** `docs/design-refs/11_exercise_modal.html`
- **Logic Ref:** PRD 3.2 [Exercise Picker]
- **Essential Elements (필수 요소):**
  - [ ] **검색창.**
  - [ ] **카테고리 탭:** 행보드 / 리프트 / 턱걸이 / 코어.
  - [ ] **리스트 아이템:** 클릭 시 `RB-03`에 블록 추가.

---

## 4. Workout Player (플레이어)

### PL-01: 모드 선택 (Mode Select)  !!훈련 모드는 생성시에 지정해야되는 부분임

- **Design Ref:** `docs/design-refs/12_mode_select.html`
- **Logic Ref:** PRD 3.3 [Entry]
- **Essential Elements (필수 요소):**
  - [ ] **모달 팝업:**
  - [ ] **버튼 A:** [⏱️ 타이머 모드] (기본).
  - [ ] **버튼 B:** [📝 로거 모드] (수동 기록).

### PL-02: 타이머 플레이어 (Timer Mode)

- **Design Ref:** `docs/design-refs/13_player_timer.html`
- **Logic Ref:** PRD 3.3 [Timer Mode]
- **Essential Elements (필수 요소):**
  - [ ] **메인 타이머:** 거대한 숫자 폰트 (분:초).
  - [ ] **시각적 타이머:** 원형 프로그레스 바 (`react-native-reanimated`).
  - [ ] **세트 정보:** 현재 무게 / 엣지 / 그립 타입 표시.
  - [ ] **컨트롤:** [일시정지], [휴식 스킵], [중단(X)].
  - [ ] **오디오:** 시작/종료/카운트다운 비프음.

### PL-03: 로거 플레이어 (Logger Mode)

- **Design Ref:** `docs/design-refs/14_player_logger.html`
- **Logic Ref:** PRD 3.3 [Logger Mode]
- **Essential Elements (필수 요소):**
  - [ ] **세트 리스트:** 현재 진행 중인 세트 강조(Highlight).
  - [ ] **상태 버튼 (3가지):**
    - [✅ 성공] (초록)
    - [⚠️ 절반] (노랑)
    - [❌ 실패] (빨강)
  - [ ] **중단 버튼:** 우상단 텍스트 "[중단]".

### PL-04: 세션 종료 (Session End)

- **Design Ref:** `docs/design-refs/15_session_end.html`
- **Logic Ref:** PRD 3.3 [Post-Workout]
- **Essential Elements (필수 요소):**
  - [ ] **RPE 타이틀:** "오늘 훈련 강도는 어땠나요?"
  - [ ] **슬라이더:** 1(쉬움) ~ 10(한계) 범위.
  - [ ] **피드백 텍스트:** 슬라이더 위치에 따라 변경 (예: "RPE 8 - 적당함").
  - [ ] **[기록 저장하기] 버튼:** 데이터 저장 -> 오토 레귤레이션 트리거 -> 홈으로 이동.

---

## 5. Settings (설정)

### ST-01: 설정 & 프로필 (Settings)

- **Design Ref:** `docs/design-refs/16_settings.html`
- **Logic Ref:** PRD 3.5
- **Essential Elements (필수 요소):**
  - [ ] **프로필 카드:** 티어 뱃지 표시, 소속 암장 (변경 버튼).
  - [ ] **프로필 완성도 (Guest 전용):** "[프로필 완성하기 (20%)]" 진행바.
  - [ ] **앱 설정:** 사운드 토글, 다크모드 토글.
  - [ ] **계정 관리:** 로그아웃, 회원 탈퇴.
