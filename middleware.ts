import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { SAFETY_CONSENT_COOKIE_NAME } from "@/constants/onboarding";

/** 안전 동의 없이 접근 가능한 경로 */
const ROUTES_WITHOUT_SAFETY_CONSENT = ["/onboarding/safety", "/sign-in", "/sign-up"];

// Clerk v6: 기본적으로 모든 경로는 public. 보호가 필요한 경로만 createRouteMatcher로 지정
const clerkHandler = clerkMiddleware();

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // API·정적 자원은 동의 체크 제외
  if (!pathname.startsWith("/api")) {
    const skipConsent = ROUTES_WITHOUT_SAFETY_CONSENT.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
    if (!skipConsent) {
      const consent = req.cookies.get(SAFETY_CONSENT_COOKIE_NAME)?.value;
      if (!consent) {
        return NextResponse.redirect(new URL("/onboarding/safety", req.url));
      }
    }
  }

  return clerkHandler(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
