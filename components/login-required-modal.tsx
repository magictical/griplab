"use client";

/**
 * @file components/login-required-modal.tsx
 * @description DB 접근 등 로그인이 필요한 기능 사용 시, 비로그인 사용자에게 표시하는 모달.
 * [로그인] 클릭 시 Clerk 로그인 모달을 띄우며, 로그인 후 같은 화면에 남아 리다이렉트 불필요.
 */

import { SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LOGIN_REQUIRED_MESSAGE } from "@/constants/auth";

export { LOGIN_REQUIRED_MESSAGE };

export interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 모달 설명 문구 (선택) */
  description?: string;
}

export function LoginRequiredModal({
  open,
  onOpenChange,
  description = "이 기능을 사용하려면 로그인이 필요합니다. 로그인 후 다시 시도해 주세요.",
}: LoginRequiredModalProps) {
  const pathname = usePathname();
  const handleLoginClick = () => {
    onOpenChange(false);
  };

  // 로그인 완료 후 현재 페이지로 돌아오도록 함. OAuth는 팝업으로 처리해 메인 창이 Google로 넘어가지 않게 함.
  const redirectAfterSignIn = pathname && pathname !== "/" ? pathname : "/";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#162a2d] border-[#2A3F3F] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            로그인이 필요합니다
          </DialogTitle>
          <DialogDescription className="text-[#9bbbbb]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-[#2a4043] bg-transparent text-white hover:bg-[#2a4043]"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={redirectAfterSignIn}
            oauthFlow="popup"
          >
            <Button
              type="button"
              className="bg-[#1fe7f9] text-[#0f2123] font-bold hover:bg-[#1fe7f9]/90 flex items-center gap-2"
              onClick={handleLoginClick}
            >
              <LogIn className="h-4 w-4" />
              로그인
            </Button>
          </SignInButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
