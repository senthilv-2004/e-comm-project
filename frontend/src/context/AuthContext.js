// src/context/AuthContext.js - Global Authentication State Management
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider - Wraps the app and provides auth state to all children
 * Manages: user data, login, logout, loading state
 */
export const AuthProvider = ({ children }) => {
  // State for current user data
  const [user, setUser] = useState(null);
  // State for auth loading (checking localStorage on mount)
  const [loading, setLoading] = useState(true);

  // On app startup, check if user is already logged in (from localStorage)
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
          // Restore user from localStorage
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        // If localStorage data is corrupt, clear it
        console.error('Auth init error:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * login - Saves user data and token after successful authentication
   * @param {string} token - JWT token from backend
   * @param {object} userData - User object from backend
   */
  const login = (token, userData) => {
    // Save to localStorage for persistence across page refreshes
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Update React state
    setUser(userData);
  };

  /**
   * logout - Clears all auth data and redirects to home
   */
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear React state
    setUser(null);
  };

  /**
   * updateUser - Updates user data in state and localStorage
   * @param {object} updatedData - New user data to merge
   */
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Value provided to all consuming components
  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we've checked localStorage */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth - Custom hook to access auth context
 * Usage: const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
