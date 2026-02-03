"use client";

/**
 * @file components/onboarding/GymSearchList.tsx
 * @description 홈짐 선택 리스트: 암장 카드, 공식/커뮤니티 뱃지, 라디오 선택
 * @see docs/design-refs/02_gym_select.html
 */

import { MapPin } from "lucide-react";
import type { Gym } from "@/types/database";

const SURFACE_DARK = "#162a2d";
const BORDER_DARK = "#2a4043";

export interface GymSearchListProps {
  gyms: Gym[];
  selectedId: string | null;
  onSelect: (gymId: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function GymSearchList({ gyms, selectedId, onSelect, loading, error }: GymSearchListProps) {
  if (error) {
    return (
      <div className="py-8 px-4 text-center text-gray-400 text-sm">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-3 py-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl animate-pulse"
              style={{ backgroundColor: SURFACE_DARK, border: `1px solid ${BORDER_DARK}` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!gyms.length) {
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-24 flex items-center justify-center text-gray-400 text-sm">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-24">
      <div className="flex flex-col gap-3 py-2">
        {gyms.map((gym) => {
          const isSelected = selectedId === gym.id;
          return (
            <label
              key={gym.id}
              className={`group relative flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-[#1fe7f9] bg-[#1fe7f9]/5 hover:bg-[#1fe7f9]/10"
                  : "border-[#2a4043] bg-[#162a2d] hover:border-gray-600 hover:bg-[#1c3336]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-[#2a4043]"
                  style={{ backgroundColor: isSelected ? SURFACE_DARK : "#0f2123" }}
                >
                  <MapPin
                    className={isSelected ? "text-[#1fe7f9]" : "text-gray-400 group-hover:text-white"}
                    size={24}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`text-base font-semibold leading-none ${
                        isSelected ? "text-white font-bold" : "text-gray-200 group-hover:text-white"
                      }`}
                    >
                      {gym.name}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        gym.is_official
                          ? "bg-[#1fe7f9] text-[#0f2123]"
                          : "bg-transparent border border-gray-600 text-gray-400"
                      }`}
                    >
                      {gym.is_official ? "Official" : "Community"}
                    </span>
                  </div>
                </div>
              </div>
              <input
                type="radio"
                name="gym-selection"
                checked={isSelected}
                onChange={() => onSelect(gym.id)}
                className="h-6 w-6 border-2 border-gray-600 bg-transparent text-[#1fe7f9] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1fe7f9]"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
