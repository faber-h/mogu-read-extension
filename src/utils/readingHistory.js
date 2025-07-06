import { chromeStorage } from "./chromeStorage";

export const READING_HISTORY_KEY = "moguread_reading_history";

export const saveReadingRecord = async (record) => {
  try {
    const existingHistory = await chromeStorage.get(READING_HISTORY_KEY, []);
    const newHistory = [record, ...existingHistory];
    const limitedHistory = newHistory.slice(0, 1000);

    await chromeStorage.set(READING_HISTORY_KEY, limitedHistory);
    return limitedHistory;
  } catch (error) {
    console.error("읽기 기록 저장 실패:", error);
    throw error;
  }
};

export const getReadingHistory = async () => {
  try {
    return await chromeStorage.get(READING_HISTORY_KEY, []);
  } catch (error) {
    console.error("읽기 기록 조회 실패:", error);
    return [];
  }
};

export const deleteReadingRecord = async (recordId) => {
  try {
    const history = await chromeStorage.get(READING_HISTORY_KEY, []);
    const filteredHistory = history.filter((record) => record.id !== recordId);
    await chromeStorage.set(READING_HISTORY_KEY, filteredHistory);
    return filteredHistory;
  } catch (error) {
    console.error("읽기 기록 삭제 실패:", error);
    throw error;
  }
};

export const clearReadingHistory = async () => {
  try {
    await chromeStorage.remove(READING_HISTORY_KEY);
  } catch (error) {
    console.error("읽기 기록 전체 삭제 실패:", error);
    throw error;
  }
};

export const getReadingStatistics = (history) => {
  if (!history || history.length === 0) {
    return {
      totalSessions: 0,
      totalWords: 0,
      totalSeconds: 0,
      averageWordsPerMinute: 0,
      mostReadDomain: null,
      readingStreak: 0,
    };
  }

  const totalSessions = history.length;
  const totalWords = history.reduce(
    (sum, record) => sum + record.totalWords,
    0
  );
  const totalSeconds = history.reduce(
    (sum, record) => sum + record.readingSeconds,
    0
  );
  const averageWordsPerMinute =
    totalSeconds > 0 ? Math.round((totalWords / totalSeconds) * 60) : 0;

  const domainCounts = {};
  history.forEach((record) => {
    domainCounts[record.domain] = (domainCounts[record.domain] || 0) + 1;
  });

  const mostReadDomain = Object.keys(domainCounts).reduce(
    (a, b) => (domainCounts[a] > domainCounts[b] ? a : b),
    null
  );

  const readingStreak = getReadingStreak(history);

  return {
    totalSessions,
    totalWords,
    totalSeconds,
    averageWordsPerMinute,
    mostReadDomain,
    readingStreak,
  };
};

const getReadingStreak = (history) => {
  if (!history || history.length === 0) return 0;

  const sortedHistory = [...history].sort(
    (a, b) => b.completedAt - a.completedAt
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let comparisonDate = new Date(today);

  for (let i = 0; i < sortedHistory.length; i++) {
    const recordDate = new Date(sortedHistory[i].completedAt);
    recordDate.setHours(0, 0, 0, 0);

    if (recordDate.getTime() === comparisonDate.getTime()) {
      streak++;
      comparisonDate.setDate(comparisonDate.getDate() - 1);
    } else if (recordDate.getTime() < comparisonDate.getTime()) {
      break;
    }
  }

  return streak;
};

export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};

export const generateRecordId = () => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const hexString = Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  const recordId =
    `${hexString.slice(0, 4)}-` +
    `${hexString.slice(4, 8)}-` +
    `${hexString.slice(8, 12)}-` +
    `${hexString.slice(12, 16)}`;

  return recordId;
};
