import { useState, useEffect, useCallback } from "react";

import ReadingConfig from "./components/ReadingConfig";
import ReadingContent from "./components/ReadingContent";
import ReadingControls from "./components/ReadingControls";
import ReadingProgress from "./components/ReadingProgress";
import ReadingSummary from "./components/ReadingSummary";
import {
  READING_SPEED,
  READING_SPEED_INTERVAL,
} from "./constants/readingSpeed";
import { READ_STATUS } from "./constants/readStatus";

const FocusMode = () => {
  const [isContentDetected, setIsContentDetected] = useState(false);
  const [readStatus, setReadStatus] = useState(READ_STATUS.IDLE);
  const [readingSpeed, setReadingSpeed] = useState(READING_SPEED.NORMAL);
  const [previewMode, setPreviewMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState({
    currentWord: 0,
    totalWords: 0,
    elapsed: 0,
  });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { type: "CHECK_FOCUS_MODE_REQUEST" });
    });

    const listener = (message) => {
      if (message.type === "CHECK_FOCUS_MODE") {
        setIsContentDetected(message.isContentDetected);
      }

      if (message.type === "PROGRESS_UPDATE") {
        setReadingProgress((prev) => ({
          ...prev,
          currentWord: message.currentWordIndex,
        }));
      }

      if (message.type === "PREVIEW_MODE_OFF") {
        setPreviewMode(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const handleSpeedPreview = (newSpeed) => {
    setReadingSpeed(newSpeed);
    setPreviewMode(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, {
        type: "START_PREVIEW",
        readingSpeed: READING_SPEED_INTERVAL[newSpeed],
      });
    });
  };

  const handleStopPreview = () => {
    setPreviewMode(false);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { type: "STOP_PREVIEW" });
    });
  };

  const handleStart = useCallback(() => {
    setPreviewMode(false);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      const tabId = tabs[0].id;

      chrome.tabs.sendMessage(
        tabId,
        {
          type: "START_READING",
          readingSpeed: READING_SPEED_INTERVAL[readingSpeed],
        },
        () => {
          chrome.scripting.executeScript(
            {
              target: { tabId },
              func: () => document.querySelectorAll(".mogu-word").length,
            },
            (results) => {
              const totalWords = results[0].result || 0;
              setReadingProgress({ currentWord: 0, totalWords, elapsed: 0 });
              setReadStatus(READ_STATUS.READING);
            }
          );
        }
      );
    });
  }, [readingSpeed]);

  const handleDone = useCallback(() => {
    setReadStatus(READ_STATUS.DONE);
  }, []);

  useEffect(() => {
    if (
      readingProgress.totalWords > 0 &&
      readingProgress.currentWord >= readingProgress.totalWords
    ) {
      handleDone();
    }
  }, [readingProgress.currentWord, readingProgress.totalWords, handleDone]);

  const sendControlMessage = (type) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { type });
    });
  };

  const handlePause = () => {
    setPaused(true);
    sendControlMessage("PAUSE_READING");
  };
  const handleRewind = () => sendControlMessage("REWIND_READING");
  const handleRestart = () => sendControlMessage("RESTART_READING");
  const handleResume = () => {
    setPaused(false);
    sendControlMessage("RESUME_READING");
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
          onSpeedPreview={handleSpeedPreview}
          onStopPreview={handleStopPreview}
          previewMode={previewMode}
          onStart={handleStart}
          isContentDetected={isContentDetected}
        />
      )}

      {readStatus === READ_STATUS.READING && (
        <>
          <ReadingContent readingProgress={readingProgress} />
          <ReadingProgress
            paused={paused}
            readingProgress={readingProgress}
            setReadingProgress={setReadingProgress}
          />
          <ReadingControls
            paused={paused}
            onPause={handlePause}
            onRewind={handleRewind}
            onRestart={handleRestart}
            onResume={handleResume}
          />
        </>
      )}

      {readStatus === READ_STATUS.DONE && (
        <ReadingSummary
          readingProgress={readingProgress}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default FocusMode;
