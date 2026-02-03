/**
 * Supabase DB 타입 (public 스키마)
 *
 * 수동 유지: 스키마 변경 시 이 파일을 동기화하거나,
 * `pnpm run gen:types` (supabase login 후) 로 재생성 가능.
 * @see supabase/migrations/setup_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TrainingStatus = "completed" | "aborted";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string | null;
          weight_kg: number | null;
          current_tier: number | null;
          home_gym_id: string | null;
          max_hang_1rm: number | null;
          no_hang_lift_1rm: number | null;
          current_streak: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          nickname?: string | null;
          weight_kg?: number | null;
          current_tier?: number | null;
          home_gym_id?: string | null;
          max_hang_1rm?: number | null;
          no_hang_lift_1rm?: number | null;
          current_streak?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          nickname?: string | null;
          weight_kg?: number | null;
          current_tier?: number | null;
          home_gym_id?: string | null;
          max_hang_1rm?: number | null;
          no_hang_lift_1rm?: number | null;
          current_streak?: number;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      gyms: {
        Row: {
          id: string;
          name: string;
          is_official: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          is_official?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          is_official?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };
      gym_grade_scales: {
        Row: {
          id: string;
          gym_id: string;
          color_name: string;
          color_hex: string;
          tier_level: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          color_name: string;
          color_hex: string;
          tier_level: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          color_name?: string;
          color_hex?: string;
          tier_level?: number;
          sort_order?: number;
          created_at?: string;
        };
      };
      routines: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          estimated_time: number;
          total_sets: number;
          structure_json: Json;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          estimated_time?: number;
          total_sets?: number;
          structure_json?: Json;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          estimated_time?: number;
          total_sets?: number;
          structure_json?: Json;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      training_logs: {
        Row: {
          id: string;
          user_id: string;
          routine_id: string | null;
          status: TrainingStatus;
          abort_reason: string | null;
          rpe: number | null;
          set_results_json: Json;
          started_at: string;
          ended_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          routine_id?: string | null;
          status: TrainingStatus;
          abort_reason?: string | null;
          rpe?: number | null;
          set_results_json?: Json;
          started_at?: string;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          routine_id?: string | null;
          status?: TrainingStatus;
          abort_reason?: string | null;
          rpe?: number | null;
          set_results_json?: Json;
          started_at?: string;
          ended_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_griplab_schema_checks: {
        Args: Record<string, never>;
        Returns: {
          trigger_on_auth_user_created: boolean;
          rls: Record<string, boolean>;
        };
      };
    };
    Enums: {
      training_status: TrainingStatus;
    };
  };
}
