import { getSelectedTextDataList } from "./getSelectionData.js";
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

export function setupSelectionListeners() {
  let lastSelections = [];

  document.addEventListener("mouseup", () => {
    const selectionList = getSelectedTextDataList();
    if (!selectionList.length) return;

    selectionList.forEach((data) => {
      if (lastSelections.includes(data.id)) return;

      chrome.runtime.sendMessage({
        type: "ADD_SENTENCE",
        payload: data,
      });

      lastSelections.push(data.id);
    });
  });

  document.addEventListener("mousedown", () => {
    lastSelections = [];
  });
}
