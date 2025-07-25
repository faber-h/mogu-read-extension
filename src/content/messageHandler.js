import { sendContentDetection } from "./contentDetector.js";
import { executeDeclutter } from "./declutterController.js";
import { showDeclutterHistoryIndicator } from "./declutterHistoryIndicator.js";
import {
  clearMoguTimeout,
  positionMoguToCurrent,
  startMoguEating,
  resetFocusMode,
} from "./moguController.js";
import { unwrapMoguWord, highlightMoguWord } from "./moguWordActions.js";
import { wrapContentWords, updateWordsProgress } from "./wordWrapper.js";

export function handleMessage(message, state) {
  switch (message.type) {
    case "CHECK_FOCUS_MODE_REQUEST":
      sendContentDetection();
      break;

    case "START_READING":
      state.paused = false;
      resetFocusMode(state);
      wrapContentWords(state);
      state.currentIdx = 0;
      state.readingSpeed = message.readingSpeed || 300;
      startMoguEating(state);
      break;

    case "START_PREVIEW":
      resetFocusMode(state);
      state.previewMode = true;
      state.paused = false;
      clearMoguTimeout(state);
      wrapContentWords(state);
      state.currentIdx = 0;
      state.readingSpeed = message.readingSpeed || 300;
      startMoguEating(state);
      break;

    case "STOP_PREVIEW":
    case "RESET_FOCUS_CONTENT":
      resetFocusMode(state);
      break;

    case "PAUSE_READING":
      state.paused = true;
      clearMoguTimeout(state);
      break;

    case "REWIND_READING":
      state.paused = false;
      clearMoguTimeout(state);
      state.currentIdx = Math.max(state.currentIdx - 1, 0);
      updateWordsProgress(state);
      positionMoguToCurrent(state);
      startMoguEating(state);
      break;

    case "RESTART_READING":
      state.paused = false;
      clearMoguTimeout(state);
      state.currentIdx = 0;
      updateWordsProgress(state);
      startMoguEating(state);
      break;

    case "RESUME_READING":
      state.paused = false;
      startMoguEating(state);
      break;

    case "DECLUTTER":
      executeDeclutter(message.wordIds);
      break;

    case "REMOVE_SENTENCE":
      unwrapMoguWord(message.removeId);
      break;

    case "HIGHLIGHT_SENTENCE":
      highlightMoguWord(message.sentenceId);
      break;

    case "SHOW_DECLUTTER_HISTORY_POSITION":
      showDeclutterHistoryIndicator(message.sentenceId);
      break;

    default:
      console.warn("처리되지 않은 메시지 타입:", message.type);
  }
}
