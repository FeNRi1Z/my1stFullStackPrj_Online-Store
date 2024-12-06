import { ArrowLeft, ArrowRight, Store, Loader2 } from "lucide-react";

/**
 * CheckoutNavigationButton component
 * serve for navigating through each step of form.
 */

export const CheckoutNavigationButton = ({
  currentStep,
  isLoading,
  onBack,
  onNext,
}) => {
  if (currentStep === 3) {
    return null;
  }

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={onBack}
        className="flex items-center px-6 py-2 bg-white dark:bg-background-secondary-dark 
          text-text-dark dark:text-text-light rounded-md 
          border border-gray-200 dark:border-gray-700
          hover:bg-gray-100 dark:hover:bg-gray-700
          focus:outline-none transition-colors"
        disabled={isLoading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {currentStep === 1 ? "Cancel" : "Previous"}
      </button>
      <button
        onClick={onNext}
        className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
          hover:bg-primary-hover active:bg-primary-active
          focus:outline-none transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <>
            {currentStep === 2 ? "Place Order" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </button>
    </div>
  );
};
