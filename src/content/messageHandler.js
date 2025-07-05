import { sendContentDetection } from "./contentDetector.js";
import {
  clearMoguTimeout,
  positionMoguToCurrent,
  startMoguEating,
  resetFocusMode,
} from "./moguController.js";
import { state } from "./state.js";
import { wrapContentWords, updateWordsProgress } from "./wordWrapper.js";

export function handleMessage(message) {
  switch (message.type) {
    case "CHECK_FOCUS_MODE_REQUEST":
      sendContentDetection();
      break;

    case "START_READING":
      state.paused = false;
      resetFocusMode();
      wrapContentWords();
      state.currentIdx = 0;
      state.readingSpeed = message.readingSpeed || 300;
      startMoguEating();
      break;

    case "START_PREVIEW":
      resetFocusMode();
      state.previewMode = true;
      state.paused = false;
      clearMoguTimeout();
      wrapContentWords();
      state.currentIdx = 0;
      state.readingSpeed = message.readingSpeed || 300;
      startMoguEating();
      break;

    case "STOP_PREVIEW":
    case "RESET_ARTICLE":
      resetFocusMode();
      break;

    case "PAUSE_READING":
      state.paused = true;
      clearMoguTimeout();
      break;

    case "REWIND_READING":
      state.paused = false;
      clearMoguTimeout();
      state.currentIdx = Math.max(state.currentIdx - 1, 0);
      updateWordsProgress();
      positionMoguToCurrent();
      startMoguEating();
      break;

    case "RESTART_READING":
      state.paused = false;
      clearMoguTimeout();
      state.currentIdx = 0;
      updateWordsProgress();
      startMoguEating();
      break;

    case "RESUME_READING":
      state.paused = false;
      startMoguEating();
      break;

    default:
      console.warn("처리되지 않은 메시지 타입:", message.type);
  }
}
