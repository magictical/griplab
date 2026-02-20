"use client";

import { List, Plus } from "lucide-react";
import Link from "next/link";

export function HomeRoutineActions() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full px-4 mb-2">
      <Link
        href="/routines"
        className="relative group flex flex-col p-4 rounded-2xl bg-[#162a2d] border border-[#1fe7f9]/20 hover:border-[#1fe7f9]/60 hover:bg-[#1fe7f9]/5 transition-all duration-300 shadow-sm overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1fe7f9]/0 to-[#1fe7f9]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-[#1fe7f9]/10 flex items-center justify-center text-[#1fe7f9] group-hover:scale-110 transition-transform">
            <List size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#1fe7f9] transition-colors">
              내 루틴 목록
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-[120px] leading-tight break-keep">
              생성한 훈련을 봅니다
            </p>
          </div>
        </div>
      </Link>

      <Link
        href="/routine-builder"
        className="relative group flex flex-col p-4 rounded-2xl bg-[#162a2d] border border-white/5 hover:border-[#1fe7f9]/40 hover:bg-white/5 transition-all duration-300 shadow-sm overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 group-hover:bg-[#1fe7f9]/10 group-hover:text-[#1fe7f9] group-hover:scale-110 transition-all">
            <Plus size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-white">
              새 루틴 만들기
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-[120px] leading-tight break-keep">
              루틴을 새로 설계합니다
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
