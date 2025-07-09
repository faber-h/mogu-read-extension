import { sendDuplicateToast } from "./moguNotifier";
import { getDuplicateSelectionInfo } from "./selectionDuplicateCheck";
import { wrapSelectionWithMoguWord } from "./wrapSelection";

export function getSelectedTextDataList() {
  const userSelection = window.getSelection();
  if (!userSelection || userSelection.isCollapsed) return [];

  const selectedRange = userSelection.getRangeAt(0);

  const duplicateInfo = getDuplicateSelectionInfo(selectedRange);
  if (duplicateInfo) {
    sendDuplicateToast(duplicateInfo.existingText);
    return [];
  }

  const wrappedData = wrapSelectionWithMoguWord(selectedRange);
  return wrappedData ? [wrappedData] : [];
}
