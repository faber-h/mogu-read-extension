export function isVisible(element) {
  let currentElement = element;
  while (currentElement) {
    const style = window.getComputedStyle(currentElement);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }
    currentElement = currentElement.parentElement;
  }

  return true;
}

export function findContentElement() {
  const candidates = [
    document.querySelector("article"),
    document.querySelector("main"),
    document.querySelector("section"),
    document.querySelector("div[id*='content']"),
    document.querySelector("div[id*='container']"),
    document.querySelector("div[class*='content']"),
    document.querySelector("div[class*='container']"),
  ];

  for (const candidate of candidates) {
    if (candidate && isVisible(candidate)) {
      const text = candidate.innerText || "";
      const wordCount = text.trim().split(/\s+/).length;

      const paragraphs = Array.from(candidate.querySelectorAll("p, li")).filter(
        isVisible
      );

      if (wordCount >= 30 && paragraphs.length >= 2) {
        return candidate;
      }
    }
  }

  return null;
}

export function detectContent() {
  const content = findContentElement();

  return !!content;
}

export function sendContentDetection() {
  const isContentDetected = detectContent();

  chrome.runtime.sendMessage({
    type: "CHECK_FOCUS_MODE",
    isContentDetected,
  });
}
