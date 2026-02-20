import { createRoutine } from "@/actions/routines";
import { NextResponse } from "next/server";

export async function GET() {
  const payload = {
    title: "TEST ROUTINE API",
    estimated_time: 120,
    total_sets: 2,
    structure_json: []
  };

  const result = await createRoutine(payload);

  return NextResponse.json(result);
}
