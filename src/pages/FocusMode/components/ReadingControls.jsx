import {
  PauseIcon,
  ArrowUturnLeftIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import ButtonSecondary from "@/components/ButtonSecondary";

const ReadingControls = ({ onPause, onRewind, onRestart }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <ButtonSecondary onClick={onPause}>
        <PauseIcon className="h-4 w-4" />
        일시정지
      </ButtonSecondary>
      <ButtonSecondary onClick={onRewind}>
        <ArrowUturnLeftIcon className="h-4 w-4" />
        되감기
      </ButtonSecondary>
      <ButtonSecondary onClick={onRestart}>
        <ArrowPathIcon className="h-4 w-4" />
        다시읽기
      </ButtonSecondary>
    </div>
  );
};

export default ReadingControls;
