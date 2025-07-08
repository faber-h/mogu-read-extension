import { create } from "zustand";

import { TOAST } from "@/constants/toast";
import { generateId } from "@/utils/generateId";

export const useToastStore = create((set) => ({
  toasts: [],

  showToast: ({ title, body }) => {
    const id = generateId();
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          title,
          body,
          progressWidth: TOAST.PROGRESS_WIDTH.START,
        },
      ],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.map((toast) =>
          toast.id === id
            ? { ...toast, progressWidth: TOAST.PROGRESS_WIDTH.END }
            : toast
        ),
      }));
    }, TOAST.PROGRESS_DELAY_MS);

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, TOAST.TOTAL_TIMEOUT_MS);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
