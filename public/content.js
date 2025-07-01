(() => {
  const article = document.querySelector("article");
  const isContentDetected = !!article;

  chrome.runtime.sendMessage({
    type: "CHECK_FOCUS_MODE",
    isContentDetected: isContentDetected,
  });
})();
