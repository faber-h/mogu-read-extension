import {
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import Section from "@/pages/DeclutterMode/components/Section";
import SectionScroll from "@/pages/DeclutterMode/components/SectionScroll";

import EmptyState from "./EmptyState";
import SettingHeader from "./SettingHeader";

export default function DeclutteredHistory() {
  const declutteredSentences = [
    {
      domain: "example.com",
      url: "https://ko.react.dev/learn/your-first-component",
      text: "첫 번째 문장",
      title: "첫 번째 컴포넌트 – React",
      saveAt: 1752480972443,
      id: "1",
    },
    {
      domain: "example.com",
      url: "https://ko.react.dev/learn/your-first-component",
      text: "두 번째 문장",
      title: "첫 번째 컴포넌트 – React",
      saveAt: 1752481972443,
      id: "2",
    },
    {
      domain: "example.com",
      url: "https://ko.react.dev/learn/your-second-component",
      text: "세 번째 문장",
      title: "두 번째 컴포넌트 – React",
      saveAt: 1752482972443,
      id: "3",
    },
    {
      domain: "example2.com",
      url: "https://ko.react.dev/learn/another",
      text: "다른 사이트 문장",
      title: "다른 페이지 – React",
      saveAt: 1752483972443,
      id: "4",
    },
  ];

  const isEmpty = declutteredSentences.length === 0;

  const groupedByUrlMap = declutteredSentences.reduce((acc, item) => {
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
      saveAt: item.saveAt,
    });

    return acc;
  }, {});
  const groupedPageList = Object.values(groupedByUrlMap);

  const [isPageGroupOpenList, setIsPageGroupOpenList] = useState(
    groupedPageList.map(() => false)
  );

  const togglePageGroup = (pageIdx) => {
    setIsPageGroupOpenList((prev) =>
      prev.map((isOpen, i) => (i === pageIdx ? !isOpen : isOpen))
    );
  };

  const totalSentences = declutteredSentences.length;
  const totalPages = groupedPageList.length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SettingHeader />

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
                {groupedPageList.map((pageGroup, pageIdx) => (
                  <div key={pageGroup.url} className="mb-2">
                    <button
                      onClick={() => togglePageGroup(pageIdx)}
                      className="flex w-full items-center text-left text-sm font-medium text-gray-700 hover:text-purple-600"
                    >
                      {isPageGroupOpenList[pageIdx] ? (
                        <ChevronDownIcon className="mr-1 h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="mr-1 h-4 w-4" />
                      )}
                      <span className="font-medium">{pageGroup.title}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({pageGroup.sentences.length}문장)
                      </span>
                    </button>

                    {isPageGroupOpenList[pageIdx] && (
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
                                console.log(
                                  `삭제 로직 추가! (id: ${sentence.id})`
                                );
                              }}
                              className="shrink-0"
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
    </div>
  );
}
