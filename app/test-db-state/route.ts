import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = getServiceRoleClient();

  // Get one user from users table
  const { data: users, error: uErr } = await supabase.from("users").select("*").limit(1);
  const { data: profiles, error: pErr } = await supabase.from("profiles").select("*").limit(1);

  let insertError = null;
  if (users && users.length > 0) {
    const userUuid = users[0].id;
    // try to insert
    const { error } = await supabase.from("routines").insert({
      user_id: userUuid,
      title: "Test Routine API Bypass",
      estimated_time: 120,
      total_sets: 2,
      structure_json: []
    });
    insertError = error;
  }

  return NextResponse.json({
    users, uErr,
    profiles, pErr,
    insertError
  });
}
