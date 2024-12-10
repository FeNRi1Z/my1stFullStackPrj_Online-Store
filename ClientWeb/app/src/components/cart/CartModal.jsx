import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";
import { useCart } from "./CartProvider";

// Component imports
import CartHeader from "./CartHeader";
import CartSearch from "./CartSearch";
import CartContent from "./CartContent";
import CartFooter from "./CartFooter";

// Utils and hooks
import { useModalAnimation } from "../../hooks/useModalAnimation";
import useModalSearch from "../../hooks/useModalSearch.js";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { getThemeConfig } from "./utils/themeConfig";

/**
 * CartModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {function} props.onClose - Callback function to close the modal
 */

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { cartItems, cartCount, loading } = useCart();
  const { searchQuery, setSearchQuery } = useModalSearch("");
  const { isAnimating, handleClose } = useModalAnimation(isOpen, onClose);
  const { windowWidth } = useWindowDimensions();

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Exit early if modal is not open and not animating
  if (!isOpen && !isAnimating) return null;

  // Handle checkout navigation
  const handleCheckout = () => {
    // Store current URL for back navigation
    const currentURL = window.location.pathname + window.location.search;
    localStorage.setItem("previousURL", currentURL);
    handleClose();
    navigate("/checkout");
  };

  // Get theme configuration
  const themeConfig = getThemeConfig(theme);

  return (
    <ConfigProvider theme={themeConfig}>
      {/* Modal Container */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm transition-opacity 
          duration-300 ease-in-out z-[98]
          ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 backdrop-blur-sm bg-black transition-opacity 
            duration-300 ease-in-out
            ${isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'}`}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          className="flex items-center justify-center min-h-screen p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-modal-title"
        >
          <div
            className={`relative w-full max-w-4xl rounded-lg shadow-xl
              bg-white dark:bg-background-secondary-dark
              transition-all duration-300 transform
              ${isAnimating ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-4 opacity-0 scale-95'}`}
            style={{ maxHeight: '90vh' }}
          >
            {/* Modal Header */}
            <CartHeader
              cartCount={cartCount}
              onClose={handleClose}
              isAnimating={isAnimating}
            />

            {/* Search Bar */}
            <CartSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isAnimating={isAnimating}
            />

            {/* Cart Items Content */}
            <CartContent
              items={cartItems}
              loading={loading}
              searchQuery={searchQuery}
              windowWidth={windowWidth}
              isAnimating={isAnimating}
              onClose={handleClose}
              navigate={navigate}
            />

            {/* Cart Footer with Total and Checkout */}
            {cartItems.length > 0 && (
              <CartFooter
                items={cartItems}
                isAnimating={isAnimating}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

// PropTypes validation
CartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CartModal;