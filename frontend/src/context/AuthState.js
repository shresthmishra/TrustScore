import React, { useReducer } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AuthContext from './AuthContext';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      const user = jwtDecode(action.payload.token).user;
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: user,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    case 'REGISTER_FAIL':
    case 'LOGOUT':
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User - Checks if a token exists and loads the user info
  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token).user;
      dispatch({ type: 'USER_LOADED', payload: user });
    }
  };

  // Register User
  const register = async (formData) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      await axios.post('/api/users/signup', formData, config);
      dispatch({ type: 'REGISTER_SUCCESS' });
      alert('Signup successful! Please log in.');
    } catch (err) {
      dispatch({ type: 'REGISTER_FAIL' });
      alert('Signup failed. The email might already be in use.');
    }
  };

  // Login User
  const login = async (formData) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      const res = await axios.post('/api/users/login', formData, config);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Logout
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;