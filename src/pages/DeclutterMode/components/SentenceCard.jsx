import { XMarkIcon } from "@heroicons/react/24/outline";

const SentenceCard = ({ text, onRemove, prefix = "" }) => {
  const displayText = text.replaceAll(" ", "\u00A0");

  return (
    <div className="flex w-full justify-between rounded border border-gray-200 px-3 py-2 text-sm text-gray-700">
      <span className="block break-words">
        {prefix}
        {displayText}
      </span>
      <button onClick={onRemove} className="shrink-0 cursor-pointer">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SentenceCard;
