import { XMarkIcon } from "@heroicons/react/24/outline";

import { useReadingHistory } from "@/hooks/useReadingHistory";
import Section from "@/pages/DeclutterMode/components/Section";
import SectionScroll from "@/pages/DeclutterMode/components/SectionScroll";

import EmptyState from "./EmptyState";
import SettingHeader from "./SettingHeader";

export default function ReadingHistory() {
  const { history: readingHistory, removeRecord } = useReadingHistory();

  const isEmpty = readingHistory.length === 0;

  const historyMinutes = readingHistory.reduce(
    (acc, item) => acc + Math.round(item.readingSeconds / 60),
    0
  );
  const historyWords = readingHistory.reduce(
    (acc, item) => acc + item.totalWords,
    0
  );

  const handleDeleteRecord = async (event, recordId) => {
    event.stopPropagation();
    try {
      await removeRecord(recordId);
    } catch (error) {
      console.error("기록 삭제 중 오류:", error);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <SettingHeader />
      </div>

      {isEmpty ? (
        <EmptyState
          title="몰입 읽기 기록이 없습니다."
          description="몰입 읽기를 시작해보세요!"
        />
      ) : (
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex flex-shrink-0 space-x-4">
            <Section title="읽은 시간" flex="flex-1">
              <div className="px-4">
                <p className="text-2xl font-bold">{historyMinutes}분</p>
                <p className="text-sm text-gray-500">총 소요</p>
              </div>
            </Section>
            <Section title="읽은 단어 수" flex="flex-1">
              <div className="px-4">
                <p className="text-2xl font-bold">{historyWords}자</p>
                <p className="text-sm text-gray-500">총 단어 수</p>
              </div>
            </Section>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <Section title="기록 리스트" flex="flex-1 flex flex-col min-h-0">
              <SectionScroll>
                {readingHistory.map((history) => (
                  <div
                    key={history.id}
                    className="flex justify-between rounded border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{history.title}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(history.completedAt).toLocaleString()}
                      </span>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>
                          ⏱️ {Math.round(history.readingSeconds / 60)}분
                        </span>
                        <span>✏️ {history.totalWords}자</span>
                      </div>
                    </div>
                    <button
                      onClick={(event) => handleDeleteRecord(event, history.id)}
                      className="shrink-0 hover:text-red-500"
                    >
                      <XMarkIcon className="h-4 w-4 shrink-0" />
                    </button>
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
