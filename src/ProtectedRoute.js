// src/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Custom hook to access auth context

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Get current user from context

  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
