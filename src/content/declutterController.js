export function executeDeclutter(wordIds) {
  if (!wordIds || !wordIds.length) return;

  wordIds.forEach((wordId) => {
    const moguWordElement = document.querySelector(
      `[data-word-id="${wordId}"]`
    );
    if (moguWordElement) {
      moguWordElement.remove();
    }
  });
}
