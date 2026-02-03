/**
 * Supabase 데이터베이스 상태 확인 스크립트
 *
 * GripLab 스키마(profiles, gyms, gym_grade_scales, routines, training_logs) 및
 * Clerk 동기화용 users 테이블, Storage 버킷을 확인합니다.
 *
 * 사용: pnpm run check-db (스크립트 실행 시 .env 자동 로드)
 *
 * @see docs/db-migration.md
 */

import "dotenv/config";
import { getServiceRoleClient } from "../lib/supabase/service-role";

const GRIPLAB_TABLES = [
  "profiles",
  "gyms",
  "gym_grade_scales",
  "routines",
  "training_logs",
] as const;

async function checkTable(
  supabase: ReturnType<typeof getServiceRoleClient>,
  tableName: string,
): Promise<{ exists: boolean; count: number; error?: string }> {
  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true })
    .limit(1);

  if (error) {
    return { exists: false, count: 0, error: error.message };
  }
  return { exists: true, count: count ?? 0 };
}

async function checkDatabase() {
  console.log("🔍 Supabase 데이터베이스 상태 확인 중...\n");

  const supabase = getServiceRoleClient();

  try {
    // 1. GripLab 스키마 테이블 5개 확인
    console.log("📊 GripLab 스키마 테이블:");
    console.log("─".repeat(50));

    let griplabOk = 0;
    for (const tableName of GRIPLAB_TABLES) {
      const res = await checkTable(supabase, tableName);
      if (res.exists) {
        console.log(`✅ ${tableName} (행 수: ${res.count})`);
        griplabOk += 1;
      } else {
        console.log(`❌ ${tableName}: ${res.error ?? "접근 불가"}`);
      }
    }
    console.log(`\n→ GripLab 테이블: ${griplabOk}/${GRIPLAB_TABLES.length}개 접근 가능\n`);

    // 2. users 테이블 (Clerk 동기화용) 확인
    console.log("👥 Clerk 동기화용 users 테이블:");
    console.log("─".repeat(50));

    const usersRes = await checkTable(supabase, "users");
    if (usersRes.exists) {
      const { data: users } = await supabase
        .from("users")
        .select("id, clerk_id, name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      console.log(`✅ users 테이블 존재 (총 행: ${usersRes.count})`);
      if (users && users.length > 0) {
        console.log("\n최근 5명:");
        users.forEach((u: { id?: string; clerk_id?: string; name?: string; created_at?: string }, i: number) => {
          console.log(`  ${i + 1}. ${u.name ?? "-"} (clerk_id: ${u.clerk_id ?? "-"})`);
        });
      }
    } else {
      console.log(`❌ users 테이블: ${usersRes.error ?? "없음 또는 접근 불가"}`);
    }

    // 3. 트리거·RLS 검증 (get_griplab_schema_checks RPC)
    console.log("\n🔧 스키마 검증 (트리거·RLS):");
    console.log("─".repeat(50));

    const { data: schemaChecks, error: schemaError } = await supabase.rpc(
      "get_griplab_schema_checks",
    );

    if (schemaError) {
      console.log(
        "⚠️ get_griplab_schema_checks RPC 미적용 또는 오류. 마이그레이션 20250203100000_add_griplab_schema_checks.sql 실행 후 재시도.",
      );
      console.log(`   오류: ${schemaError.message}`);
    } else if (schemaChecks && typeof schemaChecks === "object") {
      const d = schemaChecks as {
        trigger_on_auth_user_created?: boolean;
        rls?: Record<string, boolean>;
      };
      if (d.trigger_on_auth_user_created) {
        console.log("✅ 트리거 적용됨: on_auth_user_created (auth.users → profiles)");
      } else {
        console.log("❌ 트리거 없음: on_auth_user_created");
      }
      if (d.rls && Object.keys(d.rls).length > 0) {
        const entries = Object.entries(d.rls)
          .map(([t, on]) => (on ? `✅ ${t}` : `❌ ${t}`))
          .join(", ");
        console.log(`   RLS: ${entries}`);
      }
    }
    console.log("");

    // 4. Storage 버킷 확인
    console.log("📦 Storage 버킷:");
    console.log("─".repeat(50));

    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log(`❌ 버킷 조회 오류: ${bucketsError.message}`);
    } else if (buckets && buckets.length > 0) {
      buckets.forEach((b) => {
        console.log(`✅ ${b.name} (Public: ${b.public})`);
      });

      const dataGriplab = buckets.find((b) => b.name === "data-griplab");
      if (dataGriplab) {
        const { data: files, error: filesError } = await supabase.storage
          .from("data-griplab")
          .list("", { limit: 20, sortBy: { column: "created_at", order: "desc" } });

        if (!filesError && files && files.length > 0) {
          console.log(`\n  data-griplab 최근 ${files.length}개 항목`);
        } else if (!filesError && files?.length === 0) {
          console.log("\n  data-griplab 버킷 비어 있음");
        }
      }
    } else {
      console.log("📭 버킷 없음");
    }

    console.log("\n✅ 데이터베이스 확인 완료!");
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  }
}

checkDatabase()
  .then(() => {
    console.log("\n✨ 작업 완료");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 치명적 오류:", error);
    process.exit(1);
  });
