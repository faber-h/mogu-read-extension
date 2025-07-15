import {
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";

import { useDeclutterHistory } from "@/hooks/useDeclutterHistory";
import Section from "@/pages/DeclutterMode/components/Section";
import SectionScroll from "@/pages/DeclutterMode/components/SectionScroll";

import EmptyState from "./EmptyState";
import { useViewOptionStore } from "../stores/useViewOptionStore";
import { getFilteredData } from "../utils/dateUtils";

export default function DeclutteredHistory() {
  const { pages: declutteredSentences, removePage } = useDeclutterHistory();
  const { mode, year, month } = useViewOptionStore();

  const filteredSentences = useMemo(() => {
    return getFilteredData(declutteredSentences, mode, year, month, "savedAt");
  }, [declutteredSentences, mode, year, month]);

  const isEmpty = filteredSentences.length === 0;

  const groupedByUrlMap = useMemo(() => {
    return filteredSentences.reduce((acc, item) => {
      if (!acc[item.url]) {
        acc[item.url] = {
          url: item.url,
          domain: item.domain,
          title: item.title,
          sentences: [],
        };
      }
      acc[item.url].sentences.push({
        id: item.id,
        text: item.text,
        saveAt: item.savedAt,
      });

      return acc;
    }, {});
  }, [filteredSentences]);

  const groupedPageList = Object.values(groupedByUrlMap);

  const [isPageGroupOpenList, setIsPageGroupOpenList] = useState({});

  const togglePageGroup = (pageUrl) => {
    setIsPageGroupOpenList((prev) => ({
      ...prev,
      [pageUrl]: !prev[pageUrl],
    }));
  };

  const handleRemoveSentence = async (sentenceId) => {
    try {
      await removePage(sentenceId);
    } catch (error) {
      console.error("문장 삭제 실패:", error);
    }
  };

  const totalSentences = filteredSentences.length;
  const totalPages = groupedPageList.length;

  return (
    <>
      {isEmpty ? (
        <EmptyState
          title="정리된 기록이 없습니다."
          description="아직 정리된 문장이 없어요. 문장을 정리해보세요!"
        />
      ) : (
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex flex-shrink-0 space-x-4">
            <Section title="정리된 문장 수" flex="flex-1">
              <div className="px-4">
                <p className="text-2xl font-bold">{totalSentences}개</p>
                <p className="text-sm text-gray-500">총 문장 수</p>
              </div>
            </Section>
            <Section title="정리된 사이트 수" flex="flex-1">
              <div className="px-4">
                <p className="text-2xl font-bold">{totalPages}개</p>
                <p className="text-sm text-gray-500">총 사이트 수</p>
              </div>
            </Section>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <Section
              title="사이트별 정리 기록"
              flex="flex-1 flex flex-col min-h-0"
            >
              <SectionScroll>
                {groupedPageList.map((pageGroup) => (
                  <div key={pageGroup.url} className="mb-2">
                    <button
                      onClick={() => togglePageGroup(pageGroup.url)}
                      className="flex w-full items-center text-left text-sm font-medium text-gray-700 hover:text-purple-600"
                    >
                      {isPageGroupOpenList[pageGroup.url] ? (
                        <ChevronDownIcon className="mr-1 h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="mr-1 h-4 w-4" />
                      )}
                      <span className="font-medium">{pageGroup.title}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({pageGroup.sentences.length}문장)
                      </span>
                    </button>

                    {isPageGroupOpenList[pageGroup.url] && (
                      <div className="mt-1 ml-5 flex flex-col gap-1">
                        {pageGroup.sentences.map((sentence) => (
                          <div
                            key={sentence.id}
                            className="flex w-full justify-between rounded border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <div className="flex flex-col break-words">
                              <span>- {sentence.text}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(sentence.saveAt).toLocaleString()}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSentence(sentence.id);
                              }}
                              className="shrink-0 hover:text-red-500"
                            >
                              <XMarkIcon className="h-4 w-4 shrink-0" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </SectionScroll>
            </Section>
          </div>
        </div>
      )}
    </>
  );
}
