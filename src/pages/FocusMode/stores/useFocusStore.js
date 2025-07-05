import { create } from "zustand";

import { READING_SPEED } from "../constants/readingSpeed";
import { READ_STATUS } from "../constants/readStatus";

export const useFocusStore = create((set) => ({
  isContentDetected: false,
  paused: false,
  previewMode: false,
  readStatus: READ_STATUS.IDLE,
  readingSpeed: READING_SPEED.NORMAL,
  readingProgress: {
    currentWord: 0,
    totalWords: 0,
    elapsed: 0,
  },

  setIsContentDetected: (value) => set({ isContentDetected: value }),
  setPaused: (paused) => set({ paused }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setReadStatus: (status) => set({ readStatus: status }),
  setReadingSpeed: (speed) => set({ readingSpeed: speed }),
  setReadingProgress: (progress) => set({ readingProgress: progress }),
  updateReadingProgress: (updater) =>
    set((state) => ({
      readingProgress: updater(state.readingProgress),
    })),
}));
