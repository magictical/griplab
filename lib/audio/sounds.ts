"use client";

// Web Audio API를 사용한 간단한 합성 오디오 (MVP용)
export function playSound(type: "start" | "end" | "rest_end") {
  if (typeof window === "undefined") return;

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

  const playTone = (freq: number, startTime: number, duration: number, vol = 0.5) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(vol, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const now = audioCtx.currentTime;

  switch (type) {
    case "start":
      // "삐-" (단일 고음)
      playTone(880, now, 0.4, 0.5);
      break;

    case "end":
      // "삐-삐-" (완료, 두 번)
      playTone(880, now, 0.2, 0.5);
      playTone(880, now + 0.3, 0.2, 0.5);
      break;

    case "rest_end":
      // "톡... 톡..." (카운트다운 시 주기적인 낮은음)
      playTone(440, now, 0.1, 0.3);
      playTone(440, now + 0.5, 0.1, 0.3);
      playTone(660, now + 1.0, 0.2, 0.4); // 마지막은 약간 높게
      break;
  }
}
