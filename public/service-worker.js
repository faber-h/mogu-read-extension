chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.scripting.executeScript({
    target: { tabId: activeInfo.tabId },
    files: ["content.js"],
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
    });
  }
});
