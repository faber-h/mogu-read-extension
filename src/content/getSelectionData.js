export function getSelectedTextDataList() {
  const userSelection = window.getSelection();
  if (!userSelection || userSelection.isCollapsed) return [];

  const selectedRange = userSelection.getRangeAt(0);
  const selectedFragment = selectedRange.cloneContents();

  const textIterator = document.createTreeWalker(
    selectedFragment,
    NodeFilter.SHOW_TEXT
  );

  const selectedTextList = [];

  while (textIterator.nextNode()) {
    const currentText = textIterator.currentNode.textContent.trim();
    if (currentText.length === 0) continue;

    const parentElementOfSelection = selectedRange.startContainer.parentElement;
    const uniqueCssSelector = getUniqueCssSelector(parentElementOfSelection);

    selectedTextList.push({
      text: currentText,
      selector: uniqueCssSelector,
      url: window.location.href,
      id: generateId(),
    });
  }

  return selectedTextList;
}

function getUniqueCssSelector(targetElement) {
  if (!targetElement || !targetElement.tagName) return null;

  const selectorParts = [];
  let currentElement = targetElement;

  while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
    let part = currentElement.tagName.toLowerCase();

    if (currentElement.id) {
      part = `#${currentElement.id}`;
      selectorParts.unshift(part);
      break;
    }

    if (
      currentElement.className &&
      typeof currentElement.className === "string"
    ) {
      const classNames = currentElement.className.trim().split(/\s+/).join(".");
      if (classNames) {
        part += `.${classNames}`;
      }
    }

    const parentElement = currentElement.parentNode;
    if (parentElement) {
      const sameTagSiblings = Array.from(parentElement.children).filter(
        (sibling) => sibling.tagName === currentElement.tagName
      );
      if (sameTagSiblings.length > 1) {
        const elementIndex =
          Array.from(parentElement.children).indexOf(currentElement) + 1;
        part += `:nth-child(${elementIndex})`;
      }
    }

    selectorParts.unshift(part);
    currentElement = currentElement.parentElement;
  }

  return selectorParts.join(" > ");
}

function generateId() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const hexString = Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  const id =
    `${hexString.slice(0, 4)}-` +
    `${hexString.slice(4, 8)}-` +
    `${hexString.slice(8, 12)}-` +
    `${hexString.slice(12, 16)}`;

  return id;
}
