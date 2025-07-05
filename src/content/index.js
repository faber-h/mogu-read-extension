import { sendContentDetection } from "./contentDetector.js";
import { handleMessage } from "./messageHandler.js";
import { initializeMogu } from "./moguController.js";

sendContentDetection();
initializeMogu();

chrome.runtime.onMessage.addListener((message) => {
  handleMessage(message);
});
