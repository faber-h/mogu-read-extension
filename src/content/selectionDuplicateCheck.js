import { findMoguWordAncestor } from "./moguSelectionHelpers";

export function getDuplicateSelectionInfo(selectedRange) {
  const startContainer = selectedRange.startContainer;
  const endContainer = selectedRange.endContainer;

  const startMoguWord = findMoguWordAncestor(startContainer);
  if (startMoguWord) {
    return { existingText: startMoguWord.textContent, element: startMoguWord };
  }

  if (startContainer !== endContainer) {
    const endMoguWord = findMoguWordAncestor(endContainer);
    if (endMoguWord) {
      return { existingText: endMoguWord.textContent, element: endMoguWord };
    }
  }

  const walker = document.createTreeWalker(
    selectedRange.commonAncestorContainer,
    NodeFilter.SHOW_ALL,
    {
      acceptNode: (node) =>
        selectedRange.intersectsNode(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    const moguWord = findMoguWordAncestor(node);
    if (moguWord) {
      return { existingText: moguWord.textContent, element: moguWord };
    }
  }

  return null;
}
