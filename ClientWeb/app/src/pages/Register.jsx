import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { message } from 'antd';

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    address: '',
    phone: '',
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    console.log(`Updating ${e.target.id} field with value:`, e.target.value);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/SignIn');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = () => {
    console.log(`Validating step ${currentStep}`);
    switch (currentStep) {
      case 1:
        if (!formData.firstName || !formData.surname) {
          console.log('Step 1 validation failed: missing personal information');
          message.warning('Please fill in all personal information fields');
          return false;
        }
        console.log('Step 1 validation passed');
        return true;
      case 2:
        if (!formData.address || !formData.phone) {
          console.log('Step 2 validation failed: missing contact information');
          message.warning('Please fill in all contact information fields');
          return false;
        }
        console.log('Step 2 validation passed');
        return true;
      case 3:
        if (!formData.username || !formData.password) {
          console.log('Step 3 validation failed: missing account information');
          message.warning('Please fill in all account information fields');
          return false;
        }
        console.log('Step 3 validation passed');
        return true;
      default:
        console.log('Invalid step number for validation');
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      console.log(`Moving to step ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting form submission');

    if (!validateStep()) {
      console.log('Final validation failed, aborting submission');
      return;
    }

    setIsLoading(true);
    console.log('Setting loading state');

    try {
      const requestData = {
        name: `${formData.firstName} ${formData.surname}`.trim(),
        username: formData.username,
        password: formData.password,
        address: formData.address,
        phone: formData.phone,
      };

      console.log('Preparing to send registration request with data:', {
        ...requestData,
        password: '[REDACTED]'
      });

      try {
        const healthCheck = await fetch('http://localhost:3002/health');
        if (!healthCheck.ok) {
          throw new Error('Server health check failed');
        }
      } catch (error) {
        console.error('Server health check failed:', error);
        message.error('Cannot connect to server. Please ensure the server is running.');
        return;
      }

      // Proceed with registration
      const response = await fetch('http://localhost:3002/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Storing token and role in localStorage');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      console.log('Showing success message');
      message.success('Registration successful!');

      console.log('Navigating to SignIn page');
      navigate('/SignIn');
    } catch (err) {
      console.error('Detailed registration error:', {
        message: err.message,
        stack: err.stack,
        type: err.constructor.name
      });
      
      if (err.message.includes('Failed to fetch')) {
        message.error('Cannot connect to server. Please ensure the server is running.');
      } else if (err.message.includes('Unexpected token')) {
        message.error('Server returned invalid response. Please check server logs.');
      } else {
        message.error(err.message || 'Registration failed');
      }
    } finally {
      console.log('Resetting loading state');
      setIsLoading(false);
    }
};

  const renderStep = () => {
    console.log(`Rendering step ${currentStep}`);
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 w-full">
            <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4">
              <label className="text-text-disabled dark:text-text-disabled self-center" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                         text-text-dark dark:text-text-light placeholder-text-disabled
                         border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
              />

              <label className="text-text-disabled dark:text-text-disabled self-center" htmlFor="surname">
                Surname
              </label>
              <input
                id="surname"
                type="text"
                value={formData.surname}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                         text-text-dark dark:text-text-light placeholder-text-disabled
                         border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 w-full">
            <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4">
              <label className="text-text-disabled dark:text-text-disabled self-start pt-3" htmlFor="address">
                Address
              </label>
              <textarea
                id="address"
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                         text-text-dark dark:text-text-light placeholder-text-disabled
                         border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
              />

              <label className="text-text-disabled dark:text-text-disabled self-center" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                         text-text-dark dark:text-text-light placeholder-text-disabled
                         border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 w-full">
            <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4">
              <label className="text-text-disabled dark:text-text-disabled self-center" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                         text-text-dark dark:text-text-light placeholder-text-disabled
                         border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
              />

              <label className="text-text-disabled dark:text-text-disabled self-center" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-background-secondary-dark rounded-md
                           text-text-dark dark:text-text-light placeholder-text-disabled
                           border-none focus:outline-none focus:ring-2 focus:ring-primary-100
                           pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 
                           text-text-disabled hover:text-text-dark dark:hover:text-text-light 
                           transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        console.log('Invalid step number for rendering');
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 transition-colors duration-300">
      <div className="w-full max-w-xl">
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-text-dark dark:text-text-light text-4xl font-bold text-center">
            Register
          </h1>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="grid grid-cols-3 mb-2">
              <span className={`text-sm text-left ${currentStep >= 1 ? 'text-primary-100' : 'text-text-disabled'}`}>
                Personal Info
              </span>
              <span className={`text-sm text-center ${currentStep >= 2 ? 'text-primary-100' : 'text-text-disabled'}`}>
                Contact
              </span>
              <span className={`text-sm text-right ${currentStep >= 3 ? 'text-primary-100' : 'text-text-disabled'}`}>
                Account
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div
                className="h-full bg-primary-100 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="min-h-[280px]">
              {renderStep()}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="flex items-center px-6 py-2 bg-white dark:bg-background-secondary-dark 
                         text-text-dark dark:text-text-light rounded-md border border-gray-200 dark:border-gray-700
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         focus:outline-none transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 1 ? 'Back to Login' : 'Previous'}
              </button>

              <button
                type={currentStep === 3 ? "submit" : "button"}
                onClick={currentStep === 3 ? undefined : handleNext}
                disabled={isLoading}
                className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
                         hover:bg-primary-hover active:bg-primary-active
                         focus:outline-none transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {currentStep === 3 ? 'Submit' : 'Next'}
                    {currentStep !== 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;