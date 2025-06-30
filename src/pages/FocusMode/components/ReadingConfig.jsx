import { READING_SPEED, READING_SPEED_LABEL } from "../constants/readingSpeed";

const SPEED_OPTIONS = [
  READING_SPEED.FAST,
  READING_SPEED.NORMAL,
  READING_SPEED.SLOW,
];

const ReadingConfig = ({
  readingSpeed,
  setReadingSpeed,
  onStart,
  isContentDetected,
}) => {
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
            이 페이지에서는 <code>&lt;article&gt;</code> 또는{" "}
            <code>&lt;main&gt;</code> 태그가 감지되지 않아
            <br />
            몰입 읽기 모드를 사용할 수 없습니다.
          </p>
          <img
            src="/images/mogu_unavailable.png"
            alt="모구 준비 불가"
            className="h-50 w-50"
          />
        </>
      )}

      <div className="flex gap-2">
        {SPEED_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setReadingSpeed(option)}
            disabled={!isContentDetected}
            className={`rounded-full border border-purple-500 px-4 py-2 transition ${
              readingSpeed === option && isContentDetected
                ? "bg-purple-500 text-white"
                : "text-gray-600 hover:bg-purple-100"
            } ${!isContentDetected ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {READING_SPEED_LABEL[option]}
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={!isContentDetected}
        className={`rounded-full px-6 py-2 transition ${
          isContentDetected
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
        }`}
      >
        📖 읽기 시작
      </button>
    </div>
  );
};

export default ReadingConfig;
