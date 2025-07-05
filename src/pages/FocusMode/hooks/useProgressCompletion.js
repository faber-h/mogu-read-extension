import { useEffect } from "react";

import { READ_STATUS } from "../constants/readStatus";
import { useFocusStore } from "../stores/useFocusStore";

export function useProgressCompletion() {
  const readingProgress = useFocusStore((s) => s.readingProgress);
  const setReadStatus = useFocusStore((s) => s.setReadStatus);

  useEffect(() => {
    if (
      readingProgress.totalWords > 0 &&
      readingProgress.currentWord >= readingProgress.totalWords
    ) {
      setReadStatus(READ_STATUS.DONE);
    }
  }, [readingProgress, setReadStatus]);
}
