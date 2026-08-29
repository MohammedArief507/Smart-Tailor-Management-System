import { GiScissors } from "react-icons/gi";

// Shared wrapper for Login and Register screens to keep branding consistent
const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-background dark:bg-[#121717] flex flex-col items-center px-6 pt-14 pb-10">
      <div className="w-full max-w-app flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-soft mb-4">
            <GiScissors className="text-white text-3xl" />
          </div>
          <h1 className="text-xl font-bold text-textmain dark:text-card">Smart Tailor</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Shop Management System</p>
        </div>

        <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-soft p-6">
          <h2 className="text-lg font-semibold text-textmain dark:text-card mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{subtitle}</p>}
          {!subtitle && <div className="mb-5" />}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
