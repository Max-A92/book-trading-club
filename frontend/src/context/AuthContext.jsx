import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authService.getCurrentUser();
        // Sicherstellen das sowohl id als auch _id existieren
        if (userData._id && !userData.id) {
          userData.id = userData._id;
        }
        if (userData.id && !userData._id) {
          userData._id = userData.id;
        }
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    
    const userData = response.user;
    if (userData._id && !userData.id) {
      userData.id = userData._id;
    }
    if (userData.id && !userData._id) {
      userData._id = userData.id;
    }
    
    setUser(userData);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    localStorage.setItem('token', response.token);
    
    const user = response.user;
    if (user._id && !user.id) {
      user.id = user._id;
    }
    if (user.id && !user._id) {
      user._id = user.id;
    }
    
    setUser(user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData);
    
    const userData = response.user;
    if (userData._id && !userData.id) {
      userData.id = userData._id;
    }
    if (userData.id && !userData._id) {
      userData._id = userData.id;
    }
    
    setUser(userData);
    return response;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};