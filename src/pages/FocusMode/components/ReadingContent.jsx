import { useEffect } from "react";

const ReadingContent = ({ progress, setProgress, speed, onDone }) => {
  const mockLines = [
    "첫 번째 줄 예시입니다.",
    "두 번째 줄 예시입니다.",
    "세 번째 줄 예시입니다.",
    "네 번째 줄 예시입니다.",
    "다섯 번째 줄 예시입니다.",
  ];

  const speedMap = {
    fast: 1000,
    normal: 2000,
    slow: 3000,
  };
  const interval = speedMap[speed] || 2000;

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
    }, interval);

    return () => clearInterval(timer);
  }, [
    progress.currentLine,
    progress.totalLines,
    setProgress,
    interval,
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
