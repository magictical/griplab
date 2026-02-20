"use client";

import { cn } from "@/lib/utils";
import { List, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RoutineEntryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoutineEntryMenu({ isOpen, onClose }: RoutineEntryMenuProps) {
  const router = useRouter();
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      requestAnimationFrame(() => setIsAnimating(true));
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden font-display">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 transition-opacity duration-300 backdrop-blur-sm",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Sheet */}
      <div
        className={cn(
          "relative w-full max-w-md bg-[#162a2d] dark:bg-[#101f22] rounded-t-[32px] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(31,231,249,0.1)] transition-transform duration-300 ease-out transform p-6 pb-12",
          isAnimating ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            루틴 관리
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              onClose();
              router.push("/routines");
            }}
            className="flex items-start gap-4 p-5 rounded-2xl bg-[#0f2123] border border-[#1fe7f9]/20 hover:border-[#1fe7f9]/60 hover:bg-[#1fe7f9]/5 transition-all group text-left shadow-sm"
          >
            <div className="flex-none p-3 rounded-xl bg-[#1fe7f9]/10 text-[#1fe7f9] group-hover:scale-110 transition-transform">
              <List size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#1fe7f9] transition-colors">
                내 루틴 목록
              </h3>
              <p className="text-sm text-gray-400 leading-tight">
                저장해둔 나의 루틴들을 모아보고 훈련을 시작합니다.
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              router.push("/routine-builder");
            }}
            className="flex items-start gap-4 p-5 rounded-2xl bg-[#0f2123] border border-white/5 hover:border-[#1fe7f9]/40 hover:bg-white/5 transition-all group text-left shadow-sm"
          >
            <div className="flex-none p-3 rounded-xl bg-white/5 text-gray-300 group-hover:scale-110 group-hover:text-[#1fe7f9] transition-all">
              <Plus size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white">
                새 루틴 만들기
              </h3>
              <p className="text-sm text-gray-400 leading-tight">
                AI 코치 또는 커스텀 에디터를 통해 새로운 루틴을 설계합니다.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
