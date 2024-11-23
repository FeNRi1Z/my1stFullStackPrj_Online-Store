import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:3002/user/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          ...data.result,
          role: localStorage.getItem('role')
        });
        return true;
      } else {
        const errorData = await response.json();
        console.error('User info error:', errorData);
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setUser(null);
          message.error('Session expired. Please sign in again.');
          navigate('/signin');
        }
        return false;
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return false;
    }
  };

  // Initialize auth state
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

  const login = async (token, role) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
      const success = await fetchUserInfo(token);
      if (success) {
        message.success('Successfully signed in!');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        throw new Error('Failed to get user information');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      message.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/signin');
  };

  const checkIsAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkIsAuthenticated,
    isAuthenticated: !!user
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};