export async function checkAndApplyAutoDeclutter() {
  try {
    const matchingHistory = await getDeclutterHistoryByUrl();
    if (matchingHistory.length === 0) return;

    await applyAutoDeclutter(matchingHistory);
  } catch (error) {
    console.error("자동 삭제 확인 중 오류:", error);
  }
}

async function applyAutoDeclutter(historyItems) {
  const failedIds = [];

  for (const item of historyItems) {
    const wordId = await createMoguWordFromHistory(item);

    if (wordId) {
      const moguWordElement = document.querySelector(
        `[data-word-id="${wordId}"]`
      );
      moguWordElement?.remove();
    } else {
      failedIds.push(item.id);
    }
  }

  if (failedIds.length > 0) {
    await cleanInvalidHistory(failedIds);
  }
}

async function createMoguWordFromHistory(historyItem) {
  try {
    const { selector, text, startOffset, endOffset, id } = historyItem;

    const targetElement = document.querySelector(selector);
    if (!targetElement) return null;

    const textNode = findTextNodeByOffset(
      targetElement,
      startOffset,
      endOffset
    );
    if (!textNode) return null;

    const range = document.createRange();
    const relativeStartOffset =
      startOffset -
      getTextOffsetFromContainer(textNode.parentElement, targetElement);
    const relativeEndOffset = relativeStartOffset + text.length;

    range.setStart(textNode, relativeStartOffset);
    range.setEnd(textNode, relativeEndOffset);

    const selectedText = range.toString();
    if (selectedText !== text) return null;

    const span = document.createElement("span");
    span.classList.add("mogu-word-selected");
    span.dataset.wordId = id;

    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);

    return span.dataset.wordId;
  } catch (error) {
    console.error("정리된 기록 처리 중 오류:", error);
    return null;
  }
}

function findTextNodeByOffset(element, startOffset, endOffset) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  let currentOffset = 0;
  let node;

  while ((node = walker.nextNode())) {
    const nodeLength = node.textContent.length;
    const nodeEndOffset = currentOffset + nodeLength;

    if (startOffset >= currentOffset && endOffset <= nodeEndOffset) {
      return node;
    }

    currentOffset = nodeEndOffset;
  }

  return null;
}

function getTextOffsetFromContainer(childElement, containerElement) {
  if (!containerElement.contains(childElement)) {
    return 0;
  }

  const walker = document.createTreeWalker(
    containerElement,
    NodeFilter.SHOW_TEXT
  );

  let offset = 0;
  let node;

  while ((node = walker.nextNode())) {
    if (childElement.contains(node) || node.parentElement === childElement) {
      break;
    }
    offset += node.textContent.length;
  }

  return offset;
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
  const result = await chrome.storage.local.get("moguread_decluttered_pages");
  const allItems = result.moguread_decluttered_pages || [];

  const filtered = allItems.filter((item) => !failedIds.includes(item.id));

  await chrome.storage.local.set({
    moguread_decluttered_pages: filtered,
  });
}
