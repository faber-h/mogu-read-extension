import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

import ButtonSecondary from "@/components/ButtonSecondary";

import { useFocusActions } from "../hooks/useFocusActions";
import { useFocusStore } from "../stores/useFocusStore";

const ReadingControls = () => {
  const paused = useFocusStore((store) => store.paused);
  const { handlePause, handleResume, handleRewind, handleRestart } =
    useFocusActions();

  return (
    <div className="flex items-center justify-center gap-2">
      {paused ? (
        <ButtonSecondary onClick={handleResume}>
          <PlayIcon className="h-4 w-4" />
          재개
        </ButtonSecondary>
      ) : (
        <ButtonSecondary onClick={handlePause}>
          <PauseIcon className="h-4 w-4" />
          일시정지
        </ButtonSecondary>
      )}

      <ButtonSecondary onClick={handleRewind}>
        <ArrowUturnLeftIcon className="h-4 w-4" />
        되감기
      </ButtonSecondary>
      <ButtonSecondary onClick={handleRestart}>
        <ArrowPathIcon className="h-4 w-4" />
        다시읽기
      </ButtonSecondary>
    </div>
  );
};

export default ReadingControls;
