import { getProfileForHome } from "@/actions/profiles";
import { getRoutines } from "@/actions/routines";
import { GuestGate } from "@/components/routine-builder/GuestGate";
import { RoutineList } from "@/components/routine-builder/RoutineList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function RoutinesPage() {
  const { isGuest } = await getProfileForHome();

  if (isGuest) {
    return <GuestGate />;
  }

  const { data: routines, error } = await getRoutines();

  if (error) {
    return (
      <main className="min-h-screen bg-[#0f2123] text-white">
        <div className="max-w-[430px] mx-auto px-4 py-8">
          <p className="text-red-400">루틴 데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-[430px] w-full mx-auto bg-[#0f2123] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-6 pb-2 shrink-0 z-20">
        <Link
          href="/"
          className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors text-white"
        >
          <ArrowLeft size={24} />
        </Link>
        <h2 className="text-white text-sm font-bold uppercase tracking-widest opacity-60">
          My Routines
        </h2>
        <div className="size-10"></div>
      </header>

      {/* Headline */}
      <div className="px-6 pb-4 shrink-0 z-20">
        <h1 className="text-[32px] font-bold leading-tight">
          내 루틴 목록
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-8 overflow-y-auto w-full">
        <RoutineList routines={routines || []} />
      </div>

      {/* Bottom Spacer */}
      <div className="h-6 w-full shrink-0"></div>
    </main>
  );
}
