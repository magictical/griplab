"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type { Gym, GymGradeScale, GymInsert, GymGradeScaleInsert } from "@/types/database";
import { LOGIN_REQUIRED_MESSAGE } from "@/constants/auth";

/** createGymWithScales용 scale 한 건 (tier_level 1~6) */
export type GymScaleInput = {
  color_name: string;
  color_hex: string;
  tier_level: 1 | 2 | 3 | 4 | 5 | 6;
  sort_order: number;
};

/**
 * 암장의 색상-티어 스케일 목록 조회 (sort_order 오름차순)
 * 티어 배정 페이지에서 ColorGrid용.
 */
export async function getScalesByGymId(
  gymId: string,
): Promise<{ data: GymGradeScale[] | null; error: string | null }> {
  try {
    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from("gym_grade_scales")
      .select("id, gym_id, color_name, color_hex, tier_level, sort_order")
      .eq("gym_id", gymId)
      .order("sort_order", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: (data as GymGradeScale[]) ?? [], error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "getScalesByGymId failed";
    return { data: null, error: message };
  }
}

/**
 * 암장 목록 조회 (검색 옵션)
 * RLS: gyms는 전체 공개 읽기 가능
 */
export async function getGyms(search?: string): Promise<{ data: Gym[] | null; error: string | null }> {
  try {
    const supabase = createClerkSupabaseClient();
    let query = supabase.from("gyms").select("id, name, is_official, created_by, created_at").order("is_official", { ascending: false }).order("name");

    if (search && search.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: (data as Gym[]) ?? [], error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "getGyms failed";
    return { data: null, error: message };
  }
}

/**
 * 새 암장 생성 (커뮤니티 암장)
 * Clerk 로그인 확인 후 service role로 insert (RLS 우회). Clerk JWT만으로는 Supabase auth.role()이 'authenticated'로 인식되지 않을 수 있음.
 */
export async function createGym(data: { name: string; is_official?: boolean }): Promise<{ data: Gym | null; error: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { data: null, error: LOGIN_REQUIRED_MESSAGE };
    }
    const supabase = getServiceRoleClient();
    const insert: GymInsert = {
      name: data.name.trim(),
      is_official: data.is_official ?? false,
    };

    const { data: row, error } = await supabase.from("gyms").insert(insert).select().single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: row as Gym, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "createGym failed";
    return { data: null, error: message };
  }
}

/**
 * 암장 + 색상-티어 스케일 한 번에 생성 (커뮤니티 암장)
 * Clerk 로그인 확인 후 service role로 insert (RLS 우회). 1) gym insert → 2) gym_grade_scales bulk insert.
 */
export async function createGymWithScales(
  gymData: { name: string },
  scales: GymScaleInput[],
): Promise<{ data: Gym | null; error: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { data: null, error: LOGIN_REQUIRED_MESSAGE };
    }
    const supabase = getServiceRoleClient();
    const name = gymData.name.trim();
    if (!name) {
      return { data: null, error: "암장 이름을 입력하세요." };
    }

    const gymInsert: GymInsert = {
      name,
      is_official: false,
    };
    const { data: gym, error: gymError } = await supabase
      .from("gyms")
      .insert(gymInsert)
      .select()
      .single();

    if (gymError || !gym) {
      return { data: null, error: gymError?.message ?? "암장 생성에 실패했습니다." };
    }

    if (scales.length === 0) {
      return { data: gym as Gym, error: null };
    }

    const scaleRows: GymGradeScaleInsert[] = scales.map((s) => ({
      gym_id: gym.id,
      color_name: s.color_name,
      color_hex: s.color_hex,
      tier_level: s.tier_level,
      sort_order: s.sort_order ?? 0,
    }));

    const { error: scalesError } = await supabase.from("gym_grade_scales").insert(scaleRows);

    if (scalesError) {
      return { data: null, error: scalesError.message };
    }
    return { data: gym as Gym, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "createGymWithScales failed";
    return { data: null, error: message };
  }
}
