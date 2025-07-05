import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

import ButtonSecondary from "@/components/ButtonSecondary";

import { useFocusStore } from "../stores/useFocusStore";

const ReadingControls = ({ onPause, onRewind, onRestart, onResume }) => {
  const paused = useFocusStore((store) => store.paused);

  return (
    <div className="flex items-center justify-center gap-2">
      {paused ? (
        <ButtonSecondary onClick={onResume}>
          <PlayIcon className="h-4 w-4" />
          재개
        </ButtonSecondary>
      ) : (
        <ButtonSecondary onClick={onPause}>
          <PauseIcon className="h-4 w-4" />
          일시정지
        </ButtonSecondary>
      )}

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
