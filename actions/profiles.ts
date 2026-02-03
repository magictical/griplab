"use server";

import { auth } from "@clerk/nextjs/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * 현재 로그인 사용자의 홈짐을 설정합니다.
 * Clerk users 테이블의 home_gym_id를 업데이트합니다.
 * 비로그인 시 호출하면 오류 반환.
 */
export async function setHomeGym(gymId: string | null): Promise<{ error: string | null }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "로그인이 필요합니다." };
    }

    const supabase = getServiceRoleClient();

    const { error } = await supabase
      .from("users")
      .update({ home_gym_id: gymId })
      .eq("clerk_id", userId);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "setHomeGym failed";
    return { error: message };
  }
}
