"use server";

import { cookies } from "next/headers";
import {
  SAFETY_CONSENT_COOKIE_NAME,
  SAFETY_CONSENT_COOKIE_MAX_AGE,
} from "@/constants/onboarding";

/**
 * 안전 동의 완료 시 쿠키를 설정합니다.
 * 미들웨어에서 동의 여부를 판단할 때 사용합니다.
 */
export async function setSafetyConsentCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SAFETY_CONSENT_COOKIE_NAME, "true", {
    path: "/",
    maxAge: SAFETY_CONSENT_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
