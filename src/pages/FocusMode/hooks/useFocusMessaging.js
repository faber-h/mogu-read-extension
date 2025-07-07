import { useEffect } from "react";

import { useChromeExtension } from "@/hooks/useChromeExtension";

import { useFocusActions } from "../hooks/useFocusActions";
import { useFocusStore } from "../stores/useFocusStore";

export function useFocusMessaging() {
  const setIsContentDetected = useFocusStore(
    (store) => store.setIsContentDetected
  );
  const updateReadingProgress = useFocusStore(
    (store) => store.updateReadingProgress
  );
  const setPreviewMode = useFocusStore((store) => store.setPreviewMode);

  const { sendMessageSafely } = useChromeExtension();
  const { handleReset } = useFocusActions();

  useEffect(() => {
    sendMessageSafely({ type: "CHECK_FOCUS_MODE_REQUEST" });

    const listener = (message, _, sendResponse) => {
      if (message.type === "CHECK_FOCUS_MODE") {
        setIsContentDetected(message.isContentDetected);
      }

      if (message.type === "PROGRESS_UPDATE") {
        updateReadingProgress((prev) => ({
          ...prev,
          currentWord: message.currentWordIndex,
        }));
      }

      if (message.type === "PREVIEW_MODE_OFF") {
        setPreviewMode(false);
      }

      if (message.type === "FOCUS_MODE_RESET") {
        handleReset(false);
      }

      sendResponse({ ok: true });
      return true;
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [
    setIsContentDetected,
    updateReadingProgress,
    setPreviewMode,
    sendMessageSafely,
    handleReset,
  ]);
}
