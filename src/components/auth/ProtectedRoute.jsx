import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { selectCurrentUser, selectIsAuthenticated } from "../../redux/slices/authSlice";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    // Redirect to the /login page, saving the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required (e.g., admin) and user doesn't have it
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
