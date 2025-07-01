(() => {
  detectAndSend();

  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case "CHECK_FOCUS_MODE_REQUEST":
        detectAndSend();
        break;

      case "START_READING":
        wrapArticleLines();
        break;

      default:
        console.warn("처리되지 않은 메시지 타입:", message.type);
    }
  });

  function detectAndSend() {
    const article = document.querySelector("article");
    const isContentDetected = !!article;

    chrome.runtime.sendMessage({
      type: "CHECK_FOCUS_MODE",
      isContentDetected,
    });
  }

  function wrapArticleLines() {
    const article = document.querySelector("article");
    if (!article) return;

    const paragraphs = article.querySelectorAll("p, div");
    paragraphs.forEach((paragraph, paragraphIdx) => {
      let text = paragraph.innerText.trim();
      if (!text) return;

      const lines = text.split("\n").filter((line) => line.trim() !== "");

      const wrappedLines = lines.map((line, lineIdx) => {
        return `<span class="mogu-line" data-line-id="${paragraphIdx}-${lineIdx}">${line}</span>`;
      });

      paragraph.innerHTML = wrappedLines.join("<br>");
    });
  }
})();
