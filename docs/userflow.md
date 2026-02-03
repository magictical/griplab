[Start]
│
├─(Safety Consent)─▶ [Gym Select]
│ │
│ ┌─────────────┴─────────────┐
│ (Skip) (Select/Create)
│ │ │
│ [Home: Guest] [Tier Assign]
│ │ │
│ (Click Feature) [Assessment]
│ │ │
│ [Setup Popup] ◀─────────── [Home: User]
│ │
│ [Routine Builder]
│ │
│ ┌──────────┴──────────┐
│ (AI Coach) (Custom Edit)
│ │ │
│ └──────────┬──────────┘
│ │
│ [Workout Player]
│ │
│ ┌──────────┴──────────┐
│ (Abort) (Finish)
│ │ │
│ [Log: Aborted] [RPE Input]
│ │ │
└───────────────────────────┴────────── [Log: Completed]
│
[Update Stats]

                                      🗺️ GripLab User Flow Map

1. 진입 및 온보딩 (Entry & Onboarding)
   핵심 분기: 여기서 '정착 유저'와 '탐색 유저(Guest)'가 갈립니다.

Step 0. 앱 실행 (App Launch)

Splash Screen → [안전 동의 팝업 (Safety Consent)]

Action: 동의 체크 후 [시작하기] 클릭 (필수).

Step 1. 홈짐 선택 (Gym Selection)

분기 A (Skip): 하단 [건너뛰고 둘러보기] 클릭 → **3. 메인 홈(Guest)**으로 이동.

분기 B (Select): 리스트에서 암장 선택.

분기 C (Create): 암장 없음 → [새 암장 등록] → 색상/티어 매핑 → 저장.

Step 2. 티어 배정 (Tier Assignment) (분기 B, C 해당)

색상표 출력 → "50% 완등 가능한 색상" 선택.

결과: 티어(Silver~GM) 확정.

Step 3. 수행 능력 측정 (Assessment)

질문: "1RM 수치를 아시나요?"

Yes: 수치 입력 (Max Hang or Lift) → 완료.

No: 장비 그림 선택 (행보드 / 로딩핀 / 없음).

장비 있음: 측정 가이드 루틴 실행 (5분 휴식 타이머 포함).

장비 없음: 체중 기반 추정치 사용.

결과: 온보딩 완료 → **3. 메인 홈(User)**으로 이동.

2. 메인 대시보드 (Home Dashboard)
   핵심 기능: 내 상태 확인 및 루틴 생성 진입.

Case A: 게스트 모드 (Guest Mode)

UI: 상단 [티어 확인 배너] 고정, 흐릿한 그래프.

Interaction: 배너 클릭 시 → 1. 온보딩 Step 1으로 이동.

Interaction: [+ 새 루틴] 클릭 시 → [설정 유도 팝업] 출력 (진입 차단).

Case B: 유저 모드 (User Mode)

UI: 티어 뱃지, Streak(불꽃), 성장 그래프 노출.

Interaction: [+ 새 루틴 만들기] 클릭 → 4. 루틴 빌더로 이동.

3. 루틴 생성 (Routine Creation)
   진입:

옵션 A: 💬 AI 코치 (Gemini)

채팅(컨디션 입력) → AI 분석 → [루틴 제안 카드] → [적용] 클릭.

옵션 B: 🛠️ 커스텀 빌더

빈 캔버스(또는 AI 제안값) 진입.

편집 (Editor):

블록 추가/삭제, 파라미터(무게, 시간) 수정, 순서 변경.

Action: [저장하고 시작하기] 클릭 → 5. 플레이어로 이동.

4. 훈련 실행 (Workout Execution)
   Step 1. 모드 선택

팝업: [⏱️ 타이머 모드] vs [📝 로거 모드].

Step 2. 플레이 (Execution)

타이머 모드: 카운트다운(5초) → 운동(비프음) → 휴식 → 반복.

로거 모드: 수행 후 [성공/절반/실패] 버튼 클릭 → 즉시 다음 세트.

Step 3. 예외 처리 (Exception)

Action: [중단(Abort)] 버튼 클릭.

사유 선택(부상/컨디션 등) → 세션 종료 (Status: Aborted) → 홈으로 이동.

Step 4. 정상 종료 (Completion)

모든 세트 완료 → [RPE 입력 모달] (1~10 슬라이더).

Action: [저장] 클릭.

5. 결과 및 피드백 (Result & Feedback)
   게이미피케이션:

(기록 갱신 시) Confetti 애니메이션 🎉 출력.

(중단/실패 시) 격려 메시지 출력.

데이터 반영:

홈 화면으로 복귀.

Streak 불꽃 강화 & 그래프 데이터 업데이트.
