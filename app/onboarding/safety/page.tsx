"use client";

/**
 * @file app/onboarding/safety/page.tsx
 * @description 안전 동의 (Step 0) 페이지 — Skip 불가, 필수 동의 후 앱 진입
 *
 * - 경고 헤드라인, 스크롤 가능한 약관, 동의 체크박스, [동의 및 계속하기] 버튼
 * - 동의 시 쿠키 + localStorage 저장 후 SAFETY_CONSENT_REDIRECT_PATH로 이동
 * @see docs/design-refs/01_safety_consent.html
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, FileText, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SAFETY_CONSENT_REDIRECT_PATH,
  SAFETY_CONSENT_STORAGE_KEY,
} from "@/constants/onboarding";
import { SAFETY_CONSENT_CLAUSES } from "@/constants/safety-consent";
import { setSafetyConsentCookie } from "@/actions/onboarding";

export default function SafetyConsentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await setSafetyConsentCookie();
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SAFETY_CONSENT_STORAGE_KEY, "true");
      }
      router.push(SAFETY_CONSENT_REDIRECT_PATH);
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f2123] text-white">
      {/* Hero */}
      <div className="relative h-[40vh] w-full shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4QKhPTrJmEzKAzzUE5JVKry7jSjTTIBozHPjSWo_TlXw0F4-MkbpRpSQ6cnxJ4hIatcvAg7pT_rWjrBKrD48owS_sCQRAwXzH_XNR7xFFJGUwzTN846udm6jsAZOGlDZYb_2iduWgbFt2kGDuVGcQFrwGXnrpjvq7eUnRKyTbhNMOIIVR6Fmno66tlIAohYw9IHWcwuOusUHKgtawOJpG8WGE9V5isdF54K4aeVXQ4YxBbwi_qjMueD4kFjPqsj7i5OPI8gTNzIZy")`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-[#091415]/30 via-[#091415]/60 to-[#0f2123]" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
          <div className="w-16 h-16 rounded-full bg-[#1fe7f9]/10 border border-[#1fe7f9]/30 flex items-center justify-center mb-4 backdrop-blur-sm">
            <AlertTriangle className="w-10 h-10 text-[#1fe7f9]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 drop-shadow-lg break-keep">
            훈련 안전 수칙
          </h1>
          <p className="text-gray-300 text-sm font-medium tracking-wide opacity-80">
            주의 깊게 읽어주세요
          </p>
        </div>
      </div>

      {/* Content card */}
      <div className="flex-1 bg-[#0f2123] relative z-20 -mt-6 rounded-t-3xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 flex flex-col px-6 pt-2 pb-8 max-w-md mx-auto w-full">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1fe7f9]" />
            약관 및 면책 조항
          </h2>

          <div className="relative flex-1 min-h-[240px] bg-[#162a2d]/50 rounded-xl border border-white/5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-[#162a2d]/80 to-transparent z-10 pointer-events-none" />
            <div className="h-full overflow-y-auto p-4 text-sm text-gray-400 leading-relaxed scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-[#1fe7f9]/30">
              {SAFETY_CONSENT_CLAUSES.map((clause) => (
                <p key={clause.title} className="mb-4 break-keep">
                  <strong className="text-white block mb-1">{clause.title}</strong>
                  {clause.body}
                </p>
              ))}
              <div className="h-8" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-[#162a2d] to-transparent z-10 pointer-events-none" />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex items-start gap-4 p-4 rounded-xl bg-[#162a2d] border border-white/5 cursor-pointer transition-colors hover:border-[#1fe7f9]/30 active:scale-[0.99]">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5"
                aria-describedby="consent-desc"
              />
              <div className="flex-1" id="consent-desc">
                <p className="text-white font-medium leading-snug break-keep">
                  위험을 인지했습니다.
                </p>
                <p className="text-xs text-gray-500 mt-1 break-keep">
                  위의 안전 약관을 읽었으며 이에 동의합니다.
                </p>
              </div>
            </label>

            <Button
              type="submit"
              disabled={!agreed || isSubmitting}
              className="w-full h-14 bg-[#1fe7f9] hover:bg-[#1fe7f9]/90 text-[#0f2123] text-lg font-bold rounded-xl gap-2 shadow-[0_0_20px_rgba(31,231,249,0.2)]"
            >
              <span>동의 및 계속하기</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
