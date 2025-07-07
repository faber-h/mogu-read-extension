import { sendContentDetection } from "./contentDetector.js";
import { handleVisibilityChange } from "./handleVisibilityChange";
import { handleMessage } from "./messageHandler.js";
import { initializeMogu } from "./moguController.js";

if (!window.moguReadState) {
  window.moguReadState = {
    originalContent: null,
    currentIdx: 0,
    paused: false,
    timeoutId: null,
    readingSpeed: 300,
    previewMode: false,
  };

  sendContentDetection();
  initializeMogu();

  document.addEventListener("visibilitychange", () => {
    handleVisibilityChange(window.moguReadState);
  });

  chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    try {
      handleMessage(message, window.moguReadState);
      sendResponse({ ok: true });
      return true;
    } catch (error) {
      console.error("메시지 리스너 오류:", error);
    }
  });
}
