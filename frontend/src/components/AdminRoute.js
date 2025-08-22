import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Check for auth and if the user role is 'System Administrator'
  if (isAuthenticated && user && user.role === 'System Administrator') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />; // Or a custom '/unauthorized' page
  }
};

export default AdminRoute;