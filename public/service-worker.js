chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.scripting.executeScript({
    target: { tabId: activeInfo.tabId },
    files: ["content.js"],
  });
});
