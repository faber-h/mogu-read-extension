import { findContentElement } from "./contentDetector.js";
import { state } from "./state.js";

export function initializeMogu() {
  if (document.getElementById("mogu")) return;

  const mogu = document.createElement("img");
  mogu.id = "mogu";
  mogu.src = chrome.runtime.getURL("images/mogu-eat-motion.png");
  document.body.appendChild(mogu);
}

export function clearMoguTimeout() {
  if (state.timeoutId) {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
  }
}

export function positionMoguToCurrent() {
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

export function startMoguEating() {
  clearMoguTimeout();

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
  moveMogu(allWords, mogu);
}

function calcWordDuration(word) {
  const baseLength = 4;
  const extraChars = Math.max(word.length - baseLength, 0);
  const extraSpeed = extraChars * 15;
  return state.readingSpeed + extraSpeed;
}

function moveMogu(allWords, mogu) {
  if (state.paused) return;

  if (state.currentIdx >= allWords.length) {
    mogu.style.opacity = "0";
    chrome.runtime.sendMessage({
      type: "PROGRESS_UPDATE",
      currentWordIndex: state.currentIdx,
    });
    return;
  }

  if (state.previewMode && state.currentIdx >= 20) {
    mogu.style.opacity = "0";
    resetFocusMode();
    chrome.runtime.sendMessage({ type: "PREVIEW_MODE_OFF" });
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

  const totalDuration = calcWordDuration(word.textContent);
  const animationDuration = Math.min(totalDuration * 0.7, 400);

  requestAnimationFrame(() => {
    mogu.style.transition = `left ${animationDuration}ms ease`;
    mogu.style.left = `${endX}px`;
  });

  word.classList.add("passed");

  state.timeoutId = setTimeout(() => {
    state.currentIdx++;
    chrome.runtime.sendMessage({
      type: "PROGRESS_UPDATE",
      currentWordIndex: state.currentIdx,
    });
    moveMogu(allWords, mogu);
  }, totalDuration);
}

export function resetFocusMode() {
  state.previewMode = false;
  clearMoguTimeout();

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
}
