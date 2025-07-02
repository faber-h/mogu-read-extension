import { useEffect } from "react";

import { READING_SPEED_INTERVAL } from "../constants/readingSpeed";

const ReadingContent = ({
  readingProgress,
  setReadingProgress,
  readingSpeed,
  onDone,
}) => {
  const readingSpeedInterval = READING_SPEED_INTERVAL[readingSpeed] || 2000;

  useEffect(() => {
    if (readingProgress.currentWord >= readingProgress.totalWords) {
      onDone();
      return;
    }

    const timer = setInterval(() => {
      setReadingProgress((prev) => ({
        ...prev,
        currentWord: prev.currentWord + 1,
      }));

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;

        const tabId = tabs[0].id;

        chrome.tabs.sendMessage(tabId, {
          type: "UPDATE_PROGRESS",
          currentWordIndex: readingProgress.currentWord + 1,
        });
      });
    }, readingSpeedInterval);

    return () => clearInterval(timer);
  }, [
    readingProgress.currentWord,
    readingProgress.totalWords,
    readingSpeedInterval,
    onDone,
    setReadingProgress,
  ]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full rounded border border-purple-200 p-4 text-center">
        <p className="text-lg font-medium">👀 몰입 읽기 중</p>
        <p>
          현재 단어: {readingProgress.currentWord} /{" "}
          {readingProgress.totalWords}
        </p>
      </div>
    </div>
  );
};

export default ReadingContent;
