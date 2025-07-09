import { removeSelectedRanges } from "./removeSelectedRanges.js";

export function executeDeclutter(groupedBySelector) {
  Object.entries(groupedBySelector).forEach(([selector, selectedRanges]) => {
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    const updatedText = removeSelectedRanges(
      targetElement.textContent,
      selectedRanges
    );
    targetElement.textContent = updatedText;
  });
}
