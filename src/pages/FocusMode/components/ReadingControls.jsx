import {
  PauseIcon,
  ArrowUturnLeftIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const ReadingControls = ({ onPause, onRewind, onRestart }) => {
  const buttonClass =
    "flex items-center gap-1 rounded-full border border-purple-500 px-4 py-2 text-gray-600 transition hover:bg-purple-100";

  return (
    <div className="flex items-center justify-center gap-2">
      <button className={buttonClass} onClick={onPause}>
        <PauseIcon className="h-4 w-4" />
        일시정지
      </button>
      <button className={buttonClass} onClick={onRewind}>
        <ArrowUturnLeftIcon className="h-4 w-4" />
        되감기
      </button>
      <button className={buttonClass} onClick={onRestart}>
        <ArrowPathIcon className="h-4 w-4" />
        다시읽기
      </button>
    </div>
  );
};

export default ReadingControls;
