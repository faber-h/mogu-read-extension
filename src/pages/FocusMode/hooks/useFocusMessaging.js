import { useEffect } from "react";

import { useFocusActions } from "../hooks/useFocusActions";
import { useFocusStore } from "../stores/useFocusStore";

export function useFocusMessaging() {
  const updateReadingProgress = useFocusStore(
    (store) => store.updateReadingProgress
  );
  const setPreviewMode = useFocusStore((store) => store.setPreviewMode);

  const { handleReset } = useFocusActions();

  useEffect(() => {
    const listener = (message, _, sendResponse) => {
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
  }, [updateReadingProgress, setPreviewMode, handleReset]);
}
