import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    // Wrong role - redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
