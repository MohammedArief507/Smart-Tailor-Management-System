import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any private page with this to require a logged-in user
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-[#121717]">
        <p className="text-textmain dark:text-card">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
