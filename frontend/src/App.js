import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AuthState from './context/AuthState';
import AuthContext from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminStoreManagementPage from './pages/AdminStoreManagementPage';
import StoreOwnerDashboardPage from './pages/StoreOwnerDashboardPage';
import AdminRoute from './components/AdminRoute';
import StoreOwnerRoute from './components/StoreOwnerRoute';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'; // Import MUI components
import './App.css';

const AppContent = () => {
  const { isAuthenticated, logout, user, loadUser } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            TrustScore
          </Typography>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              {user && user.role === 'System Administrator' && (
                <Button color="inherit" component={Link} to="/admin">Admin</Button>
              )}
              {user && user.role === 'Store Owner' && (
                <Button color="inherit" component={Link} to="/my-store">My Store</Button>
              )}
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
            <Route path="/admin/stores" element={<AdminStoreManagementPage />} />
          </Route>
          <Route element={<StoreOwnerRoute />}>
            <Route path="/my-store" element={<StoreOwnerDashboardPage />} />
          </Route>
        </Routes>
      </Container>
    </Router>
  );
};

function App() {
  return (
    <AuthState>
      <AppContent />
    </AuthState>
  );
}

export default App;