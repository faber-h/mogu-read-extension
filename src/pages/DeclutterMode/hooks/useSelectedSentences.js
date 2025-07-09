import { useEffect, useState } from "react";

import { useToastStore } from "@/stores/useToastStore";

export function useSelectedSentences() {
  const [selectedSentences, setSelectedSentences] = useState([]);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    const listener = (message) => {
      if (message.type === "ADD_SENTENCE") {
        const newSentence = message.payload;

        setSelectedSentences((prev) => {
          const duplicate = findDuplicateSentence(prev, newSentence);

          if (duplicate) {
            showToast({
              title: "이미 선택된 문장과 겹칩니다!",
              body: `${duplicate.text}`,
            });
            return prev;
          }

          return [...prev, newSentence];
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [showToast]);

  function findDuplicateSentence(existingSentences, incomingSentence) {
    for (const existing of existingSentences) {
      if (existing.selector !== incomingSentence.selector) continue;

      const existingStart = existing.startOffset;
      const existingEnd = existing.endOffset;
      const incomingStart = incomingSentence.startOffset;
      const incomingEnd = incomingSentence.endOffset;

      const isOverlap =
        existingStart < incomingEnd && existingEnd > incomingStart;
      if (isOverlap) {
        return existing;
      }
    }

    return null;
  }

  const removeSentence = (id) => {
    setSelectedSentences((prev) =>
      prev.filter((sentence) => sentence.id !== id)
    );
  };

  return {
    selectedSentences,
    removeSentence,
  };
}
