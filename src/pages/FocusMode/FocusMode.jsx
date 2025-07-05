import ReadingConfig from "./components/ReadingConfig";
import ReadingContent from "./components/ReadingContent";
import ReadingControls from "./components/ReadingControls";
import ReadingProgress from "./components/ReadingProgress";
import ReadingSummary from "./components/ReadingSummary";
import { READ_STATUS } from "./constants/readStatus";
import { useFocusMessaging } from "./hooks/useFocusMessaging";
import { useProgressCompletion } from "./hooks/useProgressCompletion";
import { useFocusStore } from "./stores/useFocusStore";

const FocusMode = () => {
  const readStatus = useFocusStore((store) => store.readStatus);
  useFocusMessaging();
  useProgressCompletion();

  return (
    <div className="space-y-6 p-4">
      {readStatus === READ_STATUS.IDLE && <ReadingConfig />}

      {readStatus === READ_STATUS.READING && (
        <>
          <ReadingContent />
          <ReadingProgress />
          <ReadingControls />
        </>
      )}

      {readStatus === READ_STATUS.DONE && <ReadingSummary />}
    </div>
  );
};

export default FocusMode;
