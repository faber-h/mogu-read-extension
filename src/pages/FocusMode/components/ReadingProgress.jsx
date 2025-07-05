import { useEffect } from "react";

import { useFocusStore } from "../stores/useFocusStore";

const ReadingProgress = () => {
  const paused = useFocusStore((store) => store.paused);
  const readingProgress = useFocusStore((store) => store.readingProgress);
  const updateReadingProgress = useFocusStore(
    (store) => store.updateReadingProgress
  );

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      updateReadingProgress((prev) => ({
        ...prev,
        elapsed: prev.elapsed + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [updateReadingProgress, paused]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">📈 진행 상태</h2>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-purple-500 transition-all"
          style={{
            width: `${(readingProgress.currentWord / readingProgress.totalWords) * 100}%`,
          }}
        ></div>
      </div>
      <p>경과 시간: {readingProgress.elapsed}초</p>
    </div>
  );
};

export default ReadingProgress;
