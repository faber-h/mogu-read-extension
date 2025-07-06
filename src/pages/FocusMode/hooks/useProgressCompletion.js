import { useEffect, useRef } from "react";

import { useReadingHistory } from "@/hooks/useReadingHistory";

import { READ_STATUS } from "../constants/readStatus";
import { useFocusStore } from "../stores/useFocusStore";

export function useProgressCompletion() {
  const readingProgress = useFocusStore((store) => store.readingProgress);
  const setReadStatus = useFocusStore((store) => store.setReadStatus);
  const readStatus = useFocusStore((store) => store.readStatus);

  const { saveCompletedReading } = useReadingHistory();

  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const isCompleted =
      readingProgress.totalWords > 0 &&
      readingProgress.currentWord >= readingProgress.totalWords;

    if (isCompleted && readStatus === READ_STATUS.READING) {
      if (hasCompletedRef.current) return;

      hasCompletedRef.current = true;

      setReadStatus(READ_STATUS.DONE);

      (async () => {
        try {
          await saveCompletedReading({
            totalWords: readingProgress.totalWords,
            readingSeconds: readingProgress.elapsed,
            readingSpeed: readingProgress.readingSpeed,
          });
        } catch (error) {
          console.error("읽기 완료 기록 저장 실패:", error);
        }
      })();
    }
  }, [readingProgress, setReadStatus, readStatus, saveCompletedReading]);

  useEffect(() => {
    if (readStatus === READ_STATUS.IDLE) {
      hasCompletedRef.current = false;
    }
  }, [readStatus]);
}
