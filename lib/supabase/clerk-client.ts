"use client";

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * Storage API 호환성을 위해 Supabase JWT 템플릿을 사용합니다.
 *
 * 참고: Clerk Dashboard에서 Supabase JWT 템플릿을 설정해야 할 수 있습니다.
 * https://clerk.com/docs/guides/development/integrations/databases/supabase
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *
 *   async function fetchData() {
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { getToken } = useAuth();

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseKey, {
      async accessToken() {
        try {
          // Supabase용 JWT 템플릿 사용 (Storage API 호환성)
          // 템플릿이 설정되지 않은 경우 기본 토큰 사용
          const token = await getToken({ template: "supabase" });
          return token ?? (await getToken()) ?? null;
        } catch (error) {
          // 템플릿이 없는 경우 기본 토큰으로 폴백
          console.warn(
            "Supabase JWT template not found, using default token:",
            error,
          );
          return (await getToken()) ?? null;
        }
      },
    });
  }, [getToken]);

  return supabase;
}
