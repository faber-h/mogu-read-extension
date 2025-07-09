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
    span.className = "mogu-word";
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
