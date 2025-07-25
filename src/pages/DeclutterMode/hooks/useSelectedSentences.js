import { useEffect, useState } from "react";

import { useChromeExtension } from "@/hooks/useChromeExtension";
import { useToastStore } from "@/stores/useToastStore";

import { useDeclutterCompletion } from "../hooks/useDeclutterCompletion";
export function useSelectedSentences() {
  const [selectedSentences, setSelectedSentences] = useState([]);
  const showToast = useToastStore((state) => state.showToast);
  const { sendMessageSafely } = useChromeExtension();
  const { handleDeclutterDone } = useDeclutterCompletion(selectedSentences);

  useEffect(() => {
    const listener = async (message) => {
      if (message.type === "ADD_SENTENCE") {
        const newSentence = message.payload;

        setSelectedSentences((prev) => [...prev, newSentence]);
      }

      if (message.type === "SHOW_DUPLICATE_TOAST") {
        const { existingText } = message.payload;

        showToast({
          title: "이미 선택된 문장과 겹칩니다!",
          body: `기존 선택: "${existingText}"`,
        });
      }

      if (message.type === "DECLUTTER_DONE") {
        await handleDeclutterDone();
        setSelectedSentences([]);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [showToast, handleDeclutterDone]);

  const removeSentence = (id) => {
    setSelectedSentences((prev) =>
      prev.filter((sentence) => sentence.id !== id)
    );

    sendMessageSafely({ type: "REMOVE_SENTENCE", removeId: id });

    chrome.runtime.sendMessage({});
  };

  return {
    selectedSentences,
    removeSentence,
  };
}
