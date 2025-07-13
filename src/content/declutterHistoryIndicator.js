import { getDeclutterHistoryByUrl } from "./autoDeclutterManager";

export async function showDeclutterHistoryIndicator(sentenceId) {
  try {
    const historyItems = await getDeclutterHistoryByUrl();
    const targetItem = historyItems.find((item) => item.id === sentenceId);
    if (!targetItem) return;

    const targetElement = document.querySelector(targetItem.selector);
    if (!targetElement) return;

    const position = await calculateAdjustedPosition(
      targetElement,
      targetItem,
      historyItems
    );
    if (position) {
      showPositionIndicator(position);
    }
  } catch (error) {
    console.error("삭제된 위치 표시 중 오류:", error);
  }
}

function getElementTextContent(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let textContent = "";
  let node;
  while ((node = walker.nextNode())) {
    textContent += node.textContent;
  }
  return textContent;
}

export function showPositionIndicator(positionInfo) {
  document
    .querySelectorAll(".mogu-position-indicator")
    .forEach((element) => element.remove());

  const indicator = document.createElement("span");
  indicator.className = "mogu-position-indicator";

  const tooltip = document.createElement("span");
  tooltip.className = "mogu-position-indicator-tooltip";
  tooltip.textContent = positionInfo.originalText;

  indicator.appendChild(tooltip);

  try {
    positionInfo.range.insertNode(indicator);

    setTimeout(() => {
      if (indicator.isConnected) {
        indicator.remove();
      }
    }, 3000);

    indicator.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  } catch (error) {
    console.error("인디케이터 삽입 중 오류:", error);
  }
}

async function calculateAdjustedPosition(
  targetElement,
  targetItem,
  allHistoryItems
) {
  const currentText = getElementTextContent(targetElement);

  const sameElementItems = allHistoryItems.filter(
    (item) => item.selector === targetItem.selector
  );

  const restoreOrder = sameElementItems.slice().sort((a, b) => {
    if (a.savedAt !== b.savedAt) return b.savedAt - a.savedAt;
    return a.startOffset - b.startOffset;
  });

  const currentlyRestored = [];
  const currentlyDeleted = [];

  for (const item of restoreOrder) {
    if (currentText.includes(item.text)) {
      currentlyRestored.push(item);
    } else {
      currentlyDeleted.push(item);
    }
  }

  const isTargetRestored = currentlyRestored.some(
    (item) => item.id === targetItem.id
  );

  if (isTargetRestored)
    return findRestoredTextPosition(targetElement, targetItem);

  let offsetAdjustment = 0;
  for (const item of currentlyDeleted) {
    const isOffsetBeforeTarget =
      item.savedAt > targetItem.savedAt ||
      (item.savedAt === targetItem.savedAt &&
        item.startOffset < targetItem.startOffset);

    if (isOffsetBeforeTarget) {
      offsetAdjustment += item.text.length;
    }
  }

  const currentPosition = Math.max(
    0,
    targetItem.startOffset - offsetAdjustment
  );
  const finalPosition = Math.min(currentPosition, currentText.length);

  return findPositionAtOffset(targetElement, finalPosition, targetItem.text);
}

function findRestoredTextPosition(targetElement, targetItem) {
  const currentText = getElementTextContent(targetElement);
  const textIndex = currentText.indexOf(targetItem.text);
  if (textIndex === -1) return null;

  const midPosition = textIndex + Math.floor(targetItem.text.length / 2);
  return findPositionAtOffset(targetElement, midPosition, targetItem.text);
}

function findPositionAtOffset(targetElement, targetOffset, originalText) {
  const walker = document.createTreeWalker(targetElement, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;
  let node;
  let targetNode = null;
  let nodeOffset = 0;

  while ((node = walker.nextNode())) {
    const nodeLength = node.textContent.length;
    const nodeEndOffset = currentOffset + nodeLength;

    if (targetOffset >= currentOffset && targetOffset <= nodeEndOffset) {
      targetNode = node;
      nodeOffset = targetOffset - currentOffset;
      break;
    }

    currentOffset = nodeEndOffset;
  }

  if (!targetNode) {
    const fallback = document.createTreeWalker(
      targetElement,
      NodeFilter.SHOW_TEXT
    );
    let lastNode = null;
    while ((node = fallback.nextNode())) lastNode = node;
    if (lastNode) {
      targetNode = lastNode;
      nodeOffset = lastNode.textContent.length;
    } else {
      return null;
    }
  }

  const range = document.createRange();
  range.setStart(targetNode, nodeOffset);
  range.collapse(true);

  return {
    range,
    targetNode,
    nodeOffset,
    originalText,
  };
}
