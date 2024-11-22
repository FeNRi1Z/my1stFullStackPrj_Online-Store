import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    address: '',
    phone: '',
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
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

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Concatenate firstName and surname with a space
    const fullFormData = {
      ...formData,
      name: `${formData.firstName} ${formData.surname}`.trim()
    };
    console.log(fullFormData);
  };

  const renderStep = () => {
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

            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center px-6 py-2 bg-white dark:bg-background-secondary-dark 
                         text-text-dark dark:text-text-light rounded-md border border-gray-200 dark:border-gray-700
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         focus:outline-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 1 ? 'Back to Login' : 'Previous'}
              </button>

              <button
                type={currentStep === 3 ? "submit" : "button"}
                onClick={currentStep === 3 ? undefined : handleNext}
                className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
                         hover:bg-primary-hover active:bg-primary-active
                         focus:outline-none transition-colors"
              >
                {currentStep === 3 ? 'Submit' : 'Next'}
                {currentStep !== 3 && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;