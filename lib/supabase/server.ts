import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - Clerk 토큰을 Supabase가 자동 검증
 * - auth().getToken()으로 현재 세션 토큰 사용
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = createClerkSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export function createClerkSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey, {
    async accessToken() {
      try {
        // Supabase용 JWT 템플릿 사용 (Storage API 호환성)
        // 템플릿이 설정되지 않은 경우 기본 토큰 사용
        const authInstance = await auth();
        const token = await authInstance.getToken({ template: "supabase" });
        return token ?? (await authInstance.getToken()) ?? null;
      } catch (error) {
        // 템플릿이 없는 경우 기본 토큰으로 폴백
        console.warn("Supabase JWT template not found, using default token:", error);
        const authInstance = await auth();
        return (await authInstance.getToken()) ?? null;
      }
    },
  });
}
