import { useNavigate, useLocation } from "react-router-dom";
import { HiArrowLeft, HiOutlineHome } from "react-icons/hi";

const TABS = [
  { label: "Calculate", path: "/billing/new" },
  { label: "Transaction", path: "/transactions" },
  { label: "Measurements", path: "/measurements" },
];

// Matches the Figma header used on Bill / Transactions / Measurements:
// a solid teal bar with a back arrow and home icon, then an underline-style
// tab strip directly beneath it for switching between the three screens.
const AppHeader = ({ onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="-mx-4 -mt-6 mb-4">
      <div className="bg-primary px-4 pt-6 pb-3 flex items-center justify-between">
        <button
          onClick={onBack || (() => navigate("/dashboard"))}
          aria-label="Back"
          className="w-8 h-8 flex items-center justify-center text-white"
        >
          <HiArrowLeft className="text-lg" />
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          aria-label="Home"
          className="w-8 h-8 flex items-center justify-center text-white"
        >
          <HiOutlineHome className="text-lg" />
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A2020] flex">
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AppHeader;
