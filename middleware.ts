import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // 웹훅 엔드포인트는 public으로 설정 (Clerk 서버에서 직접 호출)
  publicRoutes: ["/api/webhooks/clerk"],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
