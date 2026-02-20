import { getRoutine } from "@/actions/routines";
import { TimerPlayer } from "@/components/workout/TimerPlayer";
import { flattenRoutine } from "@/lib/utils/flattenRoutine";
import { notFound } from "next/navigation";

export default async function TimerWorkoutPage({ params }: { params: Promise<{ routineId: string }> }) {
  const { routineId } = await params;
  const { data: routine, error } = await getRoutine(routineId);

  if (error || !routine) {
    notFound();
  }

  // 루틴 블록(1차원 변환)
  const segments = flattenRoutine(routine.structure_json);

  // 세그먼트가 없으면 에러
  if (!segments || segments.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-center p-6 text-white bg-[#0d1414]">
        <div>
          <h2 className="text-xl font-bold mb-2">훈련 데이터가 없습니다</h2>
          <p className="text-gray-400">루틴에 운동 블록을 추가해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d1414] text-white font-sans overflow-hidden">
      <div className="max-w-md w-full mx-auto h-screen relative">
        <TimerPlayer segments={segments} routineId={routine.id} />
      </div>
    </main>
  );
}
