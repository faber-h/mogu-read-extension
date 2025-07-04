(() => {
  let originalContent;
  let currentIdx = 0;
  let paused = false;
  let timeoutId = null;
  let readingSpeed = 300;
  let previewMode = false;

  detectAndSend();
  injectMogu();

  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case "CHECK_FOCUS_MODE_REQUEST":
        detectAndSend();
        break;

      case "START_READING":
        paused = false;
        resetFocusMode();
        wrapContentWords();
        currentIdx = 0;
        readingSpeed = message.readingSpeed || 300;
        startMoguEating(previewMode);
        break;

      case "START_PREVIEW":
        resetFocusMode();
        previewMode = true;
        paused = false;
        clearMoguTimeout();
        wrapContentWords();
        currentIdx = 0;
        readingSpeed = message.readingSpeed || 300;
        startMoguEating(previewMode);
        break;

      case "STOP_PREVIEW":
        resetFocusMode();
        break;

      case "RESET_ARTICLE":
        resetFocusMode();
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
        startMoguEating(previewMode);
        break;

      case "RESTART_READING":
        paused = false;
        clearMoguTimeout();
        currentIdx = 0;
        updateWordsProgress(currentIdx);
        startMoguEating(previewMode);
        break;

      case "RESUME_READING":
        paused = false;
        startMoguEating(previewMode);
        break;

      default:
        console.warn("처리되지 않은 메시지 타입:", message.type);
    }
  });

  function detectAndSend() {
    const content = findContentElement();
    const isContentDetected = !!content;

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

  function findContentElement() {
    const candidates = [
      document.querySelector("article"),
      document.querySelector("main"),
      document.querySelector("section"),
      document.querySelector("div[id*='content']"),
      document.querySelector("div[id*='container']"),
      document.querySelector("div[class*='content']"),
      document.querySelector("div[class*='container']"),
    ];

    for (const candidate of candidates) {
      if (candidate) {
        const text = candidate.innerText || "";
        const wordCount = text.trim().split(/\s+/).length;
        const paragraphCount = candidate.querySelectorAll("p, li").length || 0;
        if (wordCount >= 30 && paragraphCount >= 2) {
          return candidate;
        }
      }
    }

    return null;
  }

  function expandDetailsElements() {
    const detailsElements = document.querySelectorAll("details");
    detailsElements.forEach((details) => {
      details.open = true;
    });
  }

  function wrapContentWords() {
    expandDetailsElements();

    const content = findContentElement();
    if (!content || content.querySelector(".mogu-word")) return;

    if (!originalContent) {
      originalContent = content.cloneNode(true);
    }

    const paragraphs = content.querySelectorAll("p, li");
    paragraphs.forEach((element, elementIndex) => {
      let wordIndexCounter = 0;
      const getWordIndex = () => wordIndexCounter++;
      wrapWords(element, elementIndex, getWordIndex);
    });
  }

  function wrapWords(element, elementIndex, getWordIndex) {
    const nodes = Array.from(element.childNodes);

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (!text) return;

        const words = text.split(/\s+/).filter(Boolean);
        const fragment = document.createDocumentFragment();

        words.forEach((word, index) => {
          const span = document.createElement("span");
          span.className = "mogu-word";
          span.dataset.wordId = `${elementIndex}-${getWordIndex()}`;
          span.textContent = word;

          fragment.appendChild(span);

          if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(" "));
          }
        });

        node.replaceWith(fragment);
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        !node.classList.contains("mogu-word")
      ) {
        wrapWords(node, elementIndex, getWordIndex);
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

  function startMoguEating(isPreview = false) {
    clearMoguTimeout();

    const mogu = document.getElementById("mogu");
    const allWords = Array.from(document.querySelectorAll(".mogu-word"));
    if (!mogu || !allWords.length) return;

    if (currentIdx === 0) {
      const firstWord = allWords[currentIdx];
      const rect = firstWord.getBoundingClientRect();
      mogu.style.transition = "none";
      mogu.style.left = `${rect.left + window.scrollX}px`;
      mogu.style.top = `${rect.top + window.scrollY}px`;
    }

    mogu.style.opacity = "1";

    moveMogu(allWords, mogu, isPreview);
  }

  function calcWordDuration(word) {
    const baseLength = 4;
    const extraChars = Math.max(word.length - baseLength, 0);
    const extraSpeed = extraChars * 15;

    return readingSpeed + extraSpeed;
  }

  function moveMogu(allWords, mogu, isPreview) {
    if (paused) return;

    if (currentIdx >= allWords.length) {
      mogu.style.opacity = "0";
      chrome.runtime.sendMessage({
        type: "PROGRESS_UPDATE",
        currentWordIndex: currentIdx,
      });
      return;
    }

    if (isPreview && currentIdx >= 20) {
      mogu.style.opacity = "0";
      resetFocusMode();
      chrome.runtime.sendMessage({ type: "PREVIEW_MODE_OFF" });
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

    const totalDuration = calcWordDuration(word.textContent);
    const animationDuration = Math.min(totalDuration * 0.7, 400);

    requestAnimationFrame(() => {
      mogu.style.transition = `left ${animationDuration}ms ease`;
      mogu.style.left = `${endX}px`;
    });

    word.classList.add("passed");

    timeoutId = setTimeout(() => {
      currentIdx++;
      chrome.runtime.sendMessage({
        type: "PROGRESS_UPDATE",
        currentWordIndex: currentIdx,
      });
      moveMogu(allWords, mogu, isPreview);
    }, totalDuration);
  }

  function resetFocusMode() {
    previewMode = false;
    clearMoguTimeout();

    const content = findContentElement();
    if (originalContent && content && content.isSameNode(content)) {
      content.replaceWith(originalContent);
      originalContent = null;
    }

    const mogu = document.getElementById("mogu");
    if (mogu) {
      mogu.style.opacity = "0";
      mogu.style.left = "0px";
      mogu.style.top = "0px";
    }
  }
})();
