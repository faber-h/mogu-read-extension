import { useRef, useEffect, useMemo, useState } from "react";

import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import { useDeclutterHistory } from "@/hooks/useDeclutterHistory";
import { useReadingHistory } from "@/hooks/useReadingHistory";

import { useViewOptionStore } from "../stores/useViewOptionStore";
import { getAvailableYears, getAvailableMonths } from "../utils/dateUtils";

export default function ViewOptionModal({ onClose }) {
  const { mode, setMode, year, setYear, month, setMonth } =
    useViewOptionStore();

  const { pages: declutteredSentences } = useDeclutterHistory();
  const { history: readingHistory } = useReadingHistory();

  const [draftMode, setDraftMode] = useState(mode);
  const [draftYear, setDraftYear] = useState(year);
  const [draftMonth, setDraftMonth] = useState(month);

  const combinedData = useMemo(() => {
    const declutteredData = declutteredSentences.map((item) => ({
      ...item,
      date: item.savedAt,
    }));
    const readingData = readingHistory.map((item) => ({
      ...item,
      date: item.completedAt,
    }));

    return [...declutteredData, ...readingData];
  }, [declutteredSentences, readingHistory]);

  const years = useMemo(() => {
    const dataYears = getAvailableYears(combinedData, "date");
    const currentYear = new Date().getFullYear().toString();
    if (!dataYears.includes(currentYear)) {
      dataYears.push(currentYear);
    }

    return dataYears.sort((a, b) => parseInt(b) - parseInt(a));
  }, [combinedData]);

  const months = useMemo(() => {
    const dataMonths = getAvailableMonths(combinedData, "date", draftYear);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear().toString();

    if (draftYear === currentYear && !dataMonths.includes(currentMonth)) {
      dataMonths.push(currentMonth);
    }

    return dataMonths.sort((a, b) => {
      if (a === "전체") return -1;
      if (b === "전체") return 1;

      return parseInt(b) - parseInt(a);
    });
  }, [combinedData, draftYear]);

  const yearRefs = useRef({});
  const monthRefs = useRef({});

  useEffect(() => {
    if (yearRefs.current[draftYear]) {
      yearRefs.current[draftYear].scrollIntoView({ block: "center" });
    }
  }, [draftYear]);

  useEffect(() => {
    if (monthRefs.current[draftMonth]) {
      monthRefs.current[draftMonth].scrollIntoView({ block: "center" });
    }
  }, [draftMonth]);

  const handleModeChange = (newMode) => {
    setDraftMode(newMode);
    if (newMode === "byDate") {
      if (!years.includes(draftYear)) {
        setDraftYear(years[0]);
      }
      if (!months.includes(draftMonth)) {
        setDraftMonth("전체");
      }
    }
  };

  const handleYearChange = (yearOption) => {
    if (draftMode === "byDate") setDraftYear(yearOption);
  };

  const handleMonthChange = (monthOption) => {
    if (draftMode === "byDate") setDraftMonth(monthOption);
  };

  const handleConfirm = () => {
    setMode(draftMode);
    setYear(draftYear);
    setMonth(draftMonth);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 text-center">
          <h3 className="mb-2 text-lg font-bold">보기 옵션</h3>
        </div>

        <div className="mb-4 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              className="accent-purple-500"
              checked={draftMode === "all"}
              onChange={() => handleModeChange("all")}
            />
            전체 보기
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              className="accent-purple-500"
              checked={draftMode === "byDate"}
              onChange={() => handleModeChange("byDate")}
            />
            날짜 선택
          </label>
        </div>

        <div className="mb-4 flex justify-between gap-4">
          <div className="w-1/2">
            <h4 className="mb-1 text-sm font-semibold">연도</h4>
            <div
              className={`scrollbar-hide h-40 overflow-y-auto rounded border border-purple-200 ${
                draftMode === "all" ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {years.length > 0 ? (
                years.map((yearOption) => (
                  <button
                    key={yearOption}
                    ref={(el) => (yearRefs.current[yearOption] = el)}
                    className={`block w-full rounded px-2 py-2 text-left ${
                      draftYear === yearOption
                        ? "bg-purple-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleYearChange(yearOption)}
                    disabled={draftMode === "all"}
                  >
                    {yearOption}년
                  </button>
                ))
              ) : (
                <div className="p-2 text-center text-gray-500">
                  데이터가 없습니다
                </div>
              )}
            </div>
          </div>

          <div className="w-1/2">
            <h4 className="mb-1 text-sm font-semibold">월</h4>
            <div
              className={`scrollbar-hide h-40 overflow-y-auto rounded border border-purple-200 ${
                draftMode === "all" ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {months.length > 0 ? (
                months.map((monthOption) => (
                  <button
                    key={monthOption}
                    ref={(el) => (monthRefs.current[monthOption] = el)}
                    className={`block w-full rounded px-2 py-2 text-left ${
                      draftMonth == monthOption
                        ? "bg-purple-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleMonthChange(monthOption)}
                    disabled={draftMode === "all"}
                  >
                    {monthOption === "전체" ? "전체" : `${monthOption}월`}
                  </button>
                ))
              ) : (
                <div className="p-2 text-center text-gray-500">
                  데이터가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <ButtonSecondary onClick={onClose}>취소</ButtonSecondary>
          <ButtonPrimary onClick={handleConfirm}>확인</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
