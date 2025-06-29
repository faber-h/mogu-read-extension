import { useLocation, useNavigate } from "react-router";

import { ROUTES } from "@/constants/paths";

const MODES = [
  { label: "정리 모드", path: ROUTES.DECLUTTER },
  { label: "몰입 읽기 모드", path: ROUTES.FOCUS },
];

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedIndex = MODES.findIndex(
    (mode) => mode.path === location.pathname
  );

  return (
    <div className="my-4 flex justify-center">
      <div className="relative inline-flex w-fit rounded-full bg-purple-100 p-1">
        <span
          className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-purple-500 transition-transform duration-300 ${
            selectedIndex === 0 ? "translate-x-0" : "translate-x-full"
          }`}
        />
        {MODES.map((mode, index) => (
          <button
            key={mode.path}
            onClick={() => navigate(mode.path)}
            className={`relative z-10 w-32 rounded-full py-2 text-center text-sm font-medium ${
              selectedIndex === index ? "text-white" : "text-gray-600"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Nav;
