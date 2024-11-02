import React from 'react'
import { Navigate } from 'react-router-dom';
import isAuthenticated from '../../utils/isAuthenticated';

const ProtectedRoute = ({ children, loginPath }) => {
  const authenticated = isAuthenticated();
  return authenticated.success? children : <Navigate to={loginPath} />;
};

export default ProtectedRoute;