import { create } from "zustand";

export const useAppStore = create((set) => ({
  isContentDetected: false,

  setIsContentDetected: (value) => set({ isContentDetected: value }),
}));
