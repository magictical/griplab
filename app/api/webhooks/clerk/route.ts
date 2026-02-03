import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Clerk 웹훅 엔드포인트
 *
 * Clerk에서 발생하는 이벤트(user.created, user.updated 등)를 받아서
 * Supabase users 테이블에 자동으로 동기화합니다.
 *
 * @see https://clerk.com/docs/guides/development/webhooks/syncing
 */

// Next.js 15에서는 body parsing이 자동으로 처리되지만,
// 웹훅 검증을 위해 raw body가 필요할 수 있습니다.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 웹훅 서명 검증
    // CLERK_WEBHOOK_SIGNING_SECRET 환경 변수가 필요합니다
    // 환경 변수가 없으면 자동으로 에러가 발생합니다
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    console.log(`[Webhook] Received event: ${eventType}`, { id: evt.data.id });

    // 사용자 관련 이벤트 처리
    if (eventType === "user.created" || eventType === "user.updated") {
      const clerkUser = evt.data;

      // Supabase에 사용자 정보 동기화
      const supabase = getServiceRoleClient();

      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            clerk_id: clerkUser.id,
            name:
              clerkUser.first_name && clerkUser.last_name
                ? `${clerkUser.first_name} ${clerkUser.last_name}`
                : clerkUser.username ||
                  clerkUser.email_addresses?.[0]?.email_address ||
                  "Unknown",
          },
          {
            onConflict: "clerk_id",
          }
        )
        .select()
        .single();

      if (error) {
        console.error("[Webhook] Supabase sync error:", error);
        return NextResponse.json(
          {
            error: "Failed to sync user",
            details: error.message,
          },
          { status: 500 }
        );
      }

      console.log(`[Webhook] User synced successfully:`, {
        clerk_id: clerkUser.id,
        supabase_id: data?.id,
      });

      return NextResponse.json({
        success: true,
        event: eventType,
        user: data,
      });
    }

    // 다른 이벤트 타입은 로그만 남기고 성공 응답
    console.log(`[Webhook] Event ${eventType} received but not handled`);
    return NextResponse.json({
      success: true,
      event: eventType,
      message: "Event received but not processed",
    });
  } catch (error) {
    console.error("[Webhook] Verification error:", error);

    // 에러 상세 정보 로깅
    if (error instanceof Error) {
      console.error("[Webhook] Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: "Webhook verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
