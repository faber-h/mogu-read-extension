import { useFocusStore } from "../stores/useFocusStore";

const ReadingContent = () => {
  const readingProgress = useFocusStore((store) => store.readingProgress);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full rounded border border-purple-200 p-4 text-center">
        <p className="text-lg font-medium">👀 몰입 읽기 중</p>
        <p>
          현재 단어: {readingProgress.currentWord} /{" "}
          {readingProgress.totalWords}
        </p>
      </div>
    </div>
  );
};

export default ReadingContent;
