import { findContentElement, isVisible } from "./contentDetector.js";
import { state } from "./state.js";

export function expandDetailsElements() {
  const detailsElements = document.querySelectorAll("details");
  detailsElements.forEach((details) => {
    details.open = true;
  });
}

export function wrapContentWords() {
  expandDetailsElements();

  const content = findContentElement();
  if (!content || content.querySelector(".mogu-word")) return;

  if (!state.originalContent) {
    state.originalContent = content.cloneNode(true);
  }

  const elements = Array.from(content.querySelectorAll("p, li")).filter(
    isVisible
  );

  elements.forEach((element, elementIndex) => {
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

export function updateWordsProgress() {
  const allWords = document.querySelectorAll(".mogu-word");
  allWords.forEach((wordElement, index) => {
    if (index < state.currentIdx) {
      wordElement.classList.add("passed");
    } else {
      wordElement.classList.remove("passed");
    }
  });
}
