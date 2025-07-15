import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import ViewOptionModal from "./ViewOptionModal";
import { SIDEBAR_MENU } from "../constants/sidebarMenu";
import { useSettingStore } from "../stores/useSettingStore";
import { useViewOptionStore } from "../stores/useViewOptionStore";

export default function SettingHeader() {
  const activeTab = useSettingStore((store) => store.activeTab);
  const title =
    SIDEBAR_MENU.find((menu) => menu.key === activeTab)?.label || "";

  const { mode, year, month } = useViewOptionStore();
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayText = () => {
    if (mode === "all") return "전체 보기";
    if (month === "전체") return `${year}년 전체`;
    return `${year}년 ${month}월`;
  };

  return (
    <div className="mb-4">
      <h1 className="mt-4 mb-4 text-2xl font-bold">{title}</h1>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-purple-500"
      >
        <span className="text-xl font-semibold text-gray-800">
          {getDisplayText()}
        </span>
        <AdjustmentsHorizontalIcon className="h-5 w-5" />
      </button>
      {isOpen && <ViewOptionModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}
