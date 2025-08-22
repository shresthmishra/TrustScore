import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const StoreOwnerRoute = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated && user && user.role === 'Store Owner') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default StoreOwnerRoute;