export function unwrapMoguWord(wordId) {
  try {
    const moguWordElement = document.querySelector(
      `[data-word-id="${wordId}"]`
    );

    if (!moguWordElement || !moguWordElement.classList.contains("mogu-word"))
      return false;

    const parent = moguWordElement.parentElement;
    if (!parent) return false;

    const fragment = document.createDocumentFragment();
    while (moguWordElement.firstChild) {
      fragment.appendChild(moguWordElement.firstChild);
    }

    parent.replaceChild(fragment, moguWordElement);
    parent.normalize();

    return true;
  } catch (error) {
    console.error("태그 제거 실패", error);
    return false;
  }
}
