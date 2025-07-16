import { useLocation, useNavigate } from "react-router";

import { ROUTES } from "@/constants/paths";
import { READ_STATUS } from "@/pages/FocusMode/constants/readStatus";
import { useFocusStore } from "@/pages/FocusMode/stores/useFocusStore";
import { useAppStore } from "@/stores/useAppStore";

const MODES = [
  { label: "정리 모드", path: ROUTES.DECLUTTER },
  { label: "몰입 읽기 모드", path: ROUTES.FOCUS },
];

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const readStatus = useFocusStore((state) => state.readStatus);
  const isContentDetected = useAppStore((store) => store.isContentDetected);

  const selectedIndex = MODES.findIndex(
    (mode) => mode.path === location.pathname
  );

  const isFocusReading = readStatus === READ_STATUS.READING;

  const handleNavigate = (path, disabled) => {
    if (!disabled) {
      navigate(path);
    }
  };

  return (
    <div className="my-4 flex justify-center">
      <div className="relative inline-flex w-fit rounded-full bg-purple-100 p-1">
        <span
          className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-purple-500 transition-transform duration-300 ${
            selectedIndex === 0 ? "translate-x-0" : "translate-x-full"
          }`}
        />
        {MODES.map((mode, index) => {
          const isDeclutterMode = mode.path === ROUTES.DECLUTTER;
          const isDisabled =
            (isDeclutterMode && isFocusReading) || !isContentDetected;

          return (
            <button
              key={mode.path}
              onClick={() => handleNavigate(mode.path, isDisabled)}
              disabled={isDisabled}
              className={`relative z-10 w-32 rounded-full py-2 text-center text-sm font-medium ${
                selectedIndex === index ? "text-white" : "text-gray-600"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Nav;
