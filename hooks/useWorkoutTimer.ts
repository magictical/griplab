"use client";

import { playSound } from "@/lib/audio/sounds";
import { WorkoutSegment } from "@/lib/utils/flattenRoutine";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useWorkoutTimer(segments: WorkoutSegment[]) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(segments[0]?.duration || 0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 구간 진행률 0~100 계산 (100%부터 0%로)
  const totalSegmentDuration = segments[currentSegmentIndex]?.duration || 1;
  const progress = (timeLeft / totalSegmentDuration) * 100;

  const handleNextSegment = useCallback(() => {
    if (currentSegmentIndex < segments.length - 1) {
      const nextIndex = currentSegmentIndex + 1;
      const nextSegment = segments[nextIndex];
      setCurrentSegmentIndex(nextIndex);
      setTimeLeft(nextSegment.duration);

      // 사운드 피드백
      if (nextSegment.type === "exercise") {
        playSound("start");
      } else if (nextSegment.type === "rest") {
        playSound("end");
      }
    } else {
      // 운동이 완전히 종료됨
      setIsFinished(true);
      setIsPlaying(false);
      playSound("end"); // 최종 다 끝난 알림
    }
  }, [currentSegmentIndex, segments]);

  useEffect(() => {
    if (isPlaying && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNextSegment();
            return 0; // handleNextSegment에서 새로운 값을 세팅할때까지 0으로 유지
          }

          // 남은 시간이 특정 구간일 때 경고음 재생 (카운트다운: 3, 2, 1초전)
          if (prev === 4 && segments[currentSegmentIndex]?.type === "rest") {
             // 휴식 끝나기 3초전 카운트 사운드
             playSound("rest_end");
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished, handleNextSegment, segments, currentSegmentIndex]);

  const pauseWorkout = () => setIsPlaying(false);
  const playWorkout = () => setIsPlaying(true);

  const skipRest = () => {
    if (segments[currentSegmentIndex]?.type === "rest") {
      handleNextSegment();
      toast("휴식을 건너뛰었습니다.");
    }
  };

  const currentSegment = segments[currentSegmentIndex] || null;

  return {
    isPlaying,
    isFinished,
    timeLeft,
    progress,
    currentSegment,
    currentSegmentIndex,
    totalSegments: segments.length,
    pauseWorkout,
    playWorkout,
    skipRest,
  };
}
