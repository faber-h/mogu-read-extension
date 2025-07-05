import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";

import { READING_SPEED, READING_SPEED_LABEL } from "../constants/readingSpeed";
import { useFocusStore } from "../stores/useFocusStore";

const SPEED_OPTIONS = [
  READING_SPEED.FAST,
  READING_SPEED.NORMAL,
  READING_SPEED.SLOW,
];

const ReadingConfig = ({ onSpeedPreview, onStopPreview, onStart }) => {
  const isContentDetected = useFocusStore((store) => store.isContentDetected);
  const previewMode = useFocusStore((store) => store.previewMode);
  const readingSpeed = useFocusStore((store) => store.readingSpeed);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-lg font-semibold">📖 읽기 전 준비</h2>

      {isContentDetected ? (
        <>
          <p className="text-sm text-gray-500">
            모구가 선택한 속도로 글을 먹어갑니다!
          </p>
          <img
            src="/images/mogu_ready.png"
            alt="모구 준비 중"
            className="h-40 w-50"
          />
        </>
      ) : (
        <>
          <p className="text-center text-sm text-red-500">
            앗! 이 페이지에서는 몰입 읽기 모드에 필요한
            <br />
            글 영역이 감지되지 않아
            <br />
            사용할 수 없어요.
          </p>
          <img
            src="/images/mogu_unavailable.png"
            alt="모구 준비 불가"
            className="h-50 w-50"
          />
        </>
      )}

      <div className="mt-4 flex gap-2">
        {SPEED_OPTIONS.map((option) => (
          <ButtonSecondary
            key={option}
            onClick={() => onSpeedPreview(option)}
            disabled={!isContentDetected}
            selected={readingSpeed === option && isContentDetected}
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
              className="ml-2 text-purple-600 underline"
              onClick={onStopPreview}
            >
              미리보기 중지
            </button>
          </div>
        )}
      </div>

      <ButtonPrimary
        className="mt-2"
        onClick={onStart}
        disabled={!isContentDetected}
      >
        📖 읽기 시작
      </ButtonPrimary>
    </div>
  );
};

export default ReadingConfig;
