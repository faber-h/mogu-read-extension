import DeclutteredHistory from "./components/DeclutteredHistory";
import ReadingHistory from "./components/ReadingHistory";
import SettingHeader from "./components/SettingHeader";
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
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex-shrink-0">
              <SettingHeader />
            </div>

            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>
    </div>
  );
}
