import DeclutteredHistory from "./components/DeclutteredHistory";
import ReadingHistory from "./components/ReadingHistory";
import Sidebar from "./components/Sidebar";
import { useSettingStore } from "./stores/useSettingStore";

const COMPONENT_MAP = {
  declutteredHistory: DeclutteredHistory,
  readingHistory: ReadingHistory,
};

export default function SettingsApp() {
  const { activeTab } = useSettingStore();

  const ActiveComponent = COMPONENT_MAP[activeTab];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 justify-center overflow-hidden">
        <div className="flex w-full max-w-4xl flex-col overflow-hidden p-8">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
