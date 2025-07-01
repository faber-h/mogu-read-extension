import { useState, useEffect, useCallback } from "react";

import ReadingConfig from "./components/ReadingConfig";
import ReadingContent from "./components/ReadingContent";
import ReadingControls from "./components/ReadingControls";
import ReadingProgress from "./components/ReadingProgress";
import ReadingSummary from "./components/ReadingSummary";
import { READING_SPEED } from "./constants/readingSpeed";
import { READ_STATUS } from "./constants/readStatus";

const FocusMode = () => {
  const [isContentDetected, setIsContentDetected] = useState(false);
  const [readStatus, setReadStatus] = useState(READ_STATUS.IDLE);
  const [readingSpeed, setReadingSpeed] = useState(READING_SPEED.NORMAL);
  const [progress, setProgress] = useState({
    currentLine: 0,
    totalLines: 5,
    elapsed: 0,
  });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { type: "CHECK_FOCUS_MODE_REQUEST" });
    });

    const listener = (message) => {
      if (message.type === "CHECK_FOCUS_MODE") {
        setIsContentDetected(message.isContentDetected);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const handleStart = useCallback(() => {
    setProgress({ currentLine: 0, totalLines: 5, elapsed: 0 });
    setReadStatus(READ_STATUS.READING);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        return;
      }

      const tabId = tabs[0].id;

      chrome.tabs
        .sendMessage(tabId, {
          type: "START_READING",
        })
        .catch((err) => {
          console.error("메시지 전달 실패:", err);
        });
    });
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

  const handleReset = useCallback(() => {
    setReadStatus(READ_STATUS.IDLE);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      const tabId = tabs[0].id;
      chrome.tabs
        .sendMessage(tabId, { type: "RESET_ARTICLE" })
        .catch((error) => {
          console.error("원본 복원 실패:", error);
        });
    });
  }, []);

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
