import React from 'react'
import isAuthenticated from '../../utils/isAuthenticated'
import { Navigate } from 'react-router-dom';

const AntiProtectedRoute = ({ children, redirectPath }) => {
  const authenticated = isAuthenticated();
  return authenticated.success ? <Navigate to={redirectPath} /> : children;
};

export default AntiProtectedRoute;