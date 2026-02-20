import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function test() {
  console.log("Fetching users...");
  const { data: users, error: selectError } = await supabase.from("users").select("*").limit(1);
  if (selectError) {
    console.error("Select users error:", selectError);
    return;
  }

  console.log("Found user:", users?.[0]);

  if (users && users.length > 0) {
    const userUuid = users[0].id;
    console.log("Trying to insert routine for user:", userUuid);

    const { data, error } = await supabase.from("routines").insert({
      user_id: userUuid,
      title: "Test Routine",
      estimated_time: 10,
      total_sets: 1,
      structure_json: []
    });

    if (error) {
      console.error("Insert error details:", error);
    } else {
      console.log("Insert success:", data);
    }
  }
}

test();
