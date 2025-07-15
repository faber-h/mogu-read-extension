export function getFirstCharWidth(wordElement) {
  if (!wordElement || !wordElement.textContent) return 0;

  const firstChar = wordElement.textContent.charAt(0);
  const computedStyle = getComputedStyle(wordElement);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
  const firstCharWidth = context.measureText(firstChar).width;

  return firstCharWidth;
}
