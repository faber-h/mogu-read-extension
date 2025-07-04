(() => {
  let originalArticle;
  let currentIdx = 0;
  let paused = false;
  let timeoutId = null;
  let readingSpeed = 300;

  detectAndSend();
  injectMogu();

  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case "CHECK_FOCUS_MODE_REQUEST":
        detectAndSend();
        break;

      case "START_READING":
        wrapArticleWords();
        paused = false;
        currentIdx = 0;
        readingSpeed = message.readingSpeed || 300;
        startMoguEating();
        break;

      case "RESET_ARTICLE":
        restoreOriginalArticle();
        break;

      case "PAUSE_READING":
        paused = true;
        clearMoguTimeout();
        break;

      case "REWIND_READING":
        paused = false;
        clearMoguTimeout();
        currentIdx = Math.max(currentIdx - 1, 0);
        updateWordsProgress(currentIdx);
        positionMoguToCurrent();
        startMoguEating();
        break;

      case "RESTART_READING":
        paused = false;
        clearMoguTimeout();
        currentIdx = 0;
        updateWordsProgress(currentIdx);
        startMoguEating();
        break;

      case "RESUME_READING":
        paused = false;
        clearMoguTimeout();
        startMoguEating();
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

  function injectMogu() {
    if (document.getElementById("mogu")) return;

    const mogu = document.createElement("img");
    mogu.id = "mogu";
    mogu.src = chrome.runtime.getURL("images/mogu-eat-motion.png");
    document.body.appendChild(mogu);
  }

  function wrapArticleWords() {
    const article = document.querySelector("article");
    if (!article) return;

    if (article.querySelector(".mogu-word")) {
      return;
    }

    if (!originalArticle) {
      originalArticle = article.cloneNode(true);
    }

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

  function updateWordsProgress(currentIdx) {
    const allWords = document.querySelectorAll(".mogu-word");
    allWords.forEach((wordElement, index) => {
      if (index < currentIdx) {
        wordElement.classList.add("passed");
      } else {
        wordElement.classList.remove("passed");
      }
    });
  }

  function clearMoguTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function positionMoguToCurrent() {
    const mogu = document.getElementById("mogu");
    const allWords = document.querySelectorAll(".mogu-word");
    if (!mogu || !allWords.length) return;

    const word = allWords[currentIdx];
    if (!word) return;

    const rect = word.getBoundingClientRect();
    mogu.style.transition = "none";
    mogu.style.left = `${rect.left + window.scrollX}px`;
    mogu.style.top = `${rect.top + window.scrollY}px`;
  }

  function startMoguEating() {
    clearMoguTimeout();

    const mogu = document.getElementById("mogu");
    const allWords = Array.from(document.querySelectorAll(".mogu-word"));
    if (!mogu || !allWords.length) return;

    mogu.style.opacity = "1";
    moveMogu(allWords, mogu);
  }

  function calcWordDuration(word) {
    const baseLength = 4;
    const extraChars = Math.max(word.length - baseLength, 0);
    const extraSpeed = extraChars * 15;

    return readingSpeed + extraSpeed;
  }

  function moveMogu(allWords, mogu) {
    if (paused) return;

    if (currentIdx >= allWords.length) {
      mogu.style.opacity = "0";
      chrome.runtime.sendMessage({
        type: "PROGRESS_UPDATE",
        currentWordIndex: currentIdx,
      });
      return;
    }

    const word = allWords[currentIdx];
    const rect = word.getBoundingClientRect();
    const startX = rect.left + window.scrollX;
    const endX = rect.right + window.scrollX;
    const wordTop = rect.top + window.scrollY;

    mogu.style.transition = "none";
    mogu.style.left = `${startX}px`;
    mogu.style.top = `${wordTop}px`;

    const duration = calcWordDuration(word.textContent);
    requestAnimationFrame(() => {
      mogu.style.transition = `left ${duration}ms ease`;
      mogu.style.left = `${endX}px`;
    });

    word.classList.add("passed");

    timeoutId = setTimeout(() => {
      currentIdx++;
      chrome.runtime.sendMessage({
        type: "PROGRESS_UPDATE",
        currentWordIndex: currentIdx,
      });
      moveMogu(allWords, mogu);
    }, duration);
  }

  function restoreOriginalArticle() {
    const currentArticle = document.querySelector("article");
    if (originalArticle && currentArticle) {
      currentArticle.replaceWith(originalArticle);
      originalArticle = null;
    }
  }
})();
