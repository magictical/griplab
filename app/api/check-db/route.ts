/**
 * Supabase 데이터베이스 상태 확인 API
 *
 * GET /api/check-db
 *
 * GripLab 스키마(profiles, gyms, gym_grade_scales, routines, training_logs) 및
 * Clerk 동기화용 users 테이블, Storage 버킷 정보를 반환합니다.
 *
 * @see docs/db-migration.md
 */

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { NextResponse } from "next/server";

const GRIPLAB_TABLES = [
  "profiles",
  "gyms",
  "gym_grade_scales",
  "routines",
  "training_logs",
] as const;

type GriplabTableName = (typeof GRIPLAB_TABLES)[number];

interface TableCheckResult {
  exists: boolean;
  count: number;
  data?: unknown[];
  error?: string;
}

async function checkTable(
  supabase: ReturnType<typeof getServiceRoleClient>,
  tableName: string,
): Promise<TableCheckResult> {
  const { data, error, count } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true })
    .limit(10);

  if (error) {
    return { exists: false, count: 0, error: error.message };
  }
  return {
    exists: true,
    count: count ?? 0,
    data: (data ?? []) as unknown[],
  };
}

export async function GET() {
  try {
    const supabase = getServiceRoleClient();

    const result: {
      tables: {
        griplab: Record<GriplabTableName, TableCheckResult>;
        users: TableCheckResult & { note?: string };
      };
      schemaChecks?: {
        trigger_on_auth_user_created: boolean | null;
        rls: Record<string, boolean> | null;
      };
      storage: {
        buckets: unknown[];
        storageFiles?: unknown[];
        error?: string;
      };
      summary: {
        griplabTablesOk: number;
        totalGriplabTables: number;
        usersExists: boolean;
        totalBuckets: number;
        totalFiles: number;
      };
    } = {
      tables: {
        griplab: {
          profiles: { exists: false, count: 0 },
          gyms: { exists: false, count: 0 },
          gym_grade_scales: { exists: false, count: 0 },
          routines: { exists: false, count: 0 },
          training_logs: { exists: false, count: 0 },
        },
        users: { exists: false, count: 0, note: "Clerk 동기화용 (legacy)" },
      },
      storage: { buckets: [] },
      summary: {
        griplabTablesOk: 0,
        totalGriplabTables: GRIPLAB_TABLES.length,
        usersExists: false,
        totalBuckets: 0,
        totalFiles: 0,
      },
    };

    // 1. GripLab 스키마 테이블 5개 확인
    for (const tableName of GRIPLAB_TABLES) {
      const res = await checkTable(supabase, tableName);
      result.tables.griplab[tableName] = res;
      if (res.exists) result.summary.griplabTablesOk += 1;
    }

    // 2. users 테이블 (Clerk 동기화용) 확인
    const usersRes = await checkTable(supabase, "users");
    result.tables.users = { ...usersRes, note: "Clerk 동기화용 (legacy)" };
    result.summary.usersExists = usersRes.exists;

    // 2.5. 스키마 검증: 트리거·RLS (get_griplab_schema_checks RPC)
    const { data: schemaChecksData } = await supabase.rpc("get_griplab_schema_checks");
    if (schemaChecksData && typeof schemaChecksData === "object") {
      const d = schemaChecksData as {
        trigger_on_auth_user_created?: boolean;
        rls?: Record<string, boolean>;
      };
      result.schemaChecks = {
        trigger_on_auth_user_created: d.trigger_on_auth_user_created ?? null,
        rls: d.rls ?? null,
      };
    }

    // 3. Storage 버킷 확인
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      result.storage.error = bucketsError.message;
    } else {
      result.storage.buckets = buckets ?? [];
      result.summary.totalBuckets = buckets?.length ?? 0;

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
