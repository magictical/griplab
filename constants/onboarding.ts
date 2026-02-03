/**
 * 온보딩 관련 상수
 * - 안전 동의 쿠키/스토리지 키, 리다이렉트 경로
 */

/** 미들웨어·클라이언트에서 동의 여부 확인용 쿠키 키 */
export const SAFETY_CONSENT_COOKIE_NAME = "griplab_safety_consent";

/** 클라이언트 동의 상태 재확인용 localStorage 키 */
export const SAFETY_CONSENT_STORAGE_KEY = "griplab_safety_consent";

/** 동의 쿠키 유효 기간(초). 1년 */
export const SAFETY_CONSENT_COOKIE_MAX_AGE = 31536000;

/**
 * 안전 동의 완료 후 이동 경로.
 * ON-01 구현으로 홈짐 선택 페이지로 직행.
 */
export const SAFETY_CONSENT_REDIRECT_PATH = "/onboarding/gym-select";
