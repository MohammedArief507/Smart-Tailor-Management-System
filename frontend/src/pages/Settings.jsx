import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setLightMode, setDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-background dark:bg-[#121717]">
      <div className="max-w-app mx-auto px-4 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            aria-label="Back"
            className="w-9 h-9 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer flex items-center justify-center text-textmain dark:text-card"
          >
            <HiArrowLeft />
          </button>
          <h1 className="text-lg font-bold text-textmain dark:text-card">Settings</h1>
        </div>

        <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4">
          <h2 className="text-sm font-semibold text-textmain dark:text-card mb-3">Appearance</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={setLightMode}
              className={`flex flex-col items-center gap-2 h-24 rounded-btn border-2 transition-colors ${
                theme === "light"
                  ? "border-primary bg-primary/10"
                  : "border-transparent bg-background dark:bg-[#121717]"
              }`}
            >
              <HiOutlineSun
                className={`text-2xl ${theme === "light" ? "text-primary" : "text-gray-400"}`}
              />
              <span
                className={`text-sm font-semibold ${
                  theme === "light" ? "text-primary" : "text-textmain dark:text-card"
                }`}
              >
                Light Mode
              </span>
            </button>

            <button
              onClick={setDarkMode}
              className={`flex flex-col items-center gap-2 h-24 rounded-btn border-2 transition-colors ${
                theme === "dark"
                  ? "border-primary bg-primary/10"
                  : "border-transparent bg-background dark:bg-[#121717]"
              }`}
            >
              <HiOutlineMoon
                className={`text-2xl ${theme === "dark" ? "text-primary" : "text-gray-400"}`}
              />
              <span
                className={`text-sm font-semibold ${
                  theme === "dark" ? "text-primary" : "text-textmain dark:text-card"
                }`}
              >
                Dark Mode
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
