"use client";

import { cn } from "@/lib/utils";
import { FileEdit, Timer, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ModeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineId: string;
}

export function ModeSelectModal({ isOpen, onClose, routineId }: ModeSelectModalProps) {
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
          "fixed inset-0 bg-black/60 transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Sheet */}
      <div
        className={cn(
          "relative w-full max-w-md bg-background-light dark:bg-[#101f22] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out transform p-6 pb-12",
          isAnimating ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            어떤 모드로 훈련할까요?
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push(`/workout/${routineId}/timer`)}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#162629] border-2 border-[#25d1f4]/30 dark:border-[#25d1f4]/50 hover:border-[#25d1f4] dark:hover:border-[#25d1f4] hover:bg-[#25d1f4]/5 transition-all group text-left shadow-sm"
          >
            <div className="flex-none p-3 rounded-xl bg-[#25d1f4]/10 text-[#25d1f4] group-hover:scale-110 transition-transform">
              <Timer size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#25d1f4] transition-colors">
                타이머 모드 (추천)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
                준비, 운동, 휴식 시간이 자동으로 전환되며 오디오 알림을 제공합니다.
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push(`/workout/${routineId}/logger`)}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#162629] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group text-left shadow-sm"
          >
            <div className="flex-none p-3 rounded-xl bg-gray-100 dark:bg-[#2a3636] text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform">
              <FileEdit size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                로거 모드 (수동)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
                자신의 템포에 맞춰 세트를 진행하고 성공/실패를 직접 기록합니다.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
