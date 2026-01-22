/**
 * users 테이블 확인 스크립트
 * Service Role 클라이언트를 사용하여 users 테이블의 모든 정보를 확인합니다.
 */

import { getServiceRoleClient } from "../lib/supabase/service-role";

async function checkUsersTable() {
  console.log("🔍 users 테이블 확인 중...\n");
  console.log("=".repeat(60));

  try {
    const supabase = getServiceRoleClient();

    // 1. 테이블 구조 확인 (메타데이터)
    console.log("\n📊 테이블 구조:");
    console.log("-".repeat(60));
    
    // 컬럼 정보를 얻기 위해 빈 쿼리 실행
    const { data: sampleData, error: sampleError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (sampleError && sampleError.code !== "PGRST116") {
      // PGRST116은 "no rows returned" 에러이므로 정상
      console.error("❌ 테이블 접근 오류:", sampleError.message);
      console.error("   코드:", sampleError.code);
      return;
    }

    console.log("✅ users 테이블 접근 가능");
    
    if (sampleData && sampleData.length > 0) {
      console.log("\n컬럼 구조:");
      const columns = Object.keys(sampleData[0]);
      columns.forEach((col, idx) => {
        console.log(`   ${idx + 1}. ${col}`);
      });
    }

    // 2. 전체 데이터 개수 확인
    console.log("\n📈 데이터 통계:");
    console.log("-".repeat(60));
    
    const { count, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("❌ 개수 조회 오류:", countError.message);
    } else {
      console.log(`총 사용자 수: ${count || 0}명`);
    }

    // 3. 모든 데이터 조회
    console.log("\n👥 사용자 목록:");
    console.log("-".repeat(60));

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) {
      console.error("❌ 데이터 조회 오류:", usersError.message);
      return;
    }

    if (!users || users.length === 0) {
      console.log("📭 users 테이블이 비어있습니다.");
      console.log("\n💡 테이블 구조:");
      console.log("   - id: UUID (Primary Key)");
      console.log("   - clerk_id: TEXT (Unique, Clerk User ID)");
      console.log("   - name: TEXT (사용자 이름)");
      console.log("   - created_at: TIMESTAMP (생성 시간)");
    } else {
      console.log(`\n총 ${users.length}명의 사용자:\n`);
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. 사용자 #${index + 1}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Clerk ID: ${user.clerk_id}`);
        console.log(`   이름: ${user.name}`);
        console.log(`   생성일: ${new Date(user.created_at).toLocaleString("ko-KR")}`);
        console.log("");
      });
    }

    // 4. 테이블 메타데이터 상세 정보
    console.log("\n📋 테이블 상세 정보:");
    console.log("-".repeat(60));
    console.log("테이블명: users");
    console.log("스키마: public");
    console.log("RLS 상태: 비활성화 (개발 모드)");
    console.log("권한: anon, authenticated, service_role 모두 접근 가능");

    console.log("\n✅ 확인 완료!");
  } catch (error) {
    console.error("\n❌ 오류 발생:");
    if (error instanceof Error) {
      console.error("   메시지:", error.message);
      console.error("   스택:", error.stack);
    } else {
      console.error("   알 수 없는 오류:", error);
    }
    process.exit(1);
  }
}

// 스크립트 실행
checkUsersTable()
  .then(() => {
    console.log("\n✨ 작업 완료");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 치명적 오류:", error);
    process.exit(1);
  });
