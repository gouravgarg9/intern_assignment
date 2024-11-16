// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for token in localStorage
  return token ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
