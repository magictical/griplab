"use client";

/**
 * @file components/onboarding/ColorGrid.tsx
 * @description 선택한 홈짐의 색상 버튼 그리드. sort_order 정렬된 scales, 단일 선택, 선택 시 링 하이라이트.
 * @see docs/implementation-plans/2.4-on-03-tier-assign.md
 */

import type { GymGradeScale } from "@/types/database";

export type ColorGridProps = {
  /** sort_order 기준 정렬된 색상-티어 스케일 목록 */
  scales: GymGradeScale[];
  /** 현재 선택된 scale id (없으면 null) */
  selectedScaleId: string | null;
  /** 색상 선택 시 콜백 (scale) */
  onSelect: (scale: GymGradeScale) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스 */
  className?: string;
};

export function ColorGrid({
  scales,
  selectedScaleId,
  onSelect,
  disabled = false,
  className = "",
}: ColorGridProps) {
  if (scales.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4" role="status">
        등록된 색상이 없습니다.
      </p>
    );
  }

  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-4 gap-3 ${className}`}
      role="group"
      aria-label="난이도 색상 선택"
    >
      {scales.map((scale) => {
        const isSelected = selectedScaleId === scale.id;
        return (
          <button
            key={scale.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(scale)}
            className={`h-14 rounded-xl border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1fe7f9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f2123] disabled:opacity-50 disabled:pointer-events-none ${
              isSelected
                ? "border-[#1fe7f9] shadow-[0_0_16px_rgba(31,231,249,0.4)] scale-[1.02]"
                : "border-[#2a4043] hover:border-gray-500 hover:scale-[1.02]"
            }`}
            style={{
              backgroundColor: scale.color_hex.startsWith("#") ? scale.color_hex : `#${scale.color_hex}`,
            }}
            aria-pressed={isSelected}
            aria-label={`${scale.color_name} (티어 ${scale.tier_level})`}
          >
            <span className="sr-only">
              {scale.color_name} — 티어 {scale.tier_level}
            </span>
          </button>
        );
      })}
    </div>
  );
}
