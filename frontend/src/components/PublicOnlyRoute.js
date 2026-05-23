import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PublicOnlyRoute = ({ children, redirectTo = '/' }) => {
  const { authenticated } = useAuth();

  if (authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
