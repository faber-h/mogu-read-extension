import { create } from "zustand";

export const useSettingStore = create((set) => ({
  activeTab: "declutteredHistory",

  setActiveTab: (key) => set({ activeTab: key }),
}));
