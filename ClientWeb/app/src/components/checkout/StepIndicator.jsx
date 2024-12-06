// components/checkout/StepIndicator.jsx
import React from 'react';

export const StepIndicator = ({ currentStep }) => {
  // Define steps array with id and label
  const steps = [
    { id: 1, label: 'Confirm Items' },
    { id: 2, label: 'Payment' },
    { id: 3, label: 'Complete' }
  ];
  
  // Calculate progress width based on current step (0%, 50%, or 100%)
  const getProgressWidth = (step) => {
    if (step <= 1) return '0%';
    if (step === 2) return '50%';
    if (step >= 3) return '100%';
    return '0%';
  };

  return (
    <div className="px-8 pt-8 pb-6">
      <h1 className="text-text-dark dark:text-text-light text-4xl font-bold text-center">
        Checkout
      </h1>
      <div className="mt-6">
        <div className="grid grid-cols-3 mb-3">
          {steps.map((step) => (
            <span
              key={step.id}
              className={`text-sm ${
                step.id === 1 
                  ? 'text-left' 
                  : step.id === 3 
                    ? 'text-right' 
                    : 'text-center'
              } ${
                step.id <= currentStep 
                  ? "text-primary-100" 
                  : "text-text-disabled"
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
          <div
            className="h-full bg-primary-100 rounded-full transition-all duration-300"
            style={{ width: getProgressWidth(currentStep) }}
          />
        </div>
      </div>
    </div>
  );
};