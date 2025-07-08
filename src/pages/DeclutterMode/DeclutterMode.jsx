import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import ButtonPrimary from "@/components/ButtonPrimary";

import Section from "./components/Section";
import SectionScroll from "./components/SectionScroll";
import SentenceCard from "./components/SentenceCard";
import { useSelectedSentences } from "./hooks/useSelectedSentences";

const DeclutterMode = () => {
  const { selectedSentences, removeSentence } = useSelectedSentences();

  const [history, setHistory] = useState([
    {
      url: "example.com",
      isOpen: true,
      sentences: Array(20).fill("첫 번째 문장 내용..."),
    },
    {
      url: "example.co.kr",
      isOpen: false,
      sentences: ["다른 문장 1", "다른 문장 2"],
    },
  ]);

  const toggleSite = (idx) => {
    setHistory((prev) =>
      prev.map((site, i) =>
        i === idx
          ? { ...site, isOpen: !site.isOpen }
          : { ...site, isOpen: false }
      )
    );
  };

  const removeHistorySentence = (siteIdx, sentIdx) => {
    setHistory((prev) =>
      prev.map((site, i) =>
        i === siteIdx
          ? {
              ...site,
              sentences: site.sentences.filter((_, sIdx) => sIdx !== sentIdx),
            }
          : site
      )
    );
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <Section title="📑 선택된 문장" flex="flex-[3]">
        <SectionScroll>
          {selectedSentences.map((sentence) => (
            <SentenceCard
              key={sentence.id}
              text={sentence.text}
              onRemove={() => removeSentence(sentence.id)}
            />
          ))}
        </SectionScroll>

        <ButtonPrimary className="mx-4 mt-4 w-[calc(100%-2rem)] shrink-0">
          정리 시작
        </ButtonPrimary>
      </Section>

      <Section title="📜 정리된 사이트" flex="flex-[2]">
        <SectionScroll>
          {history.map((site, idx) => (
            <div key={site.url}>
              <button
                onClick={() => toggleSite(idx)}
                className="flex cursor-pointer items-center"
              >
                {site.isOpen ? (
                  <ChevronDownIcon className="mr-1 h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="mr-1 h-4 w-4" />
                )}{" "}
                {site.url} ({site.sentences.length}문장)
              </button>
              {site.isOpen && (
                <div className="mt-1 ml-4 flex flex-col gap-1">
                  {site.sentences.map((sentence, sentenceIdx) => (
                    <SentenceCard
                      key={sentenceIdx}
                      text={sentence}
                      prefix="- "
                      onRemove={() => removeHistorySentence(idx, sentenceIdx)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </SectionScroll>
      </Section>
    </div>
  );
};

export default DeclutterMode;
