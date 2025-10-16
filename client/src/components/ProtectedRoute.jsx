// client/src/components/ProtectedRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);

  // Check if the token exists in the Redux store
  if (token) {
    // If logged in, render the child component (the page we're protecting)
    return <Outlet />;
  } else {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;