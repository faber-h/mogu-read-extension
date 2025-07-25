import { useCallback } from "react";

import { useChromeExtension } from "@/hooks/useChromeExtension";

import { READING_SPEED_INTERVAL } from "../constants/readingSpeed";
import { READ_STATUS } from "../constants/readStatus";
import { useFocusStore } from "../stores/useFocusStore";

export function useFocusActions() {
  const {
    readingSpeed,
    setReadingSpeed,
    setPreviewMode,
    setReadingProgress,
    setReadStatus,
    setPaused,
  } = useFocusStore();

  const { sendMessageSafely, executeScript, getCurrentTab } =
    useChromeExtension();

  const handleSpeedPreview = async (newSpeed) => {
    setReadingSpeed(newSpeed);
    setPreviewMode(true);

    await sendMessageSafely({
      type: "START_PREVIEW",
      readingSpeed: READING_SPEED_INTERVAL[newSpeed],
    });
  };

  const handleStopPreview = async () => {
    setPreviewMode(false);
    await sendMessageSafely({ type: "STOP_PREVIEW" });
  };

  const handleStart = useCallback(async () => {
    setPreviewMode(false);

    await sendMessageSafely({
      type: "START_READING",
      readingSpeed: READING_SPEED_INTERVAL[readingSpeed],
    });

    const tab = await getCurrentTab();
    if (!tab) return;

    const results = await executeScript(
      tab.id,
      () => document.querySelectorAll(".mogu-word").length
    );
    const totalWords = results?.[0]?.result || 0;

    setReadingProgress({ currentWord: 0, totalWords, elapsed: 0 });
    setReadStatus(READ_STATUS.READING);
  }, [
    readingSpeed,
    sendMessageSafely,
    executeScript,
    getCurrentTab,
    setPreviewMode,
    setReadingProgress,
    setReadStatus,
  ]);

  const handlePause = () => {
    setPaused(true);
    sendMessageSafely({ type: "PAUSE_READING" });
  };

  const handleResume = () => {
    setPaused(false);
    sendMessageSafely({ type: "RESUME_READING" });
  };

  const handleRewind = () => {
    setPaused(false);
    sendMessageSafely({ type: "REWIND_READING" });
  };

  const handleRestart = () => {
    setPaused(false);
    sendMessageSafely({ type: "RESTART_READING" });
  };

  const resetReadingStore = () => {
    setReadingProgress({ currentWord: 0, totalWords: 0, elapsed: 0 });
    setPaused(false);
    setPreviewMode(false);
    setReadStatus(READ_STATUS.IDLE);
  };

  const handleReset = (includeContentReset = true) => {
    resetReadingStore();
    if (includeContentReset) {
      sendMessageSafely({ type: "RESET_FOCUS_CONTENT" });
    }
  };

  return {
    handleSpeedPreview,
    handleStopPreview,
    handleStart,
    handlePause,
    handleResume,
    handleRewind,
    handleRestart,
    handleReset,
  };
}
