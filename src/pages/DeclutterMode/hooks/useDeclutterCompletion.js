import { useDeclutterHistory } from "@/hooks/useDeclutterHistory";

export function useDeclutterCompletion(selectedSentences) {
  const { saveSentences } = useDeclutterHistory();

  const handleDeclutterDone = async () => {
    if (selectedSentences.length === 0) return;

    await saveSentences(selectedSentences);
  };

  return { handleDeclutterDone };
}
