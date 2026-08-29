import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { GiScissors } from "react-icons/gi";

// Edit these to personalize the About screen — no other code needs to change.
const APP_VERSION = "1.0.0";
const DEVELOPER_NAME = "Your Name";
const DEVELOPER_EMAIL = "you@example.com";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background dark:bg-[#121717]">
      <div className="max-w-app mx-auto px-4 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/profile")}
            aria-label="Back"
            className="w-9 h-9 rounded-btn bg-white dark:bg-[#1A2020] shadow-softer flex items-center justify-center text-textmain dark:text-card"
          >
            <HiArrowLeft />
          </button>
          <h1 className="text-lg font-bold text-textmain dark:text-card">About</h1>
        </div>

        {/* App identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-soft mb-4">
            <GiScissors className="text-white text-3xl" />
          </div>
          <h2 className="text-lg font-bold text-textmain dark:text-card">Smart Tailor</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Shop Management System
          </p>
        </div>

        {/* Details */}
        <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">Application Version</span>
            <span className="text-sm font-semibold text-textmain dark:text-card">
              v{APP_VERSION}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">Developed By</span>
            <span className="text-sm font-semibold text-textmain dark:text-card">
              {DEVELOPER_NAME}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-gray-500 dark:text-gray-400">Contact</span>
            <span className="text-sm font-semibold text-primary">{DEVELOPER_EMAIL}</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Built with React, Node.js, Express, and MongoDB.
        </p>
      </div>
    </div>
  );
};

export default About;
