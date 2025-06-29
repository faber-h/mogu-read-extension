import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const DeclutterMode = () => {
  const [selectedSentences, setSelectedSentences] = useState([
    "이 문장을 제거합니다.",
    "불필요한 부분입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
    "React에 대한 설명입니다.",
  ]);

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

  const removeSelected = (idx) => {
    setSelectedSentences((prev) => prev.filter((_, i) => i !== idx));
  };

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
      <section className="flex flex-[3] flex-col overflow-hidden rounded border border-purple-200 px-0 py-4">
        <h2 className="mb-2 px-4 text-sm font-semibold text-purple-700">
          📑 선택된 문장
        </h2>

        <div
          className="flex flex-1 flex-col gap-2 overflow-y-auto px-4"
          style={{ scrollbarGutter: "stable" }}
        >
          {selectedSentences.map((sentence, idx) => (
            <div
              key={idx}
              className="flex w-full items-center justify-between rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <span className="block break-words">{sentence}</span>
              <button onClick={() => removeSelected(idx)} className="shrink-0">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button className="mx-4 mt-4 w-[calc(100%-2rem)] shrink-0 rounded-full bg-purple-500 py-2 text-center text-sm text-white transition hover:bg-purple-600">
          정리 시작
        </button>
      </section>

      <section className="flex flex-[2] flex-col overflow-hidden rounded border border-purple-200 px-0 py-4">
        <h2 className="mb-2 px-4 text-sm font-semibold text-purple-700">
          📜 정리된 사이트
        </h2>

        <div
          className="flex flex-1 flex-col gap-2 overflow-y-auto px-4"
          style={{ scrollbarGutter: "stable" }}
        >
          {history.map((site, idx) => (
            <div key={site.url}>
              <button
                onClick={() => toggleSite(idx)}
                className="flex items-center"
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
                  {site.sentences.map((s, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex w-full justify-between rounded border border-gray-200 px-3 py-1 text-sm text-gray-700"
                    >
                      <span className="block break-words">- {s}</span>
                      <button
                        onClick={() => removeHistorySentence(idx, sIdx)}
                        className="shrink-0"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DeclutterMode;
