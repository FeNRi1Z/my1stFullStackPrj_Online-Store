import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { Eye, EyeOff } from 'lucide-react';

function SignIn() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <div className="space">
            <h3 className="text-text-disabled dark:text-text-disabled text-lg">
              It's time to learn
            </h3>
            <h1 className="text-text-dark dark:text-text-light text-4xl font-bold">
              Welcome to Mod-ed!
            </h1>
          </div>
        </div>

        <form className="space-y-4 flex flex-col items-center">
          <div>
            <input
              id="username"
              type="text"
              className="w-80 px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                         text-text-dark dark:text-text-light placeholder-text-disabled
                         border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Username"
            />
          </div>

          <div className="relative w-80">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                         text-text-dark dark:text-text-light placeholder-text-disabled
                         border-none focus:outline-none focus:ring-2 focus:ring-primary-100
                         pr-12"
              placeholder="Password"
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

          <div className="flex space-x-4 mt-6 w-80">
            <button
              type="submit"
              className="w-full bg-primary-100 text-white py-3 px-4 rounded-md 
                         hover:bg-primary-hover active:bg-primary-active 
                         focus:outline-none transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-white dark:bg-background-secondary-dark 
                         text-text-dark dark:text-text-light 
                         py-3 px-4 rounded-md 
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         focus:outline-none transition-colors"
            >
              Register
            </button>
          </div>

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