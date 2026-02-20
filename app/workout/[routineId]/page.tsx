import { getRoutine } from "@/actions/routines";
import { notFound } from "next/navigation";
import WorkoutStartClient from "./WorkoutStartClient";

export default async function WorkoutModeSelectPage({ params }: { params: Promise<{ routineId: string }> }) {
  const { routineId } = await params;
  const { data: routine, error } = await getRoutine(routineId);

  if (error || !routine) {
    console.error("Failed to load routine", error);
    notFound();
  }

  return <WorkoutStartClient routine={routine} />;
}
