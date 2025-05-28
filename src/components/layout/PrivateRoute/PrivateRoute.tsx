import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

/**
 * A wrapper for protected routes that redirects to login if user is not authenticated
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If still loading auth state, show nothing (or could add a loading spinner)
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default PrivateRoute;
