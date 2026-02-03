Project Name,GripLab (그립랩)
Version,v1.6 (Schema Optimized for UI/UX)
Date,2026-01-23
Status,Confirmed / Ready for Development
Platform,Mobile App (React Native / PWA)

---

1. Overview (개요)
   1.1 Product Identity
   Tagline: "훈련이 게임처럼 즐거워지는 내 손안의 연구소, GripLab"

Mission:

개인화된 성장 (Individual Growth): 클라이머의 향상심과 재미를 자극하여, 평생 지속 가능한 과학적 등반 파트너가 된다.

연결된 성장 (Connected Growth): 누구나 전문적인 루틴을 설계하고 공유하는 생태계를 구축한다. (v2 이후)

1.2 Problem Statement & Solution
Problem: 훈련은 지루하고, 객관적인 내 위치(Level)를 알기 어려워 동기 부여가 힘들다.

Solution: 'LoL'식 티어 시스템과 커스텀 암장 데이터로 내 위치를 정의하고, AI 기반의 게임화된 트레이닝으로 성장을 유도한다.

1.3 Target Audience
주 3회 이상 등반하며, V-Grade 성장에 목마른 2040 열정적 클라이머.

2. Technical Stack (기술 스택)
   Framework: React Native (Expo) / TypeScript

Backend: Supabase (PostgreSQL, Auth, pgvector)

AI Engine: Google Gemini API (1.5 Pro/Flash)

Constraint: AI 출력은 지정된 Strict JSON Schema를 반드시 준수해야 함.

State Management: Zustand

UI Libraries: dnd-kit (드래그앤드롭), react-native-reanimated (애니메이션), victory-native (차트)

Styling: NativeWind (Tailwind CSS)

3. UX Flow & Key Features (핵심 기능)
   3.1 지능형 온보딩 & 티어 시스템 (Smart Onboarding)
   [Step 0] 안전 동의 (Safety Check - Mandatory)

Action: 앱 진입 시 고강도 훈련 위험성 및 책임 소재에 대한 [동의 서약] 필수 진행. (Skip 불가)

[Step 1] 홈짐 선택 (Select Home Gym)

Guest Option: 하단에 [건너뛰고 앱 둘러보기 (Skip)] 버튼 제공.

Click Action: 유저 상태를 Guest로 설정 후 메인 홈(3.4)으로 즉시 이동.

Selection:

Official: 메이저 암장(더클라임 등) 프리셋 선택.

Community: 유저 생성 암장 검색.

Create: 없는 경우 [새 암장 등록] → 색상-티어 매핑 후 저장.

[Step 2] 티어(Tier) 배정

선택한 홈짐의 색상 중 "1세션 기준 50% 이상 완등 가능한 색상" 선택.

Mapping Logic:

Tier 1 (Silver): 입문/초급 (흰~주)

Tier 2 (Gold): 중급 진입 (초~파)

Tier 3 (Platinum): 중급 숙련 (빨~핑)

Tier 4 (Diamond): 상급 (보라~갈)

Tier 5 (Master): 최상급 (회색)

Tier 6 (Grandmaster): 프로 / 아마최강자 (검정)

[Step 3] 수행 능력 측정 (Assessment)

Phase 1 (Data Check): "1RM 수치를 이미 알고 있나요?"

Yes: Max Hang (kg) 또는 No Hang Lift (kg) 입력.

No: Phase 2 이동.

Phase 2 (Visual Check): "보유 장비를 그림에서 선택해주세요."

Option A: 행보드 이미지 (Max Hang 측정).

Option B: 로딩핀/블럭 이미지 (Lift 측정).

Option C: 둘 다 없음 (측정 Skip, 체중 기반 추정).

Phase 3 (Execution): 장비 선택 시 측정 가이드 루틴 실행.

Logic: 두 종목 모두 측정 시 종목 간 5분 강제 휴식 타이머 작동.

3.2 루틴 빌더 & AI 코칭 (Routine Builder)
Gate Logic: Guest 유저 진입 시 [설정 유도 팝업] 출력 후 차단.

A. 💬 AI Coach (Consultation Mode)
Context Injection: 유저 티어, 체중, 지난 훈련 로그를 Gemini 프롬프트에 주입.

Output: 상담 후 [루틴 제안 카드] 출력.

Action: [이 루틴으로 시작하기] 클릭 시 JSON 데이터가 빌더로 로드됨.

B. 🛠️ Custom Builder (Block Editor)
Block System:

단일 블록: 운동/휴식.

그룹 블록 (Nested Loop): 여러 운동을 묶어 세트 반복 기능 지원.

Visual Aid: 하단에 루틴의 전체 흐름을 보여주는 Visual Timeline 및 TUT(Time Under Tension) 통계 표시.

Actions: 파라미터 수정, 복제, 삭제, 순서 변경 (Drag & Drop).

3.3 듀얼 모드 플레이어 (Player)
A. 타이머 모드 (Auto)
Feedback: Start("삐-"), End("삐-삐-"), Rest End("톡...톡...").

Ready: 5초 카운트다운.

B. 로거 모드 (Manual)
Status: ✅ 성공, ⚠️ 절반, ❌ 실패 버튼 클릭 시 즉시 다음 세트 이동.

C. 세션 관리
Abort: 훈련 중단 버튼 (사유: 부상, 컨디션 난조 등).

End: 모든 세트 완료 시 RPE(1~10) 입력 및 저장.

3.4 데이터 대시보드 & 메인 홈 (Home Dashboard)
[Guest Mode View]

Sticky Banner: 최상단에 [내 티어 확인하고 AI 코칭 받기] 배너 고정. (클릭 시 온보딩 Step 1 이동)

Visuals: 티어 뱃지 위치에 ? 표시, 그래프 영역에 Sample Data 및 안내 문구 표시.

[Regular User View]

Visuals: 현재 티어(Silver~GM) 뱃지, Streak(연속 운동) 불꽃 아이콘, 그래프 표시.

3.5 설정 (Settings)
Profile: 신체 정보(체중) 수정, 홈짐 및 티어 재설정.

Guest 유저에게는 [프로필 완성하기] 진행률 바 노출.

App: 타이머 사운드, 다크 모드.

Account: 로그아웃, 회원 탈퇴.

4. Backend Logic (백엔드 로직)
   [Logic TBD]

주기화 및 오토 레귤레이션 알고리즘은 데이터 수집 후 고도화 예정.

MVP는 정확한 데이터 수집(Logging)과 루틴 수행(Execution)에 집중.

5. Gamification (게이미피케이션)
   Tier Badge: 프로필 및 홈 화면에 화려한 티어 뱃지 노출.

New Best: 기록 갱신 시 Confetti 애니메이션.

Streak: 주간 목표 달성 시 홈 화면 위젯 불꽃 강화.

Mercy Rule: 중단(Abort) 또는 실패 시 격려 메시지 출력.

6. Database Schema (Supabase)
   6.1 users
   id (uuid, PK): Supabase Auth ID

nickname (text): 유저 닉네임

home_gym_id (uuid, FK, Nullable): gyms.id (게스트는 Null)

current_tier (int, Nullable): 1~6 (게스트는 Null)

weight_kg (float, Nullable): 체중

max_hang_1rm (float, Nullable): 측정값

no_hang_lift_1rm (float, Nullable): 측정값

current_streak (int, Default 0): [New] 연속 운동 일수 (UI 표시용)

created_at (timestamp)

6.2 gyms
id (uuid, PK)

name (text, Unique): 암장 이름

is_official (boolean, Default false): 공식/커뮤니티 구분

created_by (uuid, FK, Nullable): 생성자 ID

6.3 gym_grade_scales
id (uuid, PK)

gym_id (uuid, FK): gyms.id

color_name (text): 예: "빨강"

color_hex (text): UI 버튼 색상 코드

tier_level (int): 1~6 (매핑된 티어)

sort_order (int): [New] UI 정렬 순서 (낮은 난이도 0부터 시작)

6.4 routines
id (uuid, PK)

user_id (uuid, FK)

title (text): 루틴 이름

estimated_time (int): [New] 예상 소요 시간(초) - 목록 표시용

total_sets (int): [New] 총 세트 수 - 목록 표시용

structure_json (jsonb): [New] 중첩(Nested) 블록 구조 지원 (Loop Block)

6.5 training_logs
id (uuid, PK)

routine_id (uuid, FK)

user_id (uuid, FK)

status (text): 'completed', 'aborted'

abort_reason (text, Nullable): [New] 중단 사유

rpe (int, Nullable): 1~10

set_results_json (jsonb): 세트별 결과

started_at / ended_at (timestamp)

7. Definition of Done (MVP 필수 조건)
   [ ] Flow: 온보딩 '건너뛰기' 시 Guest 상태로 홈 진입 및 배너 노출 확인.

[ ] Gating: Guest 상태에서 AI 기능 접근 시 설정 팝업 작동 확인.

[ ] Onboarding: 홈짐 검색/등록, 티어 배정(정렬 확인), 장비 그림 선택 및 측정 분기 처리.

[ ] Builder: HTML 레퍼런스를 반영한 비주얼 에디터 및 중첩 세트 구현.

[ ] Database: 위 스키마가 Supabase에 정상적으로 마이그레이션 됨.

[ ] Visuals: 티어 뱃지, 그래프, 컨페티 애니메이션 구현.

[ ] Safety: 시작 전 안전 동의 필수 구현.

8. Post-Launch Plan
   v1.X: 오토 레귤레이션 로직 고도화.

v2.0: 소셜 기능(루틴 공유, 친구 대결), 센서 연동(Web Bluetooth).

v3.0: 하드웨어(GripLab Gear) 출시.
