import { HiPlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

// The main "+" FAB, always creates a new bill — the most frequent action in a tailor shop.
// Uses the same centered-wrapper trick as BottomNav so it lines up with the app's
// max-width content column on both mobile and desktop.
const FloatingActionButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
      <div className="relative w-full max-w-app h-0 px-3 sm:px-4 md:px-5 lg:px-6">
        <button
          onClick={() => navigate("/billing/new")}
          aria-label="New Bill"
          className="pointer-events-auto absolute bottom-24 right-4 md:bottom-28 md:right-6 lg:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-white shadow-soft flex items-center justify-center active:scale-95 transition-transform"
        >
          <HiPlus className="text-2xl md:text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
