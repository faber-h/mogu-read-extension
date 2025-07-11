export async function checkAndApplyAutoDeclutter() {
  try {
    const matchingHistory = await getDeclutterHistoryByUrl();
    if (matchingHistory.length === 0) return;

    const sortedHistory = matchingHistory.sort(
      (earlierItem, laterItem) => earlierItem.savedAt - laterItem.savedAt
    );

    await applyAutoDeclutter(sortedHistory);
  } catch (error) {
    console.error("자동 삭제 확인 중 오류:", error);
  }
}

async function applyAutoDeclutter(historyItems) {
  const failedIds = [];

  const groupedBySelector = groupBySelector(historyItems);
  for (const [selector, items] of Object.entries(groupedBySelector)) {
    const targetElement = document.querySelector(selector);
    if (!targetElement) {
      failedIds.push(...items.map((item) => item.id));
      continue;
    }

    const targetItems = [...items];
    while (targetItems.length > 0) {
      const currentTextContent = getElementTextContent(targetElement);
      let processedCount = 0;

      for (let index = targetItems.length - 1; index >= 0; index--) {
        const item = targetItems[index];

        const newOffset = findTextInCurrentContent(
          currentTextContent,
          item.text,
          item.startOffset
        );
        if (newOffset !== null) {
          const updatedItem = {
            ...item,
            startOffset: newOffset,
            endOffset: newOffset + item.text.length,
          };

          const wordId = await createMoguWordFromHistory(
            updatedItem,
            targetElement
          );

          if (wordId) {
            const moguWordElement = document.querySelector(
              `[data-word-id="${wordId}"]`
            );
            moguWordElement?.remove();
            targetItems.splice(index, 1);
            processedCount++;
          } else {
            failedIds.push(item.id);
            targetItems.splice(index, 1);
          }
        }
      }

      if (processedCount === 0) {
        failedIds.push(...targetItems.map((item) => item.id));
        break;
      }
    }
  }

  if (failedIds.length > 0) {
    await cleanInvalidHistory(failedIds);
  }
}

function findTextInCurrentContent(currentContent, targetText, originalOffset) {
  if (originalOffset + targetText.length <= currentContent.length) {
    const textAtOriginalOffset = currentContent.substring(
      originalOffset,
      originalOffset + targetText.length
    );
    if (textAtOriginalOffset === targetText) {
      return originalOffset;
    }
  }

  return null;
}

function groupBySelector(historyItems) {
  const grouped = {};

  for (const item of historyItems) {
    if (!grouped[item.selector]) {
      grouped[item.selector] = [];
    }
    grouped[item.selector].push(item);
  }

  Object.values(grouped).forEach((group) => {
    group.sort((earlierItem, laterItem) => {
      if (earlierItem.savedAt !== laterItem.savedAt) {
        return earlierItem.savedAt - laterItem.savedAt;
      }
      return earlierItem.startOffset - laterItem.startOffset;
    });
  });

  return grouped;
}

async function createMoguWordFromHistory(historyItem, targetElement) {
  try {
    const { text, startOffset, endOffset, id } = historyItem;

    const currentTextContent = getElementTextContent(targetElement);

    if (startOffset < 0 || endOffset > currentTextContent.length) return null;

    const currentText = currentTextContent.substring(startOffset, endOffset);
    if (currentText !== text) return null;

    const textNodeInfo = findTextNodeAtOffset(
      targetElement,
      startOffset,
      endOffset
    );
    if (!textNodeInfo) return null;

    const range = document.createRange();
    range.setStart(textNodeInfo.startNode, textNodeInfo.startNodeOffset);
    range.setEnd(textNodeInfo.endNode, textNodeInfo.endNodeOffset);

    const selectedText = range.toString();
    if (selectedText !== text) return null;

    const span = document.createElement("span");
    span.classList.add("mogu-word-selected");
    span.dataset.wordId = id;

    try {
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);

      return span.dataset.wordId;
    } catch (error) {
      console.error("Range 처리 중 오류:", error);
      return null;
    }
  } catch (error) {
    console.error("정리된 기록 처리 중 오류:", error);
    return null;
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

function findTextNodeAtOffset(element, startOffset, endOffset) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  let currentOffset = 0;
  let node;
  let startNode = null;
  let startNodeOffset = 0;
  let endNode = null;
  let endNodeOffset = 0;

  while ((node = walker.nextNode())) {
    const nodeLength = node.textContent.length;
    const nodeEndOffset = currentOffset + nodeLength;

    const isStartInThisNode =
      startNode === null &&
      startOffset >= currentOffset &&
      startOffset <= nodeEndOffset;

    const isEndInThisNode =
      endOffset >= currentOffset && endOffset <= nodeEndOffset;

    if (isStartInThisNode) {
      startNode = node;
      startNodeOffset = startOffset - currentOffset;
    }

    if (isEndInThisNode) {
      endNode = node;
      endNodeOffset = endOffset - currentOffset;
      break;
    }

    currentOffset = nodeEndOffset;
  }

  if (!startNode || !endNode) return null;

  return {
    startNode,
    startNodeOffset,
    endNode,
    endNodeOffset,
  };
}

export async function getDeclutterHistoryByUrl() {
  try {
    const { origin, pathname, search } = new URL(window.location.href);
    const currentUrl = `${origin}${pathname}${search}`;

    const result = await chrome.storage.local.get([
      "moguread_decluttered_pages",
    ]);
    const declutteredPages = result.moguread_decluttered_pages || [];

    const matchingHistory = declutteredPages.filter(
      (item) => item.url === currentUrl
    );

    return matchingHistory;
  } catch (error) {
    console.error("정리된 기록 조회 중 오류:", error);
    return [];
  }
}

async function cleanInvalidHistory(failedIds) {
  try {
    const result = await chrome.storage.local.get("moguread_decluttered_pages");
    const allItems = result.moguread_decluttered_pages || [];

    const filtered = allItems.filter((item) => !failedIds.includes(item.id));

    await chrome.storage.local.set({
      moguread_decluttered_pages: filtered,
    });
  } catch (error) {
    console.error("유효하지 않은 기록 정리 중 오류:", error);
  }
}
