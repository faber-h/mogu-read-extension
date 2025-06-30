import { useState, useCallback } from "react";

import ReadingConfig from "./components/ReadingConfig";
import ReadingContent from "./components/ReadingContent";
import ReadingControls from "./components/ReadingControls";
import ReadingProgress from "./components/ReadingProgress";
import ReadingSummary from "./components/ReadingSummary";
import { READING_SPEED } from "./constants/readingSpeed";
import { READ_STATUS } from "./constants/readStatus";

const FocusMode = () => {
  const [isContentDetected] = useState(true); // 임시 고정
  const [readStatus, setReadStatus] = useState(READ_STATUS.IDLE);
  const [readingSpeed, setReadingSpeed] = useState(READING_SPEED.NORMAL);
  const [progress, setProgress] = useState({
    currentLine: 0,
    totalLines: 5,
    elapsed: 0,
  });

  const handleStart = useCallback(() => {
    setProgress({ currentLine: 0, totalLines: 5, elapsed: 0 });
    setReadStatus(READ_STATUS.READING);
  }, []);

  const handleDone = useCallback(() => {
    setReadStatus(READ_STATUS.DONE);
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
    setReadStatus(READ_STATUS.IDLE);
  };

  return (
    <div className="space-y-6 p-4">
      {readStatus === READ_STATUS.IDLE && (
        <ReadingConfig
          readingSpeed={readingSpeed}
          setReadingSpeed={setReadingSpeed}
          onStart={handleStart}
          isContentDetected={isContentDetected}
        />
      )}

      {readStatus === READ_STATUS.READING && (
        <>
          <ReadingContent
            progress={progress}
            setProgress={setProgress}
            readingSpeed={readingSpeed}
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

      {readStatus === READ_STATUS.DONE && (
        <ReadingSummary progress={progress} onReset={handleReset} />
      )}
    </div>
  );
};

export default FocusMode;
