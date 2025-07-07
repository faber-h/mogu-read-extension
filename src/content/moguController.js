import { findContentElement } from "./contentDetector.js";

export function initializeMogu() {
  if (document.getElementById("mogu")) return;

  const mogu = document.createElement("img");
  mogu.id = "mogu";
  mogu.src = chrome.runtime.getURL("images/mogu-eat-motion.png");
  document.body.appendChild(mogu);
}

export function clearMoguTimeout(state) {
  if (state.timeoutId) {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
  }
}

export function positionMoguToCurrent(state) {
  const mogu = document.getElementById("mogu");
  const allWords = document.querySelectorAll(".mogu-word");
  if (!mogu || !allWords.length) return;

  const word = allWords[state.currentIdx];
  if (!word) return;

  const rect = word.getBoundingClientRect();
  mogu.style.transition = "none";
  mogu.style.left = `${rect.left + window.scrollX}px`;
  mogu.style.top = `${rect.top + window.scrollY}px`;
}

function sendMessageSafely(message) {
  try {
    chrome.runtime.sendMessage(message, () => {
      if (chrome.runtime.lastError) {
        console.warn("메시지 전송 실패:", chrome.runtime.lastError.message);
      }
    });
  } catch (error) {
    console.warn("메시지 전송 중 오류:", error);
  }
}

export function startMoguEating(state) {
  clearMoguTimeout(state);

  const mogu = document.getElementById("mogu");
  const allWords = Array.from(document.querySelectorAll(".mogu-word"));
  if (!mogu || !allWords.length) return;

  if (state.currentIdx === 0) {
    const firstWord = allWords[state.currentIdx];
    const rect = firstWord.getBoundingClientRect();
    mogu.style.transition = "none";
    mogu.style.left = `${rect.left + window.scrollX}px`;
    mogu.style.top = `${rect.top + window.scrollY}px`;
  }

  mogu.style.opacity = "1";
  moveMogu(allWords, mogu, state);
}

function calcWordDuration(word, state) {
  const baseLength = 4;
  const extraChars = Math.max(word.length - baseLength, 0);
  const extraSpeed = extraChars * 15;
  return state.readingSpeed + extraSpeed;
}

function moveMogu(allWords, mogu, state) {
  if (state.paused) return;

  if (state.currentIdx >= allWords.length) {
    mogu.style.opacity = "0";
    sendMessageSafely({
      type: "PROGRESS_UPDATE",
      currentWordIndex: state.currentIdx,
    });
    return;
  }

  if (state.previewMode && state.currentIdx >= 20) {
    mogu.style.opacity = "0";
    resetFocusMode(state);
    sendMessageSafely({ type: "PREVIEW_MODE_OFF" });
    return;
  }

  const word = allWords[state.currentIdx];
  const rect = word.getBoundingClientRect();
  const startX = rect.left + window.scrollX;
  const endX = rect.right + window.scrollX;
  const wordTop = rect.top + window.scrollY;

  mogu.style.transition = "none";
  mogu.style.left = `${startX}px`;
  mogu.style.top = `${wordTop}px`;

  const totalDuration = calcWordDuration(word.textContent, state);
  const animationDuration = Math.floor(totalDuration * 0.7);

  requestAnimationFrame(() => {
    mogu.style.transition = `left ${animationDuration}ms ease`;
    mogu.style.left = `${endX}px`;
  });

  word.classList.add("passed");

  const windowHeight = window.innerHeight;
  const windowCenterY = windowHeight / 2;
  const distanceToCenter = Math.abs(rect.top - windowCenterY);

  if (distanceToCenter > 50) {
    word.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  state.timeoutId = setTimeout(() => {
    state.currentIdx++;
    sendMessageSafely({
      type: "PROGRESS_UPDATE",
      currentWordIndex: state.currentIdx,
    });
    moveMogu(allWords, mogu, state);
  }, totalDuration);
}

export function resetFocusMode(state) {
  state.previewMode = false;
  clearMoguTimeout(state);

  const content = findContentElement();
  if (state.originalContent && content && content.isSameNode(content)) {
    content.replaceWith(state.originalContent);
    state.originalContent = null;
  }

  const mogu = document.getElementById("mogu");
  if (mogu) {
    mogu.style.opacity = "0";
    mogu.style.left = "0px";
    mogu.style.top = "0px";
  }

  window.scrollTo({ top: 0, behavior: "instant" });
}
