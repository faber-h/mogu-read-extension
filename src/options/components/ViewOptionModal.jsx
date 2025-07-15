import { useRef, useEffect } from "react";

import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";

import { useViewOptionStore } from "../stores/useViewOptionStore";

export default function ViewOptionModal({ onClose }) {
  const { mode, setMode, year, setYear, month, setMonth } =
    useViewOptionStore();

  const years = ["2025", "2024", "2023", "2022", "2021"];
  const months = [
    "전체",
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const yearRefs = useRef({});
  const monthRefs = useRef({});

  useEffect(() => {
    if (yearRefs.current[year]) {
      yearRefs.current[year].scrollIntoView({
        block: "center",
        behavior: "auto",
      });
    }
  }, [year]);

  useEffect(() => {
    if (monthRefs.current[month]) {
      monthRefs.current[month].scrollIntoView({
        block: "center",
        behavior: "auto",
      });
    }
  }, [month]);

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
              checked={mode === "all"}
              onChange={() => setMode("all")}
            />
            전체 보기
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              className="accent-purple-500"
              checked={mode === "byDate"}
              onChange={() => setMode("byDate")}
            />
            날짜 선택
          </label>
        </div>

        <div className="mb-4 flex justify-between gap-4">
          <div className="w-1/2">
            <h4 className="mb-1 text-sm font-semibold">연도</h4>
            <div
              className={`scrollbar-hide h-40 overflow-y-auto rounded border border-purple-200 ${
                mode === "all" ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {years.map((yearOption) => (
                <button
                  key={yearOption}
                  ref={(el) => (yearRefs.current[yearOption] = el)}
                  className={`block w-full rounded px-2 py-2 text-left ${
                    year === yearOption
                      ? "bg-purple-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (mode === "byDate") setYear(yearOption);
                  }}
                  disabled={mode === "all"}
                >
                  {yearOption} 년
                </button>
              ))}
            </div>
          </div>

          <div className="w-1/2">
            <h4 className="mb-1 text-sm font-semibold">월</h4>
            <div
              className={`scrollbar-hide h-40 overflow-y-auto rounded border border-purple-200 ${
                mode === "all" ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {months.map((monthOption) => (
                <button
                  key={monthOption}
                  ref={(el) => (monthRefs.current[monthOption] = el)}
                  className={`block w-full rounded px-2 py-2 text-left ${
                    month === monthOption
                      ? "bg-purple-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (mode === "byDate") setMonth(monthOption);
                  }}
                  disabled={mode === "all"}
                >
                  {monthOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <ButtonSecondary onClick={onClose} className="text-gray-500">
            취소
          </ButtonSecondary>
          <ButtonPrimary
            onClick={() => {
              onClose();
            }}
            className="font-bold text-purple-600"
          >
            확인
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
