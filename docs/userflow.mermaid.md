# GripLab 유저플로우 (User Flow)

> 이 문서는 GripLab 앱의 전체 사용자 흐름을 Mermaid 다이어그램으로 정의합니다.
>
> **Version**: v1.6
> **Last Updated**: 2026-02-03
> **기반 문서**: PRD.md, setup_schema.sql

---

## 1. 전체 앱 플로우 (Overview)

```mermaid
flowchart TB
    subgraph Entry["🚀 앱 진입"]
        A[앱 시작] --> B{로그인 상태?}
        B -->|로그인됨| C{온보딩 완료?}
        B -->|비로그인| D[로그인/회원가입]
        D --> E{안전 동의 완료?}
        E -->|아니오| F[안전 동의 화면]
        F --> G[온보딩 시작]
        E -->|예| G
    end

    subgraph Onboarding["📋 온보딩 플로우"]
        G --> H[Step 1: 홈짐 선택]
        H -->|건너뛰기| I[Guest 모드]
        H -->|선택 완료| J[Step 2: 티어 배정]
        J --> K[Step 3: 수행 능력 측정]
        K --> L[Regular User]
    end

    subgraph Main["🏠 메인 앱"]
        C -->|완료| M[메인 홈]
        C -->|미완료| G
        I --> M
        L --> M

        M --> N[루틴 빌더]
        M --> O[훈련 플레이어]
        M --> P[대시보드]
        M --> Q[설정]
    end

    style Entry fill:#e1f5fe
    style Onboarding fill:#fff3e0
    style Main fill:#e8f5e9
```

---

## 2. 온보딩 상세 플로우 (Onboarding Flow)

```mermaid
flowchart TD
    subgraph Step0["🛡️ Step 0: 안전 동의"]
        A[앱 최초 진입] --> B[안전 동의 화면]
        B --> |동의 필수| C{동의함?}
        C -->|Yes| D[다음 단계]
        C -->|No| B
    end

    subgraph Step1["🏢 Step 1: 홈짐 선택"]
        D --> E[홈짐 선택 화면]
        E --> F{선택 방식?}
        F -->|건너뛰기| G["Guest 모드<br/>(home_gym_id = null)"]
        F -->|Official| H[메이저 암장 선택]
        F -->|Community| I[커뮤니티 암장 검색]
        F -->|Create| J[새 암장 등록]

        H --> K[암장 선택 완료]
        I --> K
        J --> L[색상-티어 매핑 설정]
        L --> K
    end

    subgraph Step2["🏆 Step 2: 티어 배정"]
        K --> M[티어 선택 화면]
        M --> N["50% 완등 가능<br/>색상 선택"]
        N --> O{선택한 색상}

        O -->|"흰~주"| P1["Tier 1 (Silver)"]
        O -->|"초~파"| P2["Tier 2 (Gold)"]
        O -->|"빨~핑"| P3["Tier 3 (Platinum)"]
        O -->|"보라~갈"| P4["Tier 4 (Diamond)"]
        O -->|"회색"| P5["Tier 5 (Master)"]
        O -->|"검정"| P6["Tier 6 (Grandmaster)"]

        P1 --> Q[티어 배정 완료]
        P2 --> Q
        P3 --> Q
        P4 --> Q
        P5 --> Q
        P6 --> Q
    end

    subgraph Step3["📊 Step 3: 수행 능력 측정"]
        Q --> R[측정 시작]
        R --> S{1RM 수치 보유?}
        S -->|Yes| T[Max Hang/Lift 입력]
        S -->|No| U[장비 선택 화면]

        U --> V{보유 장비?}
        V -->|행보드| W[Max Hang 측정]
        V -->|로딩핀/블럭| X[No Hang Lift 측정]
        V -->|둘 다 없음| Y[체중 기반 추정]

        T --> Z[측정 완료]
        W --> AA{추가 측정?}
        X --> AA
        AA -->|Yes| AB[5분 휴식 타이머]
        AB --> AC[다른 종목 측정]
        AA -->|No| Z
        AC --> Z
        Y --> Z

        Z --> AD[온보딩 완료 → 메인 홈]
    end

    G --> AE[Guest로 메인 홈]

    style Step0 fill:#ffcdd2
    style Step1 fill:#ffe0b2
    style Step2 fill:#fff9c4
    style Step3 fill:#c8e6c9
```

---

## 3. 메인 홈 & 대시보드 (Home Dashboard)

```mermaid
flowchart TD
    subgraph Home["🏠 메인 홈"]
        A[메인 홈 진입] --> B{유저 타입?}

        B -->|Guest| C[Guest View]
        B -->|Regular| D[Regular View]

        subgraph GuestView["👤 Guest 화면"]
            C --> C1["상단 배너:<br/>'내 티어 확인하고 AI 코칭 받기'"]
            C --> C2["티어 뱃지: ? 표시"]
            C --> C3["그래프: Sample Data"]
            C1 -->|클릭| C4[온보딩 Step 1 이동]
        end

        subgraph RegularView["✨ Regular 화면"]
            D --> D1[티어 뱃지 표시]
            D --> D2["Streak 불꽃 아이콘"]
            D --> D3[실제 성과 그래프]
            D --> D4[최근 훈련 기록]
        end
    end

    subgraph Navigation["📱 네비게이션"]
        E[하단 탭바]
        E --> F[🏠 홈]
        E --> G[🛠️ 루틴]
        E --> H[▶️ 플레이어]
        E --> I[⚙️ 설정]
    end

    style GuestView fill:#fff3e0
    style RegularView fill:#e3f2fd
```

---

## 4. 루틴 빌더 플로우 (Routine Builder)

```mermaid
flowchart TD
    subgraph Entry["진입점"]
        A[루틴 빌더 진입] --> B{유저 타입?}
        B -->|Guest| C[설정 유도 팝업]
        C -->|확인| D[온보딩 이동]
        C -->|취소| E[홈으로 돌아감]
        B -->|Regular| F[루틴 빌더 메인]
    end

    subgraph Builder["🛠️ 루틴 빌더"]
        F --> G{빌드 방식?}

        G -->|AI Coach| H[💬 AI 상담 모드]
        G -->|Custom| I[🔧 커스텀 빌더]

        subgraph AIMode["AI Coach"]
            H --> H1["Context 주입:<br/>티어, 체중, 훈련 로그"]
            H1 --> H2[Gemini API 호출]
            H2 --> H3[루틴 제안 카드 출력]
            H3 --> H4{액션?}
            H4 -->|이 루틴으로 시작| H5[JSON → 빌더 로드]
            H4 -->|다시 상담| H2
        end

        subgraph CustomMode["Custom Builder"]
            I --> I1[블록 에디터]
            I1 --> I2[단일 블록 추가]
            I1 --> I3["그룹 블록 추가<br/>(Nested Loop)"]
            I2 --> I4[파라미터 설정]
            I3 --> I4
            I4 --> I5["Visual Timeline<br/>+ TUT 통계"]
        end

        H5 --> J[루틴 편집]
        I5 --> J

        J --> K{액션?}
        K -->|저장| L["DB 저장<br/>(routines 테이블)"]
        K -->|복제| M[루틴 복제]
        K -->|삭제| N[루틴 삭제]
        K -->|실행| O[플레이어 이동]
    end

    style AIMode fill:#e1bee7
    style CustomMode fill:#b3e5fc
```

---

## 5. 훈련 플레이어 플로우 (Training Player)

```mermaid
flowchart TD
    subgraph Start["▶️ 훈련 시작"]
        A[루틴 선택] --> B[5초 Ready 카운트다운]
        B --> C{모드 선택}
    end

    subgraph TimerMode["⏱️ 타이머 모드 (Auto)"]
        C -->|Timer| D[운동 시작]
        D --> E["Start 사운드<br/>'삐-'"]
        E --> F[운동 진행]
        F --> G["End 사운드<br/>'삐-삐-'"]
        G --> H[휴식 시작]
        H --> I["Rest End 사운드<br/>'톡...톡...'"]
        I --> J{다음 세트?}
        J -->|Yes| D
        J -->|No| K[세션 종료]
    end

    subgraph LoggerMode["📝 로거 모드 (Manual)"]
        C -->|Logger| L[운동 시작]
        L --> M{수행 결과?}
        M -->|✅ 성공| N[다음 세트]
        M -->|⚠️ 절반| N
        M -->|❌ 실패| N
        N --> O{다음 세트?}
        O -->|Yes| L
        O -->|No| K
    end

    subgraph SessionEnd["🏁 세션 종료"]
        K --> P{종료 유형?}
        P -->|정상 완료| Q[RPE 입력 (1~10)]
        P -->|중단 Abort| R[중단 사유 선택]

        Q --> S["training_logs 저장<br/>status: 'completed'"]
        R --> T["training_logs 저장<br/>status: 'aborted'"]

        S --> U{기록 갱신?}
        T --> V[격려 메시지 출력]
        U -->|Yes| W[🎉 Confetti 애니메이션]
        U -->|No| X[결과 화면]
        W --> X
        V --> X

        X --> Y[메인 홈 이동]
    end

    style TimerMode fill:#c5cae9
    style LoggerMode fill:#dcedc8
    style SessionEnd fill:#ffe0b2
```

---

## 6. 설정 플로우 (Settings)

```mermaid
flowchart TD
    subgraph Settings["⚙️ 설정"]
        A[설정 화면] --> B{섹션 선택}

        B --> C[👤 Profile]
        B --> D[📱 App]
        B --> E[🔐 Account]

        subgraph Profile["프로필 설정"]
            C --> C1[체중 수정]
            C --> C2[홈짐 재설정]
            C --> C3[티어 재설정]
            C --> C4{Guest 유저?}
            C4 -->|Yes| C5["'프로필 완성하기'<br/>진행률 바"]
            C5 --> C6[온보딩 Step 1]
        end

        subgraph AppSettings["앱 설정"]
            D --> D1[타이머 사운드 설정]
            D --> D2[다크/라이트 모드]
        end

        subgraph AccountSettings["계정 설정"]
            E --> E1[로그아웃]
            E --> E2[회원 탈퇴]
            E2 --> E3{확인?}
            E3 -->|Yes| E4["프로필 삭제<br/>(cascade)"]
            E3 -->|No| A
        end
    end

    style Profile fill:#bbdefb
    style AppSettings fill:#c8e6c9
    style AccountSettings fill:#ffcdd2
```

---

## 7. 데이터 플로우 (Data Flow)

```mermaid
flowchart LR
    subgraph Client["📱 클라이언트"]
        A[사용자 입력]
    end

    subgraph Auth["🔐 인증"]
        B[Supabase Auth]
    end

    subgraph Database["💾 데이터베이스"]
        C[(profiles)]
        D[(gyms)]
        E[(gym_grade_scales)]
        F[(routines)]
        G[(training_logs)]
    end

    subgraph AI["🤖 AI"]
        H[Gemini API]
    end

    A -->|로그인| B
    B -->|회원가입 트리거| C

    A -->|홈짐 등록| D
    D -->|색상 설정| E

    A -->|루틴 생성| F
    A -->|AI 상담| H
    H -->|루틴 제안| F

    A -->|훈련 완료| G

    C -->|참조| D
    F -->|참조| C
    G -->|참조| C
    G -->|참조| F

    style Database fill:#e8eaf6
    style AI fill:#f3e5f5
```

---

## 8. 유저 상태 전이 다이어그램 (User State Transition)

```mermaid
stateDiagram-v2
    [*] --> Anonymous: 앱 설치
    Anonymous --> SafetyAgreed: 안전 동의 완료
    SafetyAgreed --> Guest: 온보딩 건너뛰기
    SafetyAgreed --> OnboardingStep1: 홈짐 선택 시작

    OnboardingStep1 --> OnboardingStep2: 홈짐 선택 완료
    OnboardingStep2 --> OnboardingStep3: 티어 배정 완료
    OnboardingStep3 --> RegularUser: 측정 완료

    Guest --> OnboardingStep1: 프로필 완성하기

    RegularUser --> ActiveTraining: 훈련 시작
    ActiveTraining --> RegularUser: 훈련 종료

    RegularUser --> Guest: 홈짐 초기화
    Guest --> [*]: 회원 탈퇴
    RegularUser --> [*]: 회원 탈퇴

    note right of Guest
        - home_gym_id: null
        - current_tier: null
        - AI 기능 제한
    end note

    note right of RegularUser
        - home_gym_id: UUID
        - current_tier: 1~6
        - 전체 기능 접근
    end note
```

---

## 9. Gate Logic (접근 제어)

```mermaid
flowchart TD
    subgraph GateCheck["🚧 Gate Logic"]
        A[기능 접근 시도] --> B{기능 유형?}

        B -->|공개 기능| C[✅ 접근 허용]
        B -->|인증 필요| D{로그인됨?}
        B -->|온보딩 필요| E{온보딩 완료?}

        D -->|No| F[로그인 화면]
        D -->|Yes| G[✅ 접근 허용]

        E -->|No| H["설정 유도 팝업<br/>'프로필을 완성해주세요'"]
        E -->|Yes| I[✅ 접근 허용]

        H -->|확인| J[온보딩 Step 1]
        H -->|취소| K[이전 화면]
    end

    subgraph Features["기능별 Gate"]
        L[메인 홈] -->|공개| C
        M[대시보드 보기] -->|공개| C
        N[루틴 빌더] -->|온보딩 필요| E
        O[AI Coach] -->|온보딩 필요| E
        P[훈련 플레이어] -->|온보딩 필요| E
        Q[설정] -->|인증 필요| D
    end

    style GateCheck fill:#fff9c4
```

---

## 변경 이력

| 버전 | 날짜       | 변경 내용                       |
| ---- | ---------- | ------------------------------- |
| v1.0 | 2026-02-03 | 초기 유저플로우 다이어그램 작성 |
