"use client";

import { RoutineResult } from "@/actions/routines";
import { formatDuration } from "@/lib/utils/routine-calc";
import { ChevronRight, Dumbbell, Plus, TimerIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RoutineListProps {
  routines: RoutineResult[];
}

export function RoutineList({ routines }: RoutineListProps) {
  const router = useRouter();

  if (routines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-[#1fe7f9]/30 rounded-3xl bg-[#142628] shadow-[0_0_15px_rgba(31,231,249,0.1)]">
        <div className="w-16 h-16 rounded-full bg-[#1fe7f9]/20 flex items-center justify-center mb-6 text-[#1fe7f9]">
          <Dumbbell size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">저장된 루틴이 없습니다</h3>
        <p className="text-sm text-gray-400 mb-8 max-w-[240px]">
          새로운 루틴을 만들고 규칙적인 훈련을 시작해보세요!
        </p>
        <Link
          href="/routine-builder"
          className="flex items-center gap-2 bg-[#1fe7f9] text-[#0f2123] px-6 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(31,231,249,0.3)]"
        >
          <Plus size={20} className="font-bold" />
          새 루틴 만들기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* List */}
      <div className="flex flex-col gap-4">
        {routines.map((routine) => (
          <button
            key={routine.id}
            onClick={() => router.push(`/workout/${routine.id}`)}
            className="w-full relative group flex flex-col p-5 rounded-2xl border border-white/5 bg-[#142628] hover:border-[#1fe7f9]/50 transition-all duration-300 text-left overflow-hidden shadow-sm"
          >
            {/* Hover Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1fe7f9]/0 to-[#1fe7f9]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold text-white group-hover:text-[#1fe7f9] transition-colors line-clamp-1">
                  {routine.title}
                </h3>

                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                  <div className="flex items-center gap-1.5 bg-[#1a3336] px-2.5 py-1 rounded-md text-[#1fe7f9]">
                    <TimerIcon size={14} />
                    {formatDuration(routine.estimated_time)}
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md text-gray-300">
                    <Dumbbell size={14} />
                    {routine.total_sets} 세트
                  </div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#1fe7f9] group-hover:text-[#0f2123] transition-colors shrink-0">
                <ChevronRight size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Adding a new one */}
      <div className="mt-8">
        <Link
          href="/routine-builder"
          className="flex items-center justify-center gap-2 w-full p-4 rounded-xl border border-dashed border-[#1fe7f9]/40 bg-[#1fe7f9]/5 hover:bg-[#1fe7f9]/10 text-[#1fe7f9] font-bold transition-colors"
        >
          <Plus size={20} />
          새 루틴 생성
        </Link>
      </div>
    </div>
  );
}
