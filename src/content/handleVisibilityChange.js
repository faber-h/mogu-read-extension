import { resetFocusMode } from "./moguController.js";

export function handleVisibilityChange(state) {
  if (document.visibilityState === "hidden") {
    const mogu = document.getElementById("mogu");
    const allWords = Array.from(document.querySelectorAll(".mogu-word"));
    if (!mogu || !allWords.length) return;

    resetFocusMode(state);
    chrome.runtime.sendMessage({ type: "FOCUS_MODE_RESET" });
  }
}
