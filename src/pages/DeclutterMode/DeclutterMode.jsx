import { useEffect, useState } from "react";

import ButtonPrimary from "@/components/ButtonPrimary";
import { useChromeExtension } from "@/hooks/useChromeExtension";
import { useDeclutterHistory } from "@/hooks/useDeclutterHistory";
import { extractPageUrl } from "@/utils/urlUtils";

import Section from "./components/Section";
import SectionScroll from "./components/SectionScroll";
import SentenceCard from "./components/SentenceCard";
import { useSelectedSentences } from "./hooks/useSelectedSentences";

const DeclutterMode = () => {
  const { selectedSentences, removeSentence: removeSelectSentence } =
    useSelectedSentences();
  const { sendMessageSafely, getCurrentTab } = useChromeExtension();
  const { pages, removePage: removeHistorySentence } = useDeclutterHistory();

  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    (async () => {
      const tab = await getCurrentTab();
      if (!tab) return;

      const pageUrl = extractPageUrl(tab.url);
      setCurrentUrl(pageUrl);
    })();
  }, [getCurrentTab]);

  const currentPageHistory = pages.filter(
    (sentence) => sentence.url === currentUrl
  );

  const handleDeclutter = () => {
    const wordIds = selectedSentences.map((sentence) => sentence.id);
    sendMessageSafely({ type: "DECLUTTER", wordIds });
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <Section title="📑 선택된 문장" flex="flex-[3]">
        <SectionScroll>
          {selectedSentences.map((sentence) => (
            <SentenceCard
              key={sentence.id}
              sentence={sentence}
              text={sentence.text}
              onRemove={() => removeSelectSentence(sentence.id)}
            />
          ))}
        </SectionScroll>

        <ButtonPrimary
          className="mx-4 mt-4 w-[calc(100%-2rem)] shrink-0"
          onClick={handleDeclutter}
        >
          정리 시작
        </ButtonPrimary>
      </Section>

      <Section title="📜 정리된 문장" flex="flex-[2]">
        <SectionScroll>
          {currentPageHistory.map((sentence) => (
            <SentenceCard
              key={sentence.id}
              text={sentence.text}
              prefix="- "
              onRemove={() => removeHistorySentence(sentence.id)}
            />
          ))}
        </SectionScroll>
      </Section>
    </div>
  );
};

export default DeclutterMode;
