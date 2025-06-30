import { useEffect } from "react";

const ReadingProgress = ({ progress, setProgress }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        elapsed: prev.elapsed + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [setProgress]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">📈 진행 상태</h2>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-purple-500 transition-all"
          style={{
            width: `${(progress.currentLine / progress.totalLines) * 100}%`,
          }}
        ></div>
      </div>
      <p>
        줄 현황: {progress.currentLine} / {progress.totalLines}
      </p>
      <p>경과 시간: {progress.elapsed}초</p>
    </div>
  );
};

export default ReadingProgress;
