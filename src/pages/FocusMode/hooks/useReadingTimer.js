import { useEffect } from "react";

import { READ_STATUS } from "../constants/readStatus";
import { useFocusStore } from "../stores/useFocusStore";

export function useReadingTimer() {
  const paused = useFocusStore((store) => store.paused);
  const readStatus = useFocusStore((store) => store.readStatus);
  const updateReadingProgress = useFocusStore(
    (store) => store.updateReadingProgress
  );

  useEffect(() => {
    if (readStatus !== READ_STATUS.READING || paused) return;

    const timer = setInterval(() => {
      updateReadingProgress((prev) => ({
        ...prev,
        elapsed: prev.elapsed + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [updateReadingProgress, paused, readStatus]);
}
