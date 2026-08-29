import BottomNav from "../components/BottomNav";
import FloatingActionButton from "../components/FloatingActionButton";

// Wraps every main (logged-in) screen with the standard app chrome:
// scrollable content area + fixed bottom nav + floating action button
const MainLayout = ({ children, showFab = true }) => {
  return (
    <div className="min-h-screen bg-background dark:bg-[#121717]">
      <div className="max-w-app mx-auto px-4 pt-6 pb-28 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        {children}
      </div>
      {showFab && <FloatingActionButton />}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
