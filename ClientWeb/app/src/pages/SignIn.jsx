import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { message } from 'antd';
import { useAuth } from '../components/AuthProvider';
import config from '../config';

function SignIn() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      message.warning('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(config.apiPath + '/user/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      // Handle both admin and client responses
      const token = data.token;
      const role = data.role || 'client'; // Default to client if role not specified

      await login(token, role);
      
      // Clear form data after successful sign in
      setFormData({
        username: '',
        password: ''
      });

    } catch (err) {
      console.error('Sign in error:', err);
      message.error(err.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same
  return (
    <div className="h-screen flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <div className="space-y-1">
            <h3 className="text-text-disabled dark:text-text-disabled text-lg text-center">
              It's time to learn
            </h3>
            <h1 className="text-text-dark dark:text-text-light text-4xl font-bold text-center">
              Welcome to Mod-ed!
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
          {/* Username Input */}
          <div className="w-80">
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                       text-text-dark dark:text-text-light placeholder-text-disabled
                       border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Password Input */}
          <div className="relative w-80">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                       text-text-dark dark:text-text-light placeholder-text-disabled
                       border-none focus:outline-none focus:ring-2 focus:ring-primary-100
                       pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-disabled
                       hover:text-text-dark dark:hover:text-text-light transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6 w-80">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-100 text-white py-3 px-4 rounded-md 
                       hover:bg-primary-hover active:bg-primary-active 
                       focus:outline-none transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
            <button
              type="button"
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-white dark:bg-background-secondary-dark 
                       text-text-dark dark:text-text-light 
                       py-3 px-4 rounded-md 
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       focus:outline-none transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm text-text-disabled hover:text-text-dark 
                       dark:hover:text-text-light transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;