export function findMoguWordAncestor(node) {
  let current = node;

  if (current.nodeType === Node.TEXT_NODE) {
    current = current.parentElement;
  }

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    if (current.classList && current.classList.contains("mogu-word-selected")) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

export function getTextOffset(element) {
  const parent = element.parentElement;
  if (!parent) return 0;

  let offset = 0;
  const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);

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

export function getUniqueCssSelector(targetElement) {
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

export function generateId() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const hexString = Array.from(randomBytes, (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");

  return `${hexString.slice(0, 4)}-${hexString.slice(4, 8)}-${hexString.slice(8, 12)}-${hexString.slice(12, 16)}`;
}
