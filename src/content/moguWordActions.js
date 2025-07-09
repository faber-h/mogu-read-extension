import {
  getUniqueCssSelector,
  getTextOffset,
  generateId,
} from "./moguSelectionHelpers";

export function wrapSelectionWithMoguWord(selectedRange) {
  try {
    const selectedText = selectedRange.toString();
    if (!selectedText) return null;

    const span = document.createElement("span");
    span.classList.add("mogu-word", "is-selected");
    span.dataset.wordId = generateId();

    const contents = selectedRange.extractContents();
    span.appendChild(contents);
    selectedRange.insertNode(span);

    window.getSelection().removeAllRanges();

    return {
      text: selectedText,
      selector: getUniqueCssSelector(span.parentElement),
      url: window.location.href,
      id: span.dataset.wordId,
      startOffset: getTextOffset(span),
      endOffset: getTextOffset(span) + selectedText.length,
    };
  } catch {
    return null;
  }
}

export function unwrapMoguWord(wordId) {
  try {
    const moguWordElement = document.querySelector(
      `[data-word-id="${wordId}"]`
    );

    if (!moguWordElement || !moguWordElement.classList.contains("mogu-word"))
      return false;

    const parent = moguWordElement.parentElement;
    if (!parent) return false;

    const fragment = document.createDocumentFragment();
    while (moguWordElement.firstChild) {
      fragment.appendChild(moguWordElement.firstChild);
    }

    parent.replaceChild(fragment, moguWordElement);
    parent.normalize();

    return true;
  } catch (error) {
    console.error("태그 제거 실패", error);
    return false;
  }
}

export function highlightMoguWord(wordId) {
  try {
    document
      .querySelectorAll(".mogu-word-highlighted")
      .forEach((highlightedElement) => {
        highlightedElement.classList.remove("mogu-word-highlighted");
      });

    const targetMoguWord = document.querySelector(`[data-word-id="${wordId}"]`);

    if (!targetMoguWord || !targetMoguWord.classList.contains("mogu-word"))
      return;

    targetMoguWord.classList.add("mogu-word-highlighted");

    targetMoguWord.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    setTimeout(() => {
      targetMoguWord.classList.remove("mogu-word-highlighted");
    }, 3000);
  } catch (error) {
    console.error("문장 강조 처리 실패", error);
  }
}
