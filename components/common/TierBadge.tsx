"use client";

/**
 * @file components/common/TierBadge.tsx
 * @description 6단계 티어 뱃지. 선택 시 Bounce/Fade-in 애니메이션.
 * @see docs/implementation-plans/2.4-on-03-tier-assign.md, lib/utils/tier.ts
 */

import { TIER_NAMES_KO, getTierColor, type TierLevel } from "@/lib/utils/tier";

export type TierBadgeProps = {
  /** 티어 레벨 1~6. 없으면 뱃지 미표시 */
  tier: TierLevel | null;
  /** 선택 직후 재생할 애니메이션 (접근성: prefers-reduced-motion 고려) */
  animate?: boolean;
  /** 추가 클래스 */
  className?: string;
};

export function TierBadge({ tier, animate = true, className = "" }: TierBadgeProps) {
  if (tier === null) return null;

  const color = getTierColor(tier);
  const name = TIER_NAMES_KO[tier];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold text-white shadow-lg motion-reduce:animate-none ${animate ? "animate-tier-badge-in" : ""} ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 16px ${color}40`,
      }}
      role="status"
      aria-label={`티어: ${name}`}
    >
      {name}
    </span>
  );
}
