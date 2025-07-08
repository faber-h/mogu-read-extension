import { sendContentDetection } from "./contentDetector.js";
import { setupVisibilityListener, setupMessageListener } from "./listeners.js";
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

  setupVisibilityListener(window.moguReadState);
  setupMessageListener(window.moguReadState);
}
