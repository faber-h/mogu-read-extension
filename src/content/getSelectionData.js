export function getSelectedTextDataList() {
  const userSelection = window.getSelection();
  if (!userSelection || userSelection.isCollapsed) return [];

  const selectedRange = userSelection.getRangeAt(0);

  const duplicateInfo = getDuplicateSelectionInfo(selectedRange);
  if (duplicateInfo) {
    chrome.runtime.sendMessage({
      type: "SHOW_DUPLICATE_TOAST",
      payload: {
        existingText: duplicateInfo.existingText,
      },
    });
    return [];
  }

  const wrappedData = wrapSelectionWithMoguWord(selectedRange);

  return wrappedData ? [wrappedData] : [];
}

function getDuplicateSelectionInfo(selectedRange) {
  const startContainer = selectedRange.startContainer;
  const endContainer = selectedRange.endContainer;

  const startMoguWord = findMoguWordAncestor(startContainer);
  if (startMoguWord) {
    return {
      existingText: startMoguWord.textContent,
      element: startMoguWord,
    };
  }

  if (startContainer !== endContainer) {
    const endMoguWord = findMoguWordAncestor(endContainer);
    if (endMoguWord) {
      return {
        existingText: endMoguWord.textContent,
        element: endMoguWord,
      };
    }
  }

  const commonAncestor = selectedRange.commonAncestorContainer;
  const walker = document.createTreeWalker(
    commonAncestor,
    NodeFilter.SHOW_ALL,
    {
      acceptNode: function (node) {
        return selectedRange.intersectsNode(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    const moguWord = findMoguWordAncestor(node);
    if (moguWord) {
      return {
        existingText: moguWord.textContent,
        element: moguWord,
      };
    }
  }

  return null;
}

function findMoguWordAncestor(node) {
  let current = node;

  if (current.nodeType === Node.TEXT_NODE) {
    current = current.parentElement;
  }

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    if (current.classList && current.classList.contains("mogu-word")) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

function wrapSelectionWithMoguWord(selectedRange) {
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

function getTextOffset(element) {
  const parent = element.parentElement;
  if (!parent) return 0;

  let offset = 0;
  let walker = document.createTreeWalker(
    parent,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    if (
      node.parentElement === element ||
      element.contains(node.parentElement)
    ) {
      break;
    }
    offset += node.textContent.length;
  }

  return offset;
}

function getUniqueCssSelector(targetElement) {
  if (!targetElement || !targetElement.tagName) return null;

  const selectorParts = [];
  let currentElement = targetElement;

  while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
    let part = currentElement.tagName.toLowerCase();

    if (currentElement.id) {
      part = `#${CSS.escape(currentElement.id)}`;
      selectorParts.unshift(part);
      break;
    }

    if (
      currentElement.className &&
      typeof currentElement.className === "string"
    ) {
      const classNames = currentElement.className
        .trim()
        .split(/\s+/)
        .filter((classNamePart) => !classNamePart.includes(":"))
        .join(".");
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
