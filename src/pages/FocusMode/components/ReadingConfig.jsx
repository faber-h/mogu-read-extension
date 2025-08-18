import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";

import { READING_SPEED, READING_SPEED_LABEL } from "../constants/readingSpeed";
import { useFocusActions } from "../hooks/useFocusActions";
import { useFocusStore } from "../stores/useFocusStore";

const SPEED_OPTIONS = [
  READING_SPEED.FAST,
  READING_SPEED.NORMAL,
  READING_SPEED.SLOW,
];

const ReadingConfig = () => {
  const previewMode = useFocusStore((store) => store.previewMode);
  const readingSpeed = useFocusStore((store) => store.readingSpeed);

  const { handleSpeedPreview, handleStopPreview, handleStart } =
    useFocusActions();

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-lg font-semibold">📖 읽기 전 준비</h2>
      <p className="text-sm text-gray-500">
        모구가 선택한 속도로 글을 먹어갑니다!
      </p>
      <img
        src="/images/mogu_ready.png"
        alt="모구 준비 중"
        className="h-40 w-50"
      />
      <div className="mt-4 flex gap-2">
        {SPEED_OPTIONS.map((option) => (
          <ButtonSecondary
            key={option}
            onClick={() => handleSpeedPreview(option)}
            selected={readingSpeed === option}
          >
            {READING_SPEED_LABEL[option]}
          </ButtonSecondary>
        ))}
      </div>

      <div className="min-h-4">
        {previewMode && (
          <div className="flex items-center text-xs text-gray-500">
            <span>선택한 속도로 미리보기 중입니다.</span>
            <button
              className="ml-2 cursor-pointer text-purple-600 underline"
              onClick={handleStopPreview}
            >
              미리보기 중지
            </button>
          </div>
        )}
      </div>

      <ButtonPrimary className="mt-2" onClick={handleStart}>
        📖 읽기 시작
      </ButtonPrimary>
    </div>
  );
};

export default ReadingConfig;
