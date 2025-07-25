import { checkAndApplyAutoDeclutter } from "./autoDeclutterManager.js";
import { sendContentDetection } from "./contentDetector.js";
import {
  setupVisibilityListener,
  setupMessageListener,
  setupSelectionListeners,
} from "./listeners.js";
import { initializeMogu } from "./moguController.js";

if (!window.moguReadState) {
  window.moguReadState = {
    originalContent: null,
    currentIdx: 0,
    paused: false,
    timeoutId: null,
    readingSpeed: 300,
    previewMode: false,
    isContentDetected: false,
  };

  checkAndApplyAutoDeclutter();

  sendContentDetection(window.moguReadState);
  initializeMogu();

  setupVisibilityListener(window.moguReadState);
  setupMessageListener(window.moguReadState);
  setupSelectionListeners(window.moguReadState);
}
