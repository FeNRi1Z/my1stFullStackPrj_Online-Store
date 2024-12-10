/**
 * AuthProvider Component
 * Manages authentication state and theme configuration
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App, ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from '../theme/ThemeProvider';
import config from '../../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const themeConfig = {
    algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorText: theme === 'dark' ? '#F5F5F5' : '#2D3142',
      colorBgElevated: theme === 'dark' ? '#2B2B2B' : '#ffffff',
      colorBgContainer: theme === 'dark' ? '#3D3D3D' : '#ffffff',
      colorBgTextHover: theme === 'dark' ? '#3D3D3D' : '#f0f0f0',
      colorBgTextActive: theme === 'dark' ? '#4a4a4a' : '#e6e6e6',
      colorBorder: theme === 'dark' ? '#4a4a4a' : '#d9d9d9',
      colorPrimary: '#EA9029',
      colorPrimaryHover: '#D68324',
      colorPrimaryActive: '#C27420',
    },
    components: {
      Message: {
        colorBgElevated: theme === 'dark' ? '#3D3D3D' : '#ffffff',
        colorText: theme === 'dark' ? '#F5F5F5' : '#2D3142',
      }
    }
  };

  return (
    <App>
      <ConfigProvider theme={themeConfig}>
        <AuthContextContent
          user={user}
          setUser={setUser}
          loading={loading}
          setLoading={setLoading}
        >
          {children}
        </AuthContextContent>
      </ConfigProvider>
    </App>
  );
};

const AuthContextContent = ({
  children,
  user,
  setUser,
  loading,
  setLoading
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();

  // Helper function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
  };

  // Fetch user information using token
  const fetchUserInfo = async (token) => {
    try {
      if (!token) {
        throw new Error('No token available');
      }

      const cleanToken = token.replace('Bearer ', '');

      const response = await fetch(config.apiPath + '/user/info', {
        method: 'GET',
        headers: {
          Authorization: cleanToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setUser(null);
          throw new Error('Session expired. Please sign in again.');
        }
        throw new Error('Failed to get user information');
      }

      const data = await response.json();
      const role = localStorage.getItem('role');

      setUser({
        ...data.result,
        role: role
      });
      return true;

    } catch (error) {
      console.error('Error in fetchUserInfo:', error);
      return false;
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await fetchUserInfo(token);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (token, role, userData = null) => {
    try {
      const cleanToken = token.replace('Bearer ', '');
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('role', role);

      if (userData) {
        setUser({ ...userData, role });
        message.success('Successfully signed in!');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
        return;
      }

      const response = await fetch(config.apiPath + '/user/info', {
        method: 'GET',
        headers: {
          Authorization: cleanToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user information');
      }

      const data = await response.json();
      setUser({ ...data.result, role });
      message.success('Successfully signed in!');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUser(null);
      message.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    message.success('Successfully signed out!');
    navigate('/');
  };

  // Refresh user data
  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(config.apiPath + '/user/info', {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh user data');
      }

      const data = await response.json();
      const role = localStorage.getItem('role');
      setUser({ ...data.result, role });
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Provide auth context
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    getAuthToken,
    refreshUserData
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Intregrated Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;