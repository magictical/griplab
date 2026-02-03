/**
 * Supabase 데이터베이스 상태 확인 API
 *
 * GET /api/check-db
 *
 * 데이터베이스의 테이블, 데이터, Storage 버킷 정보를 반환합니다.
 */

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = getServiceRoleClient();
    const result: {
      tables: {
        users: {
          exists: boolean;
          count: number;
          data?: any[];
          error?: string;
        };
      };
      storage: {
        buckets: any[];
        storageFiles?: any[];
        error?: string;
      };
      summary: {
        totalUsers: number;
        totalBuckets: number;
        totalFiles: number;
      };
    } = {
      tables: {
        users: {
          exists: false,
          count: 0,
        },
      },
      storage: {
        buckets: [],
      },
      summary: {
        totalUsers: 0,
        totalBuckets: 0,
        totalFiles: 0,
      },
    };

    // 1. users 테이블 확인
    const {
      data: users,
      error: usersError,
      count,
    } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(10);

    if (usersError) {
      result.tables.users.error = usersError.message;
    } else {
      result.tables.users.exists = true;
      result.tables.users.count = count || 0;
      result.tables.users.data = users || [];
      result.summary.totalUsers = count || 0;
    }

    // 2. Storage 버킷 확인
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      result.storage.error = bucketsError.message;
    } else {
      result.storage.buckets = buckets || [];
      result.summary.totalBuckets = buckets?.length || 0;

      // 3. data-griplab 버킷의 파일 확인
      const storageBucket = buckets?.find((b) => b.name === "data-griplab");
      if (storageBucket) {
        const { data: files, error: filesError } = await supabase.storage
          .from("data-griplab")
          .list("", {
            limit: 100,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (!filesError && files) {
          result.storage.storageFiles = files;
          result.summary.totalFiles = files.length;
        }
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Database check error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "데이터베이스 확인 중 오류 발생",
      },
      { status: 500 },
    );
  }
}
