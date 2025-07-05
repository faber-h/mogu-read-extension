chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://")
    ) {
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: activeInfo.tabId },
      files: ["content.js"],
    });
  } catch (error) {
    console.debug("Content script injection failed:", error);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    try {
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
});
