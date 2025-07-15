import { create } from "zustand";

export const useViewOptionStore = create((set) => ({
  mode: "byDate",
  year: new Date().getFullYear().toString(),
  month: `${new Date().getMonth() + 1}월`,

  setMode: (mode) => set({ mode }),
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
}));
