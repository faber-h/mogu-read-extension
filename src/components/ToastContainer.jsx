import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { TOAST } from "@/constants/toast";
import { useToastStore } from "@/stores/useToastStore";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="relative mx-auto flex w-full max-w-full items-start rounded border border-gray-200 bg-white p-4 shadow"
        >
          <InformationCircleIcon className="mr-2 h-5 w-5 text-purple-500" />
          <div className="flex flex-1 flex-col text-sm">
            <span className="font-semibold text-gray-800">{toast.title}</span>
            {toast.body && (
              <span className="mt-1 block rounded bg-purple-50 px-2 py-1 text-sm text-purple-700">
                {toast.body}
              </span>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>

          <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-purple-100">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{
                width: toast.progressWidth || TOAST.PROGRESS_WIDTH.START,
                transitionDuration: `${TOAST.DURATION_MS}ms`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
