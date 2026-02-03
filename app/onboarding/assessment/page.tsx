"use client";

/**
 * @file app/onboarding/assessment/page.tsx
 * @description 온보딩 Step 3: 수행 능력 측정(Assessment). 1RM 입력/장비 선택 → 저장 → 메인 홈.
 * @see docs/implementation-plans/2.5-on-04-assessment.md, PRD 3.1 [Step 3]
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Loader2 } from "lucide-react";

import { AssessmentForm } from "@/components/onboarding/AssessmentForm";
import { LoginRequiredModal, LOGIN_REQUIRED_MESSAGE } from "@/components/login-required-modal";
import { getCurrentUserTier, updateAssessment } from "@/actions/profiles";
import type { AssessmentPayload } from "@/components/onboarding/AssessmentForm";

export default function AssessmentPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasTier, setHasTier] = useState(false);

  const checkEntry = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasTier(false);
    const { current_tier, error: tierError } = await getCurrentUserTier();
    setLoading(false);
    if (tierError) {
      if (tierError === LOGIN_REQUIRED_MESSAGE) {
        router.replace("/onboarding/gym-select");
        return;
      }
      setError(tierError);
      return;
    }
    if (current_tier == null) {
      router.replace("/onboarding/tier-assign");
      return;
    }
    setHasTier(true);
  }, [router]);

  useEffect(() => {
    checkEntry();
  }, [checkEntry]);

  async function handleComplete(payload: AssessmentPayload) {
    if (isLoaded && !userId) {
      setShowLoginModal(true);
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: err } = await updateAssessment(payload);
    setSubmitting(false);
    if (err) {
      if (err === LOGIN_REQUIRED_MESSAGE) {
        setShowLoginModal(true);
      } else {
        setError(err);
      }
      return;
    }
    router.push("/");
  }

  if (loading || !hasTier) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f2123] text-white gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#1fe7f9]" aria-hidden />
        <p className="text-sm text-gray-400">
          {loading ? "불러오는 중…" : "이동 중…"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f2123] text-white">
      <header className="shrink-0 flex items-center justify-between px-4 py-4 pt-12 sticky top-0 z-50 bg-[#0f2123]/90 backdrop-blur-md">
        <Link
          href="/onboarding/tier-assign"
          className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors text-white"
          aria-label="뒤로"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight flex-1 text-center">
          수행 능력 측정
        </h1>
        <div className="w-10" aria-hidden />
      </header>

      <div className="flex-1 flex flex-col px-4 pb-28 pt-2">
        <p className="text-[#9bbbbb] text-sm mb-6 text-center">
          1RM 수치 입력 또는 보유 장비를 선택해 주세요
        </p>

        <AssessmentForm onComplete={handleComplete} isSubmitting={submitting} />

        {error && (
          <p id="assessment-error" className="mt-4 text-sm text-red-400 text-center" role="alert">
            {error}
          </p>
        )}
      </div>

      <LoginRequiredModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        description="측정값을 저장하려면 로그인이 필요합니다. 로그인 후 다시 시도해 주세요."
      />
    </div>
  );
}
