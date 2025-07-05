import { sendContentDetection } from "./contentDetector.js";
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

  chrome.runtime.onMessage.addListener((message) => {
    handleMessage(message, window.moguReadState);
    return true;
  });
}
