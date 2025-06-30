import { useEffect } from "react";

import { READING_SPEED_INTERVAL } from "../constants/readingSpeed";

const ReadingContent = ({ progress, setProgress, readingSpeed, onDone }) => {
  const mockLines = [
    "첫 번째 줄 예시입니다.",
    "두 번째 줄 예시입니다.",
    "세 번째 줄 예시입니다.",
    "네 번째 줄 예시입니다.",
    "다섯 번째 줄 예시입니다.",
  ];

  const readingSpeedInterval = READING_SPEED_INTERVAL[readingSpeed] || 2000;

  useEffect(() => {
    if (progress.currentLine >= progress.totalLines) {
      onDone();
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        currentLine: prev.currentLine + 1,
      }));
    }, readingSpeedInterval);

    return () => clearInterval(timer);
  }, [
    progress.currentLine,
    progress.totalLines,
    setProgress,
    readingSpeedInterval,
    onDone,
  ]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full rounded border border-purple-200 p-4 text-center">
        <p className="text-lg font-medium">👀 몰입 읽기 중</p>
        <div className="mt-4 rounded bg-purple-50 p-4 text-gray-800">
          {mockLines[progress.currentLine] || "끝!"}
        </div>
      </div>
    </div>
  );
};

export default ReadingContent;
