import { initializeMogu } from "./moguController.js";

export function executeDeclutter(wordIds) {
  if (!wordIds || !wordIds.length) return;

  initializeMogu();
  animateDeclutterSequence(wordIds);
}

async function animateDeclutterSequence(wordIds) {
  const mogu = document.getElementById("mogu");
  if (!mogu) return;

  mogu.classList.add("declutter-mode");

  for (const wordId of wordIds) {
    const moguWordElement = document.querySelector(
      `[data-word-id="${wordId}"]`
    );
    if (!moguWordElement) continue;

    moguWordElement.classList.add("mogu-target");

    await animateEatAndDelete(mogu, moguWordElement);
  }

  mogu.classList.remove("declutter-mode");
  mogu.style.opacity = "0";

  chrome.runtime.sendMessage({ type: "DECLUTTER_DONE" });
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function animateEatAndDelete(mogu, wordElement) {
  const rect = wordElement.getBoundingClientRect();
  const startX = rect.left + window.scrollX;
  const wordTop = rect.top + window.scrollY;
  const endX = rect.right + window.scrollX;

  mogu.style.transition = "none";
  mogu.style.left = `${startX}px`;
  mogu.style.top = `${wordTop}px`;
  mogu.style.opacity = "1";

  const windowHeight = window.innerHeight;
  const windowCenterY = windowHeight / 2;
  const distanceToCenter = Math.abs(rect.top - windowCenterY);

  if (distanceToCenter > 50) {
    wordElement.scrollIntoView({
      behavior: "instant",
      block: "center",
    });
  }

  await nextFrame();

  const animationDuration = 600;

  mogu.style.transition = `left ${animationDuration}ms ease`;
  mogu.style.left = `${endX}px`;

  wordElement.style.transition = `opacity ${animationDuration}ms ease`;
  wordElement.style.opacity = "0";

  await delay(animationDuration + 50);

  wordElement.remove();
}
