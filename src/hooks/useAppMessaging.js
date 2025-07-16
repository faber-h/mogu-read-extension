import { useEffect } from "react";

import { useChromeExtension } from "@/hooks/useChromeExtension";
import { useAppStore } from "@/stores/useAppStore";

export function useAppMessaging() {
  const setIsContentDetected = useAppStore(
    (store) => store.setIsContentDetected
  );
  const { sendMessageSafely } = useChromeExtension();

  useEffect(() => {
    sendMessageSafely({ type: "CHECK_FOCUS_MODE_REQUEST" });

    const listener = (message, _, sendResponse) => {
      if (message.type === "CHECK_FOCUS_MODE") {
        setIsContentDetected(message.isContentDetected);
      }

      sendResponse({ ok: true });
      return true;
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [setIsContentDetected, sendMessageSafely]);
}
