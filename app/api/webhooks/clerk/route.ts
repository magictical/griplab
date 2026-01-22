import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Clerk 웹훅 엔드포인트
 *
 * Clerk에서 발생하는 이벤트(user.created, user.updated, user.deleted)를 받아서
 * Supabase users 테이블에 자동으로 동기화합니다.
 *
 * 처리하는 이벤트:
 * - user.created: 새 사용자 생성 시 Supabase에 추가
 * - user.updated: 사용자 정보 업데이트 시 Supabase에 반영
 * - user.deleted: 사용자 삭제 시 Supabase에서 삭제 및 Storage 파일 정리
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
    console.log(`[Webhook] Received event: ${eventType}`, {
      id: evt.data.id,
      timestamp: evt.timestamp,
    });

    // 사용자 생성/업데이트 이벤트 처리
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
        console.error("[Webhook] Supabase sync error:", {
          event: eventType,
          clerk_id: clerkUser.id,
          error: error.message,
          code: error.code,
        });
        return NextResponse.json(
          {
            error: "Failed to sync user",
            details: error.message,
            event: eventType,
          },
          { status: 500 }
        );
      }

      console.log(`[Webhook] User synced successfully:`, {
        event: eventType,
        clerk_id: clerkUser.id,
        supabase_id: data?.id,
      });

      return NextResponse.json({
        success: true,
        event: eventType,
        user: data,
      });
    }

    // 사용자 삭제 이벤트 처리
    if (eventType === "user.deleted") {
      const deletedUser = evt.data;
      const clerkUserId = deletedUser.id;

      console.log(`[Webhook] User deleted event received:`, {
        clerk_id: clerkUserId,
      });

      const supabase = getServiceRoleClient();
      const storageBucket =
        process.env.NEXT_PUBLIC_STORAGE_BUCKET || "data-griplab";

      try {
        // 1. Storage에서 사용자 파일 삭제 (있는 경우)
        try {
          const { data: files, error: listError } = await supabase.storage
            .from(storageBucket)
            .list(clerkUserId);

          if (!listError && files && files.length > 0) {
            // 사용자 폴더의 모든 파일 삭제
            const filePaths = files.map((file) => `${clerkUserId}/${file.name}`);
            const { error: deleteStorageError } = await supabase.storage
              .from(storageBucket)
              .remove(filePaths);

            if (deleteStorageError) {
              console.warn("[Webhook] Storage deletion warning:", {
                clerk_id: clerkUserId,
                error: deleteStorageError.message,
              });
              // Storage 삭제 실패해도 계속 진행 (사용자 삭제는 중요)
            } else {
              console.log(`[Webhook] Storage files deleted:`, {
                clerk_id: clerkUserId,
                file_count: files.length,
              });
            }
          }
        } catch (storageError) {
          console.warn("[Webhook] Storage deletion error (non-critical):", {
            clerk_id: clerkUserId,
            error: storageError instanceof Error ? storageError.message : "Unknown error",
          });
          // Storage 삭제 실패해도 계속 진행
        }

        // 2. Supabase에서 사용자 삭제
        const { error: deleteError } = await supabase
          .from("users")
          .delete()
          .eq("clerk_id", clerkUserId);

        if (deleteError) {
          // 사용자가 이미 삭제되었거나 존재하지 않는 경우도 성공으로 처리
          if (deleteError.code === "PGRST116") {
            console.log(`[Webhook] User already deleted or not found:`, {
              clerk_id: clerkUserId,
            });
            return NextResponse.json({
              success: true,
              event: eventType,
              message: "User already deleted or not found",
            });
          }

          console.error("[Webhook] Supabase delete error:", {
            event: eventType,
            clerk_id: clerkUserId,
            error: deleteError.message,
            code: deleteError.code,
          });
          return NextResponse.json(
            {
              error: "Failed to delete user",
              details: deleteError.message,
              event: eventType,
            },
            { status: 500 }
          );
        }

        console.log(`[Webhook] User deleted successfully:`, {
          event: eventType,
          clerk_id: clerkUserId,
        });

        return NextResponse.json({
          success: true,
          event: eventType,
          message: "User deleted successfully",
        });
      } catch (error) {
        console.error("[Webhook] Unexpected error during user deletion:", {
          event: eventType,
          clerk_id: clerkUserId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        return NextResponse.json(
          {
            error: "Failed to delete user",
            details: error instanceof Error ? error.message : "Unknown error",
            event: eventType,
          },
          { status: 500 }
        );
      }
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
