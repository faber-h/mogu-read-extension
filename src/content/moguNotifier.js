export function sendDuplicateToast(existingText) {
  chrome.runtime.sendMessage({
    type: "SHOW_DUPLICATE_TOAST",
    payload: { existingText },
  });
}
