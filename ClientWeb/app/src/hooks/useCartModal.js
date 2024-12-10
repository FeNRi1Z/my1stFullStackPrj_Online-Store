import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage cart modal state and functionality
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Array} [props.cartItems=[]] - Array of items in cart
 * @returns {Object} Modal state and handler functions
 */
export const useCartModal = ({
  isOpen,
  onClose,
  cartItems = []
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  /* Trigger entrance animation when modal opens */
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    // Cleanup resize listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    // Delay actual close to allow exit animation to complete
    setTimeout(onClose, 300);
  }, [onClose]);

  /* Filter items based on name or author matching search query */
  const filteredItems = cartItems?.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.author?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return {
    windowWidth,
    searchQuery,
    setSearchQuery,
    isAnimating,
    handleClose,
    filteredItems
  };
};