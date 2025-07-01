(() => {
  detectAndSend();

  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case "CHECK_FOCUS_MODE_REQUEST":
        detectAndSend();
        break;

      case "START_READING":
        wrapArticleWords();
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

  function wrapArticleWords() {
    const article = document.querySelector("article");
    if (!article) return;

    const paragraphs = article.querySelectorAll("p");
    paragraphs.forEach((paragraph, paragraphIndex) => {
      let wordIndexCounter = 0;

      const getWordIndex = () => wordIndexCounter++;
      wrapWordsInParagraph(paragraph, paragraphIndex, getWordIndex);
    });
  }

  function wrapWordsInParagraph(paragraph, paragraphIndex, getWordIndex) {
    const paragraphNodes = Array.from(paragraph.childNodes);

    paragraphNodes.forEach((paragraphNode) => {
      if (paragraphNode.nodeType === Node.TEXT_NODE) {
        const text = paragraphNode.textContent.trim();
        if (!text) return;

        const words = text.split(/\s+/).filter(Boolean);
        const fragment = document.createDocumentFragment();

        words.forEach((word, index) => {
          const span = document.createElement("span");
          span.className = "mogu-word";
          span.dataset.wordId = `${paragraphIndex}-${getWordIndex()}`;
          span.textContent = word;

          fragment.appendChild(span);

          if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(" "));
          }
        });

        paragraphNode.replaceWith(fragment);
      } else if (
        paragraphNode.nodeType === Node.ELEMENT_NODE &&
        !paragraphNode.classList.contains("mogu-word")
      ) {
        wrapWordsInParagraph(paragraphNode, paragraphIndex, getWordIndex);
      }
    });
  }
})();
