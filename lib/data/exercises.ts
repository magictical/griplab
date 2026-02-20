export type ExerciseCategory = "hangboard" | "lift" | "pullup" | "core";

export interface ExerciseDef {
  id: string;
  title: string;
  category: ExerciseCategory;
  description: string;
  icon: string;
  defaultDuration: number;
}

export const EXERCISE_CATEGORIES: { id: ExerciseCategory; label: string }[] = [
  { id: "hangboard", label: "행보드" },
  { id: "lift", label: "리프트" },
  { id: "pullup", label: "턱걸이" },
  { id: "core", label: "코어" },
];

export const EXERCISES: ExerciseDef[] = [
  // 행보드 (Hangboard)
  {
    id: "max_hangs",
    title: "맥스 행 (Max Hangs)",
    category: "hangboard",
    description: "최대 중량 10초 매달리기",
    icon: "hand",
    defaultDuration: 10,
  },
  {
    id: "repeaters",
    title: "리피터 (Repeaters)",
    category: "hangboard",
    description: "7초 매달리고 3초 휴식 반복",
    icon: "repeat",
    defaultDuration: 7,
  },
  {
    id: "minimum_edge",
    title: "미니멈 엣지 (Minimum Edge)",
    category: "hangboard",
    description: "가장 작은 홀드에서 버티기",
    icon: "minus",
    defaultDuration: 10,
  },
  {
    id: "density_hangs",
    title: "덴시티 행 (Density Hangs)",
    category: "hangboard",
    description: "30초 이상 저강도 지속 매달리기",
    icon: "timer",
    defaultDuration: 30,
  },
  {
    id: "one_arm_hang",
    title: "원 암 행 (One Arm Hang)",
    category: "hangboard",
    description: "한 팔로 체중 버티기",
    icon: "dumbbell",
    defaultDuration: 5,
  },

  // 리프트 (Lift)
  {
    id: "no_hang_lift",
    title: "노행 리프트 (No-Hang Lift)",
    category: "lift",
    description: "핀치/엣지 블럭 들어올리기",
    icon: "dumbbell",
    defaultDuration: 10,
  },

  // 턱걸이 (Pull-up)
  {
    id: "pull_ups",
    title: "풀업 (Pull-ups)",
    category: "pullup",
    description: "등/이두 기본 단련",
    icon: "arrow-up",
    defaultDuration: 30,
  },
  {
    id: "lock_offs",
    title: "락오프 (Lock-offs)",
    category: "pullup",
    description: "홀드에서 특정 각도로 버티기",
    icon: "lock",
    defaultDuration: 15,
  },

  // 코어 (Core)
  {
    id: "plank",
    title: "플랭크 (Plank)",
    category: "core",
    description: "전신 코어 버티기",
    icon: "activity",
    defaultDuration: 60,
  },
  {
    id: "hanging_leg_raise",
    title: "행잉 레그레이즈 (Hanging Leg Raise)",
    category: "core",
    description: "오버행 복근 단련",
    icon: "arrow-up-right",
    defaultDuration: 40,
  },
];
