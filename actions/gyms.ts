"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type { Gym, GymInsert } from "@/types/database";

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
 * RLS: authenticated 사용자만 insert 가능
 */
export async function createGym(data: { name: string; is_official?: boolean }): Promise<{ data: Gym | null; error: string | null }> {
  try {
    const supabase = createClerkSupabaseClient();
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
