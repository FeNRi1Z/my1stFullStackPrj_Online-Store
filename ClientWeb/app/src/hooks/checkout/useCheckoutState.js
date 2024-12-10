import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Custom hook for checkout flow state and navigation
 * @returns {Object} Checkout state and handlers
 */
export const useCheckoutState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  // Handle navigate
  const handleNavigation = {
    toStore: () => navigate("/store"),
    toOrders: () => navigate("/orders"),
    back: () => {
      if (currentStep === 1) {
        const previousURL = localStorage.getItem("previousURL") || "/";
        navigate(previousURL);
      } else {
        setCurrentStep((prev) => prev - 1);
      }
    }
  };
  // Handle UI state
  const handleNav = {
    openSideNav: () => setIsSideNavOpen(true),
    closeSideNav: () => setIsSideNavOpen(false),
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
  };

  return {
    currentStep,
    isSideNavOpen,
    isCartOpen,
    setCurrentStep,
    handleNavigation,
    handleNav,
  };
};