import { NavLink } from "react-router-dom";
import { HiOutlineHome, HiOutlineClipboardList } from "react-icons/hi";
import { HiOutlineSwatch } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";

const navItems = [
  { to: "/dashboard", label: "Home", icon: HiOutlineHome },
  { to: "/transactions", label: "Bills", icon: HiOutlineClipboardList },
  { to: "/billing/new", label: "Calculate", icon: HiOutlineSwatch },
  { to: "/measurements", label: "Measure", icon: HiOutlineSwatch },
  { to: "/profile", label: "Profile", icon: HiOutlineUser },
]

// Fixed bottom tab bar, mobile-app style. Stays the same across every main screen.
const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-transparent pointer-events-none">
      <div className="w-full max-w-app pointer-events-auto px-3 sm:px-4 md:px-5 lg:px-6">
        <div className="mx-auto mb-3 rounded-card bg-white dark:bg-[#1A2020] shadow-soft flex items-stretch justify-between px-1 py-1.5 md:mb-4 md:py-2 lg:max-w-[680px]">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 rounded-btn text-[10px] font-medium transition-colors md:text-[11px] lg:text-[12px] ${
                  isActive
                    ? "text-primary"
                    : "text-gray-400 dark:text-gray-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`text-[22px] md:text-[24px] lg:text-[26px] ${isActive ? "text-primary" : ""}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
