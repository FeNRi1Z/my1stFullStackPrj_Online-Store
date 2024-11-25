import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from 'antd';
import config from "../config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Add getAuthToken function
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
  };

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

  const AuthContent = () => {
    const { message } = App.useApp();

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

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUser(null);
      message.success('Successfully signed out!');
      navigate('/');
    };

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

    const value = {
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      getAuthToken,
      refreshUserData
    };

    return (
      <AuthContext.Provider value={value}>
        {!loading ? children : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
          </div>
        )}
      </AuthContext.Provider>
    );
  };

  return (
    <App>
      <AuthContent />
    </App>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;