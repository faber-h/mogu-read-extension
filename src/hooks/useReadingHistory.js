import { useCallback } from "react";

import { generateId } from "@/utils/generateId";
import {
  READING_HISTORY_KEY,
  saveReadingRecord,
  deleteReadingRecord,
  clearReadingHistory,
  getReadingStatistics,
} from "@/utils/readingHistory";
import { extractDomain, extractPageUrl } from "@/utils/urlUtils";

import { useChromeExtension } from "./useChromeExtension";
import useChromeStorage from "./useChromeStorage";

export function useReadingHistory() {
  const [history, setHistory, isSaved, error, isStorageLoaded] =
    useChromeStorage(READING_HISTORY_KEY, []);

  const { getCurrentTab } = useChromeExtension();

  const saveCompletedReading = useCallback(
    async (readingData) => {
      try {
        const tab = await getCurrentTab();
        if (!tab) {
          throw new Error("현재 탭 정보를 가져올 수 없습니다.");
        }

        const record = {
          id: generateId(),
          url: extractPageUrl(tab.url),
          title: tab.title || "-",
          domain: extractDomain(tab.url),
          totalWords: readingData.totalWords,
          readingSeconds: readingData.readingSeconds,
          readingSpeed: readingData.readingSpeed,
          completedAt: Date.now(),
        };

        const updatedHistory = await saveReadingRecord(record);
        setHistory(updatedHistory);

        return record;
      } catch (error) {
        console.error("읽기 기록 저장 중 오류:", error);
        throw error;
      }
    },
    [getCurrentTab, setHistory]
  );

  const removeRecord = useCallback(
    async (recordId) => {
      try {
        const updatedHistory = await deleteReadingRecord(recordId);
        setHistory(updatedHistory);
        return updatedHistory;
      } catch (error) {
        console.error("읽기 기록 삭제 중 오류:", error);
        throw error;
      }
    },
    [setHistory]
  );

  const clearAllHistory = useCallback(async () => {
    try {
      await clearReadingHistory();
      setHistory([]);
    } catch (error) {
      console.error("읽기 기록 전체 삭제 중 오류:", error);
      throw error;
    }
  }, [setHistory]);

  const stats = getReadingStatistics(history);

  const recentHistory = history.slice(0, 10);

  const todayHistory = history.filter((record) => {
    const today = new Date();
    const recordDate = new Date(record.completedAt);
    return (
      today.getDate() === recordDate.getDate() &&
      today.getMonth() === recordDate.getMonth() &&
      today.getFullYear() === recordDate.getFullYear()
    );
  });

  return {
    history,
    recentHistory,
    todayHistory,
    stats,
    isSaved,
    error,
    isStorageLoaded,
    saveCompletedReading,
    removeRecord,
    clearAllHistory,
  };
}
