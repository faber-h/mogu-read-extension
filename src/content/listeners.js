import { handleVisibilityChange } from "./handleVisibilityChange";
import { handleMessage } from "./messageHandler.js";

export function setupVisibilityListener(state) {
  document.addEventListener("visibilitychange", () => {
    handleVisibilityChange(state);
  });
}

export function setupMessageListener(state) {
  chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    try {
      handleMessage(message, state);
      sendResponse({ ok: true });
      return true;
    } catch (error) {
      console.error("메시지 리스너 오류:", error);
    }
  });
}
