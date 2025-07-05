import ButtonPrimary from "@/components/ButtonPrimary";

import { useFocusActions } from "../hooks/useFocusActions";
import { useFocusStore } from "../stores/useFocusStore";

const ReadingSummary = () => {
  const readingProgress = useFocusStore((store) => store.readingProgress);
  const { handleReset } = useFocusActions();

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-lg font-semibold">🏆 읽기 완료 요약</h2>
      <p>✔️ 읽은 시간: {readingProgress.elapsed}초</p>
      <p>✔️ 총 단어 수: {readingProgress.totalWords}단어</p>
      <p>🐣 모구 단계: 성장 단계</p>
      <ButtonPrimary onClick={handleReset}>
        읽기 설정으로 돌아가기
      </ButtonPrimary>
    </div>
  );
};

export default ReadingSummary;
