/**
 * @file types/database.ts
 * @description GripLab DB·앱용 타입 정의
 *
 * - Supabase Database 타입 재 export
 * - 테이블 Row 별칭 (Profile, Gym, Routine, TrainingLog 등)
 * - JSON 컬럼용 앱 타입 (RoutineBlock, SetResult)
 *
 * @see database.types.ts (Supabase gen types 또는 수동 유지)
 * @see supabase/migrations/setup_schema.sql
 */

import type { Database } from "../database.types";

// --- Supabase public 스키마 테이블 Row 타입 별칭 ---

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Gym = Database["public"]["Tables"]["gyms"]["Row"];
export type GymInsert = Database["public"]["Tables"]["gyms"]["Insert"];
export type GymUpdate = Database["public"]["Tables"]["gyms"]["Update"];

export type GymGradeScale = Database["public"]["Tables"]["gym_grade_scales"]["Row"];
export type GymGradeScaleInsert = Database["public"]["Tables"]["gym_grade_scales"]["Insert"];
export type GymGradeScaleUpdate = Database["public"]["Tables"]["gym_grade_scales"]["Update"];

export type Routine = Database["public"]["Tables"]["routines"]["Row"];
export type RoutineInsert = Database["public"]["Tables"]["routines"]["Insert"];
export type RoutineUpdate = Database["public"]["Tables"]["routines"]["Update"];

export type TrainingLog = Database["public"]["Tables"]["training_logs"]["Row"];
export type TrainingLogInsert = Database["public"]["Tables"]["training_logs"]["Insert"];
export type TrainingLogUpdate = Database["public"]["Tables"]["training_logs"]["Update"];

export type TrainingStatus = Database["public"]["Enums"]["training_status"];

// --- routines.structure_json 용 앱 타입 (중첩 블록) ---

/** 루틴 구조 내 단일 블록 (예: 세트 그룹, 루프 블록) */
export interface RoutineBlock {
  type: string;
  /** 중첩 블록 (Loop Block 등) */
  children?: RoutineBlock[];
  [key: string]: unknown;
}

// --- training_logs.set_results_json 용 앱 타입 (세트별 결과) ---

/** 세트별 기록 결과 한 건 */
export interface SetResult {
  /** 세트 번호 또는 식별자 */
  setIndex?: number;
  /** 완등 여부 등 */
  completed?: boolean;
  [key: string]: unknown;
}

// --- Database 타입 재 export (Supabase 클라이언트 제네릭용) ---

export type { Database };
