chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

async function injectContentScript(tabId, tab) {
  try {
    if (!tab.url) return;

    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://")
    ) {
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
    });
  } catch (error) {
    console.debug("Content script injection failed:", error);
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  injectContentScript(activeInfo.tabId, tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    injectContentScript(tabId, tab);
  }
});
