"use client";

import { EXERCISES, EXERCISE_CATEGORIES, ExerciseCategory, ExerciseDef } from "@/lib/data/exercises";
import { cn } from "@/lib/utils";
import { Activity, ArrowUp, ArrowUpRight, Dumbbell, Hand, Lock, Minus, Plus, Repeat, Search, Timer, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ICON_MAP: Record<string, React.ReactNode> = {
  "hand": <Hand size={24} />,
  "repeat": <Repeat size={24} />,
  "minus": <Minus size={24} />,
  "timer": <Timer size={24} />,
  "dumbbell": <Dumbbell size={24} />,
  "arrow-up": <ArrowUp size={24} />,
  "lock": <Lock size={24} />,
  "activity": <Activity size={24} />,
  "arrow-up-right": <ArrowUpRight size={24} />
};

interface ExercisePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: ExerciseDef) => void;
}

export function ExercisePicker({ isOpen, onClose, onSelect }: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory>("hangboard");
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Allow DOM to update before triggering animation
      requestAnimationFrame(() => setIsAnimating(true));
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      // Wait for animation before unmounting
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((ex) => {
      const matchSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = ex.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory]);

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
          "relative w-full max-w-md h-[92vh] bg-[#f5f8f8] dark:bg-[#101f22] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out transform",
          isAnimating ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Header Section */}
        <div className="flex-none pt-2 pb-2 bg-[#f5f8f8] dark:bg-[#101f22]">
          {/* Drag Handle */}
          <div className="w-full flex justify-center pt-2 pb-4 cursor-grab active:cursor-grabbing" onClick={onClose}>
            <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Title Bar */}
          <div className="flex items-center justify-between px-6 pb-2">
            <div className="w-10"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">운동 추가</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-none px-6 pb-4 bg-[#f5f8f8] dark:bg-[#101f22]">
          <label className="relative block group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#25d1f4] group-focus-within:text-[#25d1f4]">
              <Search size={20} />
            </span>
            <input
              className="block w-full bg-white dark:bg-[#162629] border-2 border-[#25d1f4]/50 dark:border-[#25d1f4] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[#25d1f4] focus:shadow-[0_0_10px_rgba(37,209,244,0.3)] transition-all duration-300 placeholder:font-sans"
              placeholder="운동 이름을 검색하세요"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>

        {/* Category Tabs */}
        <div className="flex-none bg-[#f5f8f8] dark:bg-[#101f22] border-b border-gray-200 dark:border-white/5 pb-4">
          <div className="flex gap-3 px-6 overflow-x-auto no-scrollbar py-1">
            {EXERCISE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex-none px-6 py-2.5 rounded-full font-bold text-sm transition-all",
                  activeCategory === cat.id
                    ? "bg-[#25d1f4] text-[#101f22] shadow-[0_0_10px_rgba(37,209,244,0.3)]"
                    : "bg-white dark:bg-[#162629] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-[#f5f8f8] dark:bg-[#101f22] pb-8">
          <div className="flex flex-col">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-12 text-gray-400">검색 결과가 없습니다.</div>
            ) : (
              filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => onSelect(ex)}
                  className="group flex items-center justify-between px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors cursor-pointer border-b border-gray-100 dark:border-white/5"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="flex-none w-12 h-12 rounded-full bg-[#162629] flex items-center justify-center text-[#25d1f4] ring-1 ring-white/10 group-hover:ring-[#25d1f4]/50 transition-all">
                      {ICON_MAP[ex.icon] || <Dumbbell size={24} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-gray-900 dark:text-white text-base font-bold leading-tight truncate">
                        {ex.title}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-sans leading-tight mt-1 truncate">
                        {ex.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex-none ml-4">
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25d1f4]/10 text-[#25d1f4] group-hover:bg-[#25d1f4] group-hover:text-[#101f22] transition-all duration-300">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
            <div className="h-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
