import { useState } from 'react';
import { App } from 'antd';
import { useCart } from '../../components/cart/CartProvider';
import config from '../../config';
/**
 * Custom hook for handle order submission and validation
 * @returns {Object} Order submission utilities and state
 */
export const useOrderSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const { cartItems, clearCart } = useCart();
  const { message } = App.useApp();
  /**
     * Validates order data before submission
     * @param {Object} userData - User's contact information
     * @param {string} paymentMethod - Selected payment method
     * @returns {boolean} Validation result
     */
  const validateOrder = (userData, paymentMethod) => {
    if (!paymentMethod) {
      message.warning("Please select a payment method");
      return false;
    }

    if (!userData.address?.trim()) {
      message.warning("Please provide a delivery address");
      return false;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(userData.phone)) {
      message.warning("Please provide a valid 10-digit phone number starting with 0");
      return false;
    }

    const validItems = cartItems.filter((item) => item.maxQuantity >= item.quantity);
    if (validItems.length === 0) {
      message.warning("All items in the cart are out of stock");
      return false;
    }

    return true;
  };

  const submitOrder = async (userData, paymentMethod, setCurrentStep) => {
    if (!validateOrder(userData, paymentMethod)) {
      return false;
    }

    setIsLoading(true);
    try {
      const validItems = cartItems.filter((item) => item.maxQuantity >= item.quantity);
      const response = await fetch(`${config.apiPath}/order/orderCreate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          address: userData.address,
          phone: userData.phone,
          paymentMethod: paymentMethod,
          orderItems: validItems.map((item) => ({
            productId: parseInt(item.id),
            quantity: parseInt(item.quantity),
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await clearCart();
        setOrderData(data.newOrder);
        setCurrentStep(3);
        message.success("Order created successfully!");
        return true;
      } else {
        throw new Error(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      message.error(error.message || "Failed to create order");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const validItems = cartItems.filter((item) => item.maxQuantity >= item.quantity);
    return validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return {
    isLoading,
    orderData,
    submitOrder,
    calculateTotal,
    cartItems
  };
};