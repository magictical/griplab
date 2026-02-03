/**
 * Supabase 데이터베이스 상태 확인 스크립트
 *
 * 이 스크립트는 데이터베이스의 테이블, 컬럼, RLS 상태 등을 확인합니다.
 */

import { getServiceRoleClient } from "../lib/supabase/service-role";

async function checkDatabase() {
  console.log("🔍 Supabase 데이터베이스 상태 확인 중...\n");

  const supabase = getServiceRoleClient();

  try {
    // 1. users 테이블 존재 여부 및 구조 확인
    console.log("📊 테이블 정보:");
    console.log("─".repeat(50));

    const { data: tables, error: tablesError } = await supabase
      .from("users")
      .select("*")
      .limit(0);

    if (tablesError) {
      console.error("❌ users 테이블 접근 오류:", tablesError.message);
    } else {
      console.log("✅ users 테이블 존재 확인됨");
    }

    // 2. users 테이블 데이터 조회
    console.log("\n👥 users 테이블 데이터:");
    console.log("─".repeat(50));

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) {
      console.error("❌ 데이터 조회 오류:", usersError.message);
    } else {
      if (users && users.length > 0) {
        console.log(`총 ${users.length}명의 사용자:\n`);
        users.forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user.id}`);
          console.log(`   Clerk ID: ${user.clerk_id}`);
          console.log(`   이름: ${user.name}`);
          console.log(`   생성일: ${user.created_at}`);
          console.log("");
        });
      } else {
        console.log("📭 users 테이블이 비어있습니다.");
      }
    }

    // 3. Storage 버킷 확인
    console.log("\n📦 Storage 버킷 정보:");
    console.log("─".repeat(50));

    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ 버킷 조회 오류:", bucketsError.message);
    } else {
      if (buckets && buckets.length > 0) {
        buckets.forEach((bucket) => {
          console.log(`✅ ${bucket.name} (Public: ${bucket.public})`);
        });
      } else {
        console.log("📭 버킷이 없습니다.");
      }
    }

    // 4. data-griplab 버킷의 파일 확인
    if (buckets && buckets.some((b) => b.name === "data-griplab")) {
      console.log("\n📁 data-griplab 버킷 파일 목록:");
      console.log("─".repeat(50));

      const { data: files, error: filesError } = await supabase.storage
        .from("data-griplab")
        .list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (filesError) {
        console.error("❌ 파일 목록 조회 오류:", filesError.message);
      } else {
        if (files && files.length > 0) {
          console.log(`총 ${files.length}개의 파일/폴더:\n`);
          files.forEach((file, index) => {
            console.log(
              `${index + 1}. ${file.name} (${file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(2)} KB` : "폴더"})`,
            );
          });
        } else {
          console.log("📭 data-griplab 버킷이 비어있습니다.");
        }
      }
    }

    console.log("\n✅ 데이터베이스 확인 완료!");
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  }
}

// 스크립트 실행
checkDatabase()
  .then(() => {
    console.log("\n✨ 작업 완료");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 치명적 오류:", error);
    process.exit(1);
  });
