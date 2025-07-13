import { XMarkIcon } from "@heroicons/react/24/outline";

import { useChromeExtension } from "@/hooks/useChromeExtension";

const SentenceCard = ({ sentence, text, prefix = "", context, onRemove }) => {
  const { sendMessageSafely } = useChromeExtension();

  const displayText = text.replaceAll(" ", "\u00A0");

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    if (!sentence || !sentence.id) return;

    const messageType =
      context === "selected"
        ? "HIGHLIGHT_SENTENCE"
        : context === "history"
          ? "SHOW_DECLUTTER_HISTORY_POSITION"
          : null;

    if (!messageType) return;

    sendMessageSafely({
      type: messageType,
      sentenceId: sentence.id,
    });
  };

  return (
    <div
      className="flex w-full cursor-pointer justify-between rounded border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
      onClick={handleCardClick}
    >
      <span className="block break-words">
        {prefix}
        {displayText}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="shrink-0 cursor-pointer"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SentenceCard;
