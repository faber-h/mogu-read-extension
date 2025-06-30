import { useState, useCallback } from "react";

import ReadingConfig from "./components/ReadingConfig";
import ReadingContent from "./components/ReadingContent";
import ReadingControls from "./components/ReadingControls";
import ReadingProgress from "./components/ReadingProgress";
import ReadingSummary from "./components/ReadingSummary";

const FocusMode = () => {
  const [isContentDetected] = useState(true); // 임시 고정
  const [status, setStatus] = useState("idle");
  const [speed, setSpeed] = useState("normal");
  const [progress, setProgress] = useState({
    currentLine: 0,
    totalLines: 5,
    elapsed: 0,
  });

  const handleStart = useCallback(() => {
    setProgress({ currentLine: 0, totalLines: 5, elapsed: 0 });
    setStatus("reading");
  }, []);

  const handleDone = useCallback(() => {
    setStatus("done");
  }, []);

  const handlePause = () => {
    console.log("일시정지");
  };

  const handleRewind = () => {
    setProgress((prev) => ({
      ...prev,
      currentLine: Math.max(prev.currentLine - 1, 0),
    }));
  };

  const handleRestart = () => {
    setProgress((prev) => ({
      ...prev,
      currentLine: 0,
      elapsed: 0,
    }));
  };

  const handleReset = () => {
    setStatus("idle");
  };

  return (
    <div className="space-y-6 p-4">
      {status === "idle" && (
        <ReadingConfig
          speed={speed}
          setSpeed={setSpeed}
          onStart={handleStart}
          isContentDetected={isContentDetected}
        />
      )}

      {status === "reading" && (
        <>
          <ReadingContent
            progress={progress}
            setProgress={setProgress}
            speed={speed}
            onDone={handleDone}
          />
          <ReadingProgress progress={progress} setProgress={setProgress} />
          <ReadingControls
            onPause={handlePause}
            onRewind={handleRewind}
            onRestart={handleRestart}
          />
        </>
      )}

      {status === "done" && (
        <ReadingSummary progress={progress} onReset={handleReset} />
      )}
    </div>
  );
};

export default FocusMode;
