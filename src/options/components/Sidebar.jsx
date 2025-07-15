import { SIDEBAR_MENU } from "../constants/sidebarMenu";
import { useSettingStore } from "../stores/useSettingStore";

export default function Sidebar() {
  const { activeTab, setActiveTab } = useSettingStore();

  return (
    <aside className="flex w-60 flex-col bg-white shadow-md">
      <div className="flex h-35 items-center justify-center gap-2">
        <img
          src="/images/mogu-read-icon-128.png"
          alt="MoguRead Logo"
          className="h-8 w-8"
        />
        <span className="text-xl font-bold text-purple-600">MoguRead</span>
      </div>

      <ul className="flex-1 space-y-2 p-4">
        {SIDEBAR_MENU.map((menu) => (
          <li key={menu.key}>
            <button
              onClick={() => setActiveTab(menu.key)}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm ${
                activeTab === menu.key
                  ? "bg-purple-500 text-white"
                  : "text-gray-600 hover:bg-purple-100"
              }`}
            >
              {menu.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
