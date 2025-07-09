export function removeSelectedRanges(originalText, selectedRanges) {
  if (!selectedRanges.length) return originalText;

  selectedRanges.sort((a, b) => a.startOffset - b.startOffset);

  const mergedRanges = [];
  selectedRanges.forEach((range) => {
    const lastRange = mergedRanges[mergedRanges.length - 1];
    if (!lastRange || lastRange.endOffset < range.startOffset) {
      mergedRanges.push({ ...range });
    } else {
      lastRange.endOffset = Math.max(lastRange.endOffset, range.endOffset);
    }
  });

  let updatedText = originalText;
  mergedRanges.reverse().forEach(({ startOffset, endOffset }) => {
    updatedText =
      updatedText.slice(0, startOffset) + updatedText.slice(endOffset);
  });

  return updatedText;
}
